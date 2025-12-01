import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { PhotographyItem, DesignProject } from '@/lib/supabase';

export interface Comment {
    id: string;
    content: string;
    user_name: string;
    created_at: string;
    photo_id?: string;
    project_id?: string;
    approved?: boolean;
    parent_id?: string;
    is_admin?: boolean;
    replies?: Comment[];
}

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

export const useComments = (itemId: string, type: 'photography' | 'design') => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchComments = async () => {
        try {
            const column = type === 'photography' ? 'photo_id' : 'project_id';
            const { data, error } = await supabase
                .from('comments')
                .select('*')
                .eq(column, itemId)
                .eq('approved', true)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setComments(data || []);
        } catch (error) {
            console.error('Error fetching comments:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (itemId) fetchComments();
    }, [itemId, type]);

    const addComment = async (content: string, userName: string = 'Anonymous') => {
        const column = type === 'photography' ? 'photo_id' : 'project_id';
        const { error } = await supabase
            .from('comments')
            .insert({
                content,
                user_name: userName,
                [column]: itemId
            });

        if (error) throw error;
        await fetchComments();
    };

    return { comments, loading, addComment, refreshComments: fetchComments };
};

export const incrementLikes = async (id: string, type: 'photography' | 'design') => {
    const table = type === 'photography' ? 'photography' : 'design_projects';
    const { error } = await supabase.rpc('increment_likes', { row_id: id, table_name: table });
    if (error) console.error('Error incrementing likes:', error);
};

export const incrementShares = async (id: string, type: 'photography' | 'design') => {
    const table = type === 'photography' ? 'photography' : 'design_projects';
    const { error } = await supabase.rpc('increment_shares', { row_id: id, table_name: table });
    if (error) console.error('Error incrementing shares:', error);
};

export const useAdminComments = () => {
    const [pendingComments, setPendingComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPendingComments = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('comments')
                .select(`
                    *,
                    photography (title),
                    design_projects (title)
                `)
                .eq('approved', false)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setPendingComments(data || []);
        } catch (error) {
            console.error('Error fetching pending comments:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingComments();
    }, []);

    const approveComment = async (id: string) => {
        const { error } = await supabase
            .from('comments')
            .update({ approved: true })
            .eq('id', id);

        if (error) throw error;
        await fetchPendingComments();
    };

    const rejectComment = async (id: string) => {
        const { error } = await supabase
            .from('comments')
            .delete()
            .eq('id', id);

        if (error) throw error;
        await fetchPendingComments();
    };

    return { pendingComments, loading, approveComment, rejectComment, refreshComments: fetchPendingComments };
};

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

// Hook para listar TODOS os comentários (admin)
export const useAllComments = () => {
    const [allComments, setAllComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchAllComments = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('comments')
                .select(`
                    *,
                    photography (title),
                    design_projects (title)
                `)
                .is('parent_id', null) // Apenas comentários raiz (não respostas)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setAllComments(data || []);
        } catch (error) {
            console.error('Error fetching all comments:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllComments();
    }, []);

    return { allComments, loading, refreshComments: fetchAllComments };
};

// Função para deletar comentário (admin)
export const deleteComment = async (id: string) => {
    try {
        const { error } = await supabase
            .from('comments')
            .delete()
            .eq('id', id);

        if (error) throw error;
    } catch (error: any) {
        throw new Error(error.message || 'Failed to delete comment');
    }
};

// Função para adicionar resposta (admin)
export const addReply = async (parentId: string, content: string, itemId: string, type: 'photography' | 'design') => {
    try {
        const column = type === 'photography' ? 'photo_id' : 'project_id';
        const { error } = await supabase
            .from('comments')
            .insert({
                content,
                user_name: 'Tiago',
                [column]: itemId,
                parent_id: parentId,
                is_admin: true,
                approved: true
            });

        if (error) throw error;
    } catch (error: any) {
        throw new Error(error.message || 'Failed to add reply');
    }
}

export const useTopRated = (limit = 5) => {
    const [topPhotos, setTopPhotos] = useState<PhotographyItem[]>([]);
    const [topProjects, setTopProjects] = useState<DesignProject[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTopRated = async () => {
            try {
                setLoading(true);

                // Fetch top photos by likes
                const { data: photos, error: photosError } = await supabase
                    .from('photography')
                    .select('*')
                    .order('likes_count', { ascending: false })
                    .limit(limit);

                if (photosError) throw photosError;
                setTopPhotos(photos || []);

                // Fetch top projects by likes
                const { data: projects, error: projectsError } = await supabase
                    .from('design_projects')
                    .select('*')
                    .order('likes_count', { ascending: false })
                    .limit(limit);

                if (projectsError) throw projectsError;
                setTopProjects(projects || []);

            } catch (error) {
                console.error('Error fetching top rated:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTopRated();
    }, [limit]);

    return { topPhotos, topProjects, loading };
};
