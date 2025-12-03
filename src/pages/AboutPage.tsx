import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Camera, Palette, Heart, Award, Users, Lightbulb } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { pb } from "@/lib/pocketbase";
import { getImageUrl } from "@/hooks/usePocketBaseData";
import { SEO } from "@/components/SEO";

const AboutPage = () => {
    const { t } = useLanguage();
    const [heroImage, setHeroImage] = useState<string | null>(null);
    const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
    const [videoUrl, setVideoUrl] = useState<string>("");

    useEffect(() => {
        const fetchHeroImage = async () => {
            try {
                const record = await pb.collection('hero_images').getFirstListItem('page="about" && active=true', {
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

        // For now, using placeholder. Admin can later upload via a 'about' collection
        setProfilePhoto('/placeholder-profile.jpg');
        setVideoUrl('https://www.youtube.com/embed/dQw4w9WgXcQ'); // Admin should update this
    }, []);

    return (
        <>
            <SEO title="Sobre Mim" />
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
                            {t('about.title')}
                        </h1>
                        <div className="w-32 h-1.5 bg-gradient-to-r from-accent to-purple-500 mx-auto mb-10 rounded-full shadow-[0_0_20px_rgba(0,163,255,0.5)]" />
                    </div>
                </section>

                {/* Profile Section */}
                <section className="py-20 px-4 md:px-8 bg-secondary/20">
                    <div className="max-w-5xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div className="space-y-6">
                                <h2 className="text-3xl md:text-4xl font-display font-bold">Conheça o Fotógrafo</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    Olá! Sou Tiago Damasceno, fotógrafo e designer apaixonado por capturar momentos únicos e criar identidades visuais marcantes.
                                </p>
                                <p className="text-muted-foreground leading-relaxed">
                                    Com anos de experiência, meu objetivo é transformar suas histórias em arte visual que emociona e conecta.
                                </p>
                            </div>
                            <div className="space-y-4">
                                {profilePhoto && (
                                    <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl border border-primary/20">
                                        <img
                                            src={profilePhoto}
                                            alt="Tiago Damasceno"
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=Tiago+Damasceno&size=500&background=00a3ff&color=fff';
                                            }}
                                        />
                                    </div>
                                )}
                                {videoUrl && (
                                    <div className="text-center">
                                        <a
                                            href={videoUrl.replace('/embed/', '/watch?v=')}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-primary hover:underline"
                                        >
                                            Assista meu vídeo de apresentação →
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
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
