import { useState } from 'react';
import { useComments, useAuth } from '@/hooks/usePocketBaseData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Send, User, Reply, BadgeCheck } from 'lucide-react';
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
    const { user } = useAuth();
    const { toast } = useToast();
    const [newComment, setNewComment] = useState('');
    const [userName, setUserName] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyContent, setReplyContent] = useState('');

    const isAdmin = !!user;

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

    const handleReply = async (commentId: string) => {
        if (!replyContent.trim()) return;

        setSubmitting(true);
        try {
            await addComment(replyContent, 'Tiago', commentId, true);
            setReplyContent('');
            setReplyingTo(null);
            toast({
                title: "Resposta enviada",
                description: "Sua resposta foi publicada com sucesso.",
            });
        } catch (error) {
            console.error('Error submitting reply:', error);
            toast({
                title: "Erro",
                description: "Falha ao enviar resposta.",
                variant: "destructive"
            });
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
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
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
                        <div key={comment.id} className="space-y-3">
                            {/* Main Comment */}
                            <div className="flex gap-3 bg-secondary/20 p-3 rounded-lg">
                                <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                                    <User className="h-4 w-4 text-accent" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium">{comment.user_name}</span>
                                            {comment.is_admin && (
                                                <span className="flex items-center gap-1 text-xs bg-accent/20 text-accent px-2 py-0.5 rounded-full">
                                                    <BadgeCheck className="h-3 w-3" />
                                                    Tiago
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-xs text-muted-foreground">
                                            {formatDistanceToNow(new Date(comment.created), {
                                                addSuffix: true,
                                                locale: ptBR
                                            })}
                                        </span>
                                    </div>
                                    <p className="text-sm mt-1 text-foreground/90">{comment.content}</p>

                                    {/* Reply Button (Admin Only) */}
                                    {isAdmin && !comment.is_admin && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="mt-2 h-7 text-xs"
                                            onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                                        >
                                            <Reply className="h-3 w-3 mr-1" />
                                            Responder
                                        </Button>
                                    )}

                                    {/* Reply Input (Admin Only) */}
                                    {isAdmin && replyingTo === comment.id && (
                                        <div className="mt-3 flex gap-2">
                                            <Input
                                                placeholder="Escreva sua resposta..."
                                                value={replyContent}
                                                onChange={(e) => setReplyContent(e.target.value)}
                                                className="flex-1 bg-background"
                                                autoFocus
                                            />
                                            <Button
                                                size="sm"
                                                onClick={() => handleReply(comment.id)}
                                                disabled={submitting || !replyContent.trim()}
                                            >
                                                {submitting ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <Send className="h-4 w-4" />
                                                )}
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => {
                                                    setReplyingTo(null);
                                                    setReplyContent('');
                                                }}
                                            >
                                                Cancelar
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Replies (Nested) */}
                            {comment.replies && comment.replies.length > 0 && (
                                <div className="ml-11 space-y-2">
                                    {comment.replies.map((reply) => (
                                        <div key={reply.id} className="flex gap-3 bg-secondary/10 p-3 rounded-lg border-l-2 border-accent/30">
                                            <div className="h-7 w-7 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                                                <BadgeCheck className="h-4 w-4 text-accent" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-medium">Tiago</span>
                                                        <span className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded-full">
                                                            Admin
                                                        </span>
                                                    </div>
                                                    <span className="text-xs text-muted-foreground">
                                                        {formatDistanceToNow(new Date(reply.created), {
                                                            addSuffix: true,
                                                            locale: ptBR
                                                        })}
                                                    </span>
                                                </div>
                                                <p className="text-sm mt-1 text-foreground/90">{reply.content}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CommentsSection;
