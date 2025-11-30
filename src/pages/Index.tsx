import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import PhotoGrid from "@/components/PhotoGrid";
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
        <PhotoGrid />
        <About />
        <Footer />
      </main>
    </>
  );
};

export default Index;
