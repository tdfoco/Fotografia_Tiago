import { Mail, Instagram, Camera } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Camera size={24} strokeWidth={1.5} />
              <span className="text-xl font-light tracking-wide">Portfolio</span>
            </div>
            <p className="text-primary-foreground/70 font-light leading-relaxed">
              Capturando histórias visuais que inspiram e emocionam
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-light mb-4 tracking-wide">Contato</h3>
            <div className="space-y-3">
              <a 
                href="mailto:contato@portfolio.com" 
                className="flex items-center gap-3 text-primary-foreground/70 hover:text-primary-foreground transition-colors font-light"
              >
                <Mail size={18} strokeWidth={1.5} />
                <span>contato@portfolio.com</span>
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-primary-foreground/70 hover:text-primary-foreground transition-colors font-light"
              >
                <Instagram size={18} strokeWidth={1.5} />
                <span>@portfolio</span>
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-light mb-4 tracking-wide">Serviços</h3>
            <ul className="space-y-2 text-primary-foreground/70 font-light">
              <li>Fotografia de Retratos</li>
              <li>Fotografia Urbana</li>
              <li>Fotografia de Natureza</li>
              <li>Eventos</li>
              <li>Projetos Comerciais</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 pt-8 text-center">
          <p className="text-primary-foreground/60 font-light text-sm">
            © {new Date().getFullYear()} Portfolio. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
