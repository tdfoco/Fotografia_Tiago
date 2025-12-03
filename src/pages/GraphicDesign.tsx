import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import DesignGrid from "@/components/DesignGrid";
import RankingSection from "@/components/RankingSection";
import { pb } from "@/lib/pocketbase";
import { getImageUrl } from "@/hooks/usePocketBaseData";
import { useLanguage } from "@/contexts/LanguageContext";
import { SEO } from "@/components/SEO";

const GraphicDesign = () => {
    const { t } = useLanguage();
    const [heroImage, setHeroImage] = useState<string | null>(null);

    useEffect(() => {
        const fetchHeroImage = async () => {
            try {
                const record = await pb.collection('hero_images').getFirstListItem('page="design" && active=true', {
                    sort: '-created',
                });

                if (record) {
                    setHeroImage(getImageUrl(record.collectionId, record.id, record.image));
                }
            } catch (error) {
                console.error('Error fetching hero image:', error);
            }
        };

        fetchHeroImage();
    }, []);

    return (
        <>
            <SEO title="Design Gráfico" description={t('design.description')} />
            <Navigation />
            <main className="min-h-screen pt-20 bg-background">
                {/* Hero Section */}
                <section className="relative py-32 px-4 overflow-hidden">
                    {/* Background Image */}
                    {heroImage && (
                        <div
                            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 z-0"
                            style={{ backgroundImage: `url(${heroImage})` }}
                        />
                    )}
                    {/* Background Gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br from-background via-secondary/20 to-background z-0 ${heroImage ? 'opacity-80' : ''}`} />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-accent/10 blur-[120px] rounded-full pointer-events-none" />

                    <div className="relative z-10 max-w-4xl mx-auto text-center">
                        <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-8 animate-fade-in bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                            {t('design.title')}
                        </h1>
                        <div className="w-32 h-1.5 bg-gradient-to-r from-accent to-purple-500 mx-auto mb-10 rounded-full shadow-[0_0_20px_rgba(0,163,255,0.5)]" />
                        <p className="text-xl md:text-2xl text-muted-foreground font-light leading-relaxed max-w-2xl mx-auto">
                            {t('design.description')}
                        </p>
                    </div>
                </section>

                {/* Design Portfolio - Using DesignGrid component */}
                <DesignGrid
                    showHeader={false}
                    showFilters={true}
                />
                <RankingSection />
            </main>
            <Footer />
        </>
    );
};

export default GraphicDesign;
