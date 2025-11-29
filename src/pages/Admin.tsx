import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useSupabaseData';
import { supabase, uploadImage, deleteImage, PHOTOGRAPHY_BUCKET, DESIGN_BUCKET, HERO_BUCKET } from '@/lib/supabase';
import type { PhotographyItem, DesignProject, HeroImage } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, LogOut, Plus, Trash2, Upload } from 'lucide-react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const Admin = () => {
    const { user, loading: authLoading, signIn, signOut } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const [photos, setPhotos] = useState<PhotographyItem[]>([]);
    const [projects, setProjects] = useState<DesignProject[]>([]);
    const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
    const [loadingData, setLoadingData] = useState(false);

    useEffect(() => {
        if (user) {
            loadData();
        }
    }, [user]);

    const loadData = async () => {
        setLoadingData(true);
        try {
            const [photosRes, projectsRes] = await Promise.all([
                supabase.from('photography').select('*').order('created_at', { ascending: false }),
                supabase.from('design_projects').select('*').order('created_at', { ascending: false }),
            ]);

            if (photosRes.data) setPhotos(photosRes.data);
            if (projectsRes.data) setProjects(projectsRes.data);

            const { data: heroData } = await supabase
                .from('hero_images')
                .select('*')
                .order('created_at', { ascending: false });

            if (heroData) setHeroImages(heroData);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoadingData(false);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoggingIn(true);

        const { error } = await signIn(email, password);

        if (error) {
            toast({
                title: 'Login Failed',
                description: error.message,
                variant: 'destructive',
            });
        } else {
            toast({
                title: 'Success',
                description: 'Welcome to the admin panel!',
            });
        }

        setIsLoggingIn(false);
    };

    const handleLogout = async () => {
        await signOut();
        toast({
            title: 'Logged Out',
            description: 'You have been logged out successfully.',
        });
        navigate('/');
    };

    const handleDeletePhoto = async (photo: PhotographyItem) => {
        if (!confirm('Are you sure you want to delete this photo?')) return;

        try {
            await deleteImage(PHOTOGRAPHY_BUCKET, photo.url);
            await supabase.from('photography').delete().eq('id', photo.id);

            toast({
                title: 'Photo Deleted',
                description: 'The photo has been removed successfully.',
            });

            loadData();
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive',
            });
        }
    };

    const handleDeleteProject = async (project: DesignProject) => {
        if (!confirm('Are you sure you want to delete this project?')) return;

        try {
            // Delete all images
            for (const imageUrl of project.images) {
                await deleteImage(DESIGN_BUCKET, imageUrl);
            }

            await supabase.from('design_projects').delete().eq('id', project.id);

            toast({
                title: 'Project Deleted',
                description: 'The project has been removed successfully.',
            });

            loadData();
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive',
            });
        }
    };

    const handleDeleteHeroImage = async (image: HeroImage) => {
        if (!confirm('Are you sure you want to delete this image?')) return;

        try {
            await deleteImage(HERO_BUCKET, image.url);
            await supabase.from('hero_images').delete().eq('id', image.id);

            toast({
                title: 'Image Deleted',
                description: 'The hero image has been removed successfully.',
            });

            loadData();
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive',
            });
        }
    };

    const handleToggleActiveHero = async (image: HeroImage) => {
        try {
            // Toggle the clicked image
            await supabase
                .from('hero_images')
                .update({ active: !image.active })
                .eq('id', image.id);

            loadData();
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive',
            });
        }
    };

    // Login Form
    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary to-background p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <CardTitle className="text-3xl font-display">Admin Login</CardTitle>
                        <CardDescription>Enter your credentials to manage the portfolio</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium mb-2">
                                    Email
                                </label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="admin@example.com"
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium mb-2">
                                    Password
                                </label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="••••••••"
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isLoggingIn}
                            >
                                {isLoggingIn ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Logging in...
                                    </>
                                ) : (
                                    'Login'
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Admin Dashboard
    return (
        <div className="min-h-screen bg-background">
            <header className="border-b border-border bg-secondary/50 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <h1 className="text-2xl font-display font-bold">Admin Panel</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">{user.email}</span>
                        <Button onClick={handleLogout} variant="outline" size="sm">
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                        </Button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8">
                <Tabs defaultValue="photography" className="w-full">
                    <TabsList className="flex w-full max-w-2xl mx-auto gap-2">
                        <TabsTrigger value="photography" className="flex-1">Photography</TabsTrigger>
                        <TabsTrigger value="design" className="flex-1">Design Projects</TabsTrigger>
                        <TabsTrigger value="hero" className="flex-1">Hero Images</TabsTrigger>
                        <TabsTrigger value="content" className="flex-1">Content</TabsTrigger>
                    </TabsList>

                    <TabsContent value="photography" className="mt-8">
                        <PhotoManagement
                            photos={photos}
                            onDelete={handleDeletePhoto}
                            onRefresh={loadData}
                            loading={loadingData}
                        />
                    </TabsContent>

                    <TabsContent value="design" className="mt-8">
                        <DesignManagement
                            projects={projects}
                            onDelete={handleDeleteProject}
                            onRefresh={loadData}
                            loading={loadingData}
                        />
                    </TabsContent>

                    <TabsContent value="hero" className="mt-8">
                        <HeroManagement
                            images={heroImages}
                            onDelete={handleDeleteHeroImage}
                            onToggleActive={handleToggleActiveHero}
                            onRefresh={loadData}
                            loading={loadingData}
                        />
                    </TabsContent>

                    <TabsContent value="content" className="mt-8">
                        <ContentManagement />
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
};

// Photography Management Component
interface PhotoManagementProps {
    photos: PhotographyItem[];
    onDelete: (photo: PhotographyItem) => void;
    onRefresh: () => void;
    loading: boolean;
}

const PhotoManagement = ({ photos, onDelete, onRefresh, loading }: PhotoManagementProps) => {
    const [showForm, setShowForm] = useState(false);
    const [uploading, setUploading] = useState(false);
    const { toast } = useToast();

    const [formData, setFormData] = useState({
        file: null as File | null,
        category: 'portraits' as PhotographyItem['category'],
        title: '',
        description: '',
        year: new Date().getFullYear(),
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.file) return;

        setUploading(true);
        try {
            const url = await uploadImage(PHOTOGRAPHY_BUCKET, formData.file);

            await supabase.from('photography').insert({
                url,
                category: formData.category,
                title: formData.title,
                description: formData.description,
            });

            toast({
                title: 'Success',
                description: 'Photo uploaded successfully!',
            });

            setFormData({
                file: null,
                category: 'portraits',
                title: '',
                description: '',
                year: new Date().getFullYear(),
            });
            setShowForm(false);
            onRefresh();
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive',
            });
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-display font-bold">Photography Management</h2>
                <Button onClick={() => setShowForm(!showForm)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Photo
                </Button>
            </div>

            {showForm && (
                <Card>
                    <CardHeader>
                        <CardTitle>Upload New Photo</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Image File</label>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Category</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                                    className="w-full px-4 py-2 rounded-md border border-input bg-background"
                                >
                                    <option value="portraits">Portraits</option>
                                    <option value="urban">Urban</option>
                                    <option value="nature">Nature</option>
                                    <option value="art">Art</option>
                                    <option value="events">Events</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Title</label>
                                <Input
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Description</label>
                                <Textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Year</label>
                                <Input
                                    type="number"
                                    value={formData.year}
                                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                                    required
                                />
                            </div>

                            <div className="flex gap-4">
                                <Button type="submit" disabled={uploading}>
                                    {uploading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="mr-2 h-4 w-4" />
                                            Upload Photo
                                        </>
                                    )}
                                </Button>
                                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <p className="col-span-full text-center text-muted-foreground">Loading...</p>
                ) : photos.length === 0 ? (
                    <p className="col-span-full text-center text-muted-foreground">No photos yet. Add your first one above!</p>
                ) : (
                    photos.map((photo) => (
                        <Card key={photo.id}>
                            <img src={photo.url} alt={photo.title} className="w-full h-48 object-cover rounded-t-lg" />
                            <CardContent className="p-4">
                                <p className="text-sm text-accent font-medium mb-1">{photo.category}</p>
                                <h3 className="font-semibold mb-1">{photo.title}</h3>
                                <p className="text-sm text-muted-foreground mb-3">{photo.description}</p>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => onDelete(photo)}
                                    className="w-full"
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </Button>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

// Design Management Component (similar structure)
interface DesignManagementProps {
    projects: DesignProject[];
    onDelete: (project: DesignProject) => void;
    onRefresh: () => void;
    loading: boolean;
}

const DesignManagement = ({ projects, onDelete, onRefresh, loading }: DesignManagementProps) => {
    const [showForm, setShowForm] = useState(false);
    const [uploading, setUploading] = useState(false);
    const { toast } = useToast();

    const [formData, setFormData] = useState({
        files: [] as File[],
        category: 'branding' as DesignProject['category'],
        title: '',
        description: '',
        year: new Date().getFullYear(),
        client: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.files.length === 0) return;

        setUploading(true);
        try {
            const imageUrls = await Promise.all(
                formData.files.map((file) => uploadImage(DESIGN_BUCKET, file))
            );

            await supabase.from('design_projects').insert({
                images: imageUrls,
                category: formData.category,
                title: formData.title,
                description: formData.description,
                year: formData.year,
                client: formData.client || null,
            });

            toast({
                title: 'Success',
                description: 'Design project uploaded successfully!',
            });

            setFormData({
                files: [],
                category: 'branding',
                title: '',
                description: '',
                year: new Date().getFullYear(),
                client: '',
            });
            setShowForm(false);
            onRefresh();
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive',
            });
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-display font-bold">Design Projects Management</h2>
                <Button onClick={() => setShowForm(!showForm)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Project
                </Button>
            </div>

            {showForm && (
                <Card>
                    <CardHeader>
                        <CardTitle>Upload New Design Project</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Images (multiple allowed)</label>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={(e) => setFormData({ ...formData, files: Array.from(e.target.files || []) })}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Category</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                                    className="w-full px-4 py-2 rounded-md border border-input bg-background"
                                >
                                    <option value="branding">Branding</option>
                                    <option value="editorial">Editorial</option>
                                    <option value="web">Web</option>
                                    <option value="illustration">Illustration</option>
                                    <option value="packaging">Packaging</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Title</label>
                                <Input
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Description</label>
                                <Textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Year</label>
                                    <Input
                                        type="number"
                                        value={formData.year}
                                        onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Client (optional)</label>
                                    <Input
                                        value={formData.client}
                                        onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Button type="submit" disabled={uploading}>
                                    {uploading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="mr-2 h-4 w-4" />
                                            Upload Project
                                        </>
                                    )}
                                </Button>
                                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <p className="col-span-full text-center text-muted-foreground">Loading...</p>
                ) : projects.length === 0 ? (
                    <p className="col-span-full text-center text-muted-foreground">No projects yet. Add your first one above!</p>
                ) : (
                    projects.map((project) => (
                        <Card key={project.id}>
                            <img src={project.images[0]} alt={project.title} className="w-full h-48 object-cover rounded-t-lg" />
                            <CardContent className="p-4">
                                <p className="text-sm text-accent font-medium mb-1">{project.category}</p>
                                <h3 className="font-semibold mb-1">{project.title}</h3>
                                <p className="text-sm text-muted-foreground mb-1">{project.year}</p>
                                {project.client && <p className="text-sm text-muted-foreground mb-3">Client: {project.client}</p>}
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => onDelete(project)}
                                    className="w-full"
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </Button>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default Admin;

interface HeroManagementProps {
    images: HeroImage[];
    onDelete: (image: HeroImage) => void;
    onToggleActive: (image: HeroImage) => void;
    onRefresh: () => void;
    loading: boolean;
}

const HeroManagement = ({ images, onDelete, onToggleActive, onRefresh, loading }: HeroManagementProps) => {
    const [showForm, setShowForm] = useState(false);
    const [uploading, setUploading] = useState(false);
    const { toast } = useToast();

    const [formData, setFormData] = useState({
        file: null as File | null,
        title: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.file) return;

        setUploading(true);
        try {
            const url = await uploadImage(HERO_BUCKET, formData.file);

            await supabase.from('hero_images').insert({
                url,
                title: formData.title,
                active: false, // Default to inactive
            });

            toast({
                title: 'Success',
                description: 'Hero image uploaded successfully!',
            });

            setFormData({
                file: null,
                title: '',
            });
            setShowForm(false);
            onRefresh();
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive',
            });
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-display font-bold">Hero Images Management</h2>
                <Button onClick={() => setShowForm(!showForm)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Hero Image
                </Button>
            </div>

            {showForm && (
                <Card>
                    <CardHeader>
                        <CardTitle>Upload New Hero Image</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Image File</label>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Title (for reference)</label>
                                <Input
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="flex gap-4">
                                <Button type="submit" disabled={uploading}>
                                    {uploading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="mr-2 h-4 w-4" />
                                            Upload Image
                                        </>
                                    )}
                                </Button>
                                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <p className="col-span-full text-center text-muted-foreground">Loading...</p>
                ) : images.length === 0 ? (
                    <p className="col-span-full text-center text-muted-foreground">No hero images yet. Add your first one above!</p>
                ) : (
                    images.map((image) => (
                        <Card key={image.id} className={image.active ? "border-2 border-accent" : ""}>
                            <div className="relative h-48">
                                <img src={image.url} alt={image.title} className="w-full h-full object-cover rounded-t-lg" />
                                {image.active && (
                                    <div className="absolute top-2 right-2 bg-accent text-accent-foreground px-2 py-1 rounded text-xs font-bold">
                                        ACTIVE
                                    </div>
                                )}
                            </div>
                            <CardContent className="p-4">
                                <h3 className="font-semibold mb-3">{image.title}</h3>
                                <div className="flex gap-2">
                                    <Button
                                        variant={image.active ? "secondary" : "default"}
                                        size="sm"
                                        onClick={() => onToggleActive(image)}
                                        className="flex-1"
                                    >
                                        {image.active ? "Deactivate" : "Set Active"}
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => onDelete(image)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

// Content Management Component
const ContentManagement = () => {
    const [content, setContent] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingKey, setEditingKey] = useState<string | null>(null);
    const [editValue, setEditValue] = useState('');
    const { toast } = useToast();

    useEffect(() => {
        loadContent();
    }, []);

    const loadContent = async () => {
        setLoading(true);
        try {
            const { data } = await supabase
                .from('site_content')
                .select('*')
                .eq('lang', 'pt') // Default to editing Portuguese for now
                .order('key');

            if (data) setContent(data);
        } catch (error) {
            console.error('Error loading content:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (key: string) => {
        try {
            const { error } = await supabase
                .from('site_content')
                .upsert({
                    key,
                    lang: 'pt',
                    value: editValue
                });

            if (error) throw error;

            toast({
                title: 'Success',
                description: 'Content updated successfully!',
            });

            setEditingKey(null);
            loadContent();
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive',
            });
        }
    };

    const filteredContent = content.filter(item =>
        item.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.value.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Group content by section (prefix)
    const groupedContent = filteredContent.reduce((acc, item) => {
        const prefix = item.key.split('.')[0];
        if (!acc[prefix]) {
            acc[prefix] = [];
        }
        acc[prefix].push(item);
        return acc;
    }, {} as Record<string, typeof content>);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-display font-bold">Site Content Management</h2>
                <Input
                    placeholder="Search content..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-xs"
                />
            </div>

            {loading ? (
                <p className="text-center text-muted-foreground">Loading content...</p>
            ) : (
                <Accordion type="single" collapsible className="w-full space-y-4">
                    {Object.entries(groupedContent).map(([section, items]) => (
                        <AccordionItem key={section} value={section} className="border rounded-lg px-4 bg-card">
                            <AccordionTrigger className="hover:no-underline py-4">
                                <span className="capitalize font-bold text-lg">{section}</span>
                                <span className="text-sm text-muted-foreground ml-2 font-normal">
                                    ({items.length} items)
                                </span>
                            </AccordionTrigger>
                            <AccordionContent className="pt-4 pb-4 space-y-4">
                                {items.map((item) => (
                                    <Card key={item.key}>
                                        <CardContent className="p-4 flex items-center justify-between gap-4">
                                            <div className="flex-1">
                                                <p className="text-sm font-mono text-muted-foreground mb-1">{item.key}</p>
                                                {editingKey === item.key ? (
                                                    <Textarea
                                                        value={editValue}
                                                        onChange={(e) => setEditValue(e.target.value)}
                                                        className="min-h-[100px]"
                                                    />
                                                ) : (
                                                    <p className="text-base">{item.value}</p>
                                                )}
                                            </div>
                                            <div>
                                                {editingKey === item.key ? (
                                                    <div className="flex gap-2">
                                                        <Button size="sm" onClick={() => handleSave(item.key)}>Save</Button>
                                                        <Button size="sm" variant="outline" onClick={() => setEditingKey(null)}>Cancel</Button>
                                                    </div>
                                                ) : (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => {
                                                            setEditingKey(item.key);
                                                            setEditValue(item.value);
                                                        }}
                                                    >
                                                        Edit
                                                    </Button>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            )}
        </div>
    );
};
