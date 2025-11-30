import { useState } from 'react';
import { useComments } from '@/hooks/useSupabaseData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Send, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface CommentsSectionProps {
    itemId: string;
    type: 'photography' | 'design';
    className?: string;
}

const CommentsSection = ({ itemId, type, className }: CommentsSectionProps) => {
    const { comments, loading, addComment } = useComments(itemId, type);
    const { toast } = useToast();
    const [newComment, setNewComment] = useState('');
    const [userName, setUserName] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setSubmitting(true);
        try {
            await addComment(newComment, userName || 'Anônimo');
            setNewComment('');
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 5000);
            toast({
                title: "Comentário enviado",
                description: "Seu comentário foi enviado e aguarda aprovação do administrador.",
            });
        } catch (error) {
            console.error('Error submitting comment:', error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className={`space-y-6 ${className}`}>
            <h3 className="text-lg font-semibold">Comentários ({comments.length})</h3>

            {/* Comment Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
                <div className="flex flex-col gap-3">
                    <Input
                        placeholder="Seu nome (opcional)"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="w-full bg-secondary/50"
                    />
                    <div className="flex gap-2">
                        <Input
                            placeholder="Adicione um comentário..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="flex-1 bg-secondary/50"
                            required
                        />
                        <Button type="submit" size="icon" disabled={submitting || !newComment.trim()}>
                            {submitting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Send className="h-4 w-4" />
                            )}
                        </Button>
                    </div>
                </div>
                {showSuccess && (
                    <div className="bg-green-500/10 border border-green-500/20 text-green-500 p-3 rounded-md text-sm text-center animate-in fade-in slide-in-from-top-2">
                        Comentário feito! Aguardando aprovação.
                    </div>
                )}
            </form>

            {/* Comments List */}
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {loading ? (
                    <div className="flex justify-center py-4">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                ) : comments.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                        Seja o primeiro a comentar!
                    </p>
                ) : (
                    comments.map((comment) => (
                        <div key={comment.id} className="flex gap-3 bg-secondary/20 p-3 rounded-lg">
                            <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                                <User className="h-4 w-4 text-accent" />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <span className="text-sm font-medium">{comment.user_name}</span>
                                    <span className="text-xs text-muted-foreground">
                                        {formatDistanceToNow(new Date(comment.created_at), {
                                            addSuffix: true,
                                            locale: ptBR
                                        })}
                                    </span>
                                </div>
                                <p className="text-sm mt-1 text-foreground/90">{comment.content}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CommentsSection;
