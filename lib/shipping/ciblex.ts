const CIBLEX_BASE_URL = "https://ciblextunisie.delivery/api/api.v1/StColis";

// =============================================================================
// Types
// =============================================================================

interface CiblexAuth {
  Uilisateur: string;
  Pass: string;
}

export interface CiblexCreateShipmentRequest {
  reference: string;
  client: string;
  adresse: string;
  gouvernorat: string;
  ville: string;
  nb_pieces: number;
  prix: number;
  tel1: string;
  tel2?: string;
  designation: string;
  commentaire?: string;
  type: "FIX";
  echange: 0;
}

export interface CiblexCreateShipmentResponse {
  result_type: "success" | "erreur";
  result_code: string;
  result_content: {
    codeBar: string;
    codeBar2: string;
  };
}

export interface CiblexColisStatus {
  code: string;
  etat: string;
  client: string;
  adresse: string;
  gouvernorat?: string;
  ville?: string;
  tel1?: string;
  prix?: number;
  nb_pieces?: number;
  designation?: string;
  commentaire?: string;
  date_creation?: string;
  date_dernier_etat?: string;
}

export interface CiblexGetColisResponse {
  result_type: "success" | "erreur";
  result_code: string;
  result_content: CiblexColisStatus;
}

export interface CiblexListColisResponse {
  result_type: "success" | "erreur";
  result_code: string;
  result_content: CiblexColisStatus[];
}

export interface CiblexVille {
  gouvernorat: string;
  ville: string;
}

export interface CiblexListVillesResponse {
  result_type: "success" | "erreur";
  result_code: string;
  result_content: CiblexVille[];
}

export interface CiblexSimpleResponse {
  result_type: "success" | "erreur";
  result_code: string;
  result_content: string;
}

export type CiblexEtat =
  | "En Attente"
  | "A Enlever"
  | "Enlevé"
  | "Au Dépôt"
  | "En Cours de Livraison"
  | "Retour Dépôt"
  | "Anomalie de Livraison"
  | "Livré"
  | "Livré Payé"
  | "Retour Client Agence"
  | "Retour Définitif"
  | "Retour Expéditeur"
  | "Retour Reçu"
  | "Echange Reçu";

// =============================================================================
// Helpers
// =============================================================================

function getAuth(): CiblexAuth {
  const user = process.env.CIBLEX_USER;
  const pass = process.env.CIBLEX_PASS;
  if (!user || !pass) {
    throw new Error("CIBLEX_USER et CIBLEX_PASS doivent être définis");
  }
  return { Uilisateur: user, Pass: pass };
}

async function ciblexFetch<T>(endpoint: string, body: Record<string, unknown>): Promise<T> {
  const url = `${CIBLEX_BASE_URL}/${endpoint}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Ciblex API error: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}

// =============================================================================
// API Functions
// =============================================================================

/**
 * Créer un colis (shipment) chez Ciblex.
 * Retourne le codeBar de suivi.
 */
export async function createShipment(
  data: CiblexCreateShipmentRequest
): Promise<CiblexCreateShipmentResponse> {
  const auth = getAuth();
  return ciblexFetch<CiblexCreateShipmentResponse>("AjouterVColis", {
    ...auth,
    ...data,
  });
}

/**
 * Récupérer le statut d'un colis par son codeBar.
 */
export async function getShipmentStatus(
  codeBar: string
): Promise<CiblexGetColisResponse> {
  const auth = getAuth();
  return ciblexFetch<CiblexGetColisResponse>("getColis", {
    ...auth,
    codeBar,
  });
}

/**
 * Récupérer les statuts de plusieurs colis (codes séparés par ";").
 */
export async function listShipmentStatuses(
  codeBars: string[]
): Promise<CiblexListColisResponse> {
  const auth = getAuth();
  return ciblexFetch<CiblexListColisResponse>("ListColis", {
    ...auth,
    codeBar: codeBars.join(";"),
  });
}

/**
 * Récupérer la liste des gouvernorats et villes Ciblex.
 */
export async function listVilles(): Promise<CiblexListVillesResponse> {
  const auth = getAuth();
  return ciblexFetch<CiblexListVillesResponse>("listVilles", { ...auth });
}

/**
 * Demander un enlèvement (pickup) chez Ciblex.
 */
export async function requestPickup(): Promise<CiblexSimpleResponse> {
  const auth = getAuth();
  return ciblexFetch<CiblexSimpleResponse>("demanderEnlevement", { ...auth });
}

/**
 * Supprimer un colis (uniquement si "En Attente").
 */
export async function deleteShipment(
  codeBar: string
): Promise<CiblexSimpleResponse> {
  const auth = getAuth();
  return ciblexFetch<CiblexSimpleResponse>("supprimerColis", {
    ...auth,
    codeBar,
  });
}

/**
 * Modifier un colis existant.
 */
export async function modifyShipment(
  data: Partial<CiblexCreateShipmentRequest> & { codeBar: string }
): Promise<CiblexSimpleResponse> {
  const auth = getAuth();
  return ciblexFetch<CiblexSimpleResponse>("modifierColis", {
    ...auth,
    ...data,
  });
}

// =============================================================================
// Status Mapping: Ciblex état → Dodo order status
// =============================================================================

import type { OrderStatusValue } from "@/lib/constants/orderStatus";

const CIBLEX_STATUS_MAP: Record<string, OrderStatusValue> = {
  "En Attente": "confirmed",
  "A Enlever": "confirmed",
  "Enlevé": "shipped",
  "Au Dépôt": "shipped",
  "En Cours de Livraison": "shipped",
  "Livré": "delivered",
  "Livré Payé": "delivered",
  "Retour Dépôt": "cancelled",
  "Anomalie de Livraison": "cancelled",
  "Retour Client Agence": "cancelled",
  "Retour Définitif": "cancelled",
  "Retour Expéditeur": "cancelled",
  "Retour Reçu": "cancelled",
  "Echange Reçu": "cancelled",
};

/**
 * Convertit un état Ciblex en statut de commande Dodo.
 * Retourne undefined si l'état n'est pas reconnu.
 */
export function mapCiblexStatus(etat: string): OrderStatusValue | undefined {
  return CIBLEX_STATUS_MAP[etat];
}
