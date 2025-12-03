/**
 * Image Optimizer - Otimização inteligente de imagens
 * Compressão, conversão WebP e geração de thumbnails
 */

import imageCompression from 'browser-image-compression';

export interface OptimizedImages {
    original: File;
    compressed: File;
    webp: Blob;
    thumbnail: Blob;
    metadata: ImageMetadata;
}

export interface ImageMetadata {
    originalSize: number;
    compressedSize: number;
    webpSize: number;
    thumbnailSize: number;
    width: number;
    height: number;
    format: string;
    compressionRatio: number;
}

/**
 * Otimiza uma imagem gerando versões compressed, WebP e thumbnail
 */
export async function optimizeImage(file: File): Promise<OptimizedImages> {
    console.log(`🖼️ Otimizando imagem: ${file.name}`);

    // Obter dimensões originais
    const dimensions = await getImageDimensions(file);

    // Compressão principal (JPEG/PNG otimizado)
    const compressed = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: file.type
    });

    // Criar versão WebP
    const webp = await convertToWebP(file, 1920);

    // Criar thumbnail
    const thumbnail = await imageCompression(file, {
        maxSizeMB: 0.1,
        maxWidthOrHeight: 400,
        useWebWorker: true
    });

    const metadata: ImageMetadata = {
        originalSize: file.size,
        compressedSize: compressed.size,
        webpSize: webp.size,
        thumbnailSize: thumbnail.size,
        width: dimensions.width,
        height: dimensions.height,
        format: file.type,
        compressionRatio: ((1 - compressed.size / file.size) * 100)
    };

    console.log(`✅ Otimização concluída: ${metadata.compressionRatio.toFixed(1)}% de redução`);

    return {
        original: file,
        compressed,
        webp,
        thumbnail,
        metadata
    };
}

/**
 * Converte imagem para WebP
 */
async function convertToWebP(file: File, maxSize: number = 1920): Promise<Blob> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            reject(new Error('Canvas context not available'));
            return;
        }

        img.onload = () => {
            // Calcular dimensões mantendo aspect ratio
            let { width, height } = img;
            if (width > maxSize || height > maxSize) {
                if (width > height) {
                    height = (height / width) * maxSize;
                    width = maxSize;
                } else {
                    width = (width / height) * maxSize;
                    height = maxSize;
                }
            }

            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob(
                blob => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject(new Error('WebP conversion failed'));
                    }
                },
                'image/webp',
                0.9
            );
        };

        img.onerror = () => reject(new Error('Image load failed'));
        img.src = URL.createObjectURL(file);
    });
}

/**
 * Obtém dimensões da imagem
 */
async function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            resolve({ width: img.width, height: img.height });
            URL.revokeObjectURL(img.src);
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = URL.createObjectURL(file);
    });
}

/**
 * Detecta qualidade da imagem e retorna score + recomendações
 */
export async function detectImageQuality(file: File): Promise<{
    score: number;
    quality: 'excellent' | 'good' | 'fair' | 'poor';
    issues: string[];
    recommendations: string[];
}> {
    const dimensions = await getImageDimensions(file);
    const sizeMB = file.size / (1024 * 1024);

    const issues: string[] = [];
    const recommendations: string[] = [];
    let score = 100;

    // Verificar resolução
    if (dimensions.width < 1920 || dimensions.height < 1080) {
        issues.push('Resolução abaixo do recomendado (1920x1080)');
        recommendations.push('Use imagens com pelo menos Full HD para melhor qualidade');
        score -= 20;
    }

    // Verificar se é muito pequena
    if (dimensions.width < 1280 || dimensions.height < 720) {
        issues.push('Imagem muito pequena para uso profissional');
        score -= 30;
    }

    // Verificar tamanho do arquivo
    if (sizeMB > 10) {
        issues.push('Arquivo muito grande (> 10MB)');
        recommendations.push('Comprima a imagem antes do upload para melhorar performance');
        score -= 15;
    }

    // Verificar formato
    const validFormats = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validFormats.includes(file.type)) {
        issues.push('Formato não otimizado');
        recommendations.push('Use JPEG, PNG ou WebP para melhor compatibilidade');
        score -= 15;
    }

    // Verificar aspect ratio
    const aspectRatio = dimensions.width / dimensions.height;
    if (aspectRatio < 0.5 || aspectRatio > 3) {
        issues.push('Proporção incomum detectada');
        recommendations.push('Considere recortar para proporção mais comum (16:9, 4:3, etc)');
        score -= 5;
    }

    // Determinar qualidade
    let quality: 'excellent' | 'good' | 'fair' | 'poor';
    if (score >= 90) quality = 'excellent';
    else if (score >= 70) quality = 'good';
    else if (score >= 50) quality = 'fair';
    else quality = 'poor';

    return {
        score: Math.max(0, score),
        quality,
        issues,
        recommendations
    };
}

/**
 * Gera blurhash placeholder (versão simplificada)
 */
export function generatePlaceholder(canvas: HTMLCanvasElement): string {
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    // Reduzir para 4x4 pixels
    const smallCanvas = document.createElement('canvas');
    smallCanvas.width = 4;
    smallCanvas.height = 4;
    const smallCtx = smallCanvas.getContext('2d');

    if (!smallCtx) return '';

    smallCtx.drawImage(canvas, 0, 0, 4, 4);
    const imageData = smallCtx.getImageData(0, 0, 4, 4);

    // Converter para base64
    return smallCanvas.toDataURL('image/jpeg', 0.1);
}
