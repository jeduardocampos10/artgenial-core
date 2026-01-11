import { useState } from 'react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { LeadDetailsModal } from '@/components/LeadDetailsModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Lead } from '@/types';
import { 
  Search, 
  Filter,
  Download,
  Send,
  Plus,
  Users,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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

export default function LeadsPage() {
  const [leads] = useState<Lead[]>(mockSavedLeads);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [currentPage] = useState(1);
  const totalPages = 1;

  const filteredLeads = leads.filter(lead => {
    const query = searchQuery.toLowerCase();
    return (
      lead.nomeFantasia.toLowerCase().includes(query) ||
      lead.razaoSocial.toLowerCase().includes(query) ||
      lead.cnpj.includes(query) ||
      lead.email?.toLowerCase().includes(query) ||
      lead.whatsapp?.includes(query) ||
      lead.cidade.toLowerCase().includes(query)
    );
  });

  const handleViewDetails = (lead: Lead) => {
    setSelectedLead(lead);
    setIsDetailsOpen(true);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedLeads(filteredLeads.map(lead => lead.id));
    } else {
      setSelectedLeads([]);
    }
  };

  const handleSelectLead = (leadId: string, checked: boolean) => {
    if (checked) {
      setSelectedLeads(prev => [...prev, leadId]);
    } else {
      setSelectedLeads(prev => prev.filter(id => id !== leadId));
    }
  };

  const isAllSelected = filteredLeads.length > 0 && selectedLeads.length === filteredLeads.length;

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-6 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Meus Leads</h1>
          
          {/* Summary Card */}
          <div className="inline-flex items-center gap-3 px-4 py-2.5 bg-card rounded-xl border border-border shadow-sm">
            <div className="w-10 h-10 rounded-full bg-violet-100 dark:bg-violet-500/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{leads.length}</p>
              <p className="text-xs text-muted-foreground">Leads</p>
            </div>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filtros
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Exportar
          </Button>
          <Button variant="outline" className="gap-2">
            <Send className="w-4 h-4" />
            Disparar p/ Filtrados
          </Button>
          <Button className="gap-2 bg-violet-600 hover:bg-violet-700 text-white">
            <Plus className="w-4 h-4" />
            Adicionar Lead
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Buscar leads (email, telefone, nome, empresa)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 text-base bg-card border-border"
          />
        </div>

        {/* Data Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="w-12">
                  <Checkbox 
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAll}
                    aria-label="Selecionar todos"
                  />
                </TableHead>
                <TableHead className="font-semibold text-foreground">Empresa</TableHead>
                <TableHead className="font-semibold text-foreground">Nome Fantasia</TableHead>
                <TableHead className="font-semibold text-foreground hidden md:table-cell">Cidade</TableHead>
                <TableHead className="font-semibold text-foreground hidden lg:table-cell">Telefone</TableHead>
                <TableHead className="font-semibold text-foreground hidden lg:table-cell">Email</TableHead>
                <TableHead className="font-semibold text-foreground text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.length > 0 ? (
                filteredLeads.map((lead) => (
                  <TableRow 
                    key={lead.id} 
                    className="hover:bg-muted/20 cursor-pointer"
                    onClick={() => handleViewDetails(lead)}
                  >
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox 
                        checked={selectedLeads.includes(lead.id)}
                        onCheckedChange={(checked) => handleSelectLead(lead.id, checked as boolean)}
                        aria-label={`Selecionar ${lead.nomeFantasia}`}
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">{lead.razaoSocial}</p>
                        <p className="text-xs text-muted-foreground font-mono">{lead.cnpj}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{lead.nomeFantasia}</span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className="text-muted-foreground">{lead.cidade}, {lead.uf}</span>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {lead.whatsapp ? (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-3.5 h-3.5 text-success" />
                          <span>{lead.whatsapp}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">—</span>
                      )}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {lead.email ? (
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-3.5 h-3.5 text-primary" />
                          <span className="truncate max-w-[180px]">{lead.email}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewDetails(lead)}>
                            Ver detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem>Enviar WhatsApp</DropdownMenuItem>
                          <DropdownMenuItem>Enviar Email</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Remover</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <Users className="w-10 h-10 mb-2 opacity-40" />
                      <p className="font-medium">Nenhum lead encontrado</p>
                      <p className="text-sm">Tente ajustar sua busca ou adicione novos leads.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-4 py-4 border-t border-border">
            <Button 
              variant="ghost" 
              size="sm" 
              disabled={currentPage === 1}
              className="gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              Anterior
            </Button>
            <span className="text-sm text-muted-foreground">
              Página <strong className="text-foreground">{currentPage}</strong> de <strong className="text-foreground">{totalPages}</strong>
            </span>
            <Button 
              variant="ghost" 
              size="sm" 
              disabled={currentPage === totalPages}
              className="gap-1"
            >
              Próxima
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Selected count info */}
        {selectedLeads.length > 0 && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-foreground text-background px-6 py-3 rounded-full shadow-lg flex items-center gap-4 z-50">
            <span className="text-sm font-medium">
              {selectedLeads.length} lead{selectedLeads.length > 1 ? 's' : ''} selecionado{selectedLeads.length > 1 ? 's' : ''}
            </span>
            <Button size="sm" variant="secondary" className="h-8">
              Disparar
            </Button>
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
