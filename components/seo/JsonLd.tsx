interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

interface ProductJsonLdProps {
  product: {
    name: string | null;
    slug: string | null;
    description: string | null;
    priceRetail: number | null;
    stock: number | null;
    images?: Array<{ asset?: { url: string | null } | null } | null> | null;
    brand?: { name: string | null } | null;
  };
  siteUrl: string;
  rating?: { average: number | null; count: number } | null;
}

export function ProductJsonLd({ product, siteUrl, rating }: ProductJsonLdProps) {
  const imageUrl = product.images?.[0]?.asset?.url;
  const inStock = (product.stock ?? 0) > 0;

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    url: `${siteUrl}/products/${product.slug}`,
    ...(imageUrl && { image: imageUrl }),
    ...(product.brand?.name && {
      brand: { "@type": "Brand", name: product.brand.name },
    }),
    offers: {
      "@type": "Offer",
      price: product.priceRetail ?? 0,
      priceCurrency: "TND",
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `${siteUrl}/products/${product.slug}`,
    },
  };

  if (rating?.average && rating.count > 0) {
    data.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: rating.average.toFixed(1),
      reviewCount: rating.count,
    };
  }

  return <JsonLd data={data} />;
}

interface OrganizationJsonLdProps {
  siteUrl: string;
}

export function OrganizationJsonLd({ siteUrl }: OrganizationJsonLdProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Dodo Nutrition",
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    description:
      "Votre partenaire nutrition sportive en Tunisie. Protéines, créatine, pre-workout, vitamines et suppléments de qualité premium.",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: ["French", "Arabic"],
    },
  };

  return <JsonLd data={data} />;
}
