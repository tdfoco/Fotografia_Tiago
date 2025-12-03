import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { pb } from '@/lib/pocketbase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SEO } from '@/components/SEO';

const ClientLogin = () => {
    const [accessCode, setAccessCode] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Authenticate using the "clients" collection
            // We assume the username is the access code and password is the same
            // Or we use a specific convention like email: code@client.tdfoco.cloud

            const email = `${accessCode}@client.tdfoco.cloud`;
            await pb.collection('clients').authWithPassword(email, accessCode);

            toast({
                title: 'Acesso Permitido',
                description: 'Bem-vindo à sua galeria privada.',
            });

            navigate('/client/gallery');
        } catch (error: any) {
            console.error(error);
            toast({
                title: 'Acesso Negado',
                description: 'Código de acesso inválido.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <SEO title="Área do Cliente" description="Acesso restrito para clientes." />
            <Card className="w-full max-w-md border-primary/20">
                <CardHeader className="text-center space-y-2">
                    <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                        <Lock className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-display">Área do Cliente</CardTitle>
                    <CardDescription>Digite seu código de acesso para visualizar suas fotos.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <Input
                            type="text"
                            placeholder="Código de Acesso"
                            value={accessCode}
                            onChange={(e) => setAccessCode(e.target.value)}
                            className="text-center text-lg tracking-widest uppercase"
                            required
                        />
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Acessar Galeria'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default ClientLogin;
