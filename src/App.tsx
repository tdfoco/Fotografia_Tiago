import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { useImageProtection } from "@/hooks/useImageProtection";
import Index from "./pages/Index";
import Photography from "./pages/Photography";
import GraphicDesign from "./pages/GraphicDesign";
import AboutPage from "./pages/AboutPage";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import Ranking from "./pages/Ranking";
import Favorites from "./pages/Favorites";
import NotFound from "./pages/NotFound";
import ClientLogin from "./pages/ClientLogin";
import ClientGallery from "./pages/ClientGallery";

import Chatbot from "@/components/Chatbot";

const queryClient = new QueryClient();

const App = () => {
  // Enable global image protection
  useImageProtection();

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Chatbot />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/photography" element={<Photography />} />
              <Route path="/design" element={<GraphicDesign />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/services" element={<Services />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/ranking" element={<Ranking />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/client" element={<ClientLogin />} />
              <Route path="/client/gallery" element={<ClientGallery />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
};

export default App;
