import { useState, useEffect } from 'react';

interface ImageLoaderState {
    loading: boolean;
    currentSrc: string | null;
    error: boolean;
}

interface UseImageLoaderProps {
    lowResSrc?: string;
    highResSrc?: string;
    thumbnailSrc?: string;
    blurHash?: string;
    loadHighRes?: boolean; // Se true, carrega high-res, senão apenas low-res
}

/**
 * Hook para gerenciar carregamento progressivo de imagens
 * Sequência: thumbnail/blur → low-res → high-res (se autenticado)
 */
export const useImageLoader = ({
    lowResSrc,
    highResSrc,
    thumbnailSrc,
    blurHash,
    loadHighRes = false
}: UseImageLoaderProps) => {
    const [state, setState] = useState<ImageLoaderState>({
        loading: true,
        currentSrc: thumbnailSrc || null,
        error: false
    });

    useEffect(() => {
        let cancelled = false;

        const loadImage = async () => {
            try {
                setState({ loading: true, currentSrc: thumbnailSrc || null, error: false });

                // Etapa 1: Carregar low-res primeiro
                if (lowResSrc) {
                    const lowResImg = new Image();
                    lowResImg.src = lowResSrc;

                    await new Promise((resolve, reject) => {
                        lowResImg.onload = resolve;
                        lowResImg.onerror = reject;
                    });

                    if (!cancelled) {
                        setState({ loading: true, currentSrc: lowResSrc, error: false });
                    }
                }

                // Etapa 2: Carregar high-res se autorizado e disponível
                if (loadHighRes && highResSrc && highResSrc !== lowResSrc) {
                    const highResImg = new Image();
                    highResImg.src = highResSrc;

                    await new Promise((resolve, reject) => {
                        highResImg.onload = resolve;
                        highResImg.onerror = reject;
                    });

                    if (!cancelled) {
                        setState({ loading: false, currentSrc: highResSrc, error: false });
                    }
                } else {
                    // Não carregar high-res, ficar com low-res
                    if (!cancelled) {
                        setState({ loading: false, currentSrc: lowResSrc || thumbnailSrc || null, error: false });
                    }
                }

            } catch (error) {
                console.error('Error loading image:', error);
                if (!cancelled) {
                    setState({
                        loading: false,
                        currentSrc: lowResSrc || thumbnailSrc || null,
                        error: true
                    });
                }
            }
        };

        loadImage();

        return () => {
            cancelled = true;
        };
    }, [lowResSrc, highResSrc, thumbnailSrc, loadHighRes]);

    return state;
};
