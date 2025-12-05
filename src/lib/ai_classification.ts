/**
 * Sistema de Classificação Automática de Imagens com IA
 * 
 * Este módulo fornece funcionalidades para classificar automaticamente
 * imagens baseado em análise de conteúdo, cores dominantes e metadados.
 */

// Interface para resultado de classificação
export interface ImageClassification {
    category: string;
    suggestedName: string;
    tags: string[];
    dominantColors: ColorInfo[];
    confidence: number;
    metadata?: ImageMetadata;
}

export interface ColorInfo {
    hex: string;
    rgb: [number, number, number];
    percentage: number;
    name: string;
}

export interface ImageMetadata {
    width?: number;
    height?: number;
    aspectRatio?: number;
    fileSize?: number;
    format?: string;
}

/**
 * Categorias disponíveis para classificação
 */
export const CATEGORIES = {
    PORTRAIT: 'Retrato',
    LANDSCAPE: 'Paisagem',
    URBAN: 'Urbano',
    NATURE: 'Natureza',
    EVENT: 'Evento',
    PRODUCT: 'Produto',
    ARCHITECTURE: 'Arquitetura',
    ABSTRACT: 'Abstrato',
    BEHIND_SCENES: 'Bastidores',
    OTHER: 'Outro'
} as const;

/**
 * Paleta de cores nomeadas para identificação
 */
const COLOR_NAMES: { [key: string]: [number, number, number] } = {
    'Vermelho': [255, 0, 0],
    'Azul': [0, 0, 255],
    'Verde': [0, 255, 0],
    'Amarelo': [255, 255, 0],
    'Laranja': [255, 165, 0],
    'Roxo': [128, 0, 128],
    'Rosa': [255, 192, 203],
    'Marrom': [165, 42, 42],
    'Preto': [0, 0, 0],
    'Branco': [255, 255, 255],
    'Cinza': [128, 128, 128],
    'Dourado': [255, 215, 0],
    'Prateado': [192, 192, 192],
    'Azul Claro': [173, 216, 230],
    'Verde Escuro': [0, 100, 0]
};

/**
 * Classifica uma imagem automaticamente
 */
export async function classifyImage(file: File): Promise<ImageClassification> {
    try {
        // Extrair metadados básicos
        const metadata = await extractImageMetadata(file);

        // Analisar cores dominantes
        const dominantColors = await analyzeDominantColors(file);

        // Classificar categoria baseado em análise heurística
        const category = await categorizeImage(file, metadata, dominantColors);

        // Gerar nome sugerido
        const suggestedName = generateSuggestedName(category, dominantColors, metadata);

        // Gerar tags automáticas
        const tags = generateAutoTags(category, dominantColors, metadata);

        // Calcular confiança da classificação
        const confidence = calculateConfidence(category, dominantColors, metadata);

        return {
            category,
            suggestedName,
            tags,
            dominantColors,
            confidence,
            metadata
        };
    } catch (error) {
        console.error('Error classifying image:', error);

        // Retornar classificação padrão em caso de erro
        return {
            category: CATEGORIES.OTHER,
            suggestedName: file.name.replace(/\.[^/.]+$/, ''),
            tags: ['sem classificação'],
            dominantColors: [],
            confidence: 0,
            metadata: undefined
        };
    }
}

/**
 * Extrai metadados da imagem
 */
async function extractImageMetadata(file: File): Promise<ImageMetadata> {
    return new Promise((resolve) => {
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
            const metadata: ImageMetadata = {
                width: img.width,
                height: img.height,
                aspectRatio: img.width / img.height,
                fileSize: file.size,
                format: file.type.split('/')[1]
            };

            URL.revokeObjectURL(url);
            resolve(metadata);
        };

        img.onerror = () => {
            URL.revokeObjectURL(url);
            resolve({
                fileSize: file.size,
                format: file.type.split('/')[1]
            });
        };

        img.src = url;
    });
}

/**
 * Analisa cores dominantes na imagem
 */
async function analyzeDominantColors(file: File): Promise<ColorInfo[]> {
    return new Promise((resolve) => {
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                URL.revokeObjectURL(url);
                resolve([]);
                return;
            }

            // Reduzir tamanho para performance
            const maxSize = 100;
            const scale = Math.min(maxSize / img.width, maxSize / img.height);
            canvas.width = img.width * scale;
            canvas.height = img.height * scale;

            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const pixels = imageData.data;

            // Contar cores (simplificado - agrupa cores similares)
            const colorMap = new Map<string, number>();

            for (let i = 0; i < pixels.length; i += 4) {
                const r = Math.round(pixels[i] / 51) * 51; // Reduz a 6 níveis
                const g = Math.round(pixels[i + 1] / 51) * 51;
                const b = Math.round(pixels[i + 2] / 51) * 51;
                const key = `${r},${g},${b}`;

                colorMap.set(key, (colorMap.get(key) || 0) + 1);
            }

            // Ordenar por frequência
            const sortedColors = Array.from(colorMap.entries())
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5); // Top 5 cores

            const totalPixels = canvas.width * canvas.height;

            const dominantColors: ColorInfo[] = sortedColors.map(([color, count]) => {
                const [r, g, b] = color.split(',').map(Number);
                const hex = rgbToHex(r, g, b);
                const colorName = getClosestColorName([r, g, b]);
                const percentage = (count / totalPixels) * 100;

                return {
                    hex,
                    rgb: [r, g, b],
                    percentage,
                    name: colorName
                };
            });

            URL.revokeObjectURL(url);
            resolve(dominantColors);
        };

        img.onerror = () => {
            URL.revokeObjectURL(url);
            resolve([]);
        };

        img.src = url;
    });
}

/**
 * Categoriza a imagem baseado em heurísticas
 */
async function categorizeImage(
    file: File,
    metadata: ImageMetadata,
    colors: ColorInfo[]
): Promise<string> {
    const aspectRatio = metadata.aspectRatio || 1;
    const fileName = file.name.toLowerCase();

    // Heurísticas baseadas em nome do arquivo
    if (fileName.includes('portrait') || fileName.includes('retrato')) {
        return CATEGORIES.PORTRAIT;
    }
    if (fileName.includes('landscape') || fileName.includes('paisagem')) {
        return CATEGORIES.LANDSCAPE;
    }
    if (fileName.includes('urban') || fileName.includes('urbano') || fileName.includes('city') || fileName.includes('cidade')) {
        return CATEGORIES.URBAN;
    }
    if (fileName.includes('nature') || fileName.includes('natureza')) {
        return CATEGORIES.NATURE;
    }
    if (fileName.includes('event') || fileName.includes('evento')) {
        return CATEGORIES.EVENT;
    }
    if (fileName.includes('product') || fileName.includes('produto')) {
        return CATEGORIES.PRODUCT;
    }
    if (fileName.includes('architecture') || fileName.includes('arquitetura')) {
        return CATEGORIES.ARCHITECTURE;
    }
    if (fileName.includes('making') || fileName.includes('bastidor')) {
        return CATEGORIES.BEHIND_SCENES;
    }

    // Heurísticas baseadas em aspect ratio
    if (aspectRatio > 0.7 && aspectRatio < 0.9) {
        // Proporção vertical típica de retratos
        return CATEGORIES.PORTRAIT;
    }
    if (aspectRatio > 1.5) {
        // Proporção panorâmica
        return CATEGORIES.LANDSCAPE;
    }

    // Heurísticas baseadas em cores dominantes
    if (colors.length > 0) {
        const mainColor = colors[0];

        // Muita cor verde/azul pode indicar natureza
        if (mainColor.name.includes('Verde') || mainColor.name.includes('Azul')) {
            return CATEGORIES.NATURE;
        }

        // Cores neutras podem indicar urbano/arquitetura
        if (mainColor.name.includes('Cinza') || mainColor.name.includes('Preto') || mainColor.name.includes('Branco')) {
            return CATEGORIES.URBAN;
        }
    }

    return CATEGORIES.OTHER;
}

/**
 * Gera nome sugerido para a imagem
 */
function generateSuggestedName(
    category: string,
    colors: ColorInfo[],
    metadata: ImageMetadata
): string {
    const timestamp = new Date().toISOString().split('T')[0];
    const mainColor = colors.length > 0 ? colors[0].name : '';

    // Formato: categoria_cor_data_dimensao
    const categorySlug = category.toLowerCase().replace(/\s+/g, '_');
    const colorSlug = mainColor.toLowerCase().replace(/\s+/g, '_');
    const dimensions = metadata.width && metadata.height
        ? `${metadata.width}x${metadata.height}`
        : '';

    const parts = [categorySlug, colorSlug, timestamp, dimensions].filter(Boolean);

    return parts.join('_');
}

/**
 * Gera tags automáticas
 */
function generateAutoTags(
    category: string,
    colors: ColorInfo[],
    metadata: ImageMetadata
): string[] {
    const tags: string[] = [];

    // Tag de categoria
    tags.push(category);

    // Tags de cores dominantes
    colors.slice(0, 2).forEach(color => {
        tags.push(color.name);
    });

    // Tags baseadas em orientação
    if (metadata.aspectRatio) {
        if (metadata.aspectRatio > 1.3) {
            tags.push('Horizontal');
        } else if (metadata.aspectRatio < 0.8) {
            tags.push('Vertical');
        } else {
            tags.push('Quadrado');
        }
    }

    // Tags baseadas em resolução
    if (metadata.width && metadata.height) {
        const megapixels = (metadata.width * metadata.height) / 1000000;
        if (megapixels > 10) {
            tags.push('Alta Resolução');
        } else if (megapixels < 2) {
            tags.push('Baixa Resolução');
        }
    }

    return tags;
}

/**
 * Calcula confiança da classificação (0-1)
 */
function calculateConfidence(
    category: string,
    colors: ColorInfo[],
    metadata: ImageMetadata
): number {
    let confidence = 0.5; // Base

    // Aumenta confiança se temos cores dominantes claras
    if (colors.length > 0 && colors[0].percentage > 30) {
        confidence += 0.2;
    }

    // Aumenta confiança se temos metadados completos
    if (metadata.width && metadata.height) {
        confidence += 0.1;
    }

    // Aumenta confiança se categoria não é "Outro"
    if (category !== CATEGORIES.OTHER) {
        confidence += 0.2;
    }

    return Math.min(confidence, 1.0);
}

/**
 * Converte RGB para HEX
 */
function rgbToHex(r: number, g: number, b: number): string {
    return '#' + [r, g, b]
        .map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        })
        .join('');
}

/**
 * Encontra o nome de cor mais próximo
 */
function getClosestColorName(rgb: [number, number, number]): string {
    let minDistance = Infinity;
    let closestName = 'Indefinido';

    for (const [name, colorRgb] of Object.entries(COLOR_NAMES)) {
        const distance = Math.sqrt(
            Math.pow(rgb[0] - colorRgb[0], 2) +
            Math.pow(rgb[1] - colorRgb[1], 2) +
            Math.pow(rgb[2] - colorRgb[2], 2)
        );

        if (distance < minDistance) {
            minDistance = distance;
            closestName = name;
        }
    }

    return closestName;
}

/**
 * Processa múltiplas imagens em lote
 */
export async function classifyImageBatch(files: File[]): Promise<ImageClassification[]> {
    const promises = files.map(file => classifyImage(file));
    return Promise.all(promises);
}
