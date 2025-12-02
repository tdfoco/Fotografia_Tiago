import { useState } from 'react';
import { Heart } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface FavoriteButtonProps {
    itemId: string;
    itemType: 'photography' | 'design';
    showLabel?: boolean;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'default' | 'ghost' | 'outline';
}

const FavoriteButton = ({
    itemId,
    itemType,
    showLabel = false,
    size = 'md',
    variant = 'ghost'
}: FavoriteButtonProps) => {
    const { isFavorite, toggleFavorite, isAuthenticated } = useFavorites();
    const [isLoading, setIsLoading] = useState(false);

    const favorited = isFavorite(itemId);

    const handleClick = async (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevenir propagação para elementos pai

        if (!isAuthenticated) {
            toast.error('Faça login para favoritar');
            return;
        }

        setIsLoading(true);
        try {
            const result = await toggleFavorite(itemId, itemType);

            if (result) {
                toast.success('Adicionado aos favoritos!', {
                    icon: '❤️'
                });
            } else {
                toast('Removido dos favoritos', {
                    icon: '💔'
                });
            }
        } catch (error: any) {
            toast.error(error.message || 'Erro ao favoritar');
        } finally {
            setIsLoading(false);
        }
    };

    const iconSize = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6'
    }[size];

    return (
        <Button
            variant={variant}
            size={size === 'sm' ? 'sm' : 'default'}
            onClick={handleClick}
            disabled={isLoading}
            className={`gap-2 ${favorited ? 'text-red-500 hover:text-red-600' : ''}`}
        >
            <Heart
                className={`${iconSize} transition-all ${favorited ? 'fill-current' : ''
                    } ${isLoading ? 'animate-pulse' : ''}`}
            />
            {showLabel && (
                <span className="text-sm">
                    {favorited ? 'Favoritado' : 'Favoritar'}
                </span>
            )}
        </Button>
    );
};

export default FavoriteButton;
