"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Menu,
  X,
  ExternalLink,
  Star,
  LogOut,
  Users,
  FileText,
} from "lucide-react";
import { LowStockBadge } from "@/components/admin/LowStockBadge";
import { AdminChat } from "@/components/admin/AdminChat";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { adminLogoutAction } from "@/lib/actions/admin-mutations";

const navItems = [
  {
    label: "Tableau de bord",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Inventaire",
    href: "/admin/inventory",
    icon: Package,
    badge: "low-stock" as const,
  },
  {
    label: "Commandes",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    label: "Avis",
    href: "/admin/reviews",
    icon: Star,
  },
  {
    label: "Fournisseurs",
    href: "/admin/suppliers",
    icon: Users,
  },
  {
    label: "Factures",
    href: "/admin/invoices",
    icon: FileText,
  },
];

function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggingOut, startLogout] = useTransition();

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
      <div className="flex min-h-screen bg-background">
        {/* Mobile Header */}
        <div className="fixed left-0 right-0 top-0 z-50 flex h-14 items-center justify-between border-b border-border bg-card px-4 lg:hidden">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-dodo-yellow">
              <span className="text-sm font-bold text-black">D</span>
            </div>
            <span className="text-lg font-semibold text-foreground">
              Admin
            </span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <button
            type="button"
            aria-label="Fermer la barre latérale"
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={cn(
            "fixed left-0 top-0 z-50 h-screen w-64 border-r border-border bg-card transition-transform",
            sidebarOpen ? "translate-x-0" : "-translate-x-full",
            "lg:translate-x-0",
          )}
        >
          <div className="flex h-full flex-col">
            {/* Logo */}
            <div className="flex h-16 items-center border-b border-border px-6">
              <Link
                href="/admin"
                className="flex items-center gap-2"
                onClick={() => setSidebarOpen(false)}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-dodo-yellow">
                  <span className="text-sm font-bold text-black">D</span>
                </div>
                <span className="text-lg font-semibold text-foreground">
                  Admin
                </span>
              </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 px-3 py-4">
              {navItems.map((item) => {
                const isActive =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-dodo-yellow/10 text-dodo-yellow"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                    {"badge" in item && item.badge === "low-stock" && (
                      <LowStockBadge />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Footer */}
            <div className="space-y-3 border-t border-border px-3 py-4">
              <Link
                href="/studio"
                target="_blank"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center justify-between gap-2 rounded-lg bg-secondary px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary/80"
              >
                Ouvrir Studio
                <ExternalLink className="h-4 w-4" />
              </Link>
              <Link
                href="/"
                onClick={() => setSidebarOpen(false)}
                className="block px-3 text-sm text-muted-foreground hover:text-foreground"
              >
                ← Retour à la boutique
              </Link>
              <button
                type="button"
                onClick={() => startLogout(() => adminLogoutAction())}
                disabled={isLoggingOut}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-dodo-red transition-colors hover:bg-dodo-red/10 disabled:opacity-50"
              >
                <LogOut className="h-4 w-4" />
                {isLoggingOut ? "Déconnexion..." : "Se déconnecter"}
              </button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 pt-14 lg:ml-64 lg:pt-0">
          <div className="p-4 lg:p-8">{children}</div>
        </main>

        {/* AI Chat Widget */}
        <AdminChat />
      </div>
  );
}

export default AdminLayout;
