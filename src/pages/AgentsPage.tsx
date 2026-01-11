import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Bot, Plus, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AgentsPage() {
  return (
    <DashboardLayout>
      <div className="p-4 lg:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Agentes</h1>
            <p className="text-sm text-muted-foreground mt-1">Crie agentes de IA para automatizar atendimentos</p>
          </div>
          <Button className="gap-2 bg-violet-600 hover:bg-violet-700 text-white">
            <Plus className="w-4 h-4" />
            Novo Agente
          </Button>
        </div>

        {/* Empty State */}
        <div className="flex-1 flex items-center justify-center min-h-[60vh]">
          <div className="max-w-md w-full bg-card rounded-2xl border border-border p-8 text-center shadow-sm">
            {/* Icon */}
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center mx-auto mb-6">
              <Bot className="w-10 h-10 text-white" />
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Crie o Seu Agente Agora
            </h2>

            {/* Subtitle */}
            <p className="text-muted-foreground mb-6">
              Comece com um template pronto e personalize para o seu negócio. 
              Seu agente pode responder clientes 24/7 automaticamente.
            </p>

            {/* Features */}
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300 rounded-full text-xs font-medium">
                <Sparkles className="w-3 h-3" />
                IA Generativa
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
                WhatsApp
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300 rounded-full text-xs font-medium">
                24/7
              </span>
            </div>

            {/* CTA Button */}
            <Button size="lg" className="bg-violet-600 hover:bg-violet-700 text-white gap-2">
              <Bot className="w-5 h-5" />
              Criar Meu Agente
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
