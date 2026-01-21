// ============================================
// Product Attribute Constants - Dodo Nutrition
// Shared between frontend filters and Sanity schema
// ============================================

// ============================================
// Nutrition Product Attributes
// ============================================

export const UNITS = [
  { value: "gramme", label: "Gramme (g)" },
  { value: "kilogramme", label: "Kilogramme (kg)" },
  { value: "millilitre", label: "Millilitre (ml)" },
  { value: "gélule", label: "Gélule" },
  { value: "capsule", label: "Capsule" },
  { value: "comprimé", label: "Comprimé" },
] as const;

export const CERTIFICATIONS = [
  { value: "gmp", label: "GMP Certified" },
  { value: "iso", label: "ISO Certified" },
  { value: "halal", label: "Halal" },
  { value: "vegan", label: "Vegan" },
  { value: "organic", label: "Organic" },
  { value: "lab-tested", label: "Lab Tested" },
] as const;

// Nutrition Categories
export const NUTRITION_CATEGORIES = [
  { value: "proteines", label: "Protéines" },
  { value: "creatine", label: "Créatine" },
  { value: "pre-workout", label: "Pre-Workout" },
  { value: "vitamines", label: "Vitamines" },
  { value: "mineraux", label: "Minéraux" },
  { value: "bruleurs-de-graisse", label: "Brûleurs de Graisse" },
  { value: "boosters-hormonaux", label: "Boosters Hormonaux" },
  { value: "supplements", label: "Suppléments" },
] as const;

export const SORT_OPTIONS = [
  { value: "name", label: "Nom (A-Z)" },
  { value: "price_asc", label: "Prix : Croissant" },
  { value: "price_desc", label: "Prix : Décroissant" },
  { value: "relevance", label: "Pertinence" },
] as const;

// Type exports
export type UnitValue = (typeof UNITS)[number]["value"];
export type CertificationValue = (typeof CERTIFICATIONS)[number]["value"];
export type SortValue = (typeof SORT_OPTIONS)[number]["value"];

// ============================================
// Sanity Schema Format Exports
// Format compatible with Sanity's options.list
// ============================================

/** Units formatted for Sanity schema options.list */
export const UNITS_SANITY_LIST = UNITS.map(({ value, label }) => ({
  title: label,
  value,
}));

/** Certifications formatted for Sanity schema options.list */
export const CERTIFICATIONS_SANITY_LIST = CERTIFICATIONS.map(
  ({ value, label }) => ({
    title: label,
    value,
  })
);

/** Unit values array for zod enums or validation */
export const UNIT_VALUES = UNITS.map((u) => u.value) as [
  UnitValue,
  ...UnitValue[]
];

/** Certification values array for zod enums or validation */
export const CERTIFICATION_VALUES = CERTIFICATIONS.map((c) => c.value) as [
  CertificationValue,
  ...CertificationValue[]
];
