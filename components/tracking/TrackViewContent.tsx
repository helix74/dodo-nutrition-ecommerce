"use client";

import { useEffect } from "react";
import { trackViewContent } from "@/lib/tracking/events";

interface TrackViewContentProps {
  product: {
    id: string;
    name: string;
    category: string;
    price: number;
  };
}

export function TrackViewContent({ product }: TrackViewContentProps) {
  useEffect(() => {
    trackViewContent(product);
  }, [product]);

  return null;
}
