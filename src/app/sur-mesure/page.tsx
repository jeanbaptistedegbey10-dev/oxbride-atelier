/** @file
 * OXBride Atelier — Page « Sur-Mesure » (Neo-Luxe Lumineux).
 * Route : /sur-mesure
 *
 * Conventions (palette lumineuse & nuancée) :
 * - Fond principal champagne `bg-[#F9F8F6]`
 * - Nuances alternatives : sable chaud `bg-[#F2ECE4]`, ivoire `bg-[#FAF7F3]`
 * - Section piliers : fond profond chaud `bg-[#2D2825]` avec texte clair
 * - Cartes : `bg-white/90` ou `bg-white/70` avec bordures `border-stone-200/80`
 * - Accents dorés/sable `text-[#9A7B5B]` / `border-[#C8B094]`
 * - Typo Serif, icônes `w-4 h-4` / `w-5 h-5`
 * - Contenu intégralement en français (marque OXBride Atelier).
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Ruler, Scissors, Palette, Check, Send, AlertCircle } from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Données éditoriales                                                */
/* ------------------------------------------------------------------ */

const piliers = [
  {
    number: 'I',
    title: 'Le Dessin & l\'Écoute',
    description:
      'Chaque pièce commence par un dialogue. Morphologie, personnalité, '
      + 'histoire : nous dessinons une silhouette qui révèle qui vous êtes, '
      + 'avant le premier coup de crayon.',
    icon: Palette,
  },
  {
    number: 'II',
    title: 'La Matière & la Coupe',
    description:
      'Patrons exclusifs, drapé sur toile de coton, essayages successifs. '
      + 'La coupe structure le volume et le tombé — elle est le squelette '
      + 'invisible de la pièce finie.',
    icon: Scissors,
  },
  {
    number: 'III',
    title: 'La Mesure & l\'Ajustement',
    description:
      'Plus de trente mesures, des essayages successifs et un ajustement '
      + 'millimétré. La précision du geste garantit un tombé parfait, pensé '
      + 'pour votre seule silhouette.',
    icon: Ruler,
  },
  {
    number: 'IV',
    title: 'Les Finitions & la Livraison',
    description:
      'Boutonnières cousues main, doublure montée à la main, repassage '
      + 'final. La pièce est livrée en housse de protection, prête pour le '
      + 'grand jour.',
    icon: Check,
  },
];

const matieres = [
  { name: 'Satin Duchesse', origin: 'Lyon, France' },
  { name: 'Dentelle de Calais-Caudry', origin: 'Hauts-de-France, France' },
  { name: 'Broderie Zardozi', origin: 'Lucknow, Inde' },
  { name: 'Coton Biologique du Bénin', origin: 'Abomey-Calavi, Bénin' },
  { name: 'Organza de Soie', origin: 'Chine / France' },
  { name: 'Laine Froide Super 150\'s', origin: 'Italie' },
];

const engagements = [
  'Patrons exclusifs, jamais reproduits à l\'identique',
  'Essayages illimités jusqu\'à la perfection du tombé',
  'Broderies, perles et dentelles posées main',
  'Savoir-faire transmis entre Paris et Abomey-Calavi',
  'Conditions de travail dignes pour nos artisans',
  'Retouches offertes pendant un an après livraison',
];

/* ------------------------------------------------------------------ */
/*  Composant                                                          */
/* ------------------------------------------------------------------ */

export default function SurMesurePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    message: '',
    lieuSouhaite: '' as '' | 'PAR' | 'BEN',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (submitError) setSubmitError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'sur-mesure',
          titre: 'Projet Sur-Mesure',
          nom: formData.nom.trim(),
          email: formData.email.trim(),
          telephone: formData.telephone.trim(),
          message: formData.message.trim(),
          lieuSouhaite: formData.lieuSouhaite || undefined,
          referrer: typeof window !== 'undefined' ? window.location.href : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.errors?.[0] || 'Erreur lors de l\'envoi. Veuillez réessayer.');
      }

      setSubmitSuccess(true);
      setFormData({ nom: '', email: '', telephone: '', message: '', lieuSouhaite: '' });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Une erreur est survenue.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F9F8F6] text-stone-900">
      {/* ================================================================
          Hero — Sur-Mesure (Champagne)
          ================================================================ */}
      <section className="relative overflow-hidden border-b border-stone-200/80 bg-[#F9F8F6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 lg:py-40 text-center">
          <span className="inline-block text-[10px] uppercase tracking-[0.3em] text-[#9A7B5B] font-sans mb-6">
            L'Art du Sur-Mesure
          </span>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold leading-[1] tracking-tight text-stone-900 mb-8">
            Sur-Mesure
          </h1>
          <p className="text-lg md:text-xl text-stone-600 leading-relaxed max-w-3xl mx-auto mb-12">
            Une pièce unique, née de votre histoire et du geste de nos artisans.
            Chaque création est dessinée, coupée et brodée pour vous seule,
            dans le respect des traditions et des exigences d'excellence.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/rendez-vous"
              className="inline-flex items-center gap-2 rounded-none border border-stone-900 bg-stone-900 py-4 px-8 text-sm font-sans uppercase tracking-[0.1em] text-white hover:bg-stone-700 hover:border-stone-700 transition-colors"
            >
              Réserver un essayage
              <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
            </Link>
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
          Les 4 piliers du Sur-Mesure (Profond chaud)
          ================================================================ */}
      <section className="py-20 lg:py-28 border-t border-stone-200/80 bg-[#2D2825] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 lg:mb-20">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">
              Les piliers du Sur-Mesure
            </h2>
            <p className="text-stone-300 text-lg leading-relaxed max-w-2xl mx-auto">
              Quatre étapes, un seul fil conducteur : la précision du geste et
              l'écoute de votre histoire.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {piliers.map((pilier) => {
              const Icon = pilier.icon;
              return (
                <div
                  key={pilier.number}
                  className="relative rounded-3xl overflow-hidden border border-white/10 bg-white/5 p-8"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-serif text-2xl font-bold text-[#C8B094]">
                      {pilier.number}
                    </span>
                    <Icon className="w-5 h-5 shrink-0 text-[#C8B094]" aria-hidden="true" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-white mb-3">
                    {pilier.title}
                  </h3>
                  <p className="text-sm text-stone-300 leading-relaxed">
                    {pilier.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================================================================
          Matières d'exception (Sable chaud)
          ================================================================ */}
      <section className="py-20 lg:py-28 border-t border-stone-200/80 bg-[#F2ECE4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 lg:mb-20">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-stone-900 mb-4">
              Matières d'exception
            </h2>
            <p className="text-stone-600 text-lg leading-relaxed max-w-2xl mx-auto">
              Nous sélectionnons chaque fibre pour sa provenance, son tombé et
              sa résistance. La matière est le premier geste couture.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {matieres.map((matiere) => (
              <div
                key={matiere.name}
                className="rounded-2xl border border-stone-200/80 bg-white/90 p-6"
              >
                <h3 className="font-serif text-lg font-bold text-stone-900 mb-1">
                  {matiere.name}
                </h3>
                <p className="text-xs uppercase tracking-[0.1em] font-sans text-stone-500">
                  {matiere.origin}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          Engagements (Ivoire)
          ================================================================ */}
      <section className="py-20 lg:py-28 border-t border-stone-200/80 bg-[#FAF7F3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#9A7B5B] font-sans mb-6">
                Nos Engagements
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-stone-900 mb-6 leading-[1.1]">
                L'exigence, à chaque étape
              </h2>
              <p className="text-stone-600 text-lg leading-relaxed">
                Du premier croquis à la dernière retouche, chaque pièce est
                traitée avec le soin d'une œuvre unique. Nos engagements :
              </p>
            </div>
            <ul className="space-y-4">
              {engagements.map((engagement) => (
                <li key={engagement} className="flex items-start gap-3">
                  <Check className="w-5 h-5 shrink-0 text-[#9A7B5B] mt-0.5" aria-hidden="true" />
                  <span className="text-sm text-stone-700 leading-relaxed">
                    {engagement}
                  </span>
                </li>
              ))}
            </ul>
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
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-none border border-stone-900 bg-stone-900 py-4 px-8 text-sm font-sans uppercase tracking-[0.1em] text-white hover:bg-stone-700 hover:border-stone-700 transition-colors"
            >
              Démarrer mon projet sur-mesure
              <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
            </button>
            <Link
              href="/rendez-vous"
              className="inline-flex items-center gap-2 rounded-none border border-stone-300 bg-transparent py-4 px-8 text-sm font-sans uppercase tracking-[0.1em] text-stone-900 hover:border-stone-900 hover:bg-[#F2ECE4] transition-colors"
            >
              Réserver un essayage
            </Link>
            <Link
              href="/latelier"
              className="inline-flex items-center gap-2 rounded-none border border-stone-300 bg-transparent py-4 px-8 text-sm font-sans uppercase tracking-[0.1em] text-stone-900 hover:border-stone-900 hover:bg-[#F2ECE4] transition-colors"
            >
              Découvrir L'Atelier
            </Link>
          </div>
        </div>
      </section>

      {/* ================================================================
          Modale — Demande de projet Sur-Mesure
          ================================================================ */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm"
          onClick={() => setIsModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="sur-mesure-modal-title"
        >
          <div
            className="w-full max-w-lg bg-white/95 rounded-3xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200/80">
              <h2 id="sur-mesure-modal-title" className="font-serif text-xl font-bold text-stone-900">
                Votre projet sur-mesure
              </h2>
              <button
                type="button"
                onClick={() => { setIsModalOpen(false); setSubmitSuccess(false); setSubmitError(null); }}
                aria-label="Fermer"
                className="flex h-10 w-10 items-center justify-center rounded-full text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {submitSuccess ? (
              <div className="p-8 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-stone-900 text-white mb-4">
                  <Check className="w-7 h-7" aria-hidden="true" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-stone-900 mb-2">
                  Projet transmis
                </h3>
                <p className="text-stone-600 mb-6">
                  Merci pour votre confiance. Un styliste vous recontactera
                  sous 48h pour organiser votre premier rendez-vous.
                </p>
                <button
                  type="button"
                  onClick={() => { setIsModalOpen(false); setSubmitSuccess(false); }}
                  className="inline-flex items-center gap-2 rounded-none border border-stone-900 bg-stone-900 py-3 px-6 text-sm font-sans uppercase tracking-[0.1em] text-white hover:bg-stone-700 transition-colors"
                >
                  Fermer
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {submitError && (
                  <div
                    className="rounded-xl border border-amber-700/30 bg-amber-50/50 p-3 text-sm text-amber-700 flex items-center gap-2"
                    role="alert"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>{submitError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label htmlFor="sm-nom" className="block text-xs font-sans uppercase tracking-[0.15em] text-stone-500 mb-1">
                      Nom complet *
                    </label>
                    <input
                      id="sm-nom"
                      name="nom"
                      type="text"
                      required
                      value={formData.nom}
                      onChange={handleInputChange}
                      placeholder="Votre nom"
                      className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 placeholder:text-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-900"
                    />
                  </div>

                  <div>
                    <label htmlFor="sm-email" className="block text-xs font-sans uppercase tracking-[0.15em] text-stone-500 mb-1">
                      Courriel *
                    </label>
                    <input
                      id="sm-email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="vous@exemple.fr"
                      className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 placeholder:text-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-900"
                    />
                  </div>

                  <div>
                    <label htmlFor="sm-tel" className="block text-xs font-sans uppercase tracking-[0.15em] text-stone-500 mb-1">
                      Téléphone *
                    </label>
                    <input
                      id="sm-tel"
                      name="telephone"
                      type="tel"
                      required
                      value={formData.telephone}
                      onChange={handleInputChange}
                      placeholder="+33 6 00 00 00 00"
                      className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 placeholder:text-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-900"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="sm-lieu" className="block text-xs font-sans uppercase tracking-[0.15em] text-stone-500 mb-1">
                    Salon souhaité (optionnel)
                  </label>
                  <select
                    id="sm-lieu"
                    name="lieuSouhaite"
                    value={formData.lieuSouhaite}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900"
                  >
                    <option value="">Choisir un salon</option>
                    <option value="PAR">Paris · Place Vendôme</option>
                    <option value="BEN">Abomey-Calavi · Atelier</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="sm-message" className="block text-xs font-sans uppercase tracking-[0.15em] text-stone-500 mb-1">
                    Votre projet * (inspiration, délai, budget approximatif, etc.)
                  </label>
                  <textarea
                    id="sm-message"
                    name="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Décrivez votre vision : type de pièce, matières envisagées, date de l'événement, inspiration..."
                    className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 placeholder:text-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-900 resize-none"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    disabled={isSubmitting}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-none border border-stone-300 bg-transparent py-3 px-6 text-sm font-sans uppercase tracking-[0.1em] text-stone-900 hover:border-stone-900 hover:bg-[#F2ECE4] transition-colors disabled:opacity-40"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-none border border-stone-900 bg-stone-900 py-3 px-6 text-sm font-sans uppercase tracking-[0.1em] text-white hover:bg-stone-700 hover:border-stone-700 transition-colors disabled:cursor-not-allowed disabled:opacity-40"
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
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Envoi…
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 shrink-0" aria-hidden="true" />
                        Envoyer mon projet
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
}