import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { Package, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { sanityFetch } from "@/sanity/lib/live";
import { ORDERS_BY_USER_QUERY } from "@/lib/sanity/queries/orders";
import { getOrderStatus } from "@/lib/constants/orderStatus";
import { formatPrice, formatDate, formatOrderNumber } from "@/lib/utils";
import { StackedProductImages } from "@/components/app/StackedProductImages";

export const metadata = {
  title: "Mes Commandes | Dodo Nutrition",
  description: "Consultez l'historique de vos commandes",
};

export default async function OrdersPage() {
  const { userId } = await auth();

  const { data: orders } = await sanityFetch({
    query: ORDERS_BY_USER_QUERY,
    params: { clerkUserId: userId ?? "" },
  });

  if (orders.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <EmptyState
          icon={Package}
          title="Aucune commande"
          description="Quand vous passez une commande, elle apparaîtra ici."
          action={{ label: "Commencer vos achats", href: "/shop" }}
          size="lg"
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          Mes Commandes
        </h1>
        <p className="mt-2 text-muted-foreground">
          Suivez et gérez vos commandes
        </p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => {
          const status = getOrderStatus(order.status);
          const StatusIcon = status.icon;
          const images = (order.itemImages ?? []).filter(
            (url): url is string => url !== null,
          );

          return (
            <Link
              key={order._id}
              href={`/orders/${order._id}`}
              className="group block card-dodo transition-all hover:border-dodo-yellow/50"
            >
              <div className="flex gap-5 p-5">
                {/* Left: Product Images Stack */}
                <StackedProductImages
                  images={images}
                  totalCount={order.itemCount ?? 0}
                  size="lg"
                />

                {/* Right: Order Details */}
                <div className="flex min-w-0 flex-1 flex-col justify-between">
                  {/* Top: Order Info + Status */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground">
                        Order #{formatOrderNumber(order.orderNumber)}
                      </p>
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <Badge
                      className={`${status.color} shrink-0 flex items-center gap-1`}
                    >
                      <StatusIcon className="h-3 w-3" />
                      {status.label}
                    </Badge>
                  </div>

                  {/* Bottom: Items + Total */}
                  <div className="mt-2 flex items-end justify-between">
                    <p className="text-sm text-muted-foreground">
                      {order.itemCount}{" "}
                      {order.itemCount === 1 ? "article" : "articles"}
                    </p>
                    <p className="text-lg font-semibold text-dodo-yellow">
                      {formatPrice(order.total)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer: View Details */}
              <div className="flex items-center justify-between border-t border-zinc-100 px-5 py-3 dark:border-zinc-800">
                <p className="truncate text-sm text-zinc-500 dark:text-zinc-400">
                  {order.itemNames?.slice(0, 2).filter(Boolean).join(", ")}
                  {(order.itemNames?.length ?? 0) > 2 && "..."}
                </p>
                <span className="flex shrink-0 items-center gap-1 text-sm font-medium text-muted-foreground transition-colors group-hover:text-dodo-yellow">
                  Voir la commande
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
