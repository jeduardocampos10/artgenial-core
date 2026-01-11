import { useState, useRef, useEffect } from 'react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, X, Building2 } from 'lucide-react';

// Mock CNAE data for autocomplete
const cnaeData = [
  { code: '8630-5/04', description: 'Atividade Odontológica' },
  { code: '5611-2/01', description: 'Restaurantes e similares' },
  { code: '6911-7/01', description: 'Serviços advocatícios' },
  { code: '8630-5/01', description: 'Atividade médica ambulatorial com recursos para realização de procedimentos cirúrgicos' },
  { code: '4781-4/00', description: 'Comércio varejista de artigos do vestuário e acessórios' },
  { code: '4712-1/00', description: 'Comércio varejista de mercadorias em geral, com predominância de produtos alimentícios - minimercados, mercearias e armazéns' },
  { code: '9602-5/01', description: 'Cabeleireiros, manicure e pedicure' },
  { code: '4520-0/01', description: 'Serviços de manutenção e reparação mecânica de veículos automotores' },
  { code: '4771-7/01', description: 'Comércio varejista de produtos farmacêuticos, sem manipulação de fórmulas' },
  { code: '8511-2/00', description: 'Educação infantil - creche' },
  { code: '5620-1/01', description: 'Fornecimento de alimentos preparados preponderantemente para empresas' },
  { code: '6399-2/00', description: 'Outras atividades de prestação de serviços de informação não especificadas anteriormente' },
];

const estados = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

interface SelectedCnae {
  code: string;
  description: string;
}

export default function PesquisaPage() {
  const [searchValue, setSearchValue] = useState('');
  const [selectedCnaes, setSelectedCnaes] = useState<SelectedCnae[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [estado, setEstado] = useState<string>('');
  const [cidade, setCidade] = useState('');
  const [situacao, setSituacao] = useState<string>('ativa');
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Filter suggestions based on input
  const filteredSuggestions = cnaeData.filter(
    (cnae) =>
      (cnae.description.toLowerCase().includes(searchValue.toLowerCase()) ||
        cnae.code.includes(searchValue)) &&
      !selectedCnaes.find((s) => s.code === cnae.code)
  );

  // Handle clicking outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectCnae = (cnae: SelectedCnae) => {
    setSelectedCnaes([...selectedCnaes, cnae]);
    setSearchValue('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleRemoveCnae = (code: string) => {
    setSelectedCnaes(selectedCnaes.filter((c) => c.code !== code));
  };

  const handleSearch = () => {
    console.log('Searching with:', {
      cnaes: selectedCnaes,
      estado,
      cidade,
      situacao,
    });
    // Here would go the actual search logic
  };

  return (
    <DashboardLayout>
      <div className="flex-1 p-6 md:p-8 overflow-auto">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-blue-600 mb-6">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Encontre Novos Clientes
          </h1>
          <p className="text-lg text-muted-foreground">
            Utilize nossa base com <span className="font-semibold text-foreground">26 milhões</span> de empresas.
          </p>
        </div>

        {/* Search Component */}
        <div className="max-w-3xl mx-auto">
          <div className="relative mb-6">
            {/* Main Search Input */}
            <div className="relative flex items-center gap-2 p-3 rounded-xl border border-border bg-card shadow-sm focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
              <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              
              {/* Selected Tags */}
              <div className="flex flex-wrap gap-2 flex-1">
                {selectedCnaes.map((cnae) => (
                  <Badge
                    key={cnae.code}
                    variant="secondary"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary border-0 text-sm"
                  >
                    <span className="truncate max-w-[200px]">
                      {cnae.description} <span className="text-xs opacity-70">{cnae.code}</span>
                    </span>
                    <button
                      onClick={() => handleRemoveCnae(cnae.code)}
                      className="ml-1 hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </Badge>
                ))}
                
                <input
                  ref={inputRef}
                  type="text"
                  value={searchValue}
                  onChange={(e) => {
                    setSearchValue(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder={
                    selectedCnaes.length === 0
                      ? 'Digite o ramo de atividade (ex: Dentista, Restaurante, Advogado)...'
                      : 'Adicionar mais...'
                  }
                  className="flex-1 min-w-[200px] bg-transparent border-0 outline-none text-foreground placeholder:text-muted-foreground text-sm"
                />
              </div>
            </div>

            {/* Autocomplete Suggestions */}
            {showSuggestions && searchValue.length > 0 && filteredSuggestions.length > 0 && (
              <div
                ref={suggestionsRef}
                className="absolute z-50 w-full mt-2 py-2 rounded-xl border border-border bg-popover shadow-lg max-h-64 overflow-auto"
              >
                {filteredSuggestions.map((cnae) => (
                  <button
                    key={cnae.code}
                    onClick={() => handleSelectCnae(cnae)}
                    className="w-full px-4 py-3 text-left hover:bg-muted/50 transition-colors flex items-center justify-between group"
                  >
                    <span className="text-sm text-foreground">{cnae.description}</span>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      {cnae.code}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Filters Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <Select value={estado} onValueChange={setEstado}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Estado (UF)" />
              </SelectTrigger>
              <SelectContent>
                {estados.map((uf) => (
                  <SelectItem key={uf} value={uf}>
                    {uf}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
              placeholder="Cidade"
              className="h-12"
            />

            <Select value={situacao} onValueChange={setSituacao}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Situação Cadastral" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ativa">Ativa</SelectItem>
                <SelectItem value="todas">Todas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Action Button */}
          <div className="flex justify-center">
            <Button
              onClick={handleSearch}
              size="lg"
              className="px-8 h-12 text-base bg-gradient-to-r from-violet-500 to-blue-600 hover:from-violet-600 hover:to-blue-700 shadow-lg shadow-violet-500/25"
            >
              <Search className="w-5 h-5 mr-2" />
              Buscar Leads
            </Button>
          </div>

          {/* Helper Text */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            Dica: Você pode selecionar múltiplos ramos de atividade para uma busca mais ampla.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
