import UnifiedPortfolioGrid from "@/components/UnifiedPortfolioGrid";
import { SEO } from "@/components/SEO";

const Photography = () => {
    return (
        <>
            <SEO
                title="Fotografia"
                description="Galeria de fotografia profissional: retratos, urbano, natureza e eventos."
                url="https://tdfoco.cloud/photography"
            />
            <div className="min-h-screen bg-deep-black pt-20">
                <UnifiedPortfolioGrid photographyOnly={true} showTitle={false} />
            </div>
        </>
    );
};

export default Photography;
