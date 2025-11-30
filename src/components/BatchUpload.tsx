import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { uploadImage, PHOTOGRAPHY_BUCKET, DESIGN_BUCKET, HERO_BUCKET, supabase } from '@/lib/supabase';
import { Loader2, Upload, X, Calendar, Tag } from 'lucide-react';
import TagInput from '@/components/TagInput';

type UploadType = 'photography' | 'design' | 'hero';

interface BatchUploadProps {
    type: UploadType;
    onComplete: () => void;
    onCancel: () => void;
}

const BatchUpload = ({ type, onComplete, onCancel }: BatchUploadProps) => {
    const { toast } = useToast();
    const [files, setFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    // Common fields for all uploads
    const [eventName, setEventName] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [tags, setTags] = useState<string[]>([]);

    // Photography-specific
    const [category, setCategory] = useState<string>('portraits');

    // Design-specific
    const [designCategory, setDesignCategory] = useState<string>('logos');
    const [projectTitle, setProjectTitle] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [projectYear, setProjectYear] = useState(new Date().getFullYear());
    const [client, setClient] = useState('');

    // Hero-specific
    const [heroPage, setHeroPage] = useState<string>('home');
    const [heroActive, setHeroActive] = useState(true);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(Array.from(e.target.files));
        }
    };

    const removeFile = (index: number) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (files.length === 0) return;

        setUploading(true);
        setUploadProgress(0);

        try {
            if (type === 'photography') {
                await uploadPhotographyBatch();
            } else if (type === 'design') {
                await uploadDesignBatch();
            } else if (type === 'hero') {
                await uploadHeroBatch();
            }

            toast({
                title: 'Success!',
                description: `${files.length} arquivo(s) enviado(s) com sucesso!`,
            });

            onComplete();
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

    const uploadPhotographyBatch = async () => {
        const total = files.length;

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const url = await uploadImage(PHOTOGRAPHY_BUCKET, file);

            await supabase.from('photography').insert({
                url,
                title: file.name.replace(/\.[^/.]+$/, ''), // Remove extension
                category,
                description: `Evento: ${eventName || 'N/A'}`,
                event_name: eventName || null,
                event_date: eventDate || null,
                tags: tags.length > 0 ? tags : null,
                year: eventDate ? new Date(eventDate).getFullYear() : new Date().getFullYear(),
            });

            setUploadProgress(((i + 1) / total) * 100);
        }
    };

    const uploadDesignBatch = async () => {
        // For design, upload all files as a single project
        const imageUrls = [];
        const total = files.length;

        for (let i = 0; i < files.length; i++) {
            const url = await uploadImage(DESIGN_BUCKET, files[i]);
            imageUrls.push(url);
            setUploadProgress(((i + 1) / total) * 100);
        }

        await supabase.from('design_projects').insert({
            images: imageUrls,
            category: designCategory,
            title: projectTitle,
            description: projectDescription + (eventName ? `\nEvento: ${eventName}` : ''),
            year: projectYear,
            client: client || null,
            event_name: eventName || null,
            event_date: eventDate || null,
        });
    };

    const uploadHeroBatch = async () => {
        const total = files.length;

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const url = await uploadImage(HERO_BUCKET, file);

            await supabase.from('hero_images').insert({
                url,
                page: heroPage,
                active: heroActive,
                event_name: eventName || null,
                event_date: eventDate || null,
            });

            setUploadProgress(((i + 1) / total) * 100);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    Upload em Lote - {type === 'photography' ? 'Fotografia' : type === 'design' ? 'Design' : 'Hero'}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* File Selection */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Selecionar Arquivos ({files.length} selecionados)
                        </label>
                        <Input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleFileChange}
                            required
                        />
                    </div>

                    {/* Preview selected files */}
                    {files.length > 0 && (
                        <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto p-2 border rounded">
                            {files.map((file, index) => (
                                <div key={index} className="relative group">
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt={file.name}
                                        className="w-full h-20 object-cover rounded"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeFile(index)}
                                        className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Common Fields */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                                <Calendar size={16} />
                                Nome do Evento (opcional)
                            </label>
                            <Input
                                value={eventName}
                                onChange={(e) => setEventName(e.target.value)}
                                placeholder="Ex: Casamento João e Maria"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Data do Evento (opcional)</label>
                            <Input
                                type="date"
                                value={eventDate}
                                onChange={(e) => setEventDate(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Photography-specific fields */}
                    {type === 'photography' && (
                        <>
                            <div>
                                <label className="block text-sm font-medium mb-2">Categoria</label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full px-4 py-2 rounded-md border border-input bg-background"
                                >
                                    <option value="portraits">Retratos</option>
                                    <option value="urban">Urbano</option>
                                    <option value="nature">Natureza</option>
                                    <option value="art">Arte</option>
                                    <option value="events">Eventos</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                                    <Tag size={16} />
                                    Tags (aplicadas a todas as fotos)
                                </label>
                                <TagInput
                                    tags={tags}
                                    onChange={setTags}
                                    placeholder="Ex: casamento, festa, família"
                                />
                            </div>
                        </>
                    )}

                    {/* Design-specific fields */}
                    {type === 'design' && (
                        <>
                            <div>
                                <label className="block text-sm font-medium mb-2">Categoria</label>
                                <select
                                    value={designCategory}
                                    onChange={(e) => setDesignCategory(e.target.value)}
                                    className="w-full px-4 py-2 rounded-md border border-input bg-background"
                                >
                                    <option value="logos">Logos</option>
                                    <option value="visual_identity">Identidade Visual</option>
                                    <option value="social_media">Redes Sociais</option>
                                    <option value="posters">Pôsteres</option>
                                    <option value="special">Especial</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Título do Projeto</label>
                                <Input
                                    value={projectTitle}
                                    onChange={(e) => setProjectTitle(e.target.value)}
                                    required
                                    placeholder="Ex: Identidade Visual Empresa X"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Descrição</label>
                                <Input
                                    value={projectDescription}
                                    onChange={(e) => setProjectDescription(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Ano</label>
                                    <Input
                                        type="number"
                                        value={projectYear}
                                        onChange={(e) => setProjectYear(parseInt(e.target.value))}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Cliente (opcional)</label>
                                    <Input
                                        value={client}
                                        onChange={(e) => setClient(e.target.value)}
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {/* Hero-specific fields */}
                    {type === 'hero' && (
                        <>
                            <div>
                                <label className="block text-sm font-medium mb-2">Página</label>
                                <select
                                    value={heroPage}
                                    onChange={(e) => setHeroPage(e.target.value)}
                                    className="w-full px-4 py-2 rounded-md border border-input bg-background"
                                >
                                    <option value="home">Home</option>
                                    <option value="photography">Photography</option>
                                    <option value="design">Design</option>
                                    <option value="about">About</option>
                                    <option value="services">Services</option>
                                    <option value="contact">Contact</option>
                                </select>
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={heroActive}
                                    onChange={(e) => setHeroActive(e.target.checked)}
                                    id="heroActive"
                                />
                                <label htmlFor="heroActive" className="text-sm font-medium">
                                    Ativar imagens
                                </label>
                            </div>
                        </>
                    )}

                    {/* Progress bar */}
                    {uploading && (
                        <div className="w-full bg-secondary rounded-full h-2.5">
                            <div
                                className="bg-accent h-2.5 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                            />
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                        <Button type="submit" disabled={uploading || files.length === 0} className="flex-1">
                            {uploading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Enviando {Math.round(uploadProgress)}%
                                </>
                            ) : (
                                <>
                                    <Upload className="mr-2 h-4 w-4" />
                                    Enviar {files.length} arquivo(s)
                                </>
                            )}
                        </Button>
                        <Button type="button" variant="outline" onClick={onCancel} disabled={uploading}>
                            Cancelar
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default BatchUpload;
