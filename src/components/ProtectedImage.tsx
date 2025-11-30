import { useState } from 'react';

interface ProtectedImageProps {
    src: string;
    alt: string;
    className?: string;
    loading?: 'lazy' | 'eager';
    onImageClick?: () => void;
}

const ProtectedImage = ({
    src,
    alt,
    className = '',
    loading = 'lazy',
    onImageClick
}: ProtectedImageProps) => {
    const [showCopyrightMessage, setShowCopyrightMessage] = useState(false);

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

            {/* The actual image */}
            <img
                src={src}
                alt={alt}
                loading={loading}
                className={`select-none pointer-events-none ${className}`}
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

            {/* Copyright message tooltip */}
            {showCopyrightMessage && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-black/90 text-white px-6 py-3 rounded-lg shadow-xl animate-fade-in">
                    <p className="text-sm font-medium">© Imagem Protegida</p>
                    <p className="text-xs text-white/70 mt-1">Todos os direitos reservados</p>
                </div>
            )}
        </div>
    );
};

export default ProtectedImage;
