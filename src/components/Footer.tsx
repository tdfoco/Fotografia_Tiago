import { Mail, Instagram, Camera } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { NewsletterSignup } from "./NewsletterSignup";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-black border-t border-white/10 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-2xl font-display font-bold text-white mb-4">TD FOCO</h2>
            <p className="text-gray-400 max-w-sm mb-6">
              Transformando visões em realidade através da fotografia e design de alta performance.
            </p>
            <NewsletterSignup />
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-light mb-4 tracking-wide">{t('footer.contactTitle')}</h3>
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
            <h3 className="text-lg font-light mb-4 tracking-wide">{t('footer.servicesTitle')}</h3>
            <ul className="space-y-2 text-primary-foreground/70 font-light">
              <li>{t('footer.portraitPhotography')}</li>
              <li>{t('footer.urbanPhotography')}</li>
              <li>{t('footer.naturePhotography')}</li>
              <li>{t('footer.events')}</li>
              <li>{t('footer.commercialProjects')}</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 pt-8 text-center">
          <p className="text-primary-foreground/60 font-light text-sm">
            © {new Date().getFullYear()} Portfolio. {t('footer.allRightsReserved')}.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
