"use client";

import Link from "next/link";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getOrderStatus } from "@/lib/constants/orderStatus";
import { formatPrice, formatDate, formatOrderNumber } from "@/lib/utils";

export interface OrderRowData {
  _id: string;
  orderNumber: string;
  email?: string;
  customerEmail?: string;
  total?: number;
  totalPrice?: number;
  status: string;
  createdAt?: string;
  _createdAt?: string;
  itemCount?: number;
}

interface OrderRowProps {
  order: OrderRowData;
}

function OrderRowContent({ order }: OrderRowProps) {
  const email = order.email || order.customerEmail || "";
  const total = order.total || order.totalPrice || 0;
  const createdAt = order.createdAt || order._createdAt || "";
  const status = getOrderStatus(order.status);
  const StatusIcon = status.icon;

  return (
    <TableRow className="group transition-colors hover:bg-muted/50">
      {/* Order Info */}
      <TableCell className="py-3 sm:py-4">
        <Link href={`/admin/orders/${order._id}`} className="block">
          <div className="flex items-center justify-between gap-2 sm:block">
            <span className="font-medium text-foreground">
              #{formatOrderNumber(order.orderNumber)}
            </span>
            <span className="font-medium text-foreground sm:hidden">
              {formatPrice(total)}
            </span>
          </div>
          <div className="mt-1 sm:hidden">
            <p className="truncate text-xs text-muted-foreground">
              {email}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {order.itemCount} {order.itemCount === 1 ? "article" : "articles"}
              {createdAt && (
                <>
                  {" · "}
                  {formatDate(createdAt, "short")}
                </>
              )}
            </p>
            <div className="mt-2">
              <Badge
                className={`${status.color} flex w-fit items-center gap-1 text-[10px]`}
              >
                <StatusIcon className="h-3 w-3" />
                <span>{status.label}</span>
              </Badge>
            </div>
          </div>
        </Link>
      </TableCell>

      {/* Email - Desktop only */}
      <TableCell className="hidden py-4 text-muted-foreground sm:table-cell">
        <Link href={`/admin/orders/${order._id}`} className="block truncate">
          {email}
        </Link>
      </TableCell>

      {/* Items - Desktop only */}
      <TableCell className="hidden py-4 text-center md:table-cell">
        <Link href={`/admin/orders/${order._id}`} className="block text-foreground">
          {order.itemCount ?? "—"}
        </Link>
      </TableCell>

      {/* Total - Desktop only */}
      <TableCell className="hidden py-4 font-medium text-foreground sm:table-cell">
        <Link href={`/admin/orders/${order._id}`} className="block">
          {formatPrice(total)}
        </Link>
      </TableCell>

      {/* Status - Desktop only */}
      <TableCell className="hidden py-4 sm:table-cell">
        <Link href={`/admin/orders/${order._id}`} className="flex justify-start">
          <Badge className={`${status.color} flex w-fit items-center gap-1 text-xs`}>
            <StatusIcon className="h-3 w-3" />
            <span>{status.label}</span>
          </Badge>
        </Link>
      </TableCell>

      {/* Date - Desktop only */}
      <TableCell className="hidden py-4 text-muted-foreground md:table-cell">
        <Link href={`/admin/orders/${order._id}`} className="block">
          {formatDate(createdAt, "long", "—")}
        </Link>
      </TableCell>
    </TableRow>
  );
}

function OrderRowSkeleton() {
  return (
    <TableRow>
      <TableCell className="py-3 sm:py-4">
        <div>
          <div className="flex items-center justify-between gap-2 sm:block">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-14 sm:hidden" />
          </div>
          <div className="mt-1 sm:hidden">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="mt-1 h-3 w-20" />
          </div>
        </div>
      </TableCell>
      <TableCell className="hidden py-4 sm:table-cell">
        <Skeleton className="h-4 w-40" />
      </TableCell>
      <TableCell className="hidden py-4 text-center md:table-cell">
        <Skeleton className="mx-auto h-4 w-8" />
      </TableCell>
      <TableCell className="hidden py-4 sm:table-cell">
        <Skeleton className="h-4 w-16" />
      </TableCell>
      <TableCell className="py-3 sm:py-4">
        <div className="flex justify-center sm:justify-start">
          <Skeleton className="h-5 w-8 sm:w-20" />
        </div>
      </TableCell>
      <TableCell className="hidden py-4 md:table-cell">
        <Skeleton className="h-4 w-24" />
      </TableCell>
    </TableRow>
  );
}

export function OrderRow({ order }: OrderRowProps) {
  return <OrderRowContent order={order} />;
}

export { OrderRowSkeleton };
