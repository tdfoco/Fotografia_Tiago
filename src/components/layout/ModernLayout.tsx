import { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import Navigation from "../Navigation";
import Footer from "../Footer";
import { ThemeToggle } from "../ui/ThemeToggle";

interface ModernLayoutProps {
    children?: ReactNode;
}

const ModernLayout = ({ children }: ModernLayoutProps) => {
    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-accent selection:text-white">
            {/* Header Wrapper to include ThemeToggle if not in Navigation yet */}
            <div className="fixed top-0 right-0 z-[60] p-4 hidden md:block">
                <ThemeToggle />
            </div>

            <Navigation />

            <main className="flex-grow pt-20 animate-fade-in">
                {children || <Outlet />}
            </main>

            <Footer />
        </div>
    );
};

export default ModernLayout;
