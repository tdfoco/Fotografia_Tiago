import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Save, ArrowLeft, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { pb } from "@/lib/pocketbase";
import { toast } from "sonner";
import { getImageUrl } from "@/hooks/usePocketBaseData";

const PostEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = !!id;

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        published: false,
        category: "",
        tags: ""
    });
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [categories, setCategories] = useState<any[]>([]);

    useEffect(() => {
        fetchCategories();
        if (isEditing) {
            fetchPost();
        }
    }, [id]);

    const fetchCategories = async () => {
        try {
            const records = await pb.collection('categories').getFullList();
            setCategories(records);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const fetchPost = async () => {
        try {
            const record = await pb.collection('posts').getOne(id!);
            setFormData({
                title: record.title,
                slug: record.slug,
                excerpt: record.excerpt,
                content: record.content,
                published: record.published,
                category: record.category,
                tags: record.tags ? JSON.stringify(record.tags) : ""
            });
            if (record.cover_image) {
                setPreviewUrl(getImageUrl(record.collectionId, record.id, record.cover_image));
            }
        } catch (error) {
            toast.error("Erro ao carregar post");
            navigate("/admin/blog");
        }
    };

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "");
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        setFormData(prev => ({
            ...prev,
            title,
            slug: !isEditing ? generateSlug(title) : prev.slug
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setCoverImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('slug', formData.slug);
            data.append('excerpt', formData.excerpt);
            data.append('content', formData.content);
            data.append('published', String(formData.published));
            if (formData.published && !isEditing) {
                data.append('published_at', new Date().toISOString());
            }
            if (formData.category) data.append('category', formData.category);
            // Parse tags if needed, for now storing as simple string or array
            // data.append('tags', JSON.stringify(formData.tags.split(',').map(t => t.trim())));

            if (coverImage) {
                data.append('cover_image', coverImage);
            }

            if (isEditing) {
                await pb.collection('posts').update(id!, data);
                toast.success("Post atualizado com sucesso!");
            } else {
                await pb.collection('posts').create(data);
                toast.success("Post criado com sucesso!");
            }
            navigate("/admin/blog");
        } catch (error) {
            console.error(error);
            toast.error("Erro ao salvar post");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => navigate("/admin/blog")}>
                    <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
                </Button>
                <h1 className="text-2xl font-bold text-white">
                    {isEditing ? "Editar Post" : "Novo Post"}
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-6">
                        <div className="space-y-2">
                            <Label>Título</Label>
                            <Input
                                value={formData.title}
                                onChange={handleTitleChange}
                                placeholder="Título do artigo"
                                className="bg-secondary/20 border-white/10 text-lg font-semibold"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Slug (URL)</Label>
                            <Input
                                value={formData.slug}
                                onChange={e => setFormData({ ...formData, slug: e.target.value })}
                                className="bg-secondary/20 border-white/10 font-mono text-sm"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Resumo</Label>
                            <Textarea
                                value={formData.excerpt}
                                onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
                                className="bg-secondary/20 border-white/10 h-24"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Conteúdo (HTML/Markdown)</Label>
                            <Textarea
                                value={formData.content}
                                onChange={e => setFormData({ ...formData, content: e.target.value })}
                                className="bg-secondary/20 border-white/10 h-96 font-mono"
                                placeholder="Escreva seu conteúdo aqui..."
                            />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-secondary/10 p-4 rounded-xl border border-white/5 space-y-4">
                            <h3 className="font-semibold text-white">Publicação</h3>

                            <div className="flex items-center justify-between">
                                <Label>Publicado?</Label>
                                <Switch
                                    checked={formData.published}
                                    onCheckedChange={checked => setFormData({ ...formData, published: checked })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Categoria</Label>
                                <select
                                    className="w-full bg-black/20 border border-white/10 rounded-md p-2 text-white"
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                >
                                    <option value="">Selecione...</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="bg-secondary/10 p-4 rounded-xl border border-white/5 space-y-4">
                            <h3 className="font-semibold text-white">Imagem de Capa</h3>

                            <div
                                className="aspect-video bg-black/40 rounded-lg border-2 border-dashed border-white/10 flex items-center justify-center overflow-hidden relative cursor-pointer hover:border-electric-blue/50 transition-colors"
                                onClick={() => document.getElementById('cover-upload')?.click()}
                            >
                                {previewUrl ? (
                                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-center text-gray-500">
                                        <ImageIcon className="h-8 w-8 mx-auto mb-2" />
                                        <span className="text-sm">Clique para upload</span>
                                    </div>
                                )}
                                <input
                                    id="cover-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageChange}
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-electric-blue hover:bg-electric-blue/80 text-white"
                        >
                            {loading ? "Salvando..." : "Salvar Post"}
                            <Save className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default PostEditor;
