import { useState, useEffect } from 'react';
import { supabase, PhotographyItem, DesignProject } from '@/lib/supabase';

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
                // Usar full-text search com tsvector e ranking
                // plainto_tsquery automaticamente processa a string para busca
                const searchQuery = query.trim();

                // Search Photography com ranking
                const { data: photoData, error: photoError } = await supabase
                    .from('photography')
                    .select('*, ts_rank(search_vector, plainto_tsquery(\'portuguese\', $1)) as rank')
                    .textSearch('search_vector', searchQuery, {
                        type: 'plain',
                        config: 'portuguese'
                    })
                    .order('rank', { ascending: false })
                    .limit(8);

                if (photoError) throw photoError;

                // Search Design Projects com ranking
                const { data: designData, error: designError } = await supabase
                    .from('design_projects')
                    .select('*, ts_rank(search_vector, plainto_tsquery(\'portuguese\', $1)) as rank')
                    .textSearch('search_vector', searchQuery, {
                        type: 'plain',
                        config: 'portuguese'
                    })
                    .order('rank', { ascending: false })
                    .limit(8);

                if (designError) throw designError;

                // Transform and combine results
                const photos: SearchResult[] = (photoData || []).map((item: any) => ({
                    id: item.id,
                    type: 'photography' as const,
                    title: item.title,
                    description: item.description || '',
                    url: item.url,
                    category: item.category,
                    date: item.event_date || item.created_at,
                    link: '/photography',
                    rank: item.rank || 0
                }));

                const designs: SearchResult[] = (designData || []).map((item: any) => ({
                    id: item.id,
                    type: 'design' as const,
                    title: item.title,
                    description: item.description,
                    url: item.images[0],
                    category: item.category,
                    date: item.event_date || item.created_at,
                    link: '/design',
                    rank: item.rank || 0
                }));

                // Combinar e ordenar por relevância (rank)
                const combined = [...photos, ...designs].sort((a, b) =>
                    (b.rank || 0) - (a.rank || 0)
                );

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
