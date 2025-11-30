import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { PhotographyItem, DesignProject } from '@/lib/supabase';

// Fisher-Yates shuffle algorithm for randomizing arrays
function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Hook for fetching photography items
export function usePhotography(category?: string) {
    const [photos, setPhotos] = useState<PhotographyItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchPhotos() {
            try {
                setLoading(true);
                let query = supabase
                    .from('photography')
                    .select('*');

                if (category) {
                    query = query.eq('category', category);
                }

                const { data, error } = await query;

                if (error) throw error;
                // Randomize the order of photos
                setPhotos(shuffleArray(data || []));
                setError(null);
            } catch (err: any) {
                setError(err.message);
                setPhotos([]);
            } finally {
                setLoading(false);
            }
        }

        fetchPhotos();
    }, [category]);

    return { photos, loading, error };
}

// Hook for fetching design projects
export function useDesignProjects(category?: string) {
    const [projects, setProjects] = useState<DesignProject[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchProjects() {
            try {
                setLoading(true);
                let query = supabase
                    .from('design_projects')
                    .select('*');

                if (category) {
                    query = query.eq('category', category);
                }

                const { data, error } = await query;

                if (error) throw error;
                // Randomize the order of projects
                setProjects(shuffleArray(data || []));
                setError(null);
            } catch (err: any) {
                setError(err.message);
                setProjects([]);
            } finally {
                setLoading(false);
            }
        }

        fetchProjects();
    }, [category]);

    return { projects, loading, error };
}

// Hook for authentication
export function useAuth() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
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
        setLoading(true);
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        setLoading(false);
        return { data, error };
    };

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        return { error };
    };

    return {
        user,
        loading,
        signIn,
        signOut,
    };
}
