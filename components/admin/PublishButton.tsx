"use client";

import { useState } from "react";
import { Save, Check, Loader2, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { publishDocument, unpublishDocument } from "@/lib/actions/admin-mutations";

interface PublishButtonProps {
  documentId: string;
  isDraft?: boolean;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

export function PublishButton({
  documentId,
  isDraft,
  variant = "default",
  size = "default",
}: PublishButtonProps) {
  const [isPublishing, setIsPublishing] = useState(false);
  const [justPublished, setJustPublished] = useState(false);

  if (!isDraft && !justPublished) return null;

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      await publishDocument(documentId);
      setJustPublished(true);
      setTimeout(() => setJustPublished(false), 2000);
    } catch (error) {
      console.error("Failed to publish:", error);
    } finally {
      setIsPublishing(false);
    }
  };

  if (justPublished) {
    return (
      <Button variant={variant} size={size} disabled className="min-w-[140px]">
        <Check className="mr-2 h-4 w-4 text-green-500" />
        Published!
      </Button>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handlePublish}
      disabled={isPublishing}
      className="min-w-[140px]"
    >
      {isPublishing ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Publishing...
        </>
      ) : (
        <>
          <Save className="mr-2 h-4 w-4" />
          Publish
        </>
      )}
    </Button>
  );
}

interface RevertButtonProps {
  documentId: string;
  isDraft?: boolean;
  size?: "default" | "sm" | "lg" | "icon";
}

export function RevertButton({
  documentId,
  isDraft,
  size = "icon",
}: RevertButtonProps) {
  const [isReverting, setIsReverting] = useState(false);
  const [justReverted, setJustReverted] = useState(false);

  if (!isDraft && !justReverted) return null;

  const handleRevert = async () => {
    setIsReverting(true);
    try {
      await unpublishDocument(documentId);
      setJustReverted(true);
      setTimeout(() => setJustReverted(false), 2000);
    } catch (error) {
      console.error("Failed to revert:", error);
    } finally {
      setIsReverting(false);
    }
  };

  if (justReverted) {
    return (
      <Button variant="outline" size={size} disabled>
        <Check className="h-4 w-4 text-green-500" />
      </Button>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="destructive"
          size={size}
          onClick={handleRevert}
          disabled={isReverting}
        >
          {isReverting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Undo2 className="h-4 w-4" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Discard changes</p>
      </TooltipContent>
    </Tooltip>
  );
}
