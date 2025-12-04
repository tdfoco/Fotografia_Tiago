import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { pb } from "@/lib/pocketbase";
import { getImageUrl } from "@/hooks/usePocketBaseData";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { SEO } from "@/components/SEO";
import { Calendar, ArrowLeft, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Post {
    id: string;
    collectionId: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    cover_image: string;
    published_at: string;
    expand?: {
        category?: {
            name: string;
        }
    }
}

const BlogPost = () => {
    const { slug } = useParams();
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const record = await pb.collection('posts').getFirstListItem<Post>(`slug="${slug}"`, {
                    expand: 'category'
                });
                setPost(record);

                // Increment views
                await pb.collection('posts').update(record.id, {
                    'views+': 1
                });
            } catch (error) {
                console.error("Error fetching post:", error);
            } finally {
                setLoading(false);
            }
        };

        if (slug) fetchPost();
    }, [slug]);

    const handleShare = async () => {
        try {
            await navigator.share({
                title: post?.title,
                text: post?.excerpt,
                url: window.location.href
            });
        } catch (error) {
            await navigator.clipboard.writeText(window.location.href);
            toast.success("Link copiado!");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background pt-32 flex justify-center">
                <div className="w-8 h-8 border-4 border-electric-blue/30 border-t-electric-blue rounded-full animate-spin" />
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen bg-background pt-32 text-center px-4">
                <h1 className="text-2xl text-white mb-4">Artigo não encontrado</h1>
                <Link to="/blog" className="text-electric-blue hover:underline">Voltar para o Blog</Link>
            </div>
        );
    }

    return (
        <article className="min-h-screen bg-background pb-20">
            <SEO
                title={`${post.title} | Blog`}
                description={post.excerpt}
                url={`https://tdfoco.cloud/blog/${post.slug}`}
                image={post.cover_image ? getImageUrl(post.collectionId, post.id, post.cover_image) : undefined}
            />

            {/* Hero Image */}
            <div className="h-[50vh] relative w-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent z-10" />
                {post.cover_image && (
                    <img
                        src={getImageUrl(post.collectionId, post.id, post.cover_image)}
                        alt={post.title}
                        className="w-full h-full object-cover"
                    />
                )}
            </div>

            <div className="container mx-auto px-4 -mt-32 relative z-20">
                <div className="max-w-3xl mx-auto">
                    <Link
                        to="/blog"
                        className="inline-flex items-center text-gray-300 hover:text-white mb-8 transition-colors bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para o Blog
                    </Link>

                    <div className="space-y-6 mb-12">
                        <div className="flex items-center gap-4 text-sm text-gray-300">
                            <span className="bg-electric-blue/20 text-electric-blue px-3 py-1 rounded-full border border-electric-blue/20">
                                {post.expand?.category?.name || 'Geral'}
                            </span>
                            <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {format(new Date(post.published_at), "dd 'de' MMMM, yyyy", { locale: ptBR })}
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-display font-bold text-white leading-tight">
                            {post.title}
                        </h1>

                        <p className="text-xl text-gray-300 font-light leading-relaxed">
                            {post.excerpt}
                        </p>
                    </div>

                    <div
                        className="prose prose-invert prose-lg max-w-none prose-headings:font-display prose-a:text-electric-blue prose-img:rounded-xl"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    <div className="mt-16 pt-8 border-t border-white/10 flex justify-between items-center">
                        <div className="text-gray-400">
                            Gostou deste artigo?
                        </div>
                        <Button
                            variant="outline"
                            className="gap-2 border-white/10 hover:bg-white/5"
                            onClick={handleShare}
                        >
                            <Share2 className="h-4 w-4" /> Compartilhar
                        </Button>
                    </div>
                </div>
            </div>
        </article>
    );
};

export default BlogPost;
