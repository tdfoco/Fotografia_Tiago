import HeroModern from "@/components/HeroModern";
import UnifiedPortfolioGrid from "@/components/UnifiedPortfolioGrid";
import RankingSection from "@/components/RankingSection";
import About from "@/components/About";
import Testimonials from "@/components/Testimonials";

import { SEO } from "@/components/SEO";

const Index = () => {
  return (
    <>
      <SEO />
      <main className="min-h-screen">
        <HeroModern page="home" />
        <UnifiedPortfolioGrid />
        <RankingSection />
        <Testimonials />
        <About />
      </main>
    </>
  );
};

export default Index;
