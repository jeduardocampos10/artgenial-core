import { Menu } from 'lucide-react';
import { Building2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlanBadge } from './PlanBadge';
import { CreditsProgressBar } from './CreditsProgressBar';
import { PlanType } from '@/types';
import { SidebarTrigger } from '@/components/ui/sidebar';

interface MobileHeaderProps {
  user: {
    name: string;
    avatarUrl?: string;
    plan: PlanType;
  };
  creditsUsed: number;
}

export function MobileHeader({ user, creditsUsed }: MobileHeaderProps) {
  return (
    <header className="lg:hidden sticky top-0 z-40 bg-card border-b border-border">
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="touch-target">
            <Menu className="w-5 h-5" />
          </SidebarTrigger>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Building2 className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground">CNPJ Master</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <PlanBadge plan={user.plan} />
          <Avatar className="w-8 h-8">
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
              {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
      
      <div className="px-4 pb-3">
        <CreditsProgressBar 
          used={creditsUsed} 
          plan={user.plan} 
        />
      </div>
    </header>
  );
}
