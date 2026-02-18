"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { GouvernoratData } from "@/lib/actions/admin-analytics";
import { MapPin } from "lucide-react";

interface OrdersByCityProps {
  data: GouvernoratData[];
}

export function OrdersByCity({ data }: OrdersByCityProps) {
  if (data.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="h-5 w-5 text-dodo-yellow" />
          <h3 className="font-semibold text-foreground">
            Commandes par gouvernorat
          </h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Aucune donnée disponible pour le moment.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="h-5 w-5 text-dodo-yellow" />
        <h3 className="font-semibold text-foreground">
          Commandes par gouvernorat
        </h3>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Top {data.length} gouvernorats par nombre de commandes
      </p>
      <div style={{ width: "100%", height: data.length * 40 + 20 }}>
        <ResponsiveContainer>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
          >
            <XAxis
              type="number"
              allowDecimals={false}
              tick={{ fill: "#a1a1aa", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="gouvernorat"
              width={110}
              tick={{ fill: "#e4e4e7", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#18181b",
                border: "1px solid #27272a",
                borderRadius: 8,
                color: "#fafafa",
                fontSize: 13,
              }}
              formatter={(value) => [`${value}`, "Commandes"]}
              cursor={{ fill: "rgba(254, 226, 87, 0.05)" }}
            />
            <Bar dataKey="commandes" radius={[0, 4, 4, 0]} maxBarSize={28}>
              {data.map((_, idx) => (
                <Cell
                  key={idx}
                  fill={idx === 0 ? "#fee257" : "rgba(254, 226, 87, 0.5)"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
