import { SmartSuggestions } from './components/SmartSuggestions';
import { Card } from '@/components/ui/card';
import { Sparkles, Brain, Zap, Target } from 'lucide-react';

export default function AILabPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-vibrant-purple to-electric-blue">
                        <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-4xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-vibrant-purple to-electric-blue">
                        IA Lab
                    </h1>
                </div>
                <p className="text-muted-foreground text-lg">
                    Inteligência Artificial aplicada ao seu portfólio
                </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card className="p-6 bg-secondary/30 backdrop-blur-md border-white/10 hover:border-vibrant-purple/30 transition-all">
                    <div className="w-12 h-12 rounded-xl bg-vibrant-purple/10 flex items-center justify-center mb-4">
                        <Brain className="w-6 h-6 text-vibrant-purple" />
                    </div>
                    <h3 className="font-bold mb-2">Auto-Tagging</h3>
                    <p className="text-sm text-muted-foreground">
                        Tags automáticas usando TensorFlow.js e MobileNet
                    </p>
                </Card>

                <Card className="p-6 bg-secondary/30 backdrop-blur-md border-white/10 hover:border-electric-blue/30 transition-all">
                    <div className="w-12 h-12 rounded-xl bg-electric-blue/10 flex items-center justify-center mb-4">
                        <Zap className="w-6 h-6 text-electric-blue" />
                    </div>
                    <h3 className="font-bold mb-2">Smart Sort</h3>
                    <p className="text-sm text-muted-foreground">
                        Ordenação baseada em engajamento e qualidade visual
                    </p>
                </Card>

                <Card className="p-6 bg-secondary/30 backdrop-blur-md border-white/10 hover:border-neon-cyan/30 transition-all">
                    <div className="w-12 h-12 rounded-xl bg-neon-cyan/10 flex items-center justify-center mb-4">
                        <Target className="w-6 h-6 text-neon-cyan" />
                    </div>
                    <h3 className="font-bold mb-2">SEO Automático</h3>
                    <p className="text-sm text-muted-foreground">
                        ALT text e descrições geradas automaticamente
                    </p>
                </Card>
            </div>

            {/* Smart Suggestions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SmartSuggestions />

                {/* AI Stats */}
                <Card className="p-6 bg-secondary/30 backdrop-blur-md border-white/10">
                    <h3 className="text-xl font-bold mb-6">Status da IA</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                            <div>
                                <p className="text-sm font-medium mb-1">TensorFlow.js</p>
                                <p className="text-xs text-muted-foreground">Modelo MobileNet carregado</p>
                            </div>
                            <div className="px-3 py-1 rounded-full bg-green-500/20 text-green-500 text-xs font-bold">
                                Ativo
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                            <div>
                                <p className="text-sm font-medium mb-1">Auto-Tagging</p>
                                <p className="text-xs text-muted-foreground">Precisão média: 87%</p>
                            </div>
                            <div className="px-3 py-1 rounded-full bg-green-500/20 text-green-500 text-xs font-bold">
                                Ativo
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                            <div>
                                <p className="text-sm font-medium mb-1">Smart Sort</p>
                                <p className="text-xs text-muted-foreground">Baseado em 1.2k interações</p>
                            </div>
                            <div className="px-3 py-1 rounded-full bg-green-500/20 text-green-500 text-xs font-bold">
                                Ativo
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                            <div>
                                <p className="text-sm font-medium mb-1">Detecção de Duplicatas</p>
                                <p className="text-xs text-muted-foreground">Análise por hash perceptual</p>
                            </div>
                            <div className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-500 text-xs font-bold">
                                Beta
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Coming Soon Features */}
            <Card className="p-6 bg-gradient-to-br from-vibrant-purple/10 to-electric-blue/10 border border-vibrant-purple/20">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-vibrant-purple" />
                    Em Desenvolvimento
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-white/5">
                        <p className="font-medium mb-1">🎨 Análise de Cores</p>
                        <p className="text-sm text-muted-foreground">
                            Paletas automáticas e sugestões de harmonia
                        </p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5">
                        <p className="font-medium mb-1">📊 Predição de Engajamento</p>
                        <p className="text-sm text-muted-foreground">
                            ML para prever performance antes do upload
                        </p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5">
                        <p className="font-medium mb-1">🔍 Busca Semântica</p>
                        <p className="text-sm text-muted-foreground">
                            Embeddings vetoriais para busca inteligente
                        </p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5">
                        <p className="font-medium mb-1">✨ Sugestões de Edição</p>
                        <p className="text-sm text-muted-foreground">
                            IA sugere melhorias de composição e luz
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
}
