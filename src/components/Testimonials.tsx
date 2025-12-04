import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';
import { pb } from '@/lib/pocketbase';

interface Testimonial {
    id: string;
    name: string;
    role?: string;
    content: string;
    rating?: number;
    photo?: string;
}

const Testimonials = () => {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const records = await pb.collection('testimonials').getFullList<Testimonial>({
                    sort: '-created',
                    filter: 'active = true'
                });
                setTestimonials(records);
            } catch (error) {
                console.error('Error fetching testimonials:', error);
                // Fallback testimonials if collection doesn't exist
                setTestimonials([
                    {
                        id: '1',
                        name: 'Maria Silva',
                        role: 'Noiva',
                        content: 'Tiago capturou todos os momentos especiais do nosso casamento de forma mágica. Fotos incríveis!',
                        rating: 5
                    },
                    {
                        id: '2',
                        name: 'João Santos',
                        role: 'Empresário',
                        content: 'A identidade visual criada pelo Tiago transformou completamente minha marca. Trabalho excepcional!',
                        rating: 5
                    },
                    {
                        id: '3',
                        name: 'Ana Costa',
                        role: 'Instagram @anacosta',
                        content: 'Profissionalismo e criatividade. As fotos do meu ensaio ficaram perfeitas!',
                        rating: 5
                    }
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchTestimonials();
    }, []);

    const next = () => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    };

    const prev = () => {
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    if (loading || testimonials.length === 0) return null;

    const current = testimonials[currentIndex];

    return (
        <section className="py-24 px-4 md:px-8 bg-background relative overflow-hidden">
            <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-electric-blue/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-vibrant-purple/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-5xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                        O Que Dizem Nossos Clientes
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-electric-blue to-vibrant-purple mx-auto mb-8 rounded-full shadow-[0_0_15px_rgba(58,139,253,0.5)]" />
                    <p className="text-xl text-muted-foreground font-light max-w-2xl mx-auto">
                        Orgulho em cada projeto entregue e em cada história contada
                    </p>
                </div>

                <div className="relative">
                    <Card className="relative border-white/10 bg-secondary/30 backdrop-blur-md shadow-2xl overflow-visible mt-8">
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-electric-blue to-vibrant-purple rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(58,139,253,0.4)]">
                            <Quote className="h-8 w-8 text-white" />
                        </div>

                        <CardContent className="pt-16 pb-12 px-8 md:px-16">
                            <div className="text-center space-y-8">
                                {current.rating && (
                                    <div className="flex justify-center gap-1.5">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`h-6 w-6 ${i < current.rating! ? 'fill-yellow-500 text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.4)]' : 'text-muted/30'}`}
                                            />
                                        ))}
                                    </div>
                                )}

                                <blockquote className="text-xl md:text-3xl text-foreground font-light leading-relaxed italic font-display">
                                    "{current.content}"
                                </blockquote>

                                <div className="pt-6 border-t border-white/5">
                                    <p className="font-bold text-xl text-electric-blue">{current.name}</p>
                                    {current.role && (
                                        <p className="text-base text-muted-foreground mt-1">{current.role}</p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {testimonials.length > 1 && (
                        <div className="flex items-center justify-center gap-6 mt-12">
                            <Button onClick={prev} variant="outline" size="icon" className="rounded-full w-12 h-12 border-white/10 hover:bg-electric-blue/10 hover:text-electric-blue hover:border-electric-blue/50 transition-all duration-300">
                                <ChevronLeft className="h-5 w-5" />
                            </Button>

                            <div className="flex gap-3">
                                {testimonials.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentIndex(index)}
                                        className={`h-2 rounded-full transition-all duration-500 ${index === currentIndex
                                            ? 'bg-electric-blue w-12 shadow-[0_0_10px_rgba(58,139,253,0.5)]'
                                            : 'bg-white/20 w-2 hover:bg-white/40'
                                            }`}
                                    />
                                ))}
                            </div>

                            <Button onClick={next} variant="outline" size="icon" className="rounded-full w-12 h-12 border-white/10 hover:bg-electric-blue/10 hover:text-electric-blue hover:border-electric-blue/50 transition-all duration-300">
                                <ChevronRight className="h-5 w-5" />
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
