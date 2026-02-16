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

  // Split brands into two rows
  const mid = Math.ceil(brands.length / 2);
  const row1 = brands.slice(0, mid);
  const row2 = brands.slice(mid);
  const doubledRow1 = [...row1, ...row1];
  const doubledRow2 = [...row2, ...row2];

  const renderRow = (items: Brand[], keyPrefix: string) => (
    <div className="marquee-track flex gap-10 items-center">
      {items.map((brand, index) => {
        const logoUrl = brand.logo?.asset?.url;
        return (
          <div
            key={`${keyPrefix}-${brand._id}-${index}`}
            className="shrink-0 flex items-center justify-center h-14 w-28"
          >
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={brand.name ?? "Brand"}
                width={112}
                height={56}
                className="max-h-14 w-auto object-contain opacity-60 transition-opacity hover:opacity-100 grayscale hover:grayscale-0"
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
  );

  return (
    <section className="py-12 bg-background overflow-hidden">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
          الماركات اللي نخدمو معاهم
        </h2>
        <p className="mt-2 text-muted-foreground">
          أحسن الماركات العالميّة في التغذية الرياضيّة
        </p>
      </div>
      <div className="space-y-4">
        <div className="group/marquee marquee-container">
          {renderRow(doubledRow1, "r1")}
        </div>
        <div className="group/marquee marquee-container marquee-reverse">
          {renderRow(doubledRow2, "r2")}
        </div>
      </div>
    </section>
  );
}
