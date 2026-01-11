import { useState } from 'react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { LeadCard } from '@/components/LeadCard';
import { LeadDetailsModal } from '@/components/LeadDetailsModal';
import { UpgradeModal } from '@/components/UpgradeModal';
import { SkeletonLoader } from '@/components/SkeletonLoader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Lead, PlanType } from '@/types';
import { 
  Search, 
  Filter, 
  X, 
  RefreshCw, 
  Download,
  MessageCircle,
  Mail,
  MapPin,
  FileSpreadsheet,
  Lock,
  ChevronDown,
  ChevronUp
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
  const [showFilters, setShowFilters] = useState(true);
  
  // Filters
  const [uf, setUf] = useState('');
  const [cidade, setCidade] = useState('');
  const [bairro, setBairro] = useState('');
  const [ramo, setRamo] = useState('');
  const [capitalSocial, setCapitalSocial] = useState([0]);
  const [onlyWhatsApp, setOnlyWhatsApp] = useState(false);
  const [onlyEmail, setOnlyEmail] = useState(false);
  const [excludeMEI, setExcludeMEI] = useState(false);

  const handleSearch = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    let filteredLeads = [...mockLeads];
    
    if (excludeMEI) {
      filteredLeads = filteredLeads.filter(l => l.tipo !== 'MEI');
    }
    if (onlyWhatsApp) {
      filteredLeads = filteredLeads.filter(l => l.hasWhatsApp);
    }
    if (onlyEmail) {
      filteredLeads = filteredLeads.filter(l => l.hasEmail);
    }
    if (uf) {
      filteredLeads = filteredLeads.filter(l => l.uf === uf);
    }
    
    setLeads(filteredLeads);
    setIsLoading(false);
  };

  const handleViewDetails = (lead: Lead) => {
    setSelectedLead(lead);
    setIsDetailsOpen(true);
  };

  const handleLockedAction = (feature: string) => {
    setUpgradeFeature(feature);
    setIsUpgradeOpen(true);
  };

  const formatCapitalSocial = (value: number) => {
    if (value === 0) return 'Qualquer';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-6 space-y-4">
        {/* Page Title */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Pesquisar Empresas</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Encontre leads B2B qualificados
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

        {/* Filters Section */}
        <div className="card-corporate">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-between p-4 lg:hidden"
          >
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-primary" />
              <span className="font-medium">Filtros de Busca</span>
            </div>
            {showFilters ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
          
          <div className={cn(
            'p-4 pt-0 lg:pt-4 space-y-4',
            !showFilters && 'hidden lg:block'
          )}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Estado (UF)</Label>
                <Select value={uf} onValueChange={setUf}>
                  <SelectTrigger className="input-corporate">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos</SelectItem>
                    {UF_LIST.map((state) => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Cidade</Label>
                <Input
                  placeholder="Ex: São Paulo"
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                  className="input-corporate"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Bairro</Label>
                <Input
                  placeholder="Ex: Pinheiros"
                  value={bairro}
                  onChange={(e) => setBairro(e.target.value)}
                  className="input-corporate"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Ramo/Atividade</Label>
                <Input
                  placeholder="Ex: Tecnologia"
                  value={ramo}
                  onChange={(e) => setRamo(e.target.value)}
                  className="input-corporate"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Capital Social Mínimo: {formatCapitalSocial(capitalSocial[0])}
              </Label>
              <Slider
                value={capitalSocial}
                onValueChange={setCapitalSocial}
                max={5000000}
                step={50000}
                className="py-2"
              />
            </div>

            <div className="flex flex-wrap gap-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="whatsapp"
                  checked={onlyWhatsApp}
                  onCheckedChange={setOnlyWhatsApp}
                />
                <Label htmlFor="whatsapp" className="text-sm cursor-pointer flex items-center gap-1.5">
                  <MessageCircle className="w-4 h-4 text-success" />
                  Apenas com WhatsApp
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="email"
                  checked={onlyEmail}
                  onCheckedChange={setOnlyEmail}
                />
                <Label htmlFor="email" className="text-sm cursor-pointer flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-primary" />
                  Apenas com E-mail
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="mei"
                  checked={excludeMEI}
                  onCheckedChange={setExcludeMEI}
                />
                <Label htmlFor="mei" className="text-sm cursor-pointer">
                  Excluir MEI
                </Label>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button 
                className="btn-corporate flex-1 sm:flex-none h-11 touch-target"
                onClick={handleSearch}
                disabled={isLoading}
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Search className="w-4 h-4 mr-2" />
                )}
                Buscar Empresas
              </Button>
              
              <Button 
                variant="outline" 
                className="sm:flex-none h-11"
                onClick={() => {
                  setUf('');
                  setCidade('');
                  setBairro('');
                  setRamo('');
                  setCapitalSocial([0]);
                  setOnlyWhatsApp(false);
                  setOnlyEmail(false);
                  setExcludeMEI(false);
                }}
              >
                <X className="w-4 h-4 mr-2" />
                Limpar Filtros
              </Button>
            </div>
          </div>
        </div>

        {/* Results */}
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
        ) : leads.length > 0 ? (
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
        ) : (
          <div className="card-corporate p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Busque por empresas
            </h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Use os filtros acima para encontrar leads B2B qualificados. 
              Você pode filtrar por localização, ramo de atividade, capital social e muito mais.
            </p>
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
        currentPlan={mockUserPlan}
        feature={upgradeFeature}
      />
    </DashboardLayout>
  );
}
