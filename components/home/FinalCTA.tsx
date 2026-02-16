"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChatActions } from "@/lib/store/chat-store-provider";

export function FinalCTA() {
  const { openChat } = useChatActions();

  return (
    <section className="relative overflow-hidden bg-background py-20 border-t border-border">
      {/* Subtle decorative glow */}
      <div
        className="pointer-events-none absolute -top-24 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-dodo-yellow/3 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
          مازلت حاير؟
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
          منتوجات أصلية، توصيل سريع لكل تونس، و خدمة عملاء في الخدمة متاعك.
          الـ AI متاعنا يعاونك تلقى بالضبط اللي تحتاجو.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            onClick={openChat}
            size="lg"
            className="bg-dodo-yellow text-black font-semibold hover:bg-dodo-yellow-hover shadow-md shadow-dodo-yellow/20"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            إسأل الـ AI
          </Button>

          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-border text-foreground hover:bg-secondary hover:text-foreground"
          >
            <Link href="/shop">
              إكتشف البوتيك
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
