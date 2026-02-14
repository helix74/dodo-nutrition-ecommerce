"use client";

import { useState, useRef, useTransition } from "react";
import Image from "next/image";
import {
  Upload,
  X,
  Loader2,
  ImageIcon,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { updateProductImages } from "@/lib/actions/admin-mutations";

interface SanityImageAsset {
  _type: "image";
  _key: string;
  asset: {
    _type: "reference";
    _ref: string;
  };
}

interface ImageWithUrl {
  _key: string;
  _type: string;
  asset: {
    _ref: string;
    url?: string;
  } | null;
}

interface ImageUploaderProps {
  productId: string;
  initialImages: ImageWithUrl[];
}

export function ImageUploader({ productId, initialImages }: ImageUploaderProps) {
  const [images, setImages] = useState<ImageWithUrl[]>(initialImages || []);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(`Téléchargement de ${files.length} image(s)...`);

    try {
      // Upload images via API route
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }
      formData.append("productId", productId);

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const { images: newImageRefs } = await response.json();

      const newImages: SanityImageAsset[] = newImageRefs.map((ref: string) => ({
        _type: "image",
        _key: crypto.randomUUID(),
        asset: { _type: "reference", _ref: ref },
      }));

      const updatedImages = [...images, ...newImages];
      setImages(updatedImages);

      startTransition(async () => {
        await updateProductImages(
          productId,
          updatedImages.map((img) => ({
            _key: img._key,
            _type: img._type || "image",
            asset: { _ref: img.asset?._ref || "" },
          })),
        );
      });

      setUploadProgress(null);
    } catch (error) {
      console.error("Upload failed:", error);
      setUploadProgress("Échec du téléchargement. Veuillez réessayer.");
      setTimeout(() => setUploadProgress(null), 3000);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveImage = (keyToRemove: string) => {
    const updatedImages = images.filter((img) => img._key !== keyToRemove);
    setImages(updatedImages);

    startTransition(async () => {
      await updateProductImages(
        productId,
        updatedImages.map((img) => ({
          _key: img._key,
          _type: img._type || "image",
          asset: { _ref: img.asset?._ref || "" },
        })),
      );
    });
  };

  const handleMoveImage = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= images.length) return;

    const updatedImages = [...images];
    const [movedImage] = updatedImages.splice(fromIndex, 1);
    updatedImages.splice(toIndex, 0, movedImage);
    setImages(updatedImages);

    startTransition(async () => {
      await updateProductImages(
        productId,
        updatedImages.map((img) => ({
          _key: img._key,
          _type: img._type || "image",
          asset: { _ref: img.asset?._ref || "" },
        })),
      );
    });
  };

  return (
    <div className="space-y-4">
      {/* Upload Button */}
      <div className="flex items-center gap-3">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="w-full"
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {uploadProgress}
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Télécharger des images
            </>
          )}
        </Button>
      </div>

      {/* Image Grid */}
      {images.length > 0 ? (
        <div className="grid grid-cols-2 gap-3">
          {images.map((image, index) => (
            <ImageThumbnail
              key={image._key}
              image={image}
              index={index}
              isFirst={index === 0}
              onRemove={() => handleRemoveImage(image._key)}
              onMoveUp={() => handleMoveImage(index, index - 1)}
              onMoveDown={() => handleMoveImage(index, index + 1)}
              canMoveUp={index > 0}
              canMoveDown={index < images.length - 1}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border py-8">
          <ImageIcon className="mb-2 h-10 w-10 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Aucune image téléchargée
          </p>
          <p className="text-xs text-muted-foreground">
            Cliquez pour ajouter des images
          </p>
        </div>
      )}

      {images.length > 0 && (
        <p className="text-xs text-muted-foreground">
          La première image est l&apos;image principale. Utilisez les flèches pour réorganiser.
        </p>
      )}
    </div>
  );
}

interface ImageThumbnailProps {
  image: ImageWithUrl;
  index: number;
  isFirst: boolean;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

function ImageThumbnail({
  image,
  isFirst,
  onRemove,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
}: ImageThumbnailProps) {
  const assetRef = image.asset?._ref;
  let imageUrl: string | null = null;

  if (assetRef) {
    const match = assetRef.match(/^image-([a-zA-Z0-9]+)-(\d+x\d+)-(\w+)$/);
    if (match) {
      const [, id, dimensions, format] = match;
      imageUrl = `https://cdn.sanity.io/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}/${id}-${dimensions}.${format}`;
    }
  }

  return (
    <div
      className={cn(
        "group relative aspect-square overflow-hidden rounded-lg bg-secondary",
        isFirst &&
          "ring-2 ring-dodo-yellow ring-offset-2 ring-offset-background",
      )}
    >
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt="Product image"
          fill
          className="object-cover"
          sizes="150px"
        />
      ) : (
        <div className="flex h-full items-center justify-center">
          <ImageIcon className="h-8 w-8 text-muted-foreground" />
        </div>
      )}

      {isFirst && (
        <div className="absolute left-2 top-2 rounded bg-dodo-yellow px-1.5 py-0.5 text-xs font-medium text-black">
          Principale
        </div>
      )}

      <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
        <div className="flex flex-col gap-1">
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="h-7 w-7"
            onClick={onMoveUp}
            disabled={!canMoveUp}
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="h-7 w-7"
            onClick={onMoveDown}
            disabled={!canMoveDown}
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>

        <Button
          type="button"
          variant="destructive"
          size="icon"
          className="h-7 w-7"
          onClick={onRemove}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
