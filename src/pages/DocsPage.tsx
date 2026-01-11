import { DashboardLayout } from '@/layouts/DashboardLayout';
import { BookOpen, ExternalLink, FileText, Video, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const docCategories = [
  {
    title: 'Primeiros Passos',
    icon: FileText,
    color: 'from-violet-500 to-purple-600',
    articles: [
      'Como criar seu primeiro agente',
      'Configurando integrações',
      'Entendendo o pipeline CRM',
    ]
  },
  {
    title: 'Tutoriais em Vídeo',
    icon: Video,
    color: 'from-blue-500 to-cyan-600',
    articles: [
      'Tour completo da plataforma',
      'Configurando disparos automáticos',
      'Treinando sua base de conhecimento',
    ]
  },
  {
    title: 'FAQ',
    icon: HelpCircle,
    color: 'from-green-500 to-emerald-600',
    articles: [
      'Perguntas frequentes',
      'Limites e planos',
      'Suporte técnico',
    ]
  },
];

export default function DocsPage() {
  return (
    <DashboardLayout>
      <div className="p-4 lg:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Documentação</h1>
            <p className="text-sm text-muted-foreground mt-1">Aprenda a usar todas as funcionalidades da plataforma</p>
          </div>
          <Button variant="outline" className="gap-2">
            <ExternalLink className="w-4 h-4" />
            Abrir Central de Ajuda
          </Button>
        </div>

        {/* Hero Card */}
        <div className="bg-gradient-to-br from-violet-500 to-blue-600 rounded-2xl p-6 lg:p-8 text-white">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl lg:text-2xl font-bold mb-2">Bem-vindo à Documentação</h2>
              <p className="text-white/80 max-w-xl">
                Aqui você encontra guias, tutoriais e respostas para todas as suas dúvidas sobre o CNPJ Master.
                Explore os recursos abaixo ou use a busca para encontrar o que precisa.
              </p>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {docCategories.map((category) => (
            <div key={category.title} className="bg-card rounded-xl border border-border p-5">
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center`}>
                  <category.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-foreground">{category.title}</h3>
              </div>

              {/* Articles List */}
              <ul className="space-y-2">
                {category.articles.map((article, index) => (
                  <li key={index}>
                    <button className="w-full text-left text-sm text-muted-foreground hover:text-violet-600 dark:hover:text-violet-400 transition-colors py-1.5 px-2 rounded-lg hover:bg-muted/50">
                      {article}
                    </button>
                  </li>
                ))}
              </ul>

              {/* See All Link */}
              <button className="mt-4 text-sm font-medium text-violet-600 dark:text-violet-400 hover:underline">
                Ver todos →
              </button>
            </div>
          ))}
        </div>

        {/* Help Card */}
        <div className="bg-muted/50 rounded-xl p-6 text-center">
          <HelpCircle className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-semibold text-foreground mb-1">Precisa de mais ajuda?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Nossa equipe de suporte está pronta para ajudar você.
          </p>
          <Button variant="outline">Falar com Suporte</Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
