"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { DailyRevenue } from "@/lib/actions/admin-analytics";
import { TrendingUp } from "lucide-react";

interface RevenueChartProps {
  data: DailyRevenue[];
}

function formatDateLabel(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

export function RevenueChart({ data }: RevenueChartProps) {
  const totalRevenue = data.reduce((sum, d) => sum + d.revenus, 0);
  const totalOrders = data.reduce((sum, d) => sum + d.commandes, 0);

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-dodo-yellow" />
          <h3 className="font-semibold text-foreground">
            Revenus (30 derniers jours)
          </h3>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-dodo-yellow">
            {totalRevenue.toFixed(2)} TND
          </p>
          <p className="text-xs text-muted-foreground">
            {totalOrders} commande{totalOrders > 1 ? "s" : ""}
          </p>
        </div>
      </div>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <AreaChart
            data={data}
            margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#fee257" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#fee257" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#27272a"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tickFormatter={formatDateLabel}
              tick={{ fill: "#a1a1aa", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
              minTickGap={40}
            />
            <YAxis
              tick={{ fill: "#a1a1aa", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={60}
              tickFormatter={(v: number) =>
                v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v.toString()
              }
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#18181b",
                border: "1px solid #27272a",
                borderRadius: 8,
                color: "#fafafa",
                fontSize: 13,
              }}
              labelFormatter={(label) => formatDateLabel(String(label))}
              formatter={(value, name) => {
                if (name === "revenus") return [`${Number(value).toFixed(2)} TND`, "Revenus"];
                return [`${value}`, "Commandes"];
              }}
            />
            <Area
              type="monotone"
              dataKey="revenus"
              stroke="#fee257"
              strokeWidth={2}
              fill="url(#revenueGradient)"
              dot={false}
              activeDot={{ r: 4, fill: "#fee257", stroke: "#0a0a0a", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
