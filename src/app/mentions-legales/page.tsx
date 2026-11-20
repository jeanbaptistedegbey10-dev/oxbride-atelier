/** @file
 * OXBride Atelier — Mentions légales.
 * Route : /mentions-legales
 */

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function MentionsLegalesPage() {
  return (
    <main className="min-h-screen bg-[#F9F8F6] text-stone-900">
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <span className="text-[10px] uppercase tracking-[0.3em] text-amber-700/90 font-sans mb-6">
          Informations légales
        </span>
        <h1 className="font-serif text-4xl md:text-5xl font-bold leading-[1.1] tracking-tight text-stone-900 mb-8">
          Mentions légales
        </h1>

        <div className="space-y-6 text-stone-600 leading-relaxed">
          <p>
            Conformément aux dispositions des articles 6-III et 19 de la Loi
            pour la Confiance dans l'Économie Numérique, ainsi qu'aux articles
            L.221-5 et suivants du Code de la consommation, les présentes
            mentions légales détaillent les informations relatives à l'éditeur
            du site.
          </p>
          <div>
            <h2 className="font-serif text-xl font-bold text-stone-900 mb-2">
              Éditeur du site
            </h2>
            <p>
              OXBride Atelier — Maison de haute couture nuptiale.
              <br />
              Siège social : Place Vendôme, 75001 Paris, France.
              <br />
              Atelier : Quartier Akassato, Abomey-Calavi, Bénin.
              <br />
              Contact : bonjour@oxbrideatelier.com
            </p>
          </div>
          <div>
            <h2 className="font-serif text-xl font-bold text-stone-900 mb-2">
              Directeur de la publication
            </h2>
            <p>
              La direction de la publication est assurée par la Maison OXBride
              Atelier.
            </p>
          </div>
          <div>
            <h2 className="font-serif text-xl font-bold text-stone-900 mb-2">
              Hébergement
              </h2>
            <p>
              Le site est hébergé par un prestataire professionnel. Les
              coordonnées de l'hébergeur sont disponibles sur simple demande
              auprès de bonjour@oxbrideatelier.com.
            </p>
          </div>
          <div>
            <h2 className="font-serif text-xl font-bold text-stone-900 mb-2">
              Propriété intellectuelle
            </h2>
            <p>
              L'ensemble des contenus (textes, images, logos, créations
              graphiques et modèles) présents sur ce site sont protégés par le
              droit de la propriété intellectuelle. Toute reproduction, même
              partielle, est interdite sans autorisation écrite préalable.
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