"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";

interface MegaMenuProps {
  label: string;
  href: string;
  children: React.ReactNode;
}

export function MegaMenu({ label, href, children }: MegaMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  const handleMouseEnter = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsOpen(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  }, []);

  // Close menu immediately when clicking anywhere inside
  const handleItemClick = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger */}
      <Link
        href={href}
        className={`flex items-center gap-1 px-4 py-2 text-sm font-medium transition-colors rounded-lg ${
          isOpen
            ? "text-foreground bg-secondary"
            : "text-muted-foreground hover:text-foreground hover:bg-secondary"
        }`}
      >
        {label}
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </Link>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 z-50">
          <div 
            className="rounded-xl border border-border bg-card/95 backdrop-blur-lg p-5 shadow-2xl shadow-black/20"
            onClick={handleItemClick}
          >
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

// Categories Mega Menu Content
interface Category {
  _id: string;
  title: string;
  slug: string;
}

interface CategoriesMegaMenuProps {
  categories: Category[];
}

export function CategoriesMegaMenu({ categories }: CategoriesMegaMenuProps) {
  // Split into 2 columns
  const midpoint = Math.ceil(categories.length / 2);
  const col1 = categories.slice(0, midpoint);
  const col2 = categories.slice(midpoint);

  return (
    <div className="min-w-[320px]">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
        Catégories
      </p>
      <div className="grid grid-cols-2 gap-x-6 gap-y-1">
        {[col1, col2].map((col, colIndex) => (
          <div key={colIndex} className="flex flex-col">
            {col.map((cat) => (
              <Link
                key={cat._id}
                href={`/shop?category=${cat.slug}`}
                className="px-3 py-2.5 text-sm text-foreground hover:text-dodo-yellow hover:bg-secondary rounded-lg transition-colors"
              >
                {cat.title}
              </Link>
            ))}
          </div>
        ))}
      </div>
      <hr className="my-3 border-border" />
      <Link
        href="/categories"
        className="block text-center text-sm font-medium text-dodo-yellow hover:underline"
      >
        Voir tout →
      </Link>
    </div>
  );
}

// Brands Mega Menu Content
interface Brand {
  _id: string;
  name: string;
  slug: string;
  logo?: string;
}

interface BrandsMegaMenuProps {
  brands: Brand[];
}

export function BrandsMegaMenu({ brands }: BrandsMegaMenuProps) {
  const visibleBrands = brands.slice(0, 18);
  const hasMore = brands.length > 18;

  return (
    <div className="w-[640px] max-h-[420px] overflow-hidden">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
        Marques
      </p>
      <div className="grid grid-cols-6 gap-2">
        {visibleBrands.map((brand) => (
          <Link
            key={brand._id}
            href={`/shop?brand=${brand.slug}`}
            className="group flex flex-col items-center gap-1.5 p-2 rounded-lg border border-transparent hover:border-dodo-yellow/50 hover:bg-secondary transition-all"
          >
            {brand.logo ? (
              <div className="relative w-14 h-14 flex items-center justify-center">
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  width={56}
                  height={56}
                  className="object-contain max-h-14 filter brightness-0 invert opacity-70 group-hover:opacity-100 transition-opacity"
                />
              </div>
            ) : (
              <div className="w-14 h-14 flex items-center justify-center bg-secondary rounded-lg text-muted-foreground text-base font-bold">
                {brand.name.charAt(0)}
              </div>
            )}
            <span className="text-[10px] text-center text-muted-foreground group-hover:text-foreground leading-tight min-h-[24px] flex items-center">
              {brand.name}
            </span>
          </Link>
        ))}
      </div>
      {hasMore && (
        <>
          <hr className="my-3 border-border" />
          <Link
            href="/brands"
            className="block text-center text-sm font-medium text-dodo-yellow hover:underline"
          >
            Voir les {brands.length} marques →
          </Link>
        </>
      )}
      {!hasMore && (
        <>
          <hr className="my-3 border-border" />
          <Link
            href="/brands"
            className="block text-center text-sm font-medium text-dodo-yellow hover:underline"
          >
            Voir tout →
          </Link>
        </>
      )}
    </div>
  );
}
