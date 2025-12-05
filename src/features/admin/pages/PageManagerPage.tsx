/**
 * Page Manager Page - Admin
 * Gerenciador visual de páginas do site
 */

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
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
    GripVertical,
    Eye,
    EyeOff,
    Lock,
    Home,
    Camera,
    Palette,
    User,
    Briefcase,
    Film,
    MessageSquare,
    Search,
    Trophy,
    Mail
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { usePages, useTogglePageStatus, useReorderPages, type Page } from '@/hooks/usePageVisibility';
import { Skeleton } from '@/components/ui/skeleton';

// Icon mapping
const iconMap: Record<string, any> = {
    Home,
    Camera,
    Palette,
    User,
    Briefcase,
    Film,
    MessageSquare,
    Search,
    Trophy,
    Mail
};

// Sortable Page Card Component
const SortablePageCard = ({
    page,
    onToggle,
    isToggling
}: {
    page: Page;
    onToggle: (id: string, status: boolean) => void;
    isToggling: boolean;
}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: page.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const IconComponent = page.icon ? iconMap[page.icon] : null;

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`${isDragging ? 'z-50' : ''}`}
        >
            <Card className={`p-4 hover:shadow-md transition-shadow ${!page.is_active ? 'opacity-60' : ''}`}>
                <div className="flex items-center justify-between gap-4">
                    {/* Drag Handle + Icon + Name */}
                    <div className="flex items-center gap-4 flex-1">
                        <div
                            {...attributes}
                            {...listeners}
                            className="cursor-grab active:cursor-grabbing p-2 hover:bg-secondary rounded-lg transition-colors"
                        >
                            <GripVertical className="w-5 h-5 text-muted-foreground" />
                        </div>

                        {IconComponent && (
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <IconComponent className="w-5 h-5 text-primary" />
                            </div>
                        )}

                        <div className="flex-1">
                            <h3 className="font-semibold text-base">{page.page_name}</h3>
                            <p className="text-sm text-muted-foreground">{page.page_path}</p>
                        </div>
                    </div>

                    {/* Status + Toggle */}
                    <div className="flex items-center gap-4">
                        {/* Status Icon */}
                        {page.is_active ? (
                            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                                <Eye className="w-4 h-4" />
                                <span className="text-sm font-medium">Ativo</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <EyeOff className="w-4 h-4" />
                                <span className="text-sm font-medium">Inativo</span>
                            </div>
                        )}

                        {/* Toggle Switch */}
                        {page.is_system ? (
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Lock className="w-4 h-4" />
                                <span className="text-xs">Sistema</span>
                            </div>
                        ) : (
                            <Switch
                                checked={page.is_active}
                                onCheckedChange={(checked) => onToggle(page.id, checked)}
                                disabled={isToggling}
                            />
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );
};

const PageManagerPage = () => {
    const { data: pages, isLoading } = usePages();
    const toggleMutation = useTogglePageStatus();
    const reorderMutation = useReorderPages();
    const [localPages, setLocalPages] = useState<Page[]>([]);

    // Sync with fetched data
    useState(() => {
        if (pages) {
            setLocalPages(pages);
        }
    });

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
            const oldIndex = localPages.findIndex((p) => p.id === active.id);
            const newIndex = localPages.findIndex((p) => p.id === over.id);

            const newPages = arrayMove(localPages, oldIndex, newIndex);
            setLocalPages(newPages);

            // Save to backend
            reorderMutation.mutate(newPages);
        }
    };

    const handleToggle = (pageId: string, isActive: boolean) => {
        toggleMutation.mutate({ pageId, isActive });
    };

    const activeCount = localPages.filter(p => p.is_active).length;
    const systemCount = localPages.filter(p => p.is_system).length;

    if (isLoading) {
        return (
            <div className="p-6 space-y-4">
                <Skeleton className="h-12 w-1/3" />
                <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map(i => (
                        <Skeleton key={i} className="h-20 w-full" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold mb-2">Gerenciador de Páginas</h1>
                <p className="text-muted-foreground">
                    Controle quais páginas aparecem no menu de navegação e sua ordem
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-primary/10 rounded-lg">
                            <Eye className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{activeCount}</p>
                            <p className="text-sm text-muted-foreground">Páginas Ativas</p>
                        </div>
                    </div>
                </Card>

                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-secondary rounded-lg">
                            <EyeOff className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{localPages.length - activeCount}</p>
                            <p className="text-sm text-muted-foreground">Páginas Inativas</p>
                        </div>
                    </div>
                </Card>

                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-amber-500/10 rounded-lg">
                            <Lock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{systemCount}</p>
                            <p className="text-sm text-muted-foreground">Páginas do Sistema</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Instructions */}
            <Card className="p-4 bg-blue-500/5 border-blue-500/20">
                <div className="flex gap-3">
                    <div className="text-blue-600 dark:text-blue-400">
                        <svg className="w-5 h-5 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="text-sm">
                        <p className="font-medium mb-1">Como usar:</p>
                        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                            <li>Arraste as páginas para reordenar</li>
                            <li>Use o toggle para ativar/desativar páginas</li>
                            <li>Páginas do sistema (Home, Contato) não podem ser desativadas</li>
                        </ul>
                    </div>
                </div>
            </Card>

            {/* Pages List */}
            <div className="space-y-3">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={localPages.map(p => p.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        {localPages.map((page) => (
                            <SortablePageCard
                                key={page.id}
                                page={page}
                                onToggle={handleToggle}
                                isToggling={toggleMutation.isPending}
                            />
                        ))}
                    </SortableContext>
                </DndContext>
            </div>
        </div>
    );
};

export default PageManagerPage;
