import {
  getOrdersByGouvernorat,
  getOrderStatusDistribution,
  getRevenueOverTime,
} from "@/lib/actions/admin-analytics";
import { OrdersByCity } from "@/components/admin/OrdersByCity";
import { OrderStatusChart } from "@/components/admin/OrderStatusChart";
import { RevenueChart } from "@/components/admin/RevenueChart";

export async function ChartsSection() {
  const [gouvernoratData, statusData, revenueData] = await Promise.all([
    getOrdersByGouvernorat(),
    getOrderStatusDistribution(),
    getRevenueOverTime(),
  ]);

  return (
    <div className="space-y-6">
      {/* Revenue chart — full width */}
      <RevenueChart data={revenueData} />

      {/* Two-column: Orders by gouvernorat + Status distribution */}
      <div className="grid gap-6 lg:grid-cols-2">
        <OrdersByCity data={gouvernoratData} />
        <OrderStatusChart data={statusData} />
      </div>
    </div>
  );
}
