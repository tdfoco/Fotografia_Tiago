import { useState, useEffect } from "react";
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
            <SEO
                title="Design Gráfico"
                description="Portfólio de design gráfico: identidade visual, branding, social media e UI design."
                url="https://tdfoco.cloud/design"
            />
            <div className="min-h-screen bg-deep-black pt-20">
                {/* Hero Section */}
                <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
                    {/* Background Image */}
                    {heroImage && (
                        <div
                            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 z-0 animate-fade-in"
                            style={{ backgroundImage: `url(${heroImage})` }}
                        />
                    )}

                    {/* Background Gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-b from-transparent via-deep-black/50 to-deep-black z-0 ${heroImage ? 'opacity-90' : ''}`} />

                    <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                        <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6 animate-fade-in bg-clip-text text-transparent bg-gradient-to-r from-white via-vibrant-purple to-white">
                            {t('design.title')}
                        </h1>
                        <div className="w-24 h-1.5 bg-vibrant-purple mx-auto mb-8 rounded-full shadow-[0_0_15px_rgba(124,58,237,0.8)]" />
                        <p className="text-xl md:text-2xl text-gray-300 font-light max-w-2xl mx-auto leading-relaxed">
                            {t('design.description')}
                        </p>
                    </div>
                </section>

                <div className="container mx-auto px-4 py-12">
                    <DesignGrid />
                </div>

                <RankingSection />
            </div>
        </>
    );
};

export default GraphicDesign;
