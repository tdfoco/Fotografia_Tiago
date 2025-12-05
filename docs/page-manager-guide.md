# Gerenciador de Páginas - Guia de Uso

## 📝 Setup Inicial

### 1. Executar Script do PocketBase

Antes de usar pela primeira vez, você precisa criar a collection no PocketBase:

```bash
node scripts/setup_page_visibility.js
```

**O que o script faz:**
- Cria a collection `page_visibility` no PocketBase
- Popula com 10 páginas do menu
- Define permissões corretas
- Marca Home e Contato como páginas do sistema (não podem ser desativadas)

### 2. Certifique-se que o PocketBase está rodando

O PocketBase deve estar rodando em `http://127.0.0.1:8090`

---

## 🎯 Como Usar

### Acessar o Gerenciador

1. Faça login no admin
2. Navegue para: `https://tdfoco.cloud/admin/pages`
3. Você verá a interface do gerenciador

### Interface do Gerenciador

```
┌─────────────────────────────────────────┐
│  📊 Estatísticas                        │
│  • Páginas Ativas: 10                  │
│  • Páginas Inativas: 0                 │
│  • Páginas do Sistema: 2               │
├─────────────────────────────────────────┤
│  📋 Lista de Páginas                    │
│  [≡]  🏠  Home           Ativo     [🔒] │
│  [≡]  📸  Fotografia     Ativo     [ ✓] │
│  [≡]  🎨  Design         Ativo     [ ✓] │
│  [≡]  👤  Sobre          Ativo     [ ✓] │
│  ...                                    │
└─────────────────────────────────────────┘
```

### Funcionalidades

#### ✅ Ativar/Desativar Páginas

- Use o **toggle** (switch) à direita de cada página
- Páginas inativas não aparecem no menu
- Páginas do **sistema** (Home, Contato) têm ícone de cadeado 🔒
  - Não podem ser desativadas
  - São essenciais para o funcionamento do site

#### 🔄 Reordenar Páginas

- Clique e **arraste** o ícone de grade (≡) à esquerda
- Solte na posição desejada
- A ordem do menu atualiza automaticamente

#### 💾 Salvamento Automático

- Todas as alterações são salvas **instantaneamente**
- Notificações aparecem no canto da tela
- O menu atualiza em tempo real

---

## 🎨 Como as Páginas Aparecem no Menu

### Before (Hardcoded)
```tsx
const navLinks = [
  { name: "Home", path: "/" },
  { name: "Fotografia", path: "/photography" },
  // ... todas hardcoded
];
```

### After (Dinâmico)
```tsx
const { data: activePages } = useActivePages();

const navLinks = activePages?.map(page => ({
  name: page.page_name,
  path: page.page_path
})) || fallbackLinks;
```

**Benefícios:**
- Menu controlado pelo admin
- Sem necessidade de editar código
- Fallback automático se PocketBase estiver offline

---

## 📊 Estrutura de Dados

### Collection: `page_visibility`

```javascript
{
  id: "abc123",
  page_key: "photography",        // Identificador único
  page_name: "Fotografia",        // Nome no menu
  page_path: "/photography",      // Rota da página
  is_active: true,                // Visível ou não
  order: 2,                       // Posição no menu
  icon: "Camera",                 // Ícone Lucide
  is_system: false,               // Página do sistema?
  created: "2024-12-04...",
  updated: "2024-12-04..."
}
```

---

## 🔧 Resolução de Problemas

### Erro "Collection not found"

**Solução:** Execute o script de setup do PocketBase
```bash
node scripts/setup_page_visibility.js
```

### Menu vazio ou com fallback

**Possíveis causas:**
1. PocketBase não está rodando
2. Todas as páginas estão desativadas
3. Erro de permissão

**Verificar:**
```bash
# Verificar se o PocketBase está rodando
# Deve retornar código 200
curl http://127.0.0.1:8090/api/health
```

### Páginas não aparecem após desativar

**Isso é o comportamento esperado!**
- Páginas desativadas são **ocultadas** do menu
- Para exibir novamente, ative-as no gerenciador

---

## 🎯 Casos de Uso

### Ocultar Páginas em Construção

```
1. Acesse /admin/pages
2. Desative "Busca Visual" (exemplo)
3. Menu atualiza instantaneamente
4. Visitantes não veem a página
```

### Reordenar Menu para Destaque

```
1. Arraste "Fotografia" para o topo
2. Arraste "Contato" para o fim
3. Menu reflete nova ordem
```

### Adicionar Nova Página (Manual no PocketBase)

```
1. Acesse PocketBase Admin
2. Collection: page_visibility
3. Clique "New record"
4. Preencha:
   - page_key: unique-key
   - page_name: Nome no Menu
   - page_path: /rota
   - is_active: true
   - order: 11
   - is_system: false
5. Salvar
6. Página aparece no menu e no gerenciador
```

---

## 📈 Benefícios

✅ **Controle Total** - Gerencie menu sem editar código  
✅ **Tempo Real** - Mudanças refletem instantaneamente  
✅ **Segurança** - Páginas sistema protegidas  
✅ **Intuitivo** - Interface drag-and-drop  
✅ **Fallback** - Funciona mesmo offline  

---

## 🚀 Próximos Passos

### Deploy em Produção

```bash
git add .
git commit -m "feat: Gerenciador de Páginas com PocketBase"
git push origin main
cmd /c run_vps_build.bat
```

### Após Deploy
```bash
# SSH no VPS
ssh root@tdfoco.cloud

# Navegar para pasta do projeto
cd /home/tdfoco/htdocs/tdfoco.cloud

# Executar setup do PocketBase
node scripts/setup_page_visibility.js
```

---

Pronto! Seu gerenciador de páginas está funcionando! 🎉
