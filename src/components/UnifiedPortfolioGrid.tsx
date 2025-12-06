import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePhotography, useDesignProjects, getImageUrl } from "@/hooks/usePocketBaseData";
import { useImageProtection } from "@/hooks/useImageProtection";
import ProtectedImage from "./ProtectedImage";
import InteractionBar from "./InteractionBar";
import Lightbox, { Photo } from "./Lightbox";
import ProjectModal from "./ProjectModal";
import ProjectCard from "./ProjectCard";
import FilterBar from "./FilterBar";
import type { DesignProject } from "@/hooks/usePocketBaseData";
import { Heart, Eye, Share2, ChevronDown } from "lucide-react";
import { LazyPhoto } from "./LazyPhoto";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
    created: string;
};

interface UnifiedPortfolioGridProps {
    photographyOnly?: boolean; // If true, shows only photography without tabs
    showTitle?: boolean; // If false, hides the "Portfólio" title
}

const UnifiedPortfolioGrid = ({ photographyOnly = false, showTitle = true }: UnifiedPortfolioGridProps = {}) => {
    useImageProtection();

    const [activeTab, setActiveTab] = useState<'all' | 'photography' | 'design'>(photographyOnly ? 'photography' : 'all');
    const [subCategory, setSubCategory] = useState<string>("all");
    const [displayCount, setDisplayCount] = useState(20);
    const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
    const [selectedProject, setSelectedProject] = useState<DesignProject | null>(null);

    const { photos, loading: photosLoading } = usePhotography();
    const { projects, loading: projectsLoading } = useDesignProjects();

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
    const allItems: UnifiedItem[] = useMemo(() => {
        const pItems = photos.map(photo => ({
            id: `photo-${photo.id}`,
            src: getImageUrl(photo.collectionId, photo.id, photo.image),
            alt: photo.title,
            type: 'photography' as const,
            category: photo.category,
            likes_count: photo.likes_count,
            comments_count: photo.comments_count,
            shares_count: photo.shares_count,
            originalId: photo.id,
            data: photo,
            created: photo.created
        }));

        const dItems = projects.map(project => ({
            id: `design-${project.id}`,
            src: project.images && project.images.length > 0 ? getImageUrl(project.collectionId, project.id, project.images[0]) : '',
            alt: project.title,
            type: 'design' as const,
            category: project.category,
            likes_count: project.likes_count,
            comments_count: project.comments_count,
            shares_count: project.shares_count,
            originalId: project.id,
            data: project,
            created: project.created
        }));

        return [...pItems, ...dItems].sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
    }, [photos, projects]);

    const filteredItems = useMemo(() => {
        let items = allItems;

        if (activeTab === 'photography') {
            items = items.filter(item => item.type === 'photography');
        } else if (activeTab === 'design') {
            items = items.filter(item => item.type === 'design');
        }

        if (subCategory !== 'all') {
            items = items.filter(item => item.category === subCategory);
        }

        return items;
    }, [allItems, activeTab, subCategory]);

    const visibleItems = filteredItems.slice(0, displayCount);
    const hasMore = filteredItems.length > displayCount;

    const handleTabChange = (tab: 'all' | 'photography' | 'design') => {
        setActiveTab(tab);
        setSubCategory('all');
        setDisplayCount(20);
    };

    const handleLoadMore = () => {
        setDisplayCount(prev => prev + 20);
    };

    return (
        <section id="portfolio" className="min-h-screen bg-background py-20 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Main Title */}
                {showTitle && (
                    <div className="text-center mb-12">
                        <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground via-electric-blue to-foreground">
                            Portfólio
                        </h1>
                        <div className="w-24 h-1 bg-gradient-to-r from-electric-blue to-vibrant-purple mx-auto rounded-full shadow-[0_0_15px_rgba(58,139,253,0.8)]" />
                    </div>
                )}

                {/* Tabs & Filters */}
                <div className="flex flex-col items-center gap-8 mb-16">
                    {/* Main Tabs */}
                    {!photographyOnly && (
                        <div className="flex p-1 bg-secondary/30 backdrop-blur-sm rounded-full border border-white/5">
                            {[
                                { id: 'all', label: 'Todos' },
                                { id: 'photography', label: 'Fotografia' },
                                { id: 'design', label: 'Design' }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => handleTabChange(tab.id as any)}
                                    className={cn(
                                        "px-8 py-3 rounded-full text-sm font-medium transition-all duration-300",
                                        activeTab === tab.id
                                            ? "bg-electric-blue text-white shadow-[0_0_20px_rgba(58,139,253,0.3)]"
                                            : "text-muted-foreground hover:text-white hover:bg-white/5"
                                    )}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Sub Filters */}
                    <AnimatePresence mode="wait">
                        {(photographyOnly || activeTab !== 'all') && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="w-full max-w-4xl"
                            >
                                <FilterBar
                                    categories={photographyOnly || activeTab === 'photography' ? photoCategories : designCategories}
                                    activeFilter={subCategory}
                                    onFilterChange={setSubCategory}
                                    className="justify-center"
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Unified Grid */}
                {loading ? (
                    <div className="text-center py-32">
                        <div className="inline-block w-16 h-16 border-4 border-electric-blue/30 border-t-electric-blue rounded-full animate-spin" />
                        <p className="text-muted-foreground mt-4 text-lg">Carregando...</p>
                    </div>
                ) : visibleItems.length === 0 ? (
                    <div className="text-center py-32">
                        <p className="text-muted-foreground text-xl">Nenhum item encontrado</p>
                    </div>
                ) : (
                    <>
                        {/* Conditional Layout */}
                        {activeTab === 'design' ? (
                            /* Design Grid Layout */
                            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4">
                                {visibleItems.map((item, index) => (
                                    <div key={item.id}>
                                        <ProjectCard
                                            project={item.data}
                                            index={index}
                                            onClick={setSelectedProject}
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            /* Photography Masonry Layout (also used for 'All') */
                            <div className="columns-1 xs:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                                {visibleItems.map((item, index) => (
                                    <div key={item.id} className="break-inside-avoid mb-4">
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
                            </div>
                        )}

                        {/* Load More Button */}
                        {hasMore && (
                            <div className="flex justify-center mt-16">
                                <Button
                                    onClick={handleLoadMore}
                                    variant="outline"
                                    size="lg"
                                    className="group border-electric-blue/30 hover:border-electric-blue text-foreground hover:bg-electric-blue/10 gap-2 px-8"
                                >
                                    Carregar Mais
                                    <ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
                                </Button>
                            </div>
                        )}
                    </>
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
