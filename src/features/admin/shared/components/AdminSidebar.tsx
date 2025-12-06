import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Camera,
    Palette,
    BarChart3,
    Settings,
    Sparkles,
    Shield,
    FileText,
    MessageSquare,
    Users,
    Image as ImageIcon,
    Menu,
    X,
    List
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavItem {
    to: string;
    icon: typeof LayoutDashboard;
    label: string;
    badge?: number;
}

const navItems: NavItem[] = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/photography', icon: Camera, label: 'Fotografia' },
    { to: '/admin/design', icon: Palette, label: 'Design' },
    { to: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
    { to: '/admin/ai-lab', icon: Sparkles, label: 'IA Lab', badge: 3 },
    { to: '/admin/heroes', icon: ImageIcon, label: 'Hero Images' },
    { to: '/admin/menu', icon: List, label: 'Menu' },
    { to: '/admin/comments', icon: MessageSquare, label: 'Comentários' },
    { to: '/admin/clients', icon: Users, label: 'Clientes' },
    { to: '/admin/content', icon: FileText, label: 'Conteúdo' },
    { to: '/admin/security', icon: Shield, label: 'Segurança' },
    { to: '/admin/settings', icon: Settings, label: 'Configurações' },
];

interface AdminSidebarProps {
    open: boolean;
    onToggle: () => void;
}

export function AdminSidebar({ open, onToggle }: AdminSidebarProps) {
    return (
        <motion.aside
            initial={false}
            animate={{ width: open ? 256 : 80 }}
            className="fixed left-0 top-0 h-screen bg-secondary/30 backdrop-blur-xl border-r border-white/10 z-40"
        >
            <div className="flex flex-col h-full">
                {/* Logo & Toggle */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
                    <AnimatePresence mode="wait">
                        {open && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="flex items-center gap-2"
                            >
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-electric-blue to-vibrant-purple flex items-center justify-center shadow-[0_0_20px_rgba(58,139,253,0.3)]">
                                    <span className="text-white font-bold text-sm">TD</span>
                                </div>
                                <span className="font-display font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-electric-blue to-vibrant-purple">
                                    Admin
                                </span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <Button
                        onClick={onToggle}
                        variant="ghost"
                        size="icon"
                        className="hover:bg-white/5"
                    >
                        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </Button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-4 overflow-y-auto custom-scrollbar">
                    <div className="space-y-1 px-2">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                end={item.to === '/admin'}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 group relative ${isActive
                                        ? 'bg-electric-blue/10 text-electric-blue'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                                    }`
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className="absolute inset-0 bg-electric-blue/10 rounded-xl border border-electric-blue/20 shadow-[0_0_15px_rgba(58,139,253,0.1)]"
                                                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}
                                        <item.icon className="w-5 h-5 relative z-10 flex-shrink-0" />
                                        <AnimatePresence>
                                            {open && (
                                                <motion.span
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: -10 }}
                                                    className="font-medium relative z-10 truncate"
                                                >
                                                    {item.label}
                                                </motion.span>
                                            )}
                                        </AnimatePresence>
                                        {item.badge && open && (
                                            <motion.span
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="ml-auto px-2 py-0.5 text-xs font-bold bg-vibrant-purple text-white rounded-full shadow-[0_0_10px_rgba(124,58,237,0.3)]"
                                            >
                                                {item.badge}
                                            </motion.span>
                                        )}
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </div>
                </nav>

                {/* User Profile */}
                <div className="p-4 border-t border-white/10">
                    <AnimatePresence>
                        {open ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center gap-3"
                            >
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-electric-blue to-vibrant-purple flex items-center justify-center text-white font-bold shadow-[0_0_15px_rgba(58,139,253,0.3)]">
                                    T
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">Tiago</p>
                                    <p className="text-xs text-muted-foreground">Admin</p>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex justify-center"
                            >
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-electric-blue to-vibrant-purple flex items-center justify-center text-white font-bold shadow-[0_0_15px_rgba(58,139,253,0.3)]">
                                    T
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.aside>
    );
}
