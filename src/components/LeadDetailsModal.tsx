import { Lead } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  MessageCircle,
  DollarSign,
  Copy,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface LeadDetailsModalProps {
  lead: Lead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const tipoBadgeStyles = {
  MEI: 'bg-slate-100 text-slate-600',
  ME: 'bg-blue-100 text-blue-700',
  EPP: 'bg-green-100 text-green-700',
  LTDA: 'bg-purple-100 text-purple-700',
  SA: 'bg-amber-100 text-amber-700',
};

export function LeadDetailsModal({ lead, open, onOpenChange }: LeadDetailsModalProps) {
  if (!lead) return null;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copiado!`);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            Detalhes da Empresa
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-lg text-foreground">
                {lead.nomeFantasia || lead.razaoSocial}
              </h3>
              <p className="text-sm text-muted-foreground">{lead.razaoSocial}</p>
            </div>
            <span className={cn('badge-plan', tipoBadgeStyles[lead.tipo])}>
              {lead.tipo}
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <span className="text-xs text-muted-foreground font-medium w-16">CNPJ</span>
              <span className="text-sm font-mono flex-1">{lead.cnpj}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7"
                onClick={() => copyToClipboard(lead.cnpj, 'CNPJ')}
              >
                <Copy className="w-3.5 h-3.5" />
              </Button>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">{lead.bairro}, {lead.cidade} - {lead.uf}</span>
            </div>

            <div className="flex items-center gap-3">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">Capital Social: {formatCurrency(lead.capitalSocial)}</span>
            </div>
          </div>

          <div className="border-t pt-4 space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Contatos</p>
            
            {lead.hasWhatsApp && lead.whatsapp && (
              <div className="flex items-center justify-between p-3 bg-success/5 border border-success/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-success" />
                  <span className="text-sm">{lead.whatsapp}</span>
                </div>
                <Button 
                  size="sm" 
                  className="h-7 bg-success hover:bg-success/90"
                  onClick={() => window.open(`https://wa.me/55${lead.whatsapp?.replace(/\D/g, '')}`, '_blank')}
                >
                  <ExternalLink className="w-3.5 h-3.5 mr-1" />
                  Abrir
                </Button>
              </div>
            )}

            {lead.hasEmail && lead.email && (
              <div className="flex items-center justify-between p-3 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  <span className="text-sm">{lead.email}</span>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="h-7"
                  onClick={() => copyToClipboard(lead.email!, 'Email')}
                >
                  <Copy className="w-3.5 h-3.5 mr-1" />
                  Copiar
                </Button>
              </div>
            )}

            {!lead.hasWhatsApp && !lead.hasEmail && (
              <p className="text-sm text-muted-foreground italic">
                Nenhum contato disponível
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
