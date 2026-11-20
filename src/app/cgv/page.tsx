/** @file
 * OXBride Atelier — Conditions Générales de Vente.
 * Route : /cgv
 */

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function CgvPage() {
  return (
    <main className="min-h-screen bg-[#F9F8F6] text-stone-900">
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <span className="text-[10px] uppercase tracking-[0.3em] text-amber-700/90 font-sans mb-6">
          Conditions générales
        </span>
        <h1 className="font-serif text-4xl md:text-5xl font-bold leading-[1.1] tracking-tight text-stone-900 mb-8">
          Conditions Générales de Vente
        </h1>

        <div className="space-y-6 text-stone-600 leading-relaxed">
          <p>
            Les présentes conditions générales de vente régissent les
            relations contractuelles entre OXBride Atelier et ses clients pour
            l'achat de produits et de services sur-mesure.
          </p>
          <div>
            <h2 className="font-serif text-xl font-bold text-stone-900 mb-2">
              Article 1 — Objet
            </h2>
            <p>
              Les présentes CGV définissent les droits et obligations des
              parties dans le cadre de la vente en ligne et des prestations
              sur-mesure proposées par la Maison OXBride Atelier.
            </p>
          </div>
          <div>
            <h2 className="font-serif text-xl font-bold text-stone-900 mb-2">
              Article 2 — Prix et paiement
            </h2>
            <p>
              Les prix sont indiqués en euros (EUR), toutes taxes comprises.
              Le paiement est exigible à la commande. Les pièces sur-mesure
              nécessitent un acompte de 50% à la commande, le solde étant
              réglé à la livraison.
            </p>
          </div>
          <div>
            <h2 className="font-serif text-xl font-bold text-stone-900 mb-2">
              Article 3 — Délais de livraison
            </h2>
            <p>
              Les délais de livraison sont indiqués au moment de la commande
              et dépendent de la complexité de la création. Toute pièce
              sur-mesure est fabriquée à la demande et ne peut être ni reprise
              ni échangée, conformément à l'article L221-28 du Code de la
              consommation.
            </p>
          </div>
          <div>
            <h2 className="font-serif text-xl font-bold text-stone-900 mb-2">
              Article 4 — Retours et remboursements
            </h2>
            <p>
              Conformément à la réglementation en vigueur, les produits
              personnalisés et sur-mesure ne bénéficient pas du droit de
              rétractation. Les pièces de collection peuvent être retournées
              dans un délai de 14 jours, dans leur état d'origine.
            </p>
          </div>
          <div>
            <h2 className="font-serif text-xl font-bold text-stone-900 mb-2">
              Article 5 — Garanties
            </h2>
            <p>
              Nos produits bénéficient de la garantie légale de conformité et
              de la garantie contre les vices cachés. Les retouches sur-mesure
              sont offertes pendant un an après livraison.
            </p>
          </div>
          <div>
            <h2 className="font-serif text-xl font-bold text-stone-900 mb-2">
              Article 6 — Médiation
            </h2>
            <p>
              En cas de litige, une solution amiable sera recherchée avant
              toute action judiciaire. Le client peut recourir gratuitement au
              médiateur de la consommation compétent.
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