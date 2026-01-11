import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { PlanBadge } from '@/components/PlanBadge';
import { PLAN_CONFIGS, PlanType } from '@/types';
import { 
  User, 
  Bell, 
  Shield, 
  CreditCard,
  ChevronRight,
  Crown,
  Check,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

const mockUserPlan: PlanType = 'gold';

const plans: Array<{
  type: PlanType;
  price: number;
  popular?: boolean;
}> = [
  { type: 'free', price: 0 },
  { type: 'bronze', price: 49 },
  { type: 'silver', price: 99, popular: true },
  { type: 'gold', price: 199 },
  { type: 'premium', price: 399 },
];

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="p-4 lg:p-6 space-y-6 max-w-4xl">
        {/* Page Title */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie sua conta e preferências
          </p>
        </div>

        {/* Profile Section */}
        <div className="card-corporate p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Perfil</h2>
              <p className="text-sm text-muted-foreground">Informações da sua conta</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Nome Completo</Label>
                <Input className="input-corporate" defaultValue="João Silva" />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input className="input-corporate" defaultValue="joao@empresa.com.br" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Empresa</Label>
              <Input className="input-corporate" defaultValue="Tech Solutions Ltda" />
            </div>
            <Button className="btn-corporate">
              Salvar Alterações
            </Button>
          </div>
        </div>

        {/* Notifications */}
        <div className="card-corporate p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Bell className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Notificações</h2>
              <p className="text-sm text-muted-foreground">Configure seus alertas</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Novos leads responderam</p>
                <p className="text-sm text-muted-foreground">Receba alertas quando um lead responder</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Relatório semanal</p>
                <p className="text-sm text-muted-foreground">Resumo de performance toda segunda-feira</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Limite de créditos</p>
                <p className="text-sm text-muted-foreground">Aviso quando atingir 80% do limite diário</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </div>

        {/* Current Plan */}
        <div className="card-corporate p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">Plano Atual</h2>
                <p className="text-sm text-muted-foreground">Gerencie sua assinatura</p>
              </div>
            </div>
            <PlanBadge plan={mockUserPlan} />
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {plans.map((plan) => {
              const config = PLAN_CONFIGS[plan.type];
              const isCurrentPlan = plan.type === mockUserPlan;
              
              return (
                <div 
                  key={plan.type}
                  className={cn(
                    'relative p-4 rounded-xl border-2 transition-all',
                    isCurrentPlan 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50',
                    plan.popular && !isCurrentPlan && 'border-accent'
                  )}
                >
                  {plan.popular && (
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-accent text-accent-foreground text-[10px] font-semibold rounded-full">
                      POPULAR
                    </span>
                  )}
                  
                  <div className="text-center">
                    <p className="text-sm font-semibold text-foreground mb-1">
                      {config.nameDisplay}
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {plan.price === 0 ? 'Grátis' : `R$${plan.price}`}
                      {plan.price > 0 && <span className="text-xs font-normal text-muted-foreground">/mês</span>}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {config.searchesPerDay === 'unlimited' 
                        ? 'Ilimitado' 
                        : `${config.searchesPerDay}/dia`
                      }
                    </p>
                    
                    {isCurrentPlan ? (
                      <div className="mt-3 flex items-center justify-center gap-1 text-xs text-primary font-medium">
                        <Check className="w-3.5 h-3.5" />
                        Atual
                      </div>
                    ) : (
                      <Button 
                        size="sm" 
                        variant={plan.popular ? 'default' : 'outline'}
                        className={cn('mt-3 w-full text-xs h-7', plan.popular && 'btn-corporate')}
                      >
                        {plans.findIndex(p => p.type === plan.type) > plans.findIndex(p => p.type === mockUserPlan) 
                          ? 'Upgrade' 
                          : 'Escolher'
                        }
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Security */}
        <div className="card-corporate p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Segurança</h2>
              <p className="text-sm text-muted-foreground">Proteja sua conta</p>
            </div>
          </div>

          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors text-left">
              <div>
                <p className="font-medium text-foreground">Alterar Senha</p>
                <p className="text-sm text-muted-foreground">Última alteração há 30 dias</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
            <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors text-left">
              <div>
                <p className="font-medium text-foreground">Autenticação em duas etapas</p>
                <p className="text-sm text-muted-foreground">Adicione uma camada extra de segurança</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
            <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors text-left">
              <div>
                <p className="font-medium text-foreground">Sessões ativas</p>
                <p className="text-sm text-muted-foreground">Gerencie dispositivos conectados</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
