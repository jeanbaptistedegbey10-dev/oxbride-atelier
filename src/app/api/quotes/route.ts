/**
 * OXBride Atelier — API Route : Demande de devis / Sur-mesure (POST /api/quotes).
 *
 * Reçoit une demande liée à un produit (sur devis) ou un projet sur-mesure libre.
 * Valide les champs obligatoires, génère un numéro de référence (OXB-Q-XXXX)
 * et retourne une réponse structurée.
 *
 * En l'absence de CRM/SMTP, journalisation locale + simulation de succès.
 */

import { NextRequest, NextResponse } from 'next/server';

/* ------------------------------------------------------------------ */
/*  Types & Validation                                                  */
/* ------------------------------------------------------------------ */

interface QuotePayload {
  /** Type de demande : 'produit' (sur devis) ou 'sur-mesure' (projet libre). */
  type: 'produit' | 'sur-mesure';
  /** Handle du produit concerné (si type === 'produit'). */
  produitHandle?: string;
  /** Titre du produit / projet. */
  titre: string;
  /** Variante sélectionnée (si applicable). */
  variante?: string;
  /** Nom complet. */
  nom: string;
  /** Courriel. */
  email: string;
  /** Téléphone. */
  telephone: string;
  /** Message / description du projet. */
  message: string;
  /** Lieu souhaité (optionnel). */
  lieuSouhaite?: 'PAR' | 'BEN';
  /** URL de la page d'origine (pour traçabilité). */
  referrer?: string;
}

function generateQuoteRef(): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `OXB-Q-${num}`;
}

function validateQuote(body: unknown): { ok: true; data: QuotePayload } | { ok: false; errors: string[] } {
  const errors: string[] = [];

  if (!body || typeof body !== 'object') {
    return { ok: false, errors: ['Corps de requête invalide.'] };
  }
  const b = body as Record<string, unknown>;

  // type
  if (b.type !== 'produit' && b.type !== 'sur-mesure') {
    errors.push('Type invalide (valeurs : "produit" ou "sur-mesure").');
  }

  // titre
  if (typeof b.titre !== 'string' || b.titre.trim().length < 2) {
    errors.push('Titre requis.');
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

  // message
  if (typeof b.message !== 'string' || b.message.trim().length < 10) {
    errors.push('Message trop court (minimum 10 caractères).');
  }

  // lieuSouhaite (optionnel)
  if (b.lieuSouhaite !== undefined && b.lieuSouhaite !== 'PAR' && b.lieuSouhaite !== 'BEN') {
    errors.push('Lieu souhaité invalide (PAR ou BEN).');
  }

  // referrer (optionnel)
  if (b.referrer !== undefined && typeof b.referrer !== 'string') {
    errors.push('Referrer invalide.');
  }

  // produitHandle requis si type === 'produit'
  if (b.type === 'produit' && (typeof b.produitHandle !== 'string' || !b.produitHandle.trim())) {
    errors.push('produitHandle requis pour une demande sur produit.');
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  // Type narrowing après validation
  const data: QuotePayload = {
    type: b.type as 'produit' | 'sur-mesure',
    produitHandle: typeof b.produitHandle === 'string' ? b.produitHandle.trim() : undefined,
    titre: (b.titre as string).trim(),
    variante: typeof b.variante === 'string' ? (b.variante as string).trim() : undefined,
    nom: (b.nom as string).trim(),
    email: (b.email as string).trim().toLowerCase(),
    telephone: (b.telephone as string).trim(),
    message: (b.message as string).trim(),
    lieuSouhaite: (b.lieuSouhaite as 'PAR' | 'BEN' | undefined),
    referrer: typeof b.referrer === 'string' ? (b.referrer as string).trim() : undefined,
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

  const validation = validateQuote(body);
  if (!validation.ok) {
    return NextResponse.json(
      { success: false, errors: validation.errors },
      { status: 422 }
    );
  }

  const { data } = validation;
  const reference = generateQuoteRef();

  // --- ICI : intégration réelle (email, CRM, webhook, DB) ---
  // await sendQuoteEmail({ ...data, reference });
  // await createCrmLead({ ...data, reference });

  // Journalisation locale
  if (process.env.NODE_ENV !== 'production') {
    console.log('[QUOTE] Nouvelle demande :', {
      reference,
      type: data.type,
      produitHandle: data.produitHandle,
      titre: data.titre,
      variante: data.variante,
      client: data.nom,
      email: data.email,
      telephone: data.telephone,
      lieuSouhaite: data.lieuSouhaite,
      referrer: data.referrer,
      timestamp: new Date().toISOString(),
    });
  }

  return NextResponse.json(
    {
      success: true,
      reference,
      message:
        data.type === 'produit'
          ? 'Votre demande de devis a été enregistrée. Notre équipe vous contactera sous 48h.'
          : 'Votre projet sur-mesure a été transmis. Un styliste vous recontactera pour organiser un rendez-vous.',
      recap: {
        reference,
        type: data.type,
        titre: data.titre,
        variante: data.variante,
        nom: data.nom,
        email: data.email,
        telephone: data.telephone,
        lieuSouhaite: data.lieuSouhaite,
      },
    },
    { status: 201 }
  );
}