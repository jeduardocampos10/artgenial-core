import { ReactNode } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { MobileHeader } from '@/components/MobileHeader';
import { PlanType } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
}

// Mock user data - in a real app, this would come from auth context
const mockUser = {
  id: '1',
  name: 'Jorge Eduardo',
  email: 'jorge@empresa.com.br',
  avatarUrl: '',
  plan: 'gold' as PlanType,
};

const mockCreditsUsed = 100;
const maxDailyCredits = 100;

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const progressPercentage = (mockCreditsUsed / maxDailyCredits) * 100;
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar user={mockUser} creditsUsed={mockCreditsUsed} />
        
        <div className="flex-1 flex flex-col min-w-0">
          <MobileHeader user={mockUser} creditsUsed={mockCreditsUsed} />
          
          {/* Desktop header with branding and daily credits */}
          <header className="hidden lg:flex flex-col border-b border-border bg-card">
            {/* Top row: Sidebar trigger, Logo, Plan badge, Avatar */}
            <div className="flex items-center h-14 px-6">
              <SidebarTrigger className="mr-4" />
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <Star className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-semibold text-foreground">ArtGenial</span>
              </div>
              
              <div className="flex-1" />
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  PLANO OURO
                </div>
                <Avatar className="h-9 w-9 border-2 border-primary">
                  <AvatarImage src={mockUser.avatarUrl} alt={mockUser.name} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
                    {mockUser.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
            
            {/* Credits progress bar row */}
            <div className="px-6 pb-3">
              <div className="flex items-center justify-between text-sm mb-1.5">
                <span className="text-muted-foreground">Consultas Hoje</span>
                <span className="font-semibold text-destructive">{mockCreditsUsed}/{maxDailyCredits}</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-destructive rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </header>
          
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
