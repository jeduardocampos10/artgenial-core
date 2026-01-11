import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Lock, Sparkles, Zap, Shield, Award } from 'lucide-react';
import { PlanType, PLAN_CONFIGS } from '@/types';

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPlan: PlanType;
  feature: string;
}

export function UpgradeModal({ open, onOpenChange, currentPlan, feature }: UpgradeModalProps) {
  const nextPlan = currentPlan === 'free' ? 'bronze' : 
                   currentPlan === 'bronze' ? 'silver' : 
                   currentPlan === 'silver' ? 'gold' : 'premium';
  
  const nextPlanConfig = PLAN_CONFIGS[nextPlan];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md text-center">
        <DialogHeader className="items-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <DialogTitle className="text-xl">
            Funcionalidade Bloqueada
          </DialogTitle>
          <DialogDescription className="text-base">
            {feature} está disponível a partir do <strong>Plano {nextPlanConfig.nameDisplay}</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-3">
          <p className="text-sm text-muted-foreground">
            Com o plano {nextPlanConfig.nameDisplay} você terá acesso a:
          </p>
          <ul className="space-y-2 text-left">
            <li className="flex items-center gap-2 text-sm">
              <Zap className="w-4 h-4 text-primary" />
              <span>{nextPlanConfig.searchesPerDay === 'unlimited' ? 'Consultas ilimitadas' : `${nextPlanConfig.searchesPerDay} consultas/dia`}</span>
            </li>
            {nextPlanConfig.automationUnlocked && (
              <li className="flex items-center gap-2 text-sm">
                <Sparkles className="w-4 h-4 text-primary" />
                <span>Disparos automáticos via WhatsApp e Email</span>
              </li>
            )}
            <li className="flex items-center gap-2 text-sm">
              <Shield className="w-4 h-4 text-primary" />
              <span>Suporte prioritário</span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-2">
          <Button className="w-full btn-corporate">
            <Award className="w-4 h-4 mr-2" />
            Fazer Upgrade para {nextPlanConfig.nameDisplay}
          </Button>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Agora não
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
