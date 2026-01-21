import { sanityFetch } from "@/sanity/lib/live";
import { ANALYTICS_SUMMARY_QUERY } from "@/lib/sanity/queries/analytics";
import { formatPrice } from "@/lib/utils";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";

export async function RevenueStats() {
  // Calculate date ranges
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const { data } = await sanityFetch({
    query: ANALYTICS_SUMMARY_QUERY,
    params: { todayStart, weekStart, monthStart },
  });

  const stats = [
    {
      label: "Aujourd'hui",
      revenue: data.todayRevenue ?? 0,
      orders: data.todayOrders ?? 0,
    },
    {
      label: "Cette semaine",
      revenue: data.weekRevenue ?? 0,
      orders: data.weekOrders ?? 0,
    },
    {
      label: "Ce mois",
      revenue: data.monthRevenue ?? 0,
      orders: data.monthOrders ?? 0,
    },
    {
      label: "Total",
      revenue: data.totalRevenue ?? 0,
      orders: data.orderCount ?? 0,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-lg border border-border bg-card p-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{stat.label}</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-dodo-yellow">
            {formatPrice(stat.revenue)}
          </p>
          <p className="text-sm text-muted-foreground">
            {stat.orders} commande{stat.orders !== 1 ? "s" : ""}
          </p>
        </div>
      ))}
    </div>
  );
}
