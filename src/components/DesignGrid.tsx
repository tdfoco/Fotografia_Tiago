import { useState } from "react";
import { useDesignProjects, getImageUrl } from "@/hooks/usePocketBaseData";
import type { DesignProject } from "@/hooks/usePocketBaseData";
import { useLanguage } from "@/contexts/LanguageContext";
import { useImageProtection } from "@/hooks/useImageProtection";
import ProtectedImage from "./ProtectedImage";
import ProjectModal from "./ProjectModal";
import InteractionBar from "./InteractionBar";
import FavoriteButton from "./FavoriteButton";
import ProjectCard from "./ProjectCard";
import FilterBar from "./FilterBar";

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

    // Fetch projects using PocketBase hook
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
                    <FilterBar
                        categories={categoryList.map(cat => ({ key: cat, label: categoryLabels[cat] }))}
                        activeFilter={filter}
                        onFilterChange={setFilter}
                        className="mb-12"
                    />
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
                            <ProjectCard
                                key={project.id}
                                project={project}
                                index={index}
                                onClick={setSelectedProject}
                            />
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
