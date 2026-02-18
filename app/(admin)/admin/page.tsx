import { Suspense } from "react";
import Link from "next/link";
import { Plus, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  RevenueStats,
  OrderStats,
  StockSummary,
  RecentOrdersWidget,
  EnhancedKPIs,
  ChartsSection,
  LowStockDashboardWidget,
} from "@/components/admin/widgets";
import { AIInsightsCard } from "@/components/admin";

function WidgetSkeleton() {
  return (
    <div className="rounded-lg border border-border bg-card p-4 animate-pulse">
      <div className="h-4 w-24 bg-secondary rounded mb-4" />
      <div className="h-8 w-32 bg-secondary rounded" />
    </div>
  );
}

function StatsGridSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <WidgetSkeleton key={i} />
      ))}
    </div>
  );
}

function ChartsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border bg-card p-6 animate-pulse">
        <div className="h-5 w-48 bg-secondary rounded mb-4" />
        <div className="h-[300px] bg-secondary/30 rounded" />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-6 animate-pulse">
          <div className="h-5 w-48 bg-secondary rounded mb-4" />
          <div className="h-[280px] bg-secondary/30 rounded" />
        </div>
        <div className="rounded-lg border border-border bg-card p-6 animate-pulse">
          <div className="h-5 w-48 bg-secondary rounded mb-4" />
          <div className="h-[280px] bg-secondary/30 rounded" />
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-dodo-yellow/10">
            <LayoutDashboard className="h-5 w-5 text-dodo-yellow" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Tableau de bord
            </h1>
            <p className="text-sm text-muted-foreground">
              Vue d&apos;ensemble de votre boutique
            </p>
          </div>
        </div>
        <Button asChild className="bg-dodo-yellow hover:bg-dodo-yellow-hover text-black">
          <Link href="/admin/inventory">
            <Plus className="mr-2 h-4 w-4" />
            Nouveau produit
          </Link>
        </Button>
      </div>

      {/* Low Stock Alerts (prominent) */}
      <Suspense fallback={null}>
        <LowStockDashboardWidget />
      </Suspense>

      {/* Revenue Stats Row */}
      <Suspense fallback={<StatsGridSkeleton />}>
        <RevenueStats />
      </Suspense>

      {/* Enhanced KPIs Row */}
      <Suspense fallback={<StatsGridSkeleton />}>
        <EnhancedKPIs />
      </Suspense>

      {/* Three Column Grid: Orders, Stock, Recent Orders */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Suspense fallback={<WidgetSkeleton />}>
          <OrderStats />
        </Suspense>
        <Suspense fallback={<WidgetSkeleton />}>
          <StockSummary />
        </Suspense>
        <Suspense fallback={<WidgetSkeleton />}>
          <RecentOrdersWidget />
        </Suspense>
      </div>

      {/* Charts Section */}
      <Suspense fallback={<ChartsSkeleton />}>
        <ChartsSection />
      </Suspense>

      {/* AI Insights */}
      <AIInsightsCard />
    </div>
  );
}
