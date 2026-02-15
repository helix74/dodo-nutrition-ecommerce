import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-dodo-yellow/10 via-background to-background py-20">
      {/* Decorative glow */}
      <div
        className="pointer-events-none absolute -top-24 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-dodo-yellow/5 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
          واش مازلت محيّر؟
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
          Des suppléments authentiques, une livraison rapide partout en Tunisie,
          et un service client à votre écoute.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="bg-dodo-yellow text-black hover:bg-dodo-yellow-hover"
          >
            <Link href="/shop">
              أدخل شوف
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>

          <Button asChild size="lg" variant="outline">
            <Link href="/categories">Voir les catégories</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
