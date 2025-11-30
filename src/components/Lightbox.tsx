import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
import ProtectedImage from "./ProtectedImage";
import InteractionBar from "./InteractionBar";
import CommentsSection from "./CommentsSection";

export interface Photo {
  id: string;
  src: string;
  alt: string;
  category: string;
  description?: string;
  camera_model?: string;
  lens_model?: string;
  iso?: number;
  aperture?: string;
  shutter_speed?: string;
  focal_length?: string;
  likes_count?: number;
  comments_count?: number;
  shares_count?: number;
}


interface LightboxProps {
  photo: Photo;
  photos: Photo[];
  onClose: () => void;
  onNavigate: (photo: Photo) => void;
}

const Lightbox = ({ photo, photos, onClose, onNavigate }: LightboxProps) => {
  const currentIndex = photos.findIndex((p) => p.id === photo.id);
  const [showComments, setShowComments] = useState(false);

  const handlePrevious = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : photos.length - 1;
    onNavigate(photos[newIndex]);
  };

  const handleNext = () => {
    const newIndex = currentIndex < photos.length - 1 ? currentIndex + 1 : 0;
    onNavigate(photos[newIndex]);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrevious();
      if (e.key === "ArrowRight") handleNext();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentIndex, onClose, handlePrevious, handleNext]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center animate-fade-in"
      onClick={onClose}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors z-50"
        aria-label="Close lightbox"
      >
        <X size={32} strokeWidth={1.5} />
      </button>

      {/* Previous Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handlePrevious();
        }}
        className="absolute left-6 text-white/80 hover:text-white transition-colors z-10 hidden md:block"
        aria-label="Previous photo"
      >
        <ChevronLeft size={48} strokeWidth={1.5} />
      </button>

      {/* Next Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleNext();
        }}
        className="absolute right-6 text-white/80 hover:text-white transition-colors z-10 hidden md:block"
        aria-label="Next photo"
      >
        <ChevronRight size={48} strokeWidth={1.5} />
      </button>

      <div
        className={`relative max-w-7xl max-h-[90vh] mx-auto px-4 flex flex-col md:flex-row items-center gap-8 transition-all duration-300 ${showComments ? 'w-full' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`flex flex-col items-center transition-all duration-300 ${showComments ? 'md:w-2/3' : 'w-full'}`}>
          <ProtectedImage
            src={photo.src}
            alt={photo.alt}
            className="max-w-full max-h-[70vh] object-contain animate-scale-in"
            loading="eager"
          />

          {/* Info & Metadata */}
          <div className="text-center mt-4 space-y-2 w-full">
            <div className="flex justify-center mb-4">
              <InteractionBar
                itemId={photo.id}
                type="photography"
                initialLikes={photo.likes_count}
                initialComments={photo.comments_count}
                initialShares={photo.shares_count}
                onCommentClick={() => setShowComments(!showComments)}
                variant="dark"
              />
            </div>

            <p className="text-white/90 text-sm tracking-wider font-light">
              {photo.category} • {currentIndex + 1} / {photos.length}
            </p>

            {photo.description && (
              <p className="text-white/70 text-sm max-w-2xl mx-auto line-clamp-2">
                {photo.description}
              </p>
            )}

            {/* EXIF Data Display */}
            {(photo.camera_model || photo.aperture || photo.iso) && (
              <div className="flex flex-wrap justify-center gap-4 text-xs text-white/50 font-mono mt-2">
                {photo.camera_model && <span>{photo.camera_model}</span>}
                {photo.lens_model && <span>{photo.lens_model}</span>}
                {photo.focal_length && <span>{photo.focal_length}</span>}
                {photo.aperture && <span>{photo.aperture}</span>}
                {photo.shutter_speed && <span>{photo.shutter_speed}</span>}
                {photo.iso && <span>ISO {photo.iso}</span>}
              </div>
            )}
          </div>
        </div>

        {/* Comments Sidebar */}
        {showComments && (
          <div className="w-full md:w-1/3 bg-background/95 backdrop-blur-sm rounded-lg p-6 h-[70vh] overflow-hidden flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-foreground">Comentários</h3>
              <button onClick={() => setShowComments(false)} className="text-muted-foreground hover:text-foreground">
                <X size={20} />
              </button>
            </div>
            <CommentsSection
              itemId={photo.id}
              type="photography"
              className="flex-1 overflow-hidden flex flex-col"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Lightbox;
