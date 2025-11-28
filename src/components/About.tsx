import { Camera, Eye, Heart } from "lucide-react";

const About = () => {
  return (
    <section className="bg-secondary py-24 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-6">
            Sobre o Trabalho
          </h2>
          <div className="w-24 h-1 bg-accent mx-auto mb-8" />
        </div>

        <div className="grid md:grid-cols-3 gap-12 mb-16">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 text-accent mb-6">
              <Eye size={28} strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-light mb-3">Visão Única</h3>
            <p className="text-muted-foreground font-light leading-relaxed">
              Cada imagem conta uma história através de uma perspectiva autêntica e pessoal
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 text-accent mb-6">
              <Camera size={28} strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-light mb-3">Técnica Refinada</h3>
            <p className="text-muted-foreground font-light leading-relaxed">
              Domínio técnico combinado com sensibilidade artística
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 text-accent mb-6">
              <Heart size={28} strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-light mb-3">Paixão Genuína</h3>
            <p className="text-muted-foreground font-light leading-relaxed">
              Dedicação em capturar momentos que tocam emocionalmente
            </p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto text-center">
          <p className="text-lg text-foreground/80 font-light leading-relaxed mb-6">
            Fotografia é mais do que apenas capturar imagens. É sobre contar histórias, 
            preservar momentos e criar conexões emocionais através da arte visual.
          </p>
          <p className="text-muted-foreground font-light leading-relaxed">
            Cada projeto é abordado com dedicação, buscando sempre entregar trabalhos 
            que superem expectativas e resistam ao teste do tempo.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
