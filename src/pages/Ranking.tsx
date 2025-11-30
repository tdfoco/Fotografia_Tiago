import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useTopRated } from '@/hooks/useSupabaseData';
import { useLanguage } from '@/contexts/LanguageContext';
import ProtectedImage from '@/components/ProtectedImage';
import { Heart, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import Lightbox, { Photo } from '@/components/Lightbox';
import ProjectModal from '@/components/ProjectModal';
import InteractionBar from '@/components/InteractionBar';
import type { DesignProject } from '@/lib/supabase';
import { SEO } from "@/components/SEO";

const Ranking = () => {
    const { t } = useLanguage();
    // Fetch top 10 items for the dedicated ranking page
    const { topPhotos, topProjects, loading } = useTopRated(10);
    const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
    const [selectedProject, setSelectedProject] = useState<DesignProject | null>(null);

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
        <>
            <SEO title="Ranking" description="Os trabalhos mais populares do portfólio" />
            <Navigation />
            <main className="min-h-screen pt-20 bg-background">
                <section className="py-20 px-4 md:px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-6">
                                Ranking
                            </h1>
                            <p className="text-muted-foreground text-lg font-light max-w-2xl mx-auto">
                                Os trabalhos mais curtidos e comentados pela comunidade
                            </p>
                        </div>

                        {loading ? (
                            <div className="text-center py-20">
                                <p className="text-muted-foreground">{t('portfolio.loading')}</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                {/* Top Photos */}
                                <div>
                                    <h2 className="text-2xl font-display font-semibold mb-8 flex items-center gap-3 text-[#00A3FF]">
                                        <span className="w-8 h-[2px] bg-[#00A3FF]"></span>
                                        Top Fotografia
                                    </h2>
                                    <div className="space-y-6">
                                        {topPhotos.map((photo, index) => (
                                            <div
                                                key={photo.id}
                                                className="flex gap-4 bg-secondary/30 p-4 rounded-lg hover:bg-secondary/50 transition-all cursor-pointer group border border-transparent hover:border-border/50"
                                            >
                                                <div
                                                    className="w-32 h-32 flex-shrink-0 overflow-hidden rounded-md relative"
                                                    onClick={() => {
                                                        const p = lightboxPhotos.find(lp => lp.id === photo.id);
                                                        if (p) setSelectedPhoto(p);
                                                    }}
                                                >
                                                    <div className="absolute top-2 left-2 z-10 w-8 h-8 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-full text-white font-bold text-sm border border-white/10">
                                                        #{index + 1}
                                                    </div>
                                                    <ProtectedImage
                                                        src={photo.url}
                                                        alt={photo.title}
                                                        className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                                    />
                                                </div>
                                                <div className="flex-1 flex flex-col">
                                                    <div className="flex-1" onClick={() => {
                                                        const p = lightboxPhotos.find(lp => lp.id === photo.id);
                                                        if (p) setSelectedPhoto(p);
                                                    }}>
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <span className="text-xs text-muted-foreground uppercase tracking-wider bg-background px-2 py-1 rounded-full">
                                                                {photo.category}
                                                            </span>
                                                        </div>
                                                        <h3 className="font-medium text-lg leading-tight mb-2 group-hover:text-[#00A3FF] transition-colors">
                                                            {photo.title}
                                                        </h3>
                                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                            <div className="flex items-center gap-1.5">
                                                                <Heart className="w-4 h-4 text-red-500 fill-current" />
                                                                <span className="font-medium">{photo.likes_count || 0}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1.5">
                                                                <MessageCircle className="w-4 h-4" />
                                                                <span className="font-medium">{photo.comments_count || 0}</span>
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
                                                        className="mt-3 pt-3 border-t border-border/50 justify-start gap-6"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Top Projects */}
                                <div>
                                    <h2 className="text-2xl font-display font-semibold mb-8 flex items-center gap-3 text-[#00A3FF]">
                                        <span className="w-8 h-[2px] bg-[#00A3FF]"></span>
                                        Top Design
                                    </h2>
                                    <div className="space-y-6">
                                        {topProjects.map((project, index) => (
                                            <div
                                                key={project.id}
                                                className="flex gap-4 bg-secondary/30 p-4 rounded-lg hover:bg-secondary/50 transition-all cursor-pointer group border border-transparent hover:border-border/50"
                                            >
                                                <div
                                                    className="w-32 h-32 flex-shrink-0 overflow-hidden rounded-md relative"
                                                    onClick={() => setSelectedProject(project)}
                                                >
                                                    <div className="absolute top-2 left-2 z-10 w-8 h-8 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-full text-white font-bold text-sm border border-white/10">
                                                        #{index + 1}
                                                    </div>
                                                    <ProtectedImage
                                                        src={project.images[0]}
                                                        alt={project.title}
                                                        className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                                    />
                                                </div>
                                                <div className="flex-1 flex flex-col">
                                                    <div className="flex-1" onClick={() => setSelectedProject(project)}>
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <span className="text-xs text-muted-foreground uppercase tracking-wider bg-background px-2 py-1 rounded-full">
                                                                {project.category}
                                                            </span>
                                                        </div>
                                                        <h3 className="font-medium text-lg leading-tight mb-2 group-hover:text-[#00A3FF] transition-colors">
                                                            {project.title}
                                                        </h3>
                                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                            <div className="flex items-center gap-1.5">
                                                                <Heart className="w-4 h-4 text-red-500 fill-current" />
                                                                <span className="font-medium">{project.likes_count || 0}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1.5">
                                                                <MessageCircle className="w-4 h-4" />
                                                                <span className="font-medium">{project.comments_count || 0}</span>
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
                                                        className="mt-3 pt-3 border-t border-border/50 justify-start gap-6"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </main>
            <Footer />

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
        </>
    );
};

export default Ranking;
