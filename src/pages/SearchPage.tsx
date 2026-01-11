import { useState, useRef, useEffect } from 'react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { LeadCard } from '@/components/LeadCard';
import { LeadDetailsModal } from '@/components/LeadDetailsModal';
import { UpgradeModal } from '@/components/UpgradeModal';
import { SkeletonLoader } from '@/components/SkeletonLoader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Lead, PlanType } from '@/types';
import { 
  Search, 
  X, 
  RefreshCw, 
  Download,
  MessageCircle,
  Mail,
  MapPin,
  FileSpreadsheet,
  Lock,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// Mock CNAE data for autocomplete
const CNAE_OPTIONS = [
  { code: '8630-5/04', label: 'Atividade Odontológica' },
  { code: '3250-7/06', label: 'Serviços de Prótese Dentária' },
  { code: '6911-7/01', label: 'Advocacia Geral' },
  { code: '6920-6/01', label: 'Atividades de Contabilidade' },
  { code: '4781-4/00', label: 'Comércio Varejista de Artigos do Vestuário' },
  { code: '5611-2/01', label: 'Restaurantes e Similares' },
  { code: '4771-7/01', label: 'Comércio Varejista de Produtos Farmacêuticos' },
  { code: '8630-5/03', label: 'Atividade Médica Ambulatorial' },
  { code: '9602-5/01', label: 'Cabeleireiros, Manicure e Pedicure' },
  { code: '4530-7/03', label: 'Comércio de Peças e Acessórios Automotivos' },
];

// Mock data
const mockLeads: Lead[] = [
  {
    id: '1',
    cnpj: '12.345.678/0001-90',
    razaoSocial: 'Tech Solutions Ltda',
    nomeFantasia: 'TechSol',
    tipo: 'LTDA',
    cidade: 'São Paulo',
    uf: 'SP',
    bairro: 'Pinheiros',
    capitalSocial: 500000,
    hasWhatsApp: true,
    hasEmail: true,
    whatsapp: '(11) 99999-8888',
    email: 'contato@techsol.com.br',
  },
  {
    id: '2',
    cnpj: '23.456.789/0001-01',
    razaoSocial: 'Comércio Digital ME',
    nomeFantasia: 'DigiCom',
    tipo: 'ME',
    cidade: 'Rio de Janeiro',
    uf: 'RJ',
    bairro: 'Copacabana',
    capitalSocial: 100000,
    hasWhatsApp: true,
    hasEmail: false,
    whatsapp: '(21) 98888-7777',
  },
  {
    id: '3',
    cnpj: '34.567.890/0001-12',
    razaoSocial: 'Consultoria Premium S.A.',
    nomeFantasia: 'ConsultPro',
    tipo: 'SA',
    cidade: 'Curitiba',
    uf: 'PR',
    bairro: 'Batel',
    capitalSocial: 2000000,
    hasWhatsApp: false,
    hasEmail: true,
    email: 'financeiro@consultpro.com.br',
  },
  {
    id: '4',
    cnpj: '45.678.901/0001-23',
    razaoSocial: 'João da Silva MEI',
    nomeFantasia: 'JS Serviços',
    tipo: 'MEI',
    cidade: 'Belo Horizonte',
    uf: 'MG',
    bairro: 'Savassi',
    capitalSocial: 15000,
    hasWhatsApp: true,
    hasEmail: true,
    whatsapp: '(31) 97777-6666',
    email: 'joao@jsservicos.com.br',
  },
  {
    id: '5',
    cnpj: '56.789.012/0001-34',
    razaoSocial: 'Indústria Forte EPP',
    nomeFantasia: 'InduForte',
    tipo: 'EPP',
    cidade: 'Porto Alegre',
    uf: 'RS',
    bairro: 'Moinhos de Vento',
    capitalSocial: 800000,
    hasWhatsApp: true,
    hasEmail: true,
    whatsapp: '(51) 96666-5555',
    email: 'vendas@induforte.com.br',
  },
];

const UF_LIST = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

const mockUserPlan: PlanType = 'bronze';

export default function SearchPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const [upgradeFeature, setUpgradeFeature] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  
  // Smart Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isAutocompleteOpen, setIsAutocompleteOpen] = useState(false);
  const [selectedCnaes, setSelectedCnaes] = useState<typeof CNAE_OPTIONS>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Quick Filters
  const [uf, setUf] = useState('');
  const [cidade, setCidade] = useState('');
  const [situacao, setSituacao] = useState('ativas');

  // Filter CNAE options based on search query
  const filteredCnaeOptions = CNAE_OPTIONS.filter(
    option => 
      !selectedCnaes.some(s => s.code === option.code) &&
      (option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
       option.code.includes(searchQuery))
  );

  const handleSelectCnae = (cnae: typeof CNAE_OPTIONS[0]) => {
    setSelectedCnaes(prev => [...prev, cnae]);
    setSearchQuery('');
    setIsAutocompleteOpen(false);
    inputRef.current?.focus();
  };

  const handleRemoveCnae = (code: string) => {
    setSelectedCnaes(prev => prev.filter(c => c.code !== code));
  };

  const handleSearch = async () => {
    if (selectedCnaes.length === 0) return;
    
    setIsLoading(true);
    setHasSearched(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    let filteredLeads = [...mockLeads];
    
    if (situacao === 'ativas') {
      // In real app, filter by active status
    }
    if (uf) {
      filteredLeads = filteredLeads.filter(l => l.uf === uf);
    }
    if (cidade) {
      filteredLeads = filteredLeads.filter(l => 
        l.cidade.toLowerCase().includes(cidade.toLowerCase())
      );
    }
    
    setLeads(filteredLeads);
    setIsLoading(false);
  };

  const handleClearAll = () => {
    setSelectedCnaes([]);
    setSearchQuery('');
    setUf('');
    setCidade('');
    setSituacao('ativas');
    setLeads([]);
    setHasSearched(false);
  };

  const handleViewDetails = (lead: Lead) => {
    setSelectedLead(lead);
    setIsDetailsOpen(true);
  };

  const handleLockedAction = (feature: string) => {
    setUpgradeFeature(feature);
    setIsUpgradeOpen(true);
  };

  // Close autocomplete when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setIsAutocompleteOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-6 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              Busca Inteligente
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Encontre empresas por ramo de atividade (CNAE)
            </p>
          </div>
          
          {/* Desktop Action - Sync with Sheets */}
          <div className="hidden lg:block">
            <Button 
              className="btn-corporate"
              onClick={() => handleLockedAction('Sincronização com Google Sheets')}
            >
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Sincronizar com Google Sheets
              {mockUserPlan === 'bronze' && <Lock className="w-3 h-3 ml-2" />}
            </Button>
          </div>
        </div>

        {/* HERO SEARCH COMPONENT */}
        <div className="card-elevated p-6 space-y-5">
          {/* Main Search Input with Autocomplete */}
          <div className="relative">
            <label className="block text-sm font-semibold text-foreground mb-2">
              Ramo de Atividade (CNAE)
            </label>
            
            <div 
              className={cn(
                "min-h-14 px-4 py-3 rounded-xl border-2 bg-background transition-all duration-200 flex flex-wrap items-center gap-2",
                isAutocompleteOpen ? "border-primary ring-4 ring-primary/10" : "border-border hover:border-primary/50"
              )}
            >
              {/* Selected CNAE Tags */}
              {selectedCnaes.map(cnae => (
                <Badge 
                  key={cnae.code}
                  variant="secondary"
                  className="h-8 pl-3 pr-2 gap-1.5 text-sm font-medium bg-primary/10 text-primary border-0 hover:bg-primary/20"
                >
                  {cnae.label}
                  <button
                    onClick={() => handleRemoveCnae(cnae.code)}
                    className="ml-1 hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </Badge>
              ))}
              
              {/* Search Input */}
              <div className="flex-1 min-w-[200px] relative">
                <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder={selectedCnaes.length === 0 ? "Digite o ramo (ex: Dentista, Advogado)..." : "Adicionar mais..."}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsAutocompleteOpen(true);
                  }}
                  onFocus={() => setIsAutocompleteOpen(true)}
                  className="w-full pl-7 pr-2 py-1 bg-transparent border-0 outline-none text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>

            {/* Autocomplete Dropdown */}
            {isAutocompleteOpen && searchQuery.length > 0 && filteredCnaeOptions.length > 0 && (
              <div className="absolute z-50 w-full mt-2 bg-popover border border-border rounded-xl shadow-lg overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
                <div className="p-2 border-b border-border bg-muted/30">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Sugestões de CNAE
                  </span>
                </div>
                <ul className="py-1 max-h-64 overflow-y-auto">
                  {filteredCnaeOptions.map(option => (
                    <li key={option.code}>
                      <button
                        onClick={() => handleSelectCnae(option)}
                        className="w-full px-4 py-3 text-left hover:bg-accent/50 transition-colors flex items-center justify-between group"
                      >
                        <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                          {option.label}
                        </span>
                        <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-1 rounded">
                          {option.code}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Quick Filters Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Estado (UF)
              </label>
              <Select value={uf || "all"} onValueChange={(value) => setUf(value === "all" ? "" : value)}>
                <SelectTrigger className="h-11 bg-background border-border">
                  <SelectValue placeholder="Todos os estados" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="all">Todos os estados</SelectItem>
                  {UF_LIST.map((state) => (
                    <SelectItem key={state} value={state}>{state}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Cidade
              </label>
              <Input
                placeholder="Buscar cidade..."
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                className="h-11 bg-background border-border"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Situação
              </label>
              <Select value={situacao} onValueChange={setSituacao}>
                <SelectTrigger className="h-11 bg-background border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="ativas">Apenas Ativas</SelectItem>
                  <SelectItem value="todas">Todas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end gap-2">
              <Button 
                className="btn-corporate flex-1 h-11"
                onClick={handleSearch}
                disabled={isLoading || selectedCnaes.length === 0}
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Search className="w-4 h-4 mr-2" />
                )}
                Buscar
              </Button>
              
              {(selectedCnaes.length > 0 || uf || cidade) && (
                <Button 
                  variant="outline" 
                  size="icon"
                  className="h-11 w-11 shrink-0"
                  onClick={handleClearAll}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Results Section */}
        {isLoading ? (
          <>
            {/* Mobile Skeleton */}
            <div className="lg:hidden">
              <SkeletonLoader variant="lead-card" count={3} />
            </div>
            {/* Desktop Skeleton */}
            <div className="hidden lg:block card-corporate overflow-hidden">
              <SkeletonLoader variant="table-row" count={5} />
            </div>
          </>
        ) : hasSearched && leads.length > 0 ? (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">{leads.length}</strong> empresas encontradas
              </p>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-primary"
                onClick={() => handleLockedAction('Download de leads')}
              >
                <Download className="w-4 h-4 mr-1" />
                Exportar
              </Button>
            </div>

            {/* Mobile: Lead Cards */}
            <div className="lg:hidden space-y-3">
              {leads.map((lead) => (
                <LeadCard
                  key={lead.id}
                  lead={lead}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>

            {/* Desktop: Data Table */}
            <div className="hidden lg:block card-corporate overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">CNPJ</TableHead>
                    <TableHead className="font-semibold">Razão Social</TableHead>
                    <TableHead className="font-semibold">Nome Fantasia</TableHead>
                    <TableHead className="font-semibold">Cidade</TableHead>
                    <TableHead className="font-semibold">Contatos</TableHead>
                    <TableHead className="font-semibold text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leads.map((lead) => (
                    <TableRow key={lead.id} className="hover:bg-muted/30">
                      <TableCell className="font-mono text-sm">{lead.cnpj}</TableCell>
                      <TableCell>{lead.razaoSocial}</TableCell>
                      <TableCell>{lead.nomeFantasia}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                          {lead.cidade}, {lead.uf}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MessageCircle 
                            className={cn(
                              'w-4 h-4',
                              lead.hasWhatsApp ? 'text-success' : 'text-muted-foreground/40'
                            )} 
                          />
                          <Mail 
                            className={cn(
                              'w-4 h-4',
                              lead.hasEmail ? 'text-primary' : 'text-muted-foreground/40'
                            )} 
                          />
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-primary"
                          onClick={() => handleViewDetails(lead)}
                        >
                          Ver Detalhes
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        ) : hasSearched && leads.length === 0 ? (
          <div className="card-corporate p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Nenhuma empresa encontrada
            </h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Tente ajustar os filtros ou selecionar um ramo de atividade diferente.
            </p>
          </div>
        ) : (
          /* Empty State - No search performed yet */
          <div className="card-corporate p-16 text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">
              Selecione um Ramo de Atividade
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
              Digite o ramo de atividade desejado no campo acima para começar a prospectar empresas qualificadas.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {CNAE_OPTIONS.slice(0, 4).map(cnae => (
                <button
                  key={cnae.code}
                  onClick={() => handleSelectCnae(cnae)}
                  className="px-4 py-2 rounded-full bg-muted hover:bg-primary/10 hover:text-primary text-sm font-medium text-muted-foreground transition-colors"
                >
                  {cnae.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* FAB for Mobile */}
        {leads.length > 0 && (
          <button 
            className="fab-button lg:hidden"
            onClick={() => handleLockedAction('Sincronização com Google Sheets')}
          >
            <FileSpreadsheet className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Modals */}
      <LeadDetailsModal
        lead={selectedLead}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
      />
      
      <UpgradeModal
        open={isUpgradeOpen}
        onOpenChange={setIsUpgradeOpen}
        feature={upgradeFeature}
        currentPlan={mockUserPlan}
      />
    </DashboardLayout>
  );
}
