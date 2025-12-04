import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, Eye, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { pb } from "@/lib/pocketbase";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

interface Post {
    id: string;
    title: string;
    slug: string;
    published: boolean;
    published_at: string;
    views: number;
    category: string;
}

const BlogPage = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const records = await pb.collection('posts').getList(1, 50, {
                sort: '-created',
                expand: 'category'
            });
            setPosts(records.items.map(item => ({
                id: item.id,
                title: item.title,
                slug: item.slug,
                published: item.published,
                published_at: item.published_at,
                views: item.views || 0,
                category: item.expand?.category?.name || 'Sem categoria'
            })));
        } catch (error) {
            console.error("Error fetching posts:", error);
            toast.error("Erro ao carregar posts");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir este post?")) return;
        try {
            await pb.collection('posts').delete(id);
            toast.success("Post excluído com sucesso");
            fetchPosts();
        } catch (error) {
            toast.error("Erro ao excluir post");
        }
    };

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold text-white">Blog</h1>
                    <p className="text-gray-400">Gerencie seus artigos e publicações</p>
                </div>
                <Button
                    onClick={() => navigate("/admin/blog/new")}
                    className="bg-electric-blue hover:bg-electric-blue/80 text-white"
                >
                    <Plus className="mr-2 h-4 w-4" /> Novo Post
                </Button>
            </div>

            {/* Filters */}
            <div className="flex gap-4 bg-secondary/20 p-4 rounded-xl border border-white/5">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        placeholder="Buscar posts..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-black/20 border-white/10 text-white"
                    />
                </div>
            </div>

            {/* Posts List */}
            <div className="grid gap-4">
                {loading ? (
                    <div className="text-center py-12 text-gray-400">Carregando...</div>
                ) : filteredPosts.length === 0 ? (
                    <div className="text-center py-12 text-gray-400 bg-secondary/10 rounded-xl border border-white/5">
                        Nenhum post encontrado.
                    </div>
                ) : (
                    filteredPosts.map((post) => (
                        <div
                            key={post.id}
                            className="flex flex-col md:flex-row items-center justify-between p-4 bg-secondary/10 rounded-xl border border-white/5 hover:border-electric-blue/30 transition-all gap-4"
                        >
                            <div className="flex-1 w-full">
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="font-semibold text-lg text-white">{post.title}</h3>
                                    <span className={`px-2 py-0.5 text-xs rounded-full ${post.published ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                        {post.published ? 'Publicado' : 'Rascunho'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-gray-400">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        {post.published_at ? format(new Date(post.published_at), "dd 'de' MMM, yyyy", { locale: ptBR }) : '-'}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Eye className="h-3 w-3" />
                                        {post.views} visualizações
                                    </span>
                                    <span className="bg-white/5 px-2 py-0.5 rounded text-xs">
                                        {post.category}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => navigate(`/admin/blog/edit/${post.id}`)}
                                    className="text-gray-400 hover:text-electric-blue hover:bg-electric-blue/10"
                                >
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDelete(post.id)}
                                    className="text-gray-400 hover:text-red-500 hover:bg-red-500/10"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default BlogPage;
