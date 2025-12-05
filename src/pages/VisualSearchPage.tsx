import { useState, useRef } from 'react';
import { Upload, Search, X, Image as ImageIcon, Palette, Filter } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { classifyImage, ColorInfo } from '@/lib/ai_classification';
import { pb } from '@/lib/pocketbase';
import { getImageUrl } from '@/hooks/usePocketBaseData';

interface SearchResult {
    id: string;
    file: string;
    title: string;
    category?: string;
    similarity: number;
}

const VisualSearchPage = () => {
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [dominantColors, setDominantColors] = useState<ColorInfo[]>([]);
    const [category, setCategory] = useState<string>('');
    const [colorFilter, setColorFilter] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Preview da imagem
        const reader = new FileReader();
        reader.onload = (event) => {
            setUploadedImage(event.target?.result as string);
        };
        reader.readAsDataURL(file);

        setUploadedFile(file);

        // Analisar imagem automaticamente
        await analyzeImage(file);
    };

    const analyzeImage = async (file: File) => {
        setAnalyzing(true);
        try {
            const classification = await classifyImage(file);

            setDominantColors(classification.dominantColors);
            setCategory(classification.category);

            // Buscar fotos similares
            await searchSimilarPhotos(classification.category, classification.dominantColors);
        } catch (error) {
            console.error('Error analyzing image:', error);
        } finally {
            setAnalyzing(false);
        }
    };

    const searchSimilarPhotos = async (category: string, colors: ColorInfo[]) => {
        try {
            // Buscar fotos da mesma categoria ou com cores similares
            let filter = '';

            if (colorFilter) {
                filter = `category="${category}" || tags~"${colorFilter}"`;
            } else if (category) {
                filter = `category="${category}"`;
            }

            const records = await pb.collection('photography_photos').getList(1, 20, {
                filter: filter || undefined,
                sort: '-created'
            });

            // Calcular similaridade baseado em cores (simplificado)
            const results: SearchResult[] = records.items.map((item: any) => {
                let similarity = 0.5; // Base

                // Aumentar similaridade se mesma categoria
                if (item.category === category) {
                    similarity += 0.3;
                }

                // Aumentar similaridade baseado em tags
                if (item.tags && Array.isArray(item.tags)) {
                    const colorNames = colors.map(c => c.name.toLowerCase());
                    const commonTags = item.tags.filter((tag: string) =>
                        colorNames.some(color => tag.toLowerCase().includes(color))
                    );
                    similarity += commonTags.length * 0.1;
                }

                return {
                    id: item.id,
                    file: item.file,
                    title: item.title || 'Sem título',
                    category: item.category,
                    similarity: Math.min(similarity, 1.0)
                };
            });

            // Ordenar por similaridade
            results.sort((a, b) => b.similarity - a.similarity);
            setSearchResults(results);
        } catch (error) {
            console.error('Error searching similar photos:', error);
        }
    };

    const clearSearch = () => {
        setUploadedImage(null);
        setUploadedFile(null);
        setSearchResults([]);
        setDominantColors([]);
        setCategory('');
        setColorFilter(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const filterByColor = (colorName: string) => {
        if (colorFilter === colorName) {
            setColorFilter(null);
        } else {
            setColorFilter(colorName);
        }

        if (uploadedFile) {
            searchSimilarPhotos(category, dominantColors);
        }
    };

    return (
        <>
            <SEO
                title="Busca Visual - Encontre Fotos Similares"
                description="Use IA para encontrar fotos similares baseado em cores, composição e estilo visual."
                url="https://tdfoco.cloud/visual-search"
            />
            <main className="min-h-screen pt-20 bg-background">
                {/* Hero Section */}
                <section className="relative py-32 px-4 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary/20 to-background z-0" />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-accent/10 blur-[120px] rounded-full pointer-events-none" />

                    <div className="relative z-10 max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent/10 mb-8">
                            <Search className="w-10 h-10 text-accent" />
                        </div>
                        <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-8 animate-fade-in bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                            Busca Visual
                        </h1>
                        <div className="w-32 h-1.5 bg-gradient-to-r from-accent to-purple-500 mx-auto mb-10 rounded-full shadow-[0_0_20px_rgba(0,163,255,0.5)]" />
                        <p className="text-xl md:text-2xl text-muted-foreground font-light leading-relaxed max-w-2xl mx-auto">
                            Encontre fotos similares usando inteligência artificial
                        </p>
                    </div>
                </section>

                {/* Upload Section */}
                <section className="py-12 px-4 md:px-8">
                    <div className="max-w-4xl mx-auto">
                        {!uploadedImage ? (
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="relative p-16 rounded-2xl border-2 border-dashed border-white/20 hover:border-accent/50 transition-all duration-300 cursor-pointer group bg-secondary/20 backdrop-blur-sm"
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />
                                <div className="text-center">
                                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-accent/10 mb-6 group-hover:scale-110 transition-transform">
                                        <Upload className="w-12 h-12 text-accent" />
                                    </div>
                                    <h3 className="text-2xl font-display font-semibold mb-3">
                                        Envie uma Imagem
                                    </h3>
                                    <p className="text-muted-foreground mb-6">
                                        Faça upload de uma foto para encontrar imagens similares
                                    </p>
                                    <Button className="bg-gradient-to-r from-accent to-purple-600">
                                        Escolher Arquivo
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                {/* Uploaded Image Preview */}
                                <div className="relative rounded-2xl overflow-hidden bg-secondary/30 p-4">
                                    <Button
                                        onClick={clearSearch}
                                        variant="ghost"
                                        size="icon"
                                        className="absolute top-6 right-6 z-10 bg-background/80 backdrop-blur-sm hover:bg-background"
                                    >
                                        <X className="w-5 h-5" />
                                    </Button>
                                    <img
                                        src={uploadedImage}
                                        alt="Uploaded"
                                        className="w-full max-h-96 object-contain rounded-xl"
                                    />
                                </div>

                                {/* Analysis Results */}
                                {analyzing ? (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 border-4 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-4" />
                                        <p className="text-muted-foreground">Analisando imagem...</p>
                                    </div>
                                ) : (
                                    <>
                                        {/* Dominant Colors */}
                                        {dominantColors.length > 0 && (
                                            <div className="p-6 rounded-2xl bg-secondary/30 backdrop-blur-sm border border-white/10">
                                                <div className="flex items-center gap-2 mb-4">
                                                    <Palette className="w-5 h-5 text-accent" />
                                                    <h3 className="font-semibold">Cores Dominantes</h3>
                                                </div>
                                                <div className="flex flex-wrap gap-4">
                                                    {dominantColors.map((color, index) => (
                                                        <button
                                                            key={index}
                                                            onClick={() => filterByColor(color.name)}
                                                            className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${colorFilter === color.name
                                                                    ? 'bg-accent/20 border-2 border-accent'
                                                                    : 'bg-background/40 border-2 border-white/10 hover:border-white/20'
                                                                }`}
                                                        >
                                                            <div
                                                                className="w-10 h-10 rounded-lg border-2 border-white/20"
                                                                style={{ backgroundColor: color.hex }}
                                                            />
                                                            <div className="text-left">
                                                                <div className="font-medium text-sm">{color.name}</div>
                                                                <div className="text-xs text-muted-foreground">
                                                                    {color.percentage.toFixed(1)}%
                                                                </div>
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Category */}
                                        {category && (
                                            <div className="p-6 rounded-2xl bg-secondary/30 backdrop-blur-sm border border-white/10">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Filter className="w-5 h-5 text-accent" />
                                                    <h3 className="font-semibold">Categoria Detectada</h3>
                                                </div>
                                                <p className="text-xl font-display text-accent">{category}</p>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </section>

                {/* Search Results */}
                {searchResults.length > 0 && (
                    <section className="py-12 px-4 md:px-8 bg-secondary/10">
                        <div className="max-w-7xl mx-auto">
                            <h2 className="text-3xl font-display font-bold mb-8">
                                Fotos Similares ({searchResults.length})
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {searchResults.map((result, index) => (
                                    <div
                                        key={result.id}
                                        className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer animate-fade-in"
                                        style={{ animationDelay: `${index * 50}ms` }}
                                    >
                                        <img
                                            src={getImageUrl('photography_photos', result.id, result.file)}
                                            alt={result.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className="absolute bottom-4 left-4 right-4">
                                                <p className="text-white font-medium truncate mb-1">
                                                    {result.title}
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-accent rounded-full"
                                                            style={{ width: `${result.similarity * 100}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs text-white/80">
                                                        {(result.similarity * 100).toFixed(0)}%
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Empty State */}
                {uploadedImage && !analyzing && searchResults.length === 0 && (
                    <section className="py-20 px-4 md:px-8">
                        <div className="max-w-md mx-auto text-center">
                            <ImageIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
                            <h3 className="text-xl font-semibold mb-2">Nenhuma foto similar encontrada</h3>
                            <p className="text-muted-foreground">
                                Tente fazer upload de uma imagem diferente ou ajustar os filtros
                            </p>
                        </div>
                    </section>
                )}
            </main>
        </>
    );
};

export default VisualSearchPage;
