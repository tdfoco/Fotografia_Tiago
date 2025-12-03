import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Bell, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/usePocketBaseData';

const AdminLayout = () => {
    const { user } = useAuth();

    return (
        <div className="flex min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
            <Sidebar />

            <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
                {/* Top Header */}
                <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-30 px-6 flex items-center justify-between gap-4">
                    <div className="flex-1 max-w-md relative hidden md:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                            placeholder="Buscar fotos, clientes, projetos..."
                            className="pl-9 bg-secondary/50 border-transparent focus:bg-background transition-all"
                        />
                    </div>

                    <div className="flex items-center gap-4 ml-auto">
                        <Button variant="ghost" size="icon" className="relative">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full animate-pulse" />
                        </Button>

                        <div className="flex items-center gap-3 pl-4 border-l border-border">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-medium leading-none">{user?.email?.split('@')[0] || 'Admin'}</p>
                                <p className="text-xs text-muted-foreground">Administrador</p>
                            </div>
                            <Avatar className="h-9 w-9 border border-border cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all">
                                <AvatarImage src={`https://ui-avatars.com/api/?name=${user?.email || 'Admin'}&background=random`} />
                                <AvatarFallback>TD</AvatarFallback>
                            </Avatar>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 p-6 overflow-y-auto overflow-x-hidden">
                    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
