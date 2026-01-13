import { useState, useEffect, useCallback } from 'react';

export interface Cnae {
  code: string;
  description: string;
}

interface UseBuscaEmpresasReturn {
  cnaes: Cnae[];
  isLoading: boolean;
  error: string | null;
  searchCnaes: (query: string, selectedCodes: string[]) => Cnae[];
}

const API_URL = 'https://artgenial-api.onrender.com/cnaes';

export function useBuscaEmpresas(): UseBuscaEmpresasReturn {
  const [cnaes, setCnaes] = useState<Cnae[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCnaes = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(API_URL);
        
        if (!response.ok) {
          throw new Error(`Erro ao buscar CNAEs: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Normalize data format - adjust based on actual API response structure
        const normalizedCnaes: Cnae[] = Array.isArray(data) 
          ? data.map((item: any) => ({
              code: item.code || item.codigo || '',
              description: item.description || item.descricao || item.nome || '',
            }))
          : [];
        
        setCnaes(normalizedCnaes);
      } catch (err) {
        console.error('Erro ao buscar CNAEs:', err);
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
        
        // Fallback to mock data if API fails
        setCnaes([
          { code: '8630-5/04', description: 'Atividade Odontológica' },
          { code: '5611-2/01', description: 'Restaurantes e similares' },
          { code: '6911-7/01', description: 'Serviços advocatícios' },
          { code: '8630-5/01', description: 'Atividade médica ambulatorial com recursos para realização de procedimentos cirúrgicos' },
          { code: '4781-4/00', description: 'Comércio varejista de artigos do vestuário e acessórios' },
          { code: '4712-1/00', description: 'Comércio varejista de mercadorias em geral, com predominância de produtos alimentícios' },
          { code: '9602-5/01', description: 'Cabeleireiros, manicure e pedicure' },
          { code: '4520-0/01', description: 'Serviços de manutenção e reparação mecânica de veículos automotores' },
          { code: '4771-7/01', description: 'Comércio varejista de produtos farmacêuticos, sem manipulação de fórmulas' },
          { code: '8511-2/00', description: 'Educação infantil - creche' },
          { code: '5620-1/01', description: 'Fornecimento de alimentos preparados preponderantemente para empresas' },
          { code: '6399-2/00', description: 'Outras atividades de prestação de serviços de informação' },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCnaes();
  }, []);

  const searchCnaes = useCallback((query: string, selectedCodes: string[]): Cnae[] => {
    if (!query.trim()) return [];
    
    const lowerQuery = query.toLowerCase();
    
    return cnaes.filter(
      (cnae) =>
        (cnae.description.toLowerCase().includes(lowerQuery) ||
          cnae.code.includes(query)) &&
        !selectedCodes.includes(cnae.code)
    );
  }, [cnaes]);

  return {
    cnaes,
    isLoading,
    error,
    searchCnaes,
  };
}
