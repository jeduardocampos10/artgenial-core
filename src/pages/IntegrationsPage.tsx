import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { 
  Link2, 
  CheckCircle2, 
  XCircle, 
  ExternalLink,
  FileSpreadsheet,
  Zap,
  HelpCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface IntegrationCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  connected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

function IntegrationCard({ 
  title, 
  description, 
  icon, 
  connected, 
  onConnect, 
  onDisconnect 
}: IntegrationCardProps) {
  return (
    <div className="card-corporate p-6">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-foreground">{title}</h3>
            <span className={cn(
              'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
              connected 
                ? 'bg-success/10 text-success' 
                : 'bg-destructive/10 text-destructive'
            )}>
              {connected ? (
                <>
                  <CheckCircle2 className="w-3 h-3" />
                  Autorizado
                </>
              ) : (
                <>
                  <XCircle className="w-3 h-3" />
                  Não conectado
                </>
              )}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            {description}
          </p>
          {connected ? (
            <Button 
              variant="outline" 
              size="sm"
              onClick={onDisconnect}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              Desconectar
            </Button>
          ) : (
            <Button 
              size="sm"
              className="btn-corporate"
              onClick={onConnect}
            >
              <Link2 className="w-4 h-4 mr-2" />
              Conectar
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function IntegrationsPage() {
  const handleConnect = (integration: string) => {
    console.log(`Connecting to ${integration}...`);
    // In a real app, this would trigger OAuth flow
  };

  const handleDisconnect = (integration: string) => {
    console.log(`Disconnecting from ${integration}...`);
    // In a real app, this would revoke tokens
  };

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-6 space-y-6">
        {/* Page Title */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Integrações</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Conecte suas ferramentas para automatizar o fluxo de trabalho
          </p>
        </div>

        {/* Integration Cards */}
        <div className="grid gap-4 lg:grid-cols-2">
          <IntegrationCard
            title="Google Drive"
            description="Conecte sua conta para salvar leads direto na sua planilha e permitir disparos pelo n8n."
            icon={<FileSpreadsheet className="w-6 h-6 text-green-600" />}
            connected={false}
            onConnect={() => handleConnect('google-drive')}
            onDisconnect={() => handleDisconnect('google-drive')}
          />

          <IntegrationCard
            title="Google Sheets"
            description="Sincronize automaticamente seus leads com uma planilha do Google Sheets."
            icon={<FileSpreadsheet className="w-6 h-6 text-emerald-600" />}
            connected={false}
            onConnect={() => handleConnect('google-sheets')}
            onDisconnect={() => handleDisconnect('google-sheets')}
          />

          <IntegrationCard
            title="n8n Automação"
            description="Configure automações avançadas para disparos de WhatsApp e Email em massa."
            icon={<Zap className="w-6 h-6 text-orange-500" />}
            connected={false}
            onConnect={() => handleConnect('n8n')}
            onDisconnect={() => handleDisconnect('n8n')}
          />
        </div>

        {/* Help Section */}
        <div className="card-corporate p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <HelpCircle className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">
                Precisa de ajuda com integrações?
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Nossa equipe pode ajudar você a configurar as integrações e automatizar 
                seus processos de prospecção.
              </p>
              <Button variant="outline" size="sm">
                <ExternalLink className="w-4 h-4 mr-2" />
                Ver Documentação
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
