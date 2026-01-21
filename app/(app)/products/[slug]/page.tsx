import { notFound } from "next/navigation";
import { sanityFetch } from "@/sanity/lib/live";
import {
  PRODUCT_BY_SLUG_QUERY,
  PRODUCT_REVIEWS_QUERY,
  PRODUCT_RATING_QUERY,
  RELATED_PRODUCTS_QUERY,
} from "@/lib/sanity/queries/products";
import { ProductGallery } from "@/components/app/ProductGallery";
import { ProductInfo } from "@/components/app/ProductInfo";
import { ProductAccordion } from "@/components/app/ProductAccordion";
import { ProductReviews } from "@/components/app/ProductReviews";
import { RelatedProducts } from "@/components/app/RelatedProducts";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
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

  // Fetch reviews, rating, and related products in parallel
  const [reviewsResult, ratingResult, relatedResult] = await Promise.all([
    sanityFetch({
      query: PRODUCT_REVIEWS_QUERY,
      params: { productId: product._id },
    }),
    sanityFetch({
      query: PRODUCT_RATING_QUERY,
      params: { productId: product._id },
    }),
    sanityFetch({
      query: RELATED_PRODUCTS_QUERY,
      params: {
        categoryId: product.category?._id || "",
        productId: product._id,
      },
    }),
  ]);

  const reviews = reviewsResult.data || [];
  const rating = ratingResult.data || { average: null, count: 0 };
  const relatedProducts = relatedResult.data || [];

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero Section: Image + Product Info */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Image Gallery */}
          <ProductGallery images={product.images} productName={product.name} />

          {/* Product Info (Compact) */}
          <ProductInfo
            product={product}
            averageRating={rating.average}
            reviewCount={rating.count}
          />
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

        {/* Reviews Section */}
        <div className="mt-12 border-t border-zinc-200 pt-12 dark:border-zinc-800">
          <ProductReviews
            productId={product._id}
            productName={product.name ?? "Produit"}
            reviews={reviews}
            averageRating={rating.average}
            reviewCount={rating.count}
          />
        </div>

        {/* Related Products */}
        <div className="mt-12 border-t border-zinc-200 pt-12 dark:border-zinc-800">
          <RelatedProducts products={relatedProducts} />
        </div>
      </div>
    </div>
  );
}

