import Link from "next/link";
import { GOALS } from "@/lib/constants/goals";

export function GoalNavigator() {
  return (
    <section className="py-16 px-4 bg-background">
      <div className="mx-auto max-w-7xl">
        {/* Section Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
          علاش جاي؟
        </h2>

        {/* Goals Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {GOALS.map((goal) => (
            <Link
              key={goal.id}
              href={goal.href}
              className="group relative overflow-hidden rounded-xl bg-card border border-border p-6 transition-all hover:scale-105 hover:shadow-xl hover:border-dodo-yellow/50"
            >
              {/* Icon */}
              <div className="text-5xl mb-4 transition-transform group-hover:scale-110">
                {goal.icon}
              </div>

              {/* Title (Darija Arabic) */}
              <h3 className="text-xl font-bold mb-2 text-foreground text-right">
                {goal.title}
              </h3>

              {/* Subtitle (French) */}
              <p className="text-sm text-muted-foreground">
                {goal.subtitle}
              </p>

              {/* Hover effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-dodo-yellow/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
