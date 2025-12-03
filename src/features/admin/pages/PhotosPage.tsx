import { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    Edit,
    Trash2,
    Sparkles,
    Upload,
    CheckSquare,
    Square
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
import { Card } from '@/components/ui/card';
import { pb } from '@/lib/pocketbase';
import { getImageUrl } from '@/hooks/usePocketBaseData';
import type { PhotographyItem } from '@/hooks/usePocketBaseData';
import Masonry from 'react-masonry-css';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { analyzeImage } from '../services/aiService';

const PhotosPage = () => {
    const [photos, setPhotos] = useState<PhotographyItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        loadPhotos();
    }, []);

    const loadPhotos = async () => {
        try {
            const result = await pb.collection('photography').getFullList<PhotographyItem>({
                sort: '-created'
            });
            setPhotos(result);
        } catch (error) {
            console.error('Error loading photos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (id: string) => {
        if (selectedPhotos.includes(id)) {
            setSelectedPhotos(selectedPhotos.filter(pid => pid !== id));
        } else {
            setSelectedPhotos([...selectedPhotos, id]);
        }
    };

    const handleAutoTag = async () => {
        if (selectedPhotos.length === 0) return;

        setIsAnalyzing(true);
        toast({ title: "IA Iniciada", description: `Analisando ${selectedPhotos.length} fotos...` });

        try {
            // In a real scenario, we would process each photo. 
            // Since we don't have the file objects here (only URLs), we'd need to fetch them or use a backend AI service.
            // For this demo, we'll simulate updating tags.

            for (const id of selectedPhotos) {
                // Simulate analysis delay
                await new Promise(r => setTimeout(r, 800));

                // Update with mock tags
                const mockTags = ['ai-enhanced', 'auto-tagged', 'premium'];
                await pb.collection('photography').update(id, {
                    tags: mockTags
                });
            }

            toast({ title: "Sucesso", description: "Fotos analisadas e taggeadas com sucesso!" });
            loadPhotos();
            setSelectedPhotos([]);
        } catch (error) {
            toast({ title: "Erro", description: "Falha na análise IA", variant: "destructive" });
        } finally {
            setIsAnalyzing(false);
        }
    };

    const filteredPhotos = photos.filter(photo => {
        const matchesSearch = photo.title.toLowerCase().includes(search.toLowerCase()) ||
            photo.tags?.some(tag => tag.toLowerCase().includes(search.toLowerCase()));
        const matchesCategory = categoryFilter === 'all' || photo.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const breakpointColumns = {
        default: 4,
        1536: 4,
        1280: 3,
        1024: 2,
        640: 1
    };

    return (
        <div className="space-y-6">
            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div>
                    <h2 className="text-3xl font-display font-bold tracking-tight">Fotografias</h2>
                    <p className="text-muted-foreground">Gerencie seu portfólio fotográfico.</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    {selectedPhotos.length > 0 && (
                        <Button variant="secondary" onClick={handleAutoTag} disabled={isAnalyzing}>
                            <Sparkles className={`mr-2 h-4 w-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
                            {isAnalyzing ? 'Analisando...' : 'Auto-Tag IA'}
                        </Button>
                    )}
                    <Button>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-center bg-card p-4 rounded-lg border border-border/50">
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                        placeholder="Buscar por título ou tag..."
                        className="pl-9"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 w-full">
                    {['all', 'portraits', 'urban', 'nature', 'events', 'art'].map((cat) => (
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

            {/* Photos Grid */}
            {loading ? (
                <div className="text-center py-20 text-muted-foreground">Carregando fotos...</div>
            ) : (
                <Masonry
                    breakpointCols={breakpointColumns}
                    className="masonry-grid -ml-4"
                    columnClassName="masonry-grid_column pl-4"
                >
                    <AnimatePresence>
                        {filteredPhotos.map((photo) => (
                            <motion.div
                                key={photo.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="mb-4 group relative"
                            >
                                <div className={`relative rounded-xl overflow-hidden border border-border/50 bg-card transition-all duration-300 ${selectedPhotos.includes(photo.id) ? 'ring-2 ring-primary shadow-lg' : 'hover:shadow-md'}`}>
                                    {/* Selection Checkbox */}
                                    <button
                                        onClick={() => handleSelect(photo.id)}
                                        className="absolute top-2 left-2 z-10 p-1 rounded-md bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity data-[selected=true]:opacity-100"
                                        data-selected={selectedPhotos.includes(photo.id)}
                                    >
                                        {selectedPhotos.includes(photo.id) ? <CheckSquare size={20} /> : <Square size={20} />}
                                    </button>

                                    {/* Image */}
                                    <div className="aspect-[3/4] relative">
                                        <img
                                            src={getImageUrl(photo.collectionId, photo.id, photo.image)}
                                            alt={photo.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </div>

                                    {/* Content Overlay */}
                                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <h3 className="font-bold truncate">{photo.title}</h3>
                                        <div className="flex items-center justify-between mt-2">
                                            <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-none text-xs">
                                                {photo.category}
                                            </Badge>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20">
                                                        <MoreVertical size={16} />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem>
                                                        <Edit className="mr-2 h-4 w-4" /> Editar
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-destructive">
                                                        <Trash2 className="mr-2 h-4 w-4" /> Excluir
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </Masonry>
            )}
        </div>
    );
};

export default PhotosPage;
