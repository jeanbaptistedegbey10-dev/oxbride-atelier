/** @file
 * OXBride Atelier — Page « L'Atelier » (Neo-Luxe).
 * Vitrine du savoir-faire, des matières d'exception et de l'histoire de la
 * maison. Dialogue créatif Paris ↔ Abomey-Calavi.
 * Route : /latelier
 *
 * Conventions :
 * - Fond champagne poudré `bg-[#F9F8F6]`, typo Serif, espacements aérés.
 * - Toutes les icônes SVG ont une taille explicite (`w-4 h-4` / `w-5 h-5`).
 */

import Link from 'next/link';
import { ArrowRight, MapPin, Sparkles } from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Données éditoriales                                                */
/* ------------------------------------------------------------------ */

const piliers = [
  {
    number: 'I',
    title: 'Le Croquis & l\'Écoute',
    description:
      'Chaque pièce commence par un dialogue. Morphologie, personnalité, '
      + 'histoire : nous dessinons une silhouette qui révèle qui vous êtes, '
      + 'avant le premier coup de crayon.',
    icon: Sparkles,
  },
  {
    number: 'II',
    title: 'La Toile & la Coupe',
    description:
      'Patrons exclusifs, drapé sur toile de coton, essayages successifs. '
      + 'La coupe structure le volume et le tombé — elle est le squelette '
      + 'invisible de la pièce finie.',
    icon: MapPin,
  },
  {
    number: 'III',
    title: 'Le Geste & la Broderie',
    description:
      'Broderies, perles, dentelles posées point par point. De 200 à 800 heures '
      + 'de main d\'œuvre pour une pièce d\'exception. La main transmet '
      + 'l\'exigence, génération après génération.',
    icon: Sparkles,
  },
  {
    number: 'IV',
    title: 'L\'Assemblage & les Finitions',
    description:
      'Montage, doublure, surjet, boutonnières cousues main. Les finitions '
      + 's\'observent à l\'envers : c\'est là que se juge la qualité d\'un '
      + 'geste couture.',
    icon: Sparkles,
  },
];

const matieres = [
  {
    name: 'Satin Duchesse',
    origin: 'Lyon, France',
    description:
      'Un satin de soie dense et lourd, à la main tombante et au lustre '
      + 'profond. Idéal pour les volumes architecturaux et les jupes sculptées.',
    tag: 'Structure',
  },
  {
    name: 'Dentelle de Calais-Caudry',
    origin: 'Hauts-de-France, France',
    description:
      'Dentelle Leavers tissée sur métiers d\'exception. Un héritage '
      + 'Unesco qui donne aux pièces une finesse et une légèreté incomparables.',
    tag: 'Finesse',
  },
  {
    name: 'Broderie Zardozi',
    origin: 'Lucknow, Inde',
    description:
      'Broderie de fils métalliques et de perles, posée main sur soie ou '
      + 'velours. Chaque motif est unique, dessiné pour la pièce et jamais '
      + 'répété.',
    tag: 'Artisanat',
  },
  {
    name: 'Coton Biologique du Bénin',
    origin: 'Abomey-Calavi, Bénin',
    description:
      'Coton cultivé et filé localement, dans le respect des paysans et de '
      + 'la terre. Une fibre douce et éthique pour nos doublures et pièces '
      + 'décontractées.',
    tag: 'Éthique',
  },
  {
    name: 'Organza de Soie',
    origin: 'Chine / France',
    description:
      'Voile transparent et aérien, à la tenue cristalline. Superposé en '
      + 'plusieurs couches, il crée des volumes nuageux et des effets de '
      + 'lumière subtils.',
    tag: 'Lumière',
  },
  {
    name: 'Laine Froide Super 150\'s',
    origin: 'Italie',
    description:
      'Laine peignée d\'exception, tissée en Italie. Tombé impeccable, '
      + 'résistance naturelle, thermorégulation : la base de nos smokings et '
      + 'costumes d\'exception.',
    tag: 'Tenue',
  },
];

const lieux = [
  {
    city: 'Paris',
    role: 'Salon Privé',
    address: 'Place Vendôme, 75001 Paris',
    hours: 'Mardi – Samedi, 10h – 19h',
    description:
      'Un écrin confidentiel au cœur du triangle d\'or. Essayages, conseil en '
      + 'image, prise de mesures : chaque rendez-vous dure deux heures minimum.',
    href: '/rendez-vous',
    cta: 'Réserver à Paris',
  },
  {
    city: 'Abomey-Calavi, Bénin',
    role: 'Atelier de Confection',
    address: 'Quartier Akassato, Abomey-Calavi',
    hours: 'Mardi – Samedi, 9h – 18h',
    description:
      'Ici naissent les pièces. Une vingtaine d\'artisans — tailleurs, '
      + 'brodeurs, modélistes — donnent vie aux patrons dans le respect des '
      + 'gestes et des conditions de travail dignes.',
    href: '/rendez-vous',
    cta: 'Nous contacter',
  },
];

/* ------------------------------------------------------------------ */
/*  Composant                                                          */
/* ------------------------------------------------------------------ */

export default function LatelierPage() {
  return (
    <main className="min-h-screen bg-[#F9F8F6] text-stone-900">
      {/* ================================================================
          Hero — L'Atelier
          ================================================================ */}
      <section className="relative overflow-hidden border-b border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 lg:py-40 text-center">
          <span className="inline-block text-[10px] uppercase tracking-[0.3em] text-amber-700/90 font-sans mb-6">
            Notre Maison
          </span>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold leading-[1] tracking-tight text-stone-900 mb-8">
            L'Atelier
          </h1>
          <p className="text-lg md:text-xl text-stone-600 leading-relaxed max-w-3xl mx-auto mb-12">
            Là où le fil rencontre l'intention. Chaque création naît dans le
            silence de nos ateliers, entre Paris et Abomey-Calavi, portée par
            des mains qui transmettent l'excellence depuis des générations.
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
              href="#piliers"
              className="inline-flex items-center gap-2 rounded-none border border-stone-300 bg-transparent py-4 px-8 text-sm font-sans uppercase tracking-[0.1em] text-stone-900 hover:border-stone-900 hover:bg-stone-100 transition-colors"
            >
              Découvrir le savoir-faire
            </Link>
          </div>
        </div>
      </section>

      {/* ================================================================
          Histoire & Philosophie
          ================================================================ */}
      <section id="histoire" className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div>
              <span className="block text-[10px] uppercase tracking-[0.3em] text-amber-700/90 font-sans mb-4">
                Notre Histoire
              </span>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight text-stone-900 mb-8">
                Une exigence<br />transmise
              </h2>
              <div className="space-y-6 text-lg text-stone-600 leading-relaxed">
                <p>
                  Fondée par <strong className="font-semibold text-stone-900">Amélie Degbey</strong>,
                  OXBride Atelier puise ses racines dans le métissage culturel
                  entre la France et le Bénin. Fille d'artisan tailleur, elle
                  grandit au rythme du bruit des machines à coudre et de l'odeur
                  du tissu frais.
                </p>
                <p>
                  Après des études de modélisme à Paris et plusieurs années
                  auprès de grandes maisons de couture, elle décide de créer
                  sa propre maison. Une maison où chaque mariée, chaque marié,
                  trouverait non pas une robe ou un costume, mais{' '}
                  <em className="font-serif not-italic">sa</em> silhouette —
                  celle qui révèle qui elle ou il est vraiment.
                </p>
                <p className="font-serif text-xl font-medium text-stone-900 italic">
                  « Le luxe n'est pas dans l'ostentation, mais dans la justesse
                  du geste. »
                </p>
                <p className="text-sm text-stone-500 uppercase tracking-[0.15em] font-sans">
                  — Amélie Degbey, Fondatrice
                </p>
              </div>
            </div>

            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-stone-200/80 bg-stone-100/40">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-serif text-6xl text-stone-300/60 select-none" aria-hidden="true">
                  AD
                </span>
              </div>
            </div>
          </div>

          {/* Dialogue Paris ↔ Bénin */}
          <div className="mt-20 lg:mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 items-center">
            <div className="text-center md:text-right">
              <span className="text-[10px] uppercase tracking-[0.3em] text-amber-700/90 font-sans block mb-2">
                Paris
              </span>
              <h3 className="font-serif text-2xl font-bold text-stone-900 mb-2">
                L'inspiration
              </h3>
              <p className="text-stone-600 leading-relaxed">
                Haute couture, architecture parisienne, savoir-faire lyonnais.
                La ville lumière nourrit l'exigence esthétique.
              </p>
            </div>

            <div className="flex items-center justify-center">
              <div className="relative w-16 h-px bg-stone-300">
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full border border-stone-400 bg-[#F9F8F6]" />
              </div>
            </div>

            <div className="text-center md:text-left">
              <span className="text-[10px] uppercase tracking-[0.3em] text-amber-700/90 font-sans block mb-2">
                Abomey-Calavi
              </span>
              <h3 className="font-serif text-2xl font-bold text-stone-900 mb-2">
                Le geste
              </h3>
              <p className="text-stone-600 leading-relaxed">
                Savoir-faire artisanal, transmission orale, rythme humain.
                L'atelier béninois incarne la main et la patience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          Les 4 Piliers du Savoir-Faire
          ================================================================ */}
      <section
        id="piliers"
        className="bg-stone-900 text-stone-100 py-20 lg:py-32"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24">
            <span className="inline-block text-[10px] uppercase tracking-[0.3em] text-[#D9C7B8]/80 font-sans mb-4">
              Savoir-Faire
            </span>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight">
              L'excellence<br />en quatre gestes
            </h2>
            <p className="mt-6 text-stone-400 text-lg leading-relaxed">
              De l'idée à la pièce finie, chaque étape est orchestrée avec
              la même exigence. Aucun raccourci, aucune compromission.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {piliers.map((pilier) => (
              <article
                key={pilier.number}
                className="group relative p-8 bg-stone-950/50 rounded-2xl border border-stone-800/60 hover:border-[#D9C7B8]/30 transition-all duration-500"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                <div className="relative z-10 space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-2xl font-bold text-[#D9C7B8]/40 group-hover:text-[#D9C7B8] transition-colors">
                      {pilier.number}
                    </span>
                    <pilier.icon
                      className="w-5 h-5 shrink-0 text-[#D9C7B8]/60 group-hover:text-[#D9C7B8] transition-colors"
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-stone-100">
                    {pilier.title}
                  </h3>
                  <p className="text-sm text-stone-400 leading-relaxed">
                    {pilier.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          Matières d'Exception
          ================================================================ */}
      <section id="matieres" className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24">
            <span className="inline-block text-[10px] uppercase tracking-[0.3em] text-amber-700/90 font-sans mb-4">
              Matières
            </span>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight text-stone-900 mb-6">
              L'âme du tissu
            </h2>
            <p className="text-lg text-stone-600 leading-relaxed">
              Chaque matière est sélectionnée pour sa tenue, son tombé, sa lumière.
              Nous travaillons en circuit court avec des fournisseurs d'exception.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {matieres.map((matiere) => (
              <article
                key={matiere.name}
                className="group relative rounded-2xl border border-stone-200/80 bg-white/60 p-8 hover:border-amber-300/50 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all duration-500"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-stone-900">
                      {matiere.name}
                    </h3>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-amber-700/90 font-sans mt-1">
                      {matiere.origin}
                    </p>
                  </div>
                  <span className="shrink-0 text-[10px] uppercase tracking-[0.1em] font-sans px-2 py-1 rounded-full bg-stone-100 text-stone-600 group-hover:bg-amber-50 group-hover:text-amber-700 transition-colors">
                    {matiere.tag}
                  </span>
                </div>
                <p className="text-sm text-stone-600 leading-relaxed">
                  {matiere.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          Les Deux Lieux & Appel à l'Action
          ================================================================ */}
      <section className="bg-stone-100/50 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24">
            <span className="inline-block text-[10px] uppercase tracking-[0.3em] text-amber-700/90 font-sans mb-4">
              Nos Lieux
            </span>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight text-stone-900 mb-6">
              Deux ateliers,<br />une même exigence
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {lieux.map((lieu) => (
              <article
                key={lieu.city}
                className="relative rounded-3xl overflow-hidden border border-stone-200/80 bg-white/60 p-8 lg:p-10"
              >
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-4 h-4 shrink-0 text-amber-700" aria-hidden="true" />
                  <span className="text-[10px] uppercase tracking-[0.2em] text-amber-700/90 font-sans">
                    {lieu.city}
                  </span>
                </div>
                <h3 className="font-serif text-2xl lg:text-3xl font-bold text-stone-900 mb-2">
                  {lieu.role}
                </h3>
                <p className="text-sm text-stone-600 leading-relaxed mb-6">
                  {lieu.description}
                </p>
                <address className="not-italic text-sm text-stone-600 space-y-1 mb-6">
                  <p>{lieu.address}</p>
                  <p className="text-xs uppercase tracking-[0.1em] font-sans text-stone-500">
                    {lieu.hours}
                  </p>
                </address>
                <Link
                  href={lieu.href}
                  className="inline-flex items-center gap-2 text-sm font-sans uppercase tracking-[0.1em] text-stone-900 hover:text-amber-700 transition-colors"
                >
                  {lieu.cta}
                  <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                </Link>
              </article>
            ))}
          </div>

          {/* CTA Final */}
          <div className="mt-16 lg:mt-24 text-center">
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
                href="/collections"
                className="inline-flex items-center gap-2 rounded-none border border-stone-300 bg-transparent py-4 px-8 text-sm font-sans uppercase tracking-[0.1em] text-stone-900 hover:border-stone-900 hover:bg-stone-100 transition-colors"
              >
                Voir les collections
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}