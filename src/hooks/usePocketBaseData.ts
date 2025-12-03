import { useState, useEffect } from 'react';
import { pb, POCKETBASE_URL } from '@/lib/pocketbase';
import type { RecordModel } from 'pocketbase';

// Types
export interface PhotographyItem extends RecordModel {
    title: string;
    category: string;
    image: string;
    description?: string;
    year?: number;
    event_name?: string;
    event_date?: string;
    camera_make?: string;
    camera_model?: string;
    lens_model?: string;
    iso?: number;
    aperture?: string;
    shutter_speed?: string;
    focal_length?: string;
    capture_date?: string;
    likes_count: number;
    comments_count: number;
    shares_count: number;
}

export interface DesignProject extends RecordModel {
    title: string;
    category: string;
    description?: string;
    images?: string[]; // PocketBase stores multiple files as array of filenames
    client?: string;
    year?: number;
    link?: string;
    likes_count: number;
    comments_count: number;
    shares_count: number;
}

export interface Comment extends RecordModel {
    content: string;
    user_name: string;
    photo_id?: string;
    project_id?: string;
    approved: boolean;
    parent_id?: string;
    is_admin: boolean;
    replies?: Comment[];
    created: string; // Explicitly add created
    expand?: {
        replies?: Comment[];
    };
}

export interface HeroImage extends RecordModel {
    title: string;
    image: string;
    active: boolean;
}

// Helper to get full image URL
export const getImageUrl = (collectionId: string, recordId: string, filename: string) => {
    return `${POCKETBASE_URL}/api/files/${collectionId}/${recordId}/${filename}`;
};

// Fisher-Yates shuffle algorithm
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
                const filter = category ? `category = "${category}"` : '';
                const records = await pb.collection('photography').getFullList<PhotographyItem>({
                    filter: filter,
                    sort: '-created',
                });
                setPhotos(shuffleArray(records));
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
                const filter = category ? `category = "${category}"` : '';
                const records = await pb.collection('design_projects').getFullList<DesignProject>({
                    filter: filter,
                    sort: '-created',
                });
                setProjects(shuffleArray(records));
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

// Hook for comments
export const useComments = (itemId: string, type: 'photography' | 'design') => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchComments = async () => {
        try {
            const column = type === 'photography' ? 'photo_id' : 'project_id';
            // Fetch approved comments for this item
            const records = await pb.collection('comments').getFullList<Comment>({
                filter: `${column} = "${itemId}" && approved = true`,
                sort: '-created',
                expand: 'replies', // If we link replies relationally
            });

            // Client-side nesting if needed, or rely on expand if modeled that way.
            // For now assuming flat list or simple parent_id logic
            // PocketBase doesn't auto-nest in response unless expanded.
            // Let's just return flat list and let UI handle nesting or filter here.
            setComments(records);
        } catch (error) {
            console.error('Error fetching comments:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (itemId) fetchComments();
    }, [itemId, type]);

    const addComment = async (content: string, userName: string = 'Anonymous', parentId?: string, isAdmin: boolean = false) => {
        const column = type === 'photography' ? 'photo_id' : 'project_id';
        await pb.collection('comments').create({
            content,
            user_name: userName,
            [column]: itemId,
            parent_id: parentId,
            approved: isAdmin, // Admin comments auto-approved
            is_admin: isAdmin
        });
        await fetchComments();
    };

    return { comments, loading, addComment, refreshComments: fetchComments };
};

// Hook for Auth
export function useAuth() {
    const [user, setUser] = useState<any>(pb.authStore.model);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Subscribe to auth state changes
        const unsubscribe = pb.authStore.onChange((token, model) => {
            setUser(model);
        });
        return () => unsubscribe();
    }, []);

    const signIn = async (email: string, password: string) => {
        setLoading(true);
        try {
            const authData = await pb.admins.authWithPassword(email, password);
            // Or users collection if not admin
            // const authData = await pb.collection('users').authWithPassword(email, password);
            return { data: authData, error: null };
        } catch (error: any) {
            return { data: null, error };
        } finally {
            setLoading(false);
        }
    };

    const signOut = () => {
        pb.authStore.clear();
        return { error: null };
    };

    return { user, loading, signIn, signOut };
}

// Admin Hooks
export const useAdminComments = () => {
    const [pendingComments, setPendingComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPendingComments = async () => {
        try {
            setLoading(true);
            const records = await pb.collection('comments').getFullList<Comment>({
                filter: 'approved = false',
                sort: '-created',
                expand: 'photo_id,project_id' // Expand relations to show titles
            });
            setPendingComments(records);
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
        await pb.collection('comments').update(id, { approved: true });
        await fetchPendingComments();
    };

    const rejectComment = async (id: string) => {
        await pb.collection('comments').delete(id);
        await fetchPendingComments();
    };

    return { pendingComments, loading, approveComment, rejectComment, refreshComments: fetchPendingComments };
};

export const useAllComments = () => {
    const [allComments, setAllComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchAllComments = async () => {
        try {
            setLoading(true);
            const records = await pb.collection('comments').getFullList<Comment>({
                filter: 'parent_id = ""', // Root comments
                sort: '-created',
                expand: 'photo_id,project_id'
            });
            setAllComments(records);
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

export const deleteComment = async (id: string) => {
    await pb.collection('comments').delete(id);
};

export const addReply = async (parentId: string, content: string, itemId: string, type: 'photography' | 'design') => {
    const column = type === 'photography' ? 'photo_id' : 'project_id';
    await pb.collection('comments').create({
        content,
        user_name: 'Tiago',
        [column]: itemId,
        parent_id: parentId,
        is_admin: true,
        approved: true
    });
};

// Likes and Shares
export const incrementLikes = async (id: string, type: 'photography' | 'design') => {
    const collection = type === 'photography' ? 'photography' : 'design_projects';
    // Atomic increment
    await pb.collection(collection).update(id, { 'likes_count+': 1 });
};

export const incrementShares = async (id: string, type: 'photography' | 'design') => {
    const collection = type === 'photography' ? 'photography' : 'design_projects';
    await pb.collection(collection).update(id, { 'shares_count+': 1 });
};

export const useTopRated = (limit = 5) => {
    const [topPhotos, setTopPhotos] = useState<PhotographyItem[]>([]);
    const [topProjects, setTopProjects] = useState<DesignProject[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTopRated = async () => {
            try {
                setLoading(true);
                const photos = await pb.collection('photography').getList<PhotographyItem>(1, limit, {
                    sort: '-likes_count',
                });
                setTopPhotos(photos.items);

                const projects = await pb.collection('design_projects').getList<DesignProject>(1, limit, {
                    sort: '-likes_count',
                });
                setTopProjects(projects.items);
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
