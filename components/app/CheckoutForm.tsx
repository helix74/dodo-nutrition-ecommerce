"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { GouvernoratSelect } from "@/components/app/GouvernoratSelect";
import { Loader2, MapPin, Phone, Mail, User, FileText } from "lucide-react";
import { DEFAULT_GOUVERNORAT, type Gouvernorat } from "@/lib/constants/gouvernorats";

export interface CheckoutFormData {
  name: string;
  phone: string;
  email: string;
  line1: string;
  city: string;
  gouvernorat: Gouvernorat;
  postcode: string;
  notes: string;
}

interface CheckoutFormProps {
  onSubmit: (data: CheckoutFormData) => Promise<void>;
  isLoading?: boolean;
  disabled?: boolean;
}

export function CheckoutForm({ onSubmit, isLoading = false, disabled = false }: CheckoutFormProps) {
  const { user, isLoaded } = useUser();
  
  // Pre-fill with user data if authenticated
  const [formData, setFormData] = useState<CheckoutFormData>({
    name: user?.fullName ?? "",
    phone: "",
    email: user?.primaryEmailAddress?.emailAddress ?? "",
    line1: "",
    city: "",
    gouvernorat: DEFAULT_GOUVERNORAT,
    postcode: "",
    notes: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutFormData, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CheckoutFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Le nom est requis";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Le téléphone est requis";
    } else if (!/^(\+216)?[0-9]{8}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Format invalide (ex: +216 XX XXX XXX)";
    }

    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email invalide";
    }

    if (!formData.line1.trim()) {
      newErrors.line1 = "L'adresse est requise";
    }

    if (!formData.city.trim()) {
      newErrors.city = "La ville est requise";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    await onSubmit(formData);
  };

  const handleChange = (field: keyof CheckoutFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const isAuthenticated = isLoaded && !!user;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Info */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <User className="h-5 w-5 text-dodo-yellow" />
          Informations personnelles
        </h3>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Nom complet *</Label>
            <Input
              id="name"
              placeholder="Mohamed Ben Ali"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              disabled={disabled || isLoading}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-1">
              <Phone className="h-3 w-3" />
              Téléphone *
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+216 XX XXX XXX"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              disabled={disabled || isLoading}
              className={errors.phone ? "border-red-500" : ""}
            />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone}</p>
            )}
          </div>
        </div>

        {/* Email - Only show for guests */}
        {!isAuthenticated && (
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-1">
              <Mail className="h-3 w-3" />
              Email *
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="exemple@email.com"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              disabled={disabled || isLoading}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>
        )}
      </div>

      {/* Shipping Address */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <MapPin className="h-5 w-5 text-dodo-yellow" />
          Adresse de livraison
        </h3>

        {/* Address Line */}
        <div className="space-y-2">
          <Label htmlFor="line1">Adresse *</Label>
          <Input
            id="line1"
            placeholder="Rue, numéro, immeuble..."
            value={formData.line1}
            onChange={(e) => handleChange("line1", e.target.value)}
            disabled={disabled || isLoading}
            className={errors.line1 ? "border-red-500" : ""}
          />
          {errors.line1 && (
            <p className="text-sm text-red-500">{errors.line1}</p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* City */}
          <div className="space-y-2">
            <Label htmlFor="city">Ville *</Label>
            <Input
              id="city"
              placeholder="Tunis, Sfax, Sousse..."
              value={formData.city}
              onChange={(e) => handleChange("city", e.target.value)}
              disabled={disabled || isLoading}
              className={errors.city ? "border-red-500" : ""}
            />
            {errors.city && (
              <p className="text-sm text-red-500">{errors.city}</p>
            )}
          </div>

          {/* Gouvernorat */}
          <div className="space-y-2">
            <Label>Gouvernorat *</Label>
            <GouvernoratSelect
              value={formData.gouvernorat}
              onValueChange={(value) => handleChange("gouvernorat", value)}
              disabled={disabled || isLoading}
            />
          </div>
        </div>

        {/* Postal Code (Optional) */}
        <div className="space-y-2">
          <Label htmlFor="postcode">Code postal (optionnel)</Label>
          <Input
            id="postcode"
            placeholder="1000"
            value={formData.postcode}
            onChange={(e) => handleChange("postcode", e.target.value)}
            disabled={disabled || isLoading}
            className="max-w-[200px]"
          />
        </div>
      </div>

      {/* Delivery Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes" className="flex items-center gap-1">
          <FileText className="h-3 w-3" />
          Notes de livraison (optionnel)
        </Label>
        <Textarea
          id="notes"
          placeholder="Instructions spéciales pour le livreur..."
          value={formData.notes}
          onChange={(e) => handleChange("notes", e.target.value)}
          disabled={disabled || isLoading}
          rows={3}
        />
      </div>

      {/* Payment Info */}
      <div className="rounded-lg border border-dodo-yellow/30 bg-dodo-yellow/5 p-4">
        <div className="flex items-center gap-2 text-dodo-yellow">
          <span className="text-2xl">💳</span>
          <div>
            <p className="font-semibold">Paiement à la livraison</p>
            <p className="text-sm text-muted-foreground">
              Vous payez en espèces à la réception de votre commande
            </p>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        size="lg"
        className="w-full bg-dodo-yellow hover:bg-dodo-yellow-hover text-black font-semibold text-lg py-6"
        disabled={disabled || isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Traitement en cours...
          </>
        ) : (
          "✅ Confirmer la commande"
        )}
      </Button>
    </form>
  );
}
