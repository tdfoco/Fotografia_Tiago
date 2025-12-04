import { useState } from "react";
import { usePhotography, useDesignProjects, getImageUrl } from "@/hooks/usePocketBaseData";
import { useLanguage } from "@/contexts/LanguageContext";
import { useImageProtection } from "@/hooks/useImageProtection";
import ProtectedImage from "./ProtectedImage";
import type { PhotographyItem, DesignProject } from "@/hooks/usePocketBaseData";

// Função para embaralhar array (shuffle)
const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

const DualPortfolioGrid = () => {
    const { t } = useLanguage();
    useImageProtection();

    const [photoFilter, setPhotoFilter] = useState<string>("all");
    const [designFilter, setDesignFilter] = useState<string>("all");

    const { photos, loading: photosLoading } = usePhotography(photoFilter === "all" ? undefined : photoFilter);
    const { projects, loading: projectsLoading } = useDesignProjects(designFilter === "all" ? undefined : designFilter);

    const photoCategories = [
        { key: "all", label: "Todos" },
        { key: "portraits", label: "Retratos" },
        { key: "urban", label: "Urbano" },
        { key: "nature", label: "Natureza" },
        { key: "art", label: "Arte" },
        { key: "events", label: "Eventos" }
    ];

    const designCategories = [
        { key: "all", label: "Todos" },
        { key: "logos", label: "Logos" },
        { key: "visual_identity", label: "Identidade Visual" },
        { key: "social_media", label: "Redes Sociais" },
        { key: "posters", label: "Pôsteres" },
        { key: "special", label: "Projetos Especiais" }
    ];

    return (
        <section id="dual-portfolio" className="min-h-screen bg-background py-20 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Main Title */}
                <h1 className="text-4xl md:text-6xl font-light tracking-tight text-center mb-16">
                    Portfólio
                </h1>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8">
                    {/* Photography Section */}
                    <div className="space-y-6">
                        {/* Photography Header */}
                        <div className="text-center lg:text-left">
                            <h2 className="text-2xl md:text-3xl font-display font-semibold mb-3 text-accent">
                                Fotografia
                            </h2>
                            <p className="text-muted-foreground text-sm md:text-base font-light mb-6">
                                Uma coleção de momentos capturados através de diferentes perspectivas
                            </p>

                            {/* Photography Filters */}
                            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                                {photoCategories.map((category) => (
                                    <button
                                        key={category.key}
                                        onClick={() => setPhotoFilter(category.key)}
                                        className={`px-4 py-2 rounded-full text-xs md:text-sm font-medium tracking-wide transition-all duration-300 ${photoFilter === category.key
                                            ? "bg-accent text-accent-foreground shadow-lg shadow-accent/30"
                                            : "bg-secondary text-secondary-foreground hover:bg-accent/20"
                                            }`}
                                    >
                                        {category.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Photography Grid */}
                        {photosLoading ? (
                            <div className="text-center py-12">
                                <p className="text-muted-foreground text-sm">Carregando...</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-3">
                                {shuffleArray(photos).slice(0, 8).map((photo, index) => (
                                    <div
                                        key={photo.id}
                                        className="group relative aspect-square overflow-hidden rounded-md animate-fade-in"
                                        style={{ animationDelay: `${index * 50}ms` }}
                                    >
                                        <ProtectedImage
                                            src={getImageUrl(photo.collectionId, photo.id, photo.image)}
                                            alt={photo.title}
                                            loading="lazy"
                                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            onImageClick={() => { }}
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-500 flex items-center justify-center pointer-events-none">
                                            <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-sm tracking-wider font-light">
                                                {photo.category}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* View More Button */}
                        <div className="text-center lg:text-left pt-6">
                            <a
                                href="/photography"
                                className="inline-block px-6 py-3 bg-accent text-accent-foreground rounded-full font-medium hover:bg-accent/90 transition-all duration-300 hover:scale-105 text-sm"
                            >
                                Ver mais fotografias
                            </a>
                        </div>
                    </div>

                    {/* Design Section */}
                    <div className="space-y-6">
                        {/* Design Header */}
                        <div className="text-center lg:text-left">
                            <h2 className="text-2xl md:text-3xl font-display font-semibold mb-3 text-accent">
                                Design Gráfico
                            </h2>
                            <p className="text-muted-foreground text-sm md:text-base font-light mb-6">
                                Identidades visuais modernas, branding e peças de design que criam forte impacto visual e experiências memoráveis de marca
                            </p>

                            {/* Design Filters */}
                            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                                {designCategories.map((category) => (
                                    <button
                                        key={category.key}
                                        onClick={() => setDesignFilter(category.key)}
                                        className={`px-4 py-2 rounded-full text-xs md:text-sm font-medium tracking-wide transition-all duration-300 ${designFilter === category.key
                                            ? "bg-accent text-accent-foreground shadow-lg shadow-accent/30"
                                            : "bg-secondary text-secondary-foreground hover:bg-accent/20"
                                            }`}
                                    >
                                        {category.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Design Grid */}
                        {projectsLoading ? (
                            <div className="text-center py-12">
                                <p className="text-muted-foreground text-sm">Carregando...</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-3">
                                {shuffleArray(projects).slice(0, 8).map((project, index) => (
                                    <div
                                        key={project.id}
                                        className="group relative aspect-square overflow-hidden rounded-md animate-fade-in"
                                        style={{ animationDelay: `${index * 50}ms` }}
                                    >
                                        <ProtectedImage
                                            src={project.images && project.images.length > 0 ? getImageUrl(project.collectionId, project.id, project.images[0]) : ''}
                                            alt={project.title}
                                            loading="lazy"
                                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            onImageClick={() => { }}
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-500 flex items-center justify-center pointer-events-none">
                                            <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-sm tracking-wider font-light">
                                                {project.category}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* View More Button */}
                        <div className="text-center lg:text-left pt-6">
                            <a
                                href="/design"
                                className="inline-block px-6 py-3 bg-accent text-accent-foreground rounded-full font-medium hover:bg-accent/90 transition-all duration-300 hover:scale-105 text-sm"
                            >
                                Ver mais projetos
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DualPortfolioGrid;
