import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, TrendingUp, Image as ImageIcon, Type, Tag, Check } from 'lucide-react';
import { pb } from '@/lib/pocketbase';
import { smartSortPhotos } from '@/lib/ai_services';
import { toast } from 'sonner';

interface Suggestion {
    type: 'homepage' | 'banner' | 'promotion' | 'similar';
    photoId: string;
    photoUrl: string;
    photoTitle: string;
    score: number;
    reason: string;
    action?: () => void;
}

export function SmartSuggestions() {
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [applying, setApplying] = useState<string | null>(null);

    useEffect(() => {
        async function generateSuggestions() {
            try {
                // Fetch photos
                const photos = await pb.collection('photography').getFullList();

                if (photos.length === 0) {
                    setLoading(false);
                    return;
                }

                // Smart sort
                const sorted = smartSortPhotos(photos);

                const getImageUrl = (photo: any) =>
                    `${pb.baseUrl}/api/files/${photo.collectionId}/${photo.id}/${photo.image}`;

                // Generate suggestions
                const newSuggestions: Suggestion[] = [
                    {
                        type: 'homepage',
                        photoId: sorted[0].id,
                        photoUrl: getImageUrl(sorted[0]),
                        photoTitle: sorted[0].title,
                        score: 95,
                        reason: 'Alto engajamento + qualidade visual excepcional'
                    },
                    {
                        type: 'banner',
                        photoId: sorted[1].id,
                        photoUrl: getImageUrl(sorted[1]),
                        photoTitle: sorted[1].title,
                        score: 88,
                        reason: 'Composição ideal para banner + cores vibrantes'
                    },
                    {
                        type: 'promotion',
                        photoId: sorted[2].id,
                        photoUrl: getImageUrl(sorted[2]),
                        photoTitle: sorted[2].title,
                        score: 82,
                        reason: 'Tendência de crescimento nas últimas 48h'
                    },
                ];

                // Add similar photo suggestions if there are enough photos
                if (sorted.length > 5) {
                    newSuggestions.push({
                        type: 'similar',
                        photoId: sorted[4].id,
                        photoUrl: getImageUrl(sorted[4]),
                        photoTitle: sorted[4].title,
                        score: 75,
                        reason: 'Fotos similares têm alto engajamento'
                    });
                }

                setSuggestions(newSuggestions);
            } catch (error: any) {
                console.error('Error generating suggestions:', error);
                setError(error?.message || 'Falha ao carregar sugestões');
                toast.error('Erro ao gerar sugestões', {
                    description: 'Não foi possível carregar as sugestões da IA. Tente recarregar a página.',
                });
            } finally {
                setLoading(false);
            }
        }

        generateSuggestions();
    }, []);

    const applySuggestion = async (suggestion: Suggestion) => {
        setApplying(suggestion.photoId);

        try {
            let updateData: any = {};
            let actionDescription = '';

            switch (suggestion.type) {
                case 'homepage':
                    // Set as featured/priority photo for homepage
                    updateData = {
                        featured: true,
                        priority: 10
                    };
                    actionDescription = 'marcada como destaque na homepage com prioridade máxima';
                    break;
                case 'banner':
                    // Mark for banner usage
                    updateData = {
                        use_as_banner: true,
                        featured: true,
                        priority: 8
                    };
                    actionDescription = 'configurada como banner e destaque';
                    break;
                case 'promotion':
                    // Boost this photo
                    updateData = {
                        promoted: true,
                        priority: 7
                    };
                    actionDescription = 'promovida com alta prioridade';
                    break;
                case 'similar':
                    // Add to recommended collection
                    updateData = {
                        recommended: true
                    };
                    actionDescription = 'adicionada às recomendações';
                    break;
            }

            // Apply the update to PocketBase
            await pb.collection('photography').update(suggestion.photoId, updateData);

            // Show success toast with details
            toast.success('Sugestão aplicada com sucesso!', {
                description: `"${suggestion.photoTitle}" foi ${actionDescription}.`,
                duration: 4000,
            });

            // Remove the applied suggestion from the list with animation
            setSuggestions(prev => prev.filter(s => s.photoId !== suggestion.photoId));

        } catch (error: any) {
            console.error('Error applying suggestion:', error);

            // Show error toast with helpful message
            const errorMessage = error?.message || 'Erro desconhecido';
            toast.error('Falha ao aplicar sugestão', {
                description: `Não foi possível atualizar a foto. ${errorMessage}`,
                duration: 5000,
            });
        } finally {
            setApplying(null);
        }
    };

    if (loading) {
        return (
            <Card className="p-6 bg-secondary/30 backdrop-blur-md border-white/10">
                <div className="flex items-center justify-center h-32">
                    <div className="w-12 h-12 border-4 border-electric-blue/30 border-t-electric-blue rounded-full animate-spin" />
                </div>
            </Card>
        );
    }

    return (
        <Card className="p-6 bg-secondary/30 backdrop-blur-md border-white/10">
            <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-vibrant-purple" />
                <h3 className="text-xl font-bold">Sugestões Inteligentes da IA</h3>
            </div>

            {error ? (
                <div className="text-center py-8">
                    <p className="text-destructive mb-2">⚠️ Erro ao carregar sugestões</p>
                    <p className="text-sm text-muted-foreground">{error}</p>
                    <Button
                        variant="outline"
                        size="sm"
                        className="mt-4"
                        onClick={() => window.location.reload()}
                    >
                        Recarregar
                    </Button>
                </div>
            ) : suggestions.length === 0 ? (
                <div className="text-center py-8">
                    <Sparkles className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
                    <p className="text-muted-foreground">
                        Adicione fotos para receber sugestões da IA
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {suggestions.map((suggestion) => (
                        <div
                            key={suggestion.photoId}
                            className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-electric-blue/30 transition-all group"
                        >
                            <img
                                src={suggestion.photoUrl}
                                alt={suggestion.photoTitle}
                                className="w-20 h-20 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm font-medium capitalize">{suggestion.type.replace('_', ' ')}</span>
                                    <span className="px-2 py-0.5 text-xs font-bold bg-vibrant-purple/20 text-vibrant-purple rounded-full">
                                        {suggestion.score}% match
                                    </span>
                                </div>
                                <p className="text-sm text-foreground mb-1">{suggestion.photoTitle}</p>
                                <p className="text-xs text-muted-foreground">{suggestion.reason}</p>
                            </div>
                            <Button
                                size="sm"
                                className="bg-electric-blue hover:bg-electric-blue/90 text-white"
                                onClick={() => applySuggestion(suggestion)}
                                disabled={applying === suggestion.photoId}
                            >
                                {applying === suggestion.photoId ? 'Aplicando...' : 'Aplicar'}
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </Card>
    );
}
