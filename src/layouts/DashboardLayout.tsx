import { ReactNode } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { MobileHeader } from '@/components/MobileHeader';
import { PlanType } from '@/types';

interface DashboardLayoutProps {
  children: ReactNode;
}

// Mock user data - in a real app, this would come from auth context
const mockUser = {
  id: '1',
  name: 'João Silva',
  email: 'joao@empresa.com.br',
  avatarUrl: '',
  plan: 'gold' as PlanType,
};

const mockCreditsUsed = 12;

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar user={mockUser} creditsUsed={mockCreditsUsed} />
        
        <div className="flex-1 flex flex-col min-w-0">
          <MobileHeader user={mockUser} creditsUsed={mockCreditsUsed} />
          
          {/* Desktop header */}
          <header className="hidden lg:flex items-center h-14 px-6 border-b border-border bg-card">
            <SidebarTrigger className="mr-4" />
            <div className="flex-1" />
          </header>
          
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
