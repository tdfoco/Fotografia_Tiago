import { useState, useEffect } from 'react';
import { pb } from '@/lib/pocketbase';
import { getImageUrl } from '@/hooks/usePocketBaseData';

interface Favorite {
    id: string; // Favorite record ID
    itemId: string; // Photo or Project ID
    type: 'photography' | 'design';
    title: string;
    url: string;
    created: string;
}

export const useFavorites = () => {
    const [favorites, setFavorites] = useState<Favorite[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);

    // Verificar autenticação
    useEffect(() => {
        setUser(pb.authStore.model);

        const unsubscribe = pb.authStore.onChange((token, model) => {
            setUser(model);
        });

        return () => unsubscribe();
    }, []);

    // Carregar favoritos do usuário
    const fetchFavorites = async () => {
        if (!pb.authStore.isValid) {
            setFavorites([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const records = await pb.collection('favorites').getFullList({
                expand: 'photo,project',
                sort: '-created',
            });

            const mappedFavorites: Favorite[] = records.map((record: any) => {
                const isPhoto = !!record.photo;
                const item = isPhoto ? record.expand?.photo : record.expand?.project;

                if (!item) return null;

                return {
                    id: record.id,
                    itemId: item.id,
                    type: isPhoto ? 'photography' : 'design',
                    title: item.title,
                    url: getImageUrl(item.collectionId, item.id, isPhoto ? item.image : item.images?.[0]),
                    created: record.created,
                };
            }).filter(Boolean) as Favorite[];

            setFavorites(mappedFavorites);
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
        return favorites.some(fav => fav.itemId === itemId);
    };

    // Toggle favorito (adicionar/remover)
    const toggleFavorite = async (itemId: string, type: 'photography' | 'design') => {
        if (!pb.authStore.isValid) {
            throw new Error('Você precisa estar logado para favoritar');
        }

        try {
            const wasFavorite = isFavorite(itemId);

            if (wasFavorite) {
                // Find the favorite record ID
                const favRecord = favorites.find(f => f.itemId === itemId);
                if (favRecord) {
                    await pb.collection('favorites').delete(favRecord.id);
                    setFavorites(prev => prev.filter(fav => fav.itemId !== itemId));
                }
            } else {
                // Create new favorite
                const data = {
                    user: pb.authStore.model?.id,
                    photo: type === 'photography' ? itemId : null,
                    project: type === 'design' ? itemId : null,
                };
                await pb.collection('favorites').create(data);
                await fetchFavorites(); // Refresh to get the new ID and expanded data
            }

            return !wasFavorite;
        } catch (error: any) {
            console.error('Error toggling favorite:', error);
            await fetchFavorites();
            throw error;
        }
    };

    // Adicionar favorito
    const addFavorite = async (itemId: string, type: 'photography' | 'design') => {
        await toggleFavorite(itemId, type); // Reuse toggle logic for simplicity
    };

    // Remover favorito
    const removeFavorite = async (itemId: string, type: 'photography' | 'design') => {
        await toggleFavorite(itemId, type); // Reuse toggle logic
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
