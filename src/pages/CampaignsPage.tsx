import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Megaphone, Plus, MessageSquare, Mail, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CampaignsPage() {
  return (
    <DashboardLayout>
      <div className="p-4 lg:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Disparos</h1>
            <span className="badge-new">NEW</span>
          </div>
          <Button className="gap-2 bg-violet-600 hover:bg-violet-700 text-white">
            <Plus className="w-4 h-4" />
            Nova Campanha
          </Button>
        </div>

        {/* Empty State */}
        <div className="flex-1 flex items-center justify-center min-h-[60vh]">
          <div className="max-w-lg w-full bg-card rounded-2xl border border-border p-8 text-center shadow-sm">
            {/* Icon */}
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-violet-600 flex items-center justify-center mx-auto mb-6">
              <Megaphone className="w-10 h-10 text-white" />
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Envie Mensagens em Massa
            </h2>

            {/* Subtitle */}
            <p className="text-muted-foreground mb-6">
              Crie campanhas para alcançar seus leads via WhatsApp ou Email. 
              Agende envios, personalize mensagens e acompanhe resultados em tempo real.
            </p>

            {/* Channel Options */}
            <div className="flex justify-center gap-4 mb-6">
              <div className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-500/20 rounded-full">
                <MessageSquare className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium text-green-700 dark:text-green-300">WhatsApp</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-500/20 rounded-full">
                <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Email</span>
              </div>
            </div>

            {/* Features List */}
            <div className="text-left bg-muted/50 rounded-xl p-4 mb-6 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                <span className="text-muted-foreground">Disparo agendado ou imediato</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                <span className="text-muted-foreground">Personalização com variáveis</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                <span className="text-muted-foreground">Relatórios de entrega e abertura</span>
              </div>
            </div>

            {/* CTA Button */}
            <Button size="lg" className="bg-violet-600 hover:bg-violet-700 text-white gap-2">
              <Send className="w-5 h-5" />
              Criar Primeira Campanha
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
