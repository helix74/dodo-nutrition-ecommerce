"use client";

import { useState } from "react";
import { Truck, RefreshCw, Package, AlertTriangle, Clock, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShippingStatusProps {
  trackingNumber: string | null;
  ciblexStatus: string | null;
  orderId: string;
}

const STATUS_DISPLAY: Record<string, { label: string; color: string; icon: typeof Truck }> = {
  "En Attente": { label: "En Attente", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  "A Enlever": { label: "A Enlever", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  "Enlev\u00e9": { label: "Enlev\u00e9", color: "bg-blue-100 text-blue-800", icon: Package },
  "Au D\u00e9p\u00f4t": { label: "Au D\u00e9p\u00f4t", color: "bg-blue-100 text-blue-800", icon: Package },
  "En Cours de Livraison": { label: "En Cours de Livraison", color: "bg-indigo-100 text-indigo-800", icon: Truck },
  "Livr\u00e9": { label: "Livr\u00e9", color: "bg-green-100 text-green-800", icon: CheckCircle2 },
  "Livr\u00e9 Pay\u00e9": { label: "Livr\u00e9 Pay\u00e9", color: "bg-green-100 text-green-800", icon: CheckCircle2 },
  "Retour D\u00e9p\u00f4t": { label: "Retour D\u00e9p\u00f4t", color: "bg-red-100 text-red-800", icon: AlertTriangle },
  "Anomalie de Livraison": { label: "Anomalie de Livraison", color: "bg-red-100 text-red-800", icon: AlertTriangle },
  "Retour Client Agence": { label: "Retour Client Agence", color: "bg-red-100 text-red-800", icon: AlertTriangle },
  "Retour D\u00e9finitif": { label: "Retour D\u00e9finitif", color: "bg-red-100 text-red-800", icon: AlertTriangle },
  "Retour Exp\u00e9diteur": { label: "Retour Exp\u00e9diteur", color: "bg-red-100 text-red-800", icon: AlertTriangle },
  "Retour Re\u00e7u": { label: "Retour Re\u00e7u", color: "bg-red-100 text-red-800", icon: AlertTriangle },
  "Echange Re\u00e7u": { label: "Echange Re\u00e7u", color: "bg-orange-100 text-orange-800", icon: RefreshCw },
};

export function ShippingStatus({ trackingNumber, ciblexStatus, orderId }: ShippingStatusProps) {
  const [syncing, setSyncing] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(ciblexStatus);
  const [error, setError] = useState<string | null>(null);
  const [lastSynced, setLastSynced] = useState<string | null>(null);

  if (!trackingNumber) {
    return (
      <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
        <div className="flex items-center gap-2">
          <Truck className="h-5 w-5 text-muted-foreground" />
          <h2 className="font-semibold text-foreground">Livraison Ciblex</h2>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          Aucun colis Ciblex associ&eacute; &agrave; cette commande.
        </p>
      </div>
    );
  }

  const statusInfo = currentStatus ? STATUS_DISPLAY[currentStatus] : null;
  const StatusIcon = statusInfo?.icon ?? Truck;

  async function handleSync() {
    setSyncing(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/shipping/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trackingNumber }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erreur de synchronisation");
        return;
      }

      if (data.results?.length > 0) {
        setCurrentStatus(data.results[0].ciblexStatus);
      }
      setLastSynced(new Date().toLocaleTimeString("fr-FR"));
    } catch {
      setError("Impossible de contacter le serveur");
    } finally {
      setSyncing(false);
    }
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Truck className="h-5 w-5 text-muted-foreground" />
          <h2 className="font-semibold text-foreground">Livraison Ciblex</h2>
        </div>
        <button
          onClick={handleSync}
          disabled={syncing}
          className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-secondary disabled:opacity-50 transition-colors"
        >
          <RefreshCw className={cn("h-3.5 w-3.5", syncing && "animate-spin")} />
          {syncing ? "Sync..." : "Synchroniser"}
        </button>
      </div>

      <div className="mt-4 space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Code-barres</span>
          <span className="font-mono font-medium text-foreground">{trackingNumber}</span>
        </div>

        {currentStatus && (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Statut Ciblex</span>
            <span className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
              statusInfo?.color ?? "bg-zinc-100 text-zinc-800",
            )}>
              <StatusIcon className="h-3 w-3" />
              {statusInfo?.label ?? currentStatus}
            </span>
          </div>
        )}

        {lastSynced && (
          <p className="text-xs text-muted-foreground">
            Derni&egrave;re sync : {lastSynced}
          </p>
        )}

        {error && (
          <div className="flex items-center gap-2 rounded-md bg-red-500/10 px-3 py-2 text-xs text-red-400">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
