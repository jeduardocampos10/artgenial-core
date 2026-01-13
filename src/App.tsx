import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import SearchPage from "./pages/SearchPage";
import PesquisaPage from "./pages/PesquisaPage";
import LeadsPage from "./pages/LeadsPage";
import IntegrationsPage from "./pages/IntegrationsPage";
import SettingsPage from "./pages/SettingsPage";
import FluxCRMPage from "./pages/FluxCRMPage";
import AgentsPage from "./pages/AgentsPage";
import KnowledgeBasePage from "./pages/KnowledgeBasePage";
import CampaignsPage from "./pages/CampaignsPage";
import ConversationsPage from "./pages/ConversationsPage";
import DocsPage from "./pages/DocsPage";
import MetricsPage from "./pages/MetricsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename="/app">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/pesquisa" element={<PesquisaPage />} />
          <Route path="/leads" element={<LeadsPage />} />
          <Route path="/integrations" element={<IntegrationsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/conversations" element={<ConversationsPage />} />
          <Route path="/crm" element={<FluxCRMPage />} />
          <Route path="/agents" element={<AgentsPage />} />
          <Route path="/knowledge" element={<KnowledgeBasePage />} />
          <Route path="/campaigns" element={<CampaignsPage />} />
          <Route path="/docs" element={<DocsPage />} />
          <Route path="/metrics" element={<MetricsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter >
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
