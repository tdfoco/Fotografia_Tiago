import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Upload, Image as ImageIcon, Trash2, Eye, EyeOff } from 'lucide-react';
import { pb } from '@/lib/pocketbase';
import { toast } from 'sonner';

interface HeroImage {
    id: string;
    page: string;
    image: string;
    active: boolean;
    collectionId: string;
    created: string;
}

const PAGES = [
    { value: 'home', label: 'Homepage' },
    { value: 'photography', label: 'Fotografia' },
    { value: 'design', label: 'Design' },
    { value: 'about', label: 'Sobre' },
    { value: 'contact', label: 'Contato' },
];

export default function HeroImagesPage() {
    const [heroes, setHeroes] = useState<HeroImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPage, setSelectedPage] = useState('home');
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchHeroes();
    }, []);

    async function fetchHeroes() {
        try {
            const records = await pb.collection('hero_images').getFullList({
                sort: '-created'
            });
            setHeroes(records);
        } catch (error) {
            console.error('Error fetching heroes:', error);
            toast.error('Erro ao carregar hero images');
        } finally {
            setLoading(false);
        }
    }

    async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('page', selectedPage);
            formData.append('image', file);
            formData.append('active', 'false');

            await pb.collection('hero_images').create(formData);
            toast.success('Hero image enviada com sucesso!');
            fetchHeroes();
        } catch (error) {
            console.error('Error uploading hero:', error);
            toast.error('Erro ao enviar hero image');
        } finally {
            setUploading(false);
        }
    }

    async function handleToggleActive(hero: HeroImage) {
        try {
            // Deactivate all others for the same page
            const samePage = heroes.filter(h => h.page === hero.page && h.id !== hero.id);
            for (const other of samePage) {
                if (other.active) {
                    await pb.collection('hero_images').update(other.id, { active: false });
                }
            }

            // Toggle this one
            await pb.collection('hero_images').update(hero.id, { active: !hero.active });
            toast.success(hero.active ? 'Hero desativada' : 'Hero ativada!');
            fetchHeroes();
        } catch (error) {
            console.error('Error toggling hero:', error);
            toast.error('Erro ao atualizar hero');
        }
    }

    async function handleDelete(hero: HeroImage) {
        if (!confirm('Tem certeza que deseja excluir esta hero image?')) return;

        try {
            await pb.collection('hero_images').delete(hero.id);
            toast.success('Hero image excluída!');
            fetchHeroes();
        } catch (error) {
            console.error('Error deleting hero:', error);
            toast.error('Erro ao excluir hero');
        }
    }

    const getImageUrl = (hero: HeroImage) =>
        `${pb.baseUrl}/api/files/${hero.collectionId}/${hero.id}/${hero.image}`;

    const herosByPage = PAGES.map(page => ({
        ...page,
        heroes: heroes.filter(h => h.page === page.value)
    }));

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-16 h-16 border-4 border-electric-blue/30 border-t-electric-blue rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-display font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-electric-blue to-vibrant-purple">
                    Hero Images
                </h1>
                <p className="text-muted-foreground text-lg">
                    Gerencie as imagens hero de todas as páginas
                </p>
            </div>

            {/* Upload Section */}
            <Card className="p-6 bg-secondary/30 backdrop-blur-md border-white/10">
                <h3 className="text-xl font-bold mb-4">Upload Nova Hero Image</h3>
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="page-select">Página</Label>
                        <Select value={selectedPage} onValueChange={setSelectedPage}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {PAGES.map(page => (
                                    <SelectItem key={page.value} value={page.value}>
                                        {page.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="image-upload">Imagem</Label>
                        <Input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleUpload}
                            disabled={uploading}
                            className="bg-secondary/50 border-white/10"
                        />
                    </div>
                </div>
            </Card>

            {/* Heroes Grid by Page */}
            {herosByPage.map(page => (
                <Card key={page.value} className="p-6 bg-secondary/30 backdrop-blur-md border-white/10">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold">{page.label}</h3>
                        <Badge variant="outline" className="border-electric-blue/30 text-electric-blue">
                            {page.heroes.length} {page.heroes.length === 1 ? 'imagem' : 'imagens'}
                        </Badge>
                    </div>

                    {page.heroes.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>Nenhuma hero image para esta página</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {page.heroes.map(hero => (
                                <div
                                    key={hero.id}
                                    className={`relative rounded-xl overflow-hidden border-2 transition-all ${hero.active
                                            ? 'border-electric-blue shadow-[0_0_20px_rgba(58,139,253,0.3)]'
                                            : 'border-white/10 hover:border-white/20'
                                        }`}
                                >
                                    <img
                                        src={getImageUrl(hero)}
                                        alt={`Hero ${page.label}`}
                                        className="w-full h-48 object-cover"
                                    />

                                    {hero.active && (
                                        <div className="absolute top-2 left-2 px-2 py-1 rounded-full bg-electric-blue text-white text-xs font-bold">
                                            Ativa
                                        </div>
                                    )}

                                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                onClick={() => handleToggleActive(hero)}
                                                className={`flex-1 ${hero.active
                                                        ? 'bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-500'
                                                        : 'bg-electric-blue hover:bg-electric-blue/90'
                                                    }`}
                                            >
                                                {hero.active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => handleDelete(hero)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            ))}
        </div>
    );
}
