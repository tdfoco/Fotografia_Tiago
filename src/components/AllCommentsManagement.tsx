import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useAdminComments, useAllComments, deleteComment as deleteCommentFn, addReply } from '@/hooks/useSupabaseData';
import type { Comment } from '@/hooks/useSupabaseData';
import { supabase, uploadImage, deleteImage, PHOTOGRAPHY_BUCKET, DESIGN_BUCKET, HERO_BUCKET } from '@/lib/supabase';
import type { PhotographyItem, DesignProject, HeroImage } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { extractExifData, formatDateForInput, formatExifAsDescription } from '@/lib/exifExtractor';
import { Calendar, Edit, Loader2, LogOut, Plus, Tag, Trash2, Upload, MessageCircle, Check, X as XIcon } from 'lucide-react';
import TagInput from '@/components/TagInput';
import BatchUpload from '@/components/BatchUpload';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

// All Comments Management Component
const AllCommentsManagement = () => {
    const { allComments, loading, refreshComments } = useAllComments();
    const { user } = useAuth();
    const { toast } = useToast();
    const [filter, setFilter] = useState<'all' | 'approved' | 'pending'>('all');
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyContent, setReplyContent] = useState('');
    const [isSubmittingReply, setIsSubmittingReply] = useState(false);

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja deletar este comentário?')) return;
        try {
            await deleteCommentFn(id);
            toast({ title: 'Comentário Deletado', description: 'O comentário foi removido com sucesso.' });
            await refreshComments();
        } catch (error: any) {
            console.error('Delete error:', error);
            toast({
                title: 'Erro ao Deletar',
                description: error.message || 'Falha ao deletar comentário. Verifique as permissões no Supabase.',
                variant: 'destructive'
            });
        }
    };

    const handleReply = async (parentId: string, itemId: string, type: 'photography' | 'design') => {
        if (!replyContent.trim()) return;

        setIsSubmittingReply(true);
        try {
            await addReply(parentId, replyContent, itemId, type);
            toast({ title: 'Resposta Enviada', description: 'Sua resposta foi publicada.' });
            setReplyingTo(null);
            setReplyContent('');
            await refreshComments();
        } catch (error: any) {
            toast({
                title: 'Erro',
                description: error.message || 'Falha ao enviar resposta.',
                variant: 'destructive'
            });
        } finally {
            setIsSubmittingReply(false);
        }
    };

    // Filter comments
    const filteredComments = allComments.filter(comment => {
        if (filter === 'all') return true;
        if (filter === 'approved') return comment.approved;
        if (filter === 'pending') return !comment.approved;
        return true;
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-display font-bold">Todos os Comentários</h2>
                <div className="flex gap-2">
                    <Button
                        variant={filter === 'all' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilter('all')}
                    >
                        Todos
                    </Button>
                    <Button
                        variant={filter === 'approved' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilter('approved')}
                    >
                        Aprovados
                    </Button>
                    <Button
                        variant={filter === 'pending' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilter('pending')}
                    >
                        Pendentes
                    </Button>
                    <Button onClick={() => refreshComments()} variant="outline" size="sm">
                        Atualizar
                    </Button>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-10">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                    <p className="mt-2 text-muted-foreground">Carregando comentários...</p>
                </div>
            ) : filteredComments.length === 0 ? (
                <div className="text-center py-20 bg-secondary/20 rounded-lg">
                    <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-lg font-medium">Nenhum comentário encontrado</p>
                    <p className="text-muted-foreground">Tente ajustar os filtros.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredComments.map((comment: Comment) => {
                        const itemType = comment.photo_id ? 'photography' : 'design';
                        const itemId = (comment.photo_id || comment.project_id) as string;

                        return (
                            <Card key={comment.id}>
                                <CardContent className="p-6">
                                    <div className="space-y-4">
                                        {/* Comment Header */}
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-2 flex-1">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="font-semibold text-lg">
                                                        {comment.user_name || 'Anônimo'}
                                                    </span>
                                                    {comment.is_admin && (
                                                        <span className="text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded-full font-bold">
                                                            ADMIN
                                                        </span>
                                                    )}
                                                    {comment.approved ? (
                                                        <span className="text-xs bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full">
                                                            Aprovado
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded-full">
                                                            Pendente
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-muted-foreground">
                                                    {new Date(comment.created_at).toLocaleString('pt-BR')}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Comment Content */}
                                        <p className="text-foreground/90 bg-secondary/30 p-3 rounded-md">
                                            "{comment.content}"
                                        </p>

                                        {/* Actions */}
                                        <div className="flex gap-2 flex-wrap">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    setReplyingTo(replyingTo === comment.id ? null : comment.id);
                                                    setReplyContent('');
                                                }}
                                            >
                                                <MessageCircle className="mr-2 h-4 w-4" />
                                                Responder
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDelete(comment.id)}
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Deletar
                                            </Button>
                                        </div>

                                        {/* Reply Form */}
                                        {replyingTo === comment.id && (
                                            <div className="mt-4 p-4 bg-secondary/20 rounded-md space-y-3">
                                                <label className="block text-sm font-medium">Resposta do Admin:</label>
                                                <Textarea
                                                    value={replyContent}
                                                    onChange={(e) => setReplyContent(e.target.value)}
                                                    placeholder="Digite sua resposta..."
                                                    className="min-h-[100px]"
                                                />
                                                <div className="flex gap-2">
                                                    <Button
                                                        onClick={() => handleReply(comment.id, itemId, itemType)}
                                                        disabled={isSubmittingReply || !replyContent.trim()}
                                                        size="sm"
                                                    >
                                                        {isSubmittingReply ? (
                                                            <>
                                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                Enviando...
                                                            </>
                                                        ) : (
                                                            'Enviar Resposta'
                                                        )}
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                            setReplyingTo(null);
                                                            setReplyContent('');
                                                        }}
                                                    >
                                                        Cancelar
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default AllCommentsManagement;
