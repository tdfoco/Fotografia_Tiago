import { useState, useEffect } from 'react';
import { Camera, Award, Users, Zap, Clock, Heart, Play, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { pb } from '@/lib/pocketbase';
import { getImageUrl } from '@/hooks/usePocketBaseData';
import { SEO } from '@/components/SEO';
import { VideoPresentation } from '@/components/VideoPresentation';

interface TimelineEvent {
    year: string;
    title: string;
    description: string;
    icon: typeof Camera;
}

const BehindTheScenes = () => {
    const { t } = useLanguage();
    const [heroImage, setHeroImage] = useState<string | null>(null);
    const [makingOfPhotos, setMakingOfPhotos] = useState<any[]>([]);

    useEffect(() => {
        const fetchHeroImage = async () => {
            try {
                const record = await pb.collection('hero_images').getFirstListItem('page="behind_the_scenes" && active=true', {
                    sort: '-created',
                });

                if (record) {
                    setHeroImage(getImageUrl(record.collectionId, record.id, record.image));
                }
            } catch (error) {
                console.error('Error fetching hero image:', error);
            }
        };

        const fetchMakingOfPhotos = async () => {
            try {
                // Buscar fotos da categoria "Bastidores" ou similar
                const records = await pb.collection('photography_photos').getList(1, 12, {
                    filter: 'category="Bastidores" || category="Making Of"',
                    sort: '-created',
                });

                setMakingOfPhotos(records.items);
            } catch (error) {
                console.error('Error fetching making of photos:', error);
            }
        };

        fetchHeroImage();
        fetchMakingOfPhotos();
    }, []);

    const timeline: TimelineEvent[] = [
        {
            year: '2018',
            title: 'Início da Jornada',
            description: 'Primeiras experiências com fotografia profissional e descoberta da paixão pela arte visual.',
            icon: Camera
        },
        {
            year: '2019',
            title: 'Primeiros Projetos',
            description: 'Início dos trabalhos comerciais e desenvolvimento do estilo próprio de fotografia.',
            icon: Zap
        },
        {
            year: '2020',
            title: 'Expansão para Design',
            description: 'Integração de design gráfico ao portfólio, criando identidades visuais completas.',
            icon: Award
        },
        {
            year: '2022',
            title: 'Reconhecimento',
            description: 'Premiações e reconhecimento no mercado de fotografia e design.',
            icon: Heart
        },
        {
            year: '2024',
            title: 'TDFoco Digital',
            description: 'Lançamento do portfólio digital com IA e experiência interativa moderna.',
            icon: Users
        }
    ];

    const processSteps = [
        {
            number: '01',
            title: 'Briefing & Conceito',
            description: 'Conversa inicial para entender sua visão, necessidades e objetivos do projeto.',
            color: 'from-electric-blue to-neon-cyan'
        },
        {
            number: '02',
            title: 'Planejamento',
            description: 'Desenvolvimento do conceito criativo, moodboard e definição de locações.',
            color: 'from-neon-cyan to-vibrant-purple'
        },
        {
            number: '03',
            title: 'Produção',
            description: 'Sessão fotográfica com toda atenção aos detalhes e captura dos melhores momentos.',
            color: 'from-vibrant-purple to-electric-blue'
        },
        {
            number: '04',
            title: 'Pós-Produção',
            description: 'Edição cuidadosa, tratamento de cor e seleção das melhores imagens.',
            color: 'from-electric-blue to-neon-cyan'
        },
        {
            number: '05',
            title: 'Entrega',
            description: 'Galeria privada com download em alta resolução e suporte contínuo.',
            color: 'from-neon-cyan to-vibrant-purple'
        }
    ];

    return (
        <>
            <SEO
                title="Bastidores - Behind The Scenes"
                description="Conheça o processo criativo por trás das fotos. Uma jornada visual pelos bastidores do trabalho de Tiago Damasceno."
                url="https://tdfoco.cloud/behind-the-scenes"
            />
            <main className="min-h-screen pt-20 bg-background overflow-hidden">
                {/* Hero Section with Video */}
                <section className="relative py-32 px-4 overflow-hidden">
                    {/* Background Image */}
                    {heroImage && (
                        <div
                            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 z-0"
                            style={{ backgroundImage: `url(${heroImage})` }}
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary/20 to-background z-0" />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-accent/10 blur-[120px] rounded-full pointer-events-none" />

                    <div className="relative z-10 max-w-6xl mx-auto text-center">
                        <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-8 animate-fade-in bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                            Bastidores
                        </h1>
                        <div className="w-32 h-1.5 bg-gradient-to-r from-accent to-purple-500 mx-auto mb-10 rounded-full shadow-[0_0_20px_rgba(0,163,255,0.5)]" />
                        <p className="text-xl md:text-2xl text-muted-foreground font-light leading-relaxed max-w-2xl mx-auto mb-12">
                            Uma jornada pelo processo criativo e a paixão por trás de cada clique
                        </p>

                        {/* Video Placeholder */}
                        <div className="max-w-4xl mx-auto mt-16">
                            <VideoPresentation
                                videoUrl="https://www.youtube.com/embed/dQw4w9WgXcQ"
                                title="Bastidores do Trabalho - TDFoco"
                                autoplay={false}
                                controls={true}
                            />
                        </div>
                    </div>
                </section>

                {/* Timeline Section */}
                <section className="py-24 px-4 md:px-8 relative">
                    <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none" />

                    <div className="max-w-6xl mx-auto relative z-10">
                        <div className="text-center mb-20">
                            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
                                Minha Jornada
                            </h2>
                            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                                A evolução de uma paixão em carreira profissional
                            </p>
                        </div>

                        <div className="relative">
                            {/* Timeline Line */}
                            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-accent via-purple-500 to-accent opacity-20" />

                            <div className="space-y-16">
                                {timeline.map((event, index) => (
                                    <div
                                        key={index}
                                        className={`flex items-center gap-8 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} animate-fade-in`}
                                        style={{ animationDelay: `${index * 150}ms` }}
                                    >
                                        <div className={`flex-1 ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                                            <div className="inline-block p-8 rounded-2xl bg-secondary/30 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-2xl group">
                                                <div className="flex items-center gap-4 mb-4justify-end">
                                                    <div className={`text-4xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent to-purple-500 ${index % 2 === 0 ? 'order-first' : 'order-last'}`}>
                                                        {event.year}
                                                    </div>
                                                </div>
                                                <h3 className="text-2xl font-display font-semibold mb-3 group-hover:text-accent transition-colors">
                                                    {event.title}
                                                </h3>
                                                <p className="text-muted-foreground font-light leading-relaxed">
                                                    {event.description}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Center Icon */}
                                        <div className="relative z-10">
                                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center shadow-[0_0_30px_-5px_hsl(var(--accent))]">
                                                <event.icon className="w-8 h-8 text-white" />
                                            </div>
                                        </div>

                                        <div className="flex-1" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Process Section */}
                <section className="py-24 px-4 md:px-8 bg-secondary/20 backdrop-blur-sm relative overflow-hidden">
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-electric-blue/5 blur-[120px] rounded-full pointer-events-none" />

                    <div className="max-w-7xl mx-auto relative z-10">
                        <div className="text-center mb-20">
                            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
                                Meu Processo de Trabalho
                            </h2>
                            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                                Do primeiro contato até a entrega final, cada etapa é cuidadosamente planejada
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {processSteps.map((step, index) => (
                                <div
                                    key={index}
                                    className="group relative p-8 rounded-2xl bg-background/40 backdrop-blur-md border border-white/10 hover:border-white/20 hover:shadow-2xl transition-all duration-300 animate-fade-in overflow-hidden"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    {/* Gradient Background */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

                                    <div className="relative z-10">
                                        <div className={`text-6xl font-display font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r ${step.color} opacity-20`}>
                                            {step.number}
                                        </div>

                                        <h3 className="text-xl font-display font-semibold mb-3 group-hover:text-accent transition-colors">
                                            {step.title}
                                        </h3>

                                        <p className="text-muted-foreground font-light text-sm leading-relaxed">
                                            {step.description}
                                        </p>

                                        <div className="mt-6 flex items-center gap-2 text-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <span className="text-sm font-medium">Saiba mais</span>
                                            <ChevronRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Making Of Gallery */}
                {makingOfPhotos.length > 0 && (
                    <section className="py-24 px-4 md:px-8">
                        <div className="max-w-7xl mx-auto">
                            <div className="text-center mb-16">
                                <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
                                    Galeria de Bastidores
                                </h2>
                                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                                    Momentos capturados durante as sessões e projetos
                                </p>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {makingOfPhotos.map((photo, index) => (
                                    <div
                                        key={photo.id}
                                        className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer animate-fade-in"
                                        style={{ animationDelay: `${index * 50}ms` }}
                                    >
                                        <img
                                            src={getImageUrl(photo.collectionId, photo.id, photo.file)}
                                            alt={photo.title || `Making Of ${index + 1}`}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className="absolute bottom-4 left-4 right-4">
                                                <p className="text-white text-sm font-medium truncate">
                                                    {photo.title || 'Bastidores'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* CTA Section */}
                <section className="py-32 px-4 md:px-8 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-accent/5 to-transparent pointer-events-none" />

                    <div className="max-w-4xl mx-auto text-center relative z-10">
                        <Clock className="w-16 h-16 mx-auto mb-8 text-accent" />
                        <h2 className="text-4xl md:text-6xl font-display font-bold mb-8">
                            Pronto para criar algo incrível?
                        </h2>
                        <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto font-light">
                            Vamos transformar sua visão em realidade com criatividade e profissionalismo
                        </p>
                        <a
                            href="/contact"
                            className="inline-flex items-center justify-center px-12 py-5 bg-gradient-to-r from-accent to-purple-600 text-white rounded-full font-bold text-lg hover:shadow-[0_0_30px_-5px_hsl(var(--accent))] hover:scale-105 transition-all duration-300"
                        >
                            Entre em Contato
                        </a>
                    </div>
                </section>
            </main>
        </>
    );
};

export default BehindTheScenes;
