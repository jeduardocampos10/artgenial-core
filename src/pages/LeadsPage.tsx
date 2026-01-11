import { useState } from 'react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { LeadCard } from '@/components/LeadCard';
import { LeadDetailsModal } from '@/components/LeadDetailsModal';
import { SkeletonLoader } from '@/components/SkeletonLoader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lead } from '@/types';
import { 
  Search, 
  Filter,
  Download,
  MessageCircle,
  Mail,
  MapPin,
  Users,
  Inbox,
  CheckCircle2,
  Clock,
  XCircle
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Mock saved leads
const mockSavedLeads: Lead[] = [
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
    status: 'responded',
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
    status: 'whatsapp_sent',
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
    status: 'email_sent',
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
    status: 'closed',
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
    status: 'no_response',
  },
];

const statusConfig = {
  downloaded: { label: 'Baixado', icon: Download, color: 'text-primary bg-primary/10' },
  whatsapp_sent: { label: 'WhatsApp Enviado', icon: MessageCircle, color: 'text-success bg-success/10' },
  email_sent: { label: 'Email Enviado', icon: Mail, color: 'text-blue-600 bg-blue-100' },
  responded: { label: 'Respondido', icon: CheckCircle2, color: 'text-purple-600 bg-purple-100' },
  no_response: { label: 'Sem Resposta', icon: Clock, color: 'text-orange-600 bg-orange-100' },
  closed: { label: 'Venda Fechada', icon: XCircle, color: 'text-success bg-success/10' },
};

export default function LeadsPage() {
  const [leads] = useState<Lead[]>(mockSavedLeads);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading] = useState(false);

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.nomeFantasia.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.razaoSocial.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.cnpj.includes(searchQuery);
    
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (lead: Lead) => {
    setSelectedLead(lead);
    setIsDetailsOpen(true);
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return null;
    const config = statusConfig[status as keyof typeof statusConfig];
    if (!config) return null;
    
    const Icon = config.icon;
    return (
      <span className={cn('inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium', config.color)}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-6 space-y-4">
        {/* Page Title */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Meus Leads</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Gerencie seus leads salvos
            </p>
          </div>
          <Button className="btn-corporate">
            <Download className="w-4 h-4 mr-2" />
            Exportar Todos
          </Button>
        </div>

        {/* Filters */}
        <div className="card-corporate p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, CNPJ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-corporate pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="input-corporate sm:w-48">
                <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="downloaded">Baixados</SelectItem>
                <SelectItem value="whatsapp_sent">WhatsApp Enviado</SelectItem>
                <SelectItem value="email_sent">Email Enviado</SelectItem>
                <SelectItem value="responded">Respondidos</SelectItem>
                <SelectItem value="no_response">Sem Resposta</SelectItem>
                <SelectItem value="closed">Vendas Fechadas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <>
            <div className="lg:hidden">
              <SkeletonLoader variant="lead-card" count={3} />
            </div>
            <div className="hidden lg:block card-corporate overflow-hidden">
              <SkeletonLoader variant="table-row" count={5} />
            </div>
          </>
        ) : filteredLeads.length > 0 ? (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">{filteredLeads.length}</strong> leads encontrados
              </p>
            </div>

            {/* Mobile: Lead Cards */}
            <div className="lg:hidden space-y-3">
              {filteredLeads.map((lead) => (
                <div key={lead.id} className="card-corporate p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground truncate">
                        {lead.nomeFantasia || lead.razaoSocial}
                      </h3>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {lead.razaoSocial}
                      </p>
                    </div>
                    {getStatusBadge(lead.status)}
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{lead.cidade}, {lead.uf}</span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border/50">
                    <div className="flex items-center gap-3">
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
                    
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-primary"
                      onClick={() => handleViewDetails(lead)}
                    >
                      Ver Detalhes
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop: Data Table */}
            <div className="hidden lg:block card-corporate overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">CNPJ</TableHead>
                    <TableHead className="font-semibold">Nome Fantasia</TableHead>
                    <TableHead className="font-semibold">Cidade</TableHead>
                    <TableHead className="font-semibold">Contatos</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeads.map((lead) => (
                    <TableRow key={lead.id} className="hover:bg-muted/30">
                      <TableCell className="font-mono text-sm">{lead.cnpj}</TableCell>
                      <TableCell className="font-medium">{lead.nomeFantasia}</TableCell>
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
                      <TableCell>
                        {getStatusBadge(lead.status)}
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
              {searchQuery || statusFilter !== 'all' ? (
                <Inbox className="w-8 h-8 text-muted-foreground" />
              ) : (
                <Users className="w-8 h-8 text-muted-foreground" />
              )}
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {searchQuery || statusFilter !== 'all' 
                ? 'Nenhum lead encontrado'
                : 'Nenhum lead salvo ainda'
              }
            </h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              {searchQuery || statusFilter !== 'all'
                ? 'Tente ajustar os filtros de busca.'
                : 'Faça uma pesquisa e baixe empresas para começar a gerenciar seus leads.'
              }
            </p>
          </div>
        )}
      </div>

      {/* Details Modal */}
      <LeadDetailsModal
        lead={selectedLead}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
      />
    </DashboardLayout>
  );
}
