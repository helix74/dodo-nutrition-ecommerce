"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { ArrowLeft, ShoppingBag, AlertTriangle, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CheckoutForm, type CheckoutFormData } from "@/components/app/CheckoutForm";
import { LoginPromptDialog } from "@/components/app/LoginPromptDialog";
import { formatPrice } from "@/lib/utils";
import {
  useCartItems,
  useTotalPrice,
  useTotalItems,
  useClearCart,
} from "@/lib/store/cart-store-provider";
import { useCartStock } from "@/lib/hooks/useCartStock";
import { createCODOrder } from "@/lib/actions/checkout";
import { toast } from "sonner";

export function CheckoutClient() {
  const router = useRouter();
  const { isSignedIn, isLoaded, user } = useUser();
  const items = useCartItems();
  const totalPrice = useTotalPrice();
  const totalItems = useTotalItems();
  const clearCart = useClearCart();
  const { stockMap, isLoading: isCheckingStock, hasStockIssues } = useCartStock(items);

  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [hasSeenLoginPrompt, setHasSeenLoginPrompt] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Show login prompt for guests (only once)
  useEffect(() => {
    if (isLoaded && !isSignedIn && items.length > 0 && !hasSeenLoginPrompt) {
      // Small delay for better UX
      const timer = setTimeout(() => {
        setShowLoginPrompt(true);
        setHasSeenLoginPrompt(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isLoaded, isSignedIn, items.length, hasSeenLoginPrompt]);

  const handleContinueAsGuest = () => {
    setShowLoginPrompt(false);
  };

  const handleSubmit = async (formData: CheckoutFormData) => {
    setIsSubmitting(true);

    try {
      const result = await createCODOrder({
        items: items.map((item) => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        address: {
          name: formData.name,
          line1: formData.line1,
          city: formData.city,
          gouvernorat: formData.gouvernorat,
          postcode: formData.postcode || undefined,
        },
        phone: formData.phone,
        email: isSignedIn ? (user?.primaryEmailAddress?.emailAddress ?? formData.email) : formData.email,
        notes: formData.notes || undefined,
      });

      if (result.success && result.orderNumber) {
        // Mark order as successful BEFORE clearing cart
        setOrderSuccess(true);
        
        // Clear cart
        clearCart();
        
        // Small delay to ensure state is set before redirect
        setTimeout(() => {
          router.push(`/checkout/success?order=${result.orderNumber}&total=${totalPrice}`);
        }, 100);
      } else {
        toast.error(result.error ?? "Une erreur est survenue");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Order success state - show loading while redirecting
  if (orderSuccess) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
          <h1 className="mt-6 text-2xl font-bold text-foreground">
            Commande confirmée !
          </h1>
          <p className="mt-2 text-muted-foreground">
            Redirection en cours...
          </p>
          <Loader2 className="mx-auto mt-4 h-6 w-6 animate-spin text-dodo-yellow" />
        </div>
      </div>
    );
  }

  // Empty cart state
  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground" />
          <h1 className="mt-6 text-2xl font-bold text-foreground">
            Votre panier est vide
          </h1>
          <p className="mt-2 text-muted-foreground">
            Ajoutez des produits à votre panier avant de commander.
          </p>
          <Button asChild className="mt-8 bg-dodo-yellow hover:bg-dodo-yellow-hover text-black">
            <Link href="/shop">Continuer vos achats</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Login Prompt Dialog */}
      <LoginPromptDialog
        open={showLoginPrompt}
        onOpenChange={setShowLoginPrompt}
        onContinueAsGuest={handleContinueAsGuest}
      />

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/shop"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-dodo-yellow transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Continuer vos achats
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-foreground">
            Finaliser votre commande
          </h1>
        </div>

        <div className="grid gap-8 lg:grid-cols-5">
          {/* Checkout Form */}
          <div className="lg:col-span-3">
            <div className="card-dodo p-6">
              <CheckoutForm
                onSubmit={handleSubmit}
                isLoading={isSubmitting}
                disabled={hasStockIssues || isCheckingStock}
              />
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 space-y-6">
              {/* Cart Items */}
              <div className="card-dodo">
                <div className="border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
                  <h2 className="font-semibold text-foreground">
                    🛒 Récapitulatif ({totalItems} articles)
                  </h2>
                </div>

                {/* Stock Issues Warning */}
                {hasStockIssues && !isCheckingStock && (
                  <div className="mx-6 mt-4 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-200">
                    <AlertTriangle className="h-5 w-5 shrink-0" />
                    <span>
                      Certains articles ont des problèmes de stock.
                    </span>
                  </div>
                )}

                {/* Loading State */}
                {isCheckingStock && (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
                    <span className="ml-2 text-sm text-muted-foreground">
                      Vérification du stock...
                    </span>
                  </div>
                )}

                {/* Items List */}
                <div className="divide-y divide-zinc-200 dark:divide-zinc-800 max-h-[400px] overflow-y-auto">
                  {items.map((item) => {
                    const stockInfo = stockMap.get(item.productId);
                    const hasIssue =
                      stockInfo?.isOutOfStock || stockInfo?.exceedsStock;

                    return (
                      <div
                        key={item.productId}
                        className={`flex gap-3 px-6 py-4 ${
                          hasIssue ? "bg-red-50 dark:bg-red-950/20" : ""
                        }`}
                      >
                        {/* Image */}
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-zinc-100 dark:bg-zinc-800">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-xs text-zinc-400">
                              Pas d'image
                            </div>
                          )}
                        </div>

                        {/* Details */}
                        <div className="flex flex-1 flex-col justify-between min-w-0">
                          <h3 className="font-medium text-sm text-foreground truncate">
                            {item.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            x{item.quantity} • {formatPrice(item.price)}
                          </p>
                          {stockInfo?.isOutOfStock && (
                            <p className="text-xs font-medium text-red-600">
                              Rupture de stock
                            </p>
                          )}
                        </div>

                        {/* Price */}
                        <div className="text-right shrink-0">
                          <p className="font-medium text-foreground">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Total */}
                <div className="border-t border-zinc-200 px-6 py-4 dark:border-zinc-800">
                  <div className="flex justify-between text-lg font-semibold">
                    <span className="text-foreground">
                      Total
                    </span>
                    <span className="text-dodo-yellow">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Livraison calculée à la confirmation
                  </p>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="rounded-lg border border-zinc-200 bg-card p-4 dark:border-zinc-800 dark:bg-zinc-950">
                <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                  <span>🔒</span>
                  <span>Paiement sécurisé à la livraison</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400 mt-2">
                  <span>🚚</span>
                  <span>Livraison partout en Tunisie</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400 mt-2">
                  <span>📞</span>
                  <span>Confirmation par téléphone</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
