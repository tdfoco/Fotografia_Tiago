import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { PhotographyItem, DesignProject } from '@/lib/supabase';

export const usePhotography = (category?: string) => {
    const [photos, setPhotos] = useState<PhotographyItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        fetchPhotos();
    }, [category]);

    const fetchPhotos = async () => {
        try {
            setLoading(true);
            let query = supabase
                .from('photography')
                .select('*')
                .order('created_at', { ascending: false });

            if (category && category !== 'Todos') {
                query = query.eq('category', category);
            }

            const { data, error: fetchError } = await query;

            if (fetchError) throw fetchError;
            setPhotos(data || []);
            setError(null);
        } catch (err) {
            setError(err as Error);
            console.error('Error fetching photos:', err);
        } finally {
            setLoading(false);
        }
    };

    return { photos, loading, error, refetch: fetchPhotos };
};

export const useDesignProjects = (category?: string) => {
    const [projects, setProjects] = useState<DesignProject[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        fetchProjects();
    }, [category]);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            let query = supabase
                .from('design_projects')
                .select('*')
                .order('created_at', { ascending: false });

            if (category && category !== 'Todos') {
                query = query.eq('category', category);
            }

            const { data, error: fetchError } = await query;

            if (fetchError) throw fetchError;
            setProjects(data || []);
            setError(null);
        } catch (err) {
            setError(err as Error);
            console.error('Error fetching projects:', err);
        } finally {
            setLoading(false);
        }
    };

    return { projects, loading, error, refetch: fetchProjects };
};

// Hook to check if user is authenticated (admin)
export const useAuth = () => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check current session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signIn = async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        return { data, error };
    };

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        return { error };
    };

    return { user, loading, signIn, signOut };
};
