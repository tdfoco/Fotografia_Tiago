import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, Star, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { pb } from "@/lib/pocketbase";
import { toast } from "sonner";

interface Testimonial {
    id: string;
    name: string;
    role: string;
    content: string;
    rating: number;
    active: boolean;
    featured: boolean;
}

const TestimonialsPage = () => {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        role: "",
        content: "",
        rating: 5,
        active: true,
        featured: false
    });

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        try {
            const records = await pb.collection('testimonials').getFullList<Testimonial>({
                sort: '-created',
            });
            setTestimonials(records);
        } catch (error) {
            console.error("Error fetching testimonials:", error);
            // toast.error("Erro ao carregar depoimentos");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            if (editingId) {
                await pb.collection('testimonials').update(editingId, formData);
                toast.success("Depoimento atualizado!");
            } else {
                await pb.collection('testimonials').create(formData);
                toast.success("Depoimento criado!");
            }
            setIsDialogOpen(false);
            fetchTestimonials();
            resetForm();
        } catch (error) {
            toast.error("Erro ao salvar");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir?")) return;
        try {
            await pb.collection('testimonials').delete(id);
            toast.success("Excluído com sucesso");
            fetchTestimonials();
        } catch (error) {
            toast.error("Erro ao excluir");
        }
    };

    const handleEdit = (testimonial: Testimonial) => {
        setEditingId(testimonial.id);
        setFormData({
            name: testimonial.name,
            role: testimonial.role,
            content: testimonial.content,
            rating: testimonial.rating,
            active: testimonial.active,
            featured: testimonial.featured
        });
        setIsDialogOpen(true);
    };

    const resetForm = () => {
        setEditingId(null);
        setFormData({
            name: "",
            role: "",
            content: "",
            rating: 5,
            active: true,
            featured: false
        });
    };

    const filtered = testimonials.filter(t =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold text-white">Depoimentos</h1>
                    <p className="text-gray-400">Gerencie as avaliações dos seus clientes</p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                    setIsDialogOpen(open);
                    if (!open) resetForm();
                }}>
                    <DialogTrigger asChild>
                        <Button className="bg-electric-blue hover:bg-electric-blue/80 text-white">
                            <Plus className="mr-2 h-4 w-4" /> Novo Depoimento
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-black/90 border-white/10 text-white">
                        <DialogHeader>
                            <DialogTitle>{editingId ? "Editar Depoimento" : "Novo Depoimento"}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Nome</Label>
                                    <Input
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="bg-secondary/20 border-white/10"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Cargo / Empresa</Label>
                                    <Input
                                        value={formData.role}
                                        onChange={e => setFormData({ ...formData, role: e.target.value })}
                                        className="bg-secondary/20 border-white/10"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Depoimento</Label>
                                <Textarea
                                    value={formData.content}
                                    onChange={e => setFormData({ ...formData, content: e.target.value })}
                                    className="bg-secondary/20 border-white/10 h-32"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Avaliação (1-5)</Label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <Star
                                            key={star}
                                            className={`cursor-pointer h-6 w-6 ${star <= formData.rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-600'}`}
                                            onClick={() => setFormData({ ...formData, rating: star })}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4">
                                <div className="flex items-center gap-2">
                                    <Switch
                                        checked={formData.active}
                                        onCheckedChange={c => setFormData({ ...formData, active: c })}
                                    />
                                    <Label>Visível no site</Label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Switch
                                        checked={formData.featured}
                                        onCheckedChange={c => setFormData({ ...formData, featured: c })}
                                    />
                                    <Label>Destaque (Home)</Label>
                                </div>
                            </div>

                            <Button onClick={handleSave} className="w-full bg-electric-blue hover:bg-electric-blue/80 mt-4">
                                Salvar
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* List */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filtered.map((t) => (
                    <div key={t.id} className="bg-secondary/10 border border-white/5 rounded-xl p-6 space-y-4 hover:border-electric-blue/30 transition-all">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-white">{t.name}</h3>
                                <p className="text-sm text-gray-400">{t.role}</p>
                            </div>
                            <div className="flex gap-1">
                                {[...Array(t.rating)].map((_, i) => (
                                    <Star key={i} className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                                ))}
                            </div>
                        </div>

                        <p className="text-gray-300 text-sm italic line-clamp-3">"{t.content}"</p>

                        <div className="flex justify-between items-center pt-4 border-t border-white/5">
                            <div className="flex gap-2">
                                {t.active ? (
                                    <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                        <Eye className="h-3 w-3" /> Visível
                                    </span>
                                ) : (
                                    <span className="bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                        <EyeOff className="h-3 w-3" /> Oculto
                                    </span>
                                )}
                                {t.featured && (
                                    <span className="bg-yellow-500/20 text-yellow-400 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                        <Star className="h-3 w-3" /> Destaque
                                    </span>
                                )}
                            </div>

                            <div className="flex gap-2">
                                <Button variant="ghost" size="sm" onClick={() => handleEdit(t)}>
                                    <Edit className="h-4 w-4 text-gray-400 hover:text-white" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleDelete(t.id)}>
                                    <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-500" />
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TestimonialsPage;
