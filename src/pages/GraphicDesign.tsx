import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import type { DesignProject } from "@/lib/supabase";
import { useEffect } from "react";

interface DesignGridProps {
    selectedCategory?: string;
}

const DesignGrid = ({ selectedCategory = "Todos" }: DesignGridProps) => {
    const [projects, setProjects] = useState<DesignProject[]>([]);
    const [selectedProject, setSelectedProject] = useState<DesignProject | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            let query = supabase
                .from('design_projects')
                .select('*')
                .order('created_at', { ascending: false });

            const { data, error } = await query;

            if (error) throw error;
            setProjects(data || []);
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false);
        }
    };

    const categories = {
        logos: "Logos",
        visual_identity: "Visual Identity",
        social_media: "Social Media",
        posters: "Posters",
        special: "Special Projects"
    };

    const filteredProjects = selectedCategory === "Todos"
        ? projects
        : projects.filter(p => p.category === selectedCategory);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-muted-foreground">Loading projects...</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
                <div
                    key={project.id}
                    className="group cursor-pointer animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={() => setSelectedProject(project)}
                >
                    <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-secondary">
                        <img
                            src={project.images[0]}
                            alt={project.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                <p className="text-sm font-light text-accent mb-2">
                                    {categories[project.category as keyof typeof categories]}
                                </p>
                                <h3 className="text-xl font-display font-semibold">
                                    {project.title}
                                </h3>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4">
                        <p className="text-sm text-accent font-medium">
                            {categories[project.category as keyof typeof categories]}
                        </p>
                        <h3 className="text-lg font-display font-semibold mt-1">
                            {project.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            {project.year} {project.client && `• ${project.client}`}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};

const GraphicDesign = () => {
    const [filter, setFilter] = useState("Todos");

    const categories = ["Todos", "logos", "visual_identity", "social_media", "posters", "special"];
    const categoryLabels: Record<string, string> = {
        "Todos": "All",
        "logos": "Logos",
        "visual_identity": "Visual Identity",
        "social_media": "Social Media",
        "posters": "Posters",
        "special": "Special Projects"
    };

    return (
        <>
            <Navigation />
            <main className="min-h-screen pt-20">
                {/* Header Section */}
                <section className="bg-gradient-to-br from-background via-secondary to-background py-24 px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-5xl md:text-6xl font-display font-bold tracking-tight mb-6 animate-fade-in">
                            Graphic Design
                        </h1>
                        <div className="w-24 h-1 bg-accent mx-auto mb-8" />
                        <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed max-w-2xl mx-auto">
                            Modern visual identities, branding, and design pieces that create
                            strong visual impact and memorable brand experiences.
                        </p>
                    </div>
                </section>

                {/* Design Portfolio */}
                <section className="py-20 px-4 md:px-8">
                    <div className="max-w-7xl mx-auto">
                        {/* Category Filter */}
                        <div className="flex flex-wrap justify-center gap-4 mb-12">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setFilter(category)}
                                    className={`px-6 py-2 rounded-full text-sm font-medium tracking-wide transition-all duration-300 ${filter === category
                                            ? "bg-accent text-accent-foreground shadow-lg shadow-accent/30"
                                            : "bg-secondary text-secondary-foreground hover:bg-accent/20"
                                        }`}
                                >
                                    {categoryLabels[category]}
                                </button>
                            ))}
                        </div>

                        <DesignGrid selectedCategory={filter} />
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
};

export default GraphicDesign;
