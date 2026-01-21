"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, CheckCircle } from "lucide-react";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // TODO: Integrate with email service
      setSubmitted(true);
    }
  };

  return (
    <section className="py-16 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-border bg-card px-6 py-12 text-center sm:px-12">
          {/* Icon */}
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-dodo-yellow/10">
            <Mail className="h-7 w-7 text-dodo-yellow" />
          </div>

          {/* Content */}
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
            Restez Informé
          </h2>
          <p className="mt-3 text-muted-foreground max-w-md mx-auto">
            Inscrivez-vous à notre newsletter et recevez{" "}
            <span className="font-semibold text-dodo-yellow">10% de réduction</span>{" "}
            sur votre première commande.
          </p>

          {/* Form */}
          {!submitted ? (
            <form
              onSubmit={handleSubmit}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center"
            >
              <Input
                type="email"
                placeholder="Votre adresse email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 bg-background border-border text-foreground placeholder:text-muted-foreground sm:w-80"
              />
              <Button
                type="submit"
                size="lg"
                className="h-12 bg-dodo-yellow text-black font-semibold hover:bg-dodo-yellow/90 px-8"
              >
                S&apos;inscrire
              </Button>
            </form>
          ) : (
            <div className="mt-8 flex items-center justify-center gap-2 text-green-500">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Merci pour votre inscription !</span>
            </div>
          )}

          {/* Privacy note */}
          <p className="mt-4 text-xs text-muted-foreground">
            En vous inscrivant, vous acceptez de recevoir nos emails. 
            Désabonnement possible à tout moment.
          </p>
        </div>
      </div>
    </section>
  );
}
