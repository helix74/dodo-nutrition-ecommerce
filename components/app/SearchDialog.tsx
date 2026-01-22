"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Handle search submission
  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!query.trim()) return;

      setIsSearching(true);
      // Navigate to shop with search query
      router.push(`/shop?search=${encodeURIComponent(query.trim())}`);
      onOpenChange(false);
      setQuery("");
      setIsSearching(false);
    },
    [query, router, onOpenChange]
  );

  // Reset on close
  useEffect(() => {
    if (!open) {
      setQuery("");
    }
  }, [open]);

  // Keyboard shortcut (Cmd+K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-card border-border p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Rechercher</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSearch}>
          <div className="flex items-center border-b border-border px-4">
            {isSearching ? (
              <Loader2 className="mr-3 h-5 w-5 animate-spin text-muted-foreground" />
            ) : (
              <Search className="mr-3 h-5 w-5 text-muted-foreground" />
            )}
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher des produits..."
              className="border-0 bg-transparent py-6 text-base placeholder:text-muted-foreground focus-visible:ring-0"
              autoFocus
            />
          </div>
          <div className="px-4 py-3 text-xs text-muted-foreground">
            <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-xs">
              ⏎ Entrée
            </kbd>{" "}
            pour rechercher •{" "}
            <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-xs">
              Échap
            </kbd>{" "}
            pour fermer
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
