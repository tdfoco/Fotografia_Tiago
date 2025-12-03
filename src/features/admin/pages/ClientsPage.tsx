import { useState } from 'react';
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
    AlertCircle
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

// Mock data for clients
const initialClients = [
    { id: 1, name: 'Alice Silva', email: 'alice@example.com', phone: '(11) 99999-9999', status: 'booked', date: '2024-03-15', type: 'Ensaio Externo' },
    { id: 2, name: 'Roberto Carlos', email: 'roberto@example.com', phone: '(11) 98888-8888', status: 'lead', date: '2024-03-20', type: 'Casamento' },
    { id: 3, name: 'Fernanda Souza', email: 'fernanda@example.com', phone: '(11) 97777-7777', status: 'completed', date: '2024-02-10', type: 'Retrato Corporativo' },
    { id: 4, name: 'Grupo Tech', email: 'contato@tech.com', phone: '(11) 3333-3333', status: 'lead', date: '2024-04-05', type: 'Evento Corporativo' },
];

const ClientsPage = () => {
    const [clients, setClients] = useState(initialClients);
    const [search, setSearch] = useState('');

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
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div>
                    <h2 className="text-3xl font-display font-bold tracking-tight">Clientes</h2>
                    <p className="text-muted-foreground">Gerencie seus contatos e agendamentos.</p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Cliente
                </Button>
            </div>

            <div className="flex items-center bg-card p-4 rounded-lg border border-border/50">
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                        placeholder="Buscar clientes..."
                        className="pl-9"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredClients.map((client) => (
                    <Card key={client.id} className="hover:shadow-md transition-shadow border-border/50">
                        <CardHeader className="flex flex-row items-start justify-between pb-2">
                            <div className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarImage src={`https://ui-avatars.com/api/?name=${client.name}&background=random`} />
                                    <AvatarFallback>{client.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <CardTitle className="text-base font-semibold">{client.name}</CardTitle>
                                    <CardDescription className="text-xs">{client.type}</CardDescription>
                                </div>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <MoreHorizontal size={16} />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem>Editar</DropdownMenuItem>
                                    <DropdownMenuItem>Ver Detalhes</DropdownMenuItem>
                                    <DropdownMenuItem className="text-destructive">Excluir</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Mail size={14} />
                                    <span>{client.email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Phone size={14} />
                                    <span>{client.phone}</span>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Calendar size={14} />
                                    <span>{new Date(client.date).toLocaleDateString('pt-BR')}</span>
                                </div>
                            </div>

                            <div className="mt-4 flex items-center justify-between">
                                <Badge variant="outline" className={`${getStatusColor(client.status)} border`}>
                                    {getStatusIcon(client.status)}
                                    <span className="capitalize">{client.status}</span>
                                </Badge>
                                <Button variant="outline" size="sm">Contatar</Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default ClientsPage;
