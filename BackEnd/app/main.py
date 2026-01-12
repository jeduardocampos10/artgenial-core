import os
import clickhouse_connect
from fastapi import FastAPI, HTTPException, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from pydantic import BaseModel
from typing import List, Optional
from dotenv import load_dotenv

# 1. Carrega variáveis de ambiente
# Nota: No Render, as variáveis são configuradas no painel deles, não no arquivo .env
load_dotenv()

app = FastAPI(
    title="ArtGenial API", 
    version="2.0.0",
    docs_url=None, # 🔒 ESCONDE a documentação automática em produção (opcional)
    redoc_url=None
)

# 2. MASCARAMENTO E SEGURANÇA (Camada Render) 🛡️

# A. Remove o cabeçalho 'Server' para não revelar que é Python/Uvicorn
@app.middleware("http")
async def remove_server_header(request: Request, call_next):
    response = await call_next(request)
    response.headers["Server"] = "ArtGenial-Secure-Gateway" 
    return response

# B. Trusted Host: Garante que só acessam pelo domínio correto (Evita Host Header Injection)
# O "*" libera tudo agora para testes, mas no futuro colocaremos "seusite.com"
app.add_middleware(
    TrustedHostMiddleware, 
    allowed_hosts=["*"] 
)

# C. CORS (Quem pode chamar a API?)
origins = os.getenv("ALLOWED_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET"], # Só leitura permitida
    allow_headers=["*"],
)

# 3. Conexão com o Banco (A Mesma Lógica Robusta)
def get_db_client():
    try:
        return clickhouse_connect.get_client(
            host=os.getenv("DB_HOST"),
            port=int(os.getenv("DB_PORT")),
            username=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            secure=False,
            verify=False,
            connect_timeout=10
        )
    except Exception as e:
        print(f"🚨 ERRO CRÍTICO DE CONEXÃO: {e}")
        # Nunca devolva o erro técnico exato para o usuário
        raise HTTPException(status_code=500, detail="Serviço indisponível temporariamente.")

# --- MODELOS ---
class EmpresaResponse(BaseModel):
    razao_social: str
    nome_fantasia: Optional[str] = None
    cnpj: str
    cidade: str
    uf: str
    bairro: Optional[str] = None
    atividade: str
    situacao: str
    telefone: Optional[str] = None
    email: Optional[str] = None

class CnaeResponse(BaseModel):
    codigo: str
    descricao: str

# --- ROTAS ---

@app.get("/")
def health_check():
    # Resposta genérica para não dar pistas
    return {"status": "active"} 

@app.get("/cnaes", response_model=List[CnaeResponse])
def buscar_cnaes(q: str = Query(..., min_length=3)):
    client = get_db_client()
    # SQL INJECTION PROTECTION: O uso de %(termo)s blinda a query
    query = """
    SELECT codigo, descricao 
    FROM cnaes 
    WHERE descricao ILIKE %(termo)s 
    LIMIT 20
    """
    result = client.query(query, parameters={'termo': f'%{q}%'})
    return [{"codigo": row[0], "descricao": row[1]} for row in result.result_rows]

@app.get("/empresas", response_model=List[EmpresaResponse])
def buscar_empresas(
    cnae: Optional[str] = None,
    cidade: Optional[str] = None,
    uf: Optional[str] = None,
    bairro: Optional[str] = None,
    termo: Optional[str] = None,
    pagina: int = 1
):
    client = get_db_client()
    limit = 50
    offset = (pagina - 1) * limit
    
    conditions = ["est.situacao_cadastral = '02'"]
    params = {}

    if uf:
        conditions.append("est.uf = %(uf)s")
        params['uf'] = uf.upper()
    
    if bairro:
        conditions.append("est.bairro = %(bairro)s")
        params['bairro'] = bairro.upper()

    if cnae:
        conditions.append("est.cnae_fiscal_principal = %(cnae)s")
        params['cnae'] = cnae
        
    if cidade:
        conditions.append("mun.descricao ILIKE %(cidade)s")
        params['cidade'] = f"%{cidade}%"

    if termo:
        conditions.append("(est.nome_fantasia ILIKE %(termo)s OR emp.razao_social ILIKE %(termo)s)")
        params['termo'] = f"%{termo}%"

    where_clause = " AND ".join(conditions)
    
    sql = f"""
    SELECT 
        emp.razao_social,
        est.nome_fantasia,
        concat(est.cnpj_basico, est.cnpj_ordem, est.cnpj_dv) as cnpj_completo,
        mun.descricao as cidade_nome,
        est.uf,
        est.bairro,
        c.descricao as cnae_desc,
        est.situacao_cadastral,
        concat('(', toString(est.ddd_1), ') ', toString(est.telefone_1)) as telefone_formatado,
        est.correio_eletronico as email
    FROM estabelecimentos as est
    INNER JOIN empresas as emp ON est.cnpj_basico = emp.cnpj_basico
    LEFT JOIN municipios as mun ON est.municipio = mun.codigo
    LEFT JOIN cnaes as c ON est.cnae_fiscal_principal = c.codigo
    WHERE {where_clause}
    LIMIT {limit} OFFSET {offset}
    """
    
    try:
        result = client.query(sql, parameters=params)
        
        lista_empresas = []
        for row in result.result_rows:
            fone = row[8]
            if fone == "() " or fone == "()": fone = "Não informado"

            lista_empresas.append({
                "razao_social": row[0],
                "nome_fantasia": row[1] if row[1] else row[0],
                "cnpj": row[2],
                "cidade": row[3] if row[3] else "Desconhecida",
                "uf": row[4],
                "bairro": row[5],
                "atividade": row[6] if row[6] else "Geral",
                "situacao": "Ativa",
                "telefone": fone,
                "email": row[9]
            })
        return lista_empresas

    except Exception as e:
        print(f"Erro interno logado: {e}")
        raise HTTPException(status_code=500, detail="Erro interno.")

if __name__ == "__main__":
    import uvicorn
    # Apenas para teste local. No Render, o comando de start será outro.
    uvicorn.run(app, host="0.0.0.0", port=8000)