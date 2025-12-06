/**
 * usePageVisibility Hook
 * Gerencia estado e operações das páginas visíveis
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pb } from '@/lib/pocketbase';
import { toast } from 'sonner';

export interface Page {
    id: string;
    page_key: string;
    page_name: string;
    page_path: string;
    is_active: boolean;
    order: number;
    icon?: string;
    is_system: boolean;
}

/**
 * Hook para buscar todas as páginas
 */
export const usePages = () => {
    return useQuery({
        queryKey: ['pages'],
        queryFn: async () => {
            const records = await pb.collection('page_visibility').getFullList<Page>({
                sort: '+order',
            });
            return records;
        },
    });
};

/**
 * Hook para buscar apenas páginas ativas (para o menu)
 */
export const useActivePages = () => {
    return useQuery({
        queryKey: ['active-pages'],
        queryFn: async () => {
            const records = await pb.collection('page_visibility').getFullList<Page>({
                filter: 'is_active = true',
                sort: '+order',
            });
            return records;
        },
    });
};

/**
 * Hook para toggle ativo/inativo de uma página
 */
export const useTogglePageStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ pageId, isActive }: { pageId: string; isActive: boolean }) => {
            const record = await pb.collection('page_visibility').update(pageId, {
                is_active: isActive,
            });
            return record;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['pages'] });
            queryClient.invalidateQueries({ queryKey: ['active-pages'] });

            toast.success(
                data.is_active
                    ? `Página "${data.page_name}" ativada`
                    : `Página "${data.page_name}" desativada`
            );
        },
        onError: (error) => {
            console.error('Error toggling page status:', error);
            toast.error('Erro ao atualizar status da página');
        },
    });
};

/**
 * Hook para reordenar páginas
 */
export const useReorderPages = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (pages: Page[]) => {
            // Atualizar ordem de todas as páginas
            const promises = pages.map((page, index) =>
                pb.collection('page_visibility').update(page.id, {
                    order: index + 1,
                })
            );

            await Promise.all(promises);
            return pages;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pages'] });
            queryClient.invalidateQueries({ queryKey: ['active-pages'] });
            toast.success('Ordem das páginas atualizada');
        },
        onError: (error) => {
            console.error('Error reordering pages:', error);
            toast.error('Erro ao reordenar páginas');
        },
    });
};

/**
 * Hook para atualizar uma página
 */
export const useUpdatePage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ pageId, data }: { pageId: string; data: Partial<Page> }) => {
            const record = await pb.collection('page_visibility').update(pageId, data);
            return record;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pages'] });
            queryClient.invalidateQueries({ queryKey: ['active-pages'] });
            toast.success('Página atualizada com sucesso');
        },
        onError: (error) => {
            console.error('Error updating page:', error);
            toast.error('Erro ao atualizar página');
        },
    });
};
