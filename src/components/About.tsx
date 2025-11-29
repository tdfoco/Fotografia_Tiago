import { Camera, Eye, Heart } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const About = () => {
  const { t } = useLanguage();

  return (
    <section className="bg-secondary py-24 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-6">
            {t('about.workTitle')}
          </h2>
          <div className="w-24 h-1 bg-accent mx-auto mb-8" />
        </div>

        <div className="grid md:grid-cols-3 gap-12 mb-16">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 text-accent mb-6">
              <Eye size={28} strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-light mb-3">{t('about.vision.title')}</h3>
            <p className="text-muted-foreground font-light leading-relaxed">
              {t('about.vision.description')}
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 text-accent mb-6">
              <Camera size={28} strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-light mb-3">{t('about.technique.title')}</h3>
            <p className="text-muted-foreground font-light leading-relaxed">
              {t('about.technique.description')}
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 text-accent mb-6">
              <Heart size={28} strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-light mb-3">{t('about.passion.title')}</h3>
            <p className="text-muted-foreground font-light leading-relaxed">
              {t('about.passion.description')}
            </p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto text-center">
          <p className="text-lg text-foreground/80 font-light leading-relaxed mb-6">
            {t('about.paragraph1')}
          </p>
          <p className="text-muted-foreground font-light leading-relaxed">
            {t('about.paragraph2')}
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
