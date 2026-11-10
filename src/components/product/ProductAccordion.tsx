/** @file
 * OXBride Atelier — Accordéons d'informations produit (Neo-Luxe).
 * Détails & Confection, Guide des Tailles, Livraison & Retours / Salons Privés.
 */

'use client';

import { motion } from 'framer-motion';
import React, { useCallback, useState } from 'react';
import { ChevronDown, Ruler, Scissors, Truck } from 'lucide-react';

interface ProductAccordionProps {
  descriptionHtml: string | null;
}

interface AccordionItem {
  key: string;
  title: string;
  Icon: React.ElementType<{ className?: string }>;
  content: React.ReactNode;
}

const ITEMS: AccordionItem[] = [
  {
    key: 'confection',
    title: 'Détails & Confection',
    Icon: Scissors,
    content: (
      <>
        <p className="text-stone-700 leading-relaxed">
          Chaque pièce est confectionnée dans notre atelier à partir de
          matières nobles sélectionnées avec exigence : soieries, dentelles de
          Chantilly, broderies réalisées à la main, finitions couture et coupes
          structurées pensées pour durer.
        </p>
      </>
    ),
  },
  {
    key: 'tailles',
    title: 'Guide des Tailles',
    Icon: Ruler,
    content: (
      <ul className="text-stone-700 leading-relaxed space-y-2 text-sm">
        <li>34 · 36 · 38 · 40 · 42 · 44 · 46 · 48</li>
        <li>
          Entre deux tailles, nous vous conseillons la taille supérieure pour
          un tombé fluide.
        </li>
        <li>
          Toutes nos pièces peuvent être réalisées en sur-mesure dans nos
          salons privés, sur rendez-vous.
        </li>
      </ul>
    ),
  },
  {
    key: 'livraison',
    title: 'Livraison & Retours / Salons Privés',
    Icon: Truck,
    content: (
      <>
        <p className="text-stone-700 leading-relaxed">
          Livraison offerte en France métropolitaine et à Monaco. Expédition
          sous soin avec signature, écrin de protection inclus.
        </p>
        <p className="text-stone-700 leading-relaxed mt-3">
          Retours acceptés sous 14 jours, dans leur emballage d'origine. Les
          pièces sur-mesure ne sont ni reprises ni échangées.
        </p>
        <p className="text-stone-700 leading-relaxed mt-3">
          Salons privés sur rendez-vous — Paris (Place Vendôme) et
          Abomey-Calavi.{' '}
          <a
            href="/rendez-vous"
            className="text-stone-900 underline underline-offset-4 hover:text-amber-700 transition-colors font-medium"
          >
            Réserver un essayage
          </a>
        </p>
      </>
    ),
  },
];

function AccordionItem({ item, descriptionHtml }: { item: AccordionItem; descriptionHtml: string | null }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  const isConfectionHtml = item.key === 'confection' && Boolean(descriptionHtml);

  return (
    <div className="border border-stone-200/50 rounded-xl bg-white/30 backdrop-blur-sm">
      <button
        type="button"
        onClick={toggle}
        className="flex w-full items-center gap-3 px-6 py-4 text-left transition-colors hover:bg-stone-100/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900"
      >
        <item.Icon className="h-5 w-5 text-stone-500" />
        <h3 className="font-serif text-lg text-stone-900 leading-none">
          {item.title}
        </h3>
        <ChevronDown
          className="ml-auto h-5 w-5 text-stone-400 transition-transform duration-300"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>
      <motion.div
        initial={{ height: 0 }}
        animate={{ height: isOpen ? 'auto' : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="overflow-hidden px-6 pb-5 pt-2"
      >
        {isConfectionHtml ? (
          <div
            className="text-stone-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: descriptionHtml ?? '' }}
          />
        ) : (
          item.content
        )}
      </motion.div>
    </div>
  );
}

export default function ProductAccordion({ descriptionHtml }: ProductAccordionProps) {
  return (
    <section className="mt-12 lg:mt-20 border-t border-stone-200/60 pt-12 lg:pt-20">
      <div className="max-w-2xl mx-auto space-y-3">
        {ITEMS.map((item) => (
          <AccordionItem
            key={item.key}
            item={item}
            descriptionHtml={descriptionHtml}
          />
        ))}
      </div>
    </section>
  );
}