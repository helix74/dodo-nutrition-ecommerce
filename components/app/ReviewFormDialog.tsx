"use client";

import { useState, type ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ReviewForm } from "./ReviewForm";

interface ReviewFormDialogProps {
  trigger: ReactNode;
  defaultCategoryId?: string;
  defaultCategoryName?: string;
}

export function ReviewFormDialog({
  trigger,
  defaultCategoryId,
  defaultCategoryName,
}: ReviewFormDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            Partagez votre expérience
          </DialogTitle>
        </DialogHeader>
        <ReviewForm
          defaultCategoryId={defaultCategoryId}
          defaultCategoryName={defaultCategoryName}
          onSuccess={() => setIsOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
