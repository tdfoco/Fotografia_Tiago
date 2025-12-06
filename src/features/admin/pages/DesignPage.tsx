import { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    MoreVertical,
    Edit,
    Trash2,
    Upload,
    Layers,
    Palette
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { pb } from '@/lib/pocketbase';
import { getImageUrl } from '@/hooks/usePocketBaseData';
import type { DesignProject } from '@/hooks/usePocketBaseData';
import { DesignProjectDialog } from '../components/DesignProjectDialog';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

const DesignPage = () => {
    const { toast } = useToast();
    const [projects, setProjects] = useState<DesignProject[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');

    // Dialog State
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<DesignProject | null>(null);

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        try {
            const result = await pb.collection('design_projects').getFullList<DesignProject>({
                sort: '-created'
            });
            setProjects(result);
        } catch (error) {
            console.error('Error loading projects:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setSelectedProject(null);
        setDialogOpen(true);
    };

    const handleEdit = (project: DesignProject) => {
        setSelectedProject(project);
        setDialogOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir este projeto?')) return;

        try {
            await pb.collection('design_projects').delete(id);
            toast({ title: 'Projeto excluído com sucesso' });
            loadProjects();
        } catch (error) {
            console.error('Error deleting project:', error);
            toast({
                title: 'Erro ao excluir',
                variant: 'destructive'
            });
        }
    };

    const filteredProjects = projects.filter(project => {
        const matchesSearch = project.title.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || project.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div>
                    <h2 className="text-3xl font-display font-bold tracking-tight">Projetos de Design</h2>
                    <p className="text-muted-foreground">Gerencie seus projetos de branding e design.</p>
                </div>
                <Button onClick={handleCreate}>
                    <Upload className="mr-2 h-4 w-4" />
                    Novo Projeto
                </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center bg-card p-4 rounded-lg border border-border/50">
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                        placeholder="Buscar projetos..."
                        className="pl-9"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 w-full">
                    {['all', 'branding', 'editorial', 'web', 'packaging'].map((cat) => (
                        <Button
                            key={cat}
                            variant={categoryFilter === cat ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCategoryFilter(cat)}
                            className="capitalize whitespace-nowrap"
                        >
                            {cat}
                        </Button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="text-center py-20 text-muted-foreground">Carregando projetos...</div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <AnimatePresence>
                        {filteredProjects.map((project) => (
                            <motion.div
                                key={project.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                            >
                                <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-border/50 group h-full flex flex-col">
                                    <div className="relative aspect-video overflow-hidden bg-secondary">
                                        {project.images && project.images.length > 0 ? (
                                            <img
                                                src={getImageUrl(project.collectionId, project.id, project.images[0])}
                                                alt={project.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                                <Layers size={48} />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                            <Button variant="secondary" size="sm" onClick={() => handleEdit(project)}>
                                                <Edit className="mr-2 h-4 w-4" /> Editar
                                            </Button>
                                        </div>
                                    </div>
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <Badge variant="outline" className="mb-2 capitalize">
                                                    {project.category}
                                                </Badge>
                                                <CardTitle className="line-clamp-1">{project.title}</CardTitle>
                                                <CardDescription className="line-clamp-1">{project.client || 'Cliente Confidencial'}</CardDescription>
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreVertical size={16} />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => handleEdit(project)}>Editar</DropdownMenuItem>
                                                    <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(project.id)}>Excluir</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="flex-1">
                                        <p className="text-sm text-muted-foreground line-clamp-3">
                                            {project.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            <DesignProjectDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                project={selectedProject}
                onSuccess={loadProjects}
            />
        </div>
    );
};

export default DesignPage;
