import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import PhotoGrid from "@/components/PhotoGrid";
import About from "@/components/About";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <>
      <Navigation />
      <main className="min-h-screen">
        <Hero />
        <PhotoGrid />
        <About />
        <Footer />
      </main>
    </>
  );
};

export default Index;
