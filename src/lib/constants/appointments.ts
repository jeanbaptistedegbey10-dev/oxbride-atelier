/**
 * OXBride Atelier — Constantes partagées pour les rendez-vous.
 *
 * Source unique de vérité pour les créneaux horaires, lieux et prestations.
 * Utilisée à la fois par le frontend (`/rendez-vous`) et l'API (`/api/appointments`).
 */

// Format des créneaux : 'HHhMM' (ex: '10h30')
// Ce format est utilisé dans l'UI et envoyé à l'API.
// L'API normalise en 'HH:MM' pour le stockage/réponse si nécessaire.
export const APPOINTMENT_SLOTS = [
  '10h30',
  '11h45',
  '14h00',
  '15h30',
  '17h00',
  '18h15',
] as const;

export type AppointmentSlot = (typeof APPOINTMENT_SLOTS)[number];

// Identifiants des sanctuaires
export const LIEU_IDS = ['PAR', 'BEN'] as const;
export type LieuId = (typeof LIEU_IDS)[number];

// Identifiants des prestations (doivent correspondre aux valeurs du frontend)
export const PRESTATION_IDS = [
  'essayage-mariee',
  'haute-couture',
  'tailoring-homme',
  'ensembles-couple',
  'ajustements',
] as const;
export type PrestationId = (typeof PRESTATION_IDS)[number];

/** Normalise un créneau 'HHhMM' vers 'HH:MM' (pour stockage/API externe). */
export function normalizeSlot(slot: string): string {
  return slot.replace('h', ':');
}

/** Vérifie qu'un créneau est valide (accepte 'HHhMM' ou 'HH:MM'). */
export function isValidSlot(slot: string): boolean {
  const normalized = slot.replace('h', ':');
  return APPOINTMENT_SLOTS.some((s) => s.replace('h', ':') === normalized);
}

/** Vérifie qu'un lieuId est valide. */
export function isValidLieuId(id: string): id is LieuId {
  return LIEU_IDS.includes(id as LieuId);
}

/** Vérifie qu'une prestation est valide. */
export function isValidPrestationId(id: string): id is PrestationId {
  return PRESTATION_IDS.includes(id as PrestationId);
}