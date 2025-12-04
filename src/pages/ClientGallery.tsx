import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { pb } from '@/lib/pocketbase';
import { Button } from '@/components/ui/button';
import { Loader2, Download, LogOut, Heart, Check } from 'lucide-react';
import { SEO } from '@/components/SEO';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { toast } from 'sonner';
import { MasonryPhotoGrid } from '@/components/MasonryPhotoGrid';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PrivateGalleryItem {
    id: string;
    title: string;
    images: string[];
    collectionId: string;
    client: string;
    download_enabled: boolean;
}

const ClientGallery = () => {
    const navigate = useNavigate();
    const [gallery, setGallery] = useState<PrivateGalleryItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [favorites, setFavorites] = useState<string[]>([]);
    const [downloading, setDownloading] = useState(false);
    const [activeTab, setActiveTab] = useState("all");

    useEffect(() => {
        if (!pb.authStore.isValid || !pb.authStore.model) {
            navigate('/client');
            return;
        }

        const fetchData = async () => {
            try {
                // 1. Fetch Gallery
                const galleryRecord = await pb.collection('private_galleries').getFirstListItem(`client = "${pb.authStore.model?.id}"`);
                setGallery(galleryRecord as unknown as PrivateGalleryItem);

                // 2. Fetch Favorites
                try {
                    const favRecord = await pb.collection('client_favorites').getFirstListItem(`client = "${pb.authStore.model?.id}" && gallery = "${galleryRecord.id}"`);
                    if (favRecord && favRecord.selected_images) {
                        setFavorites(favRecord.selected_images);
                    }
                } catch (e) {
                    // No favorites yet
                }

            } catch (error) {
                console.error(error);
                toast.error('Nenhuma galeria encontrada para este código.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    const handleLogout = () => {
        pb.authStore.clear();
        navigate('/client');
    };

    const toggleFavorite = async (image: string) => {
        if (!gallery) return;

        const newFavorites = favorites.includes(image)
            ? favorites.filter(i => i !== image)
            : [...favorites, image];

        setFavorites(newFavorites);

        // Debounced save to server could be better, but simple save for now
        try {
            const clientId = pb.authStore.model?.id;

            try {
                // Try to update existing record
                const record = await pb.collection('client_favorites').getFirstListItem(`client = "${clientId}" && gallery = "${gallery.id}"`);
                await pb.collection('client_favorites').update(record.id, {
                    selected_images: newFavorites
                });
            } catch (e) {
                // Create new record
                await pb.collection('client_favorites').create({
                    client: clientId,
                    gallery: gallery.id,
                    selected_images: newFavorites
                });
            }

            if (!favorites.includes(image)) {
                toast.success("Adicionado aos favoritos");
            }
        } catch (error) {
            console.error("Error saving favorites:", error);
            toast.error("Erro ao salvar seleção");
        }
    };

    const downloadFavorites = async () => {
        if (!gallery || favorites.length === 0) return;

        setDownloading(true);
        const zip = new JSZip();
        const folder = zip.folder(`${gallery.title} - Selecionadas`) || zip;

        try {
            const promises = favorites.map(async (image) => {
                const url = pb.files.getUrl(gallery, image);
                const response = await fetch(url);
                const blob = await response.blob();
                folder.file(image, blob);
            });

            await Promise.all(promises);
            const content = await zip.generateAsync({ type: 'blob' });
            saveAs(content, `${gallery.title}_selecionadas.zip`);
            toast.success('Download iniciado!');
        } catch (error) {
            console.error(error);
            toast.error('Erro ao gerar arquivo ZIP.');
        } finally {
            setDownloading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-electric-blue" />
            </div>
        );
    }

    if (!gallery) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background text-white">
                <p className="text-gray-400">Nenhuma galeria encontrada.</p>
                <Button onClick={handleLogout} variant="outline">Sair</Button>
            </div>
        );
    }

    // Prepare photos for Masonry
    const allPhotos = gallery.images.map(img => ({
        id: img,
        title: '',
        url: pb.files.getUrl(gallery, img),
        thumbnail: pb.files.getUrl(gallery, img, { thumb: '500x750' }),
        category: 'Gallery',
        tags: [],
        isFavorite: favorites.includes(img)
    }));

    const favoritePhotos = allPhotos.filter(p => favorites.includes(p.id));

    return (
        <div className="min-h-screen bg-background pb-20">
            <SEO title={gallery.title} description="Galeria Privada" />

            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-white/10 bg-background/80 backdrop-blur-md p-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold font-display text-white">{gallery.title}</h1>
                        <p className="text-xs text-gray-400">{gallery.images.length} fotos</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-2 text-sm text-gray-400 bg-secondary/20 px-3 py-1 rounded-full">
                            <Heart className="h-4 w-4 text-electric-blue fill-electric-blue" />
                            <span>{favorites.length} selecionadas</span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-400 hover:text-white">
                            <LogOut className="h-4 w-4 mr-2" />
                            Sair
                        </Button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto p-4">
                <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                        <TabsList className="bg-secondary/20 border border-white/5">
                            <TabsTrigger value="all">Todas as Fotos</TabsTrigger>
                            <TabsTrigger value="favorites">
                                Minha Seleção ({favorites.length})
                            </TabsTrigger>
                        </TabsList>

                        {activeTab === 'favorites' && favorites.length > 0 && gallery.download_enabled && (
                            <Button
                                onClick={downloadFavorites}
                                disabled={downloading}
                                className="bg-electric-blue hover:bg-electric-blue/80 text-white"
                            >
                                {downloading ? (
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                    <Download className="h-4 w-4 mr-2" />
                                )}
                                Baixar Seleção
                            </Button>
                        )}
                    </div>

                    <TabsContent value="all" className="mt-0">
                        <MasonryPhotoGrid
                            photos={allPhotos}
                            onPhotoClick={() => { }} // Lightbox logic can be added here
                            onLike={(id) => toggleFavorite(id)} // Reusing onLike for Favorite toggle
                        // Custom render for the like button to show filled heart if favorite
                        />
                    </TabsContent>

                    <TabsContent value="favorites" className="mt-0">
                        {favoritePhotos.length === 0 ? (
                            <div className="text-center py-20 text-gray-500">
                                <Heart className="h-12 w-12 mx-auto mb-4 opacity-20" />
                                <p>Você ainda não selecionou nenhuma foto.</p>
                                <Button variant="link" onClick={() => setActiveTab("all")} className="text-electric-blue">
                                    Voltar para a galeria
                                </Button>
                            </div>
                        ) : (
                            <MasonryPhotoGrid
                                photos={favoritePhotos}
                                onPhotoClick={() => { }}
                                onLike={(id) => toggleFavorite(id)}
                            />
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default ClientGallery;
