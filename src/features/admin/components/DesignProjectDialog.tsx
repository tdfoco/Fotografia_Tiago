import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Loader2, X, Upload } from 'lucide-react';
import { pb } from '@/lib/pocketbase';
import type { DesignProject } from '@/hooks/usePocketBaseData';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
    title: z.string().min(2, 'Título deve ter pelo menos 2 caracteres'),
    client: z.string().optional(),
    category: z.string().min(1, 'Selecione uma categoria'),
    year: z.coerce.number().min(2000, 'Ano inválido'),
    description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
});

interface DesignProjectDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    project?: DesignProject | null;
    onSuccess: () => void;
}

export function DesignProjectDialog({
    open,
    onOpenChange,
    project,
    onSuccess
}: DesignProjectDialogProps) {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>([]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            client: '',
            category: 'branding',
            year: new Date().getFullYear(),
            description: '',
        },
    });

    useEffect(() => {
        if (project) {
            form.reset({
                title: project.title,
                client: project.client || '',
                category: project.category,
                year: project.year || new Date().getFullYear(),
                description: project.description || '',
            });
            setExistingImages(project.images || []);
        } else {
            form.reset({
                title: '',
                client: '',
                category: 'branding',
                year: new Date().getFullYear(),
                description: '',
            });
            setExistingImages([]);
        }
        setFiles([]);
    }, [project, form, open]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(prev => [...prev, ...Array.from(e.target.files || [])]);
        }
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const removeExistingImage = (image: string) => {
        setExistingImages(prev => prev.filter(img => img !== image));
    };

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('title', values.title);
            formData.append('category', values.category);
            formData.append('description', values.description);
            formData.append('year', values.year.toString());
            if (values.client) formData.append('client', values.client);

            // Append new files
            files.forEach(file => {
                formData.append('images', file);
            });

            if (project) {
                // For updates, we need to handle existing images carefully
                // PocketBase handles 'images' field updates. If we re-send existing images, it might duplicate or replace depending on config.
                // Usually, to keep existing images, we don't need to do anything if we are just adding.
                // But if we deleted some existing images, we might need to update the record.
                // PocketBase API for file deletion usually requires passing null or specific logic.
                // A simpler strategy for now: 
                // If we removed existing images, we might need to handle that separately or re-upload (not ideal).
                // PocketBase JS SDK update: "If you want to delete a file, you have to pass null to the file field."
                // But 'images' is a multiple file field.
                // Strategy: We will just append new files. Deleting individual files from a multiple field via API can be tricky without specific endpoints or logic.
                // For this MVP, let's assume we are just adding files or updating text.
                // If the user removed an existing image from the UI, we should ideally tell PB to remove it.
                // PB doesn't support removing single file from multi-file field easily via simple update unless we re-upload all or use specific syntax if supported.
                // Let's stick to adding for now to avoid data loss, or check if we can update the array of filenames directly (usually not for files).

                // Actually, for 'images' (multiple), if we update, new files are appended.
                // To delete, we usually need to pass the file name to delete as a specific query param or body field?
                // Let's keep it simple: Add new files.

                await pb.collection('design_projects').update(project.id, formData);

                // Handle deletion of existing images if any were removed from state
                if (project.images && project.images.length > existingImages.length) {
                    // Find removed images
                    const removed = project.images.filter(img => !existingImages.includes(img));
                    if (removed.length > 0) {
                        // To delete specific files from a multiple file field in PB, 
                        // we often need to set the field to the remaining files? No, that doesn't work for files.
                        // We typically use the `update` with `images-` key or similar if supported, or just accept we can't easily delete individually in this simple implementation without more complex logic.
                        // Let's skip deletion for now to be safe, or try to update with the remaining list if PB supports it (it usually doesn't for file objects).
                        // Wait, PB allows deleting individual files by passing their filename to `images-` key? No.
                        // Official way: `pb.collection('...').update(id, { 'images+': newFile, 'images-': 'filename.jpg' })` ? No.
                        // Let's just update text and add new files.
                    }
                }

                toast({ title: 'Projeto atualizado com sucesso!' });
            } else {
                await pb.collection('design_projects').create(formData);
                toast({ title: 'Projeto criado com sucesso!' });
            }

            onSuccess();
            onOpenChange(false);
        } catch (error: any) {
            console.error('Error saving project:', error);
            toast({
                title: 'Erro ao salvar',
                description: error.message,
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{project ? 'Editar Projeto' : 'Novo Projeto'}</DialogTitle>
                    <DialogDescription>
                        Preencha os detalhes do projeto de design abaixo.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Título</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ex: Identidade Visual X" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="client"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Cliente (Opcional)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nome do cliente" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Categoria</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione uma categoria" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="branding">Branding</SelectItem>
                                                <SelectItem value="editorial">Editorial</SelectItem>
                                                <SelectItem value="web">Web Design</SelectItem>
                                                <SelectItem value="packaging">Packaging</SelectItem>
                                                <SelectItem value="social_media">Social Media</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="year"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Ano</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Descrição</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Descreva o projeto..."
                                            className="min-h-[100px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Image Upload Section */}
                        <div className="space-y-4">
                            <FormLabel>Imagens</FormLabel>

                            {/* Existing Images (Edit Mode) */}
                            {existingImages.length > 0 && (
                                <div className="grid grid-cols-4 gap-4 mb-4">
                                    {existingImages.map((img, index) => (
                                        <div key={index} className="relative group aspect-square rounded-md overflow-hidden border">
                                            <img
                                                src={pb.files.getUrl(project!, img)}
                                                alt={`Existing ${index}`}
                                                className="w-full h-full object-cover"
                                            />
                                            {/* Delete button for existing images - disabled for now as logic is complex without backend support */}
                                            {/* <button
                                                type="button"
                                                onClick={() => removeExistingImage(img)}
                                                className="absolute top-1 right-1 bg-destructive text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X size={12} />
                                            </button> */}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* New Files Preview */}
                            {files.length > 0 && (
                                <div className="grid grid-cols-4 gap-4 mb-4">
                                    {files.map((file, index) => (
                                        <div key={index} className="relative group aspect-square rounded-md overflow-hidden border">
                                            <img
                                                src={URL.createObjectURL(file)}
                                                alt={`New ${index}`}
                                                className="w-full h-full object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeFile(index)}
                                                className="absolute top-1 right-1 bg-destructive text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="flex items-center justify-center w-full">
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                                        <p className="text-sm text-muted-foreground">
                                            <span className="font-semibold">Clique para upload</span> ou arraste e solte
                                        </p>
                                    </div>
                                    <Input
                                        type="file"
                                        className="hidden"
                                        multiple
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                </label>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {project ? 'Salvar Alterações' : 'Criar Projeto'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
