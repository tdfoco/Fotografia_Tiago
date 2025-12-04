import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    type?: 'website' | 'article' | 'profile';
    keywords?: string[];
}

export function SEO({
    title = 'tdfoco | Fotografia e Design Profissional',
    description = 'Portfólio de fotografia e design gráfico de Tiago Damasceno. Especializado em retratos, fotografia urbana, natureza e identidade visual.',
    image = 'https://tdfoco.cloud/og-image.jpg',
    url = 'https://tdfoco.cloud',
    type = 'website',
    keywords = ['fotografia', 'design gráfico', 'retratos', 'fotografia profissional', 'identidade visual', 'tiago damasceno']
}: SEOProps) {
    const fullTitle = title.includes('tdfoco') ? title : `${title} | tdfoco`;

    return (
        <Helmet>
            {/* Primary Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="title" content={fullTitle} />
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords.join(', ')} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:locale" content="pt_BR" />
            <meta property="og:site_name" content="tdfoco" />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={url} />
            <meta property="twitter:title" content={fullTitle} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={image} />

            {/* Additional Meta Tags */}
            <meta name="robots" content="index, follow" />
            <meta name="language" content="Portuguese" />
            <meta name="author" content="Tiago Damasceno" />
            <link rel="canonical" href={url} />
        </Helmet>
    );
}
