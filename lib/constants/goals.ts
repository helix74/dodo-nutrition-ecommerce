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
    title: "Muscle & Force",
    subtitle: "Protéines, Gainers, Créatine",
    icon: "💪",
    href: "/shop?goal=muscle",
  },
  {
    id: "performance" as const,
    title: "Performance",
    subtitle: "Pre-workout, Acides aminés",
    icon: "⚡",
    href: "/shop?goal=performance",
  },
  {
    id: "seche" as const,
    title: "Sèche",
    subtitle: "Brûleurs, Protéines lean",
    icon: "🔥",
    href: "/shop?goal=seche",
  },
  {
    id: "wellness" as const,
    title: "Bien-être",
    subtitle: "Vitamines & Santé",
    icon: "🌿",
    href: "/shop?goal=wellness",
  },
] as const;
