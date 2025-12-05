import { useState } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, X, Tag, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { classifyImage } from '@/lib/ai_classification';
import { toast } from 'sonner';

interface Photo {
    id: string;
    url: string;
    title: string;
    category?: string;
    tags?: string[];
    order?: number;
}

interface DragAndDropGalleryProps {
    photos: Photo[];
    onReorder: (photos: Photo[]) => void;
    onDelete?: (photoId: string) => void;
    onUpdateTags?: (photoId: string, tags: string[]) => void;
    onClassifyWithAI?: (photoId: string) => void;
}

// Sortable Photo Item Component
const SortablePhotoItem = ({
    photo,
    onDelete,
    onClassifyWithAI
}: {
    photo: Photo;
    onDelete?: (id: string) => void;
    onClassifyWithAI?: (id: string) => void;
}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: photo.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`group relative aspect-square rounded-xl overflow-hidden border-2 ${isDragging ? 'border-accent shadow-2xl z-50' : 'border-transparent hover:border-accent/50'
                } transition-all duration-300`}
        >
            {/* Image */}
            <img
                src={photo.url}
                alt={photo.title}
                className="w-full h-full object-cover"
            />

            {/* Overlay Controls */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {/* Drag Handle */}
                <div
                    {...attributes}
                    {...listeners}
                    className="absolute top-2 left-2 p-2 bg-background/80 backdrop-blur-sm rounded-lg cursor-grab active:cursor-grabbing hover:bg-background transition-colors"
                >
                    <GripVertical className="w-4 h-4 text-foreground" />
                </div>

                {/* Delete Button */}
                {onDelete && (
                    <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8"
                        onClick={() => onDelete(photo.id)}
                    >
                        <X className="w-4 h-4" />
                    </Button>
                )}

                {/* AI Classification Button */}
                {onClassifyWithAI && (
                    <Button
                        variant="secondary"
                        size="sm"
                        className="absolute bottom-2 right-2"
                        onClick={() => onClassifyWithAI(photo.id)}
                    >
                        <Sparkles className="w-3 h-3 mr-1" />
                        IA
                    </Button>
                )}

                {/* Photo Info */}
                <div className="absolute bottom-2 left-2 right-16">
                    <p className="text-white text-sm font-medium truncate">
                        {photo.title}
                    </p>
                    {photo.tags && photo.tags.length > 0 && (
                        <div className="flex items-center gap-1 mt-1">
                            <Tag className="w-3 h-3 text-white/70" />
                            <p className="text-white/70 text-xs truncate">
                                {photo.tags.slice(0, 3).join(', ')}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Order Badge */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-accent/90 backdrop-blur-sm rounded-full text-white text-xs font-bold shadow-lg">
                #{photo.order !== undefined ? photo.order + 1 : '?'}
            </div>
        </div>
    );
};

const DragAndDropGallery = ({
    photos: initialPhotos,
    onReorder,
    onDelete,
    onUpdateTags,
    onClassifyWithAI
}: DragAndDropGalleryProps) => {
    const [photos, setPhotos] = useState(
        initialPhotos.map((p, index) => ({ ...p, order: p.order ?? index }))
    );
    const [classifying, setClassifying] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setPhotos((items) => {
                const oldIndex = items.findIndex((i) => i.id === active.id);
                const newIndex = items.findIndex((i) => i.id === over.id);

                const newItems = arrayMove(items, oldIndex, newIndex).map((item, index) => ({
                    ...item,
                    order: index,
                }));

                // Notify parent component
                onReorder(newItems);

                return newItems;
            });

            toast.success('Ordem atualizada!');
        }
    };

    const handleClassifyWithAI = async (photoId: string) => {
        setClassifying(photoId);

        try {
            const photo = photos.find(p => p.id === photoId);
            if (!photo) return;

            // Simular carregamento da imagem para classificação
            const response = await fetch(photo.url);
            const blob = await response.blob();
            const file = new File([blob], photo.title, { type: blob.type });

            const classification = await classifyImage(file);

            // Update tags
            if (onUpdateTags) {
                await onUpdateTags(photoId, classification.tags);
            }

            // Update local state
            setPhotos(prevPhotos =>
                prevPhotos.map(p =>
                    p.id === photoId
                        ? { ...p, tags: classification.tags, category: classification.category }
                        : p
                )
            );

            toast.success(`Classificada como: ${classification.category}`, {
                description: `Tags: ${classification.tags.join(', ')}`
            });

            if (onClassifyWithAI) {
                onClassifyWithAI(photoId);
            }
        } catch (error) {
            console.error('Error classifying image:', error);
            toast.error('Erro ao classificar imagem');
        } finally {
            setClassifying(null);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-2xl font-semibold">Galeria</h3>
                    <p className="text-sm text-muted-foreground">
                        Arraste para reordenar • {photos.length} fotos
                    </p>
                </div>
            </div>

            {/* Grid */}
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={photos.map(p => p.id)}
                    strategy={rectSortingStrategy}
                >
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {photos.map((photo) => (
                            <SortablePhotoItem
                                key={photo.id}
                                photo={photo}
                                onDelete={onDelete}
                                onClassifyWithAI={
                                    classifying === photo.id
                                        ? undefined
                                        : () => handleClassifyWithAI(photo.id)
                                }
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>

            {/* Empty State */}
            {photos.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-muted-foreground text-lg">
                        Nenhuma foto na galeria
                    </p>
                </div>
            )}
        </div>
    );
};

export default DragAndDropGallery;
