/** @file
 * OXBride Atelier — Pied de page global (Neo-Luxe).
 * Fond sombre (`#1A1D24`) avec accents sable/or rosé (`#D9C7B8`) et champagne
 * poudré (`#EBE5DF`). 3 colonnes : identité + newsletter, collections, maison &
 * salons. Barre inférieure : réseaux sociaux, mentions légales, année dynamique,
 * retour en haut.
 *
 * Règle stricte : **toutes les icônes SVG doivent avoir une taille fixe**
 * (`w-4 h-4` ou `w-5 h-5`).
 */

'use client';

import Link from 'next/link';
import { useState, useEffect, type FormEvent } from 'react';
import {
  Mail,
  MapPin,
  Phone,
  Clock,
  ArrowUp,
  Globe,
  MessageSquare,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Données                                                            */
/* ------------------------------------------------------------------ */

const collections = [
  { label: 'Toutes les collections', href: '/collections' },
  { label: 'Robes de Mariée — Classique Royale', href: '/collections/robes-de-mariee-royale' },
  { label: 'Robes de Mariée — Silhouette Sirène & Dentelle', href: '/collections/robes-de-mariee-sirene' },
  { label: 'Smokings d\'Exception', href: '/collections/smokings-exception' },
  { label: 'Costumes — Tailoring Moderne', href: '/collections/costumes-tailoring-moderne' },
  { label: 'Alliances & Joaillerie', href: '/collections/alliances-joaillerie' },
];

const maisonLinks = [
  { label: 'L\'Atelier', href: '/latelier' },
  { label: 'Rendez-vous & Salons Privés', href: '/rendez-vous' },
  { label: 'Savoir-Faire', href: '/latelier#savoir-faire' },
  { label: 'Matières d\'Exception', href: '/latelier#matieres' },
];

const salons = [
  {
    city: 'Paris',
    address: 'Place Vendôme, 75001 Paris',
    phone: '+33 1 42 60 00 00',
    hours: 'Mardi – Samedi, 10h – 19h',
  },
  {
    city: 'Bénin',
    address: 'Quartier Akassato, Abomey-Calavi',
    phone: '+229 XX XX XX XX',
    hours: 'Mardi – Samedi, 9h – 18h',
  },
];

const socialLinks = [
  { icon: Globe, href: 'https://instagram.com/oxbrideatelier', label: 'Instagram' },
  { icon: MessageSquare, href: 'https://facebook.com/oxbrideatelier', label: 'Facebook' },
  { icon: Globe, href: 'https://pinterest.com/oxbrideatelier', label: 'Pinterest' },
  { icon: Globe, href: 'https://oxbride-atelier.com', label: 'Site web' },
];

const legalLinks = [
  { label: 'Mentions légales', href: '/mentions-legales' },
  { label: 'Politique de confidentialité', href: '/politique-confidentialite' },
  { label: 'CGV', href: '/cgv' },
  { label: 'Accessibilité', href: '/accessibilite' },
];

/* ------------------------------------------------------------------ */
/*  Composant                                                          */
/* ------------------------------------------------------------------ */

export default function Footer() {
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  const handleNewsletterSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newsletterEmail.trim()) return;

    setNewsletterStatus('loading');

    // Simulation d'appel API (à remplacer par un vrai endpoint)
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setNewsletterStatus('success');
      setNewsletterEmail('');
      // Reset après 5s
      setTimeout(() => setNewsletterStatus('idle'), 5000);
    } catch {
      setNewsletterStatus('error');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#1A1D24] text-[#EBE5DF]" role="contentinfo">
      {/* ================================================================
          Section principale — 3 colonnes
          ================================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
          {/* ---------- Colonne 1 : Identité & Newsletter ---------- */}
          <div className="space-y-8">
            <div>
              <h2 className="font-serif text-2xl lg:text-3xl font-bold text-[#EBE5DF] mb-4">
                OXBride Atelier
              </h2>
              <p className="text-sm leading-relaxed text-[#EBE5DF]/70 max-w-sm">
                Maison de haute couture nuptiale fondée sur l'exigence du geste
                parfait. Chaque pièce est une œuvre unique, née du dialogue entre
                la matière et l'intention.
              </p>
            </div>

            {/* Newsletter */}
            <div className="border-t border-[#D9C7B8]/20 pt-8">
              <h3 className="font-serif text-lg font-medium text-[#EBE5DF] mb-3">
                Lettre de l'Atelier
              </h3>
              <p className="text-xs leading-relaxed text-[#EBE5DF]/60 mb-4 max-w-xs">
                Inspirations, coulisses d'atelier et avant-premières collections.
                Une lettre par mois, jamais plus.
              </p>

              {newsletterStatus === 'success' ? (
                <div
                  className="flex items-center gap-2 text-sm text-[#D9C7B8]"
                  role="status"
                  aria-live="polite"
                >
                  <MessageSquare className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>Merci ! Votre inscription est confirmée.</span>
                </div>
              ) : (
                <form
                  onSubmit={handleNewsletterSubmit}
                  className="flex flex-col sm:flex-row gap-2 max-w-xs"
                  action="#"
                  method="POST"
                >
                  <label htmlFor="footer-newsletter-email" className="sr-only">
                    Votre adresse e-mail
                  </label>
                  <input
                    id="footer-newsletter-email"
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="votre@email.com"
                    required
                    disabled={newsletterStatus === 'loading'}
                    className="flex-1 rounded-none border border-[#D9C7B8]/30 bg-transparent py-3 px-4 text-sm text-[#EBE5DF] placeholder:text-[#EBE5DF]/40 focus:border-[#D9C7B8] focus:outline-none transition-colors disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={newsletterStatus === 'loading'}
                    className="whitespace-nowrap rounded-none border border-[#D9C7B8]/30 bg-transparent py-3 px-6 text-xs font-sans uppercase tracking-[0.15em] text-[#D9C7B8] hover:border-[#D9C7B8] hover:bg-[#D9C7B8]/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {newsletterStatus === 'loading' ? '...' : 'S\'inscrire'}
                  </button>
                </form>
              )}

              {newsletterStatus === 'error' && (
                <p className="mt-2 text-xs text-red-400" role="alert">
                  Une erreur est survenue. Veuillez réessayer.
                </p>
              )}

              <p className="mt-3 text-[10px] text-[#EBE5DF]/40 font-sans">
                En vous inscrivant, vous acceptez notre{' '}
                <Link
                  href="/mentions-legales"
                  className="underline hover:text-[#D9C7B8] transition-colors"
                >
                  politique de confidentialité
                </Link>
                .
              </p>
            </div>
          </div>

          {/* ---------- Colonne 2 : Collections ---------- */}
          <nav aria-label="Collections">
            <h2 className="font-serif text-lg font-medium text-[#EBE5DF] mb-5">
              Collections
            </h2>
            <ul className="space-y-3" role="list">
              {collections.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group flex items-center gap-2 text-sm text-[#EBE5DF]/70 hover:text-[#D9C7B8] transition-colors"
                  >
                    <span
                      className="h-px w-4 shrink-0 bg-[#D9C7B8]/30 group-hover:bg-[#D9C7B8] transition-colors"
                      aria-hidden="true"
                    />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* ---------- Colonne 3 : La Maison & Salons ---------- */}
          <div className="space-y-8">
            <nav aria-label="La Maison">
              <h2 className="font-serif text-lg font-medium text-[#EBE5DF] mb-5">
                La Maison
              </h2>
              <ul className="space-y-3" role="list">
                {maisonLinks.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="group flex items-center gap-2 text-sm text-[#EBE5DF]/70 hover:text-[#D9C7B8] transition-colors"
                    >
                      <span
                        className="h-px w-4 shrink-0 bg-[#D9C7B8]/30 group-hover:bg-[#D9C7B8] transition-colors"
                        aria-hidden="true"
                      />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Salons / Coordonnées */}
            <div className="border-t border-[#D9C7B8]/20 pt-8">
              <h3 className="font-serif text-lg font-medium text-[#EBE5DF] mb-5">
                Salons & Ateliers
              </h3>
              <div className="space-y-6">
                {salons.map((salon) => (
                  <div key={salon.city} className="space-y-2">
                    <h4 className="text-xs uppercase tracking-[0.2em] font-sans text-[#D9C7B8]/80">
                      {salon.city}
                    </h4>
                    <address className="not-italic text-xs text-[#EBE5DF]/60 space-y-1 leading-relaxed">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-3 h-3 mt-0.5 shrink-0 text-[#D9C7B8]/60" aria-hidden="true" />
                        <span>{salon.address}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Phone className="w-3 h-3 mt-0.5 shrink-0 text-[#D9C7B8]/60" aria-hidden="true" />
                        <a
                          href={`tel:${salon.phone.replace(/\s/g, '')}`}
                          className="hover:text-[#D9C7B8] transition-colors"
                        >
                          {salon.phone}
                        </a>
                      </div>
                      <div className="flex items-start gap-2">
                        <Clock className="w-3 h-3 mt-0.5 shrink-0 text-[#D9C7B8]/60" aria-hidden="true" />
                        <span>{salon.hours}</span>
                      </div>
                    </address>
                  </div>
                ))}
              </div>
              <Link
                href="/rendez-vous"
                className="mt-6 inline-flex items-center gap-2 text-xs font-sans uppercase tracking-[0.15em] text-[#D9C7B8] hover:text-[#EBE5DF] transition-colors"
              >
                <Mail className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>Prendre rendez-vous</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          Barre inférieure
          ================================================================ */}
      <div className="border-t border-[#D9C7B8]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Copyright + mentions */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <p className="text-xs text-[#EBE5DF]/50 font-sans">
                © {currentYear} OXBride Atelier. Tous droits réservés.
              </p>
              <span className="hidden sm:block text-[#D9C7B8]/30" aria-hidden="true">
                ·
              </span>
              <nav aria-label="Mentions légales">
                <ul className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  {legalLinks.map((link, i) => (
                    <li key={link.href} className="flex items-center gap-3">
                      <Link
                        href={link.href}
                        className="text-xs text-[#EBE5DF]/50 hover:text-[#D9C7B8] transition-colors"
                      >
                        {link.label}
                      </Link>
                      {i < legalLinks.length - 1 && (
                        <span className="text-[#D9C7B8]/20" aria-hidden="true">
                          ·
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* Réseaux sociaux + retour en haut */}
            <div className="flex items-center justify-between md:justify-end gap-6">
              <ul className="flex items-center gap-4" role="list" aria-label="Réseaux sociaux">
                {socialLinks.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-[#D9C7B8]/30 text-[#EBE5DF]/60 hover:border-[#D9C7B8] hover:text-[#D9C7B8] transition-colors"
                    >
                      <social.icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={scrollToTop}
                aria-label="Retour en haut de page"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[#D9C7B8]/30 text-[#EBE5DF]/60 hover:border-[#D9C7B8] hover:text-[#D9C7B8] transition-colors"
              >
                <ArrowUp className="w-4 h-4 shrink-0" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}