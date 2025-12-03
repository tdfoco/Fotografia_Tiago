import { useState } from "react";
import { usePhotography, useDesignProjects, getImageUrl } from "@/hooks/usePocketBaseData";
import { useImageProtection } from "@/hooks/useImageProtection";
import ProtectedImage from "./ProtectedImage";
import InteractionBar from "./InteractionBar";
import Lightbox, { Photo } from "./Lightbox";
import ProjectModal from "./ProjectModal";
import type { DesignProject } from "@/hooks/usePocketBaseData";

type UnifiedItem = {
    id: string;
    src: string;
    alt: string;
    type: 'photography' | 'design';
    category: string;
    likes_count?: number;
    comments_count?: number;
    shares_count?: number;
    originalId: string;
};

const UnifiedPortfolioGrid = () => {
    useImageProtection();

    const [photoFilter, setPhotoFilter] = useState<string>("all");
    const [designFilter, setDesignFilter] = useState<string>("all");
    const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
    const [selectedProject, setSelectedProject] = useState<DesignProject | null>(null);

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
            src: getImageUrl(photo.collectionId, photo.id, photo.image),
            alt: photo.title,
            type: 'photography' as const,
            category: photo.category,
            likes_count: photo.likes_count,
            comments_count: photo.comments_count,
            shares_count: photo.shares_count,
            originalId: photo.id
        })),
        ...projects.map(project => ({
            id: `design-${project.id}`,
            src: project.images && project.images.length > 0 ? getImageUrl(project.collectionId, project.id, project.images[0]) : '',
            alt: project.title,
            type: 'design' as const,
            category: project.category,
            likes_count: project.likes_count,
            comments_count: project.comments_count,
            shares_count: project.shares_count,
            originalId: project.id
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
                                className="group animate-fade-in"
                                style={{ animationDelay: `${index * 30}ms` }}
                            >
                                <div className="relative aspect-square overflow-hidden rounded-lg">
                                    <ProtectedImage
                                        src={item.src}
                                        alt={item.alt}
                                        loading="lazy"
                                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        onImageClick={() => {
                                            if (item.type === 'photography') {
                                                const photo = photos.find(p => p.id === item.originalId);
                                                if (photo) {
                                                    setSelectedPhoto({
                                                        id: photo.id,
                                                        src: getImageUrl(photo.collectionId, photo.id, photo.image),
                                                        alt: photo.title,
                                                        category: photo.category,
                                                        description: photo.description,
                                                        likes_count: photo.likes_count,
                                                        comments_count: photo.comments_count,
                                                        shares_count: photo.shares_count,
                                                        // Map other fields if necessary
                                                    });
                                                }
                                            } else {
                                                const project = projects.find(p => p.id === item.originalId);
                                                if (project) setSelectedProject(project);
                                            }
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-500 flex items-center justify-center pointer-events-none">
                                        <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-sm tracking-wider font-light">
                                            {item.type === 'photography' ? 'Fotografia' : 'Design'}
                                        </span>
                                    </div>
                                </div>

                                <InteractionBar
                                    itemId={item.originalId}
                                    type={item.type}
                                    initialLikes={item.likes_count}
                                    initialComments={item.comments_count}
                                    initialShares={item.shares_count}
                                    variant="light"
                                    className="mt-2 justify-between px-1"
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Lightbox for Photography */}
            {selectedPhoto && (
                <Lightbox
                    photo={selectedPhoto}
                    photos={photos.map(p => ({
                        id: p.id,
                        src: getImageUrl(p.collectionId, p.id, p.image),
                        alt: p.title,
                        category: p.category,
                        description: p.description,
                        likes_count: p.likes_count,
                        comments_count: p.comments_count,
                        shares_count: p.shares_count
                    }))}
                    onClose={() => setSelectedPhoto(null)}
                    onNavigate={(photo) => setSelectedPhoto(photo)}
                />
            )}

            {/* Modal for Design Projects */}
            {selectedProject && (
                <ProjectModal
                    project={selectedProject}
                    onClose={() => setSelectedProject(null)}
                />
            )}
        </section >
    );
};

export default UnifiedPortfolioGrid;
