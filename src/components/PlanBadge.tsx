import { PlanType, PLAN_CONFIGS } from '@/types';
import { cn } from '@/lib/utils';
import { Crown, Star, Medal, Award, Gift } from 'lucide-react';

interface PlanBadgeProps {
  plan: PlanType;
  className?: string;
}

const planIcons = {
  free: Gift,
  bronze: Medal,
  silver: Award,
  gold: Star,
  premium: Crown,
};

const planStyles = {
  free: 'bg-muted text-muted-foreground',
  bronze: 'bg-amber-100 text-amber-800',
  silver: 'bg-slate-200 text-slate-700',
  gold: 'bg-yellow-100 text-yellow-700 border border-yellow-300',
  premium: 'bg-purple-100 text-purple-700 border border-purple-300',
};

export function PlanBadge({ plan, className }: PlanBadgeProps) {
  const config = PLAN_CONFIGS[plan];
  const Icon = planIcons[plan];

  return (
    <span className={cn('badge-plan', planStyles[plan], className)}>
      <Icon className="w-3 h-3 mr-1" />
      Plano {config.nameDisplay}
    </span>
  );
}
