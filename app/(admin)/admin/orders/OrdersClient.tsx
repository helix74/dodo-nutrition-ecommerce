"use client";

import { useState, useMemo } from "react";
import { ShoppingCart } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody } from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";
import {
  OrderRow,
  OrderRowSkeleton,
  AdminSearch,
  useDebouncedValue,
  OrderTableHeader,
} from "@/components/admin";
import type { OrderRowData } from "@/components/admin/OrderRow";
import { ORDER_STATUS_TABS } from "@/lib/constants/orderStatus";

interface OrdersClientProps {
  orders: OrderRowData[];
}

export function OrdersClient({ orders }: OrdersClientProps) {
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebouncedValue(searchQuery, 300);

  const filteredOrders = useMemo(() => {
    let result = orders;

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((o) => o.status === statusFilter);
    }

    // Apply search filter
    if (debouncedSearch.trim()) {
      const query = debouncedSearch.toLowerCase();
      result = result.filter(
        (o) =>
          o.orderNumber?.toLowerCase().includes(query) ||
          o.email?.toLowerCase().includes(query) ||
          o.customerEmail?.toLowerCase().includes(query)
      );
    }

    return result;
  }, [orders, statusFilter, debouncedSearch]);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
          Commandes
        </h1>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">
          Gérer et suivre les commandes clients
        </p>
      </div>

      {/* Search and Tabs */}
      <div className="flex flex-col gap-4">
        <AdminSearch
          placeholder="Search by order # or email..."
          value={searchQuery}
          onChange={setSearchQuery}
          className="w-full sm:max-w-xs"
        />
        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          <Tabs value={statusFilter} onValueChange={setStatusFilter}>
            <TabsList className="w-max">
              {ORDER_STATUS_TABS.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="text-xs sm:text-sm"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Order List */}
      {filteredOrders.length === 0 ? (
        <EmptyState
          icon={ShoppingCart}
          title="No orders found"
          description={
            debouncedSearch
              ? "Try adjusting your search terms."
              : statusFilter === "all"
                ? "Orders will appear here when customers make purchases."
                : `No ${statusFilter} orders at the moment.`
          }
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <Table className="min-w-[800px]">
            <OrderTableHeader />
            <TableBody>
              {filteredOrders.map((order) => (
                <OrderRow key={order._id} order={order} />
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
