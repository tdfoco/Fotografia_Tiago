import { SEO } from '@/components/SEO';
import { useFavorites } from '@/hooks/useFavorites';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Loader2, Image as ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProtectedImage from '@/components/ProtectedImage';

const Favorites = () => {
    const { favorites, loading, isAuthenticated } = useFavorites();

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen pt-20 px-4">
                <SEO
                    title="Favoritos"
                    description="Suas fotografias e projetos favoritos"
                />
                <div className="container mx-auto max-w-2xl text-center py-20">
                    <Heart className="w-16 h-16 mx-auto mb-6 text-gray-400" />
                    <h1 className="text-3xl font-bold mb-4">Favoritos</h1>
                    <p className="text-gray-600 mb-8">
                        Faça login para ver seus favoritos e salvar trabalhos que você adora.
                    </p>
                    <Button asChild>
                        <Link to="/admin">Fazer Login</Link>
                    </Button>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen pt-20 px-4">
                <SEO title="Favoritos" />
                <div className="container mx-auto max-w-7xl">
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        <span className="ml-3 text-lg">Carregando favoritos...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-20 px-4">
            <SEO
                title="Meus Favoritos"
                description="Suas fotografias e projetos favoritos salvos"
            />

            <div className="container mx-auto max-w-7xl py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <Heart className="w-8 h-8 text-red-500 fill-current" />
                        <h1 className="text-4xl font-bold">Meus Favoritos</h1>
                    </div>
                    <p className="text-gray-600">
                        {favorites.length === 0
                            ? 'Você ainda não tem favoritos. Explore as galerias e salve seus trabalhos preferidos!'
                            : `${favorites.length} ${favorites.length === 1 ? 'item salvo' : 'itens salvos'}`
                        }
                    </p>
                </div>

                {/* Empty State */}
                {favorites.length === 0 && (
                    <Card className="border-dashed">
                        <CardContent className="flex flex-col items-center justify-center py-16">
                            <ImageIcon className="w-16 h-16 text-gray-300 mb-4" />
                            <p className="text-gray-500 mb-6">Nenhum favorito ainda</p>
                            <div className="flex gap-4">
                                <Button asChild variant="outline">
                                    <Link to="/photography">Ver Fotografias</Link>
                                </Button>
                                <Button asChild variant="outline">
                                    <Link to="/design">Ver Projetos de Design</Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Favorites Grid */}
                {favorites.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {favorites.map((favorite) => (
                            <Card
                                key={favorite.id}
                                className="group overflow-hidden hover:shadow-lg transition-all duration-300"
                            >
                                <Link
                                    to={favorite.type === 'photography' ? '/photography' : '/design'}
                                    className="block"
                                >
                                    <div className="aspect-square overflow-hidden bg-gray-100">
                                        <ProtectedImage
                                            src={favorite.url}
                                            alt={favorite.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>

                                    <CardContent className="p-4">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-lg truncate mb-1">
                                                    {favorite.title}
                                                </h3>
                                                <p className="text-sm text-gray-500 capitalize">
                                                    {favorite.type === 'photography' ? 'Fotografia' : 'Design Gráfico'}
                                                </p>
                                            </div>
                                            <Heart className="w-5 h-5 text-red-500 fill-current flex-shrink-0" />
                                        </div>

                                        <p className="text-xs text-gray-400 mt-2">
                                            Adicionado em {new Date(favorite.created_at).toLocaleDateString('pt-BR')}
                                        </p>
                                    </CardContent>
                                </Link>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Favorites;
