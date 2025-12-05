/**
 * OptimizedImage Component - Componente otimizado para performance
 * Features: WebP com fallback, lazy loading, blur placeholder, responsive
 */

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
    sizes?: string;
    priority?: boolean;
    blurDataURL?: string;
    objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
}

const OptimizedImage = ({
    src,
    alt,
    width,
    height,
    className,
    sizes = '100vw',
    priority = false,
    blurDataURL,
    objectFit = 'cover'
}: OptimizedImageProps) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    // Gerar srcset para diferentes tamanhos
    const generateSrcSet = (baseSrc: string, format: 'webp' | 'jpg') => {
        const sizes = [320, 640, 768, 1024, 1280, 1920];
        const ext = format === 'webp' ? '.webp' : '.jpg';

        // Se a imagem for uma URL do PocketBase ou externa, retornar apenas a original
        if (baseSrc.includes('http://') || baseSrc.includes('https://')) {
            return baseSrc;
        }

        // Remove extensão original
        const baseWithoutExt = baseSrc.replace(/\.[^/.]+$/, '');

        return sizes
            .map(size => `${baseWithoutExt}_${size}${ext} ${size}w`)
            .join(', ');
    };

    // Gerar URL padrão
    const getDefaultSrc = (baseSrc: string) => {
        if (baseSrc.includes('http://') || baseSrc.includes('https://')) {
            return baseSrc;
        }
        return baseSrc.replace(/\.[^/.]+$/, '') + '_1024.jpg';
    };

    useEffect(() => {
        if (priority) {
            const img = new Image();
            img.src = getDefaultSrc(src);
            img.onload = () => setIsLoaded(true);
            img.onerror = () => setHasError(true);
        }
    }, [src, priority]);

    const handleLoad = () => {
        setIsLoaded(true);
    };

    const handleError = () => {
        setHasError(true);
        setIsLoaded(true);
    };

    return (
        <div
            className={cn('relative overflow-hidden', className)}
            style={{ aspectRatio: width && height ? `${width}/${height}` : undefined }}
        >
            {/* Blur Placeholder */}
            {blurDataURL && !isLoaded && (
                <img
                    src={blurDataURL}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover filter blur-xl scale-110"
                    aria-hidden="true"
                />
            )}

            {/* Loading Skeleton */}
            {!isLoaded && !blurDataURL && (
                <div className="absolute inset-0 bg-secondary/30 animate-pulse" />
            )}

            {/* Main Picture Element */}
            {!hasError ? (
                <picture>
                    {/* WebP Source */}
                    <source
                        type="image/webp"
                        srcSet={generateSrcSet(src, 'webp')}
                        sizes={sizes}
                    />

                    {/* Fallback JPEG Source */}
                    <source
                        type="image/jpeg"
                        srcSet={generateSrcSet(src, 'jpg')}
                        sizes={sizes}
                    />

                    {/* Fallback IMG */}
                    <img
                        src={getDefaultSrc(src)}
                        alt={alt}
                        width={width}
                        height={height}
                        loading={priority ? 'eager' : 'lazy'}
                        decoding="async"
                        onLoad={handleLoad}
                        onError={handleError}
                        className={cn(
                            'w-full h-full transition-opacity duration-500',
                            isLoaded ? 'opacity-100' : 'opacity-0',
                            objectFit === 'cover' && 'object-cover',
                            objectFit === 'contain' && 'object-contain',
                            objectFit === 'fill' && 'object-fill',
                            objectFit === 'none' && 'object-none',
                            objectFit === 'scale-down' && 'object-scale-down'
                        )}
                        style={{
                            objectPosition: 'center'
                        }}
                    />
                </picture>
            ) : (
                /* Error Fallback */
                <div className="absolute inset-0 flex items-center justify-center bg-secondary/20">
                    <div className="text-center p-4">
                        <svg
                            className="w-12 h-12 mx-auto mb-2 text-muted-foreground/50"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                        <p className="text-sm text-muted-foreground">Erro ao carregar imagem</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OptimizedImage;
