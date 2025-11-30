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

      {/* Much stronger overlay for maximum text readability */}
      <div className="absolute inset-0 bg-black/60" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />

      <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight text-white mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700 drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] [text-shadow:_0_2px_10px_rgb(0_0_0_/_80%)]" style={{ animationDelay: '200ms' }}>
          {t('hero.title')}
        </h1>
        <p className="text-xl md:text-2xl text-white font-light mb-3 animate-in fade-in slide-in-from-bottom-4 duration-700 drop-shadow-[0_3px_12px_rgba(0,0,0,0.9)] [text-shadow:_0_2px_8px_rgb(0_0_0_/_70%)]" style={{ animationDelay: '400ms' }}>
          {t('hero.subtitle')}
        </p>
        <p className="text-base md:text-lg text-white max-w-3xl mb-10 font-light tracking-wide animate-in fade-in slide-in-from-bottom-4 duration-700 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] [text-shadow:_0_2px_6px_rgb(0_0_0_/_60%)]" style={{ animationDelay: '600ms' }}>
          {t('hero.description')}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: '800ms' }}>
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
