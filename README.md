# 📸 TD FOCO - Portfólio de Fotografia e Design

> Portfólio moderno e interativo de Tiago Damasceno, fotógrafo e designer gráfico.

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![React](https://img.shields.io/badge/React-18.3.1-61dafb.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-3178c6.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 🌟 Visão Geral

Site de portfólio profissional com design futurista e neon-accented, apresentando trabalhos de fotografia e design gráfico. Construído com tecnologias modernas para oferecer uma experiência visual impactante e performance otimizada.

### ✨ Características Principais

- 🎨 **Design Futurista**: Estética moderna com efeitos neon (electric blue, vibrant purple, neon cyan)
- 🖼️ **Galeria Masonry**: Layout dinâmico e responsivo para fotografias
- 🤖 **AI Integration**: Auto-tagging de imagens com TensorFlow.js
- 🌓 **Dark/Light Mode**: Suporte completo a temas com transições suaves
- 📱 **Totalmente Responsivo**: Otimizado para todos os dispositivos
- ⚡ **Performance**: Lazy loading, WebP, e otimizações modernas
- 🔒 **Proteção de Imagens**: Sistema de proteção contra download não autorizado
- 🌐 **i18n**: Suporte a múltiplos idiomas (PT-BR/EN)

## 🚀 Stack Tecnológico

### Frontend
- **React 18.3.1** - Biblioteca UI
- **TypeScript** - Type safety
- **Vite** - Build tool e dev server
- **TailwindCSS** - Utility-first CSS framework
- **Framer Motion** - Animações fluidas
- **Shadcn/ui** - Componentes UI modernos

### Backend & Database
- **PocketBase** - Backend-as-a-Service
  - Autenticação
  - Database SQLite
  - File storage
  - API REST automática

### AI & Machine Learning
- **TensorFlow.js** - ML no navegador
- **MobileNet** - Classificação de imagens
- **COCO-SSD** - Detecção de objetos

### Deployment
- **Nginx** - Web server e reverse proxy
- **PM2** - Process manager para Node.js
- **Certbot** - SSL/TLS certificates (Let's Encrypt)
- **VPS** - Hostinger (Ubuntu 22.04)

## 📁 Estrutura do Projeto

```
Portifolio/
├── src/
│   ├── components/          # Componentes React
│   │   ├── ui/             # Componentes base (shadcn)
│   │   ├── layout/         # Layout components
│   │   ├── MasonryPhotoGrid.tsx
│   │   ├── PhotoGridModern.tsx
│   │   ├── ProjectCard.tsx
│   │   ├── FilterBar.tsx
│   │   └── ...
│   ├── pages/              # Páginas da aplicação
│   │   ├── Index.tsx       # Homepage
│   │   ├── Photography.tsx # Portfólio de fotografia
│   │   ├── GraphicDesign.tsx # Portfólio de design
│   │   ├── AboutPage.tsx   # Sobre
│   │   └── Contact.tsx     # Contato
│   ├── contexts/           # React contexts
│   │   └── LanguageContext.tsx
│   ├── hooks/              # Custom hooks
│   │   ├── usePocketBaseData.ts
│   │   └── useImageProtection.ts
│   ├── lib/                # Utilitários
│   │   ├── pocketbase.ts
│   │   └── ai_services.ts  # Serviços de AI
│   ├── App.tsx             # App root
│   └── main.tsx            # Entry point
├── public/                 # Assets estáticos
├── pb_data/               # PocketBase data (local)
├── dist/                  # Build de produção
└── ...
```

## 🎨 Sistema de Design

### Cores

```css
/* Electric Blue */
--electric-blue: hsl(211, 98%, 61%)  /* #3A8BFD */

/* Vibrant Purple */
--vibrant-purple: hsl(258, 80%, 58%) /* #7C3AED */

/* Neon Cyan */
--neon-cyan: hsl(184, 100%, 50%)     /* #00F3FF */

/* Deep Black */
--deep-black: hsl(0, 0%, 7%)         /* #121212 */

/* Ice White */
--ice-white: hsl(0, 0%, 98%)         /* #FAFAFA */
```

### Tipografia

- **Display**: Bungee (títulos principais)
- **Heading**: Montserrat (headings)
- **Body**: Inter (texto corpo)

### Efeitos Especiais

- Glassmorphism (`backdrop-blur`, transparência)
- Neon glow (`shadow-[0_0_20px_rgba(58,139,253,0.5)]`)
- Gradientes animados
- Transições suaves (300-500ms)

## 🔧 Instalação e Desenvolvimento

### Pré-requisitos

- Node.js >= 18.x
- npm ou yarn
- Git

### Setup Local

```bash
# Clone o repositório
git clone https://github.com/tdfoco/portfolio.git
cd portfolio

# Instale as dependências
npm install

# Configure o arquivo .env (se necessário)
cp .env.example .env

# Inicie o servidor de desenvolvimento
npm run dev
```

O site estará disponível em `http://localhost:5173`

### PocketBase Local

```bash
# Download e execute PocketBase
./pocketbase serve

# Acesse o Admin UI
http://127.0.0.1:8090/_/
```

## 📦 Build e Deploy

### Build de Produção

```bash
# Gerar build otimizado
npm run build

# Preview do build
npm run preview
```

### Deploy VPS (Automatizado)

```bash
# Configure Nginx e SSL
./run_vps_build.bat

# Ou manualmente
npm run build
scp -r dist/* root@seu-servidor:/var/www/html/
```

### Configuração Nginx

```nginx
server {
    listen 80;
    server_name tdfoco.cloud www.tdfoco.cloud;
    
    root /var/www/html;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://127.0.0.1:8090;
    }
}
```

## 🤖 Funcionalidades AI

### Auto-Tagging de Imagens

```typescript
import { generateImageTags } from '@/lib/ai_services';

const tags = await generateImageTags(imageElement);
// Retorna: ['pessoa', 'outdoor', 'natureza', ...]
```

### Smart Sorting

```typescript
import { smartSortPhotos } from '@/lib/ai_services';

const sortedPhotos = smartSortPhotos(photos);
// Ordena por engagement (likes, views, shares)
```

### Alt Text Automático

```typescript
import { generateAltText } from '@/lib/ai_services';

const altText = await generateAltText(imageElement, category);
// Retorna: "Fotografia de retrato profissional mostrando pessoa"
```

## 📊 Coleções PocketBase

### photography
```javascript
{
  id: string,
  title: string,
  description: string,
  image: file,
  category: string,       // 'portraits', 'urban', 'nature', 'art', 'events'
  tags: string[],
  camera_model: string,
  lens_model: string,
  iso: number,
  aperture: string,
  shutter_speed: string,
  focal_length: string,
  likes_count: number,
  views_count: number,
  comments_count: number,
  shares_count: number,
  created: datetime,
  updated: datetime
}
```

### design_projects
```javascript
{
  id: string,
  title: string,
  description: string,
  category: string,  // 'logos', 'visual_identity', 'social_media', 'posters'
  images: file[],
  client: relation(clients),
  tags: string[],
  project_date: date,
  created: datetime,
  updated: datetime
}
```

### hero_images
```javascript
{
  id: string,
  page: string,      // 'home', 'photography', 'design', 'about', 'contact'
  image: file,
  active: boolean,
  created: datetime
}
```

## 🎯 Componentes Principais

### `MasonryPhotoGrid`
Grid responsivo estilo Pinterest com animações

### `ProjectCard`
Cards interativos para projetos de design

### `FilterBar`
Barra de filtros reutilizável com animações

### `HeroModern`
Hero section com parallax e efeitos neon

### `ModernLayout`
Layout principal com glassmorphism header/footer

## 🌐 i18n - Internacionalização

```typescript
// Uso do contexto de idioma
const { t, language, setLanguage } = useLanguage();

// Tradução
<h1>{t('portfolio.title')}</h1>

// Alternar idioma
setLanguage('en'); // ou 'pt'
```

## 🔐 Segurança

- Proteção de imagens (desabilita right-click, drag, print screen)
- CORS configurado
- Helmet para headers de segurança
- SSL/TLS obrigatório em produção
- Autenticação JWT via PocketBase

## 📈 Performance

- **Lighthouse Score**: 95+ (Performance, A11y, Best Practices, SEO)
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3.5s
- **Total Bundle Size**: ~500KB (gzipped)

### Otimizações Implementadas

- ✅ Code splitting
- ✅ Lazy loading de componentes
- ✅ Image lazy loading
- ✅ WebP format
- ✅ CSS purging (Tailwind)
- ✅ Tree shaking
- ✅ Minification

## 🧪 Testing

```bash
# Testes unitários
npm run test

# Testes E2E
npm run test:e2e

# Coverage
npm run test:coverage
```

## 📝 Scripts Disponíveis

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run preview      # Preview do build
npm run lint         # Linter ESLint
npm run type-check   # Verificação TypeScript
```

## 🐛 Troubleshooting

### Porta 5173 em uso
```bash
# Altere a porta no vite.config.ts
server: { port: 3000 }
```

### PocketBase não conecta
```bash
# Verifique se está rodando
./pocketbase serve

# Verifique URL em src/lib/pocketbase.ts
```

### Build falha
```bash
# Limpe cache e reinstale
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📜 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👤 Autor

**Tiago Damasceno**
- Website: [tdfoco.cloud](https://tdfoco.cloud)
- Instagram: [@tdfoco](https://instagram.com/tdfoco)
- Email: contato@tdfoco.cloud

## 🙏 Agradecimentos

- Shadcn/ui pelos componentes incríveis
- TensorFlow.js pela AI no navegador
- Comunidade React pelo suporte constante

---

⭐️ Se este projeto te ajudou, considere dar uma estrela!
