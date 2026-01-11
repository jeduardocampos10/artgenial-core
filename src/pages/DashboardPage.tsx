import { DashboardLayout } from '@/layouts/DashboardLayout';
import { FunnelCard } from '@/components/FunnelCard';
import { 
  Download, 
  MessageCircle, 
  Mail, 
  MessageSquare, 
  Clock, 
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  Calendar
} from 'lucide-react';
import { FunnelStats } from '@/types';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

// Mock data
const funnelStats: FunnelStats = {
  downloaded: 1245,
  whatsappSent: 892,
  emailSent: 756,
  responded: 234,
  noResponse: 412,
  closed: 48,
};

const chartData = [
  { name: '01/01', leads: 12 },
  { name: '05/01', leads: 28 },
  { name: '10/01', leads: 45 },
  { name: '15/01', leads: 38 },
  { name: '20/01', leads: 62 },
  { name: '25/01', leads: 51 },
  { name: '30/01', leads: 78 },
];

const funnelItems = [
  { title: 'Baixados', value: funnelStats.downloaded, icon: Download, color: 'downloaded' },
  { title: 'Msg WhatsApp Enviada', value: funnelStats.whatsappSent, icon: MessageCircle, color: 'whatsapp' },
  { title: 'Email Enviado', value: funnelStats.emailSent, icon: Mail, color: 'email' },
  { title: 'Respondidos (Leads)', value: funnelStats.responded, icon: MessageSquare, color: 'responded' },
  { title: 'Sem Resposta', value: funnelStats.noResponse, icon: Clock, color: 'no-response' },
  { title: 'Vendas Fechadas', value: funnelStats.closed, icon: DollarSign, color: 'closed' },
];

export default function DashboardPage() {
  const conversionRate = '8.4';
  const responseRate = '24.2';

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-6 space-y-6">
        {/* Page Title */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Visão geral do seu funil de vendas
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>Últimos 30 dias</span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 lg:hidden">
          <div className="card-corporate p-4">
            <div className="flex items-center gap-2 text-success">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">Conversão</span>
            </div>
            <p className="text-2xl font-bold text-foreground mt-1">{conversionRate}%</p>
          </div>
          <div className="card-corporate p-4">
            <div className="flex items-center gap-2 text-primary">
              <ArrowUpRight className="w-4 h-4" />
              <span className="text-sm font-medium">Resposta</span>
            </div>
            <p className="text-2xl font-bold text-foreground mt-1">{responseRate}%</p>
          </div>
        </div>

        {/* Funnel Cards */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Funil de Vendas
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
            {funnelItems.map((item) => (
              <FunnelCard
                key={item.title}
                title={item.title}
                value={item.value}
                icon={item.icon}
                color={item.color}
              />
            ))}
          </div>
        </div>

        {/* Chart Section */}
        <div className="card-corporate p-4 lg:p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Leads Gerados
              </h2>
              <p className="text-sm text-muted-foreground">
                Últimos 30 dias
              </p>
            </div>
            <div className="hidden lg:flex items-center gap-6">
              <div className="text-right">
                <p className="text-2xl font-bold text-foreground">
                  {funnelStats.downloaded.toLocaleString('pt-BR')}
                </p>
                <p className="text-xs text-muted-foreground">Total baixados</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-success">
                  +{conversionRate}%
                </p>
                <p className="text-xs text-muted-foreground">Taxa de conversão</p>
              </div>
            </div>
          </div>

          <div className="h-64 lg:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="name" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.5rem',
                    boxShadow: 'var(--shadow-elevated)',
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="leads" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: 'hsl(var(--primary))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity - Mobile Only */}
        <div className="lg:hidden card-corporate p-4">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Atividade Recente
          </h2>
          <div className="space-y-3">
            {[
              { action: 'Novo lead respondeu', time: 'há 5 min', color: 'text-success' },
              { action: 'Email enviado para 12 leads', time: 'há 1 hora', color: 'text-primary' },
              { action: 'WhatsApp enviado para 8 leads', time: 'há 2 horas', color: 'text-success' },
              { action: 'Venda fechada - R$ 2.500', time: 'há 3 horas', color: 'text-success' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                <span className={`text-sm ${item.color}`}>{item.action}</span>
                <span className="text-xs text-muted-foreground">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
