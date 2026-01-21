"use client";

import { useTransition } from "react";
import { CheckCircle, Truck, PackageCheck, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { updateOrderStatus } from "@/lib/actions/orders";
import type { OrderStatusValue } from "@/lib/constants/orderStatus";

interface QuickStatusActionsProps {
  orderId: string;
  currentStatus: string;
}

interface StatusAction {
  label: string;
  icon: typeof CheckCircle;
  targetStatus: OrderStatusValue;
  variant: "default" | "destructive" | "outline";
  className?: string;
}

// Define valid transitions for COD workflow
const STATUS_ACTIONS: Record<string, StatusAction[]> = {
  pending: [
    {
      label: "Confirmer",
      icon: CheckCircle,
      targetStatus: "confirmed",
      variant: "default",
      className: "bg-dodo-yellow hover:bg-dodo-yellow-hover text-black",
    },
    {
      label: "Annuler",
      icon: XCircle,
      targetStatus: "cancelled",
      variant: "destructive",
      className: "bg-dodo-red hover:bg-dodo-red/90",
    },
  ],
  confirmed: [
    {
      label: "Expédier",
      icon: Truck,
      targetStatus: "shipped",
      variant: "default",
      className: "bg-dodo-yellow hover:bg-dodo-yellow-hover text-black",
    },
    {
      label: "Annuler",
      icon: XCircle,
      targetStatus: "cancelled",
      variant: "destructive",
      className: "bg-dodo-red hover:bg-dodo-red/90",
    },
  ],
  shipped: [
    {
      label: "Livré",
      icon: PackageCheck,
      targetStatus: "delivered",
      variant: "default",
      className: "bg-green-600 hover:bg-green-700 text-white",
    },
    {
      label: "Annuler",
      icon: XCircle,
      targetStatus: "cancelled",
      variant: "destructive",
      className: "bg-dodo-red hover:bg-dodo-red/90",
    },
  ],
  delivered: [],
  cancelled: [],
  paid: [
    {
      label: "Confirmer",
      icon: CheckCircle,
      targetStatus: "confirmed",
      variant: "default",
      className: "bg-dodo-yellow hover:bg-dodo-yellow-hover text-black",
    },
  ],
};

export function QuickStatusActions({ orderId, currentStatus }: QuickStatusActionsProps) {
  const [isPending, startTransition] = useTransition();

  const actions = STATUS_ACTIONS[currentStatus] ?? [];

  if (actions.length === 0) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <CheckCircle className="h-4 w-4 text-green-500" />
        <span>Commande {currentStatus === "delivered" ? "livrée" : "terminée"}</span>
      </div>
    );
  }

  const handleAction = (action: StatusAction) => {
    startTransition(async () => {
      const result = await updateOrderStatus(orderId, action.targetStatus);

      if (result.success) {
        toast.success(`Statut mis à jour: ${action.label}`);
      } else {
        toast.error(result.error ?? "Erreur lors de la mise à jour");
      }
    });
  };

  return (
    <div className="flex flex-wrap gap-2">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <Button
            key={action.targetStatus}
            variant={action.variant}
            size="sm"
            className={action.className}
            onClick={() => handleAction(action)}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Icon className="mr-2 h-4 w-4" />
            )}
            {action.label}
          </Button>
        );
      })}
    </div>
  );
}
