import { cn } from '@/lib/utils';
import { PlanType, PLAN_CONFIGS } from '@/types';

interface CreditsProgressBarProps {
  used: number;
  plan: PlanType;
  className?: string;
}

export function CreditsProgressBar({ used, plan, className }: CreditsProgressBarProps) {
  const config = PLAN_CONFIGS[plan];
  const total = config.searchesPerDay === 'unlimited' ? 100 : config.searchesPerDay;
  const percentage = config.searchesPerDay === 'unlimited' ? 0 : Math.min((used / total) * 100, 100);
  const isLow = percentage >= 80;
  const isExhausted = percentage >= 100;

  return (
    <div className={cn('space-y-1.5', className)}>
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-foreground">Consultas Hoje</span>
        <span className={cn(
          'font-semibold',
          isExhausted ? 'text-destructive' : isLow ? 'text-warning' : 'text-muted-foreground'
        )}>
          {config.searchesPerDay === 'unlimited' ? (
            'Ilimitado'
          ) : (
            `${used}/${total}`
          )}
        </span>
      </div>
      {config.searchesPerDay !== 'unlimited' && (
        <div className="progress-credits">
          <div 
            className={cn(
              'progress-credits-bar',
              isExhausted && 'bg-gradient-to-r from-destructive to-destructive',
              isLow && !isExhausted && 'bg-gradient-to-r from-warning to-warning'
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}
    </div>
  );
}
