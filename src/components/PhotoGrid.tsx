import { useState } from "react";
import { usePhotography } from "@/hooks/useSupabaseData";
import { useLanguage } from "@/contexts/LanguageContext";
import { useImageProtection } from "@/hooks/useImageProtection";
import ProtectedImage from "./ProtectedImage";
import Lightbox, { Photo } from "./Lightbox";

interface PhotoGridProps {
  showHeader?: boolean;
}

const PhotoGrid = ({ showHeader = true }: PhotoGridProps) => {
  const { t } = useLanguage();
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [filter, setFilter] = useState<string>("all");

  // Enable image protection
  useImageProtection();

  const { photos: supabasePhotos, loading } = usePhotography(filter === "all" ? undefined : filter);

  const categories = [
    { key: "all", label: t('portfolio.categories.all') },
    { key: "portraits", label: t('portfolio.categories.portraits') },
    { key: "urban", label: t('portfolio.categories.urban') },
    { key: "nature", label: t('portfolio.categories.nature') },
    { key: "art", label: t('portfolio.categories.art') },
    { key: "events", label: t('portfolio.categories.events') }
  ];

  // Transform Supabase photos to Photo format
  const photos: Photo[] = supabasePhotos.map(photo => ({
    id: photo.id,
    src: photo.url,
    alt: photo.title,
    category: photo.category.charAt(0).toUpperCase() + photo.category.slice(1),
    description: photo.description,
    camera_model: photo.camera_model,
    lens_model: photo.lens_model,
    iso: photo.iso,
    aperture: photo.aperture,
    shutter_speed: photo.shutter_speed,
    focal_length: photo.focal_length
  }));

  const filteredPhotos = filter === "all"
    ? photos
    : photos.filter(photo => photo.category.toLowerCase() === filter);

  return (
    <section id="gallery" className="min-h-screen bg-background py-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {showHeader && (
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-6">
              {t('portfolio.title')}
            </h2>
            <p className="text-muted-foreground text-lg font-light max-w-2xl mx-auto">
              {t('portfolio.description')}
            </p>
          </div>
        )}

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category.key}
              onClick={() => setFilter(category.key)}
              className={`px-6 py-2 rounded-full text-sm font-light tracking-wide transition-all duration-300 ${filter === category.key
                ? "bg-accent text-accent-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-accent/20"
                }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Photo Grid */}
        {loading ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">{t('portfolio.loading')}</p>
          </div>
        ) : filteredPhotos.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">
              {t('portfolio.noPhotos')}
            </p>
            <a href="/admin" className="inline-block mt-4 px-6 py-2 bg-accent text-accent-foreground rounded-full hover:bg-accent/90 transition-colors">
              {t('portfolio.goToAdmin')}
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPhotos.map((photo, index) => (
              <div
                key={photo.id}
                className="group relative aspect-[4/5] md:aspect-square overflow-hidden rounded-lg animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ProtectedImage
                  src={photo.src}
                  alt={photo.alt}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onImageClick={() => setSelectedPhoto(photo)}
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
      </div>

      {selectedPhoto && (
        <Lightbox
          photo={selectedPhoto}
          photos={filteredPhotos}
          onClose={() => setSelectedPhoto(null)}
          onNavigate={setSelectedPhoto}
        />
      )}
    </section>
  );
};

export default PhotoGrid;
