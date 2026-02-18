"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PublishButton,
  RevertButton,
  ImageUploader,
  DeleteButton,
} from "@/components/admin";
import { updateProductField } from "@/lib/actions/admin-mutations";

const MATERIALS = [
  { value: "wood", label: "Bois" },
  { value: "metal", label: "Métal" },
  { value: "fabric", label: "Tissu" },
  { value: "leather", label: "Cuir" },
  { value: "glass", label: "Verre" },
];

const COLORS = [
  { value: "black", label: "Noir" },
  { value: "white", label: "Blanc" },
  { value: "oak", label: "Chêne" },
  { value: "walnut", label: "Noyer" },
  { value: "grey", label: "Gris" },
  { value: "natural", label: "Naturel" },
];

interface ProductDetailClientProps {
  documentId: string;
  product: {
    _id: string;
    name: string;
    slug: { current: string } | null;
    description: string | null;
    price: number;
    stock: number;
    material: string | null;
    color: string | null;
    dimensions: string | null;
    featured: boolean;
    assemblyRequired: boolean;
    isDraft: boolean;
    hasReferences: boolean;
    referenceCount: number;
    images: Array<{
      _key: string;
      _type: string;
      asset: { _ref: string; url?: string } | null;
    }>;
  };
}

export function ProductDetailClient({ documentId, product }: ProductDetailClientProps) {
  const [name, setName] = useState(product.name || "");
  const [slug, setSlug] = useState(product.slug?.current || "");
  const [description, setDescription] = useState(product.description || "");
  const [price, setPrice] = useState(product.price || 0);
  const [stock, setStock] = useState(product.stock || 0);
  const [material, setMaterial] = useState(product.material || "");
  const [color, setColor] = useState(product.color || "");
  const [dimensions, setDimensions] = useState(product.dimensions || "");
  const [featured, setFeatured] = useState(product.featured || false);
  const [assemblyRequired, setAssemblyRequired] = useState(product.assemblyRequired || false);
  const [isPending, startTransition] = useTransition();

  function saveField(field: string, value: unknown) {
    startTransition(async () => {
      await updateProductField(product._id, field, value);
    });
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground sm:text-2xl">
            {name || "Nouveau produit"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Modifier les détails du produit
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DeleteButton
            documentId={documentId}
            documentType="product"
            hasReferences={product.hasReferences}
            referenceCount={product.referenceCount}
          />
          <RevertButton documentId={documentId} isDraft={product.isDraft} />
          <PublishButton documentId={documentId} isDraft={product.isDraft} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
        {/* Main Form */}
        <div className="space-y-6 lg:col-span-2">
          {/* Basic Info */}
          <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
            <h2 className="mb-4 font-semibold text-foreground">
              Informations de base
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => saveField("name", name)}
                  placeholder="Nom du produit"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  onBlur={() => saveField("slug", { _type: "slug", current: slug })}
                  placeholder="product-slug"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onBlur={() => saveField("description", description)}
                  placeholder="Description du produit..."
                  rows={4}
                />
              </div>
            </div>
          </div>

          {/* Pricing & Inventory */}
          <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
            <h2 className="mb-4 font-semibold text-foreground">
              Prix et stock
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="price">Prix (TND)</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={price ?? ""}
                  onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                  onBlur={() => saveField("price", price)}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stock</Label>
                <Input
                  type="number"
                  min="0"
                  value={stock ?? 0}
                  onChange={(e) => setStock(parseInt(e.target.value) || 0)}
                  onBlur={() => saveField("stock", stock)}
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Attributes */}
          <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
            <h2 className="mb-4 font-semibold text-foreground">
              Attributs
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Matériau</Label>
                <Select
                  value={material}
                  onValueChange={(value) => {
                    setMaterial(value);
                    saveField("material", value);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le matériau" />
                  </SelectTrigger>
                  <SelectContent>
                    {MATERIALS.map((m) => (
                      <SelectItem key={m.value} value={m.value}>
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Couleur</Label>
                <Select
                  value={color}
                  onValueChange={(value) => {
                    setColor(value);
                    saveField("color", value);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner la couleur" />
                  </SelectTrigger>
                  <SelectContent>
                    {COLORS.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Dimensions</Label>
                <Input
                  value={dimensions}
                  onChange={(e) => setDimensions(e.target.value)}
                  onBlur={() => saveField("dimensions", dimensions)}
                  placeholder='ex. "120cm x 80cm x 75cm"'
                />
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
            <h2 className="mb-4 font-semibold text-foreground">
              Options
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">
                    Produit vedette
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Afficher sur la page d&apos;accueil et les promotions
                  </p>
                </div>
                <Switch
                  checked={featured}
                  onCheckedChange={(checked) => {
                    setFeatured(checked);
                    saveField("featured", checked);
                  }}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">
                    Assemblage requis
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Le client devra assembler
                  </p>
                </div>
                <Switch
                  checked={assemblyRequired}
                  onCheckedChange={(checked) => {
                    setAssemblyRequired(checked);
                    saveField("assemblyRequired", checked);
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Image Upload */}
          <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
            <h2 className="mb-4 font-semibold text-foreground">
              Images du produit
            </h2>
            <ImageUploader
              productId={product._id}
              initialImages={product.images}
            />
            {slug && (
              <div className="mt-4">
                <Link
                  href={`/products/${slug}`}
                  target="_blank"
                  className="flex items-center justify-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                >
                  Voir sur la boutique
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </div>
            )}
          </div>

          {/* Studio Link */}
          <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
            <h2 className="font-semibold text-foreground">
              Édition avancée
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Définir la catégorie et d&apos;autres options dans Sanity Studio.
            </p>
            <Link
              href={`/studio/structure/product;${documentId}`}
              target="_blank"
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-foreground hover:text-muted-foreground"
            >
              Ouvrir dans Studio
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
