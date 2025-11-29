import { useState, useEffect } from "react";
import { ArrowDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/lib/supabase";
import type { HeroImage } from "@/lib/supabase";

const Hero = () => {
  const { t } = useLanguage();
  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchHeroImages = async () => {
      const { data } = await supabase
        .from('hero_images')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: false });

      if (data && data.length > 0) {
        setHeroImages(data);
      }
    };

    fetchHeroImages();
  }, []);

  useEffect(() => {
    if (heroImages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [heroImages]);

  const scrollToGallery = () => {
    const gallery = document.getElementById('gallery');
    gallery?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-black via-purple-900/20 to-black">
      {/* Background Images Slideshow */}
      {heroImages.length > 0 && heroImages.map((image, index) => (
        <div
          key={image.id}
          className={`absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
          style={{ backgroundImage: `url(${image.url})` }}
        />
      ))}

      {/* Animated gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 ${heroImages.length > 0 ? 'bg-black/30' : ''}`} />

      <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight text-white mb-4 animate-fade-in">
          {t('hero.title')}
        </h1>
        <p className="text-xl md:text-2xl text-white/90 font-light mb-3 animate-fade-in">
          {t('hero.subtitle')}
        </p>
        <p className="text-base md:text-lg text-white/80 max-w-3xl mb-10 animate-fade-in font-light tracking-wide">
          {t('hero.description')}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in justify-center">
          <a
            href="/photography"
            className="px-8 py-3 bg-accent text-accent-foreground rounded-full font-medium hover:bg-accent/90 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-accent/50"
          >
            {t('nav.photography')}
          </a>
          <a
            href="/design"
            className="px-8 py-3 bg-accent text-accent-foreground rounded-full font-medium hover:bg-accent/90 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-accent/50"
          >
            {t('nav.graphicDesign')}
          </a>
          <a
            href="/contact"
            className="px-8 py-3 border-2 border-white text-white rounded-full font-medium hover:bg-white hover:text-foreground transition-all duration-300 hover:scale-105"
          >
            {t('hero.requestQuote')}
          </a>
        </div>

        <button
          onClick={scrollToGallery}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white/80 hover:text-white transition-all duration-300 animate-bounce"
          aria-label="Scroll to gallery"
        >
          <ArrowDown size={32} strokeWidth={1.5} />
        </button>
      </div>
    </section>
  );
};

export default Hero;
