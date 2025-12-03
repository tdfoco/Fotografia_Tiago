/**
 * Auto-Tagger - Geração automática de tags usando TensorFlow.js
 * Usa MobileNet para classificação geral e COCO-SSD para detecção de objetos
 */

import * as mobilenet from '@tensorflow-models/mobilenet';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

// Cache dos modelos para evitar recarregar
let mobileNetModel: mobilenet.MobileNet | null = null;
let cocoModel: cocoSsd.ObjectDetection | null = null;

/**
 * Carrega os modelos de IA (executar uma vez no início)
 */
export async function loadAIModels(): Promise<void> {
    try {
        console.log('🤖 Carregando modelos de IA...');

        [mobileNetModel, cocoModel] = await Promise.all([
            mobilenet.load(),
            cocoSsd.load()
        ]);

        console.log('✅ Modelos de IA carregados com sucesso');
    } catch (error) {
        console.error('❌ Erro ao carregar modelos de IA:', error);
        throw error;
    }
}

/**
 * Gera tags automaticamente para uma imagem
 * @param imageElement - Elemento HTML da imagem ou File
 * @returns Array de tags em português
 */
export async function autoTagImage(
    imageElement: HTMLImageElement | HTMLCanvasElement
): Promise<string[]> {
    try {
        // Garantir que os modelos estão carregados
        if (!mobileNetModel || !cocoModel) {
            await loadAIModels();
        }

        if (!mobileNetModel || !cocoModel) {
            throw new Error('Modelos não carregados');
        }

        // Classificação geral (MobileNet)
        const classifications = await mobileNetModel.classify(imageElement, 5);

        // Detecção de objetos (COCO-SSD)
        const detections = await cocoModel.detect(imageElement);

        // Combinar e processar resultados
        const tags = [
            ...classifications.map(c => c.className),
            ...detections.map(d => d.class)
        ];

        // Traduzir para português e limpar
        const translatedTags = tags
            .map(tag => translateTag(tag))
            .filter(tag => tag.length > 0);

        // Remover duplicatas
        const uniqueTags = [...new Set(translatedTags)];

        return uniqueTags.slice(0, 10);

    } catch (error) {
        console.error('Erro no auto-tagging:', error);
        return [];
    }
}

/**
 * Traduz tags do inglês para português
 */
function translateTag(englishTag: string): string {
    const translations: Record<string, string> = {
        // Pessoas
        'person': 'pessoa',
        'man': 'homem',
        'woman': 'mulher',
        'boy': 'menino',
        'girl': 'menina',
        'child': 'criança',

        // Animais
        'dog': 'cachorro',
        'cat': 'gato',
        'bird': 'pássaro',
        'horse': 'cavalo',

        // Natureza
        'tree': 'árvore',
        'mountain': 'montanha',
        'forest': 'floresta',
        'lake': 'lago',
        'ocean': 'oceano',
        'beach': 'praia',
        'sky': 'céu',
        'cloud': 'nuvem',
        'flower': 'flor',
        'plant': 'planta',

        // Urbano
        'building': 'prédio',
        'street': 'rua',
        'car': 'carro',
        'city': 'cidade',
        'house': 'casa',
        'road': 'estrada',
        'bridge': 'ponte',

        // Objetos comuns
        'chair': 'cadeira',
        'table': 'mesa',
        'book': 'livro',
        'bottle': 'garrafa',
        'cup': 'xícara',
        'phone': 'telefone',
        'laptop': 'laptop',
        'camera': 'câmera',

        // Alimentos
        'food': 'comida',
        'coffee': 'café',
        'wine': 'vinho',
        'pizza': 'pizza',

        // Outros
        'portrait': 'retrato',
        'landscape': 'paisagem',
        'sunset': 'pôr do sol',
        'sunrise': 'nascer do sol',
        'night': 'noite',
        'indoor': 'interior',
        'outdoor': 'exterior'
    };

    const cleaned = englishTag.toLowerCase().trim().replace(/_/g, ' ');
    return translations[cleaned] || cleaned;
}

/**
 * Categoriza automaticamente uma foto baseado nas tags
 */
export function categorizePhoto(tags: string[]): string {
    const categories = {
        'retrato': ['pessoa', 'homem', 'mulher', 'criança', 'retrato'],
        'natureza': ['árvore', 'montanha', 'floresta', 'lago', 'oceano', 'praia', 'paisagem', 'flor'],
        'urbano': ['prédio', 'rua', 'carro', 'cidade', 'ponte'],
        'eventos': ['festa', 'casamento', 'celebração'],
        'produtos': ['comida', 'café', 'garrafa', 'produto']
    };

    for (const [category, keywords] of Object.entries(categories)) {
        if (tags.some(tag => keywords.includes(tag.toLowerCase()))) {
            return category;
        }
    }

    return 'outros';
}
