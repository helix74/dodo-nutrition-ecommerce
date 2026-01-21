/**
 * List of 24 Tunisian Gouvernorats (administrative divisions)
 * Ordered by population/importance
 */
export const GOUVERNORATS = [
  "Tunis",
  "Ariana",
  "Ben Arous",
  "Manouba",
  "Nabeul",
  "Zaghouan",
  "Bizerte",
  "Béja",
  "Jendouba",
  "Le Kef",
  "Siliana",
  "Sousse",
  "Monastir",
  "Mahdia",
  "Sfax",
  "Kairouan",
  "Kasserine",
  "Sidi Bouzid",
  "Gabès",
  "Médenine",
  "Tataouine",
  "Gafsa",
  "Tozeur",
  "Kébili",
] as const;

export type Gouvernorat = (typeof GOUVERNORATS)[number];

/**
 * Default gouvernorat for checkout
 */
export const DEFAULT_GOUVERNORAT: Gouvernorat = "Tunis";
