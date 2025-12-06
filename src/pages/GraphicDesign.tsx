import UnifiedPortfolioGrid from "@/components/UnifiedPortfolioGrid";
import { SEO } from "@/components/SEO";

const GraphicDesign = () => {
    return (
        <>
            <SEO
                title="Design Gráfico"
                description="Portfólio de design gráfico: logos, identidade visual, redes sociais e projetos especiais."
                url="https://tdfoco.cloud/design"
            />
            <div className="min-h-screen bg-deep-black pt-20">
                <UnifiedPortfolioGrid designOnly={true} showTitle={false} />
            </div>
        </>
    );
};

export default GraphicDesign;
