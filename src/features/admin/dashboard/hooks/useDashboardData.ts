import { useState, useEffect } from 'react';
import { pb } from '@/lib/pocketbase';

interface DashboardStats {
    totalPhotos: number;
    totalProjects: number;
    totalViews: number;
    avgEngagement: number;
    newClients: number;
    pendingComments: number;
}

export function useDashboardData() {
    const [stats, setStats] = useState<DashboardStats>({
        totalPhotos: 0,
        totalProjects: 0,
        totalViews: 0,
        avgEngagement: 0,
        newClients: 0,
        pendingComments: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchDashboardData() {
            try {
                // Fetch photos
                const photos = await pb.collection('photography').getFullList();
                const projects = await pb.collection('design_projects').getFullList();

                // Fetch clients and comments
                const clients = await pb.collection('clients').getFullList();
                const pendingCommentsList = await pb.collection('comments').getFullList({
                    filter: 'approved = false'
                });

                // Calculate stats
                const totalViews = photos.reduce((sum, p) => sum + (p.views_count || 0), 0);
                const totalLikes = photos.reduce((sum, p) => sum + (p.likes_count || 0), 0);
                const totalShares = photos.reduce((sum, p) => sum + (p.shares_count || 0), 0);

                const avgEngagement = photos.length > 0
                    ? ((totalLikes + totalShares) / photos.length) * 100 / 10
                    : 0;

                setStats({
                    totalPhotos: photos.length,
                    totalProjects: projects.length,
                    totalViews,
                    avgEngagement: Math.round(avgEngagement),
                    newClients: clients.length,
                    pendingComments: pendingCommentsList.length
                });
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                setError('Failed to load dashboard data. Please try again later.');
            } finally {
                setLoading(false);
            }
        }

        fetchDashboardData();
    }, []);

    return { stats, loading, error };
}
