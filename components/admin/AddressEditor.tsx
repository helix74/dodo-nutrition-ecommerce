"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateOrderAddress } from "@/lib/actions/admin-mutations";

interface Address {
  name?: string;
  line1?: string;
  line2?: string;
  city?: string;
  postcode?: string;
  country?: string;
}

interface AddressEditorProps {
  documentId: string;
  initialAddress: Address;
}

export function AddressEditor({ documentId, initialAddress }: AddressEditorProps) {
  const [address, setAddress] = useState<Address>(initialAddress || {});
  const [isPending, startTransition] = useTransition();

  function handleFieldChange(field: keyof Address, value: string) {
    const newAddress = { ...address, [field]: value };
    setAddress(newAddress);
  }

  function handleBlur() {
    startTransition(async () => {
      await updateOrderAddress(documentId, {
        street: `${address.line1 || ""}${address.line2 ? `, ${address.line2}` : ""}`,
        city: address.city,
        postalCode: address.postcode,
        country: address.country,
      });
    });
  }

  const fields = [
    { key: "name" as const, label: "Nom complet", placeholder: "John Doe" },
    { key: "line1" as const, label: "Adresse ligne 1", placeholder: "123 Rue Principale" },
    { key: "line2" as const, label: "Adresse ligne 2", placeholder: "Appt 4B (optionnel)" },
  ];

  return (
    <div className={`space-y-3 ${isPending ? "opacity-50" : ""}`}>
      {fields.map(({ key, label, placeholder }) => (
        <div key={key} className="space-y-1.5">
          <Label htmlFor={key} className="text-xs text-muted-foreground">
            {label}
          </Label>
          <Input
            id={key}
            value={address[key] ?? ""}
            onChange={(e) => handleFieldChange(key, e.target.value)}
            onBlur={handleBlur}
            placeholder={placeholder}
            className="h-9"
          />
        </div>
      ))}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="city" className="text-xs text-muted-foreground">
            Ville
          </Label>
          <Input
            id="city"
            value={address.city ?? ""}
            onChange={(e) => handleFieldChange("city", e.target.value)}
            onBlur={handleBlur}
            placeholder="Tunis"
            className="h-9"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="postcode" className="text-xs text-muted-foreground">
            Code postal
          </Label>
          <Input
            id="postcode"
            value={address.postcode ?? ""}
            onChange={(e) => handleFieldChange("postcode", e.target.value)}
            onBlur={handleBlur}
            placeholder="1000"
            className="h-9"
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="country" className="text-xs text-muted-foreground">
          Pays
        </Label>
        <Input
          id="country"
          value={address.country ?? ""}
          onChange={(e) => handleFieldChange("country", e.target.value)}
          onBlur={handleBlur}
          placeholder="Tunisie"
          className="h-9"
        />
      </div>
    </div>
  );
}
