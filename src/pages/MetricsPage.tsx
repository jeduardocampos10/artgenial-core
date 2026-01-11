import { DashboardLayout } from '@/layouts/DashboardLayout';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  MessageSquare, 
  Mail,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';

// Mock data for charts
const leadData = [
  { name: 'Seg', leads: 12 },
  { name: 'Ter', leads: 19 },
  { name: 'Qua', leads: 15 },
  { name: 'Qui', leads: 25 },
  { name: 'Sex', leads: 32 },
  { name: 'Sáb', leads: 18 },
  { name: 'Dom', leads: 8 },
];

const statsCards = [
  { 
    title: 'Total de Leads', 
    value: '1,234', 
    change: '+12.5%', 
    trend: 'up',
    icon: Users,
    color: 'from-violet-500 to-purple-600'
  },
  { 
    title: 'Mensagens Enviadas', 
    value: '856', 
    change: '+8.2%', 
    trend: 'up',
    icon: MessageSquare,
    color: 'from-blue-500 to-cyan-600'
  },
  { 
    title: 'Taxa de Resposta', 
    value: '24.8%', 
    change: '-2.1%', 
    trend: 'down',
    icon: Mail,
    color: 'from-green-500 to-emerald-600'
  },
  { 
    title: 'Conversões', 
    value: '89', 
    change: '+15.3%', 
    trend: 'up',
    icon: BarChart3,
    color: 'from-orange-500 to-amber-600'
  },
];

export default function MetricsPage() {
  return (
    <DashboardLayout>
      <div className="p-4 lg:p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Métricas</h1>
          <p className="text-sm text-muted-foreground mt-1">Acompanhe o desempenho das suas campanhas</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsCards.map((stat) => (
            <div key={stat.title} className="bg-card rounded-xl border border-border p-5">
              <div className="flex items-start justify-between">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <div className={`flex items-center gap-1 text-xs font-medium ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-500'
                }`}>
                  {stat.trend === 'up' ? (
                    <ArrowUpRight className="w-3 h-3" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3" />
                  )}
                  {stat.change}
                </div>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Leads Chart */}
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="font-semibold text-foreground mb-4">Leads por Dia</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={leadData}>
                  <defs>
                    <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="leads" 
                    stroke="#8b5cf6" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorLeads)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Performance Chart */}
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="font-semibold text-foreground mb-4">Taxa de Conversão</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={leadData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="leads" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-muted/50 rounded-xl p-6">
          <h3 className="font-semibold text-foreground mb-4">Resumo do Período</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-violet-600">156</p>
              <p className="text-sm text-muted-foreground">Novos Contatos</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">89</p>
              <p className="text-sm text-muted-foreground">WhatsApp Enviados</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">42</p>
              <p className="text-sm text-muted-foreground">Respostas</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-orange-600">12</p>
              <p className="text-sm text-muted-foreground">Vendas</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
