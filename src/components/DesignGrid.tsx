import { useState } from "react";
import { useDesignProjects } from "@/hooks/useSupabaseData";
import type { DesignProject } from "@/lib/supabase";
import { useLanguage } from "@/contexts/LanguageContext";
import { useImageProtection } from "@/hooks/useImageProtection";
import ProtectedImage from "./ProtectedImage";
import ProjectModal from "./ProjectModal";
import InteractionBar from "./InteractionBar";

interface DesignGridProps {
    showHeader?: boolean;
    showFilters?: boolean;
    limit?: number;
}

const DesignGrid = ({ showHeader = true, showFilters = true, limit }: DesignGridProps) => {
    const { t } = useLanguage();

    // Enable image protection
    useImageProtection();
    const [selectedProject, setSelectedProject] = useState<DesignProject | null>(null);
    const [filter, setFilter] = useState("Todos");

    // Fetch projects using Supabase hook
    const { projects, loading } = useDesignProjects(
        filter === "Todos" ? undefined : filter
    );

    const categories = {
        logos: t('design.categories.logos'),
        visual_identity: t('design.categories.visualIdentity'),
        social_media: t('design.categories.socialMedia'),
        posters: t('design.categories.posters'),
        special: t('design.categories.special')
    };

    const categoryList = ["Todos", "logos", "visual_identity", "social_media", "posters", "special"];
    const categoryLabels: Record<string, string> = {
        "Todos": t('design.categories.all'),
        "logos": t('design.categories.logos'),
        "visual_identity": t('design.categories.visualIdentity'),
        "social_media": t('design.categories.socialMedia'),
        "posters": t('design.categories.posters'),
        "special": t('design.categories.special')
    };

    const filteredProjects = filter === "Todos"
        ? projects
        : projects.filter(p => p.category === filter);

    // Apply limit if specified
    const displayProjects = limit ? filteredProjects.slice(0, limit) : filteredProjects;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-muted-foreground">{t('portfolio.loading')}</p>
            </div>
        );
    }

    return (
        <section id="design-gallery" className="py-20 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                {showHeader && (
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-6">
                            {t('design.title')}
                        </h2>
                        <p className="text-muted-foreground text-lg font-light max-w-2xl mx-auto">
                            {t('design.description')}
                        </p>
                    </div>
                )}

                {/* Category Filter */}
                {showFilters && (
                    <div className="flex flex-wrap justify-center gap-4 mb-12">
                        {categoryList.map((category) => (
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
                )}

                {/* Projects Grid */}
                {displayProjects.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-muted-foreground">
                            {t('design.noProjects') || 'Nenhum projeto encontrado'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {displayProjects.map((project, index) => (
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

                                    <InteractionBar
                                        itemId={project.id}
                                        type="design"
                                        initialLikes={project.likes_count}
                                        initialComments={project.comments_count}
                                        initialShares={project.shares_count}
                                        variant="light"
                                        className="mt-4 pt-4 border-t border-border/50"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {selectedProject && (
                <ProjectModal
                    project={selectedProject}
                    onClose={() => setSelectedProject(null)}
                />
            )}
        </section>
    );
};

export default DesignGrid;
