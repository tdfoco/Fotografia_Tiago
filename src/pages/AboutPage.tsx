import { useState, useEffect } from "react";
import { Camera, Palette, Heart, Award, Users, Lightbulb } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { pb } from "@/lib/pocketbase";
import { getImageUrl } from "@/hooks/usePocketBaseData";
import { SEO } from "@/components/SEO";
import { VideoPresentation } from "@/components/VideoPresentation";

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
            <SEO
                title="Sobre Mim"
                description="Conheça Tiago Damasceno, fotógrafo e designer apaixonado por criar experiências visuais únicas."
                url="https://tdfoco.cloud/about"
            />
            <main className="min-h-screen pt-20 bg-background overflow-hidden">
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
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-electric-blue/10 blur-[120px] rounded-full pointer-events-none" />

                    <div className="relative z-10 max-w-4xl mx-auto text-center">
                        <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-8 animate-fade-in bg-clip-text text-transparent bg-gradient-to-r from-foreground via-electric-blue to-foreground">
                            {t('about.title')}
                        </h1>
                        <div className="w-32 h-1.5 bg-gradient-to-r from-electric-blue to-vibrant-purple mx-auto mb-10 rounded-full shadow-[0_0_20px_rgba(58,139,253,0.5)]" />
                    </div>
                </section>

                {/* Profile Section */}
                <section className="py-20 px-4 md:px-8 relative">
                    <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-vibrant-purple/5 blur-[120px] rounded-full pointer-events-none" />

                    <div className="max-w-6xl mx-auto relative z-10">
                        <div className="grid md:grid-cols-2 gap-16 items-center">
                            <div className="space-y-8">
                                <h2 className="text-3xl md:text-5xl font-display font-bold">Conheça o Fotógrafo</h2>
                                <div className="space-y-6 text-lg font-light leading-relaxed text-muted-foreground">
                                    <p>
                                        Olá! Sou <span className="text-foreground font-medium">Tiago Damasceno</span>, fotógrafo e designer apaixonado por capturar momentos únicos e criar identidades visuais marcantes.
                                    </p>
                                    <p>
                                        Com anos de experiência, meu objetivo é transformar suas histórias em arte visual que emociona e conecta. Cada clique é uma busca pela perfeição e pela essência do momento.
                                    </p>
                                </div>

                                <div className="pt-4">
                                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-electric-blue/10 text-electric-blue border border-electric-blue/20">
                                        <Camera size={18} />
                                        <span className="text-sm font-medium">Fotografia & Design</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {profilePhoto && (
                                    <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
                                        <div className="absolute inset-0 bg-gradient-to-tr from-electric-blue/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                                        <img
                                            src={profilePhoto}
                                            alt="Tiago Damasceno"
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=Tiago+Damasceno&size=500&background=00a3ff&color=fff';
                                            }}
                                        />
                                    </div>
                                )}

                                {/* Vídeo de Apresentação */}
                                {videoUrl && (
                                    <VideoPresentation
                                        videoUrl={videoUrl}
                                        title="Vídeo de Apresentação - Tiago Damasceno"
                                        thumbnailUrl={profilePhoto || undefined}
                                        autoplay={false}
                                        controls={true}
                                        className="mt-6"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Bio Section */}
                <section className="py-20 px-4 md:px-8 bg-secondary/20 backdrop-blur-sm">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="prose prose-lg max-w-none dark:prose-invert">
                            <p className="text-2xl md:text-3xl text-foreground font-light leading-relaxed mb-8 font-display">
                                "{t('about.intro')}"
                            </p>
                            <div className="grid md:grid-cols-2 gap-8 text-left">
                                <p className="text-lg text-muted-foreground font-light leading-relaxed">
                                    {t('about.description1')}
                                </p>
                                <p className="text-lg text-muted-foreground font-light leading-relaxed">
                                    {t('about.description2')}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Skills & Expertise */}
                <section className="py-24 px-4 md:px-8 relative">
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-electric-blue/5 blur-[120px] rounded-full pointer-events-none" />

                    <div className="max-w-7xl mx-auto relative z-10">
                        <h2 className="text-3xl md:text-5xl font-display font-bold text-center mb-16">
                            {t('about.expertise')}
                        </h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                                { icon: Camera, title: t('about.photography'), desc: t('about.photographyDesc'), color: 'text-electric-blue', bg: 'bg-electric-blue/10' },
                                { icon: Palette, title: t('about.graphicDesign'), desc: t('about.graphicDesignDesc'), color: 'text-vibrant-purple', bg: 'bg-vibrant-purple/10' },
                                { icon: Heart, title: t('about.passion.title'), desc: t('about.passion.description'), color: 'text-neon-cyan', bg: 'bg-neon-cyan/10' },
                                { icon: Award, title: t('about.quality'), desc: t('about.qualityDesc'), color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
                                { icon: Users, title: t('about.collaboration'), desc: t('about.collaborationDesc'), color: 'text-green-500', bg: 'bg-green-500/10' },
                                { icon: Lightbulb, title: t('about.creativity'), desc: t('about.creativityDesc'), color: 'text-orange-500', bg: 'bg-orange-500/10' }
                            ].map((item, index) => (
                                <div key={index} className="group p-8 rounded-2xl bg-secondary/30 backdrop-blur-md border border-white/5 hover:border-white/10 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                                    <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${item.bg} ${item.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                        <item.icon size={28} strokeWidth={1.5} />
                                    </div>
                                    <h3 className="text-xl font-display font-semibold mb-3 group-hover:text-foreground transition-colors">{item.title}</h3>
                                    <p className="text-muted-foreground font-light leading-relaxed text-sm">
                                        {item.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
};

export default AboutPage;
