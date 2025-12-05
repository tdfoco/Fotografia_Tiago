import { useState, useEffect } from 'react';
import { Star, Quote, ThumbsUp, Calendar, User, Video } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { pb } from '@/lib/pocketbase';
import { SEO } from '@/components/SEO';

interface Testimonial {
    id: string;
    name: string;
    role?: string;
    photo?: string;
    text: string;
    rating: number;
    date: string;
    videoUrl?: string;
    project?: string;
}

const TestimonialsPage = () => {
    const { t } = useLanguage();
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'photo' | 'design'>('all');

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                setLoading(true);
                const records = await pb.collection('testimonials').getList(1, 50, {
                    sort: '-created',
                });

                const formattedTestimonials = records.items.map((item: any) => ({
                    id: item.id,
                    name: item.client_name || 'Cliente',
                    role: item.client_role,
                    photo: item.client_photo,
                    text: item.message || item.testimonial_text,
                    rating: item.rating || 5,
                    date: new Date(item.created).toLocaleDateString('pt-BR'),
                    videoUrl: item.video_url,
                    project: item.project_category
                }));

                setTestimonials(formattedTestimonials);
            } catch (error) {
                console.error('Error fetching testimonials:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTestimonials();
    }, []);

    const filteredTestimonials = testimonials.filter(testimonial => {
        if (filter === 'all') return true;
        return testimonial.project?.toLowerCase().includes(filter);
    });

    const renderStars = (rating: number) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`w-4 h-4 ${star <= rating
                                ? 'fill-yellow-500 text-yellow-500'
                                : 'text-muted-foreground/30'
                            }`}
                    />
                ))}
            </div>
        );
    };

    return (
        <>
            <SEO
                title="Depoimentos - O que dizem nossos clientes"
                description="Veja o que nossos clientes satisfeitos têm a dizer sobre os serviços de fotografia e design do TDFoco."
                url="https://tdfoco.cloud/testimonials"
            />
            <main className="min-h-screen pt-20 bg-background">
                {/* Hero Section */}
                <section className="relative py-32 px-4 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary/20 to-background z-0" />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-accent/10 blur-[120px] rounded-full pointer-events-none" />

                    <div className="relative z-10 max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent/10 mb-8">
                            <Quote className="w-10 h-10 text-accent" />
                        </div>
                        <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-8 animate-fade-in bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                            Depoimentos
                        </h1>
                        <div className="w-32 h-1.5 bg-gradient-to-r from-accent to-purple-500 mx-auto mb-10 rounded-full shadow-[0_0_20px_rgba(0,163,255,0.5)]" />
                        <p className="text-xl md:text-2xl text-muted-foreground font-light leading-relaxed max-w-2xl mx-auto">
                            O que nossos clientes têm a dizer sobre nosso trabalho
                        </p>
                    </div>
                </section>

                {/* Filter Section */}
                <section className="py-8 px-4 md:px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-wrap justify-center gap-4 mb-12">
                            {['all', 'photo', 'design'].map((filterOption) => (
                                <button
                                    key={filterOption}
                                    onClick={() => setFilter(filterOption as typeof filter)}
                                    className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${filter === filterOption
                                            ? 'bg-gradient-to-r from-accent to-purple-600 text-white shadow-[0_0_20px_-5px_hsl(var(--accent))]'
                                            : 'bg-secondary/30 text-muted-foreground hover:bg-secondary/50 border border-white/10'
                                        }`}
                                >
                                    {filterOption === 'all' ? 'Todos' : filterOption === 'photo' ? 'Fotografia' : 'Design'}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Testimonials Grid */}
                <section className="py-12 px-4 md:px-8">
                    <div className="max-w-7xl mx-auto">
                        {loading ? (
                            <div className="flex items-center justify-center py-20">
                                <div className="w-16 h-16 border-4 border-accent/30 border-t-accent rounded-full animate-spin" />
                            </div>
                        ) : filteredTestimonials.length === 0 ? (
                            <div className="text-center py-20">
                                <Quote className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
                                <p className="text-lg text-muted-foreground">
                                    Nenhum depoimento encontrado
                                </p>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {filteredTestimonials.map((testimonial, index) => (
                                    <div
                                        key={testimonial.id}
                                        className="group relative p-8 rounded-2xl bg-secondary/30 backdrop-blur-sm border border-white/10 hover:border-white/20 hover:shadow-2xl transition-all duration-500 animate-fade-in"
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        {/* Quote Icon */}
                                        <div className="absolute top-4 right-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                            <Quote className="w-16 h-16" />
                                        </div>

                                        {/* Client Info */}
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="relative">
                                                {testimonial.photo ? (
                                                    <img
                                                        src={testimonial.photo}
                                                        alt={testimonial.name}
                                                        className="w-14 h-14 rounded-full object-cover border-2 border-accent/30"
                                                    />
                                                ) : (
                                                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center">
                                                        <User className="w-7 h-7 text-white" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-lg">{testimonial.name}</h3>
                                                {testimonial.role && (
                                                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Rating */}
                                        <div className="mb-4">
                                            {renderStars(testimonial.rating)}
                                        </div>

                                        {/* Testimonial Text */}
                                        <p className="text-muted-foreground font-light leading-relaxed mb-6 relative z-10">
                                            "{testimonial.text}"
                                        </p>

                                        {/* Video Badge */}
                                        {testimonial.videoUrl && (
                                            <div className="flex items-center gap-2 text-accent text-sm mb-4">
                                                <Video className="w-4 h-4" />
                                                <span>Depoimento em vídeo disponível</span>
                                            </div>
                                        )}

                                        {/* Footer */}
                                        <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Calendar className="w-4 h-4" />
                                                <span>{testimonial.date}</span>
                                            </div>
                                            {testimonial.project && (
                                                <span className="px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium">
                                                    {testimonial.project}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* Stats Section */}
                <section className="py-24 px-4 md:px-8 bg-secondary/20">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {[
                                { icon: ThumbsUp, value: '500+', label: 'Clientes Felizes' },
                                { icon: Star, value: '4.9', label: 'Avaliação Média' },
                                { icon: Calendar, value: '6+', label: 'Anos de Experiência' },
                                { icon: Quote, value: '200+', label: 'Depoimentos' }
                            ].map((stat, index) => (
                                <div
                                    key={index}
                                    className="text-center p-6 rounded-2xl bg-background/40 backdrop-blur-md border border-white/10 hover:border-white/20 transition-all duration-300 animate-fade-in"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 mb-4">
                                        <stat.icon className="w-6 h-6 text-accent" />
                                    </div>
                                    <div className="text-4xl font-display font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-accent to-purple-500">
                                        {stat.value}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-32 px-4 md:px-8 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-accent/5 to-transparent pointer-events-none" />

                    <div className="max-w-4xl mx-auto text-center relative z-10">
                        <h2 className="text-4xl md:text-6xl font-display font-bold mb-8">
                            Pronto para fazer parte desta história?
                        </h2>
                        <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto font-light">
                            Junte-se a centenas de clientes satisfeitos e transforme sua visão em realidade
                        </p>
                        <a
                            href="/contact"
                            className="inline-flex items-center justify-center px-12 py-5 bg-gradient-to-r from-accent to-purple-600 text-white rounded-full font-bold text-lg hover:shadow-[0_0_30px_-5px_hsl(var(--accent))] hover:scale-105 transition-all duration-300"
                        >
                            Comece Seu Projeto
                        </a>
                    </div>
                </section>
            </main>
        </>
    );
};

export default TestimonialsPage;
