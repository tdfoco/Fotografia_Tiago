import { useState, useEffect } from "react";
import { Menu, X, Lock } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import LanguageSelector from "./LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";

const Navigation = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();
    const { t } = useLanguage();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        setIsOpen(false);
    }, [location]);

    const navLinks = [
        { name: t('nav.home'), path: "/" },
        { name: t('nav.photography'), path: "/photography" },
        { name: t('nav.graphicDesign'), path: "/design" },
        { name: t('nav.about'), path: "/about" },
        { name: t('nav.services'), path: "/services" },
        { name: t('nav.contact'), path: "/contact" },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? "bg-background/95 backdrop-blur-md shadow-lg border-b border-border"
                : "bg-transparent"
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link
                        to="/"
                        className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                    >
                        <span className="text-lg font-medium tracking-tight text-foreground">
                            tdfoco
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-4">
                        <div className="flex items-center space-x-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`text-sm font-medium tracking-wide transition-all duration-300 relative group ${location.pathname === link.path
                                        ? "text-accent"
                                        : "text-foreground/80 hover:text-accent"
                                        }`}
                                >
                                    {link.name}
                                    <span
                                        className={`absolute -bottom-1 left-0 h-0.5 bg-accent transition-all duration-300 ${location.pathname === link.path ? "w-full" : "w-0 group-hover:w-full"
                                            }`}
                                    />
                                </Link>
                            ))}
                        </div>
                        <div className="flex items-center gap-4">
                            <LanguageSelector />
                            <Link
                                to="/admin"
                                className="text-foreground/80 hover:text-accent transition-colors p-2"
                                aria-label="Admin Panel"
                            >
                                <Lock className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-accent/10 transition-colors"
                        aria-label="Toggle menu"
                    >
                        {isOpen ? (
                            <X className="h-6 w-6 text-foreground" />
                        ) : (
                            <Menu className="h-6 w-6 text-foreground" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation */}
            <div
                className={`md:hidden transition-all duration-300 ease-in-out ${isOpen
                    ? "max-h-96 opacity-100 border-b border-border"
                    : "max-h-0 opacity-0 overflow-hidden"
                    }`}
            >
                <div className="px-4 pt-2 pb-6 space-y-3 bg-background/95 backdrop-blur-md">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${location.pathname === link.path
                                ? "bg-accent text-accent-foreground"
                                : "text-foreground/80 hover:bg-accent/10 hover:text-accent"
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <div className="px-4 pt-2 flex items-center justify-between">
                        <LanguageSelector />
                        <Link
                            to="/admin"
                            className="flex items-center gap-2 text-foreground/80 hover:text-accent transition-colors px-4 py-2"
                        >
                            <Lock className="h-4 w-4" />
                            <span className="text-sm font-medium">Admin</span>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navigation;
