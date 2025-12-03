/**
 * Sistema de Recomendação - Collaborative Filtering
 * Sugere fotos baseado em similaridade e interações do usuário
 */

interface Photo {
    id: string;
    title: string;
    tags: string[];
    category: string;
    created: string;
}

interface UserInteraction {
    photoId: string;
    views: number;
    likes: number;
    favorites: number;
    timeSpent: number;
}

/**
 * Calcula recomendações baseadas em uma foto atual
 */
export function calculateRecommendations(
    currentPhotoId: string,
    allPhotos: Photo[],
    interactions: UserInteraction[]
): Photo[] {
    const currentPhoto = allPhotos.find(p => p.id === currentPhotoId);
    if (!currentPhoto) return [];

    // Calcular score de similaridade para cada foto
    const scores = allPhotos
        .filter(p => p.id !== currentPhotoId)
        .map(photo => ({
            photo,
            score: calculateSimilarityScore(currentPhoto, photo, interactions)
        }))
        .sort((a, b) => b.score - a.score);

    // Retornar top 6
    return scores.slice(0, 6).map(s => s.photo);
}

/**
 * Calcula score de similaridade entre duas fotos
 */
function calculateSimilarityScore(
    photo1: Photo,
    photo2: Photo,
    interactions: UserInteraction[]
): number {
    let score = 0;

    // 1. Similaridade de tags (peso: 40%)
    const commonTags = photo1.tags.filter(t =>
        photo2.tags.some(t2 => t2.toLowerCase() === t.toLowerCase())
    );
    score += commonTags.length * 2;

    // 2. Mesma categoria (peso: 30%)
    if (photo1.category === photo2.category) {
        score += 5;
    }

    // 3. Popularidade da foto (peso: 20%)
    const photo2Interaction = interactions.find(i => i.photoId === photo2.id);
    if (photo2Interaction) {
        const popularityScore =
            (photo2Interaction.likes * 0.3) +
            (photo2Interaction.favorites * 0.5) +
            (photo2Interaction.views * 0.01);
        score += popularityScore;
    }

    // 4. Proximidade temporal (peso: 10%)
    const date1 = new Date(photo1.created).getTime();
    const date2 = new Date(photo2.created).getTime();
    const daysDiff = Math.abs(date1 - date2) / (1000 * 60 * 60 * 24);

    if (daysDiff < 30) {
        score += 2;
    } else if (daysDiff < 90) {
        score += 1;
    }

    return score;
}

/**
 * Sugere fotos populares baseado em interações
 */
export function getTrendingPhotos(
    allPhotos: Photo[],
    interactions: UserInteraction[],
    limit: number = 10
): Photo[] {
    // Calcular score de trending para cada foto
    const scores = allPhotos.map(photo => {
        const interaction = interactions.find(i => i.photoId === photo.id);

        if (!interaction) return { photo, score: 0 };

        // Fórmula de trending: combina recência com engajamento
        const recencyScore = getRecencyScore(photo.created);
        const engagementScore =
            (interaction.views * 0.01) +
            (interaction.likes * 0.5) +
            (interaction.favorites * 1);

        const score = recencyScore * engagementScore;

        return { photo, score };
    });

    // Ordenar por score e retornar top N
    return scores
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(s => s.photo);
}

/**
 * Calcula score de recência (fotos mais recentes têm score maior)
 */
function getRecencyScore(createdAt: string): number {
    const now = Date.now();
    const created = new Date(createdAt).getTime();
    const daysSinceCreation = (now - created) / (1000 * 60 * 60 * 24);

    // Score decresce com o tempo
    if (daysSinceCreation < 7) return 10;
    if (daysSinceCreation < 30) return 5;
    if (daysSinceCreation < 90) return 2;
    return 1;
}

/**
 * Sugere fotos para usuários baseado no histórico
 */
export function getPersonalizedRecommendations(
    userViewHistory: string[], // IDs das fotos visualizadas
    allPhotos: Photo[],
    interactions: UserInteraction[],
    limit: number = 10
): Photo[] {
    // Se não tem histórico, retorna trending
    if (userViewHistory.length === 0) {
        return getTrendingPhotos(allPhotos, interactions, limit);
    }

    // Analisar preferências do usuário baseado no histórico
    const viewedPhotos = allPhotos.filter(p => userViewHistory.includes(p.id));
    const userPreferences = analyzeUserPreferences(viewedPhotos);

    // Calcular match score para cada foto não vista
    const unseenPhotos = allPhotos.filter(p => !userViewHistory.includes(p.id));

    const scores = unseenPhotos.map(photo => ({
        photo,
        score: calculateUserMatchScore(photo, userPreferences, interactions)
    }));

    // Retornar top N
    return scores
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(s => s.photo);
}

interface UserPreferences {
    favoriteCategories: Record<string, number>;
    favoriteTags: Record<string, number>;
}

/**
 * Analisa preferências do usuário baseado no histórico
 */
function analyzeUserPreferences(viewedPhotos: Photo[]): UserPreferences {
    const favoriteCategories: Record<string, number> = {};
    const favoriteTags: Record<string, number> = {};

    viewedPhotos.forEach(photo => {
        // Contar categorias
        favoriteCategories[photo.category] =
            (favoriteCategories[photo.category] || 0) + 1;

        // Contar tags
        photo.tags.forEach(tag => {
            favoriteTags[tag] = (favoriteTags[tag] || 0) + 1;
        });
    });

    return { favoriteCategories, favoriteTags };
}

/**
 * Calcula quão bem uma foto combina com as preferências do usuário
 */
function calculateUserMatchScore(
    photo: Photo,
    preferences: UserPreferences,
    interactions: UserInteraction[]
): number {
    let score = 0;

    // Match de categoria
    const categoryScore = preferences.favoriteCategories[photo.category] || 0;
    score += categoryScore * 3;

    // Match de tags
    photo.tags.forEach(tag => {
        const tagScore = preferences.favoriteTags[tag] || 0;
        score += tagScore * 2;
    });

    // Popularidade geral
    const interaction = interactions.find(i => i.photoId === photo.id);
    if (interaction) {
        score += (interaction.favorites * 0.5) + (interaction.likes * 0.3);
    }

    return score;
}
