import { Eye, Image as ImageIcon, HardDrive, TrendingUp, Camera } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, XAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import StatsCard from '../components/StatsCard';
import { Button } from '@/components/ui/button';
import { useDashboardData } from '../hooks/useDashboardData';

const data = [
    { date: 'Jan', views: 400, photos: 24 },
    { date: 'Feb', views: 300, photos: 13 },
    { date: 'Mar', views: 550, photos: 38 },
    { date: 'Apr', views: 450, photos: 20 },
    { date: 'May', views: 600, photos: 45 },
    { date: 'Jun', views: 750, photos: 50 },
];

const chartConfig = {
    views: {
        label: "Visualizações",
        color: "hsl(var(--primary))",
    },
    photos: {
        label: "Fotos",
        color: "hsl(var(--secondary))",
    },
};

const DashboardPage = () => {
    const { stats, loading, error } = useDashboardData();

    if (error) {
        return (
            <div className="p-6 text-red-500">
                <h2 className="text-2xl font-bold mb-4">Erro</h2>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-display font-bold tracking-tight">Dashboard</h2>
                    <p className="text-muted-foreground">Visão geral do seu portfólio e métricas.</p>
                </div>
                <Button>
                    <Camera className="mr-2 h-4 w-4" />
                    Novo Upload
                </Button>
            </div>

            {/* Metrics Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Total de Visualizações"
                    value={stats.totalViews.toLocaleString()}
                    icon={Eye}
                    trend={{ value: 12, label: "vs mês anterior" }}
                    loading={loading}
                />
                <StatsCard
                    title="Fotos Publicadas"
                    value={stats.totalPhotos.toString()}
                    icon={ImageIcon}
                    trend={{ value: 4, label: "novas este mês" }}
                    loading={loading}
                />
                <StatsCard
                    title="Projetos"
                    value={stats.totalProjects.toString()}
                    icon={HardDrive}
                    description="Projetos de Design"
                    loading={loading}
                />
                <StatsCard
                    title="Engajamento"
                    value={`${stats.avgEngagement}%`}
                    icon={TrendingUp}
                    trend={{ value: -2, label: "vs mês anterior" }}
                    loading={loading}
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Main Chart */}
                <Card className="col-span-4 border-border/50">
                    <CardHeader>
                        <CardTitle>Atividade do Portfólio</CardTitle>
                        <CardDescription>Visualizações e uploads nos últimos 6 meses</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <ChartContainer config={chartConfig} className="h-[300px] w-full">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="fillViews" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--color-views)" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="var(--color-views)" stopOpacity={0.1} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                <XAxis
                                    dataKey="date"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                    stroke="hsl(var(--muted-foreground))"
                                />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Area
                                    type="monotone"
                                    dataKey="views"
                                    stroke="var(--color-views)"
                                    fillOpacity={1}
                                    fill="url(#fillViews)"
                                />
                            </AreaChart>
                        </ChartContainer>
                    </CardContent>
                </Card>

                {/* AI Insights / Recent Activity */}
                <Card className="col-span-3 border-border/50 bg-secondary/10">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-primary" />
                            Insights da IA
                        </CardTitle>
                        <CardDescription>Análise do seu estilo fotográfico</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="p-4 bg-background rounded-lg border border-border/50">
                                <p className="text-sm font-medium mb-1">Estilo Predominante</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-2xl font-bold text-primary">Urbano</span>
                                    <span className="text-sm text-muted-foreground">65% das fotos</span>
                                </div>
                                <div className="w-full bg-secondary h-2 rounded-full mt-2 overflow-hidden">
                                    <div className="bg-primary h-full rounded-full" style={{ width: '65%' }} />
                                </div>
                            </div>

                            <div className="p-4 bg-background rounded-lg border border-border/50">
                                <p className="text-sm font-medium mb-1">Melhor Horário para Postar</p>
                                <div className="flex items-center gap-2">
                                    <span className="text-xl font-bold">18:00 - 20:00</span>
                                    <span className="text-xs px-2 py-1 bg-green-500/10 text-green-500 rounded-full">Alta Visibilidade</span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">Baseado no engajamento histórico.</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default DashboardPage;
