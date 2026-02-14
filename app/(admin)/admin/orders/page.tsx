import { writeClient } from "@/sanity/lib/client";
import type { OrderRowData } from "@/components/admin/OrderRow";
import { OrdersClient } from "./OrdersClient";

async function getOrders(): Promise<OrderRowData[]> {
  return writeClient.fetch(
    `*[_type == "order"] | order(_createdAt desc) {
      _id,
      orderNumber,
      "email": coalesce(email, customerEmail),
      "total": coalesce(total, totalPrice),
      status,
      "createdAt": _createdAt,
      "itemCount": count(items)
    }`,
    {},
    { cache: "no-store" }
  );
}

export default async function OrdersPage() {
  const orders = await getOrders();
  return <OrdersClient orders={orders} />;
}
