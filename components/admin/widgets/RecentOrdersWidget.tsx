import { sanityFetch } from "@/sanity/lib/live";
import { RECENT_ORDERS_DASHBOARD_QUERY } from "@/lib/sanity/queries/analytics";
import { formatPrice, formatDate, formatOrderNumber } from "@/lib/utils";
import { getOrderStatus } from "@/lib/constants/orderStatus";
import Link from "next/link";

export async function RecentOrdersWidget() {
  const { data: orders } = await sanityFetch({
    query: RECENT_ORDERS_DASHBOARD_QUERY,
  });

  if (!orders || orders.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-4">
        <h3 className="font-semibold text-foreground mb-4">Commandes récentes</h3>
        <p className="text-center text-muted-foreground py-8">
          Aucune commande pour le moment
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">Commandes récentes</h3>
        <Link 
          href="/admin/orders" 
          className="text-sm text-dodo-yellow hover:underline"
        >
          Voir tout
        </Link>
      </div>

      <div className="space-y-3">
        {orders.map((order: any) => {
          const status = getOrderStatus(order.status);
          const StatusIcon = status.icon;

          return (
            <Link
              key={order._id}
              href={`/admin/orders/${order._id}`}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary transition-colors"
            >
              <div className={`flex h-8 w-8 items-center justify-center rounded-full ${status.color}`}>
                <StatusIcon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    #{formatOrderNumber(order.orderNumber)}
                  </span>
                  <span className="text-sm font-semibold text-dodo-yellow">
                    {formatPrice(order.total)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground truncate">
                    {order.customerName ?? "Client"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(order.createdAt)}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
