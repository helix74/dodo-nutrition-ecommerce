"use client";

import { useState, useTransition } from "react";
import { updateOrderStatus } from "@/lib/actions/admin-mutations";
import { publishDocument } from "@/lib/actions/admin-mutations";
import { ORDER_STATUS_VALUES, ORDER_STATUS_CONFIG, getOrderStatus, type OrderStatusValue } from "@/lib/constants/orderStatus";

interface StatusSelectProps {
  documentId: string;
  initialStatus: string;
}

export function StatusSelect({ documentId, initialStatus }: StatusSelectProps) {
  const [status, setStatus] = useState(initialStatus);
  const [isPending, startTransition] = useTransition();
  const statusInfo = getOrderStatus(status as OrderStatusValue);
  const StatusIcon = statusInfo.icon;

  function handleChange(newStatus: string) {
    setStatus(newStatus);
    startTransition(async () => {
      await updateOrderStatus(documentId, newStatus);
      // Auto-publish the order after status update
      await publishDocument(documentId);
    });
  }

  return (
    <div className="flex items-center gap-2">
      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${statusInfo.color}`}>
        <StatusIcon className="h-4 w-4" />
      </div>
      <select
        value={status}
        onChange={(e) => handleChange(e.target.value)}
        disabled={isPending}
        className={`rounded-md border border-border bg-background px-2 py-1.5 text-sm text-foreground focus:border-dodo-yellow focus:outline-none focus:ring-1 focus:ring-dodo-yellow ${isPending ? "opacity-50" : ""}`}
      >
        {ORDER_STATUS_VALUES.map((s: OrderStatusValue) => (
          <option key={s} value={s}>
            {ORDER_STATUS_CONFIG[s].label}
          </option>
        ))}
      </select>
    </div>
  );
}

