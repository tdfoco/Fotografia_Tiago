import PhotoGridModern from "@/components/PhotoGridModern";
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
                <div className="container mx-auto px-4 py-12">
                    <PhotoGridModern showHeader={false} />
                </div>
            </div>
        </>
    );
};

export default Photography;
