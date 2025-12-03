import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { pb } from '@/lib/pocketbase';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Download, LogOut, Image as ImageIcon } from 'lucide-react';
import { SEO } from '@/components/SEO';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { toast } from 'sonner';

interface PrivateGalleryItem {
    id: string;
    title: string;
    images: string[];
    collectionId: string;
    client: string;
}

const ClientGallery = () => {
    const navigate = useNavigate();
    const [gallery, setGallery] = useState<PrivateGalleryItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        if (!pb.authStore.isValid || !pb.authStore.model) {
            navigate('/client');
            return;
        }

        const fetchGallery = async () => {
            try {
                // Fetch gallery for the current user
                // Assuming 'client' field in private_galleries matches the auth user id
                const record = await pb.collection('private_galleries').getFirstListItem(`client = "${pb.authStore.model?.id}"`);
                setGallery(record as unknown as PrivateGalleryItem);
            } catch (error) {
                console.error(error);
                toast.error('Nenhuma galeria encontrada para este código.');
            } finally {
                setLoading(false);
            }
        };

        fetchGallery();
    }, [navigate]);

    const handleLogout = () => {
        pb.authStore.clear();
        navigate('/client');
    };

    const toggleSelection = (image: string) => {
        setSelectedImages(prev =>
            prev.includes(image)
                ? prev.filter(i => i !== image)
                : [...prev, image]
        );
    };

    const selectAll = () => {
        if (gallery && selectedImages.length !== gallery.images.length) {
            setSelectedImages(gallery.images);
        } else {
            setSelectedImages([]);
        }
    };

    const downloadSelected = async () => {
        if (!gallery || selectedImages.length === 0) return;

        setDownloading(true);
        const zip = new JSZip();
        const folder = zip.folder(gallery.title) || zip;

        try {
            const promises = selectedImages.map(async (image) => {
                const url = pb.files.getUrl(gallery, image);
                const response = await fetch(url);
                const blob = await response.blob();
                folder.file(image, blob);
            });

            await Promise.all(promises);
            const content = await zip.generateAsync({ type: 'blob' });
            saveAs(content, `${gallery.title}.zip`);
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
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!gallery) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <p className="text-muted-foreground">Nenhuma galeria encontrada.</p>
                <Button onClick={handleLogout} variant="outline">Sair</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-20">
            <SEO title={gallery.title} description="Galeria Privada" />

            {/* Header */}
            <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm p-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold font-display">{gallery.title}</h1>
                        <p className="text-xs text-muted-foreground">{gallery.images.length} fotos</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={handleLogout}>
                            <LogOut className="h-4 w-4 mr-2" />
                            Sair
                        </Button>
                    </div>
                </div>
            </header>

            {/* Toolbar */}
            <div className="max-w-7xl mx-auto p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <Checkbox
                        checked={selectedImages.length === gallery.images.length && gallery.images.length > 0}
                        onCheckedChange={selectAll}
                    />
                    <span className="text-sm">Selecionar Tudo</span>
                </div>
                <Button onClick={downloadSelected} disabled={selectedImages.length === 0 || downloading}>
                    {downloading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                        <Download className="h-4 w-4 mr-2" />
                    )}
                    Baixar ({selectedImages.length})
                </Button>
            </div>

            {/* Grid */}
            <div className="max-w-7xl mx-auto p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {gallery.images.map((image) => (
                    <div
                        key={image}
                        className={`relative group aspect-[2/3] rounded-lg overflow-hidden border-2 transition-all ${selectedImages.includes(image) ? 'border-primary' : 'border-transparent'}`}
                        onClick={() => toggleSelection(image)}
                    >
                        <img
                            src={pb.files.getUrl(gallery, image, { thumb: '500x750' })}
                            alt=""
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                            loading="lazy"
                        />
                        <div className="absolute top-2 left-2">
                            <Checkbox
                                checked={selectedImages.includes(image)}
                                className="bg-background/50 backdrop-blur-sm border-white/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                            />
                        </div>
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors cursor-pointer" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ClientGallery;
