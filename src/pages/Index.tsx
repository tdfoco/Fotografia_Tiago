import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import PhotoGrid from "@/components/PhotoGrid";
import DesignGrid from "@/components/DesignGrid";
import About from "@/components/About";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

import { SEO } from "@/components/SEO";

const Index = () => {
  const { t } = useLanguage();

  return (
    <>
      <SEO />
      <Navigation />
      <main className="min-h-screen">
        <Hero page="home" />

        {/* Photography Section */}
        <PhotoGrid
          showHeader={true}
          showFilters={false}
          limit={6}
        />
        <div className="text-center pb-20">
          <a
            href="/photography"
            className="inline-block px-8 py-3 bg-accent text-accent-foreground rounded-full font-medium hover:bg-accent/90 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-accent/50"
          >
            {t('portfolio.viewMore') || 'Ver mais fotografias'}
          </a>
        </div>

        {/* Design Projects Section */}
        <div className="bg-secondary/20">
          <DesignGrid
            showHeader={true}
            showFilters={false}
            limit={6}
          />
          <div className="text-center pb-20">
            <a
              href="/design"
              className="inline-block px-8 py-3 bg-accent text-accent-foreground rounded-full font-medium hover:bg-accent/90 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-accent/50"
            >
              {t('design.viewMore') || 'Ver mais projetos'}
            </a>
          </div>
        </div>

        <About />
        <Footer />
      </main>
    </>
  );
};

export default Index;
