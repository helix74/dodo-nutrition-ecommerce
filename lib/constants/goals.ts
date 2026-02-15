export const GOAL_CATEGORIES = {
  muscle: ["proteines", "gainers", "creatine"],
  performance: ["pre-workout", "acides-amines"],
  seche: ["bruleurs", "proteines"],
  wellness: ["vitamines"],
} as const;

export type GoalId = keyof typeof GOAL_CATEGORIES;

export const GOALS = [
  {
    id: "muscle" as const,
    title: "ندبّر و نقوّي",
    subtitle: "Muscle & Force",
    icon: "💪",
    href: "/shop?goal=muscle",
  },
  {
    id: "performance" as const,
    title: "نزيد Performance",
    subtitle: "Performance & Énergie",
    icon: "⚡",
    href: "/shop?goal=performance",
  },
  {
    id: "seche" as const,
    title: "ندبّر و نضعف",
    subtitle: "Sèche & Perte de poids",
    icon: "🔥",
    href: "/shop?goal=seche",
  },
  {
    id: "wellness" as const,
    title: "Santé و Bien-être",
    subtitle: "Vitamines & Santé",
    icon: "🌿",
    href: "/shop?goal=wellness",
  },
] as const;
