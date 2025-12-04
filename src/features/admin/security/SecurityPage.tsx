import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Shield, Activity, AlertTriangle, Lock, User, FileText, Search } from 'lucide-react';

interface AuditLog {
    id: string;
    action: string;
    resource: string;
    user: string;
    details: string;
    timestamp: string;
    severity: 'info' | 'warning' | 'error';
}

export default function SecurityPage() {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Generate mock audit logs for demonstration
        const mockLogs: AuditLog[] = [
            {
                id: '1',
                action: 'LOGIN',
                resource: 'Admin Panel',
                user: 'Tiago',
                details: 'Login bem-sucedido de IP 192.168.1.1',
                timestamp: new Date().toISOString(),
                severity: 'info'
            },
            {
                id: '2',
                action: 'CREATE',
                resource: 'Photography',
                user: 'Tiago',
                details: 'Nova foto adicionada: "Sunset Beach"',
                timestamp: new Date(Date.now() - 3600000).toISOString(),
                severity: 'info'
            },
            {
                id: '3',
                action: 'UPDATE',
                resource: 'Hero Image',
                user: 'Tiago',
                details: 'Hero image ativada para homepage',
                timestamp: new Date(Date.now() - 7200000).toISOString(),
                severity: 'info'
            },
            {
                id: '4',
                action: 'DELETE',
                resource: 'Design Project',
                user: 'Tiago',
                details: 'Projeto "Logo XYZ" removido',
                timestamp: new Date(Date.now() - 86400000).toISOString(),
                severity: 'warning'
            },
            {
                id: '5',
                action: 'FAILED_LOGIN',
                resource: 'Admin Panel',
                user: 'unknown',
                details: 'Tentativa de login falhou de IP 203.0.113.42',
                timestamp: new Date(Date.now() - 172800000).toISOString(),
                severity: 'error'
            },
        ];

        setLogs(mockLogs);
    }, []);

    const filteredLogs = logs.filter(log =>
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'error':
                return 'border-red-500/30 text-red-500';
            case 'warning':
                return 'border-yellow-500/30 text-yellow-500';
            default:
                return 'border-electric-blue/30 text-electric-blue';
        }
    };

    const getSeverityIcon = (severity: string) => {
        switch (severity) {
            case 'error':
                return <AlertTriangle className="w-4 h-4" />;
            case 'warning':
                return <Activity className="w-4 h-4" />;
            default:
                return <Shield className="w-4 h-4" />;
        }
    };

    const getActionIcon = (action: string) => {
        if (action.includes('LOGIN')) return <User className="w-5 h-5" />;
        if (action.includes('DELETE')) return <AlertTriangle className="w-5 h-5" />;
        return <FileText className="w-5 h-5" />;
    };

    const stats = {
        totalLogs: logs.length,
        errors: logs.filter(l => l.severity === 'error').length,
        warnings: logs.filter(l => l.severity === 'warning').length,
        activities: logs.filter(l => l.severity === 'info').length,
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-electric-blue to-vibrant-purple">
                        <Shield className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-4xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-electric-blue to-vibrant-purple">
                        Segurança & Auditoria
                    </h1>
                </div>
                <p className="text-muted-foreground text-lg">
                    Monitoramento de atividades e logs de auditoria
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="p-6 bg-secondary/30 backdrop-blur-md border-white/10 hover:border-electric-blue/30 transition-all">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm text-muted-foreground">Total de Logs</h3>
                        <Activity className="w-5 h-5 text-electric-blue" />
                    </div>
                    <p className="text-3xl font-bold">{stats.totalLogs}</p>
                </Card>

                <Card className="p-6 bg-secondary/30 backdrop-blur-md border-white/10 hover:border-red-500/30 transition-all">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm text-muted-foreground">Erros</h3>
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                    </div>
                    <p className="text-3xl font-bold text-red-500">{stats.errors}</p>
                </Card>

                <Card className="p-6 bg-secondary/30 backdrop-blur-md border-white/10 hover:border-yellow-500/30 transition-all">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm text-muted-foreground">Avisos</h3>
                        <Activity className="w-5 h-5 text-yellow-500" />
                    </div>
                    <p className="text-3xl font-bold text-yellow-500">{stats.warnings}</p>
                </Card>

                <Card className="p-6 bg-secondary/30 backdrop-blur-md border-white/10 hover:border-green-500/30 transition-all">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm text-muted-foreground">Atividades</h3>
                        <Shield className="w-5 h-5 text-green-500" />
                    </div>
                    <p className="text-3xl font-bold text-green-500">{stats.activities}</p>
                </Card>
            </div>

            {/* Security Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6 bg-secondary/30 backdrop-blur-md border-white/10">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Lock className="w-5 h-5 text-electric-blue" />
                        Configurações de Segurança
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                            <div>
                                <p className="font-medium mb-1">Autenticação 2FA</p>
                                <p className="text-sm text-muted-foreground">Two-Factor Authentication</p>
                            </div>
                            <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">
                                Em Breve
                            </Badge>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                            <div>
                                <p className="font-medium mb-1">IP Whitelist</p>
                                <p className="text-sm text-muted-foreground">Restrição por endereço IP</p>
                            </div>
                            <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">
                                Em Breve
                            </Badge>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                            <div>
                                <p className="font-medium mb-1">Session Timeout</p>
                                <p className="text-sm text-muted-foreground">Sessão expira em 30 minutos</p>
                            </div>
                            <Badge className="bg-green-500/20 text-green-500 border-green-500/30">
                                Ativo
                            </Badge>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                            <div>
                                <p className="font-medium mb-1">Audit Logging</p>
                                <p className="text-sm text-muted-foreground">Registro de todas ações</p>
                            </div>
                            <Badge className="bg-green-500/20 text-green-500 border-green-500/30">
                                Ativo
                            </Badge>
                        </div>
                    </div>
                </Card>

                <Card className="p-6 bg-secondary/30 backdrop-blur-md border-white/10">
                    <h3 className="text-xl font-bold mb-4">Atividade Recente</h3>
                    <div className="space-y-3">
                        {logs.slice(0, 5).map((log) => (
                            <div key={log.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                                <div className={`p-2 rounded-lg ${getSeverityColor(log.severity)} bg-opacity-10`}>
                                    {getSeverityIcon(log.severity)}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">{log.action}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {new Date(log.timestamp).toLocaleString('pt-BR')}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Search */}
            <Card className="p-4 bg-secondary/30 backdrop-blur-md border-white/10">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar nos logs de auditoria..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-secondary/50 border-white/10"
                    />
                </div>
            </Card>

            {/* Audit Logs */}
            <Card className="p-6 bg-secondary/30 backdrop-blur-md border-white/10">
                <h3 className="text-xl font-bold mb-6">Logs de Auditoria</h3>
                <div className="space-y-3">
                    {filteredLogs.map((log) => (
                        <div
                            key={log.id}
                            className={`p-4 rounded-xl bg-white/5 border transition-all hover:bg-white/10 ${getSeverityColor(log.severity)}`}
                        >
                            <div className="flex items-start gap-4">
                                <div className={`p-2 rounded-lg ${getSeverityColor(log.severity)} bg-opacity-10`}>
                                    {getActionIcon(log.action)}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <span className="font-bold">{log.action}</span>
                                            <Badge variant="outline" className="border-white/20">
                                                {log.resource}
                                            </Badge>
                                            <Badge variant="outline" className={getSeverityColor(log.severity)}>
                                                {log.severity.toUpperCase()}
                                            </Badge>
                                        </div>
                                        <span className="text-sm text-muted-foreground">
                                            {new Date(log.timestamp).toLocaleString('pt-BR')}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-1">
                                        Usuário: <span className="text-foreground font-medium">{log.user}</span>
                                    </p>
                                    <p className="text-sm text-foreground">{log.details}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}
