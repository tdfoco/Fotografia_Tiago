import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

// Singleton to hold loaded models
let mobilenetModel: mobilenet.MobileNet | null = null;
let cocoSsdModel: cocoSsd.ObjectDetection | null = null;

/**
 * Load models if not already loaded
 */
export const loadModels = async () => {
    if (!mobilenetModel) {
        console.log('Loading MobileNet model...');
        mobilenetModel = await mobilenet.load();
    }
    if (!cocoSsdModel) {
        console.log('Loading COCO-SSD model...');
        cocoSsdModel = await cocoSsd.load();
    }
    return { mobilenet: mobilenetModel, cocoSsd: cocoSsdModel };
};

/**
 * Generate tags for an image element
 */
export const generateImageTags = async (imgElement: HTMLImageElement): Promise<string[]> => {
    try {
        await loadModels();

        const tags = new Set<string>();

        // 1. MobileNet Classification (General concepts)
        if (mobilenetModel) {
            const predictions = await mobilenetModel.classify(imgElement);
            predictions.forEach(p => {
                // Split comma-separated concepts and add them
                p.className.split(',').forEach(tag => tags.add(tag.trim().toLowerCase()));
            });
        }

        // 2. COCO-SSD Object Detection (Specific objects)
        if (cocoSsdModel) {
            const predictions = await cocoSsdModel.detect(imgElement);
            predictions.forEach(p => {
                tags.add(p.class.toLowerCase());
            });
        }

        return Array.from(tags);
    } catch (error) {
        console.error('Error generating tags:', error);
        return [];
    }
};

/**
 * Extract dominant colors from an image
 * Returns array of hex strings
 */
export const extractDominantColors = (imgElement: HTMLImageElement, maxColors = 3): string[] => {
    // Basic implementation using canvas
    // For production, consider using a library like 'colorthief' (already in package.json)
    // But let's implement a simple version or use colorthief if imported

    // Since colorthief is in package.json, let's try to use it if available, 
    // but for now I'll write a simple canvas logic to avoid import issues if types are missing

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return [];

    canvas.width = imgElement.width;
    canvas.height = imgElement.height;
    ctx.drawImage(imgElement, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    const colorCounts: Record<string, number> = {};

    // Sample every 10th pixel for performance
    for (let i = 0; i < imageData.length; i += 40) {
        const r = imageData[i];
        const g = imageData[i + 1];
        const b = imageData[i + 2];
        const a = imageData[i + 3];

        if (a < 128) continue; // Skip transparent

        const hex = rgbToHex(r, g, b);
        colorCounts[hex] = (colorCounts[hex] || 0) + 1;
    }

    // Sort by count
    const sortedColors = Object.entries(colorCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, maxColors)
        .map(([color]) => color);

    return sortedColors;
};

function rgbToHex(r: number, g: number, b: number): string {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

/**
 * Smart Sort Algorithm
 * Scores photos based on engagement (likes, views, shares) and recency
 */
export const smartSortPhotos = <T extends { likes?: number; views?: number; shares_count?: number; created?: string }>(
    photos: T[]
): T[] => {
    const now = new Date().getTime();

    return [...photos].sort((a, b) => {
        const scoreA = calculateEngagementScore(a, now);
        const scoreB = calculateEngagementScore(b, now);
        return scoreB - scoreA; // Descending order
    });
};

const calculateEngagementScore = (item: any, now: number) => {
    const likes = item.likes || item.likes_count || 0;
    const views = item.views || item.views_count || 0;
    const shares = item.shares_count || 0;

    // Weights
    const wLikes = 5;
    const wShares = 10;
    const wViews = 1;

    const engagement = (likes * wLikes) + (shares * wShares) + (views * wViews);

    // Recency decay (optional, keeps new content relevant)
    // const daysOld = (now - new Date(item.created).getTime()) / (1000 * 60 * 60 * 24);
    // const recencyFactor = Math.max(0.5, 1 - (daysOld / 365)); // Decay over a year

    return engagement; // * recencyFactor;
};

/**
 * Generate Alt Text based on tags and category
 */
export const generateAltText = (tags: string[], category?: string): string => {
    if (tags.length === 0) return `Photography ${category ? `in ${category} category` : ''}`;

    const uniqueTags = Array.from(new Set(tags)).slice(0, 5);
    const tagString = uniqueTags.join(', ');

    return `${category ? category + ' photo' : 'Photo'} featuring ${tagString}`;
};
