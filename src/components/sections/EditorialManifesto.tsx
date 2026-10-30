/**
 * OXBride Atelier — Section 2 : Édito & Manifeste de la Maison
 *
 * - Récupère le méta-objet `editorial_manifeste` via la Storefront API.
 * - Fallback statique élégant si le shop est indisponible ou sans donnée.
 * - Mise en page asymétrique 2 colonnes sur grand écran (texte à gauche, visuel atelier à droite).
 * - Esthétique néo-luxe : fond champagne poudré (bg-[#F9F6F0]), textes text-stone-900,
 *   accents ambrés (text-amber-700/600), filigrane éditorial, police Cinzel / serif.
 */

'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import React from 'react';
import { getEditorialManifesto } from '@/lib/shopify/queries';
import type { EditorialManifestoData } from '@/types/shopify';

/** Données statiques de repli — la page ne doit jamais être cassée. */
const EDITORIAL_FALLBACK: EditorialManifestoData = {
  sousTitre: 'Maison de haute couture · Paris',
  titre: "L'Édito de la Maison",
  citation:
    'Chaque silhouette naît d’un fil de soie, d’une main patiente et d’un rêve cousu d’obstination. Ici, le temps s’ignore : seul compte l’absolu du geste.',
  signature: 'L’Atelier OXBride',
  // URL externe stable (Unsplash) — haute couture / atelier de couture.
  // Évite toute erreur 404 si le fichier local est absent.
  visuelUrl:
    'https://images.unsplash.com/photo-1580388739837-d22902a6a19e?w=1200&q=80&fm=jpg',
  visuelAlt: "Atelier de haute couture — soie et machines à coudre (fallback)",
};

interface EditorialManifestoProps {
  className?: string;
}

export default function EditorialManifesto({ className }: EditorialManifestoProps) {
  const [data, setData] = React.useState<EditorialManifestoData | null>(null);
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;
    getEditorialManifesto({ cache: 'no-store' }).then((result) => {
      if (mounted) {
        const finalData = result ?? EDITORIAL_FALLBACK;
        if (process.env.NODE_ENV === 'development') {
          console.log('[EditorialManifesto] Données affichées :', {
            source: result ? 'Shopify' : 'FALLBACK statique',
            visuelUrl: finalData.visuelUrl,
            visuelAlt: finalData.visuelAlt,
            titre: finalData.titre,
          });
        }
        setData(finalData);
        setIsLoaded(true);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const content = data ?? EDITORIAL_FALLBACK;

  const animate = {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, ease: 'easeOut' } as const,
  };

  return (
    <section
      className={`relative bg-[#F9F6F0] text-stone-900 overflow-x-hidden ${className ?? ''}`}
      aria-labelledby="editorial-manifesto-title"
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-36">
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-16 items-stretch">
          {/* ================= COLONNE GAUCHE : TEXTE ÉDITORIAL ================= */}
          <div className="flex flex-col h-full pr-6 lg:pr-0">
            <div className="flex-1 flex flex-col justify-end space-y-5 lg:space-y-10">
              <motion.div {...animate} transition={{ ...animate.transition, delay: 0 }}>
                <span
                  className="block text-[10px] lg:text-xs uppercase tracking-widest text-amber-700/90 font-cinzel font-medium leading-none"
                >
                  {content.sousTitre}
                </span>
              </motion.div>

              <motion.div {...animate} transition={{ ...animate.transition, delay: 0.15 }}>
                <h2
                  id="editorial-manifesto-title"
                  className="text-5xl lg:text-8xl font-serif font-bold text-stone-900 leading-[0.95] tracking-tight"
                >
                  {content.titre}
                </h2>
              </motion.div>

              <motion.div {...animate} transition={{ ...animate.transition, delay: 0.3 }}>
                <blockquote
                  className="text-xl lg:text-3xl font-serif italic text-stone-900/90 leading-relaxed border-l-3 border-amber-600 pl-8 my-0 relative"
                >
                  {content.citation}
                </blockquote>
              </motion.div>
            </div>

            <motion.div {...animate} transition={{ ...animate.transition, delay: 0.45 }}>
              <div className="mt-8 inline-block border-t border-amber-600/20 pt-2">
                <span className="block text-[11px] lg:text-xs uppercase tracking-widest text-amber-700/90 font-cinzel font-medium">
                  Atelier Privé · Place Vendôme
                </span>
              </div>
            </motion.div>
          </div>

          {/* ================= COLONNE DROITE : VISUEL ATELIER ================= */}
          <div className="relative w-full">
            {/* Halo de profondeur coloré derrière le cadre */}
            <div
              className="absolute inset-0 rounded-[2rem] bg-gradient-to-tr from-amber-200/40 via-rose-200/30 to-stone-300/20 blur-[20px] opacity-40 group-hover:opacity-70 transition-opacity duration-1000 -z-10"
              aria-hidden="true"
            />
            <motion.div
              {...animate}
              transition={{ ...animate.transition, delay: 0.6 }}
              className="relative rounded-[2rem] border border-stone-200/60 bg-white/70 backdrop-blur-sm overflow-hidden shadow-xl shadow-stone-300/40 group"
            >
              <div className="relative w-full aspect-[3/4] lg:aspect-[2/3]">
                <Image
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 100vw, 52vw"
                  quality={95}
                  priority
                  className="object-cover object-center transition-transform duration-1000 group-hover:scale-105"
                  alt={content.visuelAlt ?? "Visuel d'atelier — OXBride Atelier"}
                  src={
                    content.visuelUrl ??
                    'https://images.unsplash.com/photo-1580388739837-d22902a6a19e?w=1200&q=80&fm=jpg'
                  }
                />
              </div>

              {/* Ombre portée basse pour le relief */}
              <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-stone-800/15 to-transparent" aria-hidden="true" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
