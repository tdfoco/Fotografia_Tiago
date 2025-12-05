import { useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VideoPresentationProps {
    videoUrl: string;
    thumbnailUrl?: string;
    title: string;
    autoplay?: boolean;
    controls?: boolean;
    className?: string;
}

export function VideoPresentation({
    videoUrl,
    thumbnailUrl,
    title,
    autoplay = false,
    controls = true,
    className = ''
}: VideoPresentationProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [isPlaying, setIsPlaying] = useState(autoplay);
    const [isMuted, setIsMuted] = useState(autoplay);

    // Detectar se é YouTube, Vimeo ou vídeo local
    const getVideoType = (url: string): 'youtube' | 'vimeo' | 'local' => {
        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            return 'youtube';
        }
        if (url.includes('vimeo.com')) {
            return 'vimeo';
        }
        return 'local';
    };

    // Extrair ID do vídeo do YouTube
    const getYouTubeId = (url: string): string | null => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    // Extrair ID do vídeo do Vimeo
    const getVimeoId = (url: string): string | null => {
        const regExp = /vimeo.com\/(\d+)/;
        const match = url.match(regExp);
        return match ? match[1] : null;
    };

    const videoType = getVideoType(videoUrl);

    const renderEmbedVideo = () => {
        if (videoType === 'youtube') {
            const videoId = getYouTubeId(videoUrl);
            if (!videoId) {
                setHasError(true);
                return null;
            }

            return (
                <iframe
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}&controls=${controls ? 1 : 0}&mute=${isMuted ? 1 : 0}`}
                    title={title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                    onLoad={() => setIsLoading(false)}
                    onError={() => setHasError(true)}
                />
            );
        }

        if (videoType === 'vimeo') {
            const videoId = getVimeoId(videoUrl);
            if (!videoId) {
                setHasError(true);
                return null;
            }

            return (
                <iframe
                    src={`https://player.vimeo.com/video/${videoId}?autoplay=${autoplay ? 1 : 0}&muted=${isMuted ? 1 : 0}`}
                    title={title}
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                    onLoad={() => setIsLoading(false)}
                    onError={() => setHasError(true)}
                />
            );
        }

        // Vídeo local
        return (
            <video
                src={videoUrl}
                poster={thumbnailUrl}
                autoPlay={autoplay}
                muted={isMuted}
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
                onLoadedData={() => setIsLoading(false)}
                onError={() => setHasError(true)}
            />
        );
    };

    // Fallback quando há erro
    if (hasError) {
        return (
            <div className={`relative aspect-video bg-secondary/30 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 ${className}`}>
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8">
                    {thumbnailUrl ? (
                        <img
                            src={thumbnailUrl}
                            alt={title}
                            className="w-full h-full object-cover opacity-50"
                        />
                    ) : (
                        <>
                            <Play className="w-16 h-16 text-muted-foreground/50" />
                            <p className="text-muted-foreground text-center">
                                Não foi possível carregar o vídeo
                            </p>
                            <p className="text-sm text-muted-foreground/70 text-center max-w-md">
                                {title}
                            </p>
                        </>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className={`relative aspect-video bg-secondary/30 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 shadow-2xl group ${className}`}>
            {/* Loading Skeleton */}
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-20">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 border-4 border-accent/30 border-t-accent rounded-full animate-spin" />
                        <p className="text-sm text-muted-foreground">Carregando vídeo...</p>
                    </div>
                </div>
            )}

            {/* Vídeo */}
            {renderEmbedVideo()}

            {/* Custom Controls Overlay (apenas para vídeos locais) */}
            {controls && videoType === 'local' && !isLoading && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="text-white hover:bg-white/20"
                        >
                            {isPlaying ? (
                                <Pause className="w-5 h-5" />
                            ) : (
                                <Play className="w-5 h-5" />
                            )}
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsMuted(!isMuted)}
                            className="text-white hover:bg-white/20"
                        >
                            {isMuted ? (
                                <VolumeX className="w-5 h-5" />
                            ) : (
                                <Volume2 className="w-5 h-5" />
                            )}
                        </Button>

                        <div className="flex-1" />

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                                const elem = document.querySelector('video');
                                if (elem?.requestFullscreen) {
                                    elem.requestFullscreen();
                                }
                            }}
                            className="text-white hover:bg-white/20"
                        >
                            <Maximize className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            )}

            {/* Glowing Border Effect */}
            <div className="absolute inset-0 rounded-2xl border-2 border-accent/0 group-hover:border-accent/30 transition-all duration-500 pointer-events-none" />
        </div>
    );
}
