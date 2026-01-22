import { sanityFetch } from "@/sanity/lib/live";
import { FEATURED_PRODUCTS_QUERY, ALL_BRANDS_QUERY } from "@/lib/sanity/queries/products";
import { ALL_CATEGORIES_QUERY } from "@/lib/sanity/queries/categories";
import { ACTIVE_BANNERS_QUERY } from "@/lib/sanity/queries/banners";
import { FEATURED_PACKS_QUERY } from "@/lib/sanity/queries/packs";
import { FEATURED_REVIEWS_QUERY, REVIEW_STATS_QUERY } from "@/lib/sanity/queries/reviews";
import { HeroSection } from "@/components/home/HeroSection";
import { TrustBar } from "@/components/home/TrustBar";
import { CategoryShowcase } from "@/components/home/CategoryShowcase";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { FeaturedPacks } from "@/components/home/FeaturedPacks";
import { BannerSection } from "@/components/home/BannerSection";
import { PromoBanner } from "@/components/home/PromoBanner";
import { BrandsCarousel } from "@/components/home/BrandsCarousel";
import { WhyUsSection } from "@/components/home/WhyUsSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dodo Nutrition | Suppléments & Nutrition Sportive en Tunisie",
  description: "Votre partenaire nutrition sportive en Tunisie. Protéines, créatine, pre-workout, vitamines et suppléments de qualité premium. Livraison rapide partout en Tunisie.",
  keywords: "nutrition sportive, suppléments, protéines, créatine, pre-workout, vitamines, Tunisie, Dodo Nutrition",
};

export default async function HomePage() {
  // Fetch all data in parallel
  const [categoriesResult, brandsResult, featuredResult, bannersResult, packsResult, reviewsResult, statsResult] = await Promise.all([
    sanityFetch({ query: ALL_CATEGORIES_QUERY }),
    sanityFetch({ query: ALL_BRANDS_QUERY }),
    sanityFetch({ query: FEATURED_PRODUCTS_QUERY }),
    sanityFetch({ query: ACTIVE_BANNERS_QUERY }),
    sanityFetch({ query: FEATURED_PACKS_QUERY }),
    sanityFetch({ query: FEATURED_REVIEWS_QUERY }),
    sanityFetch({ query: REVIEW_STATS_QUERY }),
  ]);

  const categories = categoriesResult.data;
  const brands = brandsResult.data;
  const featuredProducts = featuredResult.data;
  const banners = bannersResult.data;
  const featuredPacks = packsResult.data;
  const featuredReviews = reviewsResult.data || [];
  const reviewStats = statsResult.data || { average: null, count: 0 };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Main banner with slider */}
      <HeroSection />

      {/* Trust Bar - Confidence badges */}
      <TrustBar />

      {/* Categories Showcase */}
      <CategoryShowcase categories={categories} />

      {/* CMS Promo Banners - from Sanity Studio */}
      <BannerSection banners={banners} />

      {/* Featured Packs */}
      <FeaturedPacks packs={featuredPacks} />

      {/* Featured Products */}
      <FeaturedProducts products={featuredProducts} />

      {/* Promo Banner with Countdown */}
      <PromoBanner />

      {/* Brands Carousel */}
      <BrandsCarousel brands={brands} />

      {/* Why Choose Us */}
      <WhyUsSection />

      {/* Customer Testimonials */}
      <TestimonialsSection reviews={featuredReviews} stats={reviewStats} />

      {/* Newsletter */}
      <NewsletterSection />
    </div>
  );
}
