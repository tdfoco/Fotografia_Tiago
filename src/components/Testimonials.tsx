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
        <section className="py-24 px-4 md:px-8 bg-secondary/20 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[400px] h-[400px] bg-accent/5 blur-[100px] rounded-full pointer-events-none" />

            <div className="max-w-4xl mx-auto relative z-10">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
                        O Que Dizem Nossos Clientes
                    </h2>
                    <p className="text-muted-foreground">
                        Orgulho em cada projeto entregue
                    </p>
                </div>

                <Card className="relative border-primary/20">
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                        <Quote className="h-6 w-6 text-primary-foreground" />
                    </div>

                    <CardContent className="pt-12 pb-8 px-8 md:px-12">
                        <div className="text-center space-y-6">
                            {current.rating && (
                                <div className="flex justify-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`h-5 w-5 ${i < current.rating! ? 'fill-yellow-500 text-yellow-500' : 'text-muted'}`}
                                        />
                                    ))}
                                </div>
                            )}

                            <blockquote className="text-lg md:text-xl text-foreground/90 leading-relaxed italic">
                                "{current.content}"
                            </blockquote>

                            <div className="pt-4">
                                <p className="font-semibold text-lg">{current.name}</p>
                                {current.role && (
                                    <p className="text-sm text-muted-foreground">{current.role}</p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {testimonials.length > 1 && (
                    <div className="flex items-center justify-center gap-4 mt-8">
                        <Button onClick={prev} variant="outline" size="icon" className="rounded-full">
                            <ChevronLeft className="h-4 w-4" />
                        </Button>

                        <div className="flex gap-2">
                            {testimonials.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentIndex(index)}
                                    className={`w-2 h-2 rounded-full transition-all ${index === currentIndex
                                            ? 'bg-primary w-8'
                                            : 'bg-primary/30 hover:bg-primary/50'
                                        }`}
                                />
                            ))}
                        </div>

                        <Button onClick={next} variant="outline" size="icon" className="rounded-full">
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Testimonials;
