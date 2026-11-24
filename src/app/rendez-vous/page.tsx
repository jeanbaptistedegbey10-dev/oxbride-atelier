/** @file
 * OXBride Atelier — Page « Rendez-vous & Salons Privés » (Neo-Luxe Lumineux).
 * Route : /rendez-vous
 *
 * Parcours de réservation interactif côté client en 3 étapes :
 *   1. Lieu (Paris · Place Vendôme / Abomey-Calavi) + type de prestation.
 *   2. Date (préavis minimum 48h calculé côté client) + créneau + coordonnées.
 *   3. Écran de confirmation avec récapitulatif + numéro de dossier
 *      (`OXB-PAR-XXXX` ou `OXB-BEN-XXXX`).
 *
 * Sections éditoriales : privilèges des salons + FAQ courte.
 *
 * Conventions (palette lumineuse & nuancée) :
 * - Fond principal champagne `bg-[#F9F8F6]`
 * - Nuances alternatives : sable chaud `bg-[#F2ECE4]`, ivoire `bg-[#FAF7F3]`
 * - Cartes : `bg-white/90` ou `bg-white/70` avec bordures `border-stone-200/80`
 * - Accents dorés/sable `text-[#9A7B5B]` / `border-[#C8B094]`
 * - Typo Serif, icônes `w-4 h-4` / `w-5 h-5`
 * - Contenu intégralement en français (marque OXBride Atelier).
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Check,
  Users,
  Phone,
  Mail,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Scissors,
} from 'lucide-react';
import { APPOINTMENT_SLOTS, PRESTATION_IDS } from '@/lib/constants/appointments';

/* ------------------------------------------------------------------ */
/*  Données éditoriales                                                */
/* ------------------------------------------------------------------ */

interface Lieu {
  id: 'PAR' | 'BEN';
  city: string;
  role: string;
  address: string;
  hours: string;
  description: string;
}

const LIEUX: Lieu[] = [
  {
    id: 'PAR',
    city: 'Paris',
    role: 'Salon Privé',
    address: 'Place Vendôme, 75001 Paris',
    hours: 'Mardi – Samedi, 10h – 19h',
    description:
      'Un écrin confidentiel au cœur du triangle d\'or. Essayages, conseil en '
      + 'image et prise de mesures : chaque rendez-vous dure deux heures minimum, '
      + 'en tête-à-tête avec nos stylistes.',
  },
  {
    id: 'BEN',
    city: 'Abomey-Calavi, Bénin',
    role: 'Atelier de Confection',
    address: 'Quartier Akassato, Abomey-Calavi',
    hours: 'Mardi – Samedi, 9h – 18h',
    description:
      'Ici naissent les pièces. Rencontrez nos artisans — tailleurs, brodeurs, '
      + 'modélistes — et découvrez les gestes qui donnent vie aux patrons dans '
      + 'le respect des conditions de travail dignes.',
  },
];

const PRESTATIONS = [
  { id: 'essayage-mariee', label: 'Essayage Collection Mariée', hint: 'Découverte & essayage de la collection' },
  { id: 'haute-couture', label: 'Création Haute Couture Sur-Mesure', hint: 'Dessin, toile et réalisation unique' },
  { id: 'tailoring-homme', label: 'Tailoring Homme', hint: 'Costumes, smokings & coupes ajustées' },
  { id: 'ensembles-couple', label: 'Ensembles Couple', hint: 'Harmonie & coordination du cortège' },
  { id: 'ajustements', label: 'Ajustements', hint: 'Retouches & finitions sur pièce existante' },
] as const;

// Créneaux partagés avec l'API (format 'HHhMM')
const CRENEAUX = APPOINTMENT_SLOTS;

const PRIVILEGES = [
  {
    icon: Sparkles,
    title: 'Essayage Privatif',
    text: 'Deux heures en salon privatif, en tête-à-tête avec un styliste dédié. Aucun autre client, aucune distraction.',
  },
  {
    icon: Scissors,
    title: 'Conseil & Croquis',
    text: 'Morphologie, matières et coupes : chaque rendez-vous inclut un premier dessin de la silhouette pensée pour vous.',
  },
  {
    icon: ShieldCheck,
    title: 'Confidentialité Absolue',
    text: 'Vos mesures, vos croquis et vos préférences restent strictement confidentiels. Discrétion garantie à chaque étape.',
  },
  {
    icon: Users,
    title: 'Accompagnants Bienvenus',
    text: 'Jusqu\'à quatre proches peuvent vous accompagner pour partager ce moment. Un espace salon leur est réservé.',
  },
];

const FAQ = [
  {
    question: 'Faut-il réserver longtemps à l\'avance ?',
    answer:
      'Un préavis de 48 heures minimum est requis pour chaque rendez-vous. '
      + 'Pour les périodes de forte affluence (saison des mariages), nous '
      + 'conseillons de réserver plusieurs semaines à l\'avance.',
  },
  {
    question: 'Le rendez-vous est-il payant ?',
    answer:
      'Le premier rendez-vous de découverte et d\'essayage est offert. Les '
      + 'prestations sur-mesure font l\'objet d\'un devis personnalisé remis '
      + 'après le premier échange.',
  },
  {
    question: 'Puis-je venir sans idée précise ?',
    answer:
      'Absolument. Nos stylistes vous guident pas à pas, du croquis à la '
      + 'première toile. Aucun prérequis n\'est nécessaire, si ce n\'est '
      + 'votre histoire.',
  },
  {
    question: 'Comment se déroule la prise de mesures ?',
    answer:
      'La prise de mesures s\'effectue en sous-vêtements ou avec un vêtement '
      + 'ajusté, dans l\'intimité du salon. Elle dure environ trente minutes '
      + 'et est réalisée par un professionnel formé.',
  },
  {
    question: 'Puis-je annuler ou reporter ?',
    answer:
      'Toute annulation ou modification est possible jusqu\'à 48 heures avant '
      + 'le rendez-vous, sans frais, en nous contactant par téléphone ou '
      + 'courriel.',
  },
];

/* ------------------------------------------------------------------ */
/*  Utilitaires                                                        */
/* ------------------------------------------------------------------ */

/** Date minimale (aujourd'hui + 48h) au format `YYYY-MM-DD` pour l'input date. */
function getMinBookingDate(): string {
  const min = new Date();
  min.setHours(min.getHours() + 48);
  const year = min.getFullYear();
  const month = String(min.getMonth() + 1).padStart(2, '0');
  const day = String(min.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** Formatage lisible d'une date ISO `YYYY-MM-DD` en français. */
function formatDateFr(iso: string): string {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(y, (m ?? 1) - 1, d ?? 1);
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/** Génère un numéro de dossier `OXB-<LIEU>-XXXX`. */
function generateDossierNumber(lieuId: 'PAR' | 'BEN'): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `OXB-${lieuId}-${num}`;
}

/* ------------------------------------------------------------------ */
/*  Composants auxiliaires                                             */
/* ------------------------------------------------------------------ */

function StepIndicator({ current }: { current: number }) {
  const steps = ['Salon & Prestation', 'Coordonnées', 'Confirmation'];
  return (
    <ol className="flex items-center justify-center gap-2 sm:gap-4 mb-12">
      {steps.map((label, index) => {
        const number = index + 1;
        const isActive = number === current;
        const isDone = number < current;
        return (
          <li key={label} className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2">
              <span
                className={[
                  'flex h-8 w-8 items-center justify-center rounded-full border text-xs font-sans font-medium transition-colors',
                  isDone
                    ? 'border-stone-900 bg-stone-900 text-white'
                    : isActive
                      ? 'border-[#9A7B5B] text-[#9A7B5B] bg-white/60'
                      : 'border-stone-300 text-stone-400 bg-transparent',
                ].join(' ')}
                aria-hidden="true"
              >
                {isDone ? <Check className="h-4 w-4" /> : number}
              </span>
              <span
                className={[
                  'hidden sm:inline text-[10px] uppercase tracking-[0.15em] font-sans',
                  isActive ? 'text-stone-900' : 'text-stone-400',
                ].join(' ')}
              >
                {label}
              </span>
            </div>
            {number < steps.length && (
              <span className="h-px w-6 sm:w-10 bg-stone-300" aria-hidden="true" />
            )}
          </li>
        );
      })}
    </ol>
  );
}

/* ------------------------------------------------------------------ */
/*  Composant                                                          */
/* ------------------------------------------------------------------ */

export default function RendezVousPage() {
  // La date minimale dépend de l'heure courante : calculée uniquement côté
  // client (après montage) pour éviter le blocage de prerender Next.js 16.
  const [minDate, setMinDate] = useState('');

  useEffect(() => {
    setMinDate(getMinBookingDate());
  }, []);

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Étape 1 — Lieu & prestation
  const [lieuId, setLieuId] = useState<'PAR' | 'BEN' | ''>('');
  const [prestationId, setPrestationId] = useState('');

  // Étape 2 — Coordonnées
  const [date, setDate] = useState('');
  const [creneau, setCreneau] = useState('');
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [accompagnants, setAccompagnants] = useState(0);

  // Étape 3 — Confirmation
  const [dossier, setDossier] = useState('');

  const selectedLieu = LIEUX.find((l) => l.id === lieuId) ?? null;
  const selectedPrestation = PRESTATIONS.find((p) => p.id === prestationId) ?? null;

  const canGoToStep2 = Boolean(lieuId) && Boolean(prestationId);
  const canConfirm = Boolean(
    date && creneau && nom.trim() && email.trim() && telephone.trim(),
  );

  const handleConfirm = async () => {
    if (!canConfirm || !lieuId) return;
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lieuId,
          prestationId,
          date,
          creneau,
          nom: nom.trim(),
          email: email.trim(),
          telephone: telephone.trim(),
          accompagnants,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.errors?.[0] || 'Erreur lors de la réservation. Veuillez réessayer.');
      }

      setDossier(data.dossier);
      setStep(3);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Une erreur est survenue.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setLieuId('');
    setPrestationId('');
    setDate('');
    setCreneau('');
    setNom('');
    setEmail('');
    setTelephone('');
    setAccompagnants(0);
    setDossier('');
  };

  return (
    <main className="min-h-screen bg-[#F9F8F6] text-stone-900">
      {/* ================================================================
          Hero — Rendez-vous (Champagne)
          ================================================================ */}
      <section className="relative overflow-hidden border-b border-stone-200/80 bg-[#F9F8F6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 lg:py-40 text-center">
          <span className="inline-block text-[10px] uppercase tracking-[0.3em] text-[#9A7B5B] font-sans mb-6">
            Salons Privés
          </span>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold leading-[1] tracking-tight text-stone-900 mb-8">
            Rendez-vous
          </h1>
          <p className="text-lg md:text-xl text-stone-600 leading-relaxed max-w-3xl mx-auto mb-12">
            Chaque histoire commence par un échange. Réservez un essayage privé
            dans nos salons de Paris ou d'Abomey-Calavi, et laissez-vous guider
            par nos stylistes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#reserver"
              className="inline-flex items-center gap-2 rounded-none border border-stone-900 bg-stone-900 py-4 px-8 text-sm font-sans uppercase tracking-[0.1em] text-white hover:bg-stone-700 hover:border-stone-700 transition-colors"
            >
              Réserver un rendez-vous
              <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
            </a>
            <Link
              href="/collections"
              className="inline-flex items-center gap-2 rounded-none border border-stone-300 bg-transparent py-4 px-8 text-sm font-sans uppercase tracking-[0.1em] text-stone-900 hover:border-stone-900 hover:bg-[#F2ECE4] transition-colors"
            >
              Voir les collections
            </Link>
          </div>
        </div>
      </section>

      {/* ================================================================
          Parcours de réservation (widget interactif) — Blanc chaud
          ================================================================ */}
      <section id="reserver" className="py-20 lg:py-28 bg-white/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-stone-900 mb-4">
              Réservez votre salon privé
            </h2>
            <p className="text-stone-600 text-lg leading-relaxed max-w-2xl mx-auto">
              Trois étapes simples pour orchestrer votre rendez-vous.
            </p>
          </div>

          <div className="rounded-3xl border border-stone-200/80 bg-white/80 p-6 sm:p-10 lg:p-12 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
            <StepIndicator current={step} />

            {/* ---------------- ÉTAPE 1 : Salon & Prestation ---------------- */}
            {step === 1 && (
              <div className="space-y-10">
                <div>
                  <h3 className="font-serif text-xl font-bold text-stone-900 mb-2">
                    1. Choisissez votre sanctuaire
                  </h3>
                  <p className="text-sm text-stone-500 mb-6">
                    Deux lieux, une même exigence du geste.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {LIEUX.map((lieu) => {
                      const selected = lieuId === lieu.id;
                      return (
                        <button
                          key={lieu.id}
                          type="button"
                          onClick={() => setLieuId(lieu.id)}
                          aria-pressed={selected}
                          className={[
                            'relative text-left rounded-2xl border p-6 transition-all duration-200',
                            selected
                              ? 'border-stone-900 bg-stone-900/5 ring-1 ring-stone-900'
                              : 'border-stone-200 bg-white/60 hover:border-stone-400',
                          ].join(' ')}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <MapPin className="w-4 h-4 shrink-0 text-[#9A7B5B]" aria-hidden="true" />
                            <span className="text-[10px] uppercase tracking-[0.2em] text-[#9A7B5B] font-sans">
                              {lieu.city}
                            </span>
                          </div>
                          <p className="font-serif text-lg font-bold text-stone-900 mb-1">
                            {lieu.role}
                          </p>
                          <p className="text-xs text-stone-500 mb-3">{lieu.address}</p>
                          <p className="text-xs text-stone-500">{lieu.hours}</p>
                          {selected && (
                            <span
                              className="absolute top-4 right-4 flex h-6 w-6 items-center justify-center rounded-full bg-stone-900 text-white"
                              aria-hidden="true"
                            >
                              <Check className="w-3 h-3" />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="font-serif text-xl font-bold text-stone-900 mb-2">
                    2. Sélectionnez votre prestation
                  </h3>
                  <p className="text-sm text-stone-500 mb-6">
                    Du premier essayage à la création sur-mesure.
                  </p>
                  <div className="grid grid-cols-1 gap-3">
                    {PRESTATIONS.map((prestation) => {
                      const selected = prestationId === prestation.id;
                      return (
                        <button
                          key={prestation.id}
                          type="button"
                          onClick={() => setPrestationId(prestation.id)}
                          aria-pressed={selected}
                          className={[
                            'flex items-center justify-between gap-4 text-left rounded-xl border px-5 py-4 transition-all duration-200',
                            selected
                              ? 'border-stone-900 bg-stone-900/5'
                              : 'border-stone-200 bg-white/60 hover:border-stone-400',
                          ].join(' ')}
                        >
                          <span>
                            <span className="block text-sm font-medium text-stone-900">
                              {prestation.label}
                            </span>
                            <span className="block text-xs text-stone-500 mt-0.5">
                              {prestation.hint}
                            </span>
                          </span>
                          {selected ? (
                            <Check className="w-4 h-4 shrink-0 text-stone-900" aria-hidden="true" />
                          ) : (
                            <ChevronRight className="w-4 h-4 shrink-0 text-stone-400" aria-hidden="true" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    disabled={!canGoToStep2}
                    className="inline-flex items-center gap-2 rounded-none border border-stone-900 bg-stone-900 py-4 px-8 text-sm font-sans uppercase tracking-[0.1em] text-white hover:bg-stone-700 hover:border-stone-700 transition-colors disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Continuer
                    <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                  </button>
                </div>
              </div>
            )}

            {/* ---------------- ÉTAPE 2 : Coordonnées ---------------- */}
            {step === 2 && (
              <div className="space-y-8">
                <div>
                  <h3 className="font-serif text-xl font-bold text-stone-900 mb-2">
                    Vos coordonnées & créneau
                  </h3>
                  <p className="text-sm text-stone-500">
                    {selectedLieu ? `${selectedLieu.city} — ${selectedLieu.address}` : ''}
                  </p>
                </div>

                {submitError && (
                  <div
                    className="rounded-xl border border-amber-700/30 bg-amber-50/50 p-4 text-sm text-amber-700"
                    role="alert"
                  >
                    {submitError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="rdv-date" className="block text-xs font-sans uppercase tracking-[0.15em] text-stone-500 mb-2">
                      Date souhaitée
                    </label>
                    <input
                      id="rdv-date"
                      type="date"
                      min={minDate}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900"
                    />
                    <p className="mt-1 text-[11px] text-stone-400">
                      Préavis minimum : 48 heures.
                    </p>
                  </div>

                  <div>
                    <label htmlFor="rdv-creneau" className="block text-xs font-sans uppercase tracking-[0.15em] text-stone-500 mb-2">
                      Créneau
                    </label>
                    <select
                      id="rdv-creneau"
                      value={creneau}
                      onChange={(e) => setCreneau(e.target.value)}
                      className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900"
                    >
                      <option value="">Choisir un créneau</option>
                      {CRENEAUX.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label htmlFor="rdv-nom" className="block text-xs font-sans uppercase tracking-[0.15em] text-stone-500 mb-2">
                      Nom complet
                    </label>
                    <input
                      id="rdv-nom"
                      type="text"
                      value={nom}
                      onChange={(e) => setNom(e.target.value)}
                      placeholder="Votre nom"
                      className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 placeholder:text-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-900"
                    />
                  </div>

                  <div>
                    <label htmlFor="rdv-email" className="block text-xs font-sans uppercase tracking-[0.15em] text-stone-500 mb-2">
                      Courriel
                    </label>
                    <input
                      id="rdv-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="vous@exemple.fr"
                      className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 placeholder:text-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-900"
                    />
                  </div>

                  <div>
                    <label htmlFor="rdv-tel" className="block text-xs font-sans uppercase tracking-[0.15em] text-stone-500 mb-2">
                      Téléphone
                    </label>
                    <input
                      id="rdv-tel"
                      type="tel"
                      value={telephone}
                      onChange={(e) => setTelephone(e.target.value)}
                      placeholder="+33 6 00 00 00 00"
                      className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 placeholder:text-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-900"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="rdv-accompagnants" className="block text-xs font-sans uppercase tracking-[0.15em] text-stone-500 mb-2">
                      Accompagnants (maximum 4)
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setAccompagnants((n) => Math.max(0, n - 1))}
                        disabled={accompagnants === 0}
                        aria-label="Diminuer le nombre d'accompagnants"
                        className="flex h-11 w-11 items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-900 hover:border-stone-400 transition-colors disabled:opacity-40"
                      >
                        <span className="text-lg leading-none" aria-hidden="true">−</span>
                      </button>
                      <span className="min-w-[2rem] text-center text-sm font-medium text-stone-900">
                        {accompagnants}
                      </span>
                      <button
                        type="button"
                        onClick={() => setAccompagnants((n) => Math.min(4, n + 1))}
                        disabled={accompagnants === 4}
                        aria-label="Augmenter le nombre d'accompagnants"
                        className="flex h-11 w-11 items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-900 hover:border-stone-400 transition-colors disabled:opacity-40"
                      >
                        <span className="text-lg leading-none" aria-hidden="true">+</span>
                      </button>
                      <span className="ml-2 text-xs text-stone-500">
                        {accompagnants === 0
                          ? 'Seul(e)'
                          : `${accompagnants} proche${accompagnants > 1 ? 's' : ''}`}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center gap-2 rounded-none border border-stone-300 bg-transparent py-4 px-8 text-sm font-sans uppercase tracking-[0.1em] text-stone-900 hover:border-stone-900 hover:bg-[#F2ECE4] transition-colors disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
                    Retour
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirm}
                    disabled={!canConfirm || isSubmitting}
                    className="inline-flex items-center justify-center gap-2 rounded-none border border-stone-900 bg-stone-900 py-4 px-8 text-sm font-sans uppercase tracking-[0.1em] text-white hover:bg-stone-700 hover:border-stone-700 transition-colors disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Enregistrement…
                      </>
                    ) : (
                      <>
                        Confirmer le rendez-vous
                        <Check className="w-4 h-4 shrink-0" aria-hidden="true" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* ---------------- ÉTAPE 3 : Confirmation ---------------- */}
            {step === 3 && (
              <div className="space-y-8">
                <div className="text-center">
                  <div
                    className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-stone-900 text-white"
                    aria-hidden="true"
                  >
                    <Check className="w-7 h-7" />
                  </div>
                  <h3 className="mt-6 font-serif text-2xl font-bold text-stone-900">
                    Votre rendez-vous est confirmé
                  </h3>
                  <p className="mt-2 text-sm text-stone-500">
                    Merci {nom}. Un récapitulatif vous attend ci-dessous.
                  </p>
                </div>

                <div className="mx-auto max-w-lg rounded-2xl border border-stone-200/80 bg-[#F9F8F6] p-6 sm:p-8">
                  <div className="mb-4 flex items-center justify-between border-b border-stone-200 pb-4">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#9A7B5B] font-sans">
                      Numéro de dossier
                    </span>
                    <span className="font-serif text-lg font-bold text-stone-900">
                      {dossier}
                    </span>
                  </div>
                  <dl className="space-y-3 text-sm">
                    <div className="flex justify-between gap-4">
                      <dt className="text-stone-500">Sanctuaire</dt>
                      <dd className="text-right font-medium text-stone-900">
                        {selectedLieu?.city} · {selectedLieu?.role}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-stone-500">Prestation</dt>
                      <dd className="text-right font-medium text-stone-900">
                        {selectedPrestation?.label}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-stone-500">Date</dt>
                      <dd className="text-right font-medium text-stone-900">
                        {formatDateFr(date)}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-stone-500">Créneau</dt>
                      <dd className="text-right font-medium text-stone-900">{creneau}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-stone-500">Accompagnants</dt>
                      <dd className="text-right font-medium text-stone-900">
                        {accompagnants === 0
                          ? 'Seul(e)'
                          : `${accompagnants} proche${accompagnants > 1 ? 's' : ''}`}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-stone-500">Contact</dt>
                      <dd className="text-right font-medium text-stone-900 break-all">
                        {email}
                        {telephone ? ` · ${telephone}` : ''}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center gap-2 rounded-none border border-stone-300 bg-transparent py-4 px-8 text-sm font-sans uppercase tracking-[0.1em] text-stone-900 hover:border-stone-900 hover:bg-[#F2ECE4] transition-colors"
                  >
                    Réserver un autre créneau
                  </button>
                  <Link
                    href="/latelier"
                    className="inline-flex items-center gap-2 rounded-none border border-stone-900 bg-stone-900 py-4 px-8 text-sm font-sans uppercase tracking-[0.1em] text-white hover:bg-stone-700 hover:border-stone-700 transition-colors"
                  >
                    Découvrir L'Atelier
                    <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ================================================================
          Privilèges des salons (Sable chaud)
          ================================================================ */}
      <section className="py-20 lg:py-28 border-t border-stone-200/80 bg-[#F2ECE4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 lg:mb-20">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-stone-900 mb-4">
              Les privilèges de nos salons
            </h2>
            <p className="text-stone-600 text-lg leading-relaxed max-w-2xl mx-auto">
              Une expérience confidentielle, pensée dans les moindres détails.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {PRIVILEGES.map((privilege) => {
              const Icon = privilege.icon;
              return (
                <div
                  key={privilege.title}
                  className="rounded-3xl overflow-hidden border border-stone-200/80 bg-white/90 p-8"
                >
                  <Icon className="w-5 h-5 shrink-0 text-[#9A7B5B] mb-4" aria-hidden="true" />
                  <h3 className="font-serif text-xl font-bold text-stone-900 mb-3">
                    {privilege.title}
                  </h3>
                  <p className="text-sm text-stone-600 leading-relaxed">
                    {privilege.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================================================================
          FAQ courte (Ivoire)
          ================================================================ */}
      <section className="py-20 lg:py-28 border-t border-stone-200/80 bg-[#FAF7F3]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-stone-900 mb-4">
              Questions fréquentes
            </h2>
          </div>
          <div className="space-y-3">
            {FAQ.map((item) => (
              <details
                key={item.question}
                className="group rounded-2xl border border-stone-200/80 bg-white/90 p-5 sm:p-6"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-4 font-serif text-lg font-medium text-stone-900 marker:content-none list-none">
                  <span>{item.question}</span>
                  <span
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-stone-300 text-stone-500 transition-transform group-open:rotate-90"
                    aria-hidden="true"
                  >
                    <span className="text-base leading-none">+</span>
                  </span>
                </summary>
                <p className="mt-3 text-sm text-stone-600 leading-relaxed">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          CTA Final (Champagne)
          ================================================================ */}
      <section className="py-20 lg:py-28 border-t border-stone-200/80 bg-[#F9F8F6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="font-serif text-3xl md:text-4xl font-bold text-stone-900 mb-4">
            Votre histoire commence ici
          </h3>
          <p className="text-stone-600 text-lg leading-relaxed max-w-2xl mx-auto mb-8">
            Essayage, création sur-mesure, retouches ou conseil en image :
            offrez-vous le temps de l'essentiel. Nos équipes vous accueillent
            à Paris ou à Abomey-Calavi.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#reserver"
              className="inline-flex items-center gap-2 rounded-none border border-stone-900 bg-stone-900 py-4 px-8 text-sm font-sans uppercase tracking-[0.1em] text-white hover:bg-stone-700 hover:border-stone-700 transition-colors"
            >
              Réserver mon essayage
              <Calendar className="w-4 h-4 shrink-0" aria-hidden="true" />
            </a>
            <Link
              href="/sur-mesure"
              className="inline-flex items-center gap-2 rounded-none border border-stone-300 bg-transparent py-4 px-8 text-sm font-sans uppercase tracking-[0.1em] text-stone-900 hover:border-stone-900 hover:bg-[#F2ECE4] transition-colors"
            >
              Découvrir le sur-mesure
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}