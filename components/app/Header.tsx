"use client";

import Link from "next/link";
import Image from "next/image";
import { Package, ShoppingBag, Sparkles, User, Heart, Search, Menu, X } from "lucide-react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { useCartActions, useTotalItems } from "@/lib/store/cart-store-provider";
import { useChatActions, useIsChatOpen } from "@/lib/store/chat-store-provider";
import { useWishlistItems } from "@/lib/store/wishlist-store-provider";
import { SearchDialog } from "@/components/app/SearchDialog";
import { useState } from "react";

const navLinks = [
  { label: "الرئيسية", href: "/" },
  { label: "المتجر", href: "/shop" },
  { label: "الباقات", href: "/packs", highlight: true },
  { label: "العروض", href: "/promotions", highlight: true },
  { label: "التصنيفات", href: "/categories" },
  { label: "الماركات", href: "/brands" },
];

export function Header() {
  const { openCart } = useCartActions();
  const { openChat } = useChatActions();
  const isChatOpen = useIsChatOpen();
  const totalItems = useTotalItems();
  const wishlistItems = useWishlistItems();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md">
      {/* Main Header */}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Mobile Menu Button */}
        <button
          type="button"
          className="lg:hidden p-2 text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image
            src="/logo_dodo_nutrition.png"
            alt="Dodo Nutrition"
            width={40}
            height={40}
            className="h-10 w-10 object-contain"
          />
          <span className="hidden sm:block text-lg font-bold text-foreground">
            Dodo Nutrition
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 text-sm font-medium transition-colors rounded-lg ${
                link.highlight
                  ? "text-dodo-red hover:bg-dodo-red/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              {link.label}
              {link.highlight && (
                <span className="ml-1.5 inline-flex h-1.5 w-1.5 rounded-full bg-dodo-red animate-pulse" />
              )}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Search Button - Desktop */}
          <Button
            variant="ghost"
            size="icon"
            className="hidden sm:flex text-muted-foreground hover:text-foreground"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="h-5 w-5" />
            <span className="sr-only">بحث</span>
          </Button>

          {/* AI Shopping Assistant */}
          {!isChatOpen && (
            <Button
              onClick={openChat}
              size="sm"
              className="hidden sm:flex gap-2 bg-dodo-yellow text-black font-semibold hover:bg-dodo-yellow/90 shadow-md shadow-dodo-yellow/20"
            >
              <Sparkles className="h-4 w-4" />
              <span className="hidden md:inline text-sm">Ask AI</span>
            </Button>
          )}

          {/* Mobile AI Button */}
          {!isChatOpen && (
            <Button
              onClick={openChat}
              size="icon"
              className="sm:hidden bg-dodo-yellow text-black hover:bg-dodo-yellow/90"
            >
              <Sparkles className="h-5 w-5" />
            </Button>
          )}

          {/* Wishlist - Desktop */}
          <Button
            variant="ghost"
            size="icon"
            className="hidden sm:flex text-muted-foreground hover:text-foreground relative"
            asChild
          >
            <Link href="/wishlist">
              <Heart className="h-5 w-5" />
              {wishlistItems.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-dodo-red text-[10px] font-bold text-white">
                  {wishlistItems.length > 99 ? "99+" : wishlistItems.length}
                </span>
              )}
              <span className="sr-only">المفضلة</span>
            </Link>
          </Button>

          {/* Cart Button */}
          <Button
            variant="ghost"
            size="icon"
            className="relative text-muted-foreground hover:text-foreground"
            onClick={openCart}
          >
            <ShoppingBag className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-dodo-yellow text-xs font-bold text-black">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
            <span className="sr-only">القفة ({totalItems})</span>
          </Button>

          {/* My Orders - Only when signed in (Desktop) */}
          <SignedIn>
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="hidden md:flex text-muted-foreground hover:text-foreground"
            >
              <Link href="/orders">
                <Package className="h-5 w-5" />
                <span className="sr-only">طلباتي</span>
              </Link>
            </Button>
          </SignedIn>

          {/* User */}
          <SignedIn>
            <UserButton
              afterSwitchSessionUrl="/"
              appearance={{
                elements: {
                  avatarBox: "h-9 w-9",
                },
              }}
            >
              <UserButton.MenuItems>
                <UserButton.Link
                  label="طلباتي"
                  labelIcon={<Package className="h-4 w-4" />}
                  href="/orders"
                />
                <UserButton.Link
                  label="المفضلة"
                  labelIcon={<Heart className="h-4 w-4" />}
                  href="/wishlist"
                />
              </UserButton.MenuItems>
            </UserButton>
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <User className="h-5 w-5" />
                <span className="sr-only">دخول</span>
              </Button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-background">
          <nav className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 text-sm font-medium transition-colors rounded-lg ${
                    link.highlight
                      ? "text-dodo-red bg-dodo-red/5"
                      : "text-foreground hover:bg-secondary"
                  }`}
                >
                  {link.label}
                  {link.highlight && (
                    <span className="ml-2 inline-flex h-2 w-2 rounded-full bg-dodo-red animate-pulse" />
                  )}
                </Link>
              ))}
              <hr className="my-2 border-border" />
              <Link
                href="/wishlist"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary rounded-lg"
              >
                <Heart className="h-4 w-4" />
                Ma Wishlist
              </Link>
              <SignedIn>
                <Link
                  href="/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary rounded-lg"
                >
                  <Package className="h-4 w-4" />
                  Mes Commandes
                </Link>
              </SignedIn>
            </div>
          </nav>
        </div>
      )}
      {/* Search Dialog */}
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  );
}
