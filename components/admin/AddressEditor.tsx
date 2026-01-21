"use client";

import { Suspense } from "react";
import {
  useDocument,
  useEditDocument,
  type DocumentHandle,
} from "@sanity/sdk-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

interface AddressEditorProps extends DocumentHandle {}

function AddressField({
  handle,
  field,
  label,
  placeholder,
}: {
  handle: DocumentHandle;
  field: string;
  label: string;
  placeholder?: string;
}) {
  const path = `address.${field}`;
  const { data: value } = useDocument({ ...handle, path });
  const editField = useEditDocument({ ...handle, path });

  return (
    <div className="space-y-1.5">
      <Label htmlFor={field} className="text-xs text-muted-foreground">
        {label}
      </Label>
      <Input
        id={field}
        value={(value as string) ?? ""}
        onChange={(e) => editField(e.target.value)}
        placeholder={placeholder}
        className="h-9"
      />
    </div>
  );
}

function AddressEditorContent(handle: AddressEditorProps) {
  return (
    <div className="space-y-3">
      <Suspense fallback={<Skeleton className="h-16" />}>
        <AddressField handle={handle} field="name" label="Nom complet" placeholder="John Doe" />
      </Suspense>
      <Suspense fallback={<Skeleton className="h-16" />}>
        <AddressField handle={handle} field="line1" label="Adresse ligne 1" placeholder="123 Rue Principale" />
      </Suspense>
      <Suspense fallback={<Skeleton className="h-16" />}>
        <AddressField handle={handle} field="line2" label="Adresse ligne 2" placeholder="Appt 4B (optionnel)" />
      </Suspense>
      <div className="grid grid-cols-2 gap-3">
        <Suspense fallback={<Skeleton className="h-16" />}>
          <AddressField handle={handle} field="city" label="Ville" placeholder="Tunis" />
        </Suspense>
        <Suspense fallback={<Skeleton className="h-16" />}>
          <AddressField handle={handle} field="postcode" label="Code postal" placeholder="1000" />
        </Suspense>
      </div>
      <Suspense fallback={<Skeleton className="h-16" />}>
        <AddressField handle={handle} field="country" label="Pays" placeholder="Tunisie" />
      </Suspense>
    </div>
  );
}

function AddressEditorSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-16" />
      <Skeleton className="h-16" />
      <Skeleton className="h-16" />
      <div className="grid grid-cols-2 gap-3">
        <Skeleton className="h-16" />
        <Skeleton className="h-16" />
      </div>
      <Skeleton className="h-16" />
    </div>
  );
}

export function AddressEditor(props: AddressEditorProps) {
  return (
    <Suspense fallback={<AddressEditorSkeleton />}>
      <AddressEditorContent {...props} />
    </Suspense>
  );
}

