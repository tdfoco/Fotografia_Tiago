import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import DualPortfolioGrid from "@/components/DualPortfolioGrid";
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
        <DualPortfolioGrid />
        <About />
        <Footer />
      </main>
    </>
  );
};

export default Index;
