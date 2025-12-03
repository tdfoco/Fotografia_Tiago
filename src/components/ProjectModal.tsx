import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { DesignProject } from '@/hooks/usePocketBaseData';
import ProtectedImage from './ProtectedImage';
import InteractionBar from './InteractionBar';
import CommentsSection from './CommentsSection';

interface ProjectModalProps {
    project: DesignProject;
    onClose: () => void;
}

const ProjectModal = ({ project, onClose }: ProjectModalProps) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showComments, setShowComments] = useState(false);

    const handleNext = () => {
        setCurrentImageIndex((prev) => (prev < project.images.length - 1 ? prev + 1 : 0));
    };

    const handlePrev = () => {
        setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : project.images.length - 1));
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center animate-fade-in p-4 overflow-y-auto">
            <button
                onClick={onClose}
                className="fixed top-4 right-4 text-white/80 hover:text-white transition-colors z-50"
            >
                <X size={32} />
            </button>

            <div className="bg-background rounded-lg max-w-6xl w-full min-h-[80vh] flex flex-col md:flex-row overflow-hidden shadow-2xl">
                {/* Image Section */}
                <div className={`relative bg-black flex items-center justify-center transition-all duration-300 ${showComments ? 'md:w-1/2' : 'md:w-2/3'}`}>
                    <ProtectedImage
                        src={project.images[currentImageIndex]}
                        alt={`${project.title} - Image ${currentImageIndex + 1}`}
                        className="max-h-[70vh] max-w-full object-contain"
                    />

                    {project.images.length > 1 && (
                        <>
                            <button
                                onClick={handlePrev}
                                className="absolute left-4 text-white/80 hover:text-white bg-black/50 rounded-full p-2"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <button
                                onClick={handleNext}
                                className="absolute right-4 text-white/80 hover:text-white bg-black/50 rounded-full p-2"
                            >
                                <ChevronRight size={24} />
                            </button>
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                {project.images.map((_, idx) => (
                                    <div
                                        key={idx}
                                        className={`w-2 h-2 rounded-full transition-colors ${idx === currentImageIndex ? 'bg-white' : 'bg-white/30'}`}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Info Section */}
                <div className={`flex flex-col p-8 transition-all duration-300 ${showComments ? 'md:w-1/2' : 'md:w-1/3'} bg-background`}>
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        <span className="text-accent text-sm font-medium uppercase tracking-wider">
                            {project.category}
                        </span>
                        <h2 className="text-3xl font-display font-bold mt-2 mb-4">{project.title}</h2>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                            <span>{project.year}</span>
                            {project.client && (
                                <>
                                    <span>•</span>
                                    <span>{project.client}</span>
                                </>
                            )}
                        </div>

                        <p className="text-muted-foreground leading-relaxed mb-8">
                            {project.description}
                        </p>

                        <div className="border-t border-border pt-6">
                            <InteractionBar
                                itemId={project.id}
                                type="design"
                                initialLikes={project.likes_count}
                                initialComments={project.comments_count}
                                initialShares={project.shares_count}
                                onCommentClick={() => setShowComments(!showComments)}
                                variant="light"
                                className="mb-6"
                            />

                            {showComments && (
                                <div className="animate-in slide-in-from-bottom duration-300">
                                    <CommentsSection
                                        itemId={project.id}
                                        type="design"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectModal;
