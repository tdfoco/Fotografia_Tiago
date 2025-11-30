import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import UnifiedPortfolioGrid from "@/components/UnifiedPortfolioGrid";
import RankingSection from "@/components/RankingSection";
import About from "@/components/About";
import Footer from "@/components/Footer";

import { SEO } from "@/components/SEO";

const Index = () => {
  return (
    <>
      <SEO />
      <Navigation />
      <main className="min-h-screen">
        <Hero page="home" />
        <UnifiedPortfolioGrid />
        <RankingSection />
        <About />
        <Footer />
      </main>
    </>
  );
};

export default Index;
