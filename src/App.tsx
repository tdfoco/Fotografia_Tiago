import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { useImageProtection } from "@/hooks/useImageProtection";
import { AdminLayout } from "./features/admin/shared/layouts/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import ModernLayout from "./components/layout/ModernLayout";
import { GoogleAnalytics } from "./components/integrations/GoogleAnalytics";
import Chatbot from "@/components/Chatbot";

// Lazy Load Pages
const Index = lazy(() => import("./pages/Index"));
const Photography = lazy(() => import("./pages/Photography"));
const GraphicDesign = lazy(() => import("./pages/GraphicDesign"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const Services = lazy(() => import("./pages/Services"));
const Contact = lazy(() => import("./pages/Contact"));
const Admin = lazy(() => import("./pages/Admin"));
const Ranking = lazy(() => import("./pages/Ranking"));
const Favorites = lazy(() => import("./pages/Favorites"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ClientLogin = lazy(() => import("./pages/ClientLogin"));
const ClientGallery = lazy(() => import("./pages/ClientGallery"));
const BlogIndex = lazy(() => import("./pages/BlogIndex"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const BehindTheScenes = lazy(() => import("./pages/BehindTheScenes"));
const TestimonialsPage = lazy(() => import("./pages/TestimonialsPage"));
const VisualSearchPage = lazy(() => import("./pages/VisualSearchPage"));

// Lazy Load Admin Features
const DashboardPage = lazy(() => import("./features/admin/dashboard/DashboardPage"));
const AnalyticsPage = lazy(() => import("./features/admin/analytics/AnalyticsPage"));
const AILabPage = lazy(() => import("./features/admin/ai-lab/AILabPage"));
const HeroImagesPage = lazy(() => import("./features/admin/heroes/HeroImagesPage"));
const CommentsPage = lazy(() => import("./features/admin/comments/CommentsPage"));
const SecurityPage = lazy(() => import("./features/admin/security/SecurityPage"));
const PhotosPage = lazy(() => import("./features/admin/pages/PhotosPage"));
const DesignPage = lazy(() => import("./features/admin/pages/DesignPage"));
const ClientsPage = lazy(() => import("./features/admin/pages/ClientsPage"));
const BlogPage = lazy(() => import("./features/admin/blog/BlogPage"));
const PostEditor = lazy(() => import("./features/admin/blog/PostEditor"));
const AdminTestimonialsPage = lazy(() => import("./features/admin/pages/TestimonialsPage"));

const queryClient = new QueryClient();

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-deep-black">
    <div className="w-16 h-16 border-4 border-electric-blue/30 border-t-electric-blue rounded-full animate-spin" />
  </div>
);

const App = () => {
  // Enable global image protection
  useImageProtection();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Chatbot />
            <BrowserRouter>
              <GoogleAnalytics measurementId="G-XXXXXXXXXX" />
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  {/* Public Routes with Modern Layout */}
                  <Route element={<ModernLayout />}>
                    <Route path="/" element={<Index />} />
                    <Route path="/photography" element={<Photography />} />
                    <Route path="/design" element={<GraphicDesign />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/ranking" element={<Ranking />} />
                    <Route path="/favorites" element={<Favorites />} />
                    <Route path="/blog" element={<BlogIndex />} />
                    <Route path="/blog/:slug" element={<BlogPost />} />
                    <Route path="/behind-the-scenes" element={<BehindTheScenes />} />
                    <Route path="/testimonials" element={<TestimonialsPage />} />
                    <Route path="/visual-search" element={<VisualSearchPage />} />
                  </Route>

                  {/* Admin Login (Public) */}
                  <Route path="/admin/login" element={<Admin />} />

                  {/* New Modular Admin Panel with Futuristic Layout */}
                  <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
                    <Route index element={<DashboardPage />} />
                    <Route path="photography" element={<PhotosPage />} />
                    <Route path="design" element={<DesignPage />} />
                    <Route path="clients" element={<ClientsPage />} />
                    <Route path="analytics" element={<AnalyticsPage />} />
                    <Route path="ai-lab" element={<AILabPage />} />
                    <Route path="heroes" element={<HeroImagesPage />} />
                    <Route path="comments" element={<CommentsPage />} />
                    <Route path="blog" element={<BlogPage />} />
                    <Route path="blog/new" element={<PostEditor />} />
                    <Route path="blog/edit/:id" element={<PostEditor />} />
                    <Route path="testimonials" element={<AdminTestimonialsPage />} />
                    <Route path="content" element={<div className="p-6">Conteúdo (Em Desenvolvimento)</div>} />
                    <Route path="security" element={<SecurityPage />} />
                    <Route path="settings" element={<div className="p-6">Configurações (Em Desenvolvimento)</div>} />
                  </Route>
                  <Route path="/client" element={<ClientLogin />} />
                  <Route path="/client/gallery" element={<ClientGallery />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
