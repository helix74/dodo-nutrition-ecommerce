"use server";

import { sanityFetch } from "@/sanity/lib/live";
import {
  ENHANCED_KPIS_QUERY,
  ORDERS_BY_GOUVERNORAT_QUERY,
  FULL_ORDER_STATUS_QUERY,
  REVENUE_OVER_TIME_QUERY,
} from "@/lib/sanity/queries/analytics";

// ============ Enhanced KPIs ============

export interface EnhancedKPIs {
  avgOrderValue: number;
  lowStockCount: number;
  outOfStockCount: number;
  topCategory: string | null;
}

export async function getEnhancedKPIs(): Promise<EnhancedKPIs> {
  const { data } = await sanityFetch({ query: ENHANCED_KPIS_QUERY });

  const categoryNames = (data.topCategory ?? []) as string[];
  const categoryCounts = new Map<string, number>();
  for (const name of categoryNames) {
    categoryCounts.set(name, (categoryCounts.get(name) ?? 0) + 1);
  }

  let topCategory: string | null = null;
  let maxCount = 0;
  for (const [name, count] of categoryCounts) {
    if (count > maxCount) {
      maxCount = count;
      topCategory = name;
    }
  }

  return {
    avgOrderValue: data.avgOrderValue ?? 0,
    lowStockCount: data.lowStockCount ?? 0,
    outOfStockCount: data.outOfStockCount ?? 0,
    topCategory,
  };
}

// ============ Orders by Gouvernorat ============

export interface GouvernoratData {
  gouvernorat: string;
  commandes: number;
}

export async function getOrdersByGouvernorat(): Promise<GouvernoratData[]> {
  const { data } = await sanityFetch({ query: ORDERS_BY_GOUVERNORAT_QUERY });

  const countMap = new Map<string, number>();
  for (const order of data) {
    const gov = order.gouvernorat;
    if (gov) {
      countMap.set(gov, (countMap.get(gov) ?? 0) + 1);
    }
  }

  return Array.from(countMap.entries())
    .map(([gouvernorat, commandes]) => ({ gouvernorat, commandes }))
    .sort((a, b) => b.commandes - a.commandes)
    .slice(0, 10);
}

// ============ Order Status Distribution ============

export interface OrderStatusData {
  name: string;
  value: number;
  color: string;
}

const STATUS_LABELS: Record<string, string> = {
  pending: "En attente",
  confirmed: "Confirmée",
  shipped: "Expédiée",
  delivered: "Livrée",
  cancelled: "Annulée",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "#eab308",
  confirmed: "#22c55e",
  shipped: "#3b82f6",
  delivered: "#10b981",
  cancelled: "#ef4444",
};

export async function getOrderStatusDistribution(): Promise<OrderStatusData[]> {
  const { data } = await sanityFetch({ query: FULL_ORDER_STATUS_QUERY });

  return Object.entries(data)
    .filter(([, count]) => (count as number) > 0)
    .map(([status, count]) => ({
      name: STATUS_LABELS[status] ?? status,
      value: count as number,
      color: STATUS_COLORS[status] ?? "#71717a",
    }));
}

// ============ Revenue Over Time ============

export interface DailyRevenue {
  date: string;
  revenus: number;
  commandes: number;
}

export async function getRevenueOverTime(): Promise<DailyRevenue[]> {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data } = await sanityFetch({
    query: REVENUE_OVER_TIME_QUERY,
    params: { startDate: thirtyDaysAgo.toISOString() },
  });

  const dayMap = new Map<string, { revenus: number; commandes: number }>();

  for (let i = 0; i < 30; i++) {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    const key = d.toISOString().slice(0, 10);
    dayMap.set(key, { revenus: 0, commandes: 0 });
  }

  for (const order of data) {
    if (!order.date) continue;
    const key = order.date.slice(0, 10);
    const entry = dayMap.get(key);
    if (entry) {
      entry.revenus += order.total ?? 0;
      entry.commandes += 1;
    }
  }

  return Array.from(dayMap.entries()).map(([date, stats]) => ({
    date,
    ...stats,
  }));
}
