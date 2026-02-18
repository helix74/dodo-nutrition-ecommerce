import { getEnhancedKPIs } from "@/lib/actions/admin-analytics";
import { formatPrice } from "@/lib/utils";
import { ShoppingCart, AlertTriangle, Tag, XCircle } from "lucide-react";

export async function EnhancedKPIs() {
  const kpis = await getEnhancedKPIs();

  const cards = [
    {
      label: "Valeur moy. commande",
      value: formatPrice(kpis.avgOrderValue),
      icon: ShoppingCart,
      iconColor: "text-dodo-yellow",
      iconBg: "bg-dodo-yellow/10",
    },
    {
      label: "Stock faible (< 5)",
      value: kpis.lowStockCount.toString(),
      icon: AlertTriangle,
      iconColor: "text-amber-500",
      iconBg: "bg-amber-500/10",
    },
    {
      label: "Rupture de stock",
      value: kpis.outOfStockCount.toString(),
      icon: XCircle,
      iconColor: "text-dodo-red",
      iconBg: "bg-dodo-red/10",
    },
    {
      label: "Top catégorie",
      value: kpis.topCategory ?? "—",
      icon: Tag,
      iconColor: "text-emerald-500",
      iconBg: "bg-emerald-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="rounded-lg border border-border bg-card p-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{card.label}</span>
              <div className={`flex h-8 w-8 items-center justify-center rounded-full ${card.iconBg}`}>
                <Icon className={`h-4 w-4 ${card.iconColor}`} />
              </div>
            </div>
            <p className="mt-2 text-2xl font-bold text-foreground truncate">
              {card.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}
