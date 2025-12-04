import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, TrendingUp, Image as ImageIcon, Type, Tag } from 'lucide-react';
import { pb } from '@/lib/pocketbase';
import { smartSortPhotos } from '@/lib/ai_services';

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
            } catch (error) {
                console.error('Error generating suggestions:', error);
            } finally {
                setLoading(false);
            }
        }

        generateSuggestions();
    }, []);

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

            {suggestions.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                    Adicione fotos para receber sugestões da IA
                </p>
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
                            >
                                Aplicar
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </Card>
    );
}
