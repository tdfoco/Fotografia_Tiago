import { useState } from "react";
import Navigation from "@/components/Navigation";
import PhotoGrid from "@/components/PhotoGrid";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

const Photography = () => {
    const { t } = useLanguage();

    return (
        <>
            <Navigation />
            <main className="min-h-screen pt-20">
                {/* Header Section */}
                <section className="bg-gradient-to-br from-background via-secondary to-background py-24 px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-5xl md:text-6xl font-display font-bold tracking-tight mb-6 animate-fade-in">
                            {t('portfolio.title')}
                        </h1>
                        <div className="w-24 h-1 bg-accent mx-auto mb-8" />
                        <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed max-w-2xl mx-auto">
                            {t('portfolio.description')}
                        </p>
                    </div>
                </section>

                {/* Photo Grid */}
                <PhotoGrid />
            </main>
            <Footer />
        </>
    );
};

export default Photography;
