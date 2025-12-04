import { useEngagementMetrics } from './hooks/useEngagementMetrics';
import { EngagementChart, CategoryChart } from './components/EngagementChart';
import { TopPhotos } from './components/TopPhotos';
import { StatCard } from '../dashboard/components/StatCard';
import { TrendingUp, Eye, Heart, Share2 } from 'lucide-react';

export default function AnalyticsPage() {
    const { metrics, loading } = useEngagementMetrics();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-16 h-16 border-4 border-electric-blue/30 border-t-electric-blue rounded-full animate-spin" />
            </div>
        );
    }

    if (!metrics) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">Erro ao carregar métricas</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-display font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-electric-blue to-vibrant-purple">
                    Analytics
                </h1>
                <p className="text-muted-foreground text-lg">
                    Métricas detalhadas e insights de engajamento
                </p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total de Visualizações"
                    value={metrics.totalViews.toLocaleString()}
                    change="+18%"
                    trend="up"
                    icon="Eye"
                    color="electric-blue"
                />
                <StatCard
                    title="Total de Curtidas"
                    value={metrics.totalLikes.toLocaleString()}
                    change="+12%"
                    trend="up"
                    icon="Heart"
                    color="vibrant-purple"
                />
                <StatCard
                    title="Compartilhamentos"
                    value={metrics.totalShares.toLocaleString()}
                    change="+25%"
                    trend="up"
                    icon="Share2"
                    color="neon-cyan"
                />
                <StatCard
                    title="Taxa de Engajamento"
                    value={`${Math.round((metrics.totalLikes / metrics.totalViews) * 100)}%`}
                    change="+3.2%"
                    trend="up"
                    icon="TrendingUp"
                    color="green-500"
                />
            </div>

            {/* Timeline Chart */}
            <EngagementChart data={metrics.timeline} />

            {/* Category Analysis + Top Photos */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <CategoryChart data={metrics.byCategory} />
                </div>
                <div>
                    <TopPhotos photos={metrics.topPhotos} />
                </div>
            </div>

            {/* Category Breakdown Table */}
            <div className="bg-secondary/30 backdrop-blur-md border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-6">Breakdown por Categoria</h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Categoria</th>
                                <th className="text-right py-3 px-4 font-medium text-muted-foreground">Visualizações</th>
                                <th className="text-right py-3 px-4 font-medium text-muted-foreground">Curtidas</th>
                                <th className="text-right py-3 px-4 font-medium text-muted-foreground">Engajamento</th>
                            </tr>
                        </thead>
                        <tbody>
                            {metrics.byCategory.map((cat) => (
                                <tr key={cat.category} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="py-3 px-4 font-medium">{cat.category}</td>
                                    <td className="py-3 px-4 text-right text-muted-foreground">{cat.views.toLocaleString()}</td>
                                    <td className="py-3 px-4 text-right text-muted-foreground">{cat.likes.toLocaleString()}</td>
                                    <td className="py-3 px-4 text-right">
                                        <span className="px-3 py-1 rounded-full bg-electric-blue/10 text-electric-blue text-sm font-medium">
                                            {cat.engagement}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
