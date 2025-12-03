import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Image,
    Palette,
    Users,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/usePocketBaseData';

const Sidebar = () => {
    const [collapsed, setCollapsed] = useState(false);
    const { signOut } = useAuth();

    const links = [
        { icon: LayoutDashboard, label: 'Dashboard', to: '/admin/dashboard' },
        { icon: Image, label: 'Fotografia', to: '/admin/photos' },
        { icon: Palette, label: 'Design', to: '/admin/design' },
        { icon: Users, label: 'Clientes', to: '/admin/clients' },
        { icon: Sparkles, label: 'Assistente IA', to: '/admin/ai' },
        { icon: Settings, label: 'Configurações', to: '/admin/settings' },
    ];

    return (
        <motion.aside
            initial={{ width: 240 }}
            animate={{ width: collapsed ? 80 : 240 }}
            className="h-screen bg-card border-r border-border sticky top-0 flex flex-col z-40 shadow-xl"
        >
            {/* Header */}
            <div className="p-4 flex items-center justify-between border-b border-border/50">
                <AnimatePresence mode="wait">
                    {!collapsed && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-2 overflow-hidden"
                        >
                            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold font-display">
                                TD
                            </div>
                            <span className="font-display font-bold text-lg whitespace-nowrap">Admin</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCollapsed(!collapsed)}
                    className="ml-auto"
                >
                    {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </Button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-2 space-y-1 overflow-y-auto py-4">
                {links.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        className={({ isActive }) => cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
                            isActive
                                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                        )}
                    >
                        <link.icon size={20} strokeWidth={1.5} className={cn("shrink-0", collapsed && "mx-auto")} />

                        {!collapsed && (
                            <motion.span
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="font-medium truncate"
                            >
                                {link.label}
                            </motion.span>
                        )}

                        {/* Tooltip for collapsed state */}
                        {collapsed && (
                            <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                                {link.label}
                            </div>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-border/50">
                <Button
                    variant="ghost"
                    className={cn(
                        "w-full flex items-center gap-2 text-destructive hover:text-destructive hover:bg-destructive/10",
                        collapsed ? "justify-center px-0" : "justify-start"
                    )}
                    onClick={() => signOut()}
                >
                    <LogOut size={20} />
                    {!collapsed && <span>Sair</span>}
                </Button>
            </div>
        </motion.aside>
    );
};

export default Sidebar;
