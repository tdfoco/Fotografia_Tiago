import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Database, Wifi, GitBranch, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { pb } from '@/lib/pocketbase';

interface SystemStatus {
    apiStatus: 'online' | 'offline';
    dbStatus: 'connected' | 'disconnected';
    buildInfo: {
        commit: string;
        branch: string;
        date: string;
    };
    uptime: string;
}

export function StatusIndicators() {
    const [status, setStatus] = useState<SystemStatus>({
        apiStatus: 'online',
        dbStatus: 'connected',
        buildInfo: {
            commit: 'abc1234',
            branch: 'main',
            date: new Date().toISOString()
        },
        uptime: '0h 0m'
    });

    useEffect(() => {
        // Check API status
        const checkStatus = async () => {
            try {
                const health = await pb.health.check();
                setStatus(prev => ({
                    ...prev,
                    apiStatus: 'online',
                    dbStatus: 'connected'
                }));
            } catch (error) {
                setStatus(prev => ({
                    ...prev,
                    apiStatus: 'offline',
                    dbStatus: 'disconnected'
                }));
            }
        };

        checkStatus();
        const interval = setInterval(checkStatus, 30000); // Check every 30s

        return () => clearInterval(interval);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed top-4 right-4 z-50 flex items-center gap-2"
        >
            {/* API Status */}
            <div className="px-3 py-1.5 rounded-full bg-secondary/50 backdrop-blur-md border border-white/10 flex items-center gap-2">
                <Activity className={`w-3 h-3 ${status.apiStatus === 'online' ? 'text-green-500' : 'text-red-500 animate-pulse'}`} />
                <span className="text-xs font-medium">API</span>
            </div>

            {/* Database Status */}
            <div className="px-3 py-1.5 rounded-full bg-secondary/50 backdrop-blur-md border border-white/10 flex items-center gap-2">
                <Database className={`w-3 h-3 ${status.dbStatus === 'connected' ? 'text-green-500' : 'text-red-500 animate-pulse'}`} />
                <span className="text-xs font-medium">PB</span>
            </div>

            {/* Build Info */}
            <div className="px-3 py-1.5 rounded-full bg-secondary/50 backdrop-blur-md border border-white/10 flex items-center gap-2">
                <GitBranch className="w-3 h-3 text-electric-blue" />
                <span className="text-xs font-medium">{status.buildInfo.commit.slice(0, 7)}</span>
            </div>

            {/* Uptime */}
            <div className="px-3 py-1.5 rounded-full bg-secondary/50 backdrop-blur-md border border-white/10 flex items-center gap-2">
                <Clock className="w-3 h-3 text-neon-cyan" />
                <span className="text-xs font-medium">{status.uptime}</span>
            </div>
        </motion.div>
    );
}
