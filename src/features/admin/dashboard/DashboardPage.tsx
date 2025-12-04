import { StatCard } from './components/StatCard';
import { useDashboardData } from './hooks/useDashboardData';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Palette, Upload, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
    const { stats, loading } = useDashboardData();
    const navigate = useNavigate();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-16 h-16 border-4 border-electric-blue/30 border-t-electric-blue rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Welcome Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-display font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-electric-blue to-vibrant-purple">
                    Dashboard
                </h1>
                <p className="text-muted-foreground text-lg">
                    Bem-vindo ao painel de controle futurista
                </p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total de Fotos"
                    value={stats.totalPhotos}
                    change="+12%"
                    trend="up"
                    icon="Camera"
                    color="electric-blue"
                />
                <StatCard
                    title="Engajamento"
                    value={`${stats.avgEngagement}%`}
                    change="+5.2%"
                    trend="up"
                    icon="TrendingUp"
                    color="vibrant-purple"
                />
                <StatCard
                    title="Visualizações"
                    value={stats.totalViews.toLocaleString()}
                    change="+18%"
                    trend="up"
                    icon="Eye"
                    color="neon-cyan"
                />
                <StatCard
                    title="Projetos Design"
                    value={stats.totalProjects}
                    change="+3"
                    trend="up"
                    icon="Palette"
                    color="green-500"
                />
            </div>

            {/* Quick Actions */}
            <Card className="p-6 bg-secondary/30 backdrop-blur-md border-white/10">
                <h3 className="text-xl font-bold mb-6">Ações Rápidas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Button
                        onClick={() => navigate('/admin/photography')}
                        className="h-auto flex-col gap-2 py-4 bg-electric-blue/10 hover:bg-electric-blue/20 text-electric-blue border border-electric-blue/20 hover:border-electric-blue/40 shadow-[0_0_15px_rgba(58,139,253,0.1)]"
                        variant="outline"
                    >
                        <Camera className="w-6 h-6" />
                        <span>Nova Foto</span>
                    </Button>

                    <Button
                        onClick={() => navigate('/admin/design')}
                        className="h-auto flex-col gap-2 py-4 bg-vibrant-purple/10 hover:bg-vibrant-purple/20 text-vibrant-purple border border-vibrant-purple/20 hover:border-vibrant-purple/40 shadow-[0_0_15px_rgba(124,58,237,0.1)]"
                        variant="outline"
                    >
                        <Palette className="w-6 h-6" />
                        <span>Novo Projeto</span>
                    </Button>

                    <Button
                        onClick={() => navigate('/admin/heroes')}
                        className="h-auto flex-col gap-2 py-4 bg-neon-cyan/10 hover:bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/20 hover:border-neon-cyan/40 shadow-[0_0_15px_rgba(0,243,255,0.1)]"
                        variant="outline"
                    >
                        <Upload className="w-6 h-6" />
                        <span>Hero Image</span>
                    </Button>

                    <Button
                        onClick={() => navigate('/admin/analytics')}
                        className="h-auto flex-col gap-2 py-4 bg-green-500/10 hover:bg-green-500/20 text-green-500 border border-green-500/20 hover:border-green-500/40 shadow-[0_0_15px_rgba(34,197,94,0.1)]"
                        variant="outline"
                    >
                        <TrendingUp className="w-6 h-6" />
                        <span>Ver Analytics</span>
                    </Button>
                </div>
            </Card>

            {/* Recent Activity Placeholder */}
            <Card className="p-6 bg-secondary/30 backdrop-blur-md border-white/10">
                <h3 className="text-xl font-bold mb-4">Atividade Recente</h3>
                <p className="text-muted-foreground">
                    Em breve: Feed de atividades em tempo real
                </p>
            </Card>
        </div>
    );
}
