import { useState } from "react";
import { usePhotography, useDesignProjects } from "@/hooks/useSupabaseData";
import { useImageProtection } from "@/hooks/useImageProtection";
import ProtectedImage from "./ProtectedImage";

type UnifiedItem = {
    id: string;
    src: string;
    alt: string;
    type: 'photography' | 'design';
    category: string;
};

const UnifiedPortfolioGrid = () => {
    useImageProtection();

    const [photoFilter, setPhotoFilter] = useState<string>("all");
    const [designFilter, setDesignFilter] = useState<string>("all");

    const { photos, loading: photosLoading } = usePhotography(photoFilter === "all" ? undefined : photoFilter);
    const { projects, loading: projectsLoading } = useDesignProjects(designFilter === "all" ? undefined : designFilter);

    const loading = photosLoading || projectsLoading;

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

    // Combine both portfolios into unified items
    const unifiedItems: UnifiedItem[] = [
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
        <section id="portfolio" className="min-h-screen bg-background py-20 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Main Title */}
                <h1 className="text-5xl md:text-6xl font-light tracking-tight text-center mb-12">
                    Portfólio
                </h1>

                {/* Two sections side by side with divider */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-8">
                    {/* Photography Section */}
                    <div className="text-center md:text-right md:border-r border-border md:pr-8">
                        <h2 className="text-2xl md:text-3xl font-display font-semibold mb-4 text-[#00A3FF]">
                            Fotografia
                        </h2>
                        <p className="text-muted-foreground text-sm md:text-base font-light leading-relaxed">
                            Uma coleção de momentos capturados através de diferentes perspectivas
                        </p>
                    </div>

                    {/* Design Section */}
                    <div className="text-center md:text-left md:pl-8">
                        <h2 className="text-2xl md:text-3xl font-display font-semibold mb-4 text-[#00A3FF]">
                            Design Gráfico
                        </h2>
                        <p className="text-muted-foreground text-sm md:text-base font-light leading-relaxed">
                            Identidades visuais modernas, branding e peças de design que criam forte impacto visual e experiências memoráveis de marca
                        </p>
                    </div>
                </div>

                {/* Category Filters - Two rows */}
                <div className="space-y-4 mb-12">
                    {/* Photography Filters */}
                    <div className="flex flex-wrap gap-3 justify-center">
                        {photoCategories.map((category) => (
                            <button
                                key={category.key}
                                onClick={() => setPhotoFilter(category.key)}
                                className={`px-5 py-2 rounded-full text-sm font-medium tracking-wide transition-all duration-300 ${photoFilter === category.key
                                        ? "bg-[#00A3FF] text-white shadow-lg shadow-[#00A3FF]/30"
                                        : "bg-secondary text-secondary-foreground hover:bg-[#00A3FF]/20"
                                    }`}
                            >
                                {category.label}
                            </button>
                        ))}
                    </div>

                    {/* Design Filters */}
                    <div className="flex flex-wrap gap-3 justify-center">
                        {designCategories.map((category) => (
                            <button
                                key={category.key}
                                onClick={() => setDesignFilter(category.key)}
                                className={`px-5 py-2 rounded-full text-sm font-medium tracking-wide transition-all duration-300 ${designFilter === category.key
                                        ? "bg-[#00A3FF] text-white shadow-lg shadow-[#00A3FF]/30"
                                        : "bg-secondary text-secondary-foreground hover:bg-[#00A3FF]/20"
                                    }`}
                            >
                                {category.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Unified Grid */}
                {loading ? (
                    <div className="text-center py-20">
                        <p className="text-muted-foreground">Carregando...</p>
                    </div>
                ) : unifiedItems.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-muted-foreground">Nenhum item encontrado</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {unifiedItems.map((item, index) => (
                            <div
                                key={item.id}
                                className="group relative aspect-square overflow-hidden rounded-lg animate-fade-in"
                                style={{ animationDelay: `${index * 30}ms` }}
                            >
                                <ProtectedImage
                                    src={item.src}
                                    alt={item.alt}
                                    loading="lazy"
                                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    onImageClick={() => { }}
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-500 flex items-center justify-center pointer-events-none">
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
