import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title?: string;
    description?: string;
}

export const SEO = ({ title, description }: SEOProps) => {
    const defaultTitle = 'tdfoco | Portfólio de Fotografia e Design';
    const defaultDescription = 'Portfolio profissional de fotografia e design gráfico. Explore trabalhos de retratos, arte urbana, natureza, eventos e identidades visuais modernas.';

    const pageTitle = title ? `${title} | tdfoco` : defaultTitle;
    const pageDescription = description || defaultDescription;

    return (
        <Helmet>
            <title>{pageTitle}</title>
            <meta name="description" content={pageDescription} />
            <meta property="og:title" content={pageTitle} />
            <meta property="og:description" content={pageDescription} />
            <meta name="twitter:title" content={pageTitle} />
            <meta name="twitter:description" content={pageDescription} />
        </Helmet>
    );
};
