"use client";

import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { deleteDocument } from "@/lib/actions/admin-mutations";

interface DeleteButtonProps {
  documentId: string;
  documentType: string;
  hasReferences?: boolean;
  referenceCount?: number;
  redirectTo?: string;
}

export function DeleteButton({
  documentId,
  documentType,
  hasReferences = false,
  referenceCount = 0,
  redirectTo = "/admin/inventory",
}: DeleteButtonProps) {
  const router = useRouter();
  const baseId = documentId.replace("drafts.", "");

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Delete this product permanently? This cannot be undone.",
    );
    if (!confirmed) return;

    try {
      await deleteDocument(documentId);
      router.push(redirectTo);
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  if (hasReferences) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="destructive" size="sm" className="gap-1.5" asChild>
              <Link
                href={`/studio/structure/${documentType};${baseId}`}
                target="_blank"
              >
                <Trash2 className="h-4 w-4" />
                Delete in Studio
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              This product is referenced by {referenceCount} order
              {referenceCount !== 1 ? "s" : ""}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Button
      variant="destructive"
      size="sm"
      className="gap-1.5"
      onClick={handleDelete}
    >
      <Trash2 className="h-4 w-4" />
      Delete
    </Button>
  );
}
