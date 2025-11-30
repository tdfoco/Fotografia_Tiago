import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useDesignProjects } from "@/hooks/useSupabaseData";
import type { DesignProject } from "@/lib/supabase";
import { useLanguage } from "@/contexts/LanguageContext";
import { useImageProtection } from "@/hooks/useImageProtection";
import ProtectedImage from "@/components/ProtectedImage";
import { supabase } from "@/lib/supabase";

interface DesignGridProps {
    selectedCategory?: string;
}

const DesignGrid = ({ selectedCategory = "Todos" }: DesignGridProps) => {
    const { t } = useLanguage();

    // Enable image protection
    useImageProtection();
    const [selectedProject, setSelectedProject] = useState<DesignProject | null>(null);

    // Fetch projects using Supabase hook
    const { projects, loading } = useDesignProjects(
        selectedCategory === "Todos" ? undefined : selectedCategory
    );

    const categories = {
        logos: t('design.categories.logos'),
        visual_identity: t('design.categories.visualIdentity'),
        social_media: t('design.categories.socialMedia'),
        posters: t('design.categories.posters'),
        special: t('design.categories.special')
    };

    const filteredProjects = selectedCategory === "Todos"
        ? projects
        : projects.filter(p => p.category === selectedCategory);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-muted-foreground">{t('portfolio.loading')}</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
                <div
                    key={project.id}
                    className="group animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                >
                    <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-secondary">
                        <ProtectedImage
                            src={project.images[0]}
                            alt={project.title}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            onImageClick={() => setSelectedProject(project)}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                <p className="text-sm font-light text-accent mb-2">
                                    {categories[project.category as keyof typeof categories]}
                                </p>
                                <h3 className="text-xl font-display font-semibold">
                                    {project.title}
                                </h3>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4">
                        <p className="text-sm text-accent font-medium">
                            {categories[project.category as keyof typeof categories]}
                        </p>
                        <h3 className="text-lg font-display font-semibold mt-1">
                            {project.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            {project.year} {project.client && `• ${project.client}`}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};

import { SEO } from "@/components/SEO";

const GraphicDesign = () => {
    const { t } = useLanguage();
    const [filter, setFilter] = useState("Todos");
    const [heroImage, setHeroImage] = useState<string | null>(null);

    useEffect(() => {
        const fetchHeroImage = async () => {
            const { data } = await supabase
                .from('hero_images')
                .select('url')
                .eq('page', 'design')
                .eq('active', true)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (data) {
                setHeroImage(data.url);
            }
        };

        fetchHeroImage();
    }, []);

    const categories = ["Todos", "logos", "visual_identity", "social_media", "posters", "special"];
    const categoryLabels: Record<string, string> = {
        "Todos": t('design.categories.all'),
        "logos": t('design.categories.logos'),
        "visual_identity": t('design.categories.visualIdentity'),
        "social_media": t('design.categories.socialMedia'),
        "posters": t('design.categories.posters'),
        "special": t('design.categories.special')
    };

    return (
        <>
            <SEO title="Design Gráfico" description={t('design.description')} />
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
                            {t('design.title')}
                        </h1>
                        <div className="w-32 h-1.5 bg-gradient-to-r from-accent to-purple-500 mx-auto mb-10 rounded-full shadow-[0_0_20px_rgba(0,163,255,0.5)]" />
                        <p className="text-xl md:text-2xl text-muted-foreground font-light leading-relaxed max-w-2xl mx-auto">
                            {t('design.description')}
                        </p>
                    </div>
                </section>

                {/* Design Portfolio */}
                <section className="py-20 px-4 md:px-8">
                    <div className="max-w-7xl mx-auto">
                        {/* Category Filter */}
                        <div className="flex flex-wrap justify-center gap-4 mb-12">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setFilter(category)}
                                    className={`px-6 py-2 rounded-full text-sm font-medium tracking-wide transition-all duration-300 ${filter === category
                                        ? "bg-accent text-accent-foreground shadow-lg shadow-accent/30"
                                        : "bg-secondary text-secondary-foreground hover:bg-accent/20"
                                        }`}
                                >
                                    {categoryLabels[category]}
                                </button>
                            ))}
                        </div>

                        <DesignGrid selectedCategory={filter} />
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
};

export default GraphicDesign;
