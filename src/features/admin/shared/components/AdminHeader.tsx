import { Bell, LogOut, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/usePocketBaseData';

export function AdminHeader() {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header className="h-16 border-b border-white/10 bg-secondary/20 backdrop-blur-sm sticky top-0 z-30">
            <div className="h-full px-6 flex items-center justify-between">
                {/* Search */}
                <div className="flex-1 max-w-md">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Buscar fotos, projetos, clientes..."
                            className="pl-10 bg-secondary/50 border-white/10 focus:border-electric-blue/50 focus:ring-electric-blue/20"
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="relative hover:bg-white/5"
                    >
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-vibrant-purple rounded-full animate-pulse" />
                    </Button>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleLogout}
                        className="hover:bg-white/5 gap-2"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Sair</span>
                    </Button>
                </div>
            </div>
        </header>
    );
}
