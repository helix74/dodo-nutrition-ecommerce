import { Truck, Shield, RefreshCw, CreditCard } from "lucide-react";

const trustItems = [
  {
    icon: Truck,
    title: "Livraison Rapide",
    description: "24-48h partout en Tunisie",
  },
  {
    icon: Shield,
    title: "Qualité Garantie",
    description: "Produits 100% authentiques",
  },
  {
    icon: RefreshCw,
    title: "Retour Facile",
    description: "14 jours pour changer d'avis",
  },
  {
    icon: CreditCard,
    title: "Paiement à la Livraison",
    description: "Payez à la réception",
  },
];

export function TrustBar() {
  return (
    <section className="border-y border-border bg-card py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {trustItems.map((item) => (
            <div
              key={item.title}
              className="flex flex-col items-center gap-2 text-center sm:flex-row sm:text-left"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-dodo-yellow/10">
                <item.icon className="h-5 w-5 text-dodo-yellow" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
