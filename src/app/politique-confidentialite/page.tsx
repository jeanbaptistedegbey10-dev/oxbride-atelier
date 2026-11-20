/** @file
 * OXBride Atelier — Politique de confidentialité.
 * Route : /politique-confidentialite
 */

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function PolitiqueConfidentialitePage() {
  return (
    <main className="min-h-screen bg-[#F9F8F6] text-stone-900">
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <span className="text-[10px] uppercase tracking-[0.3em] text-amber-700/90 font-sans mb-6">
          Données personnelles
        </span>
        <h1 className="font-serif text-4xl md:text-5xl font-bold leading-[1.1] tracking-tight text-stone-900 mb-8">
          Politique de confidentialité
        </h1>

        <div className="space-y-6 text-stone-600 leading-relaxed">
          <p>
            OXBride Atelier accorde une attention particulière à la protection
            de vos données personnelles. La présente politique décrit les
            données que nous collectons, les raisons de cette collecte et vos
            droits.
          </p>
          <div>
            <h2 className="font-serif text-xl font-bold text-stone-900 mb-2">
              Données collectées
            </h2>
            <p>
              Nous collectons uniquement les informations nécessaires au
              traitement de vos demandes : nom, adresse e-mail, numéro de
              téléphone, préférences de rendez-vous. Aucune donnée sensible
              n'est collectée à votre insu.
            </p>
          </div>
          <div>
            <h2 className="font-serif text-xl font-bold text-stone-900 mb-2">
              Finalités
            </h2>
            <p>
              Vos données sont utilisées pour gérer vos rendez-vous, traiter vos
              commandes et vous envoyer notre lettre d'information, uniquement
              avec votre consentement.
            </p>
          </div>
          <div>
            <h2 className="font-serif text-xl font-bold text-stone-900 mb-2">
              Vos droits
            </h2>
            <p>
              Conformément au RGPD, vous disposez d'un droit d'accès, de
              rectification, d'effacement et d'opposition. Pour exercer ces
              droits, écrivez-nous à bonjour@oxbrideatelier.com.
            </p>
          </div>
          <div>
            <h2 className="font-serif text-xl font-bold text-stone-900 mb-2">
              Cookies
            </h2>
            <p>
              Ce site utilise des cookies techniques strictement nécessaires au
              fonctionnement de la boutique. Aucun cookie publicitaire n'est
              déposé sans votre consentement explicite.
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