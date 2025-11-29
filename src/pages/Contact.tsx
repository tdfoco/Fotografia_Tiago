import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

const Contact = () => {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        service: "",
        message: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate form submission - in production, this would connect to your email service
        setTimeout(() => {
            toast({
                title: t('contact.messageSent'),
                description: t('contact.thankYou'),
            });
            setFormData({ name: "", email: "", service: "", message: "" });
            setIsSubmitting(false);
        }, 1000);
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <>
            <Navigation />
            <main className="min-h-screen pt-20">
                {/* Hero Section */}
                <section className="bg-gradient-to-br from-background via-secondary to-background py-24 px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-5xl md:text-6xl font-display font-bold tracking-tight mb-6 animate-fade-in">
                            {t('contact.title')}
                        </h1>
                        <div className="w-24 h-1 bg-accent mx-auto mb-8" />
                        <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed max-w-2xl mx-auto">
                            {t('contact.description')}
                        </p>
                    </div>
                </section>

                {/* Contact Section */}
                <section className="py-20 px-4 md:px-8">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid lg:grid-cols-2 gap-12">
                            {/* Contact Form */}
                            <div className="bg-secondary p-8 rounded-lg">
                                <h2 className="text-2xl font-display font-bold mb-6">{t('contact.sendMessage')}</h2>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium mb-2">
                                            {t('contact.name')} *
                                        </label>
                                        <Input
                                            id="name"
                                            name="name"
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder={t('contact.yourName')}
                                            className="w-full"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium mb-2">
                                            {t('contact.email')} *
                                        </label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder={t('contact.yourEmail')}
                                            className="w-full"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="service" className="block text-sm font-medium mb-2">
                                            {t('contact.serviceInterest')}
                                        </label>
                                        <select
                                            id="service"
                                            name="service"
                                            value={formData.service}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 rounded-md bg-background border border-input focus:outline-none focus:ring-2 focus:ring-accent"
                                        >
                                            <option value="">{t('contact.selectService')}</option>
                                            <option value="portrait">{t('services.serviceOptions.portrait')}</option>
                                            <option value="event">{t('services.serviceOptions.event')}</option>
                                            <option value="urban">{t('services.serviceOptions.urban')}</option>
                                            <option value="nature">{t('services.serviceOptions.nature')}</option>
                                            <option value="logo">{t('services.serviceOptions.logo')}</option>
                                            <option value="branding">{t('services.serviceOptions.branding')}</option>
                                            <option value="social">{t('services.serviceOptions.social')}</option>
                                            <option value="other">{t('services.serviceOptions.other')}</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium mb-2">
                                            {t('contact.message')} *
                                        </label>
                                        <Textarea
                                            id="message"
                                            name="message"
                                            required
                                            value={formData.message}
                                            onChange={handleChange}
                                            placeholder={t('contact.tellAboutProject')}
                                            rows={6}
                                            className="w-full"
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-accent text-accent-foreground hover:bg-accent/90 py-6 text-lg font-semibold"
                                    >
                                        {isSubmitting ? (
                                            t('contact.sending')
                                        ) : (
                                            <>
                                                <Send className="mr-2" size={20} />
                                                {t('contact.send')}
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </div>

                            {/* Contact Info */}
                            <div className="space-y-8">
                                <div>
                                    <h2 className="text-2xl font-display font-bold mb-6">{t('contact.contactInfo')}</h2>
                                    <p className="text-muted-foreground mb-8">
                                        {t('contact.contactDesc')}
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-start space-x-4">
                                        <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                                            <Mail className="text-accent" size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold mb-1">{t('contact.email')}</h3>
                                            <a
                                                href="mailto:tiago@example.com"
                                                className="text-muted-foreground hover:text-accent transition-colors"
                                            >
                                                tiago@example.com
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-4">
                                        <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                                            <Phone className="text-accent" size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold mb-1">{t('contact.phone')}</h3>
                                            <a
                                                href="tel:+5511999999999"
                                                className="text-muted-foreground hover:text-accent transition-colors"
                                            >
                                                +55 (11) 99999-9999
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-4">
                                        <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                                            <MapPin className="text-accent" size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold mb-1">{t('contact.location')}</h3>
                                            <p className="text-muted-foreground">
                                                {t('contact.locationValue')}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Social Media - Optional */}
                                <div className="pt-8 border-t border-border">
                                    <h3 className="font-semibold mb-4">{t('contact.followMe')}</h3>
                                    <div className="flex space-x-4">
                                        <a
                                            href="https://instagram.com/tdfoco"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-all duration-300"
                                        >
                                            <span className="sr-only">Instagram</span>
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
};

export default Contact;
