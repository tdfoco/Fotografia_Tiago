import { motion } from "framer-motion";
import { DesignProject, getImageUrl } from "@/hooks/usePocketBaseData";
import ProtectedImage from "./ProtectedImage";
import InteractionBar from "./InteractionBar";
import FavoriteButton from "./FavoriteButton";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProjectCardProps {
    project: DesignProject;
    onClick: (project: DesignProject) => void;
    index?: number;
}

const ProjectCard = ({ project, onClick, index = 0 }: ProjectCardProps) => {
    const { t } = useLanguage();

    const categories = {
        logos: t('design.categories.logos'),
        visual_identity: t('design.categories.visualIdentity'),
        social_media: t('design.categories.socialMedia'),
        posters: t('design.categories.posters'),
        special: t('design.categories.special')
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="group relative cursor-pointer"
            onClick={() => onClick(project)}
        >
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-secondary transition-all duration-300 group-hover:shadow-[0_0_25px_rgba(58,139,253,0.4)] group-hover:ring-1 group-hover:ring-electric-blue/50">
                <ProtectedImage
                    src={project.images && project.images.length > 0 ? getImageUrl(project.collectionId, project.id, project.images[0]) : ''}
                    alt={project.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 will-change-transform"
                />

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none backdrop-blur-[1px]">
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <p className="text-xs font-medium text-electric-blue uppercase tracking-wider mb-2">
                            {categories[project.category as keyof typeof categories]}
                        </p>
                        <h3 className="text-xl font-display font-bold leading-tight mb-1">
                            {project.title}
                        </h3>
                        {project.client && (
                            <p className="text-sm text-gray-300 font-light">
                                {project.client}
                            </p>
                        )}
                    </div>
                </div>

                {/* Favorite Button - Top Right */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-auto scale-90 group-hover:scale-100">
                    <FavoriteButton
                        itemId={project.id}
                        itemType="design"
                        size="sm"
                        variant="ghost"
                    />
                </div>
            </div>

            {/* Bottom Info (Visible by default, but maybe we hide it if overlay is enough? 
                DesignGrid had it outside. Let's keep it outside for clarity, or integrate it.
                The plan says "Interactive Project Cards (Hover effects)".
                Let's keep a minimal info below for accessibility/clarity, but style it better.) 
            */}
            <div className="mt-4 pl-1">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-lg font-display font-semibold group-hover:text-electric-blue transition-colors duration-300">
                            {project.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-0.5">
                            {categories[project.category as keyof typeof categories]}
                        </p>
                    </div>
                </div>

                <InteractionBar
                    itemId={project.id}
                    type="design"
                    initialLikes={project.likes_count}
                    initialComments={project.comments_count}
                    initialShares={project.shares_count}
                    variant="light"
                    className="mt-3 pt-3 border-t border-border/40"
                />
            </div>
        </motion.div>
    );
};

export default ProjectCard;
