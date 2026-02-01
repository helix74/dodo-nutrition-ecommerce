"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  searchParams?: Record<string, string>;
}

export function Pagination({
  currentPage,
  totalPages,
  baseUrl,
  searchParams = {},
}: PaginationProps) {
  if (totalPages <= 1) return null;

  // Build URL with page parameter
  const buildUrl = (page: number) => {
    const params = new URLSearchParams(searchParams);
    if (page > 1) {
      params.set("page", page.toString());
    } else {
      params.delete("page");
    }
    const queryString = params.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  };

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      // Show all pages if 7 or less
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push("ellipsis");
      }

      // Show pages around current
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("ellipsis");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <nav 
      className="flex items-center justify-center gap-1 py-8"
      aria-label="Pagination"
    >
      {/* Previous Button */}
      <Link
        href={buildUrl(currentPage - 1)}
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-lg border border-border transition-colors",
          currentPage === 1
            ? "pointer-events-none opacity-50"
            : "hover:bg-dodo-yellow hover:text-black hover:border-dodo-yellow"
        )}
        aria-disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Page précédente</span>
      </Link>

      {/* Page Numbers */}
      {pages.map((page, index) => {
        if (page === "ellipsis") {
          return (
            <span
              key={`ellipsis-${index}`}
              className="flex h-10 w-10 items-center justify-center text-muted-foreground"
            >
              ...
            </span>
          );
        }

        const isActive = page === currentPage;

        return (
          <Link
            key={page}
            href={buildUrl(page)}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-lg border font-medium transition-colors",
              isActive
                ? "border-dodo-yellow bg-dodo-yellow text-black"
                : "border-border hover:bg-card hover:border-dodo-yellow/50"
            )}
            aria-current={isActive ? "page" : undefined}
          >
            {page}
          </Link>
        );
      })}

      {/* Next Button */}
      <Link
        href={buildUrl(currentPage + 1)}
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-lg border border-border transition-colors",
          currentPage === totalPages
            ? "pointer-events-none opacity-50"
            : "hover:bg-dodo-yellow hover:text-black hover:border-dodo-yellow"
        )}
        aria-disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Page suivante</span>
      </Link>
    </nav>
  );
}
