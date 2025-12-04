import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { MessageSquare, Check, X, Reply, Search, User } from 'lucide-react';
import { pb } from '@/lib/pocketbase';
import { toast } from 'sonner';

interface Comment {
    id: string;
    author: string;
    email: string;
    content: string;
    photo_id?: string;
    project_id?: string;
    approved: boolean;
    created: string;
    photo?: any;
    project?: any;
}

export default function CommentsPage() {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('pending');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchComments();
    }, []);

    async function fetchComments() {
        try {
            // Try to fetch from comments collection
            const records = await pb.collection('comments').getFullList({
                sort: '-created',
                expand: 'photo_id,project_id'
            });
            setComments(records as any);
        } catch (error) {
            console.log('No comments collection found');
            setComments([]);
        } finally {
            setLoading(false);
        }
    }

    async function handleApprove(commentId: string) {
        try {
            await pb.collection('comments').update(commentId, { approved: true });
            toast.success('Comentário aprovado!');
            fetchComments();
        } catch (error) {
            console.error('Error approving comment:', error);
            toast.error('Erro ao aprovar comentário');
        }
    }

    async function handleReject(commentId: string) {
        if (!confirm('Tem certeza que deseja rejeitar este comentário?')) return;

        try {
            await pb.collection('comments').delete(commentId);
            toast.success('Comentário rejeitado!');
            fetchComments();
        } catch (error) {
            console.error('Error rejecting comment:', error);
            toast.error('Erro ao rejeitar comentário');
        }
    }

    const filteredComments = comments
        .filter(c => {
            if (filter === 'pending') return !c.approved;
            if (filter === 'approved') return c.approved;
            return true;
        })
        .filter(c =>
            c.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.content.toLowerCase().includes(searchTerm.toLowerCase())
        );

    const pendingCount = comments.filter(c => !c.approved).length;
    const approvedCount = comments.filter(c => c.approved).length;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-16 h-16 border-4 border-electric-blue/30 border-t-electric-blue rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-display font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-electric-blue to-vibrant-purple">
                    Moderação de Comentários
                </h1>
                <p className="text-muted-foreground text-lg">
                    Gerencie e modere os comentários do portfólio
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 bg-secondary/30 backdrop-blur-md border-white/10">
                    <h3 className="text-sm text-muted-foreground mb-2">Total</h3>
                    <p className="text-3xl font-bold">{comments.length}</p>
                </Card>
                <Card className="p-6 bg-secondary/30 backdrop-blur-md border-yellow-500/20">
                    <h3 className="text-sm text-muted-foreground mb-2">Pendentes</h3>
                    <p className="text-3xl font-bold text-yellow-500">{pendingCount}</p>
                </Card>
                <Card className="p-6 bg-secondary/30 backdrop-blur-md border-green-500/20">
                    <h3 className="text-sm text-muted-foreground mb-2">Aprovados</h3>
                    <p className="text-3xl font-bold text-green-500">{approvedCount}</p>
                </Card>
            </div>

            {/* Search */}
            <Card className="p-4 bg-secondary/30 backdrop-blur-md border-white/10">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar por autor ou conteúdo..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-secondary/50 border-white/10"
                    />
                </div>
            </Card>

            {/* Tabs */}
            <Tabs value={filter} onValueChange={(v) => setFilter(v as any)}>
                <TabsList className="bg-secondary/30 border border-white/10">
                    <TabsTrigger value="pending">
                        Pendentes
                        {pendingCount > 0 && (
                            <Badge className="ml-2 bg-yellow-500/20 text-yellow-500 border-yellow-500/30">
                                {pendingCount}
                            </Badge>
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="approved">Aprovados</TabsTrigger>
                    <TabsTrigger value="all">Todos</TabsTrigger>
                </TabsList>

                <TabsContent value={filter} className="mt-6">
                    {filteredComments.length === 0 ? (
                        <Card className="p-12 bg-secondary/30 backdrop-blur-md border-white/10 text-center">
                            <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                            <p className="text-muted-foreground">
                                {filter === 'pending' ? 'Nenhum comentário pendente' :
                                    filter === 'approved' ? 'Nenhum comentário aprovado' :
                                        'Nenhum comentário encontrado'}
                            </p>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {filteredComments.map((comment) => (
                                <Card
                                    key={comment.id}
                                    className={`p-6 bg-secondary/30 backdrop-blur-md border transition-all ${comment.approved
                                            ? 'border-green-500/20'
                                            : 'border-yellow-500/20'
                                        }`}
                                >
                                    <div className="flex items-start gap-4">
                                        {/* Avatar */}
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-electric-blue to-vibrant-purple flex items-center justify-center text-white font-bold flex-shrink-0">
                                            {comment.author.charAt(0).toUpperCase()}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-2">
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="font-bold">{comment.author}</h4>
                                                        <Badge
                                                            variant="outline"
                                                            className={
                                                                comment.approved
                                                                    ? 'border-green-500/30 text-green-500'
                                                                    : 'border-yellow-500/30 text-yellow-500'
                                                            }
                                                        >
                                                            {comment.approved ? 'Aprovado' : 'Pendente'}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">{comment.email}</p>
                                                </div>
                                                <span className="text-xs text-muted-foreground">
                                                    {new Date(comment.created).toLocaleDateString('pt-BR')}
                                                </span>
                                            </div>

                                            <p className="text-foreground mb-4">{comment.content}</p>

                                            {/* Actions */}
                                            {!comment.approved && (
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleApprove(comment.id)}
                                                        className="bg-green-500 hover:bg-green-600 text-white"
                                                    >
                                                        <Check className="w-4 h-4 mr-2" />
                                                        Aprovar
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() => handleReject(comment.id)}
                                                    >
                                                        <X className="w-4 h-4 mr-2" />
                                                        Rejeitar
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
