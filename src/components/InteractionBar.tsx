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
        if (isLiked) return;

        // Optimistic update
        setLikes(prev => prev + 1);
        setIsLiked(true);

        // Save to local storage
        const likedItems = JSON.parse(localStorage.getItem('liked_items') || '{}');
        likedItems[itemId] = true;
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
