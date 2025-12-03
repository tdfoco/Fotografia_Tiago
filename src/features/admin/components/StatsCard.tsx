import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    description?: string;
    trend?: {
        value: number;
        label: string;
    };
    loading?: boolean;
    className?: string;
}

const StatsCard = ({ title, value, icon: Icon, description, trend, loading, className }: StatsCardProps) => {
    return (
        <Card className={cn("hover:shadow-lg transition-all duration-300 border-border/50", className)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {title}
                </CardTitle>
                <div className="p-2 bg-primary/10 rounded-full">
                    <Icon className="h-4 w-4 text-primary" />
                </div>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="h-8 w-24 bg-secondary animate-pulse rounded" />
                ) : (
                    <>
                        <div className="text-2xl font-bold font-display">{value}</div>
                        {(description || trend) && (
                            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                {trend && (
                                    <span className={cn(
                                        "font-medium",
                                        trend.value > 0 ? "text-green-500" : "text-red-500"
                                    )}>
                                        {trend.value > 0 ? '+' : ''}{trend.value}%
                                    </span>
                                )}
                                <span>{trend ? trend.label : description}</span>
                            </p>
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    );
};

export default StatsCard;
