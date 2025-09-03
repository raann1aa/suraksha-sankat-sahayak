import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import UserProfile from "./components/UserProfile";
import EmergencyContacts from "./components/EmergencyContacts";
import FloodReporting from "./components/FloodReporting";
import AlertSystem from "./components/AlertSystem";
import LanguageSelector from "./components/LanguageSelector";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/emergency-contacts" element={<EmergencyContacts />} />
          <Route path="/flood-reporting" element={<FloodReporting />} />
          <Route path="/alert-system" element={<AlertSystem />} />
          <Route path="/language-selector" element={<LanguageSelector />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
