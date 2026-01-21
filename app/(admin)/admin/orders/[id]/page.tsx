"use client";

import { Suspense, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { useDocumentProjection, type DocumentHandle } from "@sanity/sdk-react";
import {
  ArrowLeft,
  MapPin,
  CreditCard,
  ExternalLink,
  Edit2,
  Phone,
  FileText,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  StatusSelect,
  AddressEditor,
  PublishButton,
  RevertButton,
  QuickStatusActions,
} from "@/components/admin";
import { formatPrice, formatDate } from "@/lib/utils";
import { getOrderStatus } from "@/lib/constants/orderStatus";

interface OrderDetailProjection {
  _id: string;
  orderNumber: string;
  email: string;
  total: number;
  status: string;
  paymentMethod: string | null;
  phone: string | null;
  gouvernorat: string | null;
  notes: string | null;
  createdAt: string;
  stripePaymentId: string | null;
  address: {
    name: string;
    line1: string;
    line2: string | null;
    city: string;
    postcode: string;
    country: string;
  } | null;
  items: Array<{
    _key: string;
    quantity: number;
    priceAtPurchase: number;
    product: {
      _id: string;
      name: string;
      slug: string;
      image: {
        asset: {
          url: string;
        } | null;
      } | null;
    } | null;
  }>;
}

function OrderDetailContent({ handle }: { handle: DocumentHandle }) {
  const { data } = useDocumentProjection<OrderDetailProjection>({
    ...handle,
    projection: `{
      _id,
      orderNumber,
      email,
      total,
      status,
      paymentMethod,
      phone,
      gouvernorat,
      notes,
      createdAt,
      stripePaymentId,
      address{
        name,
        line1,
        line2,
        city,
        postcode,
        country
      },
      items[]{
        _key,
        quantity,
        priceAtPurchase,
        product->{
          _id,
          name,
          "slug": slug.current,
          "image": images[0]{
            asset->{
              url
            }
          }
        }
      }
    }`,
  });

  const statusConfig = data ? getOrderStatus(data.status) : null;

  if (!data) {
    return (
      <div className="py-16 text-center">
        <p className="text-muted-foreground">Commande introuvable</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-foreground sm:text-2xl">
              Commande {data.orderNumber}
            </h1>
            {statusConfig && (
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                <statusConfig.icon className="h-3 w-3" />
                {statusConfig.label}
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatDate(data.createdAt, "datetime")}
            {data.paymentMethod && (
              <span className="ml-2 text-dodo-yellow">• {data.paymentMethod === 'cod' ? 'Paiement à la livraison' : 'Carte'}</span>
            )}
          </p>
        </div>

        {/* Quick Status Actions */}
        <div className="flex flex-col gap-3 sm:items-end">
          <QuickStatusActions orderId={data._id} currentStatus={data.status} />
          <div className="flex items-center gap-2">
            <Suspense fallback={null}>
              <RevertButton {...handle} />
            </Suspense>
            <Suspense fallback={null}>
              <PublishButton {...handle} />
            </Suspense>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5 lg:gap-8">
        {/* Order Items */}
        <div className="space-y-6 lg:col-span-3">
          <div className="rounded-xl border border-border bg-card">
            <div className="border-b border-border px-4 py-3 sm:px-6 sm:py-4">
              <h2 className="font-semibold text-foreground">
                Articles ({data.items?.length ?? 0})
              </h2>
            </div>
            <div className="divide-y divide-border">
              {data.items?.map((item) => (
                <div
                  key={item._key}
                  className="flex gap-3 px-4 py-3 sm:gap-4 sm:px-6 sm:py-4"
                >
                  {/* Image */}
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-secondary sm:h-20 sm:w-20">
                    {item.product?.image?.asset?.url ? (
                      <Image
                        src={item.product.image.asset.url}
                        alt={item.product.name ?? "Produit"}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                        Aucune image
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex items-start gap-2">
                        <span className="text-sm font-medium text-foreground sm:text-base">
                          {item.product?.name ?? "Produit inconnu"}
                        </span>
                        {item.product?.slug && (
                          <Link
                            href={`/products/${item.product.slug}`}
                            target="_blank"
                            className="shrink-0 text-muted-foreground hover:text-foreground"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Link>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                        Qté: {item.quantity} ×{" "}
                        {formatPrice(item.priceAtPurchase)}
                      </p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground sm:text-base">
                      {formatPrice(
                        (item.priceAtPurchase ?? 0) * (item.quantity ?? 1),
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
            <h2 className="font-semibold text-foreground">
              Résumé de la commande
            </h2>
            <div className="mt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Sous-total
                </span>
                <span className="text-foreground">
                  {formatPrice(data.total)}
                </span>
              </div>
              <div className="border-t border-border pt-3">
                <div className="flex justify-between font-semibold">
                  <span className="text-foreground">
                    Total
                  </span>
                  <span className="text-foreground">
                    {formatPrice(data.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6 lg:col-span-2">
          {/* COD Info - Only show for COD orders */}
          {data.paymentMethod === 'cod' && (data.phone || data.gouvernorat || data.notes) && (
            <div className="rounded-xl border border-dodo-yellow/30 bg-dodo-yellow/5 p-4 sm:p-6">
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-dodo-yellow" />
                <h2 className="font-semibold text-foreground">
                  Informations livraison
                </h2>
              </div>
              <div className="mt-4 space-y-3 text-sm">
                {data.phone && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Téléphone</span>
                    <a 
                      href={`tel:${data.phone}`}
                      className="font-medium text-dodo-yellow hover:underline"
                    >
                      {data.phone}
                    </a>
                  </div>
                )}
                {data.gouvernorat && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Gouvernorat</span>
                    <span className="font-medium text-foreground">{data.gouvernorat}</span>
                  </div>
                )}
                {data.notes && (
                  <div className="pt-2 border-t border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Notes</span>
                    </div>
                    <p className="text-foreground bg-card rounded-lg p-2">{data.notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Customer Info */}
          <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              <h2 className="font-semibold text-foreground">
                Client
              </h2>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <p className="break-all text-foreground">
                {data.email}
              </p>
              {data.stripePaymentId && (
                <p className="break-all text-xs text-muted-foreground">
                  Paiement: {data.stripePaymentId}
                </p>
              )}
            </div>
          </div>

          {/* Editable Shipping Address */}
          <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <h2 className="font-semibold text-foreground">
                  Adresse de livraison
                </h2>
              </div>
              <Edit2 className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="mt-4">
              <Suspense
                fallback={
                  <div className="space-y-3">
                    <Skeleton className="h-16" />
                    <Skeleton className="h-16" />
                    <Skeleton className="h-16" />
                  </div>
                }
              >
                <AddressEditor {...handle} />
              </Suspense>
            </div>
          </div>

          {/* Studio Link */}
          <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
            <h2 className="font-semibold text-foreground">
              Édition avancée
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Pour des modifications supplémentaires, éditez cette commande dans Sanity Studio.
            </p>
            <Link
              href={`/studio/structure/order;${handle.documentId}`}
              target="_blank"
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-foreground hover:text-muted-foreground"
            >
              Ouvrir dans Studio
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderDetailSkeleton() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Skeleton className="h-7 w-40 sm:h-8 sm:w-48" />
          <Skeleton className="mt-2 h-4 w-32" />
        </div>
        <Skeleton className="h-10 w-full sm:w-[180px]" />
      </div>
      <div className="grid gap-6 lg:grid-cols-5 lg:gap-8">
        <div className="space-y-6 lg:col-span-3">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
        </div>
        <div className="space-y-6 lg:col-span-2">
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function OrderDetailPage({ params }: PageProps) {
  const { id } = use(params);

  const handle: DocumentHandle = {
    documentId: id,
    documentType: "order",
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Back Link */}
      <Link
        href="/admin/orders"
        className="inline-flex items-center text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Orders
      </Link>

      {/* Order Detail */}
      <Suspense fallback={<OrderDetailSkeleton />}>
        <OrderDetailContent handle={handle} />
      </Suspense>
    </div>
  );
}
