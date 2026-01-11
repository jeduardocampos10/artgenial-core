import { Lead } from '@/types';
import { cn } from '@/lib/utils';
import { MessageCircle, Mail, MapPin, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LeadCardProps {
  lead: Lead;
  onViewDetails: (lead: Lead) => void;
  className?: string;
}

const tipoBadgeStyles = {
  MEI: 'bg-slate-100 text-slate-600',
  ME: 'bg-blue-100 text-blue-700',
  EPP: 'bg-green-100 text-green-700',
  LTDA: 'bg-purple-100 text-purple-700',
  SA: 'bg-amber-100 text-amber-700',
};

export function LeadCard({ lead, onViewDetails, className }: LeadCardProps) {
  return (
    <div className={cn('lead-card animate-fade-in', className)}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate">
            {lead.nomeFantasia || lead.razaoSocial}
          </h3>
          <p className="text-xs text-muted-foreground truncate mt-0.5">
            {lead.razaoSocial}
          </p>
        </div>
        <span className={cn('badge-plan text-[10px]', tipoBadgeStyles[lead.tipo])}>
          {lead.tipo}
        </span>
      </div>

      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <MapPin className="w-3.5 h-3.5" />
        <span>{lead.cidade}, {lead.uf}</span>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-border/50">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <MessageCircle 
              className={cn(
                'w-4 h-4',
                lead.hasWhatsApp ? 'text-success' : 'text-muted-foreground/40'
              )} 
            />
            {lead.hasWhatsApp && (
              <span className="text-[10px] text-success font-medium">WhatsApp</span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Mail 
              className={cn(
                'w-4 h-4',
                lead.hasEmail ? 'text-primary' : 'text-muted-foreground/40'
              )} 
            />
            {lead.hasEmail && (
              <span className="text-[10px] text-primary font-medium">Email</span>
            )}
          </div>
        </div>
        
        <Button 
          variant="ghost" 
          size="sm"
          className="h-8 text-xs font-medium text-primary hover:text-primary/80"
          onClick={() => onViewDetails(lead)}
        >
          Ver Detalhes
          <ChevronRight className="w-3.5 h-3.5 ml-1" />
        </Button>
      </div>
    </div>
  );
}
