import { 
  LayoutDashboard, 
  Search, 
  Users, 
  Settings, 
  Link2,
  LogOut,
  Building2
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { PlanBadge } from './PlanBadge';
import { CreditsProgressBar } from './CreditsProgressBar';
import { PlanType } from '@/types';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const navItems = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Pesquisar', url: '/search', icon: Search },
  { title: 'Meus Leads', url: '/leads', icon: Users },
  { title: 'Integrações', url: '/integrations', icon: Link2 },
  { title: 'Configurações', url: '/settings', icon: Settings },
];

interface AppSidebarProps {
  user: {
    name: string;
    email: string;
    avatarUrl?: string;
    plan: PlanType;
  };
  creditsUsed: number;
}

export function AppSidebar({ user, creditsUsed }: AppSidebarProps) {
  const { state } = useSidebar();
  const location = useLocation();
  const collapsed = state === 'collapsed';

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className={cn(
          "flex items-center gap-3",
          collapsed && "justify-center"
        )}>
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
            <Building2 className="w-5 h-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <h1 className="font-bold text-lg text-foreground tracking-tight">CNPJ Master</h1>
              <p className="text-[10px] text-muted-foreground">Leads B2B Inteligentes</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="py-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        className={cn(
                          'sidebar-link touch-target',
                          isActive && 'sidebar-link-active'
                        )}
                      >
                        <item.icon className="w-5 h-5 flex-shrink-0" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {!collapsed && (
          <div className="px-4 mt-4">
            <CreditsProgressBar 
              used={creditsUsed} 
              plan={user.plan} 
            />
          </div>
        )}
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <div className={cn(
          "flex items-center gap-3",
          collapsed && "justify-center"
        )}>
          <Avatar className="w-9 h-9 flex-shrink-0">
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
              {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
              <PlanBadge plan={user.plan} className="mt-0.5" />
            </div>
          )}
        </div>
        {!collapsed && (
          <button className="sidebar-link mt-2 text-muted-foreground hover:text-destructive w-full">
            <LogOut className="w-4 h-4" />
            <span>Sair</span>
          </button>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
