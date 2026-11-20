/** @file
 * OXBride Atelier — Accessibilité.
 * Route : /accessibilite
 */

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function AccessibilitePage() {
  return (
    <main className="min-h-screen bg-[#F9F8F6] text-stone-900">
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <span className="text-[10px] uppercase tracking-[0.3em] text-amber-700/90 font-sans mb-6">
          Accessibilité
        </span>
        <h1 className="font-serif text-4xl md:text-5xl font-bold leading-[1.1] tracking-tight text-stone-900 mb-8">
          Accessibilité
        </h1>

        <div className="space-y-6 text-stone-600 leading-relaxed">
          <p>
            OXBride Atelier s'engage à rendre son site accessible au plus grand
            nombre, conformément aux recommandations WCAG 2.1 niveau AA.
          </p>
          <div>
            <h2 className="font-serif text-xl font-bold text-stone-900 mb-2">
              Nos engagements
            </h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Structure sémantique et navigation au clavier</li>
              <li>Contrastes de couleurs conformes aux normes d'accessibilité</li>
              <li>Textes alternatifs pour toutes les images</li>
              <li>Formulaires étiquetés et accessibles</li>
              <li>Respect de la préférence de mouvement réduit</li>
            </ul>
          </div>
          <div>
            <h2 className="font-serif text-xl font-bold text-stone-900 mb-2">
              Amélioration continue
            </h2>
            <p>
              Nous travaillons continuellement à améliorer l'accessibilité de
              notre site. Si vous rencontrez des difficultés, n'hésitez pas à
              nous contacter.
            </p>
          </div>
          <div>
            <h2 className="font-serif text-xl font-bold text-stone-900 mb-2">
              Contact
            </h2>
            <p>
              Pour toute question ou suggestion concernant l'accessibilité,
              écrivez-nous à bonjour@oxbrideatelier.com.
            </p>
          </div>
        </div>

        <div className="mt-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-stone-900 hover:text-amber-700 transition-colors font-sans text-sm tracking-widest uppercase"
          >
            Retour à l'accueil <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}