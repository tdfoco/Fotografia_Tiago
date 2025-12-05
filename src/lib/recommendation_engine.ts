/**
 * Sistema de Recomendação de Fotos baseado em Comportamento do Usuário
 * 
 * Este módulo rastreia visualizações e gera recomendações personalizadas
 * baseado no histórico de navegação do usuário.
 */

interface Photo {
    id: string;
    category?: string;
    tags?: string[];
    [key: string]: any;
}

interface ViewHistory {
    photoId: string;
    timestamp: number;
    duration: number; // em segundos
    category?: string;
}

interface CategoryScore {
    category: string;
    score: number;
    count: number;
}

const STORAGE_KEY = 'tdfoco_view_history';
const MAX_HISTORY_SIZE = 100;
const RECENT_THRESHOLD_DAYS = 30;

/**
 * Registra visualização de uma foto
 */
export function trackPhotoView(
    photoId: string,
    duration: number,
    category?: string
): void {
    try {
        const history = getViewHistory();

        const view: ViewHistory = {
            photoId,
            timestamp: Date.now(),
            duration,
            category
        };

        // Adicionar novo view
        history.push(view);

        // Manter apenas os últimos MAX_HISTORY_SIZE registros
        const trimmedHistory = history.slice(-MAX_HISTORY_SIZE);

        localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedHistory));
    } catch (error) {
        console.error('Error tracking photo view:', error);
    }
}

/**
 * Obtém histórico de visualizações
 */
export function getViewHistory(): ViewHistory[] {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return [];

        const history: ViewHistory[] = JSON.parse(stored);

        // Filtrar apenas visualizações recentes
        const cutoffDate = Date.now() - (RECENT_THRESHOLD_DAYS * 24 * 60 * 60 * 1000);
        return history.filter(view => view.timestamp > cutoffDate);
    } catch (error) {
        console.error('Error getting view history:', error);
        return [];
    }
}

/**
 * Limpa histórico de visualizações
 */
export function clearViewHistory(): void {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        console.error('Error clearing view history:', error);
    }
}

/**
 * Calcula categorias mais visualizadas
 */
export function getTopCategories(limit: number = 3): CategoryScore[] {
    const history = getViewHistory();

    if (history.length === 0) return [];

    // Agrupar por categoria e calcular scores
    const categoryMap = new Map<string, { totalDuration: number; count: number }>();

    history.forEach(view => {
        if (!view.category) return;

        const existing = categoryMap.get(view.category) || { totalDuration: 0, count: 0 };
        existing.totalDuration += view.duration;
        existing.count += 1;
        categoryMap.set(view.category, existing);
    });

    // Converter para array e calcular score
    const scores: CategoryScore[] = Array.from(categoryMap.entries()).map(([category, data]) => {
        // Score baseado em: contagem * duração média
        const avgDuration = data.totalDuration / data.count;
        const score = data.count * Math.log(1 + avgDuration);

        return {
            category,
            score,
            count: data.count
        };
    });

    // Ordenar por score e limitar
    return scores.sort((a, b) => b.score - a.score).slice(0, limit);
}

/**
 * Obtém fotos mais visualizadas
 */
export function getMostViewedPhotos(limit: number = 10): string[] {
    const history = getViewHistory();

    if (history.length === 0) return [];

    // Contar visualizações por foto
    const photoCount = new Map<string, number>();

    history.forEach(view => {
        photoCount.set(view.photoId, (photoCount.get(view.photoId) || 0) + 1);
    });

    // Ordenar por contagem
    return Array.from(photoCount.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([photoId]) => photoId);
}

/**
 * Gera recomendações personalizadas baseado no histórico
 */
export function getRecommendations(
    allPhotos: Photo[],
    limit: number = 12,
    userId?: string
): Photo[] {
    const history = getViewHistory();

    // Se não há histórico, retornar fotos aleatórias
    if (history.length === 0) {
        return getRandomPhotos(allPhotos, limit);
    }

    // Obter categorias favoritas
    const topCategories = getTopCategories(3);
    const favoriteCategories = topCategories.map(c => c.category);

    // Obter IDs já visualizados para evitar repetição
    const viewedPhotoIds = new Set(history.map(v => v.photoId));

    // Filtrar fotos não visualizadas
    const unseenPhotos = allPhotos.filter(photo => !viewedPhotoIds.has(photo.id));

    // Calcular score para cada foto
    const scoredPhotos = unseenPhotos.map(photo => {
        let score = 0;

        // Bonus se a categoria está nas favoritas
        if (photo.category && favoriteCategories.includes(photo.category)) {
            const categoryIndex = favoriteCategories.indexOf(photo.category);
            score += (3 - categoryIndex) * 10; // Maior peso para categoria mais favorita
        }

        // Bonus por tags em comum com fotos visualizadas
        if (photo.tags && Array.isArray(photo.tags)) {
            const viewedCategories = history
                .map(v => v.category)
                .filter(Boolean) as string[];

            const commonTags = photo.tags.filter(tag =>
                viewedCategories.some(cat => cat.toLowerCase().includes(tag.toLowerCase()))
            );
            score += commonTags.length * 2;
        }

        // Pequeno fator aleatório para diversidade
        score += Math.random() * 5;

        return { photo, score };
    });

    // Ordenar por score e retornar
    return scoredPhotos
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(item => item.photo);
}

/**
 * Retorna fotos aleatórias (fallback)
 */
function getRandomPhotos(photos: Photo[], count: number): Photo[] {
    const shuffled = [...photos].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

/**
 * Calcula tempo médio de visualização
 */
export function getAverageViewDuration(): number {
    const history = getViewHistory();

    if (history.length === 0) return 0;

    const totalDuration = history.reduce((sum, view) => sum + view.duration, 0);
    return totalDuration / history.length;
}

/**
 * Obtém estatísticas de engajamento
 */
export function getEngagementStats(): {
    totalViews: number;
    uniquePhotos: number;
    avgDuration: number;
    topCategories: CategoryScore[];
    recentActivity: number; // views nos últimos 7 dias
} {
    const history = getViewHistory();
    const uniquePhotos = new Set(history.map(v => v.photoId)).size;
    const avgDuration = getAverageViewDuration();
    const topCategories = getTopCategories(5);

    // Contar atividade recente (7 dias)
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    const recentActivity = history.filter(v => v.timestamp > sevenDaysAgo).length;

    return {
        totalViews: history.length,
        uniquePhotos,
        avgDuration,
        topCategories,
        recentActivity
    };
}

/**
 * Gera insights sobre preferências do usuário
 */
export function getUserInsights(): {
    preferredCategories: string[];
    viewingPattern: 'casual' | 'engaged' | 'power_user';
    favoriteTimeOfDay?: string;
} {
    const stats = getEngagementStats();
    const topCategories = stats.topCategories.map(c => c.category);

    // Determinar padrão de visualização
    let viewingPattern: 'casual' | 'engaged' | 'power_user' = 'casual';

    if (stats.totalViews > 50 && stats.avgDuration > 10) {
        viewingPattern = 'power_user';
    } else if (stats.totalViews > 20 || stats.avgDuration > 5) {
        viewingPattern = 'engaged';
    }

    // Analisar horário favorito (simplificado)
    const history = getViewHistory();
    const hourCounts = new Map<number, number>();

    history.forEach(view => {
        const hour = new Date(view.timestamp).getHours();
        hourCounts.set(hour, (hourCounts.get(hour) || 0) + 1);
    });

    const favoriteHour = Array.from(hourCounts.entries())
        .sort((a, b) => b[1] - a[1])[0];

    let favoriteTimeOfDay: string | undefined;
    if (favoriteHour) {
        const hour = favoriteHour[0];
        if (hour < 12) favoriteTimeOfDay = 'Manhã';
        else if (hour < 18) favoriteTimeOfDay = 'Tarde';
        else favoriteTimeOfDay = 'Noite';
    }

    return {
        preferredCategories: topCategories,
        viewingPattern,
        favoriteTimeOfDay
    };
}

/**
 * Exporta dados de visualização para análise
 */
export function exportViewData(): string {
    const history = getViewHistory();
    const stats = getEngagementStats();
    const insights = getUserInsights();

    const exportData = {
        exportDate: new Date().toISOString(),
        viewHistory: history,
        statistics: stats,
        insights: insights
    };

    return JSON.stringify(exportData, null, 2);
}
