import Image from "next/image";

interface Brand {
  _id: string;
  name: string | null;
  logo?: {
    asset?: {
      _id: string;
      url: string | null;
    } | null;
  } | null;
}

interface BrandsMarqueeProps {
  brands: Brand[] | null;
}

export function BrandsMarquee({ brands }: BrandsMarqueeProps) {
  if (!brands || brands.length === 0) {
    return null;
  }

  // Double the brands array for seamless infinite loop
  const doubledBrands = [...brands, ...brands];

  return (
    <section className="py-12 bg-background overflow-hidden">
      <div className="group/marquee marquee-container">
        <div className="marquee-track flex gap-12 items-center">
          {doubledBrands.map((brand, index) => {
            const logoUrl = brand.logo?.asset?.url;
            
            return (
              <div
                key={`${brand._id}-${index}`}
                className="flex-shrink-0 flex items-center justify-center h-16 w-32"
              >
                {logoUrl ? (
                  <Image
                    src={logoUrl}
                    alt={brand.name ?? "Brand"}
                    width={128}
                    height={64}
                    className="max-h-16 w-auto object-contain opacity-60 transition-opacity hover:opacity-100 grayscale hover:grayscale-0"
                  />
                ) : (
                  <span className="text-sm font-medium text-muted-foreground">
                    {brand.name}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
