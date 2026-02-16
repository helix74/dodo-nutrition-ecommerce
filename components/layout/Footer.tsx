import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Phone, Mail, MapPin } from "lucide-react";

const footerLinks = {
  navigation: [
    { label: "Accueil", href: "/" },
    { label: "Boutique", href: "/shop" },
    { label: "Catégories", href: "/categories" },
    { label: "Marques", href: "/brands" },
    { label: "Promos", href: "/promotions" },
  ],
  aide: [
    { label: "FAQ", href: "/faq" },
    { label: "Livraison", href: "/livraison" },
    { label: "Retours", href: "/faq#retours" },
    { label: "CGV", href: "/cgv" },
    { label: "Mentions légales", href: "/mentions-legales" },
  ],
};

const socialLinks = [
  {
    icon: Facebook,
    href: "https://facebook.com/dodonutrition",
    label: "Facebook",
  },
  {
    icon: Instagram,
    href: "https://instagram.com/dodonutrition",
    label: "Instagram",
  },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card">
      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/logo_dodo_nutrition.png"
                alt="Dodo Nutrition"
                width={48}
                height={48}
                className="h-12 w-12 object-contain"
              />
              <span className="text-xl font-bold text-foreground">
                Dodo Nutrition
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Votre partenaire nutrition sportive en Tunisie. Suppléments de
              qualité premium pour atteindre vos objectifs.
            </p>
            {/* Social Links */}
            <div className="flex gap-3 pt-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-all hover:bg-dodo-yellow hover:text-black"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

            {/* Navigation Column */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-dodo-yellow">
              Navigation
            </h3>
            <ul className="space-y-3">
              {footerLinks.navigation.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-dodo-yellow"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Aide Column */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-dodo-yellow">
              Aide
            </h3>
            <ul className="space-y-3">
              {footerLinks.aide.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-dodo-yellow"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-dodo-yellow">
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0 text-dodo-yellow" />
                <span>Tunis, Tunisie</span>
              </li>
              <li>
                <a
                  href="tel:+21670123456"
                  className="flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-dodo-yellow"
                >
                  <Phone className="h-4 w-4 shrink-0 text-dodo-yellow" />
                  <span>+216 70 123 456</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:contact@dodonutrition.tn"
                  className="flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-dodo-yellow"
                >
                  <Mail className="h-4 w-4 shrink-0 text-dodo-yellow" />
                  <span>contact@dodonutrition.tn</span>
                </a>
              </li>
            </ul>

            {/* Payment Methods */}
            <div className="mt-6">
              <h4 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Paiement
              </h4>
              <div className="flex items-center gap-2">
                <span className="rounded bg-secondary px-3 py-1.5 text-xs font-medium text-foreground">
                  💵 Paiement à la livraison
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border bg-background">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs text-muted-foreground">
            © {currentYear} Dodo Nutrition. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
