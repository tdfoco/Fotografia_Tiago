import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Camera, Palette, Users, Building, Sparkles, Package } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { pb } from "@/lib/pocketbase";
import { getImageUrl } from "@/hooks/usePocketBaseData";
import { SEO } from "@/components/SEO";
import BudgetCalculator from "@/components/BudgetCalculator";

const Services = () => {
    const { t } = useLanguage();
    const [heroImage, setHeroImage] = useState<string | null>(null);

    useEffect(() => {
        const fetchHeroImage = async () => {
            try {
                const record = await pb.collection('hero_images').getFirstListItem('page="services" && active=true', {
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

    const photographyServices = [
        {
            icon: Users,
            titleKey: "services.photography.portraits.title",
            descriptionKey: "services.photography.portraits.description",
            featuresKey: "services.photography.portraits.features"
        },
        {
            icon: Camera,
            titleKey: "services.photography.events.title",
            descriptionKey: "services.photography.events.description",
            featuresKey: "services.photography.events.features"
        },
        {
            icon: Building,
            titleKey: "services.photography.urban.title",
            descriptionKey: "services.photography.urban.description",
            featuresKey: "services.photography.urban.features"
        },
        {
            icon: Sparkles,
            titleKey: "services.photography.nature.title",
            descriptionKey: "services.photography.nature.description",
            featuresKey: "services.photography.nature.features"
        },
    ];

    const designServices = [
        {
            icon: Palette,
            titleKey: "services.design.identity.title",
            descriptionKey: "services.design.identity.description",
            featuresKey: "services.design.identity.features"
        },
        {
            icon: Package,
            titleKey: "services.design.branding.title",
            descriptionKey: "services.design.branding.description",
            featuresKey: "services.design.branding.features"
        },
        {
            icon: Users,
            titleKey: "services.design.social.title",
            descriptionKey: "services.design.social.description",
            featuresKey: "services.design.social.features"
        },
        {
            icon: Sparkles,
            titleKey: "services.design.special.title",
            descriptionKey: "services.design.special.description",
            featuresKey: "services.design.special.features"
        },
    ];

    return (
        <>
            <SEO title="Serviços" />
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
                            {t('services.title')}
                        </h1>
                        <div className="w-32 h-1.5 bg-gradient-to-r from-accent to-purple-500 mx-auto mb-10 rounded-full shadow-[0_0_20px_rgba(0,163,255,0.5)]" />
                        <p className="text-xl md:text-2xl text-muted-foreground font-light leading-relaxed max-w-2xl mx-auto">
                            {t('services.description')}
                        </p>
                    </div>
                </section>

                {/* Photography Services */}
                <section className="py-24 px-4 md:px-8 relative">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
                                {t('services.photographyServices')}
                            </h2>
                            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                                {t('services.photographyDesc')}
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            {photographyServices.map((service, index) => (
                                <div
                                    key={index}
                                    className="group relative p-8 rounded-2xl border border-white/5 bg-secondary/30 backdrop-blur-sm hover:bg-secondary/50 transition-all duration-500 hover:border-accent/50 hover:shadow-[0_0_40px_-10px_rgba(0,163,255,0.15)] animate-fade-in overflow-hidden"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500 transform group-hover:scale-110">
                                        <service.icon size={120} />
                                    </div>

                                    <div className="relative z-10">
                                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/20 to-purple-500/20 text-accent mb-8 group-hover:scale-110 transition-transform duration-500 border border-white/5 shadow-inner">
                                            <service.icon size={32} strokeWidth={1.5} />
                                        </div>

                                        <h3 className="text-2xl font-display font-bold mb-4 group-hover:text-accent transition-colors duration-300">
                                            {t(service.titleKey)}
                                        </h3>
                                        <p className="text-muted-foreground mb-8 leading-relaxed">
                                            {t(service.descriptionKey)}
                                        </p>

                                        <ul className="space-y-3">
                                            {(() => {
                                                const features = t(service.featuresKey);
                                                const featuresList = Array.isArray(features) ? features : [];
                                                return (featuresList as string[]).map((feature: string, idx: number) => (
                                                    <li key={idx} className="flex items-center text-sm text-foreground/80 group-hover:text-foreground transition-colors">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-accent mr-3 shadow-[0_0_10px_hsl(var(--accent))]" />
                                                        {feature}
                                                    </li>
                                                ));
                                            })()}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Design Services */}
                <section className="py-24 px-4 md:px-8 bg-secondary/20 relative overflow-hidden">
                    {/* Decorative Elements */}
                    <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 blur-[100px] rounded-full pointer-events-none" />

                    <div className="max-w-7xl mx-auto relative z-10">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
                                {t('services.designServices')}
                            </h2>
                            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                                {t('services.designDesc')}
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            {designServices.map((service, index) => (
                                <div
                                    key={index}
                                    className="group relative p-8 rounded-2xl border border-white/5 bg-background/40 backdrop-blur-md hover:bg-background/60 transition-all duration-500 hover:border-purple-500/50 hover:shadow-[0_0_40px_-10px_rgba(122,63,255,0.15)] animate-fade-in"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <div className="relative z-10">
                                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-accent/20 text-purple-400 mb-8 group-hover:scale-110 transition-transform duration-500 border border-white/5 shadow-inner">
                                            <service.icon size={32} strokeWidth={1.5} />
                                        </div>

                                        <h3 className="text-2xl font-display font-bold mb-4 group-hover:text-purple-400 transition-colors duration-300">
                                            {t(service.titleKey)}
                                        </h3>
                                        <p className="text-muted-foreground mb-8 leading-relaxed">
                                            {t(service.descriptionKey)}
                                        </p>

                                        <ul className="space-y-3">
                                            {(() => {
                                                const features = t(service.featuresKey);
                                                const featuresList = Array.isArray(features) ? features : [];
                                                return (featuresList as string[]).map((feature: string, idx: number) => (
                                                    <li key={idx} className="flex items-center text-sm text-foreground/80 group-hover:text-foreground transition-colors">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-3 shadow-[0_0_10px_rgba(122,63,255,0.5)]" />
                                                        {feature}
                                                    </li>
                                                ));
                                            })()}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Budget Calculator */}
                <section className="py-24 px-4 md:px-8">
                    <BudgetCalculator />
                </section>

                {/* CTA Section */}
                <section className="py-32 px-4 md:px-8 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-accent/5 to-transparent pointer-events-none" />

                    <div className="max-w-4xl mx-auto text-center relative z-10">
                        <h2 className="text-4xl md:text-6xl font-display font-bold mb-8">
                            {t('services.readyToWork')}
                        </h2>
                        <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto font-light">
                            {t('services.readyDesc')}
                        </p>
                        <a
                            href="/contact"
                            className="inline-flex items-center justify-center px-12 py-5 bg-gradient-to-r from-accent to-purple-600 text-white rounded-full font-bold text-lg hover:shadow-[0_0_30px_-5px_hsl(var(--accent))] hover:scale-105 transition-all duration-300"
                        >
                            {t('services.getInTouch')}
                        </a>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
};

export default Services;
