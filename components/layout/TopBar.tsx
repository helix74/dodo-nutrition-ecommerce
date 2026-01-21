import { Phone, Truck } from "lucide-react";

export function TopBar() {
  return (
    <div className="bg-secondary border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-9 items-center justify-between text-xs">
          {/* Left - Shipping info */}
          <div className="flex items-center gap-2 text-muted-foreground">
            <Truck className="h-3.5 w-3.5 text-dodo-yellow" />
            <span>
              <span className="hidden sm:inline">Livraison gratuite dès </span>
              <span className="font-semibold text-dodo-yellow">150 TND</span>
            </span>
          </div>

          {/* Right - Contact */}
          <a
            href="tel:+21670123456"
            className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-dodo-yellow"
          >
            <Phone className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">+216 70 123 456</span>
            <span className="sm:hidden">Appelez-nous</span>
          </a>
        </div>
      </div>
    </div>
  );
}
