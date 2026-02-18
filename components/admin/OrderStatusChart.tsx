"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { OrderStatusData } from "@/lib/actions/admin-analytics";
import { ClipboardList } from "lucide-react";

interface OrderStatusChartProps {
  data: OrderStatusData[];
}

export function OrderStatusChart({ data }: OrderStatusChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  if (total === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <ClipboardList className="h-5 w-5 text-dodo-yellow" />
          <h3 className="font-semibold text-foreground">
            Répartition des statuts
          </h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Aucune commande pour le moment.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <ClipboardList className="h-5 w-5 text-dodo-yellow" />
        <h3 className="font-semibold text-foreground">
          Répartition des statuts
        </h3>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        {total} commande{total > 1 ? "s" : ""} au total
      </p>
      <div style={{ width: "100%", height: 280 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={3}
              stroke="none"
            >
              {data.map((entry, idx) => (
                <Cell key={idx} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#18181b",
                border: "1px solid #27272a",
                borderRadius: 8,
                color: "#fafafa",
                fontSize: 13,
              }}
              formatter={(value, name) => [
                `${value} (${((Number(value) / total) * 100).toFixed(0)}%)`,
                name,
              ]}
            />
            <Legend
              verticalAlign="bottom"
              iconType="circle"
              formatter={(value: string) => (
                <span className="text-sm text-muted-foreground">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
