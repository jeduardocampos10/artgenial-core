import os
import re # Importamos o Regex para limpar os números
import clickhouse_connect
from fastapi import FastAPI, HTTPException, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from pydantic import BaseModel
from typing import List, Optional
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="ArtGenial API", 
    version="2.1.0", # Versão atualizada com suporte a Multi-CNAE
    docs_url=None,
    redoc_url=None
)

# --- SEGURANÇA E MIDDLEWARES ---
@app.middleware("http")
async def remove_server_header(request: Request, call_next):
    response = await call_next(request)
    response.headers["Server"] = "ArtGenial-Secure-Gateway" 
    return response

app.add_middleware(TrustedHostMiddleware, allowed_hosts=["*"])

origins = os.getenv("ALLOWED_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET"],
    allow_headers=["*"],
)

# --- CONEXÃO COM O BANCO ---
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
    return {"status": "active", "mode": "production"} 

@app.get("/cnaes", response_model=List[CnaeResponse])
def buscar_cnaes(q: str = Query(..., min_length=3)):
    client = get_db_client()
    # Busca CNAE pelo nome (descrição)
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
    # AGORA ACEITA UMA LISTA DE CNAES (ex: ?cnaes=123&cnaes=456)
    cnaes: Optional[List[str]] = Query(None), 
    cidade: Optional[str] = None,
    uf: Optional[str] = None,
    bairro: Optional[str] = None,
    termo: Optional[str] = None,
    pagina: int = 1
):
    client = get_db_client()
    limit = 50
    offset = (pagina - 1) * limit
    
    # Começa filtrando apenas empresas ATIVAS
    conditions = ["est.situacao_cadastral = '02'"]
    params = {}

    # 1. TRATAMENTO INTELIGENTE DOS CNAES
    if cnaes:
        # Limpa cada CNAE da lista (remove traço, barra, ponto)
        lista_limpa = [re.sub(r'\D', '', c) for c in cnaes]
        # Remove vazios
        lista_limpa = [c for c in lista_limpa if c]
        
        if lista_limpa:
            # Usa o operador IN para buscar QUALQUER um dos selecionados
            conditions.append("est.cnae_fiscal_principal IN %(cnaes_lista)s")
            params['cnaes_lista'] = lista_limpa

    if uf:
        conditions.append("est.uf = %(uf)s")
        params['uf'] = uf.upper()
    
    if bairro:
        conditions.append("est.bairro ILIKE %(bairro)s")
        params['bairro'] = f"%{bairro}%"
        
    if cidade:
        conditions.append("mun.descricao ILIKE %(cidade)s")
        params['cidade'] = f"%{cidade}%"

    if termo:
        conditions.append("(est.nome_fantasia ILIKE %(termo)s OR emp.razao_social ILIKE %(termo)s)")
        params['termo'] = f"%{termo}%"

    where_clause = " AND ".join(conditions)
    
    # Query Otimizada
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
            # Formatação visual do telefone
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
        raise HTTPException(status_code=500, detail="Erro ao processar busca.")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)