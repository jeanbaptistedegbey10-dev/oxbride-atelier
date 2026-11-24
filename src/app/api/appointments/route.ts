/**
 * OXBride Atelier — API Route : Réservation de rendez-vous (POST /api/appointments).
 *
 * Valide les champs, calcule le préavis 48h, génère un numéro de dossier
 * (OXB-PAR-XXXX / OXB-BEN-XXXX) et retourne une réponse structurée.
 *
 * En l'absence de SMTP/CRM configuré, la réservation est journalisée
 * (console) et simulée comme réussie. Remplacer par un vrai envoi
 * (nodemailer, SendGrid, webhook CRM, etc.) ultérieurement.
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  APPOINTMENT_SLOTS,
  PRESTATION_IDS,
  LIEU_IDS,
  isValidSlot,
  isValidLieuId,
  isValidPrestationId,
  normalizeSlot,
  type PrestationId,
} from '@/lib/constants/appointments';

/* ------------------------------------------------------------------ */
/*  Types & Validation                                                  */
/* ------------------------------------------------------------------ */

interface AppointmentPayload {
  /** Identifiant du sanctuaire : 'PAR' (Paris) ou 'BEN' (Bénin). */
  lieuId: 'PAR' | 'BEN';
  /** Identifiant de la prestation choisie. */
  prestationId: PrestationId;
  /** Date ISO 'YYYY-MM-DD' (déjà validée >= aujourd'hui + 48h côté client). */
  date: string;
  /** Créneau horaire normalisé 'HH:MM' (stockage). */
  creneau: string;
  /** Nom complet du client. */
  nom: string;
  /** Courriel valide. */
  email: string;
  /** Téléphone (format libre, ex: +33 6 00 00 00 00). */
  telephone: string;
  /** Nombre d'accompagnants (0–4). */
  accompagnants: number;
}

/* ------------------------------------------------------------------ */
/*  Validation                                                          */
/* ------------------------------------------------------------------ */

function generateDossierNumber(lieuId: 'PAR' | 'BEN'): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `OXB-${lieuId}-${num}`;
}

function validatePayload(body: unknown): { ok: true; data: AppointmentPayload } | { ok: false; errors: string[] } {
  const errors: string[] = [];

  if (!body || typeof body !== 'object') {
    return { ok: false, errors: ['Corps de requête invalide (JSON attendu).'] };
  }

  const b = body as Record<string, unknown>;

  // lieuId
  if (!isValidLieuId(b.lieuId as string)) {
    errors.push('Lieu invalide (valeurs acceptées : PAR, BEN).');
  }

  // prestationId
  if (!isValidPrestationId(b.prestationId as string)) {
    errors.push('Prestation invalide.');
  }

  // date
  if (typeof b.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(b.date)) {
    errors.push('Date invalide (format YYYY-MM-DD attendu).');
  } else {
    const minDate = new Date();
    minDate.setHours(minDate.getHours() + 48);
    minDate.setHours(0, 0, 0, 0);
    const inputDate = new Date(b.date + 'T00:00:00');
    if (inputDate < minDate) {
      errors.push(`La date doit être au moins 48h après aujourd'hui (soit à partir du ${minDate.toISOString().slice(0, 10)}).`);
    }
  }

  // creneau — accepte 'HHhMM' ou 'HH:MM', normalise en 'HH:MM'
  if (typeof b.creneau !== 'string' || !isValidSlot(b.creneau)) {
    errors.push(`Créneau invalide (valeurs : ${APPOINTMENT_SLOTS.join(', ')}).`);
  }

  // nom
  if (typeof b.nom !== 'string' || b.nom.trim().length < 2) {
    errors.push('Nom requis (minimum 2 caractères).');
  }

  // email
  if (typeof b.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email)) {
    errors.push('Courriel invalide.');
  }

  // telephone
  if (typeof b.telephone !== 'string' || b.telephone.trim().length < 8) {
    errors.push('Téléphone requis.');
  }

  // accompagnants
  if (typeof b.accompagnants !== 'number' || !Number.isInteger(b.accompagnants) || b.accompagnants < 0 || b.accompagnants > 4) {
    errors.push('Accompagnants : entier entre 0 et 4.');
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  // Type narrowing après validation
  const data: AppointmentPayload = {
    lieuId: b.lieuId as 'PAR' | 'BEN',
    prestationId: b.prestationId as PrestationId,
    date: b.date as string,
    creneau: normalizeSlot(b.creneau as string), // normalise 'HHhMM' -> 'HH:MM'
    nom: (b.nom as string).trim(),
    email: (b.email as string).trim().toLowerCase(),
    telephone: (b.telephone as string).trim(),
    accompagnants: b.accompagnants as number,
  };

  return { ok: true, data };
}

/* ------------------------------------------------------------------ */
/*  Handler POST                                                        */
/* ------------------------------------------------------------------ */

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, errors: ['Corps JSON invalide.'] },
      { status: 400 }
    );
  }

  const validation = validatePayload(body);
  if (!validation.ok) {
    return NextResponse.json(
      { success: false, errors: validation.errors },
      { status: 422 }
    );
  }

  const { data } = validation;
  const dossier = generateDossierNumber(data.lieuId);

  // --- ICI : intégration réelle (email, CRM, webhook, DB) ---
  // Exemple de structure pour un envoi futur :
  // await sendAppointmentEmail({ ...data, dossier });
  // await createCrmLead({ ...data, dossier });

  // Journalisation locale (dev / fallback sans SMTP)
  if (process.env.NODE_ENV !== 'production') {
    console.log('[APPOINTMENT] Nouvelle réservation :', {
      dossier,
      lieu: data.lieuId,
      prestation: data.prestationId,
      date: data.date,
      creneau: data.creneau,
      client: data.nom,
      email: data.email,
      telephone: data.telephone,
      accompagnants: data.accompagnants,
      timestamp: new Date().toISOString(),
    });
  }

  // Réponse de succès
  return NextResponse.json(
    {
      success: true,
      dossier,
      message: 'Votre rendez-vous a été confirmé.',
      recap: {
        dossier,
        lieu: data.lieuId,
        prestation: data.prestationId,
        date: data.date,
        creneau: data.creneau,
        nom: data.nom,
        email: data.email,
        telephone: data.telephone,
        accompagnants: data.accompagnants,
      },
    },
    { status: 201 }
  );
}