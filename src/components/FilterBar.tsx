import { motion } from "framer-motion";

interface FilterOption {
    key: string;
    label: string;
}

interface FilterBarProps {
    categories: FilterOption[];
    activeFilter: string;
    onFilterChange: (filter: string) => void;
    className?: string;
}

const FilterBar = ({
    categories,
    activeFilter,
    onFilterChange,
    className = ""
}: FilterBarProps) => {
    return (
        <div className={`flex flex-wrap justify-center gap-3 ${className}`}>
            {categories.map((category) => (
                <button
                    key={category.key}
                    onClick={() => onFilterChange(category.key)}
                    className="relative px-6 py-2.5 rounded-full text-sm font-medium tracking-wide transition-all duration-300 outline-none focus:outline-none group"
                >
                    {activeFilter === category.key ? (
                        <motion.div
                            layoutId="activeFilter"
                            className="absolute inset-0 bg-accent rounded-full shadow-lg shadow-accent/30"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                    ) : (
                        <div className="absolute inset-0 bg-secondary/50 rounded-full group-hover:bg-accent/20 transition-colors duration-300" />
                    )}

                    <span className={`relative z-10 transition-colors duration-300 ${activeFilter === category.key
                            ? "text-accent-foreground"
                            : "text-secondary-foreground"
                        }`}>
                        {category.label}
                    </span>
                </button>
            ))}
        </div>
    );
};

export default FilterBar;
