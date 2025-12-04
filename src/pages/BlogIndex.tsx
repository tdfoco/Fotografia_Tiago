import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { pb } from "@/lib/pocketbase";
import { getImageUrl } from "@/hooks/usePocketBaseData";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { SEO } from "@/components/SEO";
import { Calendar, Clock, ArrowRight } from "lucide-react";

interface Post {
    id: string;
    collectionId: string;
    title: string;
    slug: string;
    excerpt: string;
    cover_image: string;
    published_at: string;
    category: string;
    expand?: {
        category?: {
            name: string;
        }
    }
}

const BlogIndex = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const records = await pb.collection('posts').getList<Post>(1, 20, {
                    sort: '-published_at',
                    filter: 'published = true',
                    expand: 'category'
                });
                setPosts(records.items);
            } catch (error) {
                console.error("Error fetching posts:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    return (
        <div className="min-h-screen bg-background pt-24 pb-20">
            <SEO
                title="Blog | Tiago Damasceno"
                description="Artigos sobre fotografia, design e tecnologia."
                url="https://tdfoco.cloud/blog"
            />

            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400">
                        Blog
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light">
                        Insights sobre fotografia, design e o processo criativo.
                    </p>
                </div>

                {loading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="animate-pulse bg-secondary/10 rounded-xl h-96" />
                        ))}
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                        <p>Nenhum artigo publicado ainda.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map(post => (
                            <Link
                                key={post.id}
                                to={`/blog/${post.slug}`}
                                className="group bg-secondary/5 border border-white/5 rounded-xl overflow-hidden hover:border-electric-blue/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(58,139,253,0.1)]"
                            >
                                <div className="aspect-video overflow-hidden relative">
                                    {post.cover_image ? (
                                        <img
                                            src={getImageUrl(post.collectionId, post.id, post.cover_image)}
                                            alt={post.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black" />
                                    )}
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-black/60 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full border border-white/10">
                                            {post.expand?.category?.name || 'Geral'}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-6 space-y-4">
                                    <div className="flex items-center gap-4 text-xs text-gray-400">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            {format(new Date(post.published_at), "dd MMM yyyy", { locale: ptBR })}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            5 min leitura
                                        </span>
                                    </div>

                                    <h2 className="text-xl font-bold text-white group-hover:text-electric-blue transition-colors line-clamp-2">
                                        {post.title}
                                    </h2>

                                    <p className="text-gray-400 text-sm line-clamp-3">
                                        {post.excerpt}
                                    </p>

                                    <div className="pt-4 flex items-center text-electric-blue text-sm font-medium group-hover:translate-x-2 transition-transform">
                                        Ler artigo <ArrowRight className="ml-2 h-4 w-4" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlogIndex;
