import { useState } from "react";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import gallery5 from "@/assets/gallery-5.jpg";
import gallery6 from "@/assets/gallery-6.jpg";
import gallery7 from "@/assets/gallery-7.jpg";
import gallery8 from "@/assets/gallery-8.jpg";
import Lightbox from "./Lightbox";

export interface Photo {
  id: number;
  src: string;
  alt: string;
  category: string;
}

const photos: Photo[] = [
  { id: 1, src: gallery1, alt: "Portrait photography", category: "Retratos" },
  { id: 2, src: gallery2, alt: "Architecture photography", category: "Urbano" },
  { id: 3, src: gallery3, alt: "Nature photography", category: "Natureza" },
  { id: 4, src: gallery4, alt: "Street photography", category: "Urbano" },
  { id: 5, src: gallery5, alt: "Abstract photography", category: "Arte" },
  { id: 6, src: gallery6, alt: "Seascape photography", category: "Natureza" },
  { id: 7, src: gallery7, alt: "Wedding event photography", category: "Eventos" },
  { id: 8, src: gallery8, alt: "Corporate event photography", category: "Eventos" },
];

const PhotoGrid = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [filter, setFilter] = useState<string>("Todos");

  const categories = ["Todos", "Retratos", "Urbano", "Natureza", "Arte", "Eventos"];
  
  const filteredPhotos = filter === "Todos" 
    ? photos 
    : photos.filter(photo => photo.category === filter);

  return (
    <section id="gallery" className="min-h-screen bg-background py-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-6">
            Portfolio
          </h2>
          <p className="text-muted-foreground text-lg font-light max-w-2xl mx-auto">
            Uma coleção de momentos capturados através de diferentes perspectivas
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-6 py-2 rounded-full text-sm font-light tracking-wide transition-all duration-300 ${
                filter === category
                  ? "bg-accent text-accent-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-accent/20"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPhotos.map((photo, index) => (
            <div
              key={photo.id}
              className="group relative aspect-[4/5] md:aspect-square overflow-hidden rounded-lg cursor-pointer animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => setSelectedPhoto(photo)}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-500 flex items-center justify-center">
                <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-sm tracking-wider font-light">
                  {photo.category}
                </span>
              </div>
            </div>
          ))}
        </div>
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
