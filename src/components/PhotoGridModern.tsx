/**
 * Modern Photo Grid - Integra Masonry layout com sistema existente
 */

import { useState, useEffect } from "react";
import { usePhotography, getImageUrl, incrementLikes } from "@/hooks/usePocketBaseData";
import { useLanguage } from "@/contexts/LanguageContext";
import { useImageProtection } from "@/hooks/useImageProtection";
import { MasonryPhotoGrid } from "./MasonryPhotoGrid";
import Lightbox, { Photo } from "./Lightbox";
import { toast } from "sonner";
import FilterBar from "./FilterBar";
import { getRecommendations, trackPhotoView } from "@/lib/recommendation_engine";

interface PhotoGridModernProps {
    showHeader?: boolean;
    showFilters?: boolean;
    limit?: number;
}

const PhotoGridModern = ({ showHeader = true, showFilters = true, limit }: PhotoGridModernProps) => {
    const { t } = useLanguage();
    const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
    const [filter, setFilter] = useState<string>("all");
    const [recommendations, setRecommendations] = useState<any[]>([]);

    // Enable image protection
    useImageProtection();

    const { photos: pbPhotos, loading } = usePhotography(filter === "all" ? undefined : filter);

    const categories = [
        { key: "all", label: t('portfolio.categories.all') },
        { key: "portraits", label: t('portfolio.categories.portraits') },
        { key: "urban", label: t('portfolio.categories.urban') },
        { key: "nature", label: t('portfolio.categories.nature') },
        { key: "art", label: t('portfolio.categories.art') },
        { key: "events", label: t('portfolio.categories.events') }
    ];

    // Transform PocketBase photos to format expected by MasonryPhotoGrid
    const photos = pbPhotos.map(photo => ({
        id: photo.id,
        title: photo.title,
        url: getImageUrl(photo.collectionId, photo.id, photo.image),
        thumbnail: getImageUrl(photo.collectionId, photo.id, photo.image), // TODO: Add thumbnail support
        category: photo.category.charAt(0).toUpperCase() + photo.category.slice(1),
        tags: photo.tags || [],
        likes: photo.likes_count,
        views: photo.views_count,
        // Additional data for lightbox
        description: photo.description || '',
        camera_model: photo.camera_model,
        lens_model: photo.lens_model,
        iso: photo.iso,
        aperture: photo.aperture,
        shutter_speed: photo.shutter_speed,
        focal_length: photo.focal_length,
        comments_count: photo.comments_count,
        shares_count: photo.shares_count
    }));

    const filteredPhotos = filter === "all"
        ? photos
        : photos.filter(photo => photo.category.toLowerCase() === filter);

    // Apply limit if specified
    const displayPhotos = limit ? filteredPhotos.slice(0, limit) : filteredPhotos;

    // Generate recommendations when photos change
    useEffect(() => {
        if (photos.length > 0) {
            const recs = getRecommendations(photos, 12);
            setRecommendations(recs);
        }
    }, [photos.length]);

    const handlePhotoClick = (photo: any) => {
        // Track view for recommendations
        trackPhotoView(photo.id, 3, photo.category); // Assuming 3 seconds average view

        // Transform to Lightbox Photo format
        const lightboxPhoto: Photo = {
            id: photo.id,
            src: photo.url,
            alt: photo.title,
            category: photo.category,
            description: photo.description,
            camera_model: photo.camera_model,
            lens_model: photo.lens_model,
            iso: photo.iso,
            aperture: photo.aperture,
            shutter_speed: photo.shutter_speed,
            focal_length: photo.focal_length,
            likes_count: photo.likes,
            comments_count: photo.comments_count,
            shares_count: photo.shares_count
        };
        setSelectedPhoto(lightboxPhoto);
    };

    const handleLike = async (photoId: string) => {
        try {
            await incrementLikes(photoId, 'photography');
            toast.success("Foto curtida!");
        } catch (error) {
            console.error("Error liking photo:", error);
            toast.error("Erro ao curtir foto");
        }
    };

    const handleShare = async (photoId: string) => {
        const photo = photos.find(p => p.id === photoId);
        if (!photo) return;

        try {
            await navigator.share({
                title: photo.title,
                text: `Confira esta foto: ${photo.title}`,
                url: window.location.href
            });
        } catch (error) {
            // Fallback: copy to clipboard
            await navigator.clipboard.writeText(window.location.href);
            toast.success("Link copiado!");
        }
    };

    return (
        <section id="gallery" className="min-h-screen bg-background py-20 px-4 md:px-8">
            <div className="max-w-[1600px] mx-auto">
                {showHeader && (
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-6xl font-heading font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground via-accent to-foreground">
                            {t('portfolio.title')}
                        </h2>
                        <div className="w-32 h-1.5 bg-gradient-to-r from-accent to-purple-500 mx-auto mb-8 rounded-full shadow-[0_0_20px_rgba(58,139,253,0.5)]" />
                        <p className="text-muted-foreground text-lg md:text-xl font-light max-w-2xl mx-auto">
                            {t('portfolio.description')}
                        </p>
                    </div>
                )}

                {/* Category Filter */}
                {showFilters && (
                    <FilterBar
                        categories={categories}
                        activeFilter={filter}
                        onFilterChange={setFilter}
                        className="mb-16"
                    />
                )}

                {/* Recommendations Section */}
                {!loading && recommendations.length > 0 && filter === "all" && (
                    <div className="mb-20">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-2xl md:text-3xl font-display font-semibold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-accent to-purple-500">
                                    Recomendado para Você
                                </h3>
                                <p className="text-muted-foreground text-sm">
                                    Baseado no seu histórico de visualizações
                                </p>
                            </div>
                        </div>
                        <MasonryPhotoGrid
                            photos={recommendations}
                            onPhotoClick={handlePhotoClick}
                            onLike={handleLike}
                            onShare={handleShare}
                        />
                        <div className="mt-12 border-t border-border pt-12"></div>
                    </div>
                )}

                {/* Photo Grid */}
                {loading ? (
                    <div className="text-center py-32">
                        <div className="inline-block w-16 h-16 border-4 border-accent/30 border-t-accent rounded-full animate-spin" />
                        <p className="text-muted-foreground mt-4 text-lg">{t('portfolio.loading')}</p>
                    </div>
                ) : displayPhotos.length === 0 ? (
                    <div className="text-center py-32">
                        <p className="text-muted-foreground text-xl mb-6">
                            {t('portfolio.noPhotos')}
                        </p>
                        <a
                            href="/admin"
                            className="inline-block px-8 py-3 bg-accent text-accent-foreground rounded-full hover:bg-accent/90 transition-all duration-300 hover:scale-105 shadow-lg shadow-accent/30"
                        >
                            {t('portfolio.goToAdmin')}
                        </a>
                    </div>
                ) : (
                    <>
                        <h3 className="text-2xl md:text-3xl font-display font-semibold mb-8">
                            {filter === "all" ? "Todas as Fotos" : categories.find(c => c.key === filter)?.label}
                        </h3>
                        <MasonryPhotoGrid
                            photos={displayPhotos}
                            onPhotoClick={handlePhotoClick}
                            onLike={handleLike}
                            onShare={handleShare}
                        />
                    </>
                )}
            </div>

            {selectedPhoto && (
                <Lightbox
                    photo={selectedPhoto}
                    photos={displayPhotos.map(p => ({
                        id: p.id,
                        src: p.url,
                        alt: p.title,
                        category: p.category,
                        description: p.description,
                        camera_model: p.camera_model,
                        lens_model: p.lens_model,
                        iso: p.iso,
                        aperture: p.aperture,
                        shutter_speed: p.shutter_speed,
                        focal_length: p.focal_length,
                        likes_count: p.likes,
                        comments_count: p.comments_count,
                        shares_count: p.shares_count
                    }))}
                    onClose={() => setSelectedPhoto(null)}
                    onNavigate={(photo) => setSelectedPhoto(photo)}
                />
            )}
        </section>
    );
};

export default PhotoGridModern;
