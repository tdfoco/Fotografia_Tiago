import { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Button } from '@/components/ui/button';
import { Save, Eye, Code } from 'lucide-react';
import { toast } from 'sonner';

interface ContentEditorProps {
    initialContent?: string;
    onSave?: (content: string) => void;
    autoSave?: boolean;
    autoSaveInterval?: number; // milliseconds
    placeholder?: string;
}

const ContentEditor = ({
    initialContent = '',
    onSave,
    autoSave = true,
    autoSaveInterval = 30000,
    placeholder = 'Digite seu conteúdo aqui...'
}: ContentEditorProps) => {
    const [content, setContent] = useState(initialContent);
    const [showPreview, setShowPreview] = useState(false);
    const [showSource, setShowSource] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Quill modules configuration
    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'font': [] }],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'script': 'sub' }, { 'script': 'super' }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            [{ 'direction': 'rtl' }],
            [{ 'align': [] }],
            ['link', 'image', 'video'],
            ['blockquote', 'code-block'],
            ['clean']
        ],
        clipboard: {
            matchVisual: false
        }
    };

    const formats = [
        'header', 'font', 'size',
        'bold', 'italic', 'underline', 'strike',
        'color', 'background',
        'script',
        'list', 'bullet', 'indent',
        'direction', 'align',
        'link', 'image', 'video',
        'blockquote', 'code-block'
    ];

    // Auto-save effect
    useEffect(() => {
        if (!autoSave || !onSave) return;

        const timer = setInterval(() => {
            if (content !== initialContent) {
                handleSave();
            }
        }, autoSaveInterval);

        return () => clearInterval(timer);
    }, [content, autoSave, autoSaveInterval]);

    const handleSave = async () => {
        if (!onSave) return;

        setIsSaving(true);
        try {
            await onSave(content);
            setLastSaved(new Date());
            toast.success('Conteúdo salvo com sucesso!');
        } catch (error) {
            console.error('Error saving content:', error);
            toast.error('Erro ao salvar conteúdo');
        } finally {
            setIsSaving(false);
        }
    };

    const formatLastSaved = () => {
        if (!lastSaved) return 'Nunca';

        const now = new Date();
        const diff = Math.floor((now.getTime() - lastSaved.getTime()) / 1000);

        if (diff < 60) return 'Agora mesmo';
        if (diff < 3600) return `${Math.floor(diff / 60)} min atrás`;
        return lastSaved.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg border border-border">
                <div className="flex items-center gap-2">
                    <Button
                        variant={showPreview ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => {
                            setShowPreview(!showPreview);
                            setShowSource(false);
                        }}
                    >
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                    </Button>
                    <Button
                        variant={showSource ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => {
                            setShowSource(!showSource);
                            setShowPreview(false);
                        }}
                    >
                        <Code className="w-4 h-4 mr-2" />
                        Código
                    </Button>
                </div>

                <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                        Último salvamento: {formatLastSaved()}
                    </span>
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        size="sm"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        {isSaving ? 'Salvando...' : 'Salvar'}
                    </Button>
                </div>
            </div>

            {/* Editor / Preview / Source */}
            <div className="border border-border rounded-lg overflow-hidden bg-background">
                {showPreview ? (
                    <div
                        className="prose prose-invert max-w-none p-6"
                        dangerouslySetInnerHTML={{ __html: content }}
                    />
                ) : showSource ? (
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full min-h-[500px] p-6 bg-secondary/20 text-foreground font-mono text-sm resize-vertical focus:outline-none"
                        spellCheck={false}
                    />
                ) : (
                    <ReactQuill
                        theme="snow"
                        value={content}
                        onChange={setContent}
                        modules={modules}
                        formats={formats}
                        placeholder={placeholder}
                        className="content-editor"
                    />
                )}
            </div>

            {/* Character count */}
            <div className="flex justify-end">
                <span className="text-sm text-muted-foreground">
                    {content.replace(/<[^>]*>/g, '').length} caracteres
                </span>
            </div>

            {/* Custom Styles */}
            <style>{`
                .content-editor .ql-container {
                    min-height: 400px;
                    font-size: 16px;
                }
                
                .content-editor .ql-editor {
                    min-height: 400px;
                }

                .content-editor .ql-toolbar {
                    background: hsl(var(--secondary) / 0.3);
                    border-color: hsl(var(--border));
                }

                .content-editor .ql-container {
                    border-color: hsl(var(--border));
                    background: hsl(var(--background));
                }

                .content-editor .ql-editor {
                    color: hsl(var(--foreground));
                }

                .content-editor .ql-editor.ql-blank::before {
                    color: hsl(var(--muted-foreground));
                }
            `}</style>
        </div>
    );
};

export default ContentEditor;
