import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GripVertical, Eye, EyeOff, Save, RotateCcw } from "lucide-react";
import { usePages, useTogglePageStatus, useUpdatePage } from "@/hooks/usePageVisibility";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const MenuManagementPage = () => {
    const { data: pages, isLoading } = usePages();
    const toggleStatus = useTogglePageStatus();
    const updatePage = useUpdatePage();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState({ page_name: "", page_path: "" });

    const handleToggle = (pageId: string, currentStatus: boolean) => {
        toggleStatus.mutate({
            pageId,
            isActive: !currentStatus
        });
    };

    const handleEdit = (page: any) => {
        setEditingId(page.id);
        setEditForm({
            page_name: page.page_name,
            page_path: page.page_path
        });
    };

    const handleSave = (pageId: string) => {
        updatePage.mutate({
            pageId,
            data: editForm
        }, {
            onSuccess: () => {
                setEditingId(null);
                toast.success("Página atualizada!");
            }
        });
    };

    const handleCancel = () => {
        setEditingId(null);
    };

    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-64 w-full" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Menu</h1>
                <p className="text-muted-foreground mt-2">
                    Controle a visibilidade e ordem dos itens do menu de navegação
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Itens do Menu</CardTitle>
                    <CardDescription>
                        Ative ou desative itens para controlar o que aparece no menu principal
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {pages?.map((page) => (
                            <div
                                key={page.id}
                                className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
                            >
                                {/* Drag Handle */}
                                <div className="cursor-grab text-muted-foreground hover:text-foreground">
                                    <GripVertical className="h-5 w-5" />
                                </div>

                                {/* Order Number */}
                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted text-sm font-medium">
                                    {page.order}
                                </div>

                                {/* Page Info */}
                                <div className="flex-1 space-y-1">
                                    {editingId === page.id ? (
                                        <div className="space-y-2">
                                            <div>
                                                <Label htmlFor={`name-${page.id}`} className="text-xs">Nome</Label>
                                                <Input
                                                    id={`name-${page.id}`}
                                                    value={editForm.page_name}
                                                    onChange={(e) => setEditForm({ ...editForm, page_name: e.target.value })}
                                                    className="h-8"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor={`path-${page.id}`} className="text-xs">Caminho</Label>
                                                <Input
                                                    id={`path-${page.id}`}
                                                    value={editForm.page_path}
                                                    onChange={(e) => setEditForm({ ...editForm, page_path: e.target.value })}
                                                    className="h-8"
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">{page.page_name}</span>
                                                {page.is_system && (
                                                    <Badge variant="outline" className="text-xs">
                                                        Sistema
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground font-mono">
                                                {page.page_path}
                                            </p>
                                        </>
                                    )}
                                </div>

                                {/* Status Badge */}
                                <Badge
                                    variant={page.is_active ? "default" : "secondary"}
                                    className="flex items-center gap-1.5"
                                >
                                    {page.is_active ? (
                                        <>
                                            <Eye className="h-3 w-3" />
                                            Ativo
                                        </>
                                    ) : (
                                        <>
                                            <EyeOff className="h-3 w-3" />
                                            Inativo
                                        </>
                                    )}
                                </Badge>

                                {/* Actions */}
                                <div className="flex items-center gap-2">
                                    {editingId === page.id ? (
                                        <>
                                            <Button
                                                size="sm"
                                                variant="default"
                                                onClick={() => handleSave(page.id)}
                                            >
                                                <Save className="h-4 w-4 mr-1" />
                                                Salvar
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={handleCancel}
                                            >
                                                <RotateCcw className="h-4 w-4 mr-1" />
                                                Cancelar
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => handleEdit(page)}
                                            >
                                                Editar
                                            </Button>
                                            <Switch
                                                checked={page.is_active}
                                                onCheckedChange={() => handleToggle(page.id, page.is_active)}
                                                disabled={toggleStatus.isPending}
                                            />
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {pages && pages.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
                            <p>Nenhuma página encontrada</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Info Box */}
            <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-900">
                <CardHeader>
                    <CardTitle className="text-blue-900 dark:text-blue-100 flex items-center gap-2">
                        💡 Dicas
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2 text-blue-800 dark:text-blue-200">
                    <p>• <strong>Toggle ON/OFF:</strong> Use o switch para ativar ou desativar páginas no menu</p>
                    <p>• <strong>Ordem:</strong> O número à esquerda indica a posição no menu</p>
                    <p>• <strong>Editar:</strong> Clique em "Editar" para mudar o nome ou caminho</p>
                    <p>• <strong>Sistema:</strong> Páginas marcadas como "Sistema" são essenciais</p>
                    <p>• <strong>Mudanças Imediatas:</strong> Alterações aparecem instantaneamente no menu do site</p>
                </CardContent>
            </Card>
        </div>
    );
};

export default MenuManagementPage;
