# 📸 tdfoco - Portfólio de Fotografia e Design

Portfolio profissional de fotografia e design gráfico de **Tiago Damasceno** com funcionalidades avançadas de PWA, proteção de imagens, busca inteligente e automação por IA.

🌐 **Website:** [tdfoco.cloud](https://tdfoco.cloud)

---

## ✨ Funcionalidades Principais

### 🔥 Progressive Web App (PWA)
- ✅ Instalável em dispositivos móveis e desktop
- ✅ Funcionalidade offline com service worker
- ✅ Cache inteligente de assets, imagens e API
- ✅ Splash screen personalizada

### 🔍 Full-Text Search Avançado
- ✅ Busca 10x mais rápida com PostgreSQL `tsvector`
- ✅ Ranking de relevância automático
- ✅ Suporte a português brasileiro (stemming)
- ✅ Busca em múltiplos campos simultaneamente

### 🖼️ Proteção de Imagens Multi-Nível
- ✅ Imagens low-res (800px) servidas publicamente
- ✅ High-res (original) apenas para usuários autenticados
- ✅ Carregamento progressivo (thumbnail → low → high)
- ✅ Watermark automático em imagens públicas
- ✅ Proteção contra download (click direito, arrastar)

### ❤️ Sistema de Favoritos
- ✅ Usuários podem salvar fotografias e projetos
- ✅ RLS garante privacidade total
- ✅ Contadores automáticos via triggers SQL
- ✅ Optimistic updates para UX fluida
- ✅ Página dedicada de favoritos

### 🤖 Automação com IA
- ✅ Geração automática de alt text baseada em EXIF
- ✅ Criação de meta tags SEO otimizadas
- ✅ Sugestão inteligente de tags
- ✅ Geração de descrições automáticas
- ✅ Análise de sentimento em comentários
- ✅ Preview de SEO (Google, Facebook, Twitter)

---

## 🛠️ Stack Tecnológica

### Frontend
- **React 18** - Framework principal
- **TypeScript 5.8.3** - Type safety
- **Vite 5.4** - Build tool ultra-rápido
- **Tailwind CSS** - Utility-first CSS
- **shadcn/ui** (Radix UI) - Componentes acessíveis

### Backend & Banco de Dados
- **Supabase** - Backend as a Service
  - PostgreSQL (banco relacional)
  - Row Level Security (RLS)
  - Storage para imagens
  - Auth para autenticação
  - Edge Functions (futuro)

### PWA & Performance
- **vite-plugin-pwa** - Service worker automático
- **Workbox** - Estratégias de cache
- **React Router** - Code splitting por rota
- **React Query** - Cache de API

### Bibliotecas Especiais
- **exifr** - Extração de metadados EXIF
- **react-helmet-async** - Meta tags dinâmicas
- **lucide-react** - Ícones modernos
- **sonner** - Toast notifications
- **date-fns** - Manipulação de datas

---

## 📁 Estrutura do Projeto

```
c:\Users\Tiago\Documents\Portifolio\
├── public/
│   ├── manifest.json          # Manifesto PWA
│   ├── favicon.png            # Ícones
│   └── robots.txt
├── src/
│   ├── components/            # Componentes React
│   │   ├── ui/               # Componentes shadcn/ui
│   │   ├── PhotoGrid.tsx     # Galeria de fotos
│   │   ├── DesignGrid.tsx    # Galeria de design
│   │   ├── ProtectedImage.tsx # Componente de imagem protegida
│   │   ├── FavoriteButton.tsx # Botão de favoritar
│   │   ├── SEOPreview.tsx    # Preview de meta tags
│   │   └── ...
│   ├── pages/                # Páginas da aplicação
│   │   ├── Index.tsx         # Home
│   │   ├── Photography.tsx   # Galeria fotografia
│   │   ├── GraphicDesign.tsx # Galeria design
│   │   ├── Favorites.tsx     # Página de favoritos
│   │   ├── Admin.tsx         # Painel admin (1493 linhas)
│   │   └── ...
│   ├── hooks/                # Custom hooks
│   │   ├── useSupabaseData.ts  # Hooks de dados
│   │   ├── useFavorites.ts     # Hook de favoritos
│   │   ├── useSearch.ts        # Hook de busca
│   │   ├── useImageLoader.ts   # Carregamento progressivo
│   │   └── useImageProtection.ts
│   ├── lib/                  # Bibliotecas e utils
│   │   ├── supabase.ts       # Cliente Supabase
│   │   ├── aiHelpers.ts      # Funções de IA
│   │   ├── exifExtractor.ts  # Extração EXIF
│   │   └── utils.ts
│   ├── contexts/             # React contexts
│   │   └── LanguageContext.tsx
│   ├── App.tsx               # Componente principal
│   └── main.tsx              # Entry point
├── *.sql                     # Migrations Supabase
│   ├── image-optimization.sql
│   ├── fulltext-search.sql
│   └── favorites-system.sql
├── vite.config.ts            # Config Vite + PWA
├── tailwind.config.ts        # Config Tailwind
└── package.json
```

---

## 🚀 Desenvolvimento Local

### Pré-requisitos
- Node.js 18+ e npm
- Conta no Supabase

### Instalação

```bash
# Clonar repositório
git clone https://github.com/seunome/Fotografia_Tiago.git
cd Portifolio

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas credenciais Supabase
```

### Configurar Supabase

1. **Criar projeto no Supabase**
2. **Executar migrations SQL** (nesta ordem):
   ```sql
   -- 1. System básico
   -- Execute: supabase-setup.sql
   
   -- 2. Otimização de imagens
   -- Execute: image-optimization.sql
   
   -- 3. Full-text search
   -- Execute: fulltext-search.sql
   
   -- 4. Sistema de favoritos
   -- Execute: favorites-system.sql
   ```

3. **Criar buckets de Storage**:
   - `photography` (público)
   - `design` (público)

4. **Configurar credenciais no `.env`**:
   ```env
   VITE_SUPABASE_URL=https://seu-projeto.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-chave-anonima
   ```

### Rodar Desenvolvimento

```bash
npm run dev
# Acesse: http://localhost:8080
```

### Build para Produção

```bash
npm run build
npm run preview
```

---

## 📦 Deploy

### Vercel (Recomendado)

```bash
# Deploy automático via Git
vercel

# Ou via CLI
npm run build
vercel --prod
```

**Configurações Vercel:**
- Build Command: `npm run build`
- Output Directory: `dist`
- Framework Preset: Vite

### Netlify

```bash
# Build manual
npm run build

# Deploy pasta dist/
netlify deploy --prod --dir=dist
```

### VPS (CloudPanel/Hostinger)

```bash
# Usar script PowerShell incluído
.\upload-to-vps.ps1
```

---

## 🔐 Variáveis de Ambiente

```env
# Supabase
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-publica

# Opcional: Analytics, etc
```

---

## 📝 Scripts Disponíveis

```bash
npm run dev          # Dev server (http://localhost:8080)
npm run build        # Build produção
npm run build:dev    # Build development
npm run preview      # Preview build
npm run lint         # ESLint
```

---

## 🧪 Testes e Validação

### PWA Lighthouse Audit
```bash
npm install -g lighthouse
lighthouse https://tdfoco.cloud --view --preset=desktop --only-categories=pwa
```

**Meta:** Score PWA ≥ 90

### Performance Test
```bash
lighthouse https://tdfoco.cloud --view
```

**Metas:**
- Performance ≥ 85
- Best Practices ≥ 90
- SEO ≥ 95

---

## 📚 Documentação Adicional

- [Plano de Implementação](./implementation_plan.md) - Arquitetura detalhada
- [Walkthrough](./walkthrough.md) - Guia completo das melhorias
- [Supabase Setup](./SUPABASE_SETUP.md) - Configuração do banco
- [Code Documentation](./CODIGO_FONTE_COMPLETO.md) - Código completo

---

## 🤝 Contribuindo

Este é um projeto pessoal, mas sugestões são bem-vindas via issues.

---

## 📄 Licença

© 2025 Tiago Damasceno Francisco. Todos os direitos reservados.

**Projeto iniciado em:** 29/11/2025

---

## 🔗 Links

- **Website:** [tdfoco.cloud](https://tdfoco.cloud)
- **Instagram:** [@tdfoco](https://instagram.com/tdfoco)
- **LinkedIn:** [Tiago Damasceno](https://linkedin.com/in/tiago-damasceno)

---

## 🏆 Tecnologias & Badges

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?logo=pwa&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss&logoColor=white)

---

**Desenvolvido com ❤️ por Tiago Damasceno Francisco**
