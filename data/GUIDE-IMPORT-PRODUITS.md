# Guide d'Import Produits — Dodo Nutrition

> **Ce document est un guide strict** pour un agent AI chargé de convertir les données produits de l'ancien format CSV vers le nouveau format CSV compatible avec le schema Sanity du site Dodo Nutrition.

---

## Mission

Tu reçois un fichier CSV ancien format (`dodo_nutrition_120_produits_COMPLET_sanity.csv`) et tu dois produire un fichier CSV nouveau format conforme aux spécifications ci-dessous. Chaque produit doit être nettoyé, restructuré et catégorisé correctement.

---

## Fichiers de référence

| Fichier | Rôle |
|---------|------|
| `data/dodo_nutrition_120_produits_COMPLET_sanity.csv` | Ancien CSV source (120 produits) |
| `data/template-products.csv` | CSV vide avec les headers corrects |
| `data/example-products.csv` | CSV exemple avec 5 produits correctement remplis |

---

## Mapping Ancien CSV → Nouveau CSV

| # | Ancien CSV (colonne source) | Nouveau CSV (colonne cible) | Type | Required | Transformation |
|---|---------------------------|---------------------------|------|----------|----------------|
| 1 | `nom_produit` | `name` | string | **OUI** | Copier tel quel |
| 2 | `marque` | `brand` | string | **OUI** | Copier tel quel — nom exact de la marque |
| 3 | _(inféré du nom)_ | `category` | string | **OUI** | **ASSIGNER manuellement** selon les règles de catégorisation (voir section dédiée) |
| 4 | `description_longue_seo` | `description` | text | **OUI** | **RÉÉCRIRE** : 2-3 phrases courtes, pas de HTML, pas d'emojis, max 300 caractères |
| 5 | `unite` | `unit` | enum | **OUI** | Mapper : "Gramme"→"gramme", "Kilogramme"→"kilogramme", "Millilitre"→"millilitre", "Gélule"→"gélule", "Capsule"→"capsule", "Comprimé"→"comprimé" |
| 6 | `valeur` | `quantity` | number | **OUI** | Copier le nombre |
| 7 | `servings` | `servings` | number | non | Copier si existant |
| 8 | `saveurs_disponibles` | `flavors` | string[] | non | Reformater : virgules → pipe `\|` comme séparateur |
| 9 | `benefices_cles` | `benefits` | string[] | non | **RÉÉCRIRE** : phrases courtes et claires, séparées par `\|`. Max 5-7 bénéfices. Pas de mots-clés SEO en vrac |
| 10 | `allergenes` | `allergens` | text | non | Nettoyer : garder l'essentiel, supprimer le marketing |
| 11 | `certifications` | `certifications` | string[] | non | **NETTOYER** : garder uniquement les vraies certifications (GMP, Halal, ISO). Séparés par `\|` |
| 12 | `posologie_recommandee` | `dosage` | text | non | Nettoyer : instructions simples et claires |
| 13 | `prix_detail` | `priceRetail` | number | **OUI** | Copier le nombre. Si vide : voir section Prix |
| 14 | `prix_achat` | `pricePurchase` | number | non | Copier si existant |
| 15 | `prix_gros` | `priceWholesale` | number | non | Copier si existant |
| 16 | `prix_barre` | `priceSlashed` | number | non | **SEULEMENT si le produit est en vraie promotion.** Ne PAS inventer de prix barré |
| 17 | _(nouveau)_ | `stock` | number | **OUI** | Mettre `100` par défaut (sera ajusté manuellement) |
| 18 | _(nouveau)_ | `featured` | boolean | non | `true` pour les best-sellers (max 8 produits). `false` pour le reste |
| 19 | `meta_title` | `metaTitle` | string | non | Reformater si > 60 chars. Format : "Nom Produit \| Marque \| Dodo Nutrition Tunisie" |
| 20 | `meta_description` | `metaDescription` | text | non | Reformater si > 160 chars. 1-2 phrases qui donnent envie |

---

## Règles de Catégorisation — STRICTES

Il existe **exactement 10 catégories**. Chaque produit DOIT appartenir à UNE SEULE catégorie. Utilise le **slug** dans le CSV.

| Slug | Titre | Mots-clés pour identification |
|------|-------|-------------------------------|
| `proteines` | Protéines | whey, isolat, isolate, protein, caséine, casein, egg protein |
| `creatine` | Créatine | creatine, créatine, monohydrate, hcl |
| `pre-workout` | Pre-Workout | pre-workout, pre workout, preworkout, booster, behemoth, viking rage, pump |
| `gainers` | Gainers | gainer, mass, serious mass, prise de masse, weight gainer |
| `bruleurs` | Brûleurs de Graisse | burner, fat burner, carnitine, l-carnitine, cla, thermo, brûleur, hydroxycut, lipo |
| `acides-amines` | Acides Aminés | bcaa, eaa, amino, glutamine, leucine, acides aminés |
| `vitamines` | Vitamines & Minéraux | vitamin, vitamine, zinc, magnésium, magnesium, omega, oméga, multivitamin, d3, b12, fer, calcium, minéral |
| `boosters` | Boosters Hormonaux | testo, testosterone, tribulus, maca, ashwagandha, shilajit, fenugrec, ecdysterone, booster hormonal, libido, ZMA |
| `barres-snacks` | Barres & Snacks | barre, bar, snack, cookie, biscuit, brownie, wafer, chips protéinées |
| `accessoires` | Accessoires | shaker, ceinture, belt, gants, gloves, sangle, strap, bouteille, accessoire, serviette, sac |

### Règles de priorité pour la catégorisation

1. Si un produit contient "pre-workout" ou est clairement un booster d'entraînement → `pre-workout`
2. Si un produit contient "gainer" ou "mass" et c'est un supplément calorique → `gainers`
3. Si un produit contient "whey", "isolat", "protein" → `proteines`
4. Si un produit contient "creatine" → `creatine`
5. Si un produit contient "bcaa", "eaa", "amino", "glutamine" → `acides-amines`
6. Si un produit contient "carnitine", "burner", "cla", "fat", "thermo" → `bruleurs`
7. Si un produit contient "vitamin", "zinc", "magnésium", "omega", "d3" → `vitamines`
8. Si un produit contient "testo", "maca", "ashwagandha", "tribulus", "shilajit", "ZMA" → `boosters`
9. Si un produit est alimentaire (barre, cookie, snack) → `barres-snacks`
10. Si un produit est un accessoire (shaker, ceinture, gants) → `accessoires`
11. **EN CAS DE DOUTE** : vérifier le nom complet du produit et sa `description_longue_seo`. Si toujours ambigu, utiliser `vitamines` comme catégorie par défaut.

### INTERDIT

- **NE PAS utiliser** `supplements` comme catégorie — cette catégorie N'EXISTE PAS
- **NE PAS inventer** de nouvelles catégories
- **NE PAS laisser** la catégorie vide

---

## Règles de Réécriture — `description`

L'ancienne colonne `description_longue_seo` contient du HTML massif avec du SEO bourré. La nouvelle colonne `description` doit être :

- **2-3 phrases courtes** (max 300 caractères total)
- **Pas de HTML** (pas de `<p>`, `<strong>`, `<br>`, `<li>`, etc.)
- **Pas d'emojis** (pas de ✅, 🎯, 🏆, 💪, etc.)
- **Pas de marketing excessif** (pas de "ultime", "révolutionnaire", "n°1 mondial")
- **Informatif** : ce que c'est, à quoi ça sert, pour qui
- **En français**

### Exemple — AVANT (ancien):

```
<p><strong>Behemoth Pre-Workout</strong> de <strong>Real Pharm</strong> est le booster pré-entraînement ultime pour décupler votre énergie...</p><h2>🎯 Bénéfices Clés...</h2>
```

### Exemple — APRÈS (nouveau):

```
Pre-workout haute énergie avec caféine 300mg et bêta-alanine. Conçu pour les entraînements intenses avec un focus mental accru et une endurance prolongée.
```

---

## Règles de Réécriture — `benefits`

L'ancien champ contient des mots-clés SEO en vrac. Le nouveau champ doit contenir des **bénéfices lisibles**, séparés par `|`.

### Exemple — AVANT:

```
Énergie explosive immédiate caféine 300mg, Focus mental concentration acuité, Endurance musculaire prolongée fatigue retardée
```

### Exemple — APRÈS:

```
300mg caféine pour énergie explosive|Focus mental et concentration|Endurance prolongée et fatigue retardée|Pompe musculaire avec citrulline|Absorption rapide
```

### Règles:

- **Max 5-7 bénéfices** par produit
- **Phrase courte** par bénéfice (5-10 mots)
- **Pas de mots-clés SEO** en vrac
- Séparés par `|` (pipe)
- Commencer par le bénéfice principal

---

## Règles de Réécriture — `certifications`

Garder UNIQUEMENT les vraies certifications. Supprimer le marketing.

### GARDER:
- GMP, GMP Certified
- Halal
- ISO 9001
- Informed Sport
- NSF Certified
- BSCG (Banned Substances Control Group)

### SUPPRIMER (ce ne sont PAS des certifications):
- "Marque tunisienne locale réputée"
- "Laboratoires fabrication"
- "Réutilisable durable écologique"
- Toute phrase marketing déguisée en certification

---

## Règles pour `priceSlashed` (prix barré)

- `priceSlashed` est l'ancien prix AVANT promotion
- Il doit être **SUPÉRIEUR** à `priceRetail`
- **NE PAS** mettre `priceSlashed` si ce n'est pas une vraie promotion
- Dans l'ancien CSV, `prix_barre` est souvent = `priceRetail * 1.2` (fausse promo générée automatiquement) — **SUPPRIMER** ces faux prix barrés
- Mettre `priceSlashed` **UNIQUEMENT** si le owner confirme que le produit est en promotion

**Règle simple** : si `prix_barre` dans l'ancien CSV = `prix_detail * 1.2` exactement → c'est faux → laisser vide.

---

## Règles pour `featured`

- Max **8 produits** marqués `featured=true`
- Choisir les best-sellers les plus populaires (whey, créatine, pre-workout classiques)
- Le reste = `false`

---

## Règles pour `metaTitle`

- Max **60 caractères**
- Format : `Nom Produit | Marque | Dodo Nutrition Tunisie`
- Si trop long, raccourcir le nom produit

### Exemple:
```
Whey Gold Standard 2.27kg | Optimum Nutrition Tunisie
```

---

## Règles pour `metaDescription`

- Max **160 caractères**
- 1-2 phrases qui donnent envie d'acheter
- Inclure : nom produit, bénéfice principal, "Tunisie" ou "livraison"
- **Pas de** "Commandez maintenant!", "💪", ou marketing agressif

### Exemple:
```
Whey Gold Standard Optimum Nutrition: 24g protéines, 5.5g BCAA. La référence mondiale. Livraison rapide Tunisie.
```

---

## Règles pour `allergens`

- Garder **uniquement** les informations allergènes médicales
- Supprimer : recommandations marketing, phrases "Dodo Nutrition", livraison, etc.
- Format : texte simple, 1-2 phrases max

### Exemple — AVANT:
```
Contient lait, soja. Non recommandé femmes enceintes. CONTIENT: Gélatine bovine Halal. Livraison sécurisée emballage protégé livraison rapide 24-48h Tunis Sfax Sousse.
```

### Exemple — APRÈS:
```
Contient lait et soja. Non recommandé aux femmes enceintes et aux personnes de moins de 18 ans.
```

---

## Règles pour `dosage`

- Instructions simples et pratiques
- 1-2 phrases max
- Supprimer le marketing

### Exemple:
```
Mélanger 1 scoop (30g) dans 200-250ml d'eau ou lait. Après l'entraînement ou entre les repas.
```

---

## Règles pour `flavors`

- Noms de saveurs propres, séparés par `|`
- Pas de parenthèses techniques sauf si nécessaire
- Traduire en français si en anglais

### Exemple:
```
Chocolat|Vanille|Fraise|Cookies & Cream
```

---

## Format CSV — Règles Techniques

1. **Encodage** : UTF-8
2. **Séparateur** : virgule `,`
3. **Guillemets** : Entourer de `"..."` les champs qui contiennent des virgules, des guillemets, ou des retours à la ligne
4. **Séparateur listes** : Pipe `|` pour `flavors`, `benefits`, `certifications`
5. **Booléens** : `true` ou `false` (minuscule)
6. **Nombres** : pas de symbole monétaire, pas d'espaces (ex: `189` pas `189 TND`)
7. **Champs vides** : laisser vide entre les virgules (ex: `,,`)

---

## Mapping `unit` — Valeurs exactes

| Ancien CSV | Nouveau CSV |
|-----------|-------------|
| Gramme | gramme |
| Kilogramme | kilogramme |
| Millilitre | millilitre |
| Gélule | gélule |
| Capsule | capsule |
| Comprimé | comprimé |

**NE PAS** utiliser d'autres valeurs. Si l'unité n'est pas dans cette liste, utiliser `gramme` par défaut.

---

## Checklist finale (vérification avant livraison)

- [ ] Tous les produits ont un `name` non vide
- [ ] Tous les produits ont un `brand` non vide
- [ ] Tous les produits ont une `category` parmi les 10 autorisées
- [ ] Aucun produit n'a la catégorie `supplements` ou une catégorie inventée
- [ ] Toutes les `description` font max 300 chars, sans HTML, sans emojis
- [ ] Tous les `unit` sont parmi les 6 valeurs autorisées
- [ ] Tous les `quantity` sont des nombres positifs
- [ ] Tous les `priceRetail` sont des nombres positifs
- [ ] Tous les `stock` sont des nombres positifs
- [ ] Les `benefits` sont des phrases courtes séparées par `|` (pas du SEO en vrac)
- [ ] Les `certifications` sont de vraies certifications (pas du marketing)
- [ ] Les `priceSlashed` faux (= priceRetail × 1.2) sont supprimés
- [ ] Max 8 produits ont `featured=true`
- [ ] Les `metaTitle` font max 60 chars
- [ ] Les `metaDescription` font max 160 chars
- [ ] Pas de colonnes en trop, pas de colonnes manquantes
- [ ] Le fichier est en UTF-8 avec virgule comme séparateur

---

## Résumé pour l'agent

```
ENTRÉE  : data/dodo_nutrition_120_produits_COMPLET_sanity.csv (ancien format, 120 produits)
SORTIE  : data/products-clean.csv (nouveau format, même 120 produits nettoyés)
MODÈLE  : data/example-products.csv (5 exemples corrects à suivre)
TEMPLATE: data/template-products.csv (headers corrects)
```

**Ta mission** : Lire l'ancien CSV, appliquer TOUTES les règles de ce guide, et produire le nouveau CSV propre. Aucune exception.
