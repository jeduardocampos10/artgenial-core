import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Database, Plus, FileText, Upload, Link } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function KnowledgeBasePage() {
  return (
    <DashboardLayout>
      <div className="p-4 lg:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Base de Conhecimento</h1>
            <p className="text-sm text-muted-foreground mt-1">Treine seus agentes com documentos e informações</p>
          </div>
          <Button className="gap-2 bg-violet-600 hover:bg-violet-700 text-white">
            <Plus className="w-4 h-4" />
            Adicionar Documento
          </Button>
        </div>

        {/* Empty State */}
        <div className="flex-1 flex items-center justify-center min-h-[60vh]">
          <div className="max-w-lg w-full bg-card rounded-2xl border border-border p-8 text-center shadow-sm">
            {/* Icon */}
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center mx-auto mb-6">
              <Database className="w-10 h-10 text-white" />
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Monte Sua Base de Conhecimento
            </h2>

            {/* Subtitle */}
            <p className="text-muted-foreground mb-6">
              Faça upload de documentos, PDFs, textos e links para treinar seus agentes 
              com informações específicas do seu negócio.
            </p>

            {/* Upload Options */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              <button className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border hover:border-violet-500 hover:bg-violet-50 dark:hover:bg-violet-500/10 transition-colors">
                <FileText className="w-6 h-6 text-violet-600" />
                <span className="text-sm font-medium">Documentos</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border hover:border-violet-500 hover:bg-violet-50 dark:hover:bg-violet-500/10 transition-colors">
                <Upload className="w-6 h-6 text-violet-600" />
                <span className="text-sm font-medium">Upload PDF</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border hover:border-violet-500 hover:bg-violet-50 dark:hover:bg-violet-500/10 transition-colors">
                <Link className="w-6 h-6 text-violet-600" />
                <span className="text-sm font-medium">URLs</span>
              </button>
            </div>

            {/* CTA Button */}
            <Button size="lg" className="bg-violet-600 hover:bg-violet-700 text-white gap-2">
              <Plus className="w-5 h-5" />
              Começar Agora
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
