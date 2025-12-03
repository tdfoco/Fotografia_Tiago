import { useTopRated } from '@/hooks/usePocketBaseData';
import { useLanguage } from '@/contexts/LanguageContext';
import ProtectedImage from './ProtectedImage';
import { Heart, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import Lightbox, { Photo } from './Lightbox';
import ProjectModal from './ProjectModal';
import type { DesignProject } from '@/hooks/usePocketBaseData';
import InteractionBar from './InteractionBar';

const RankingSection = () => {
    const { t } = useLanguage();
    const { topPhotos, topProjects, loading } = useTopRated(3);
    const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
    const [selectedProject, setSelectedProject] = useState<DesignProject | null>(null);

    if (loading) return null;

    // Transform photos for lightbox
    const lightboxPhotos: Photo[] = topPhotos.map(photo => ({
        id: photo.id,
        src: photo.url,
        alt: photo.title,
        category: photo.category,
        description: photo.description,
        likes_count: photo.likes_count,
        comments_count: photo.comments_count,
        shares_count: photo.shares_count
    }));

    return (
        <section className="py-20 bg-secondary/30">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-4">
                        Destaques da Comunidade
                    </h2>
                    <p className="text-muted-foreground">
                        Os trabalhos mais curtidos e comentados por vocês
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Top Photos */}
                    <div>
                        <h3 className="text-xl font-medium mb-6 flex items-center gap-2">
                            <span className="w-8 h-[1px] bg-accent"></span>
                            Fotografia
                        </h3>
                        <div className="space-y-6">
                            {topPhotos.map((photo, index) => (
                                <div
                                    key={photo.id}
                                    className="flex gap-4 bg-background p-4 rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer group"
                                    onClick={() => {
                                        const p = lightboxPhotos.find(lp => lp.id === photo.id);
                                        if (p) setSelectedPhoto(p);
                                    }}
                                >
                                    <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-md">
                                        <ProtectedImage
                                            src={photo.url}
                                            alt={photo.title}
                                            className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                        />
                                    </div>
                                    <div className="flex-1 flex flex-col justify-center">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-bold text-accent px-2 py-0.5 rounded-full bg-accent/10">
                                                #{index + 1}
                                            </span>
                                            <span className="text-xs text-muted-foreground uppercase tracking-wider">
                                                {photo.category}
                                            </span>
                                        </div>
                                        <h4 className="font-medium truncate">{photo.title}</h4>
                                        <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <Heart className="w-4 h-4 text-red-500 fill-current" />
                                                <span>{photo.likes_count || 0}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <MessageCircle className="w-4 h-4" />
                                                <span>{photo.comments_count || 0}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <InteractionBar
                                        itemId={photo.id}
                                        type="photography"
                                        initialLikes={photo.likes_count}
                                        initialComments={photo.comments_count}
                                        initialShares={photo.shares_count}
                                        variant="light"
                                        className="mt-4 pt-4 border-t border-border/50"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top Projects */}
                    <div>
                        <h3 className="text-xl font-medium mb-6 flex items-center gap-2">
                            <span className="w-8 h-[1px] bg-accent"></span>
                            Design
                        </h3>
                        <div className="space-y-6">
                            {topProjects.map((project, index) => (
                                <div
                                    key={project.id}
                                    className="flex gap-4 bg-background p-4 rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer group"
                                    onClick={() => setSelectedProject(project)}
                                >
                                    <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-md">
                                        <ProtectedImage
                                            src={project.images[0]}
                                            alt={project.title}
                                            className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                        />
                                    </div>
                                    <div className="flex-1 flex flex-col justify-center">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-bold text-accent px-2 py-0.5 rounded-full bg-accent/10">
                                                #{index + 1}
                                            </span>
                                            <span className="text-xs text-muted-foreground uppercase tracking-wider">
                                                {project.category}
                                            </span>
                                        </div>
                                        <h4 className="font-medium truncate">{project.title}</h4>
                                        <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <Heart className="w-4 h-4 text-red-500 fill-current" />
                                                <span>{project.likes_count || 0}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <MessageCircle className="w-4 h-4" />
                                                <span>{project.comments_count || 0}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <InteractionBar
                                        itemId={project.id}
                                        type="design"
                                        initialLikes={project.likes_count}
                                        initialComments={project.comments_count}
                                        initialShares={project.shares_count}
                                        variant="light"
                                        className="mt-4 pt-4 border-t border-border/50"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {selectedPhoto && (
                <Lightbox
                    photo={selectedPhoto}
                    photos={lightboxPhotos}
                    onClose={() => setSelectedPhoto(null)}
                    onNavigate={setSelectedPhoto}
                />
            )}

            {selectedProject && (
                <ProjectModal
                    project={selectedProject}
                    onClose={() => setSelectedProject(null)}
                />
            )}
        </section>
    );
};

export default RankingSection;
