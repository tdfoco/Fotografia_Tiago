/**
 * Modern Masonry Photo Grid
 * Grid responsivo estilo Pinterest com animações e hover effects
 */

import { useState } from 'react';
import Masonry from 'react-masonry-css';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Eye, Share2 } from 'lucide-react';
import { LazyPhoto } from './LazyPhoto';

interface Photo {
    id: string;
    title: string;
    url: string;
    thumbnail?: string;
    category: string;
    tags: string[];
    likes?: number;
    views?: number;
}

interface MasonryPhotoGridProps {
    photos: Photo[];
    onPhotoClick: (photo: Photo) => void;
    onLike?: (photoId: string) => void;
    onShare?: (photoId: string) => void;
}

export function MasonryPhotoGrid({
    photos,
    onPhotoClick,
    onLike,
    onShare
}: MasonryPhotoGridProps) {
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    const breakpointColumns = {
        default: 4,
        1536: 3,
        1024: 2,
        640: 1
    };

    return (
        <Masonry
            breakpointCols={breakpointColumns}
            className="masonry-grid"
            columnClassName="masonry-grid_column"
        >
            {photos.map((photo, index) => (
                <motion.div
                    key={photo.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.4 }}
                    className="group relative cursor-pointer"
                    onMouseEnter={() => setHoveredId(photo.id)}
                    onMouseLeave={() => setHoveredId(null)}
                >
                    <div className="photo-card relative overflow-hidden rounded-2xl">
                        {/* Image */}
                        <LazyPhoto
                            src={photo.url}
                            thumbnail={photo.thumbnail}
                            alt={photo.title}
                            className="w-full h-auto transition-transform duration-700 group-hover:scale-110"
                            onClick={() => onPhotoClick(photo)}
                        />

                        {/* Overlay com informações */}
                        <AnimatePresence>
                            {hoveredId === photo.id && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"
                                >
                                    {/* Conteúdo do overlay */}
                                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                        <motion.h3
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.1 }}
                                            className="text-xl font-heading font-semibold mb-2"
                                        >
                                            {photo.title}
                                        </motion.h3>

                                        <motion.p
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.15 }}
                                            className="text-sm text-white/80 mb-3"
                                        >
                                            {photo.category}
                                        </motion.p>

                                        {/* Tags */}
                                        <motion.div
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.2 }}
                                            className="flex flex-wrap gap-2 mb-4"
                                        >
                                            {photo.tags.slice(0, 3).map(tag => (
                                                <span
                                                    key={tag}
                                                    className="px-2 py-1 text-xs rounded-full bg-white/20 backdrop-blur-sm"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </motion.div>

                                        {/* Action Buttons */}
                                        <motion.div
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.25 }}
                                            className="flex items-center gap-4"
                                        >
                                            {onLike && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onLike(photo.id);
                                                    }}
                                                    className="flex items-center gap-1 hover:text-accent transition-colors"
                                                >
                                                    <Heart size={18} />
                                                    {photo.likes && <span className="text-sm">{photo.likes}</span>}
                                                </button>
                                            )}

                                            {photo.views !== undefined && (
                                                <div className="flex items-center gap-1">
                                                    <Eye size={18} />
                                                    <span className="text-sm">{photo.views}</span>
                                                </div>
                                            )}

                                            {onShare && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onShare(photo.id);
                                                    }}
                                                    className="flex items-center gap-1 hover:text-accent transition-colors"
                                                >
                                                    <Share2 size={18} />
                                                </button>
                                            )}
                                        </motion.div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            ))}
        </Masonry>
    );
}
