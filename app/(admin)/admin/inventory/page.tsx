import { Suspense } from "react";
import Link from "next/link";
import { Plus, Package, AlertTriangle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/ui/empty-state";
import {
  ProductRow,
  ProductRowSkeleton,
  ProductTableHeader,
} from "@/components/admin";
import type { ProductRowData } from "@/components/admin/ProductRow";
import { InventoryClient } from "./InventoryClient";
import { writeClient } from "@/sanity/lib/client";

async function getInventoryProducts(): Promise<ProductRowData[]> {
  const products = await writeClient.fetch(
    `*[_type == "product"] | order(stock asc, name asc) {
      _id,
      name,
      "slug": slug.current,
      stock,
      price,
      featured,
      category->{
        title,
        name
      },
      "image": images[0]{
        asset->{
          url
        }
      }
    }`,
    {},
    { cache: "no-store" }
  );

  return products.map((p: any) => ({
    ...p,
    isDraft: p._id?.startsWith("drafts."),
  }));
}

export default async function InventoryPage() {
  const products = await getInventoryProducts();

  return <InventoryClient products={products} />;
}
