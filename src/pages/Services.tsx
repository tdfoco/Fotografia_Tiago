import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Camera, Palette, Users, Building, Sparkles, Package } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Services = () => {
    const { t } = useLanguage();

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
            <Navigation />
            <main className="min-h-screen pt-20">
                {/* Hero Section */}
                <section className="bg-gradient-to-br from-background via-secondary to-background py-24 px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-5xl md:text-6xl font-display font-bold tracking-tight mb-6 animate-fade-in">
                            {t('services.title')}
                        </h1>
                        <div className="w-24 h-1 bg-accent mx-auto mb-8" />
                        <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed max-w-2xl mx-auto">
                            {t('services.description')}
                        </p>
                    </div>
                </section>

                {/* Photography Services */}
                <section className="py-20 px-4 md:px-8">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-4">
                            {t('services.photographyServices')}
                        </h2>
                        <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto">
                            {t('services.photographyDesc')}
                        </p>
                        <div className="grid md:grid-cols-2 gap-8">
                            {photographyServices.map((service, index) => (
                                <div
                                    key={index}
                                    className="p-8 bg-secondary rounded-lg hover:shadow-xl hover:shadow-accent/10 transition-all duration-300 animate-fade-in"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-accent/10 text-accent mb-6">
                                        <service.icon size={24} strokeWidth={1.5} />
                                    </div>
                                    <h3 className="text-2xl font-display font-semibold mb-3">{t(service.titleKey)}</h3>
                                    <p className="text-muted-foreground mb-6">{t(service.descriptionKey)}</p>
                                    <ul className="space-y-2">
                                        {(t(service.featuresKey) as any as string[]).map((feature: string, idx: number) => (
                                            <li key={idx} className="flex items-center text-sm text-foreground/80">
                                                <span className="w-1.5 h-1.5 rounded-full bg-accent mr-3" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Design Services */}
                <section className="py-20 px-4 md:px-8 bg-secondary">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-4">
                            {t('services.designServices')}
                        </h2>
                        <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto">
                            {t('services.designDesc')}
                        </p>
                        <div className="grid md:grid-cols-2 gap-8">
                            {designServices.map((service, index) => (
                                <div
                                    key={index}
                                    className="p-8 bg-background rounded-lg hover:shadow-xl hover:shadow-accent/10 transition-all duration-300 animate-fade-in"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-accent/10 text-accent mb-6">
                                        <service.icon size={24} strokeWidth={1.5} />
                                    </div>
                                    <h3 className="text-2xl font-display font-semibold mb-3">{t(service.titleKey)}</h3>
                                    <p className="text-muted-foreground mb-6">{t(service.descriptionKey)}</p>
                                    <ul className="space-y-2">
                                        {(t(service.featuresKey) as any as string[]).map((feature: string, idx: number) => (
                                            <li key={idx} className="flex items-center text-sm text-foreground/80">
                                                <span className="w-1.5 h-1.5 rounded-full bg-accent mr-3" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 px-4 md:px-8">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                            {t('services.readyToWork')}
                        </h2>
                        <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
                            {t('services.readyDesc')}
                        </p>
                        <a
                            href="/contact"
                            className="inline-block px-10 py-4 bg-accent text-accent-foreground rounded-full font-semibold text-lg hover:bg-accent/90 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-accent/50"
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
