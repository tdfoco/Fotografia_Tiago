import { useState, useEffect } from "react";
import { ArrowDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/lib/supabase";
import type { HeroImage } from "@/lib/supabase";

// Fisher-Yates shuffle algorithm for randomizing arrays
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

interface HeroProps {
  page?: string;
}

const Hero = ({ page = 'home' }: HeroProps) => {
  const { t } = useLanguage();
  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchHeroImages = async () => {
      // Fetch all active hero images
      const { data, error } = await supabase
        .from('hero_images')
        .select('*')
        .eq('active', true);

      if (error) {
        console.error('Error fetching hero images:', error);
        return;
      }

      if (data && data.length > 0) {
        // Filter on the client side to handle null values properly
        let filtered;
        if (page === 'home') {
          // For home page, include images with page='home' OR page=null
          filtered = data.filter(img => !img.page || img.page === 'home');
        } else {
          // For other pages, only include exact matches
          filtered = data.filter(img => img.page === page);
        }

        // Randomize the filtered images
        setHeroImages(shuffleArray(filtered));
      }
    };

    fetchHeroImages();
  }, [page]);

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

      {/* Stronger overlay to ensure text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />

      <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight text-white mb-4 animate-fade-in drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
          {t('hero.title')}
        </h1>
        <p className="text-xl md:text-2xl text-white/95 font-light mb-3 animate-fade-in drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
          {t('hero.subtitle')}
        </p>
        <p className="text-base md:text-lg text-white/90 max-w-3xl mb-10 animate-fade-in font-light tracking-wide drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]">
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
