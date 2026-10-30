'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingBag, Menu, X, ChevronDown, User } from 'lucide-react';
import Link from 'next/link';
import { Cinzel } from 'next/font/google';

const cinzel = Cinzel({
  variable: '--font-cinzel',
  subsets: ['latin'],
  weight: ['400', '700'],
});

interface NavItem {
  href: string;
  label: string;
  hasDropdown?: boolean;
}

interface DropdownColumn {
  title: string;
  items: { label: string; href: string }[];
}

const NAV_ITEMS: NavItem[] = [
  { href: '/collections', label: 'Collections', hasDropdown: true },
  { href: '/atelier', label: "L'Atelier" },
  { href: '/sur-mesure', label: 'Sur-Mesure' },
  { href: '/rendez-vous', label: 'Rendez-vous' },
];

const DROPDOWN_COLUMNS: DropdownColumn[] = [
  {
    title: 'Robes de Mariée',
    items: [
      { label: 'Collection I · Royale', href: '/collections/robes-de-mariee-royale' },
      { label: 'Collection I · Sirène', href: '/collections/robes-de-mariee-sirene' },
      { label: 'Collection I · Contemporaine', href: '/collections/robes-de-mariee-contemporaine' },
    ],
  },
  {
    title: 'Tailoring Homme',
    items: [
      { label: 'Costumes sur-mesure', href: '/collections/tailoring-homme' },
      { label: 'Smokings & Tuxedos', href: '/collections/smokings' },
      { label: 'Accessoires Homme', href: '/collections/accessoires-homme' },
    ],
  },
  {
    title: 'Ensembles Couple',
    items: [
      { label: 'Tenues coordonnées', href: '/collections/ensembles-couple' },
      { label: 'Looks de cérémonie', href: '/collections/ceremonie' },
    ],
  },
  {
    title: 'Joaillerie & Accessoires',
    items: [
      { label: 'Alliances & Bagues', href: '/collections/joaillerie' },
      { label: 'Voiles & Coiffes', href: '/collections/voiles' },
      { label: 'Souliers', href: '/collections/souliers' },
    ],
  },
];

const CURRENCIES = ['EUR', 'USD', 'XOF'];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollectionsOpen, setIsCollectionsOpen] = useState(false);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('EUR');
  const [cartCount, setCartCount] = useState(0);

  const collectionsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        collectionsContainerRef.current &&
        !collectionsContainerRef.current.contains(event.target as Node)
      ) {
        setIsCollectionsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCollectionsMouseEnter = () => setIsCollectionsOpen(true);
  const handleCollectionsMouseLeave = () => setIsCollectionsOpen(false);

  return (
    <>
      {/* DESKTOP HEADER */}
      <nav
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-6xl rounded-full bg-transparent border-transparent shadow-none backdrop-blur-none hover:bg-black/40 hover:backdrop-blur-md hover:border-white/10 hover:shadow-2xl px-4 sm:px-6 lg:px-8 py-3 md:flex transition-all duration-300"
        aria-label="Navigation principale"
      >
        <div className="flex items-center w-full relative px-4 sm:px-6 lg:px-8">
          {/* Navigation Links */}
          <div className="mx-auto hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <div
                key={item.href}
                className="relative group"
                ref={
                  item.hasDropdown ? collectionsContainerRef : undefined
                }
                onMouseEnter={item.hasDropdown ? handleCollectionsMouseEnter : undefined}
                onMouseLeave={item.hasDropdown ? handleCollectionsMouseLeave : undefined}
              >
                <Link
                  href={item.href}
                  className="text-champagne-perle/90 text-xs md:text-sm font-medium transition-colors hover:text-amber-200/80 whitespace-nowrap"
                >
                  {item.label}
                </Link>

                {item.hasDropdown && (
                  <AnimatePresence>
                    {isCollectionsOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="
                          absolute top-full left-1/2 -translate-x-1/2
                          mt-6 w-[90vw] max-w-5xl
                          bg-black/50 backdrop-blur-xl
                          border border-white/10 rounded-3xl p-8 shadow-2xl z-50
                        "
                        onMouseEnter={handleCollectionsMouseEnter}
                        onMouseLeave={handleCollectionsMouseLeave}
                      >
                        <div className="grid grid-cols-4 gap-8">
                          {DROPDOWN_COLUMNS.map((column) => (
                            <div key={column.title}>
                              <h3 className={`${cinzel.variable} font-cinzel text-white text-sm tracking-widest mb-4 font-medium uppercase`}>
                                {column.title}
                              </h3>
                              <ul className="space-y-2">
                                {column.items.map((subItem) => (
                                  <li key={subItem.href}>
                                    <Link
                                      href={subItem.href}
                                      className="text-white/90 text-sm whitespace-nowrap hover:text-white hover:translate-x-1 transition-all duration-200"
                                    >
                                      {subItem.label}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
          </div>

          {/* Right Actions */}
          <div className="absolute inset-y-0 right-0 pr-4 sm:pr-6 lg:pr-8 flex items-center gap-3">
            {/* Currency Selector */}
            <div className="relative group">
              <button
                onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                className="
                  flex items-center gap-1.5 px-3 py-1.5
                  rounded-full bg-white/5 border border-white/10
                  text-champagne-perle/70 text-xs font-medium
                  hover:bg-white/10 hover:text-amber-200/80
                  transition-all duration-200
                "
              >
                {selectedCurrency}
                <ChevronDown className="h-3 w-3 text-champagne-perle/50" />
              </button>

              <AnimatePresence>
                {isCurrencyOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="
                      absolute right-0 mt-2 w-20
                      bg-stone-900/95 backdrop-blur-lg
                      border border-white/10 rounded-xl p-2 shadow-2xl z-50
                    "
                  >
                    {CURRENCIES.map((currency) => (
                      <button
                        key={currency}
                        onClick={() => {
                          setSelectedCurrency(currency);
                          setIsCurrencyOpen(false);
                        }}
                        className={`
                          w-full text-left px-3 py-2 rounded-lg text-sm
                          transition-colors duration-200
                          ${
                            selectedCurrency === currency
                              ? 'bg-amber-500/20 text-amber-200'
                              : 'text-champagne-perle/70 hover:bg-white/10 hover:text-amber-200/80'
                          }
                        `}
                      >
                        {currency}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Search */}
            <button
              className="
                p-2 rounded-full bg-white/5 border border-white/10
                text-champagne-perle/70 hover:bg-white/10 hover:text-amber-200/80
                transition-all duration-200
              "
              aria-label="Recherche"
            >
              <Search className="h-4 w-4" />
            </button>

            {/* Compte client */}
            <button
              className="
                p-2 rounded-full bg-white/5 border border-white/10
                text-champagne-perle/70 hover:bg-white/10 hover:text-amber-200/80
                transition-all duration-200
              "
              aria-label="Mon compte"
            >
              <User className="h-4 w-4" />
            </button>

            {/* Cart */}
            <button
              className="
                relative p-2 rounded-full bg-white/5 border border-white/10
                text-champagne-perle/70 hover:bg-white/10 hover:text-amber-200/80
                transition-all duration-200
              "
              aria-label="Panier"
            >
              <ShoppingBag className="h-4 w-4" />
              {cartCount > 0 && (
                <span className="
                  absolute top-1 right-1 h-5 w-5 rounded-full bg-amber-500
                  text-[10px] font-bold text-black flex items-center justify-center
                ">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE HEADER */}
      <nav
        className="
          fixed top-4 left-1/2 -translate-x-1/2 z-50
          w-[92%] max-w-md rounded-full bg-black/30 backdrop-blur-sm
          border border-white/5 px-4 py-2.5 md:hidden
        "
        aria-label="Navigation mobile"
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="
                p-1.5 rounded-full bg-white/5 text-champagne-perle/70
                hover:bg-white/10 hover:text-amber-200/80
                transition-all duration-200
              "
              aria-label="Ouvrir le menu"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-xl"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-hidden="true"
            />

            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="
                fixed inset-0 z-[61] flex flex-col p-6 md:p-12 overflow-y-auto
              "
            >
              <div className="flex justify-between items-center mb-12">
                <Link href="/" className="flex items-center gap-2">
                  <div
                    className={`${cinzel.variable} font-cinzel text-champagne-perle uppercase tracking-widest text-sm font-bold leading-none`}
                  >
                    OXBRIDGE ATELIER
                  </div>
                </Link>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="
                    p-2 rounded-full bg-white/10 text-champagne-perle
                    hover:bg-white/20 hover:text-amber-200/80
                    transition-all duration-200
                  "
                  aria-label="Fermer le menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="flex flex-col gap-4">
                {NAV_ITEMS.map((item) => (
                  <div
                    key={item.href}
                    className="relative group border-b border-white/5 pb-4 last:border-0 last:pb-0"
                  >
                    <Link
                      href={item.href}
                      className="
                        block py-3 text-champagne-perle/90 text-lg font-medium
                        hover:text-amber-200/80 transition-colors duration-200
                      "
                    >
                      {item.label}

                    </Link>
                  </div>
                ))}
              </nav>

              <div className="mt-auto pt-8 flex flex-col gap-4">
                <div className="flex items-center justify-between px-4">
                  <span className="text-champagne-perle/60 text-sm tracking-wider uppercase">
                    Devise
                  </span>
                  <span className="text-amber-200/80 text-sm font-medium">
                    {selectedCurrency}
                  </span>
                </div>
                <button className="w-full py-3 rounded-xl bg-white/10 border border-white/10 text-champagne-perle hover:bg-white/20 hover:text-amber-200/80 transition-all duration-200">
                  Accéder à la Collection
                </button>
                <button className="w-full py-3 rounded-xl bg-sable-or-rose text-black font-medium hover:bg-sable-or-rose/90 transition-all duration-200">
                  Réserver un Essayage
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}