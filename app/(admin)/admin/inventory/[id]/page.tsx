import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { writeClient } from "@/sanity/lib/client";
import { notFound } from "next/navigation";
import { ProductDetailClient } from "./ProductDetailClient";

interface ProductDetail {
  _id: string;
  name: string;
  slug: { current: string } | null;
  description: string | null;
  price: number;
  stock: number;
  material: string | null;
  color: string | null;
  dimensions: string | null;
  featured: boolean;
  assemblyRequired: boolean;
  isDraft: boolean;
  hasReferences: boolean;
  referenceCount: number;
  images: Array<{
    _key: string;
    _type: string;
    asset: { _ref: string; url?: string } | null;
  }>;
}

async function getProductDetail(id: string): Promise<ProductDetail | null> {
  // Try both the published and draft versions
  const product = await writeClient.fetch(
    `*[_type == "product" && (_id == $id || _id == "drafts." + $id || _id == $draftId)] | order(_updatedAt desc) [0] {
      _id,
      name,
      slug,
      description,
      price,
      stock,
      material,
      color,
      dimensions,
      featured,
      assemblyRequired,
      "images": images[] {
        _key, _type,
        "asset": asset { _ref, "url": @->url }
      }
    }`,
    { id, draftId: `drafts.${id}` },
    { cache: "no-store" }
  );

  if (!product) return null;

  // Check for references
  const baseId = id.replace("drafts.", "");
  const references = await writeClient.fetch(
    `count(*[_type == "order" && references($id)])`,
    { id: baseId },
    { cache: "no-store" }
  );

  return {
    ...product,
    isDraft: product._id?.startsWith("drafts."),
    hasReferences: references > 0,
    referenceCount: references,
    images: product.images || [],
  };
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const product = await getProductDetail(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Back Link */}
      <Link
        href="/admin/inventory"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour à l&apos;inventaire
      </Link>

      {/* Product Detail */}
      <ProductDetailClient product={product} documentId={id} />
    </div>
  );
}
