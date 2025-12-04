import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from '../components/AdminSidebar';
import { AdminHeader } from '../components/AdminHeader';
import { StatusIndicators } from '../components/StatusIndicators';

export function AdminLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="min-h-screen bg-gradient-to-br from-deep-black via-deep-black/95 to-electric-blue/5">
            {/* Status Indicators (floating) */}
            <StatusIndicators />

            {/* Sidebar */}
            <AdminSidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

            {/* Main Content */}
            <div
                className="transition-all duration-300"
                style={{ marginLeft: sidebarOpen ? '256px' : '80px' }}
            >
                <AdminHeader />

                <main className="p-6 min-h-[calc(100vh-4rem)]">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
