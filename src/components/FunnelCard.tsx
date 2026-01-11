import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface FunnelCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: string;
  className?: string;
}

export function FunnelCard({ title, value, icon: Icon, color, className }: FunnelCardProps) {
  return (
    <div className={cn('funnel-card', className)}>
      <div 
        className="w-10 h-10 rounded-full flex items-center justify-center mb-2"
        style={{ backgroundColor: `hsl(var(--funnel-${color}) / 0.15)` }}
      >
        <Icon 
          className="w-5 h-5"
          style={{ color: `hsl(var(--funnel-${color}))` }}
        />
      </div>
      <span className="text-2xl font-bold text-foreground">{value.toLocaleString('pt-BR')}</span>
      <span className="text-xs text-muted-foreground mt-1">{title}</span>
    </div>
  );
}
