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
                const searchTerm = `%${query}%`;

                // Search Photography
                const { data: photoData, error: photoError } = await supabase
                    .from('photography')
                    .select('*')
                    .or(`title.ilike.${searchTerm},description.ilike.${searchTerm},event_name.ilike.${searchTerm},tags.cs.{${query}}`)
                    .limit(5);

                if (photoError) throw photoError;

                // Search Design
                const { data: designData, error: designError } = await supabase
                    .from('design_projects')
                    .select('*')
                    .or(`title.ilike.${searchTerm},description.ilike.${searchTerm},event_name.ilike.${searchTerm},tags.cs.{${query}}`)
                    .limit(5);

                if (designError) throw designError;

                // Transform and combine results
                const photos: SearchResult[] = (photoData || []).map((item: PhotographyItem) => ({
                    id: item.id,
                    type: 'photography',
                    title: item.title,
                    description: item.description || '',
                    url: item.url,
                    category: item.category,
                    date: item.event_date || item.created_at,
                    link: '/photography' // We might need a way to open specific photos, for now link to gallery
                }));

                const designs: SearchResult[] = (designData || []).map((item: DesignProject) => ({
                    id: item.id,
                    type: 'design',
                    title: item.title,
                    description: item.description,
                    url: item.images[0],
                    category: item.category,
                    date: item.event_date || item.created_at,
                    link: '/design'
                }));

                // Sort by date (newest first)
                const combined = [...photos, ...designs].sort((a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                );

                setResults(combined);

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
