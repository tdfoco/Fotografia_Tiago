# Sistema de Contagem de Comentários

## Como Funciona

### 1. Banco de Dados (Supabase)
- As tabelas `photography` e `design_projects` têm a coluna `comments_count`
- A tabela `comments` armazena todos os comentários com a coluna `approved`
- **TRIGGER AUTOMÁTICO**: Quando um comentário é aprovado/rejeitado/deletado, a contagem é atualizada automaticamente no banco de dados via trigger SQL

### 2. Scripts SQL Necessários
Você precisa executar estes scripts no Supabase SQL Editor (nesta ordem):

1. **`complete_social_setup.sql`** - Cria as tabelas e colunas básicas
2. **`update_comments_count_trigger.sql`** - Cria o trigger que atualiza automaticamente a contagem
3. **`fix_comment_counts.sql`** - Corrige valores NULL e recalcula contagens existentes

### 3. Fluxo de Funcionamento

#### Quando um usuário faz um comentário:
1. Comentário é inserido com `approved = false`
2. Contagem **NÃO muda** (trigger ignora comentários não aprovados)
3. Usuário vê mensagem "Aguardando aprovação"

#### Quando admin aprova o comentário:
1. Admin clica em "Aprovar" no painel de administração (`/admin`)
2. O campo `approved` muda para `true` no banco de dados
3. **TRIGGER executa automaticamente** e incrementa `comments_count` no banco
4. O admin vê a lista de pendentes atualizar (comentário some da lista)

#### Para ver a contagem atualizada nas fotos:
1. **Opção 1 (Manual)**: Atualizar a página (F5)
2. **Opção 2 (Automático)**: O sistema recarrega os dados automaticamente quando você navega entre páginas

### 4. Verificando se está Funcionando

Execute este script no Supabase para testar:

```sql
-- Ver uma foto e seus comentários
SELECT 
    p.id, 
    p.title, 
    p.comments_count as contador_armazenado,
    (SELECT count(*) FROM comments WHERE photo_id = p.id AND approved = true) as contador_real
FROM photography p 
LIMIT 5;
```

Se `contador_armazenado` = `contador_real`, o sistema está funcionando corretamente!

### 5. Problemas Comuns

#### "A contagem não atualiza"
**Solução**: Execute o script `fix_comment_counts.sql` no Supabase. Isso corrige valores NULL e recalcula tudo.

#### "A contagem some quando rejeito um comentário"
**Comportamento correto**: Se o comentário estava aprovado e você o rejeitou, a contagem diminui.

#### "Não vejo a nova contagem nas fotos"
**Solução**: Atualize a página. O banco de dados já tem a contagem correta, mas a interface precisa recarregar.

### 6. Estrutura de Código

- **Trigger**: `update_comments_count_trigger.sql`
- **Frontend (contadores)**: `src/components/InteractionBar.tsx`
- **Admin (aprovação)**: `src/pages/Admin.tsx` (componente `CommentManagement`)
- **Hooks**: `src/hooks/useSupabaseData.ts` (função `useAdminComments`)
