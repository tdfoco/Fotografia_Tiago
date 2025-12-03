import { useState, useEffect } from 'react';
import { pb } from '@/lib/pocketbase';
import { getImageUrl } from '@/hooks/usePocketBaseData';

export interface SearchResult {
    id: string;
    type: 'photography' | 'design';
    title: string;
    description: string;
    url: string; // Thumbnail URL
    category: string;
    date: string;
    link: string; // Internal route
    rank?: number; // Relevance score
    headline?: string; // Highlighted snippet
}

export const useSearch = (query: string) => {
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const searchData = async () => {
            if (!query || query.trim().length < 2) {
                setResults([]);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const searchQuery = query.trim();
                const filter = `title ~ "${searchQuery}" || description ~ "${searchQuery}" || category ~ "${searchQuery}"`;

                // Search Photography
                const photoRecords = await pb.collection('photography').getList(1, 8, {
                    filter: filter,
                    sort: '-created',
                });

                // Search Design Projects
                const designRecords = await pb.collection('design_projects').getList(1, 8, {
                    filter: filter,
                    sort: '-created',
                });

                // Transform and combine results
                const photos: SearchResult[] = photoRecords.items.map((item: any) => ({
                    id: item.id,
                    type: 'photography' as const,
                    title: item.title,
                    description: item.description || '',
                    url: getImageUrl(item.collectionId, item.id, item.image),
                    category: item.category,
                    date: item.event_date || item.created,
                    link: '/photography',
                    rank: 1 // Simple ranking
                }));

                const designs: SearchResult[] = designRecords.items.map((item: any) => ({
                    id: item.id,
                    type: 'design' as const,
                    title: item.title,
                    description: item.description,
                    url: getImageUrl(item.collectionId, item.id, item.images?.[0] || ''),
                    category: item.category,
                    date: item.event_date || item.created,
                    link: '/design',
                    rank: 1
                }));

                // Combinar
                const combined = [...photos, ...designs];

                // Limitar a 10 melhores resultados
                setResults(combined.slice(0, 10));

            } catch (err: any) {
                console.error('Search error:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(searchData, 300); // Debounce
        return () => clearTimeout(timeoutId);

    }, [query]);

    return { results, loading, error };
};
