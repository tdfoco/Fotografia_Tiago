import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import * as Icons from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    change: string;
    trend: 'up' | 'down';
    icon: string;
    color: 'electric-blue' | 'vibrant-purple' | 'neon-cyan' | 'green-500' | 'yellow-500';
}

const colorClasses = {
    'electric-blue': {
        bg: 'from-electric-blue/5',
        iconBg: 'bg-electric-blue/10',
        iconText: 'text-electric-blue',
        border: 'hover:border-electric-blue/30'
    },
    'vibrant-purple': {
        bg: 'from-vibrant-purple/5',
        iconBg: 'bg-vibrant-purple/10',
        iconText: 'text-vibrant-purple',
        border: 'hover:border-vibrant-purple/30'
    },
    'neon-cyan': {
        bg: 'from-neon-cyan/5',
        iconBg: 'bg-neon-cyan/10',
        iconText: 'text-neon-cyan',
        border: 'hover:border-neon-cyan/30'
    },
    'green-500': {
        bg: 'from-green-500/5',
        iconBg: 'bg-green-500/10',
        iconText: 'text-green-500',
        border: 'hover:border-green-500/30'
    },
    'yellow-500': {
        bg: 'from-yellow-500/5',
        iconBg: 'bg-yellow-500/10',
        iconText: 'text-yellow-500',
        border: 'hover:border-yellow-500/30'
    }
};

export function StatCard({ title, value, change, trend, icon, color }: StatCardProps) {
    const IconComponent = (Icons as any)[icon] as LucideIcon;
    const colors = colorClasses[color];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3 }}
            className="group"
        >
            <Card className={`relative overflow-hidden border-white/10 bg-secondary/30 backdrop-blur-md ${colors.border} transition-all duration-300`}>
                {/* Neon glow effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg} to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />

                <div className="p-6 relative z-10">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-sm text-muted-foreground font-medium">{title}</p>
                        <div className={`p-2 rounded-xl ${colors.iconBg} ${colors.iconText}`}>
                            {IconComponent && <IconComponent className="w-5 h-5" />}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-3xl font-bold tracking-tight">{value}</h3>
                        <div className="flex items-center gap-2">
                            <span className={`text-sm font-medium ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                                {change}
                            </span>
                            <span className="text-xs text-muted-foreground">vs último mês</span>
                        </div>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}
