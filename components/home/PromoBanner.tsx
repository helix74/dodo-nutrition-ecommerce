"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Flame, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// Set promo end date (example: 7 days from now)
const PROMO_END_DATE = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(): TimeLeft {
  const difference = PROMO_END_DATE.getTime() - new Date().getTime();

  if (difference > 0) {
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  return { days: 0, hours: 0, minutes: 0, seconds: 0 };
}

export function PromoBanner() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!mounted) {
    return null; // Avoid hydration mismatch
  }

  const isActive = timeLeft.days > 0 || timeLeft.hours > 0 || timeLeft.minutes > 0 || timeLeft.seconds > 0;

  if (!isActive) {
    return null;
  }

  return (
    <section className="py-12 bg-gradient-to-br from-dodo-red/10 via-background to-dodo-yellow/10 border-y border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-dodo-red/20 bg-gradient-to-r from-dodo-red/5 via-background to-dodo-yellow/5 p-8 sm:p-12">
          {/* Decorative flame icons */}
          <div className="absolute top-4 right-4 opacity-10">
            <Flame className="h-32 w-32 text-dodo-red" />
          </div>
          
          <div className="relative z-10 text-center">
            {/* Badge */}
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-dodo-red px-4 py-1.5 text-sm font-bold text-white">
              <Flame className="h-4 w-4" />
              <span>OFFRE LIMITÉE</span>
            </div>

            {/* Title */}
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl md:text-5xl">
              Jusqu&apos;à <span className="text-dodo-yellow">-30%</span> sur une sélection
            </h2>
            <p className="mt-3 text-lg text-muted-foreground">
              Profitez de réductions exceptionnelles sur vos suppléments favoris
            </p>

            {/* Countdown Timer */}
            <div className="mt-8 flex items-center justify-center gap-3 sm:gap-4">
              {[
                { value: timeLeft.days, label: "Jours" },
                { value: timeLeft.hours, label: "Heures" },
                { value: timeLeft.minutes, label: "Min" },
                { value: timeLeft.seconds, label: "Sec" },
              ].map((unit, index) => (
                <div key={unit.label}>
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex h-16 w-16 items-center justify-center rounded-lg border-2 border-dodo-yellow bg-card/50 backdrop-blur-sm sm:h-20 sm:w-20">
                      <span className="text-2xl font-bold text-dodo-yellow sm:text-3xl">
                        {String(unit.value).padStart(2, "0")}
                      </span>
                    </div>
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {unit.label}
                    </span>
                  </div>
                  {index < 3 && (
                    <span className="mx-2 text-2xl font-bold text-muted-foreground">:</span>
                  )}
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-8">
              <Button
                asChild
                size="lg"
                className="bg-dodo-yellow text-black font-bold hover:bg-dodo-yellow/90 shadow-lg shadow-dodo-yellow/30 px-8"
              >
                <Link href="/promotions">
                  Voir les Promotions
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
