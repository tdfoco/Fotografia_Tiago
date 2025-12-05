/**
 * SEO Generator - Geração automática de meta tags e conteúdo SEO
 */

interface PageMeta {
    title: string;
    description: string;
    keywords: string[];
    ogImage?: string;
    canonicalUrl?: string;
}

interface ImageContext {
    category?: string;
    tags?: string[];
    photographer?: string;
    location?: string;
}

/**
 * Gera descrição meta otimizada para cada página
 */
export const generateMetaDescription = (page: string, customData?: any): string => {
    const descriptions: Record<string, string> = {
        home: 'TDFoco - Fotografia profissional e design gráfico de Tiago Damasceno. Portfólio com retratos, urbano, natureza e projetos comerciais.',
        photography: 'Explore a galeria de fotografia profissional de Tiago Damasceno: retratos artísticos, fotografia urbana, natureza e momentos únicos capturados com maestria.',
        design: 'Design gráfico criativo e profissional. Identidade visual, posters, branding e projetos digitais que trazem ideias à vida.',
        about: 'Conheça Tiago Damasceno, fotógrafo e designer com mais de 10 anos de experiência em capturar momentos e criar identidades visuais marcantes.',
        services: 'Serviços profissionais de fotografia e design: ensaios fotográficos, eventos, branding, design editorial e muito mais. Orçamentos personalizados.',
        contact: 'Entre em contato com TDFoco para fotografias profissionais, design gráfico e projetos criativos. Atendimento personalizado e qualidade garantida.',
        'behind-the-scenes': 'Descubra os bastidores do processo criativo de Tiago Damasceno: equipamentos, técnicas e a jornada por trás de cada projeto fotográfico.',
        testimonials: 'Veja o que clientes satisfeitos dizem sobre o trabalho de TDFoco. Depoimentos autênticos de projetos fotográficos e design realizados.',
        'visual-search': 'Busca visual inteligente por fotos similares usando IA. Encontre imagens com cores,  composições e estilos parecidos.',
    };

    if (customData) {
        return customData.description || descriptions[page] || descriptions.home;
    }

    return descriptions[page] || descriptions.home;
};

/**
 * Gera palavras-chave SEO para a página
 */
export const generateKeywords = (page: string, customKeywords?: string[]): string[] => {
    const baseKeywords = ['TDFoco', 'Tiago Damasceno', 'fotografia', 'design gráfico'];

    const pageKeywords: Record<string, string[]> = {
        home: ['portfolio', 'fotografo profissional', 'designer', 'brasil'],
        photography: ['retrato', 'urbano', 'natureza', 'eventos', 'editorial'],
        design: ['identidade visual', 'branding', 'poster', 'logo', 'arte digital'],
        about: ['sobre', 'biografia', 'experiência', 'equipamentos'],
        services: ['serviços', 'orçamento', 'ensaio', 'evento', 'casamento'],
        contact: ['contato', 'orçamento', 'whatsapp', 'email'],
        'behind-the-scenes': ['bastidores', 'processo criativo', 'making of'],
        testimonials: ['depoimentos', 'avaliações', 'clientes', 'reviews'],
        'visual-search': ['busca visual', 'IA', 'similaridade', 'machine learning'],
    };

    const keywords = [...baseKeywords, ...(pageKeywords[page] || [])];

    if (customKeywords) {
        keywords.push(...customKeywords);
    }

    return [...new Set(keywords)]; // Remove duplicates
};

/**
 * Gera texto alternativo inteligente para imagens
 */
export const generateAltText = (
    image: { title?: string; filename?: string },
    context?: ImageContext
): string => {
    const parts: string[] = [];

    // Adicionar título ou nome do arquivo
    if (image.title) {
        parts.push(image.title);
    } else if (image.filename) {
        parts.push(image.filename.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
    }

    // Adicionar categoria
    if (context?.category) {
        parts.push(`fotografia ${context.category.toLowerCase()}`);
    }

    // Adicionar fotógrafo
    if (context?.photographer) {
        parts.push(`por ${context.photographer}`);
    }

    // Adicionar localização
    if (context?.location) {
        parts.push(`em ${context.location}`);
    }

    // Adicionar tags relevantes (máximo 3)
    if (context?.tags && context.tags.length > 0) {
        const relevantTags = context.tags.slice(0, 3).join(', ');
        parts.push(`tags: ${relevantTags}`);
    }

    const altText = parts.join(' - ');

    // Garantir que começa com maiúscula e não excede 125 caracteres
    const formatted = altText.charAt(0).toUpperCase() + altText.slice(1);
    return formatted.length > 125 ? formatted.substring(0, 122) + '...' : formatted;
};

/**
 * Gera tags Open Graph completas
 */
export const generateOpenGraphTags = (page: PageMeta) => {
    return {
        'og:title': page.title,
        'og:description': page.description,
        'og:type': 'website',
        'og:url': page.canonicalUrl || `https://tdfoco.cloud/${page.title.toLowerCase()}`,
        'og:image': page.ogImage || 'https://tdfoco.cloud/og-default.jpg',
        'og:image:width': '1200',
        'og:image:height': '630',
        'og:site_name': 'TDFoco - Fotografia & Design',
        'og:locale': 'pt_BR',
    };
};

/**
 * Gera tags Twitter Card
 */
export const generateTwitterCardTags = (page: PageMeta) => {
    return {
        'twitter:card': 'summary_large_image',
        'twitter:title': page.title,
        'twitter:description': page.description,
        'twitter:image': page.ogImage || 'https://tdfoco.cloud/og-default.jpg',
        'twitter:creator': '@tdfoco',
        'twitter:site': '@tdfoco',
    };
};

/**
 * Gera Schema.org JSON-LD para fotógrafo
 */
export const generatePhotographerSchema = () => {
    return {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'Tiago Damasceno',
        jobTitle: 'Fotógrafo e Designer Gráfico',
        url: 'https://tdfoco.cloud',
        image: 'https://tdfoco.cloud/profile.jpg',
        sameAs: [
            'https://instagram.com/tdfoco',
            'https://facebook.com/tdfoco',
            'https://linkedin.com/in/tiagodamasceno'
        ],
        worksFor: {
            '@type': 'Organization',
            name: 'TDFoco',
            url: 'https://tdfoco.cloud'
        },
        address: {
            '@type': 'PostalAddress',
            addressCountry: 'BR'
        }
    };
};

/**
 * Gera Schema.org JSON-LD para organização
 */
export const generateOrganizationSchema = () => {
    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'TDFoco',
        url: 'https://tdfoco.cloud',
        logo: 'https://tdfoco.cloud/logo.png',
        description: 'Estúdio de fotografia profissional e design gráfico',
        founder: {
            '@type': 'Person',
            name: 'Tiago Damasceno'
        },
        contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'customer service',
            email: 'contato@tdfoco.cloud'
        },
        sameAs: [
            'https://instagram.com/tdfoco',
            'https://facebook.com/tdfoco'
        ]
    };
};

/**
 * Gera Schema.org JSON-LD para trabalho criativo (fotografia)
 */
export const generateCreativeWorkSchema = (photo: {
    title: string;
    description?: string;
    url: string;
    imageUrl: string;
    category?: string;
    datePublished?: string;
}) => {
    return {
        '@context': 'https://schema.org',
        '@type': 'Photograph',
        name: photo.title,
        description: photo.description || '',
        url: photo.url,
        image: photo.imageUrl,
        author: {
            '@type': 'Person',
            name: 'Tiago Damasceno',
            url: 'https://tdfoco.cloud'
        },
        creator: {
            '@type': 'Person',
            name: 'Tiago Damasceno'
        },
        copyrightHolder: {
            '@type': 'Organization',
            name: 'TDFoco'
        },
        datePublished: photo.datePublished || new Date().toISOString().split('T')[0],
        genre: photo.category || 'Fotografia'
    };
};

/**
 * Gera Schema.org JSON-LD para breadcrumbs
 */
export const generateBreadcrumbSchema = (items: { name: string; url: string }[]) => {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url
        }))
    };
};

/**
 * Gera Schema.org JSON-LD para avaliações agregadas
 */
export const generateAggregateRatingSchema = (data: {
    ratingValue: number;
    reviewCount: number;
    bestRating?: number;
    worstRating?: number;
}) => {
    return {
        '@context': 'https://schema.org',
        '@type': 'AggregateRating',
        ratingValue: data.ratingValue,
        reviewCount: data.reviewCount,
        bestRating: data.bestRating || 5,
        worstRating: data.worstRating || 1
    };
};

export default {
    generateMetaDescription,
    generateKeywords,
    generateAltText,
    generateOpenGraphTags,
    generateTwitterCardTags,
    generatePhotographerSchema,
    generateOrganizationSchema,
    generateCreativeWorkSchema,
    generateBreadcrumbSchema,
    generateAggregateRatingSchema
};
