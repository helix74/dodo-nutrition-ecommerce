import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { sanityFetch } from "@/sanity/lib/live";
import {
  PRODUCT_BY_SLUG_QUERY,
  RELATED_PRODUCTS_QUERY,
} from "@/lib/sanity/queries/products";
import {
  CATEGORY_REVIEWS_QUERY,
  CATEGORY_RATING_QUERY,
} from "@/lib/sanity/queries/reviews";
import { ProductGallery } from "@/components/app/ProductGallery";
import { ProductInfo } from "@/components/app/ProductInfo";
import { ProductAccordion } from "@/components/app/ProductAccordion";
import { CategoryReviews } from "@/components/app/CategoryReviews";
import { RelatedProducts } from "@/components/app/RelatedProducts";
import { TrackViewContent } from "@/components/tracking/TrackViewContent";
import { ProductJsonLd } from "@/components/seo/JsonLd";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://dodonutrition.tn";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { data: product } = await sanityFetch({
    query: PRODUCT_BY_SLUG_QUERY,
    params: { slug },
  });

  if (!product) {
    return { title: "Produit introuvable | Dodo Nutrition" };
  }

  const title = `${product.name} | Dodo Nutrition`;
  const description = product.description
    ? product.description.slice(0, 160)
    : `Achetez ${product.name} chez Dodo Nutrition. Livraison rapide en Tunisie.`;
  const imageUrl = product.images?.[0]?.asset?.url;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `${siteUrl}/products/${product.slug}`,
      ...(imageUrl && {
        images: [{ url: imageUrl, alt: product.name ?? "Dodo Nutrition" }],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(imageUrl && { images: [imageUrl] }),
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  // Fetch product data
  const { data: product } = await sanityFetch({
    query: PRODUCT_BY_SLUG_QUERY,
    params: { slug },
  });

  if (!product) {
    notFound();
  }

  const categoryId = product.category?._id || "";

  // Fetch category reviews, rating, and related products in parallel
  const [reviewsResult, ratingResult, relatedResult] = await Promise.all([
    sanityFetch({
      query: CATEGORY_REVIEWS_QUERY,
      params: { categoryId },
    }),
    sanityFetch({
      query: CATEGORY_RATING_QUERY,
      params: { categoryId },
    }),
    sanityFetch({
      query: RELATED_PRODUCTS_QUERY,
      params: {
        categoryId,
        productId: product._id,
      },
    }),
  ]);

  const reviews = reviewsResult.data || [];
  const rating = ratingResult.data || { average: null, count: 0 };
  const relatedProducts = relatedResult.data || [];

  return (
    <div className="min-h-screen bg-background">
      <TrackViewContent
        product={{
          id: product._id,
          name: product.name ?? "",
          category: product.category?.title ?? "",
          price: product.priceRetail ?? 0,
        }}
      />
      <ProductJsonLd
        product={product}
        siteUrl={siteUrl}
        rating={rating}
      />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero Section: Image + Product Info */}
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Image Gallery — constrained so CTAs are visible without scroll */}
          <div className="lg:col-span-2">
            <ProductGallery images={product.images} productName={product.name} />
          </div>

          {/* Product Info (Compact) */}
          <div className="lg:col-span-3">
            <ProductInfo
              product={product}
              averageRating={rating.average}
              reviewCount={rating.count}
            />
          </div>
        </div>

        {/* Accordion Sections */}
        <div className="mt-12">
          <ProductAccordion
            content={product.content}
            benefits={product.benefits}
            dosage={product.dosage}
            allergens={product.allergens}
            certifications={product.certifications}
          />
        </div>

        {/* Category Reviews Section */}
        <div id="reviews" className="mt-12 border-t border-border pt-12">
          <CategoryReviews
            categoryId={categoryId}
            categoryName={product.category?.title || "cette catégorie"}
            reviews={reviews}
            averageRating={rating.average}
            reviewCount={rating.count}
          />
        </div>

        {/* Related Products */}
        <div className="mt-12 border-t border-border pt-12">
          <RelatedProducts products={relatedProducts} />
        </div>
      </div>
    </div>
  );
}
