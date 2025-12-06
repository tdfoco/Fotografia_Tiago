import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { usePages, useTogglePageStatus } from "@/hooks/usePageVisibility";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";

const QuickMenuToggle = () => {
    const { data: pages, isLoading } = usePages();
    const toggleStatus = useTogglePageStatus();

    const handleToggle = (pageId: string, currentStatus: boolean) => {
        toggleStatus.mutate({
            pageId,
            isActive: !currentStatus
        });
    };

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-48" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-32 w-full" />
                </CardContent>
            </Card>
        );
    }

    // Mostrar apenas os primeiros 6 itens
    const displayPages = pages?.slice(0, 6) || [];
    const hasMore = (pages?.length || 0) > 6;

    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-lg">Controle do Menu</CardTitle>
                        <CardDescription className="text-sm">
                            Ative ou desative itens rapidamente
                        </CardDescription>
                    </div>
                    <Link
                        to="/admin/menu"
                        className="text-sm text-electric-blue hover:text-vibrant-purple transition-colors flex items-center gap-1"
                    >
                        Ver todos
                        <ArrowRight className="h-3 w-3" />
                    </Link>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    {displayPages.map((page) => (
                        <div
                            key={page.id}
                            className="flex items-center justify-between p-3 rounded-lg bg-secondary/20 hover:bg-secondary/30 transition-colors"
                        >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className="flex-shrink-0">
                                    {page.is_active ? (
                                        <Eye className="h-4 w-4 text-green-500" />
                                    ) : (
                                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm truncate">
                                        {page.page_name}
                                    </p>
                                    <p className="text-xs text-muted-foreground truncate">
                                        {page.page_path}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <Badge
                                    variant={page.is_active ? "default" : "secondary"}
                                    className="text-xs px-2 py-0.5"
                                >
                                    {page.is_active ? "ON" : "OFF"}
                                </Badge>
                                <Switch
                                    checked={page.is_active}
                                    onCheckedChange={() => handleToggle(page.id, page.is_active)}
                                    disabled={toggleStatus.isPending}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {hasMore && (
                    <Link
                        to="/admin/menu"
                        className="block mt-3 text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        + {(pages?.length || 0) - 6} páginas
                    </Link>
                )}
            </CardContent>
        </Card>
    );
};

export default QuickMenuToggle;
