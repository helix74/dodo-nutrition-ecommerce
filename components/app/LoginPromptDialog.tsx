"use client";

import { useState } from "react";
import { SignInButton } from "@clerk/nextjs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, ShoppingBag, MapPin, Gift } from "lucide-react";

interface LoginPromptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContinueAsGuest: () => void;
}

export function LoginPromptDialog({
  open,
  onOpenChange,
  onContinueAsGuest,
}: LoginPromptDialogProps) {
  const handleContinueAsGuest = () => {
    onOpenChange(false);
    onContinueAsGuest();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="h-6 w-6 text-dodo-yellow" />
            Checkout plus rapide?
          </DialogTitle>
          <DialogDescription className="text-base">
            Connectez-vous pour profiter d'une meilleure expérience
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Benefits */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <div className="rounded-full bg-dodo-yellow/10 p-2">
                <MapPin className="h-4 w-4 text-dodo-yellow" />
              </div>
              <span>Sauvegarder votre adresse</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="rounded-full bg-dodo-yellow/10 p-2">
                <ShoppingBag className="h-4 w-4 text-dodo-yellow" />
              </div>
              <span>Suivre vos commandes</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="rounded-full bg-dodo-yellow/10 p-2">
                <Gift className="h-4 w-4 text-dodo-yellow" />
              </div>
              <span>Gagner des points fidélité</span>
            </div>
          </div>

          {/* Login Buttons */}
          <div className="space-y-3 pt-2">
            <SignInButton mode="modal">
              <Button
                className="w-full bg-dodo-yellow hover:bg-dodo-yellow-hover text-black font-semibold"
                size="lg"
              >
                Se connecter
              </Button>
            </SignInButton>

            <Button
              variant="outline"
              className="w-full hover:text-foreground"
              size="lg"
              onClick={handleContinueAsGuest}
            >
              Continuer sans compte
            </Button>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            Connexion rapide avec Google, Facebook ou email
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
