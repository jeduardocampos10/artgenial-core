import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import SearchPage from "./pages/SearchPage";
import LeadsPage from "./pages/LeadsPage";
import IntegrationsPage from "./pages/IntegrationsPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/leads" element={<LeadsPage />} />
          <Route path="/integrations" element={<IntegrationsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          {/* New routes for updated sidebar */}
          <Route path="/conversations" element={<DashboardPage />} />
          <Route path="/crm" element={<DashboardPage />} />
          <Route path="/agents" element={<DashboardPage />} />
          <Route path="/knowledge" element={<DashboardPage />} />
          <Route path="/campaigns" element={<DashboardPage />} />
          <Route path="/docs" element={<DashboardPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
