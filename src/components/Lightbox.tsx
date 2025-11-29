import { useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export interface Photo {
  id: string;
  src: string;
  alt: string;
  category: string;
}

interface LightboxProps {
  photo: Photo;
  photos: Photo[];
  onClose: () => void;
  onNavigate: (photo: Photo) => void;
}

const Lightbox = ({ photo, photos, onClose, onNavigate }: LightboxProps) => {
  const currentIndex = photos.findIndex((p) => p.id === photo.id);

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
        className="absolute left-6 text-white/80 hover:text-white transition-colors z-10"
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
        className="absolute right-6 text-white/80 hover:text-white transition-colors z-10"
        aria-label="Next photo"
      >
        <ChevronRight size={48} strokeWidth={1.5} />
      </button>

      {/* Image */}
      <div
        className="relative max-w-7xl max-h-[90vh] mx-auto px-4"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={photo.src}
          alt={photo.alt}
          className="max-w-full max-h-[90vh] object-contain animate-scale-in"
        />
        <div className="text-center mt-6">
          <p className="text-white/90 text-sm tracking-wider font-light">
            {photo.category} • {currentIndex + 1} / {photos.length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Lightbox;
