import { Camera, Eye, Heart } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const About = () => {
  const { t } = useLanguage();

  return (
    <section className="bg-background py-24 px-4 md:px-8 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-electric-blue/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-vibrant-purple/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-display font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground via-electric-blue to-foreground">
            {t('about.workTitle')}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-electric-blue to-vibrant-purple mx-auto mb-8 rounded-full shadow-[0_0_15px_rgba(58,139,253,0.5)]" />
        </div>

        <div className="grid md:grid-cols-3 gap-12 mb-20">
          <div className="group text-center p-8 rounded-2xl bg-secondary/30 backdrop-blur-sm border border-white/5 hover:border-electric-blue/30 transition-all duration-500 hover:shadow-[0_0_30px_rgba(58,139,253,0.1)]">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-electric-blue/10 text-electric-blue mb-6 group-hover:scale-110 transition-transform duration-500 group-hover:shadow-[0_0_20px_rgba(58,139,253,0.3)]">
              <Eye size={32} strokeWidth={1.5} />
            </div>
            <h3 className="text-2xl font-display font-semibold mb-4 group-hover:text-electric-blue transition-colors">{t('about.vision.title')}</h3>
            <p className="text-muted-foreground font-light leading-relaxed text-lg">
              {t('about.vision.description')}
            </p>
          </div>

          <div className="group text-center p-8 rounded-2xl bg-secondary/30 backdrop-blur-sm border border-white/5 hover:border-vibrant-purple/30 transition-all duration-500 hover:shadow-[0_0_30px_rgba(124,58,237,0.1)]">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-vibrant-purple/10 text-vibrant-purple mb-6 group-hover:scale-110 transition-transform duration-500 group-hover:shadow-[0_0_20px_rgba(124,58,237,0.3)]">
              <Camera size={32} strokeWidth={1.5} />
            </div>
            <h3 className="text-2xl font-display font-semibold mb-4 group-hover:text-vibrant-purple transition-colors">{t('about.technique.title')}</h3>
            <p className="text-muted-foreground font-light leading-relaxed text-lg">
              {t('about.technique.description')}
            </p>
          </div>

          <div className="group text-center p-8 rounded-2xl bg-secondary/30 backdrop-blur-sm border border-white/5 hover:border-neon-cyan/30 transition-all duration-500 hover:shadow-[0_0_30px_rgba(0,243,255,0.1)]">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-neon-cyan/10 text-neon-cyan mb-6 group-hover:scale-110 transition-transform duration-500 group-hover:shadow-[0_0_20px_rgba(0,243,255,0.3)]">
              <Heart size={32} strokeWidth={1.5} />
            </div>
            <h3 className="text-2xl font-display font-semibold mb-4 group-hover:text-neon-cyan transition-colors">{t('about.passion.title')}</h3>
            <p className="text-muted-foreground font-light leading-relaxed text-lg">
              {t('about.passion.description')}
            </p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xl md:text-2xl text-foreground/90 font-light leading-relaxed mb-8">
            {t('about.paragraph1')}
          </p>
          <p className="text-lg text-muted-foreground font-light leading-relaxed">
            {t('about.paragraph2')}
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
