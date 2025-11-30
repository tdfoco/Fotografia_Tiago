import { useState, useRef, useEffect } from 'react';
import { Search, X, Loader2, Image, Palette, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSearch, SearchResult } from '@/hooks/useSearch';
import { useLanguage } from '@/contexts/LanguageContext';

const SearchBar = () => {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const { results, loading } = useSearch(query);
    const navigate = useNavigate();
    const wrapperRef = useRef<HTMLDivElement>(null);
    const { t } = useLanguage();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (result: SearchResult) => {
        setIsOpen(false);
        setQuery('');
        // Navigate to the page
        // In the future, we could pass state to open the specific item
        navigate(result.link, { state: { highlightId: result.id } });
    };

    return (
        <div ref={wrapperRef} className="relative w-full max-w-xs">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    placeholder={t('nav.search') || "Search..."}
                    className="w-full pl-9 pr-4 py-2 text-sm bg-secondary/50 border-transparent focus:bg-background focus:border-accent rounded-full transition-all outline-none"
                />
                {query && (
                    <button
                        onClick={() => {
                            setQuery('');
                            setIsOpen(false);
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                        <X className="h-3 w-3" />
                    </button>
                )}
            </div>

            {/* Results Dropdown */}
            {isOpen && query.length >= 2 && (
                <div className="absolute top-full mt-2 left-0 w-full md:w-80 bg-background/95 backdrop-blur-md border border-border rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                    {loading ? (
                        <div className="p-4 flex items-center justify-center text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            <span>Searching...</span>
                        </div>
                    ) : results.length > 0 ? (
                        <div className="py-2">
                            <div className="px-3 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Results
                            </div>
                            {results.map((result) => (
                                <button
                                    key={`${result.type}-${result.id}`}
                                    onClick={() => handleSelect(result)}
                                    className="w-full px-4 py-3 flex items-start gap-3 hover:bg-accent/10 transition-colors text-left group"
                                >
                                    <div className="mt-0.5 p-1.5 rounded-md bg-secondary text-secondary-foreground group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                                        {result.type === 'photography' ? (
                                            <Image className="h-4 w-4" />
                                        ) : (
                                            <Palette className="h-4 w-4" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-medium truncate group-hover:text-accent transition-colors">
                                            {result.title}
                                        </h4>
                                        <p className="text-xs text-muted-foreground truncate">
                                            {result.category}
                                            {result.date && ` • ${new Date(result.date).getFullYear()}`}
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                            No results found for "{query}"
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchBar;
