/**
 * Lazy Photo Component - Carregamento progressivo de imagens
 * Usa Intersection Observer para lazy loading inteligente
 */

import { useState, useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';

interface LazyPhotoProps {
    src: string;
    thumbnail?: string;
    alt: string;
    className?: string;
    onClick?: () => void;
}

export function LazyPhoto({ src, thumbnail, alt, className = '', onClick }: LazyPhotoProps) {
    const { ref, inView } = useInView({
        threshold: 0.1,
        triggerOnce: true,
        rootMargin: '200px' // Pré-carregar 200px antes de aparecer
    });

    const [imageSrc, setImageSrc] = useState(thumbnail || src);
    const [isLoaded, setIsLoaded] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        if (inView && imageSrc !== src) {
            // Carregar imagem de alta qualidade
            const img = new Image();
            img.src = src;
            img.onload = () => {
                setImageSrc(src);
                setIsLoaded(true);
            };
        }
    }, [inView, src, imageSrc]);

    return (
        <div
            ref={ref}
            className={`relative overflow-hidden ${className}`}
            onClick={onClick}
        >
            <img
                ref={imgRef}
                src={imageSrc}
                alt={alt}
                className={`w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-70'
                    }`}
                loading="lazy"
                decoding="async"
            />

            {/* Loading blur effect */}
            {!isLoaded && thumbnail && (
                <div className="absolute inset-0 backdrop-blur-sm bg-gray-900/10" />
            )}
        </div>
    );
}

/**
 * Responsive Image Component - WebP com fallback
 */
interface ResponsiveImageProps {
    src: string;
    webpSrc?: string;
    alt: string;
    className?: string;
    sizes?: string;
}

export function ResponsiveImage({
    src,
    webpSrc,
    alt,
    className = '',
    sizes = '100vw'
}: ResponsiveImageProps) {
    return (
        <picture>
            {webpSrc && (
                <source
                    srcSet={webpSrc}
                    type="image/webp"
                    sizes={sizes}
                />
            )}
            <source
                srcSet={src}
                type="image/jpeg"
                sizes={sizes}
            />
            <img
                src={src}
                alt={alt}
                className={className}
                loading="lazy"
                decoding="async"
            />
        </picture>
    );
}
