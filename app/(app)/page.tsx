import { sanityFetch } from "@/sanity/lib/live";
import {
  FEATURED_PRODUCTS_QUERY,
  NEW_PRODUCTS_QUERY,
  PROMO_PRODUCTS_QUERY,
  ALL_BRANDS_QUERY,
} from "@/lib/sanity/queries/products";
import { ALL_CATEGORIES_QUERY } from "@/lib/sanity/queries/categories";
import { ACTIVE_BANNERS_QUERY } from "@/lib/sanity/queries/banners";
import { ACTIVE_HERO_SLIDES_QUERY } from "@/lib/sanity/queries/hero";
import { FEATURED_PACKS_QUERY } from "@/lib/sanity/queries/packs";
import { FEATURED_REVIEWS_QUERY, REVIEW_STATS_QUERY } from "@/lib/sanity/queries/reviews";
import { HeroSection } from "@/components/home/HeroSection";
import { GoalNavigator } from "@/components/home/GoalNavigator";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { BannerSection } from "@/components/home/BannerSection";
import { FeaturedPacks } from "@/components/home/FeaturedPacks";
import { CategoryShowcase } from "@/components/home/CategoryShowcase";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { BrandsMarquee } from "@/components/home/BrandsMarquee";
import { FinalCTA } from "@/components/home/FinalCTA";
import { OrganizationJsonLd } from "@/components/seo/JsonLd";
import { FadeIn, SlideUp } from "@/components/ui/motion";
import type { Metadata } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://dodonutrition.tn";

export const metadata: Metadata = {
  title: "Dodo Nutrition | Suppléments & Nutrition Sportive en Tunisie",
  description:
    "Votre partenaire nutrition sportive en Tunisie. Protéines, créatine, pre-workout, vitamines et suppléments de qualité premium. Livraison rapide partout en Tunisie.",
  keywords:
    "nutrition sportive, suppléments, protéines, créatine, pre-workout, vitamines, Tunisie, Dodo Nutrition",
};

export default async function HomePage() {
  // Fetch all data in parallel
  const [
    categoriesResult,
    brandsResult,
    featuredResult,
    newProductsResult,
    promoProductsResult,
    bannersResult,
    heroSlidesResult,
    packsResult,
    reviewsResult,
    statsResult,
  ] = await Promise.all([
    sanityFetch({ query: ALL_CATEGORIES_QUERY }),
    sanityFetch({ query: ALL_BRANDS_QUERY }),
    sanityFetch({ query: FEATURED_PRODUCTS_QUERY }),
    sanityFetch({ query: NEW_PRODUCTS_QUERY }),
    sanityFetch({ query: PROMO_PRODUCTS_QUERY }),
    sanityFetch({ query: ACTIVE_BANNERS_QUERY }),
    sanityFetch({ query: ACTIVE_HERO_SLIDES_QUERY }),
    sanityFetch({ query: FEATURED_PACKS_QUERY }),
    sanityFetch({ query: FEATURED_REVIEWS_QUERY }),
    sanityFetch({ query: REVIEW_STATS_QUERY }),
  ]);

  const categories = categoriesResult.data;
  const brands = brandsResult.data;
  const featuredProducts = featuredResult.data;
  const newProducts = newProductsResult.data;
  const promoProducts = promoProductsResult.data;
  const banners = bannersResult.data;
  const heroSlides = heroSlidesResult.data ?? [];
  const featuredPacks = packsResult.data;
  const featuredReviews = reviewsResult.data || [];
  const reviewStats = statsResult.data || { average: null, count: 0 };

  return (
    <div className="min-h-screen bg-background">
      <OrganizationJsonLd siteUrl={siteUrl} />

      {/* 1. Hero — CMS-driven slider + trust strip (no animation — above fold) */}
      <HeroSection slides={heroSlides} />

      {/* 2. Goal Navigator — علاش جاي؟ */}
      <FadeIn>
        <GoalNavigator />
      </FadeIn>

      {/* 3. Featured Products — tabs (best-sellers / جداد / promos) */}
      <SlideUp>
        <FeaturedProducts
          featured={featuredProducts}
          newProducts={newProducts}
          promoProducts={promoProducts}
        />
      </SlideUp>

      {/* 4. CMS Banners — full-bleed from Sanity Studio */}
      <FadeIn>
        <BannerSection banners={banners} />
      </FadeIn>

      {/* 5. Packs & Deals — الباكات */}
      <SlideUp>
        <FeaturedPacks packs={featuredPacks} />
      </SlideUp>

      {/* 6. Categories — تصنيفات */}
      <SlideUp>
        <CategoryShowcase categories={categories} />
      </SlideUp>

      {/* 7. Social Proof — reviews + rating summary */}
      <FadeIn>
        <TestimonialsSection reviews={featuredReviews} stats={reviewStats} />
      </FadeIn>

      {/* 8. Brands Marquee */}
      <FadeIn>
        <BrandsMarquee brands={brands} />
      </FadeIn>

      {/* 9. Final CTA — واش مازلت محيّر؟ */}
      <SlideUp>
        <FinalCTA />
      </SlideUp>
    </div>
  );
}
