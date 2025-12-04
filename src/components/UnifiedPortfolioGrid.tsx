import { useState } from "react";
import Masonry from "react-masonry-css";
import { motion } from "framer-motion";
import { usePhotography, useDesignProjects, getImageUrl } from "@/hooks/usePocketBaseData";
import { useImageProtection } from "@/hooks/useImageProtection";
import ProtectedImage from "./ProtectedImage";
import InteractionBar from "./InteractionBar";
import Lightbox, { Photo } from "./Lightbox";
import ProjectModal from "./ProjectModal";
import ProjectCard from "./ProjectCard";
import FilterBar from "./FilterBar";
import type { DesignProject } from "@/hooks/usePocketBaseData";
import { Heart, Eye, Share2 } from "lucide-react";
import { LazyPhoto } from "./LazyPhoto";

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
    data: any; // Store original data
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
            originalId: photo.id,
            data: photo
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
            originalId: project.id,
            data: project
        }))
    ];

    // Shuffle or sort unified items if needed, for now just concat
    // Maybe interleave them?
    const shuffledItems = unifiedItems.sort(() => Math.random() - 0.5);

    const breakpointColumns = {
        default: 4,
        1536: 3,
        1024: 2,
        640: 1
    };

    return (
        <section id="portfolio" className="min-h-screen bg-background py-20 px-4 md:px-8">
            <div className="max-w-[1600px] mx-auto">
                {/* Main Title */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground via-electric-blue to-foreground">
                        Portfólio
                    </h1>
                    <div className="w-24 h-1 bg-gradient-to-r from-electric-blue to-vibrant-purple mx-auto rounded-full shadow-[0_0_15px_rgba(58,139,253,0.8)]" />
                </div>

                {/* Filters Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                    <div>
                        <h3 className="text-xl font-display font-semibold mb-6 text-center text-electric-blue">Fotografia</h3>
                        <FilterBar
                            categories={photoCategories}
                            activeFilter={photoFilter}
                            onFilterChange={setPhotoFilter}
                        />
                    </div>
                    <div>
                        <h3 className="text-xl font-display font-semibold mb-6 text-center text-vibrant-purple">Design</h3>
                        <FilterBar
                            categories={designCategories}
                            activeFilter={designFilter}
                            onFilterChange={setDesignFilter}
                        />
                    </div>
                </div>

                {/* Unified Grid */}
                {loading ? (
                    <div className="text-center py-32">
                        <div className="inline-block w-16 h-16 border-4 border-electric-blue/30 border-t-electric-blue rounded-full animate-spin" />
                        <p className="text-muted-foreground mt-4 text-lg">Carregando...</p>
                    </div>
                ) : unifiedItems.length === 0 ? (
                    <div className="text-center py-32">
                        <p className="text-muted-foreground text-xl">Nenhum item encontrado</p>
                    </div>
                ) : (
                    <Masonry
                        breakpointCols={breakpointColumns}
                        className="masonry-grid"
                        columnClassName="masonry-grid_column"
                    >
                        {shuffledItems.map((item, index) => (
                            <div key={item.id} className="mb-6">
                                {item.type === 'design' ? (
                                    <ProjectCard
                                        project={item.data}
                                        index={index}
                                        onClick={setSelectedProject}
                                    />
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05, duration: 0.5 }}
                                        className="group relative cursor-pointer"
                                        onClick={() => {
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
                                                });
                                            }
                                        }}
                                    >
                                        <div className="relative overflow-hidden rounded-xl transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(58,139,253,0.4)] group-hover:ring-1 group-hover:ring-electric-blue/50">
                                            <LazyPhoto
                                                src={item.src}
                                                alt={item.alt}
                                                className="w-full h-auto transition-transform duration-700 group-hover:scale-110"
                                            />

                                            {/* Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none backdrop-blur-[1px]">
                                                <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                                                    <p className="text-xs font-medium text-electric-blue uppercase tracking-wider mb-1">
                                                        {item.category}
                                                    </p>
                                                    <h3 className="text-lg font-display font-bold leading-tight mb-3">
                                                        {item.alt}
                                                    </h3>

                                                    <div className="flex items-center gap-4 pt-3 border-t border-white/10 text-gray-300">
                                                        <div className="flex items-center gap-1.5">
                                                            <Heart size={14} />
                                                            <span className="text-xs">{item.likes_count || 0}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5">
                                                            <Eye size={14} />
                                                            <span className="text-xs">View</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        ))}
                    </Masonry>
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
