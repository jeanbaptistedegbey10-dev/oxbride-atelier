/** @file
 * OXBride Atelier — Page « Sur-Mesure » (Neo-Luxe).
 * Route : /sur-mesure
 *
 * Conventions :
 * - Fond champagne poudré `bg-[#F9F8F6]`, typo Serif, espacements aérés.
 * - Toutes les icônes SVG ont une taille explicite (`w-4 h-4` / `w-5 h-5`).
 * - Contenu intégralement en français (marque OXBride Atelier).
 */

import Link from 'next/link';
import { ArrowRight, Ruler, Scissors, Palette, Check } from 'lucide-react';

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
  return (
    <main className="min-h-screen bg-[#F9F8F6] text-stone-900">
      {/* ================================================================
          Hero — Sur-Mesure
          ================================================================ */}
      <section className="relative overflow-hidden border-b border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 lg:py-40 text-center">
          <span className="inline-block text-[10px] uppercase tracking-[0.3em] text-amber-700/90 font-sans mb-6">
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
              className="inline-flex items-center gap-2 rounded-none border border-stone-300 bg-transparent py-4 px-8 text-sm font-sans uppercase tracking-[0.1em] text-stone-900 hover:border-stone-900 hover:bg-stone-100 transition-colors"
            >
              Voir les collections
            </Link>
          </div>
        </div>
      </section>

      {/* ================================================================
          Les 4 piliers du Sur-Mesure
          ================================================================ */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 lg:mb-20">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-stone-900 mb-4">
              Les piliers du Sur-Mesure
            </h2>
            <p className="text-stone-600 text-lg leading-relaxed max-w-2xl mx-auto">
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
                  className="relative rounded-3xl overflow-hidden border border-stone-200/80 bg-white/60 p-8"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-serif text-2xl font-bold text-amber-700/90">
                      {pilier.number}
                    </span>
                    <Icon className="w-5 h-5 shrink-0 text-amber-700/60" aria-hidden="true" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-stone-900 mb-3">
                    {pilier.title}
                  </h3>
                  <p className="text-sm text-stone-600 leading-relaxed">
                    {pilier.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================================================================
          Matières d'exception
          ================================================================ */}
      <section className="py-20 lg:py-28 border-t border-stone-200/80">
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
                className="rounded-2xl border border-stone-200/80 bg-white/40 p-6"
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
          Engagements
          ================================================================ */}
      <section className="py-20 lg:py-28 border-t border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-amber-700/90 font-sans mb-6">
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
                  <Check className="w-5 h-5 shrink-0 text-amber-700 mt-0.5" aria-hidden="true" />
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
          CTA Final
          ================================================================ */}
      <section className="py-20 lg:py-28 border-t border-stone-200/80">
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
            <Link
              href="/rendez-vous"
              className="inline-flex items-center gap-2 rounded-none border border-stone-900 bg-stone-900 py-4 px-8 text-sm font-sans uppercase tracking-[0.1em] text-white hover:bg-stone-700 hover:border-stone-700 transition-colors"
            >
              Réserver mon essayage
              <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
            </Link>
            <Link
              href="/latelier"
              className="inline-flex items-center gap-2 rounded-none border border-stone-300 bg-transparent py-4 px-8 text-sm font-sans uppercase tracking-[0.1em] text-stone-900 hover:border-stone-900 hover:bg-stone-100 transition-colors"
            >
              Découvrir L'Atelier
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}