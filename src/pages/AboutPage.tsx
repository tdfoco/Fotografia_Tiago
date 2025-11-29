import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Camera, Palette, Heart, Award, Users, Lightbulb } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const AboutPage = () => {
    const { t } = useLanguage();

    return (
        <>
            <Navigation />
            <main className="min-h-screen pt-20">
                {/* Hero Section */}
                <section className="bg-gradient-to-br from-background via-secondary to-background py-24 px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-5xl md:text-6xl font-display font-bold tracking-tight mb-6 animate-fade-in">
                            {t('about.title')}
                        </h1>
                        <div className="w-24 h-1 bg-accent mx-auto mb-8" />
                    </div>
                </section>

                {/* Bio Section */}
                <section className="py-20 px-4 md:px-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="prose prose-lg max-w-none">
                            <p className="text-xl text-foreground/90 font-light leading-relaxed mb-6">
                                {t('about.intro')}
                            </p>
                            <p className="text-lg text-muted-foreground font-light leading-relaxed mb-6">
                                {t('about.description1')}
                            </p>
                            <p className="text-lg text-muted-foreground font-light leading-relaxed">
                                {t('about.description2')}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Skills & Expertise */}
                <section className="bg-secondary py-20 px-4 md:px-8">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-16">
                            {t('about.expertise')}
                        </h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <div className="text-center p-6 bg-background rounded-lg hover:shadow-lg hover:shadow-accent/10 transition-all duration-300">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 text-accent mb-6">
                                    <Camera size={28} strokeWidth={1.5} />
                                </div>
                                <h3 className="text-xl font-display font-semibold mb-3">{t('about.photography')}</h3>
                                <p className="text-muted-foreground font-light leading-relaxed">
                                    {t('about.photographyDesc')}
                                </p>
                            </div>

                            <div className="text-center p-6 bg-background rounded-lg hover:shadow-lg hover:shadow-accent/10 transition-all duration-300">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 text-accent mb-6">
                                    <Palette size={28} strokeWidth={1.5} />
                                </div>
                                <h3 className="text-xl font-display font-semibold mb-3">{t('about.graphicDesign')}</h3>
                                <p className="text-muted-foreground font-light leading-relaxed">
                                    {t('about.graphicDesignDesc')}
                                </p>
                            </div>

                            <div className="text-center p-6 bg-background rounded-lg hover:shadow-lg hover:shadow-accent/10 transition-all duration-300">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 text-accent mb-6">
                                    <Heart size={28} strokeWidth={1.5} />
                                </div>
                                <h3 className="text-xl font-display font-semibold mb-3">{t('about.passion.title')}</h3>
                                <p className="text-muted-foreground font-light leading-relaxed">
                                    {t('about.passion.description')}
                                </p>
                            </div>

                            <div className="text-center p-6 bg-background rounded-lg hover:shadow-lg hover:shadow-accent/10 transition-all duration-300">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 text-accent mb-6">
                                    <Award size={28} strokeWidth={1.5} />
                                </div>
                                <h3 className="text-xl font-display font-semibold mb-3">{t('about.quality')}</h3>
                                <p className="text-muted-foreground font-light leading-relaxed">
                                    {t('about.qualityDesc')}
                                </p>
                            </div>

                            <div className="text-center p-6 bg-background rounded-lg hover:shadow-lg hover:shadow-accent/10 transition-all duration-300">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 text-accent mb-6">
                                    <Users size={28} strokeWidth={1.5} />
                                </div>
                                <h3 className="text-xl font-display font-semibold mb-3">{t('about.collaboration')}</h3>
                                <p className="text-muted-foreground font-light leading-relaxed">
                                    {t('about.collaborationDesc')}
                                </p>
                            </div>

                            <div className="text-center p-6 bg-background rounded-lg hover:shadow-lg hover:shadow-accent/10 transition-all duration-300">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 text-accent mb-6">
                                    <Lightbulb size={28} strokeWidth={1.5} />
                                </div>
                                <h3 className="text-xl font-display font-semibold mb-3">{t('about.creativity')}</h3>
                                <p className="text-muted-foreground font-light leading-relaxed">
                                    {t('about.creativityDesc')}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
};

export default AboutPage;
