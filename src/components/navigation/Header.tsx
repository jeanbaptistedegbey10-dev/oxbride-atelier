'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingBag, Menu, X, User, Heart } from 'lucide-react';
import Link from 'next/link';
import { Cinzel } from 'next/font/google';
import { useCart } from '@/components/cart/CartProvider';
import { useWishlist } from '@/components/wishlist/WishlistProvider';

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
  { href: '/latelier', label: "L'Atelier" },
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

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollectionsOpen, setIsCollectionsOpen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  const { count: cartCount, openDrawer: openCart } = useCart();
  const { count: wishlistCount, openDrawer: openWishlist } = useWishlist();

  const collectionsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 0);
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsHeaderVisible(false);
      } else {
        setIsHeaderVisible(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

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
      <AnimatePresence mode="wait">
        {isHeaderVisible && (
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-6xl rounded-full transition-all duration-300 ${
              isScrolled
                ? 'bg-[#F9F8F6] border border-stone-200/80 shadow-lg'
                : 'bg-transparent border-transparent shadow-none hover:bg-black/40 hover:backdrop-blur-md hover:border-white/10 hover:shadow-2xl'
            } px-4 sm:px-6 xl:px-8 py-3 md:flex`}
            aria-label="Navigation principale"
          >
            <div className="flex items-center w-full relative px-4 sm:px-6 xl:px-8">
              {/* Logo / Brand - Left (visible only when scrolled) */}
              <AnimatePresence mode="wait">
                {isScrolled && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="shrink-0 mr-8 md:mr-12"
                  >
                    <Link
                      href="/"
                      className="flex items-center gap-2"
                      aria-label="Accueil OXBride Atelier"
                    >
                      <div className="flex flex-col">
                        <span className="text-xs sm:text-sm font-cinzel font-semibold tracking-[0.25em] text-[#2D2825] uppercase">
                          OXBRIDE ATELIER
                        </span>
                        <span className="text-[9px] tracking-[0.22em] text-[#2D2825]/60 uppercase hidden sm:block">
                          PARIS · HAUTE COUTURE NUPTIALE
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Links - Centered */}
              <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-5 lg:gap-6 xl:gap-8 whitespace-nowrap">
                {NAV_ITEMS.map((item) => (
                  <div
                    key={item.href}
                    className="relative group shrink-0"
                    ref={
                      item.hasDropdown ? collectionsContainerRef : undefined
                    }
                    onMouseEnter={item.hasDropdown ? handleCollectionsMouseEnter : undefined}
                    onMouseLeave={item.hasDropdown ? handleCollectionsMouseLeave : undefined}
                  >
                    <Link
                      href={item.href}
                      className={`${isScrolled ? 'text-[#2D2825]/90' : 'text-champagne-perle/90'} text-xs md:text-sm font-medium transition-colors ${isScrolled ? 'hover:text-[#2D2825]' : 'hover:text-amber-200/80'} whitespace-nowrap`}
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
              <div className="absolute inset-y-0 right-0 pr-4 sm:pr-6 xl:pr-8 flex items-center gap-2 xl:gap-4 shrink-0">
                {/* Search */}
                <button
                  className={`
                    p-2 shrink-0 rounded-full transition-all duration-200
                    ${isScrolled
                      ? 'bg-white/80 border border-stone-200/80 text-[#2D2825]/70 hover:bg-white hover:text-[#2D2825]'
                      : 'bg-white/5 border border-white/10 text-champagne-perle/70 hover:bg-white/10 hover:text-amber-200/80'
                    }
                  `}
                  aria-label="Recherche"
                >
                  <Search className="h-4 w-4" />
                </button>

                {/* Compte client */}
                <Link
                  href="/compte"
                  className={`
                    p-2 shrink-0 rounded-full transition-all duration-200
                    ${isScrolled
                      ? 'bg-white/80 border border-stone-200/80 text-[#2D2825]/70 hover:bg-white hover:text-[#2D2825]'
                      : 'bg-white/5 border border-white/10 text-champagne-perle/70 hover:bg-white/10 hover:text-amber-200/80'
                    }
                  `}
                  aria-label="Mon compte"
                >
                  <User className="h-4 w-4" />
                </Link>

                {/* Liste de souhaits */}
                <button
                  onClick={openWishlist}
                  className={`
                    relative p-2 shrink-0 rounded-full transition-all duration-200
                    ${isScrolled
                      ? 'bg-white/80 border border-stone-200/80 text-[#2D2825]/70 hover:bg-white hover:text-[#2D2825]'
                      : 'bg-white/5 border border-white/10 text-champagne-perle/70 hover:bg-white/10 hover:text-amber-200/80'
                    }
                  `}
                  aria-label="Liste de souhaits"
                >
                  <Heart className="h-4 w-4" />
                  {wishlistCount > 0 && (
                    <span className="
                      absolute -top-1 -right-1 h-4 w-4 min-w-[1.25rem] rounded-full bg-amber-500
                      text-[9px] font-bold text-black flex items-center justify-center
                    ">
                      {wishlistCount}
                    </span>
                  )}
                </button>

                {/* Cart */}
                <button
                  onClick={openCart}
                  className={`
                    relative p-2 shrink-0 rounded-full transition-all duration-200
                    ${isScrolled
                      ? 'bg-white/80 border border-stone-200/80 text-[#2D2825]/70 hover:bg-white hover:text-[#2D2825]'
                      : 'bg-white/5 border border-white/10 text-champagne-perle/70 hover:bg-white/10 hover:text-amber-200/80'
                    }
                  `}
                  aria-label="Panier"
                >
                  <ShoppingBag className="h-4 w-4" />
                  {cartCount > 0 && (
                    <span className="
                      absolute -top-1 -right-1 h-4 w-4 min-w-[1.25rem] rounded-full bg-amber-500
                      text-[9px] font-bold text-black flex items-center justify-center
                    ">
                      {cartCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

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
          <Link
            href="/"
            className="flex items-center gap-2 shrink-0"
            aria-label="Accueil OXBride Atelier"
          >
            <div className="flex flex-col">
              <span className="text-xs font-cinzel font-semibold tracking-[0.25em] text-champagne-perle uppercase">
                OXBRIDE ATELIER
              </span>
              <span className="text-[8px] tracking-[0.22em] text-champagne-perle/60 uppercase">
                PARIS · HAUTE COUTURE NUPTIALE
              </span>
            </div>
          </Link>
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
              <div className="flex justify-end mb-12">
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