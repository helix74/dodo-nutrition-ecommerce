import { sanityFetch } from "@/sanity/lib/live";
import { ORDERS_BY_STATUS_QUERY } from "@/lib/sanity/queries/analytics";
import { getOrderStatus } from "@/lib/constants/orderStatus";
import Link from "next/link";

export async function OrderStats() {
  const { data } = await sanityFetch({
    query: ORDERS_BY_STATUS_QUERY,
  });

  const statuses = [
    { key: "pending", count: data.pending ?? 0 },
    { key: "confirmed", count: data.confirmed ?? 0 },
    { key: "shipped", count: data.shipped ?? 0 },
    { key: "delivered", count: data.delivered ?? 0 },
  ];

  const total = statuses.reduce((sum, s) => sum + s.count, 0);

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">Commandes par statut</h3>
        <Link 
          href="/admin/orders" 
          className="text-sm text-dodo-yellow hover:underline"
        >
          Voir tout
        </Link>
      </div>

      <div className="space-y-3">
        {statuses.map((stat) => {
          const status = getOrderStatus(stat.key as any);
          const StatusIcon = status.icon;
          const percentage = total > 0 ? (stat.count / total) * 100 : 0;

          return (
            <div key={stat.key} className="flex items-center gap-3">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full ${status.color}`}>
                <StatusIcon className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">{status.label}</span>
                  <span className="text-sm font-medium text-foreground">{stat.count}</span>
                </div>
                <div className="mt-1 h-1.5 rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-dodo-yellow"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {(data.cancelled ?? 0) > 0 && (
        <p className="mt-4 text-sm text-muted-foreground">
          + {data.cancelled} annulée{data.cancelled !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}
