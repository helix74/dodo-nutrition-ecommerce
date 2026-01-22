"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { submitReview } from "@/lib/actions/reviews";

interface ReviewFormProps {
  defaultCategoryId?: string;
  defaultCategoryName?: string;
  onSuccess?: () => void;
}

function StarRatingInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (rating: number) => void;
}) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className="text-3xl transition-transform hover:scale-110"
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(star)}
        >
          <span
            className={
              star <= (hover || value)
                ? "text-yellow-400"
                : "text-zinc-600"
            }
          >
            ★
          </span>
        </button>
      ))}
    </div>
  );
}

export function ReviewForm({
  defaultCategoryId,
  defaultCategoryName,
  onSuccess,
}: ReviewFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    rating: 0,
    authorName: "",
    title: "",
    content: "",
    reviewType: defaultCategoryId ? "category" : "general",
    categoryId: defaultCategoryId || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.rating === 0 || !formData.authorName.trim()) return;

    setIsSubmitting(true);
    try {
      await submitReview({
        authorName: formData.authorName,
        rating: formData.rating,
        title: formData.title || undefined,
        content: formData.content || undefined,
        reviewType: formData.reviewType as "general" | "category",
        categoryId: formData.reviewType === "category" ? formData.categoryId : undefined,
      });
      setSubmitted(true);
      setFormData({
        rating: 0,
        authorName: "",
        title: "",
        content: "",
        reviewType: "general",
        categoryId: "",
      });
      
      // Delay to show success message before closing
      setTimeout(() => {
        onSuccess?.();
      }, 1500);
    } catch (error) {
      console.error("Failed to submit review:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="py-8 text-center">
        <div className="mb-4 text-5xl">✅</div>
        <h3 className="mb-2 text-lg font-semibold text-foreground">
          Merci pour votre avis !
        </h3>
        <p className="text-sm text-muted-foreground">
          Votre avis sera publié après modération.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Rating */}
      <div>
        <Label className="text-foreground">Votre note *</Label>
        <div className="mt-2">
          <StarRatingInput
            value={formData.rating}
            onChange={(rating) => setFormData((d) => ({ ...d, rating }))}
          />
        </div>
      </div>

      {/* Name */}
      <div>
        <Label htmlFor="authorName" className="text-foreground mb-2 block">
          Votre nom *
        </Label>
        <Input
          id="authorName"
          value={formData.authorName}
          onChange={(e) =>
            setFormData((d) => ({ ...d, authorName: e.target.value }))
          }
          placeholder="Ahmed"
          required
          className="bg-background border-input text-foreground"
        />
      </div>

      {/* Review Type (only if no default category) */}
      {!defaultCategoryId && (
        <div>
          <Label className="text-foreground mb-2 block">Type d&apos;avis</Label>
          <Select
            value={formData.reviewType}
            onValueChange={(value) => setFormData((d) => ({ ...d, reviewType: value }))}
          >
            <SelectTrigger className="bg-background border-input">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">🌐 Expérience générale</SelectItem>
              <SelectItem value="category">📦 Catégorie de produits</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Category info if pre-selected */}
      {defaultCategoryName && (
        <div className="rounded-lg bg-secondary/50 p-3">
          <p className="text-sm text-muted-foreground">
            Catégorie: <span className="font-medium text-foreground">{defaultCategoryName}</span>
          </p>
        </div>
      )}

      {/* Title */}
      <div>
        <Label htmlFor="title" className="text-foreground mb-2 block">
          Titre (optionnel)
        </Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData((d) => ({ ...d, title: e.target.value }))}
          placeholder="Excellent produit !"
          className="bg-background border-input text-foreground"
        />
      </div>

      {/* Content */}
      <div>
        <Label htmlFor="content" className="text-foreground mb-2 block">
          Votre commentaire
        </Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData((d) => ({ ...d, content: e.target.value }))}
          placeholder="Partagez votre expérience..."
          rows={4}
          className="bg-background border-input text-foreground"
        />
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={isSubmitting || formData.rating === 0 || !formData.authorName}
        className="w-full bg-dodo-yellow text-black hover:bg-dodo-yellow-hover"
      >
        {isSubmitting ? "Envoi..." : "Envoyer mon avis"}
      </Button>
    </form>
  );
}
