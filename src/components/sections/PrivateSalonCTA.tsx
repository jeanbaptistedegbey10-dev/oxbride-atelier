/**
 * OXBride Atelier — Section 4 : L’Expérience Sur-Mesure & Salon Privé
 *
 * - CTA immersif pleine largeur : réservation d’un salon privé / consultation sur-mesure
 *   (Paris · Place Vendôme et Abomey-Calavi · Bénin).
 * - Récupère ses données depuis le méta-objet Shopify `private_salon_experience`
 *   avec fallbacks textuels élégants si le méta-objet n’est pas encore publié.
 * - Fond champagne poudré avec touches florales néo-luxe (pétales de roses poudrées en coins).
 * - Typographie aérée, espacement généreux, harmonie avec les sections du dessus.
 * - overflow-x-hidden.
 */

'use client';

import { motion } from 'framer-motion';
import React from 'react';
import { Calendar, MapPin, Smartphone } from 'lucide-react';
import { getPrivateSalonExperience } from '@/lib/shopify/queries';
import type { PrivateSalonExperienceData } from '@/types/shopify';
import { PRIVATE_SALON_FALLBACK } from '@/types/shopify';

interface PrivateSalonCTAProps {
  className?: string;
}

/** Squelette élégant affiché tant que les données Shopify ne sont pas résolues.
 * Aucun contenu statique n'est affiché avant le résultat final : pas de flash au chargement. */
function SalonSkeleton() {
  const pulse = {
    initial: { opacity: 0.4 },
    animate: { opacity: [0.4, 0.75, 0.4] },
    transition: { duration: 1.6, repeat: Infinity, ease: 'easeInOut' } as const,
  };

  const line = (className: string) => (
    <motion.div {...pulse} className={`bg-stone-200/50 rounded-full h-4 ${className}`} aria-hidden="true" />
  );

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
      <div className="text-center">
        <div className="mb-8">{line('w-32 mx-auto')}</div>

        <div className="mx-auto max-w-3xl">
          {line('w-full mb-4')}
          {line('w-3/4 mb-6')}
          {line('w-full lg:w-3/4 mb-16')}
        </div>

        <div className="mt-16 lg:mt-20 grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start max-w-4xl mx-auto">
          {[0, 1, 2].map((i) => (
            <motion.div key={i} {...pulse} className="p-8 lg:p-10 rounded-lg bg-stone-100/60 border border-stone-200/60">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-6 h-6 bg-stone-200/60 rounded-full flex-shrink-0" aria-hidden="true" />
                <div>
                  {line('w-24 mb-2')}
                  {line('w-full h-5 mb-1')}
                  {line('w-3/4 h-4')}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 lg:mt-24 flex flex-col sm:flex-row gap-6 justify-center items-center">
          {[0, 1].map((i) => (
            <a
              key={i}
              href="#"
              className="px-8 py-4 bg-stone-200/40 rounded-none flex items-center justify-center gap-2"
              aria-disabled="true"
              tabIndex={-1}
            >
              {line('w-48')}
              {line('w-1/3 mt-2')}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function PrivateSalonCTA({ className }: PrivateSalonCTAProps) {
  const [data, setData] = React.useState<PrivateSalonExperienceData | null>(null);

  React.useEffect(() => {
    let mounted = true;
    getPrivateSalonExperience({ cache: 'no-store' }).then((result) => {
      if (mounted) {
        setData(result ?? PRIVATE_SALON_FALLBACK);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const isSkeleton = data === null;
  const content: PrivateSalonExperienceData = { ...PRIVATE_SALON_FALLBACK, ...(data ?? {}) };

  const animate = {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, ease: 'easeOut' } as const,
  };

  return (
    <section
      className={`relative bg-[#F9F8F6] text-stone-900 overflow-hidden py-20 md:py-28 px-4 sm:px-6 lg:px-8 ${className ?? ''}`}
      aria-labelledby="salon-prive-title"
    >
      <div className="absolute top-[-80px] left-[-80px] w-[300px] h-[300px] bg-rose-100/40 rounded-full blur-[60px] pointer-events-none -z-10" aria-hidden="true" />
      <div className="absolute top-[-60px] right-[-60px] w-[260px] h-[260px] bg-rose-50/30 rounded-full blur-[50px] pointer-events-none -z-10" aria-hidden="true" />
      <div className="absolute bottom-[-60px] right-[-80px] w-[320px] h-[320px] bg-rose-100/35 rounded-full blur-[60px] pointer-events-none -z-10" aria-hidden="true" />
      <div className="absolute bottom-[-40px] left-[-40px] w-[200px] h-[200px] bg-amber-50/20 rounded-full blur-[40px] pointer-events-none -z-10" aria-hidden="true" />
      <div className="absolute inset-0 -z-10 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 left-1/10 w-[60px] h-[60px] bg-rose-200/10 rounded-full rotate-45 blur-sm" />
        <div className="absolute top-1/3 right-1/8 w-[40px] h-[40px] bg-rose-100/15 rounded-full rotate-90 blur-xs" />
        <div className="absolute bottom-1/4 left-1/5 w-[50px] h-[50px] bg-amber-100/10 rounded-full rotate-180 blur-sm" />
        <div className="absolute bottom-1/3 right-1/6 w-[70px] h-[70px] bg-rose-50/20 rounded-full rotate-270 blur-xs" />
        {/* Filigranes de pétales de roses — touches néo-luxe délicates */}
        <div className="absolute top-1/5 left-1/6 w-[30px] h-[18px] bg-rose-300/15 rounded-full rotate-30 blur-xs" />
        <div className="absolute top-2/5 right-1/7 w-[22px] h-[34px] bg-rose-200/10 rounded-full rotate-150 blur-xs" />
        <div className="absolute bottom-2/5 left-1/5 w-[26px] h-[26px] bg-amber-200/10 rounded-full rotate-210 blur-xs" />
        <div className="absolute bottom-1/6 right-1/5 w-[34px] h-[20px] bg-rose-100/12 rounded-full rotate-300 blur-xs" />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {isSkeleton ? <SalonSkeleton /> : (
            <>
              <motion.div {...animate} transition={{ ...animate.transition, delay: 0 }}>
                <span
                  className="inline-block text-[10px] uppercase tracking-[0.2em] text-stone-500 border-b border-stone-500/20 pb-1 mb-6"
                >
                  {content.sousTitre}
                </span>
              </motion.div>

          <motion.h2
            {...animate}
            transition={{ ...animate.transition, delay: 0.1 }}
            id="salon-prive-title"
            className="font-serif text-3xl md:text-4xl text-stone-900 tracking-tight leading-[1.05] mb-8"
          >
            {content.titre}
          </motion.h2>

          <motion.p
            {...animate}
            transition={{ ...animate.transition, delay: 0.2 }}
            className="text-stone-600 text-sm lg:text-base leading-relaxed max-w-2xl mx-auto mb-16"
          >
            {content.description}
          </motion.p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
            <motion.div
              {...animate}
              transition={{ ...animate.transition, delay: 0.3 }}
              className="p-6 sm:p-8 rounded-lg bg-white/80 backdrop-blur-sm border border-stone-200/70 shadow-[0_4px_20px_rgba(0,0,0,0.02)]"
            >
              <div className="flex items-start gap-4 mb-6">
                <MapPin className="w-6 h-6 text-amber-700 flex-shrink-0 mt-[2px]" aria-hidden="true" />
                <div>
                  <span className="block text-[10px] uppercase tracking-[0.2em] text-stone-500 font-medium">
                    {content.parisAdresse}
                  </span>
                  <p className="text-sm text-stone-600 leading-relaxed mt-1">{content.parisDetail}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              {...animate}
              transition={{ ...animate.transition, delay: 0.4 }}
              className="p-6 sm:p-8 rounded-lg bg-white/80 backdrop-blur-sm border border-stone-200/70 shadow-[0_4px_20px_rgba(0,0,0,0.02)]"
            >
              <div className="flex items-start gap-4 mb-6">
                <MapPin className="w-6 h-6 text-amber-700 flex-shrink-0 mt-[2px]" aria-hidden="true" />
                <div>
                  <span className="block text-[10px] uppercase tracking-[0.2em] text-stone-500 font-medium">
                    {content.beninAdresse}
                  </span>
                  <p className="text-sm text-stone-600 leading-relaxed mt-1">{content.beninDetail}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              {...animate}
              transition={{ ...animate.transition, delay: 0.5 }}
              className="p-6 sm:p-8 rounded-lg bg-white/80 backdrop-blur-sm border border-stone-200/70 shadow-[0_4px_20px_rgba(0,0,0,0.02)]"
            >
              <div className="flex items-start gap-4 mb-6">
                <Smartphone className="w-6 h-6 text-amber-700 flex-shrink-0 mt-[2px]" aria-hidden="true" />
                <div>
                  <span className="block text-[10px] uppercase tracking-[0.2em] text-stone-500 font-medium">
                    Contact & Réservation
                  </span>
                  <p className="text-sm text-stone-600 leading-relaxed mt-1">
                    {content.contactEmail} · {content.contactPhone}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            {...animate}
            transition={{ ...animate.transition, delay: 0.6 }}
            className="mt-8 lg:mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <a
              href={content.reservationUrl}
              className="bg-stone-900 text-white hover:bg-stone-800 transition-all uppercase text-xs tracking-[0.2em] py-4 px-8 rounded-none shadow-sm flex items-center justify-center gap-2"
            >
              {content.reservationLabel} <Calendar size={18} className="text-stone-100" aria-hidden="true" />
            </a>
            <a
              href={`mailto:${content.contactEmail}`}
              className="border border-stone-200/80 text-stone-600 hover:bg-stone-50 transition-all uppercase text-xs tracking-[0.2em] py-4 px-8 rounded-none flex items-center justify-center gap-2"
            >
              {content.contactLabel} <Smartphone size={18} aria-hidden="true" />
            </a>
          </motion.div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}