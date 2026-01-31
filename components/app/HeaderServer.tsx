import { Suspense } from "react";
import { Header } from "@/components/app/Header";
import { getCategories, getBrands, type Category, type Brand } from "@/lib/data/megamenu";

// Server wrapper that fetches data and passes to client Header
export async function HeaderWithMegaMenu() {
  const [categories, brands] = await Promise.all([
    getCategories(),
    getBrands(),
  ]);

  return <Header categories={categories} brands={brands} />;
}

// Fallback for Suspense
export function HeaderFallback() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
        <div className="flex-1" />
        <div className="flex gap-2">
          <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />
          <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />
        </div>
      </div>
    </header>
  );
}
