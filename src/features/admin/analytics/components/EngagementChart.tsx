import { Card } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface EngagementChartProps {
    data: {
        date: string;
        views: number;
        likes: number;
        shares: number;
    }[];
}

export function EngagementChart({ data }: EngagementChartProps) {
    return (
        <Card className="p-6 bg-secondary/30 backdrop-blur-md border-white/10">
            <h3 className="text-xl font-bold mb-6">Engajamento nos Últimos 30 Dias</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" />
                    <YAxis stroke="rgba(255,255,255,0.5)" />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(18, 18, 18, 0.95)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '8px'
                        }}
                    />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="views"
                        stroke="#3A8BFD"
                        strokeWidth={2}
                        name="Visualizações"
                    />
                    <Line
                        type="monotone"
                        dataKey="likes"
                        stroke="#7C3AED"
                        strokeWidth={2}
                        name="Curtidas"
                    />
                    <Line
                        type="monotone"
                        dataKey="shares"
                        stroke="#00F3FF"
                        strokeWidth={2}
                        name="Compartilhamentos"
                    />
                </LineChart>
            </ResponsiveContainer>
        </Card>
    );
}

interface CategoryChartProps {
    data: {
        category: string;
        engagement: number;
        views: number;
        likes: number;
    }[];
}

const COLORS = ['#3A8BFD', '#7C3AED', '#00F3FF', '#22C55E', '#F59E0B', '#EF4444'];

export function CategoryChart({ data }: CategoryChartProps) {
    return (
        <Card className="p-6 bg-secondary/30 backdrop-blur-md border-white/10">
            <h3 className="text-xl font-bold mb-6">Engajamento por Categoria</h3>
            <div className="grid md:grid-cols-2 gap-6">
                {/* Pie Chart */}
                <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey="views"
                            nameKey="category"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            label={(entry) => entry.category}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(18, 18, 18, 0.95)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '8px'
                            }}
                        />
                    </PieChart>
                </ResponsiveContainer>

                {/* Bar Chart */}
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="category" stroke="rgba(255,255,255,0.5)" />
                        <YAxis stroke="rgba(255,255,255,0.5)" />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(18, 18, 18, 0.95)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '8px'
                            }}
                        />
                        <Bar dataKey="likes" fill="#7C3AED" name="Curtidas" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
}
