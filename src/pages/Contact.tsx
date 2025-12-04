import { useState, useEffect } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { pb } from "@/lib/pocketbase";
import { getImageUrl } from "@/hooks/usePocketBaseData";
import { SEO } from "@/components/SEO";
import { MultiStepContact } from "@/components/MultiStepContact";

const Contact = () => {
    const { t } = useLanguage();
    const [heroImage, setHeroImage] = useState<string | null>(null);

    useEffect(() => {
        const fetchHeroImage = async () => {
            try {
                const record = await pb.collection('hero_images').getFirstListItem('page="contact" && active=true', {
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
                title="Contato"
                description="Entre em contato para orçamentos de fotografia e design. Vamos criar algo incrível juntos."
                url="https://tdfoco.cloud/contact"
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

                    <div className="max-w-4xl mx-auto text-center relative z-10">
                        <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-8 animate-fade-in bg-clip-text text-transparent bg-gradient-to-r from-foreground via-electric-blue to-foreground">
                            {t('contact.title')}
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
                            {t('contact.subtitle')}
                        </p>
                    </div>
                </section>

                <section className="py-12 px-4 md:px-8 relative z-10 -mt-20">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid lg:grid-cols-2 gap-16 items-start">
                            {/* Contact Info */}
                            <div className="space-y-12 lg:sticky lg:top-32">
                                <div>
                                    <h2 className="text-3xl font-display font-bold mb-6">Vamos Conversar</h2>
                                    <p className="text-muted-foreground text-lg leading-relaxed">
                                        Estou pronto para transformar sua visão em realidade. Preencha o formulário ao lado ou utilize os canais abaixo para entrar em contato direto.
                                    </p>
                                </div>

                                <div className="space-y-8">
                                    <div className="flex items-start gap-4 group">
                                        <div className="p-3 rounded-2xl bg-secondary/30 border border-white/5 group-hover:border-electric-blue/30 transition-colors">
                                            <Mail className="h-6 w-6 text-electric-blue" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg mb-1">Email</h3>
                                            <p className="text-muted-foreground">contato@tdfoco.cloud</p>
                                            <p className="text-muted-foreground">tiago@tdfoco.cloud</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4 group">
                                        <div className="p-3 rounded-2xl bg-secondary/30 border border-white/5 group-hover:border-electric-blue/30 transition-colors">
                                            <Phone className="h-6 w-6 text-electric-blue" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg mb-1">Telefone / WhatsApp</h3>
                                            <p className="text-muted-foreground">(11) 99999-9999</p>
                                            <p className="text-sm text-gray-500 mt-1">Seg-Sex, 9h às 18h</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4 group">
                                        <div className="p-3 rounded-2xl bg-secondary/30 border border-white/5 group-hover:border-electric-blue/30 transition-colors">
                                            <MapPin className="h-6 w-6 text-electric-blue" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg mb-1">Localização</h3>
                                            <p className="text-muted-foreground">São Paulo, SP</p>
                                            <p className="text-sm text-gray-500 mt-1">Disponível para viagens</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Social Media */}
                                <div className="pt-10 border-t border-white/10">
                                    <h3 className="font-semibold mb-6 text-lg">{t('contact.followMe')}</h3>
                                    <div className="flex space-x-4">
                                        <a
                                            href="https://instagram.com/tdfoco"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-12 h-12 rounded-full bg-secondary/50 flex items-center justify-center hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 hover:text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                                        >
                                            <span className="sr-only">Instagram</span>
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.664-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Multi-step Form */}
                            <div className="w-full">
                                <MultiStepContact />
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
};

export default Contact;
