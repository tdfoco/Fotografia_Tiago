import { useState } from "react";
import { usePhotography, useDesignProjects } from "@/hooks/useSupabaseData";
import { useLanguage } from "@/contexts/LanguageContext";
import { useImageProtection } from "@/hooks/useImageProtection";
import ProtectedImage from "./ProtectedImage";

// Unified portfolio item type
type UnifiedPortfolioItem = {
    id: string;
    src: string;
    alt: string;
    type: 'photography' | 'design';
    category?: string;
};

const UnifiedPortfolioGrid = () => {
    const { t } = useLanguage();
    useImageProtection();

    const { photos, loading: photosLoading } = usePhotography();
    const { projects, loading: projectsLoading } = useDesignProjects();

    const loading = photosLoading || projectsLoading;

    // Combine and shuffle both portfolios
    const unifiedItems: UnifiedPortfolioItem[] = [
        ...photos.map(photo => ({
            id: `photo-${photo.id}`,
            src: photo.url,
            alt: photo.title,
            type: 'photography' as const,
            category: photo.category
        })),
        ...projects.map(project => ({
            id: `design-${project.id}`,
            src: project.images[0],
            alt: project.title,
            type: 'design' as const,
            category: project.category
        }))
    ];

    return (
        <section id="unified-portfolio" className="min-h-screen bg-background py-20 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-8">
                        Portfólio
                    </h2>

                    {/* Two columns for Photography and Design */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-6">
                        {/* Photography */}
                        <div className="text-center md:text-right md:border-r border-border md:pr-8">
                            <h3 className="text-xl md:text-2xl font-display font-semibold mb-3 text-accent">
                                Fotografia
                            </h3>
                            <p className="text-muted-foreground text-sm md:text-base font-light">
                                Uma coleção de momentos capturados através de diferentes perspectivas
                            </p>
                        </div>

                        {/* Design */}
                        <div className="text-center md:text-left md:pl-8">
                            <h3 className="text-xl md:text-2xl font-display font-semibold mb-3 text-accent">
                                Design Gráfico
                            </h3>
                            <p className="text-muted-foreground text-sm md:text-base font-light">
                                Identidades visuais modernas, branding e peças de design que criam forte impacto visual e experiências memoráveis de marca
                            </p>
                        </div>
                    </div>
                </div>

                {/* Unified Grid */}
                {loading ? (
                    <div className="text-center py-20">
                        <p className="text-muted-foreground">{t('portfolio.loading')}</p>
                    </div>
                ) : unifiedItems.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-muted-foreground">
                            Nenhum item encontrado
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {unifiedItems.map((item, index) => (
                            <div
                                key={item.id}
                                className="group relative aspect-square overflow-hidden rounded-lg animate-fade-in"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <ProtectedImage
                                    src={item.src}
                                    alt={item.alt}
                                    loading="lazy"
                                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    onImageClick={() => { }}
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-500 flex items-center justify-center pointer-events-none">
                                    <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-sm tracking-wider font-light">
                                        {item.type === 'photography' ? 'Fotografia' : 'Design'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default UnifiedPortfolioGrid;
