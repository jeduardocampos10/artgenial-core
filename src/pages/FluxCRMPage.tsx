import { DashboardLayout } from '@/layouts/DashboardLayout';
import { AlertTriangle, Plus, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

const columns = [
  { 
    id: 'capture', 
    title: 'Captura do Lead', 
    color: 'bg-blue-500',
    cards: [
      { id: '1', name: 'João Silva', company: 'TechCorp', time: '2 min atrás' },
      { id: '2', name: 'Maria Santos', company: 'DigitalMkt', time: '15 min atrás' },
    ]
  },
  { 
    id: 'support', 
    title: 'Suporte', 
    color: 'bg-orange-500',
    cards: [
      { id: '3', name: 'Pedro Costa', company: 'StartupXYZ', time: '1h atrás' },
    ]
  },
  { 
    id: 'commercial', 
    title: 'Lead Comercial', 
    color: 'bg-violet-500',
    cards: []
  },
  { 
    id: 'service', 
    title: 'Atendimento', 
    color: 'bg-green-500',
    cards: [
      { id: '4', name: 'Ana Oliveira', company: 'MegaStore', time: '3h atrás' },
      { id: '5', name: 'Carlos Lima', company: 'FastDelivery', time: '5h atrás' },
    ]
  },
];

export default function FluxCRMPage() {
  return (
    <DashboardLayout>
      <div className="p-4 lg:p-6 space-y-4 h-full flex flex-col">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Flux CRM</h1>
            <p className="text-sm text-muted-foreground mt-1">Gerencie seus leads no pipeline</p>
          </div>
          <Button className="gap-2 bg-violet-600 hover:bg-violet-700 text-white">
            <Plus className="w-4 h-4" />
            Nova Coluna
          </Button>
        </div>

        {/* Pro Plan Warning */}
        <div className="flex items-center gap-3 px-4 py-3 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
          <p className="text-sm text-amber-800 dark:text-amber-200">
            <strong>Atenção:</strong> Para utilizar automações, é necessário plano Pro
          </p>
        </div>

        {/* Kanban Board */}
        <div className="flex-1 min-h-0">
          <ScrollArea className="h-full w-full">
            <div className="flex gap-4 pb-4 min-w-max">
              {columns.map((column) => (
                <div 
                  key={column.id}
                  className="w-[300px] flex-shrink-0 bg-muted/30 rounded-xl p-3"
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${column.color}`} />
                      <h3 className="font-semibold text-foreground">{column.title}</h3>
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                        {column.cards.length}
                      </span>
                    </div>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Cards */}
                  <div className="space-y-2">
                    {column.cards.length > 0 ? (
                      column.cards.map((card) => (
                        <div 
                          key={card.id}
                          className="bg-card p-3 rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                        >
                          <p className="font-medium text-foreground text-sm">{card.name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{card.company}</p>
                          <p className="text-[10px] text-muted-foreground/70 mt-2">{card.time}</p>
                        </div>
                      ))
                    ) : (
                      <div className="py-8 text-center">
                        <p className="text-xs text-muted-foreground">Nenhum lead</p>
                      </div>
                    )}

                    {/* Add Card Button */}
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-muted-foreground hover:text-foreground text-sm h-9"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar lead
                    </Button>
                  </div>
                </div>
              ))}

              {/* Add Column */}
              <div className="w-[300px] flex-shrink-0">
                <Button 
                  variant="outline" 
                  className="w-full h-full min-h-[200px] border-dashed text-muted-foreground hover:text-foreground hover:border-foreground/30"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Adicionar Coluna
                </Button>
              </div>
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </div>
    </DashboardLayout>
  );
}
