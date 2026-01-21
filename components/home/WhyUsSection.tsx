import { Award, Users, Headphones, TrendingUp } from "lucide-react";

const whyUsItems = [
  {
    icon: Award,
    title: "Qualité Premium",
    description: "Tous nos produits sont certifiés et proviennent de marques internationales de confiance.",
  },
  {
    icon: TrendingUp,
    title: "Prix Compétitifs",
    description: "Les meilleurs prix du marché tunisien avec des promotions régulières.",
  },
  {
    icon: Headphones,
    title: "Support Expert",
    description: "Notre équipe de conseillers est là pour vous guider dans vos choix.",
  },
  {
    icon: Users,
    title: "Communauté Active",
    description: "Rejoignez des milliers d'athlètes qui nous font confiance.",
  },
];

export function WhyUsSection() {
  return (
    <section className="py-16 bg-card border-y border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
            Pourquoi Choisir Dodo Nutrition ?
          </h2>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
            Votre partenaire de confiance pour atteindre vos objectifs sportifs et nutritionnels
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {whyUsItems.map((item) => (
            <div
              key={item.title}
              className="group relative flex flex-col items-center text-center p-6 rounded-xl border border-border bg-background transition-all duration-300 hover:border-dodo-yellow hover:shadow-lg hover:shadow-dodo-yellow/5"
            >
              {/* Icon */}
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-dodo-yellow/10 mb-4 transition-all group-hover:scale-110">
                <item.icon className="h-7 w-7 text-dodo-yellow" />
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
