import { ArrowDown } from "lucide-react";
import { useEffect, useState } from "react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import gallery5 from "@/assets/gallery-5.jpg";
import gallery6 from "@/assets/gallery-6.jpg";
import gallery7 from "@/assets/gallery-7.jpg";
import gallery8 from "@/assets/gallery-8.jpg";

const Hero = () => {
  const [shuffledImages, setShuffledImages] = useState<string[]>([]);

  useEffect(() => {
    const images = [gallery1, gallery2, gallery3, gallery4, gallery5, gallery6, gallery7, gallery8];
    const shuffled = [...images].sort(() => Math.random() - 0.5);
    setShuffledImages(shuffled);
  }, []);

  const scrollToGallery = () => {
    const gallery = document.getElementById('gallery');
    gallery?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative h-screen w-full overflow-hidden">
      <Carousel
        opts={{ loop: true }}
        plugins={[
          Fade(),
          Autoplay({
            delay: 4000,
          }),
        ]}
        className="absolute inset-0"
      >
        <CarouselContent className="h-screen -ml-0">
          {shuffledImages.map((image, index) => (
            <CarouselItem key={index} className="h-screen pl-0">
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000"
                style={{ backgroundImage: `url(${image})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      
      <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight text-white mb-4 animate-fade-in">
          Visual Stories
        </h1>
        <p className="text-lg md:text-xl text-white/90 max-w-2xl mb-12 animate-fade-in font-light tracking-wide">
          Capturando momentos únicos através das lentes
        </p>
        
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
