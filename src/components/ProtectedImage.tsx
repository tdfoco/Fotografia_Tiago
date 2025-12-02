import { useState } from 'react';
import { useAuth } from '@/hooks/useSupabaseData';
import { useImageLoader } from '@/hooks/useImageLoader';

interface ProtectedImageProps {
    src: string; // High-res URL
    srcLowRes?: string; // Low-res URL (público)
    srcThumbnail?: string; // Thumbnail URL
    alt: string;
    className?: string;
    loading?: 'lazy' | 'eager';
    onImageClick?: () => void;
    showWatermark?: boolean; // Mostrar watermark em low-res
}

const ProtectedImage = ({
    src,
    srcLowRes,
    srcThumbnail,
    alt,
    className = '',
    loading = 'lazy',
    onImageClick,
    showWatermark = true
}: ProtectedImageProps) => {
    const [showCopyrightMessage, setShowCopyrightMessage] = useState(false);
    const { user } = useAuth();

    // Usuários autenticados podem ver alta resolução
    const isAuthenticated = !!user;

    // Usar hook de carregamento progressivo
    const { currentSrc, loading: imageLoading } = useImageLoader({
        lowResSrc: srcLowRes || src,
        highResSrc: src,
        thumbnailSrc: srcThumbnail,
        loadHighRes: isAuthenticated
    });

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        setShowCopyrightMessage(true);
        setTimeout(() => setShowCopyrightMessage(false), 2000);
        return false;
    };

    const handleDragStart = (e: React.DragEvent) => {
        e.preventDefault();
        return false;
    };

    const handleClick = () => {
        if (onImageClick) {
            onImageClick();
        }
    };

    return (
        <div className="relative inline-block w-full h-full">
            {/* Transparent overlay to prevent direct image interaction */}
            <div
                className="absolute inset-0 z-10 cursor-pointer"
                onContextMenu={handleContextMenu}
                onDragStart={handleDragStart}
                onClick={handleClick}
            />

            {/* Loading skeleton */}
            {imageLoading && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse" />
            )}

            {/* The actual image */}
            <img
                src={currentSrc || src}
                alt={alt}
                loading={loading}
                className={`select-none pointer-events-none transition-opacity duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'
                    } ${className}`}
                draggable="false"
                onContextMenu={handleContextMenu}
                onDragStart={handleDragStart}
                style={{
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                    MozUserSelect: 'none',
                    msUserSelect: 'none',
                }}
            />

            {/* Watermark sutil para imagens low-res (não autenticadas) */}
            {showWatermark && !isAuthenticated && (
                <div className="absolute bottom-2 right-2 bg-black/30 text-white text-xs px-2 py-1 rounded backdrop-blur-sm pointer-events-none select-none">
                    © tdfoco
                </div>
            )}

            {/* Copyright message tooltip */}
            {showCopyrightMessage && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-black/90 text-white px-6 py-3 rounded-lg shadow-xl animate-fade-in">
                    <p className="text-sm font-medium">© Imagem Protegida</p>
                    <p className="text-xs text-white/70 mt-1">Todos os direitos reservados</p>
                    {!isAuthenticated && (
                        <p className="text-xs text-blue-300 mt-2">Faça login para ver em alta resolução</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProtectedImage;
