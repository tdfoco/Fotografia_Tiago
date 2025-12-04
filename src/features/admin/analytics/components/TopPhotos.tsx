import { Card } from '@/components/ui/card';
import { TrendingUp, Eye } from 'lucide-react';

interface TopPhoto {
    id: string;
    title: string;
    url: string;
    engagement: number;
    views: number;
}

interface TopPhotosProps {
    photos: TopPhoto[];
}

export function TopPhotos({ photos }: TopPhotosProps) {
    return (
        <Card className="p-6 bg-secondary/30 backdrop-blur-md border-white/10">
            <h3 className="text-xl font-bold mb-6">Top 10 Fotos - Engajamento</h3>
            <div className="space-y-4">
                {photos.map((photo, index) => (
                    <div
                        key={photo.id}
                        className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-electric-blue/30 transition-all group"
                    >
                        {/* Rank */}
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${index === 0 ? 'bg-yellow-500/20 text-yellow-500' :
                                index === 1 ? 'bg-gray-400/20 text-gray-400' :
                                    index === 2 ? 'bg-orange-500/20 text-orange-500' :
                                        'bg-electric-blue/10 text-electric-blue'
                            }`}>
                            {index + 1}
                        </div>

                        {/* Thumbnail */}
                        <img
                            src={photo.url}
                            alt={photo.title}
                            className="w-16 h-16 rounded-lg object-cover"
                        />

                        {/* Info */}
                        <div className="flex-1">
                            <p className="font-medium text-sm mb-1 line-clamp-1">{photo.title}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <Eye className="w-3 h-3" />
                                    {photo.views.toLocaleString()} views
                                </span>
                                <span className="flex items-center gap-1">
                                    <TrendingUp className="w-3 h-3" />
                                    {photo.engagement} engajamento
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}
