import { useState, useEffect } from 'react';
import {
    Users,
    Plus,
    Search,
    Phone,
    Mail,
    Calendar,
    MoreHorizontal,
    CheckCircle2,
    Clock,
    AlertCircle,
    Trash2,
    Edit
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { pb } from '@/lib/pocketbase';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Client {
    id: string;
    name: string;
    email: string;
    phone: string;
    status: 'lead' | 'booked' | 'completed';
    created: string;
    access_code: string;
}

const ClientsPage = () => {
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const records = await pb.collection('clients').getFullList<Client>({
                sort: '-created',
            });
            setClients(records);
        } catch (error) {
            console.error("Error fetching clients:", error);
            // toast.error("Erro ao carregar clientes"); // Suppress initial error if collection doesn't exist yet
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir este cliente?")) return;
        try {
            await pb.collection('clients').delete(id);
            toast.success("Cliente excluído");
            fetchClients();
        } catch (error) {
            toast.error("Erro ao excluir cliente");
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'booked': return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'lead': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
            case 'completed': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            default: return 'bg-gray-500/10 text-gray-500';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'booked': return <CheckCircle2 size={14} className="mr-1" />;
            case 'lead': return <AlertCircle size={14} className="mr-1" />;
            case 'completed': return <Clock size={14} className="mr-1" />;
            default: return null;
        }
    };

    const filteredClients = clients.filter(client =>
        client.name.toLowerCase().includes(search.toLowerCase()) ||
        client.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6 p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div>
                    <h2 className="text-3xl font-display font-bold tracking-tight text-white">Clientes</h2>
                    <p className="text-gray-400">Gerencie seus contatos e agendamentos.</p>
                </div>
                <Button className="bg-electric-blue hover:bg-electric-blue/80 text-white">
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Cliente
                </Button>
            </div>

            <div className="flex items-center bg-secondary/10 p-4 rounded-lg border border-white/5">
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                        placeholder="Buscar clientes..."
                        className="pl-9 bg-black/20 border-white/10 text-white"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="text-center py-12 text-gray-400">Carregando...</div>
            ) : filteredClients.length === 0 ? (
                <div className="text-center py-12 text-gray-400 bg-secondary/5 rounded-xl border border-white/5">
                    Nenhum cliente encontrado.
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredClients.map((client) => (
                        <Card key={client.id} className="hover:shadow-md transition-shadow border-white/10 bg-secondary/5">
                            <CardHeader className="flex flex-row items-start justify-between pb-2">
                                <div className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarImage src={`https://ui-avatars.com/api/?name=${client.name}&background=random`} />
                                        <AvatarFallback>{client.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <CardTitle className="text-base font-semibold text-white">{client.name}</CardTitle>
                                        <CardDescription className="text-xs text-gray-400">Código: {client.access_code}</CardDescription>
                                    </div>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white">
                                            <MoreHorizontal size={16} />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="bg-black/90 border-white/10">
                                        <DropdownMenuItem className="text-white hover:bg-white/10 cursor-pointer">
                                            <Edit className="mr-2 h-4 w-4" /> Editar
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className="text-red-500 hover:bg-red-500/10 cursor-pointer"
                                            onClick={() => handleDelete(client.id)}
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" /> Excluir
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2 text-gray-400">
                                        <Mail size={14} />
                                        <span>{client.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-400">
                                        <Phone size={14} />
                                        <span>{client.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-400">
                                        <Calendar size={14} />
                                        <span>{format(new Date(client.created), "dd/MM/yyyy", { locale: ptBR })}</span>
                                    </div>
                                </div>

                                <div className="mt-4 flex items-center justify-between">
                                    <Badge variant="outline" className={`${getStatusColor(client.status)} border`}>
                                        {getStatusIcon(client.status)}
                                        <span className="capitalize">{client.status}</span>
                                    </Badge>
                                    <Button variant="outline" size="sm" className="border-white/10 hover:bg-white/5 text-gray-300">
                                        Ver Galeria
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ClientsPage;
