import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Favorite {
    id: string;
    type: 'photography' | 'design';
    title: string;
    url: string;
    created_at: string;
}

export const useFavorites = () => {
    const [favorites, setFavorites] = useState<Favorite[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);

    // Verificar autenticação
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    // Carregar favoritos do usuário
    const fetchFavorites = async () => {
        if (!user) {
            setFavorites([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const { data, error } = await supabase.rpc('get_user_favorites');

            if (error) throw error;
            setFavorites(data || []);
        } catch (error) {
            console.error('Error fetching favorites:', error);
            setFavorites([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFavorites();
    }, [user]);

    // Verificar se um item está nos favoritos
    const isFavorite = (itemId: string) => {
        return favorites.some(fav => fav.id === itemId);
    };

    // Toggle favorito (adicionar/remover)
    const toggleFavorite = async (itemId: string, type: 'photography' | 'design') => {
        if (!user) {
            throw new Error('Você precisa estar logado para favoritar');
        }

        try {
            // Otimistic update
            const wasFavorite = isFavorite(itemId);

            if (wasFavorite) {
                // Remover da lista local imediatamente
                setFavorites(prev => prev.filter(fav => fav.id !== itemId));
            }

            // Chamar função do banco
            const { data, error } = await supabase.rpc('toggle_favorite', {
                item_id: itemId,
                item_type: type
            });

            if (error) throw error;

            // Atualizar lista completa após a operação
            await fetchFavorites();

            return data; // true se favoritado, false se desfavoritado
        } catch (error: any) {
            console.error('Error toggling favorite:', error);
            // Reverter otimistic update em caso de erro
            await fetchFavorites();
            throw error;
        }
    };

    // Adicionar favorito
    const addFavorite = async (itemId: string, type: 'photography' | 'design') => {
        if (!user) {
            throw new Error('Você precisa estar logado para favoritar');
        }

        try {
            const column = type === 'photography' ? 'photo_id' : 'project_id';
            const { error } = await supabase
                .from('favorites')
                .insert({
                    user_id: user.id,
                    [column]: itemId
                });

            if (error) throw error;
            await fetchFavorites();
        } catch (error: any) {
            console.error('Error adding favorite:', error);
            throw error;
        }
    };

    // Remover favorito
    const removeFavorite = async (itemId: string, type: 'photography' | 'design') => {
        if (!user) {
            throw new Error('Você precisa estar logado');
        }

        try {
            const column = type === 'photography' ? 'photo_id' : 'project_id';
            const { error } = await supabase
                .from('favorites')
                .delete()
                .eq('user_id', user.id)
                .eq(column, itemId);

            if (error) throw error;
            await fetchFavorites();
        } catch (error: any) {
            console.error('Error removing favorite:', error);
            throw error;
        }
    };

    return {
        favorites,
        loading,
        isFavorite,
        toggleFavorite,
        addFavorite,
        removeFavorite,
        refreshFavorites: fetchFavorites,
        isAuthenticated: !!user
    };
};
