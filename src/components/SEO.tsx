import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string[];
    image?: string;
    type?: 'website' | 'article';
    author?: string;
}

export const SEO = ({
    title,
    description,
    keywords = [],
    image,
    type = 'website',
    author = 'Tiago Damasceno'
}: SEOProps) => {
    const defaultTitle = 'tdfoco | Portfólio de Fotografia e Design';
    const defaultDescription = 'Portfolio profissional de fotografia e design gráfico. Explore trabalhos de retratos, arte urbana, natureza, eventos e identidades visuais modernas.';
    const defaultKeywords = ['fotografia', 'design gráfico', 'portfólio', 'Tiago Damasceno', 'fotógrafo profissional'];
    const defaultImage = 'https://tdfoco.cloud/og-image.jpg';

    const pageTitle = title ? `${title} | tdfoco` : defaultTitle;
    const pageDescription = description || defaultDescription;
    const pageKeywords = keywords.length > 0 ? keywords : defaultKeywords;
    const pageImage = image || defaultImage;
    const siteUrl = 'https://tdfoco.cloud';

    return (
        <Helmet>
            {/* Primary Meta Tags */}
            <title>{pageTitle}</title>
            <meta name="title" content={pageTitle} />
            <meta name="description" content={pageDescription} />
            <meta name="keywords" content={pageKeywords.join(', ')} />
            <meta name="author" content={author} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={siteUrl} />
            <meta property="og:title" content={pageTitle} />
            <meta property="og:description" content={pageDescription} />
            <meta property="og:image" content={pageImage} />
            <meta property="og:site_name" content="tdfoco" />
            <meta property="og:locale" content="pt_BR" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={siteUrl} />
            <meta name="twitter:title" content={pageTitle} />
            <meta name="twitter:description" content={pageDescription} />
            <meta name="twitter:image" content={pageImage} />
            <meta name="twitter:creator" content="@tdfoco" />

            {/* Additional SEO */}
            <link rel="canonical" href={siteUrl} />
            <meta name="robots" content="index, follow" />
            <meta name="language" content="Portuguese" />
            <meta name="revisit-after" content="7 days" />

            {/* JSON-LD Structured Data */}
            <script type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": type === 'article' ? 'Article' : 'WebSite',
                    "name": pageTitle,
                    "description": pageDescription,
                    "url": siteUrl,
                    "author": {
                        "@type": "Person",
                        "name": author
                    },
                    "image": pageImage,
                    ...((type === 'website') ? {
                        "potentialAction": {
                            "@type": "SearchAction",
                            "target": `${siteUrl}/search?q={search_term_string}`,
                            "query-input": "required name=search_term_string"
                        }
                    } : {})
                })}
            </script>
        </Helmet>
    );
};
