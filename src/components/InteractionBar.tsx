import { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { incrementLikes, incrementShares } from '@/hooks/useSupabaseData';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface InteractionBarProps {
    itemId: string;
    type: 'photography' | 'design';
    initialLikes?: number;
    initialComments?: number;
    initialShares?: number;
    onCommentClick?: () => void;
    className?: string;
    variant?: 'light' | 'dark';
}

const InteractionBar = ({
    itemId,
    type,
    initialLikes = 0,
    initialComments = 0,
    initialShares = 0,
    onCommentClick,
    className,
    variant = 'dark'
}: InteractionBarProps) => {
    const { toast } = useToast();
    const [likes, setLikes] = useState(initialLikes);
    const [shares, setShares] = useState(initialShares);
    const [isLiked, setIsLiked] = useState(false);

    // Check local storage for liked status
    useEffect(() => {
        const likedItems = JSON.parse(localStorage.getItem('liked_items') || '{}');
        // We still set isLiked to true if they have liked it, to show the visual state
        // But we won't block the action based on this state alone
        if (likedItems[itemId]) {
            setIsLiked(true);
        }
    }, [itemId]);

    // Sync state with props when data loads
    useEffect(() => {
        setLikes(initialLikes);
    }, [initialLikes]);

    useEffect(() => {
        setShares(initialShares);
    }, [initialShares]);

    const handleLike = async (e: React.MouseEvent) => {
        e.stopPropagation();

        const likedItems = JSON.parse(localStorage.getItem('liked_items') || '{}');
        const lastLiked = likedItems[itemId];
        const now = Date.now();
        const COOLDOWN = 10 * 60 * 1000; // 10 minutes

        // Check if currently in cooldown
        if (lastLiked && typeof lastLiked === 'number' && (now - lastLiked < COOLDOWN)) {
            const remaining = Math.ceil((COOLDOWN - (now - lastLiked)) / 60000);
            toast({
                title: "Aguarde um pouco",
                description: `Você poderá curtir novamente em ${remaining} minutos.`,
                variant: "destructive"
            });
            return;
        }

        // Optimistic update
        setLikes(prev => prev + 1);
        setIsLiked(true);

        // Save timestamp to local storage
        likedItems[itemId] = now;
        localStorage.setItem('liked_items', JSON.stringify(likedItems));

        // API call
        await incrementLikes(itemId, type);
    };

    const handleShare = async (e: React.MouseEvent) => {
        e.stopPropagation();

        // Optimistic update
        setShares(prev => prev + 1);
        await incrementShares(itemId, type);

        const url = window.location.href;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Check out this portfolio item!',
                    text: 'I found this amazing work on Tiago Damasceno Portfolio',
                    url: url
                });
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            // Fallback to clipboard
            navigator.clipboard.writeText(url);
            toast({
                title: "Link copiado!",
                description: "O link foi copiado para sua área de transferência.",
            });
        }
    };

    const textColor = variant === 'light' ? 'text-foreground' : 'text-white';
    const iconColor = variant === 'light' ? 'text-foreground/80' : 'text-white/80';
    const hoverColor = 'hover:text-accent';

    return (
        <div className={cn("flex items-center gap-6", className)}>
            <button
                onClick={handleLike}
                className={cn(
                    "flex items-center gap-2 transition-colors group",
                    isLiked ? "text-red-500" : iconColor,
                    !isLiked && hoverColor
                )}
            >
                <Heart
                    className={cn(
                        "h-5 w-5 transition-transform group-active:scale-125",
                        isLiked && "fill-current"
                    )}
                />
                <span className="text-sm font-medium">{likes}</span>
            </button>

            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onCommentClick?.();
                }}
                className={cn(
                    "flex items-center gap-2 transition-colors group",
                    iconColor,
                    hoverColor
                )}
            >
                <MessageCircle className="h-5 w-5" />
                <span className="text-sm font-medium">{initialComments}</span>
            </button>

            <button
                onClick={handleShare}
                className={cn(
                    "flex items-center gap-2 transition-colors group",
                    iconColor,
                    hoverColor
                )}
            >
                <Share2 className="h-5 w-5" />
                <span className="text-sm font-medium">{shares}</span>
            </button>
        </div>
    );
};

export default InteractionBar;
