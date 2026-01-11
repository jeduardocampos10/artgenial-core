import { useState } from 'react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { MessageSquare, Search, Circle, User, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

// Mock conversations
const mockConversations = [
  { 
    id: '1', 
    name: 'João Silva', 
    lastMessage: 'Olá, gostaria de saber mais sobre...', 
    time: '2 min',
    unread: true,
    resolved: false
  },
  { 
    id: '2', 
    name: 'Maria Santos', 
    lastMessage: 'Obrigado pelo atendimento!', 
    time: '15 min',
    unread: false,
    resolved: true
  },
  { 
    id: '3', 
    name: 'Pedro Costa', 
    lastMessage: 'Qual o preço do plano premium?', 
    time: '1h',
    unread: true,
    resolved: false
  },
  { 
    id: '4', 
    name: 'Ana Oliveira', 
    lastMessage: 'Preciso de ajuda com a integração', 
    time: '3h',
    unread: false,
    resolved: false
  },
];

export default function ConversationsPage() {
  const [selectedTab, setSelectedTab] = useState('unresolved');
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = mockConversations.filter(conv => {
    const matchesSearch = conv.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = selectedTab === 'all' || (selectedTab === 'unresolved' && !conv.resolved);
    return matchesSearch && matchesTab;
  });

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-3.5rem)] lg:h-[calc(100vh-3.5rem)] flex">
        {/* Left Panel - Conversations List */}
        <div className="w-full sm:w-80 lg:w-96 border-r border-border flex flex-col bg-card">
          {/* Header */}
          <div className="p-4 border-b border-border space-y-4">
            <h1 className="text-xl font-bold text-foreground">Conversas</h1>
            
            {/* Tabs */}
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="unresolved" className="text-sm">
                  Não Resolvidas
                  <span className="ml-1.5 px-1.5 py-0.5 text-[10px] bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300 rounded-full">
                    {mockConversations.filter(c => !c.resolved).length}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="all" className="text-sm">Todas</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar conversas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-muted/50 border-0"
              />
            </div>
          </div>

          {/* Conversations List */}
          <ScrollArea className="flex-1">
            <div className="divide-y divide-border">
              {filteredConversations.length > 0 ? (
                filteredConversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation.id)}
                    className={cn(
                      "w-full p-4 text-left hover:bg-muted/50 transition-colors",
                      selectedConversation === conversation.id && "bg-violet-50 dark:bg-violet-500/10"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-semibold text-sm">
                          {conversation.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-medium text-foreground truncate">{conversation.name}</p>
                          <span className="text-[10px] text-muted-foreground flex-shrink-0">{conversation.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate mt-0.5">
                          {conversation.lastMessage}
                        </p>
                      </div>

                      {/* Unread indicator */}
                      {conversation.unread && (
                        <Circle className="w-2.5 h-2.5 fill-violet-500 text-violet-500 flex-shrink-0 mt-1.5" />
                      )}
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-8 text-center">
                  <MessageSquare className="w-10 h-10 text-muted-foreground/40 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Nenhuma conversa encontrada</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Right Panel - Chat View */}
        <div className="hidden sm:flex flex-1 flex-col bg-background">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="h-16 border-b border-border px-6 flex items-center gap-3 bg-card">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {mockConversations.find(c => c.id === selectedConversation)?.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    {mockConversations.find(c => c.id === selectedConversation)?.name}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Circle className="w-2 h-2 fill-green-500 text-green-500" />
                    Online
                  </p>
                </div>
              </div>

              {/* Chat Messages - Placeholder */}
              <div className="flex-1 p-6 flex items-center justify-center">
                <p className="text-muted-foreground">Carregando mensagens...</p>
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-border bg-card">
                <Input 
                  placeholder="Digite sua mensagem..." 
                  className="bg-muted/50 border-0"
                />
              </div>
            </>
          ) : (
            /* Empty State */
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center max-w-sm">
                <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-10 h-10 text-muted-foreground/50" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Nenhuma conversa selecionada
                </h3>
                <p className="text-sm text-muted-foreground">
                  Selecione uma conversa à esquerda para ver as mensagens
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
