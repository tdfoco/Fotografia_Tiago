import { useState, useEffect } from 'react';
import { pb } from '@/lib/pocketbase';

interface EngagementMetrics {
    totalLikes: number;
    totalShares: number;
    totalViews: number;
    avgTimeOnPage: number;
    byCategory: {
        category: string;
        engagement: number;
        views: number;
        likes: number;
    }[];
    topPhotos: {
        id: string;
        title: string;
        url: string;
        engagement: number;
        views: number;
    }[];
    timeline: {
        date: string;
        views: number;
        likes: number;
        shares: number;
    }[];
}

export function useEngagementMetrics() {
    const [metrics, setMetrics] = useState<EngagementMetrics | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchMetrics() {
            try {
                // Fetch all photos
                const photos = await pb.collection('photography').getFullList({
                    sort: '-created'
                });

                // Calculate totals
                const totalLikes = photos.reduce((sum, p) => sum + (p.likes_count || 0), 0);
                const totalShares = photos.reduce((sum, p) => sum + (p.shares_count || 0), 0);
                const totalViews = photos.reduce((sum, p) => sum + (p.views_count || 0), 0);

                // Group by category
                const categoryMap = new Map<string, { engagement: number; views: number; likes: number; count: number }>();

                photos.forEach(photo => {
                    const engagement = (photo.likes_count || 0) + (photo.shares_count || 0) * 2;
                    const existing = categoryMap.get(photo.category) || { engagement: 0, views: 0, likes: 0, count: 0 };

                    categoryMap.set(photo.category, {
                        engagement: existing.engagement + engagement,
                        views: existing.views + (photo.views_count || 0),
                        likes: existing.likes + (photo.likes_count || 0),
                        count: existing.count + 1
                    });
                });

                const byCategory = Array.from(categoryMap.entries()).map(([category, data]) => ({
                    category: category.charAt(0).toUpperCase() + category.slice(1),
                    engagement: Math.round(data.engagement / data.count),
                    views: data.views,
                    likes: data.likes
                }));

                // Top photos by engagement
                const topPhotos = photos
                    .map(p => ({
                        id: p.id,
                        title: p.title,
                        url: `${pb.baseUrl}/api/files/${p.collectionId}/${p.id}/${p.image}`,
                        engagement: (p.likes_count || 0) + (p.shares_count || 0) * 2,
                        views: p.views_count || 0
                    }))
                    .sort((a, b) => b.engagement - a.engagement)
                    .slice(0, 10);

                // Timeline (last 30 days - simulated for now)
                const timeline = Array.from({ length: 30 }, (_, i) => {
                    const date = new Date();
                    date.setDate(date.getDate() - (29 - i));
                    return {
                        date: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
                        views: Math.floor(Math.random() * 1000) + 500,
                        likes: Math.floor(Math.random() * 100) + 20,
                        shares: Math.floor(Math.random() * 50) + 5
                    };
                });

                setMetrics({
                    totalLikes,
                    totalShares,
                    totalViews,
                    avgTimeOnPage: 0, // TODO: Implement with real analytics
                    byCategory,
                    topPhotos,
                    timeline
                });
            } catch (error) {
                console.error('Error fetching engagement metrics:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchMetrics();
    }, []);

    return { metrics, loading };
}
