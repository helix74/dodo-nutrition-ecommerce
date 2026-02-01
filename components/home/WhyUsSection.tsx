import { 
  Award, 
  Truck, 
  Headphones, 
  ShieldCheck, 
  BadgePercent,
  Zap
} from "lucide-react";

const whyUsItems = [
  {
    icon: ShieldCheck,
    title: "Produits Authentiques",
    titleDarija: "منتجات أصلية",
    description: "100% produits originaux avec certificat d'authenticité. Marques internationales de confiance.",
    color: "from-dodo-yellow/20 to-dodo-yellow/5",
    iconColor: "text-dodo-yellow",
  },
  {
    icon: Truck,
    title: "Livraison Rapide",
    titleDarija: "توصيل سريع",
    description: "Livraison express partout en Tunisie. Gratuite dès 150 DT d'achat.",
    color: "from-green-500/20 to-green-500/5",
    iconColor: "text-green-500",
  },
  {
    icon: BadgePercent,
    title: "Meilleurs Prix",
    titleDarija: "أحسن الأسعار",
    description: "Prix compétitifs garantis. Promotions exclusives et offres spéciales.",
    color: "from-blue-500/20 to-blue-500/5",
    iconColor: "text-blue-500",
  },
  {
    icon: Headphones,
    title: "Support 24/7",
    titleDarija: "دعم متواصل",
    description: "Équipe d'experts disponible pour vous conseiller et répondre à vos questions.",
    color: "from-purple-500/20 to-purple-500/5",
    iconColor: "text-purple-500",
  },
  {
    icon: Award,
    title: "Top Qualité",
    titleDarija: "جودة عالية",
    description: "Sélection rigoureuse de marques premium et certifications vérifiées.",
    color: "from-orange-500/20 to-orange-500/5",
    iconColor: "text-orange-500",
  },
  {
    icon: Zap,
    title: "Résultats Garantis",
    titleDarija: "نتائج مضمونة",
    description: "Des milliers de clients satisfaits. Atteignez vos objectifs fitness.",
    color: "from-red-500/20 to-red-500/5",
    iconColor: "text-red-500",
  },
];

export function WhyUsSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-card to-background border-y border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-dodo-yellow/10 text-dodo-yellow text-sm font-medium mb-4">
            Pourquoi Nous ?
          </span>
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            <span className="font-[Cairo] text-dodo-yellow">علاش</span> Dodo Nutrition ?
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-lg">
            Votre partenaire de confiance pour atteindre vos objectifs sportifs et nutritionnels
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {whyUsItems.map((item, index) => (
            <div
              key={item.title}
              className="group relative overflow-hidden rounded-2xl border border-border bg-background p-6 transition-all duration-300 hover:border-dodo-yellow/50 hover:shadow-xl hover:shadow-dodo-yellow/5 hover:-translate-y-1"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 transition-opacity group-hover:opacity-100`} />
              
              {/* Content */}
              <div className="relative">
                {/* Icon */}
                <div className={`flex h-14 w-14 items-center justify-center rounded-xl bg-background border border-border mb-4 transition-all duration-300 group-hover:scale-110 group-hover:border-${item.iconColor}/50`}>
                  <item.icon className={`h-7 w-7 ${item.iconColor}`} />
                </div>

                {/* Title */}
                <div className="mb-3">
                  <h3 className="text-lg font-bold text-foreground">
                    {item.title}
                  </h3>
                  <span className="text-sm font-[Cairo] text-muted-foreground">
                    {item.titleDarija}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Hover Indicator */}
              <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-dodo-yellow to-dodo-yellow/50 transition-all duration-300 group-hover:w-full" />
            </div>
          ))}
        </div>

        {/* Bottom Stats */}
        <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { value: "5000+", label: "Clients Satisfaits" },
            { value: "100%", label: "Produits Authentiques" },
            { value: "48h", label: "Délai de Livraison" },
            { value: "24/7", label: "Support Client" },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-4 rounded-xl bg-card border border-border">
              <div className="text-2xl sm:text-3xl font-bold text-dodo-yellow">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
