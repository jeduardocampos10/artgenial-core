import { 
  LayoutDashboard,
  MessageSquare,
  Kanban,
  Users,
  Bot,
  Database,
  Megaphone,
  LineChart,
  BookOpen,
  Settings,
  LogOut,
  Sparkles
} from 'lucide-react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { PlanBadge } from './PlanBadge';
import { PlanType, PLAN_CONFIGS } from '@/types';
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
  { title: 'Conversas', url: '/conversations', icon: MessageSquare },
  { title: 'Flux CRM', url: '/crm', icon: Kanban },
  { title: 'Contatos', url: '/leads', icon: Users },
  { title: 'Agentes', url: '/agents', icon: Bot },
  { title: 'Base de Conhecimento', url: '/knowledge', icon: Database },
  { title: 'Disparos', url: '/campaigns', icon: Megaphone, isNew: true },
  { title: 'Métricas', url: '/metrics', icon: LineChart },
  { title: 'Documentação', url: '/docs', icon: BookOpen },
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
  const navigate = useNavigate();
  const collapsed = state === 'collapsed';

  const planConfig = PLAN_CONFIGS[user.plan];
  const maxCredits = planConfig.searchesPerDay === 'unlimited' ? '∞' : planConfig.searchesPerDay;

  const handleLogout = () => {
    // In a real app, this would clear auth tokens/session
    navigate('/login');
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className={cn(
          "flex items-center gap-3",
          collapsed && "justify-center"
        )}>
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <h1 className="font-bold text-lg text-foreground tracking-tight">ArtGenial</h1>
              <p className="text-[10px] text-muted-foreground">Inteligência de Leads B2B</p>
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
                        {!collapsed && (
                          <span className="flex-1">{item.title}</span>
                        )}
                        {!collapsed && item.isNew && (
                          <span className="badge-new">NEW</span>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border">
        {/* Plan Credits Display */}
        {!collapsed && (
          <div className="mb-4 p-3 rounded-lg bg-muted/50 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Créditos:</span>
              <span className="font-semibold text-foreground">{creditsUsed} / {maxCredits}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Agentes:</span>
              <span className="font-semibold text-foreground">0 / 1</span>
            </div>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-blue-500 transition-all duration-500"
                style={{ 
                  width: planConfig.searchesPerDay === 'unlimited' 
                    ? '10%' 
                    : `${Math.min((creditsUsed / planConfig.searchesPerDay) * 100, 100)}%` 
                }}
              />
            </div>
          </div>
        )}

        {/* User Profile */}
        <div className={cn(
          "flex items-center gap-3",
          collapsed && "justify-center"
        )}>
          <Avatar className="w-9 h-9 flex-shrink-0">
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback className="bg-gradient-to-br from-violet-500 to-blue-600 text-white font-semibold text-sm">
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
        <button 
          onClick={handleLogout}
          className={cn(
            "sidebar-link mt-2 text-muted-foreground hover:text-destructive w-full",
            collapsed && "justify-center"
          )}
        >
          <LogOut className="w-4 h-4" />
          {!collapsed && <span>Sair</span>}
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
