import { useState, useEffect, useRef } from "react";
import { ArrowDown, Play, Pause } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { pb } from "@/lib/pocketbase";
import { HeroImage, getImageUrl } from "@/hooks/usePocketBaseData";
import { Button } from "@/components/ui/button";

// Fisher-Yates shuffle algorithm
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

const HeroModern = ({ page = 'home' }: HeroProps) => {
    const { t } = useLanguage();
    const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [scrollY, setScrollY] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const parallaxRef = useRef<HTMLDivElement>(null);

    // Parallax Effect
    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Fetch Images
    useEffect(() => {
        const fetchHeroImages = async () => {
            try {
                const records = await pb.collection('hero_images').getFullList<HeroImage>({
                    filter: 'active = true',
                });

                if (records && records.length > 0) {
                    let filtered;
                    if (page === 'home') {
                        filtered = records.filter(img => !img.page || img.page === 'home');
                    } else {
                        filtered = records.filter(img => img.page === page);
                    }
                    setHeroImages(shuffleArray(filtered));
                }
            } catch (error) {
                console.error('Error fetching hero images:', error);
            }
        };

        fetchHeroImages();
    }, [page]);

    // Slideshow
    useEffect(() => {
        if (heroImages.length <= 1 || !isPlaying) return;

        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
        }, 6000);

        return () => clearInterval(interval);
    }, [heroImages, isPlaying]);

    const scrollToContent = () => {
        window.scrollTo({
            top: window.innerHeight,
            behavior: 'smooth'
        });
    };

    return (
        <section
            ref={parallaxRef}
            className="relative h-screen w-full overflow-hidden bg-black"
        >
            {/* Parallax Background Layer */}
            <div
                className="absolute inset-0 w-full h-full transition-transform duration-100 ease-out will-change-transform"
                style={{ transform: `translateY(${scrollY * 0.5}px)` }}
            >
                {/* Background Images Slideshow */}
                {heroImages.length > 0 ? (
                    heroImages.map((image, index) => (
                        <div
                            key={image.id}
                            className={`absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out ${index === currentImageIndex ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
                                }`}
                            style={{ backgroundImage: `url(${getImageUrl(image.collectionId, image.id, image.image)})` }}
                        />
                    ))
                ) : (
                    // Fallback gradient if no images
                    <div className="absolute inset-0 bg-gradient-to-br from-deep-black via-purple-900/20 to-deep-black" />
                )}

                {/* Overlay Gradients for Depth */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90" />
                <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
            </div>

            {/* Content Layer - Parallax (slower) */}
            <div
                className="relative h-full flex flex-col items-center justify-center text-center px-4 z-10"
                style={{ transform: `translateY(${scrollY * 0.2}px)` }}
            >
                {/* Futuristic Decorative Elements */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-electric-blue/10 rounded-full blur-[100px] pointer-events-none animate-pulse-slow" />

                <div className="space-y-6 max-w-5xl mx-auto">
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight text-white animate-fade-in-up drop-shadow-2xl">
                        <span className="block bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/70">
                            {t('hero.title')}
                        </span>
                    </h1>

                    <div className="w-24 h-1 bg-gradient-to-r from-electric-blue to-vibrant-purple mx-auto rounded-full shadow-[0_0_15px_rgba(58,139,253,0.8)] animate-width-grow" />

                    <p className="text-xl md:text-3xl text-gray-200 font-light tracking-wide max-w-3xl mx-auto animate-fade-in-up delay-200 drop-shadow-lg">
                        {t('hero.subtitle')}
                    </p>

                    <p className="text-base md:text-lg text-gray-400 font-light max-w-2xl mx-auto animate-fade-in-up delay-300">
                        {t('hero.description')}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 animate-fade-in-up delay-500">
                        <Button
                            size="lg"
                            className="bg-electric-blue hover:bg-electric-blue/80 text-white rounded-full px-8 py-6 text-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(58,139,253,0.4)]"
                            asChild
                        >
                            <a href="/photography">{t('nav.photography')}</a>
                        </Button>

                        <Button
                            size="lg"
                            variant="outline"
                            className="border-white/20 bg-white/5 backdrop-blur-sm text-white hover:bg-white/10 hover:border-white/40 rounded-full px-8 py-6 text-lg font-medium transition-all duration-300 hover:scale-105"
                            asChild
                        >
                            <a href="/design">{t('nav.graphicDesign')}</a>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Bottom Controls & Scroll Indicator */}
            <div className="absolute bottom-8 left-0 right-0 z-20 flex flex-col items-center gap-6">
                <div className="flex items-center gap-4">
                    {/* Slideshow Controls */}
                    {heroImages.length > 1 && (
                        <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="p-2 rounded-full bg-white/10 backdrop-blur-md text-white/70 hover:text-white hover:bg-white/20 transition-all"
                            aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
                        >
                            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                        </button>
                    )}

                    {/* Slide Indicators */}
                    <div className="flex gap-2">
                        {heroImages.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentImageIndex(idx)}
                                className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentImageIndex
                                        ? "w-8 bg-electric-blue shadow-[0_0_10px_rgba(58,139,253,0.8)]"
                                        : "w-1.5 bg-white/30 hover:bg-white/50"
                                    }`}
                                aria-label={`Go to slide ${idx + 1}`}
                            />
                        ))}
                    </div>
                </div>

                <button
                    onClick={scrollToContent}
                    className="text-white/50 hover:text-white transition-all duration-300 animate-bounce hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] rounded-full p-2"
                    aria-label="Scroll down"
                >
                    <ArrowDown size={32} strokeWidth={1} />
                </button>
            </div>
        </section>
    );
};

export default HeroModern;
