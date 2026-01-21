"use client";

import Link from "next/link";
import { CheckCircle, Home, Package, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

interface CODSuccessClientProps {
  orderNumber: string;
  total?: number;
}

export function CODSuccessClient({ orderNumber, total }: CODSuccessClientProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Success Header */}
      <div className="text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
          <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
        </div>
        
        {/* Darija + French */}
        <h1 className="mt-6 text-3xl font-bold text-dodo-yellow">
          شكراً على طلبك!
        </h1>
        <p className="mt-2 text-xl text-foreground">
          Merci pour votre commande!
        </p>
      </div>

      {/* Order Details */}
      <div className="mt-8 card-dodo p-6">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-dodo-yellow/10 px-4 py-2">
            <Package className="h-5 w-5 text-dodo-yellow" />
            <span className="font-mono font-semibold text-dodo-yellow">
              {orderNumber}
            </span>
          </div>
          
          {total && (
            <p className="mt-4 text-2xl font-bold text-foreground">
              {formatPrice(total)}
            </p>
          )}
          
          <p className="mt-2 text-sm text-muted-foreground">
            Paiement à la livraison
          </p>
        </div>

        <div className="mt-6 border-t border-zinc-200 pt-6 dark:border-zinc-800">
          <div className="flex items-center gap-3 text-sm">
            <PhoneCall className="h-5 w-5 text-dodo-yellow" />
            <p className="text-muted-foreground">
              Nous vous contacterons bientôt pour confirmer votre commande.
            </p>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="mt-8 card-dodo p-6">
        <h2 className="font-semibold text-foreground">
          Prochaines étapes
        </h2>
        <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-dodo-yellow">1.</span>
            <span>Vous recevrez un appel de confirmation sous 24h</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-dodo-yellow">2.</span>
            <span>Votre commande sera préparée et expédiée</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-dodo-yellow">3.</span>
            <span>Livraison à domicile, paiement en espèces</span>
          </li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
        <Button
          asChild
          size="lg"
          className="bg-dodo-yellow hover:bg-dodo-yellow-hover text-black"
        >
          <Link href="/shop">
            <Home className="mr-2 h-4 w-4" />
            Continuer vos achats
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/orders">
            <Package className="mr-2 h-4 w-4" />
            Voir mes commandes
          </Link>
        </Button>
      </div>

      {/* Future: Upsell Section - requires server-side data fetching */}
      {/* 
      <div className="mt-16">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-6">
          🔥 Vous aimerez aussi...
        </h2>
        <RelatedProducts products={[]} />
      </div>
      */}
    </div>
  );
}
