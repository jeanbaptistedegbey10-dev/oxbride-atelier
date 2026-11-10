/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Anton } from 'next/font/google';

const anton = Anton({ subsets: ['latin'], weight: '400' });
import {
  ArrowLeft,
  ArrowRight,
  X,
  Play,
  Pause,
  Sparkles,
  Calendar,
  Compass,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

export interface SlideData {
  id: string;
  category: string;
  subCategory: string;
  title: string;
  collection: string;
  link: string;
  src: string;
  photoSrc: string;
  bg: string;
  panel: string;
  ghostText: string;
  description: string;
  craftDetails: {
    matiere: string;
    confection: string;
    delai: string;
    disponibilite: string;
  };
}

export const SLIDES: SlideData[] = [
  {
    id: 'robe-1',
    category: 'Robes de Mariée',
    subCategory: 'Collection I · Classique Royale',
    title: 'Robes de Mariée - Classique Royale',
    collection: 'Collection I',
    link: '/collections/robes-de-mariee-royale',
    src: '/assets/images/robe_mariee_royale_cutout.png',
    photoSrc: '/assets/images/robe_mariee_royale_1793011669185.jpg',
    bg: '#87674E',
    panel: '#9E7C62',
    ghostText: 'ROYALE',
    description:
      "Dentelle brodée à la main, traîne cathédrale majestueuse et soieries d'exception façonnées dans la plus pure tradition de la haute couture parisienne.",
    craftDetails: {
      matiere: 'Satin duchesse de soie & dentelle de Chantilly rebrodée',
      confection: '140 heures de broderie main à l’aiguille',
      delai: 'Sur-mesure · 4 à 6 mois',
      disponibilite: 'Pièce maîtresse en salon privé',
    },
  },
  {
    id: 'robe-2',
    category: 'Robes de Mariée',
    subCategory: 'Collection I · Silhouette Sirène',
    title: 'Robes de Mariée - Silhouette Sirène & Dentelle',
    collection: 'Collection I',
    link: '/collections/robes-de-mariee-sirene',
    src: '/assets/images/robe_mariee_sirene_cutout.png',
    photoSrc: '/assets/images/robe_mariee_sirene_1793011669011.jpg',
    bg: '#986162',
    panel: '#B07577',
    ghostText: 'SIRÈNE',
    description:
      'Ligne sculpturale galbante, jeux de transparence florale et délicatesse des finitions en perles nacrées pour une allure saisissante.',
    craftDetails: {
      matiere: 'Tulle illusion, dentelle florale française & micro-perles',
      confection: 'Bustier baleiné couture à maintien invisible',
      delai: 'Sur-mesure · 3 à 5 mois',
      disponibilite: 'Essayage exclusif sur rendez-vous',
    },
  },
  {
    id: 'robe-3',
    category: 'Robes de Mariée',
    subCategory: 'Collection I · Contemporaine',
    title: 'Robes de Mariée - Édition Contemporaine',
    collection: 'Collection I',
    link: '/collections/robes-de-mariee-contemporaine',
    src: '/assets/images/robe_mariee_moderne_cutout.png',
    photoSrc: '/assets/images/robe_mariee_moderne_1793011669775.jpg',
    bg: '#6E6A64',
    panel: '#87827C',
    ghostText: 'ÉPURÉE',
    description:
      'Crêpe de soie lourd au tombé impeccable, découpe architecturale épurée et dos nu sophistiqué pour la mariée moderne et audacieuse.',
    craftDetails: {
      matiere: 'Crêpe de soie triple georgette & doublure satin',
      confection: 'Coupe en biais sans coutures apparentes',
      delai: 'Sur-mesure · 3 mois',
      disponibilite: 'Personnalisation des décolletés',
    },
  },
  {
    id: 'costume-1',
    category: 'Costumes Hommes',
    subCategory: 'Collection II · Sartoriale',
    title: 'Costumes Hommes - Tailoring Moderne',
    collection: 'Collection II',
    link: '/collections/costumes-tailoring-moderne',
    src: '/assets/images/costume_homme_tailoring_cutout.png',
    photoSrc: '/assets/images/costume_homme_tailoring_1793011670244.jpg',
    bg: '#27384A',
    panel: '#394E65',
    ghostText: 'MODERNE',
    description:
      'Costume trois-pièces en laine vierge italienne Super 150s, revers crantés millimétrés et coupe ajustée dessinant une carrure affirmée.',
    craftDetails: {
      matiere: 'Laine Super 150s Loro Piana & doublure soie cupro',
      confection: 'Entoilage traditionnel intégral à la main',
      delai: 'Grande Mesure · 4 à 6 semaines',
      disponibilite: 'Sélection de 200 draps d’exception',
    },
  },
  {
    id: 'costume-2',
    category: 'Costumes Hommes',
    subCategory: 'Collection II · Soirée & Gala',
    title: "Costumes Hommes - Smoking d'Exception",
    collection: 'Collection II',
    link: '/collections/smokings-exception',
    src: '/assets/images/costume_homme_smoking_cutout.png',
    photoSrc: '/assets/images/costume_homme_smoking_1793011671129.jpg',
    bg: '#1C1B20',
    panel: '#2F2E36',
    ghostText: 'SMOKING',
    description:
      'Veste d’apparat en velours noir profond, col châle satiné soyeux et pantalon à galon satin pour une distinction digne des plus grands soirs.',
    craftDetails: {
      matiere: 'Velours de coton de Lyon & satin de soie duchesse',
      confection: 'Boutons recouverts à la main & coupe smoking d’art',
      delai: 'Grande Mesure · 5 semaines',
      disponibilite: 'Accessoires nœud papillon et pochette inclus',
    },
  },
  {
    id: 'couple-1',
    category: 'Ensembles Couple',
    subCategory: 'Collection III · Harmonie Mixte',
    title: 'Ensembles Couple - Harmonie Mixte',
    collection: 'Collection III',
    link: '/collections/ensembles-couple-mixte',
    src: '/assets/images/couple_mariage_mixte_cutout.png',
    photoSrc: '/assets/images/couple_mariage_mixte_1793011671841.jpg',
    bg: '#94583C',
    panel: '#AB6E51',
    ghostText: 'HARMONIE',
    description:
      'La parfaite symbiose des matières et des nuances entre une robe en tulle vaporeux brodé et un complet gris anthracite sur-mesure.',
    craftDetails: {
      matiere: 'Coordination chromatique soierie & laine peignée',
      confection: 'Rendez-vous double essayage synchronisé',
      delai: 'Sur-mesure duo · 4 mois',
      disponibilite: 'Harmonisation florale et accessoires offerte',
    },
  },
  {
    id: 'couple-2',
    category: 'Ensembles Couple',
    subCategory: 'Collection III · Célébration Royale',
    title: 'Ensembles Couple - Prestige Afro-Américain',
    collection: 'Collection III',
    link: '/collections/ensembles-couple-prestige',
    src: '/assets/images/couple_mariage_afro_cutout.png',
    photoSrc: '/assets/images/couple_mariage_afro_1793011672073.jpg',
    bg: '#795333',
    panel: '#936946',
    ghostText: 'PRESTIGE',
    description:
      'Majesté solaire et faste princier : robe sirène immaculée rehaussée de fils précieux et redingote blanche brodée d’or impérial.',
    craftDetails: {
      matiere: 'Broderies fil d’or 18k, dentelle perlée & drap impérial',
      confection: 'Création d’apparat haute distinction sur mesure',
      delai: 'Sur-mesure royal · 5 mois',
      disponibilite: 'Parure royale et gilet d’or coordonnés',
    },
  },
  {
    id: 'couple-3',
    category: 'Ensembles Couple',
    subCategory: 'Collection III · Élégance Intemporelle',
    title: 'Ensembles Couple - Élégance Intemporelle',
    collection: 'Collection III',
    link: '/collections/ensembles-couple-intemporel',
    src: '/assets/images/couple_mariage_intemporel_cutout.png',
    photoSrc: '/assets/images/couple_mariage_intemporel_1793011673064.jpg',
    bg: '#4E5B55',
    panel: '#65746E',
    ghostText: 'HÉRITAGE',
    description:
      'Quintessence du chic nuptial français au cœur des salons d’apparat : traîne noble, col montant en dentelle et smoking bleu minuit.',
    craftDetails: {
      matiere: 'Dentelle de Calais-Caudry & mohair bleu nuit Dormeuil',
      confection: 'Étalonnage des silhouettes en salon privé',
      delai: 'Sur-mesure duo · 4 à 5 mois',
      disponibilite: 'Duo Signature OXBride Atelier',
    },
  },
  {
    id: 'cortege-1',
    category: 'Cortège & Témoins',
    subCategory: 'Services · Demoiselles d’Honneur',
    title: 'Cortège - La Mariée & ses Demoiselles d’Honneur',
    collection: 'Services / Cortège',
    link: '/collections/cortege-demoiselles-dhonneur',
    src: '/assets/images/cortege_demoiselles_honneur_cutout.png',
    photoSrc: '/assets/images/cortege_demoiselles_honneur_photo.jpg',
    bg: '#7E4955',
    panel: '#965C69',
    ghostText: 'CORTÈGE',
    description:
      'Harmonie aérienne de robes en mousseline vieux rose et champagne poudré, conçues sur-mesure pour chaque morphologie du cortège.',
    craftDetails: {
      matiere: 'Mousseline de soie vaporeuse & crêpe georgette',
      confection: 'Patronage individualisé pour chaque demoiselle',
      delai: 'Pack Cortège · 2 à 3 mois',
      disponibilite: 'Nuancier sur mesure de 60 teintes',
    },
  },
  {
    id: 'cortege-2',
    category: 'Cortège & Témoins',
    subCategory: 'Services · L’Équipe du Marié',
    title: 'Témoins - Le Marié & ses Garçons d’Honneur',
    collection: 'Services / Témoins',
    link: '/collections/garcons-dhonneur',
    src: '/assets/images/temoins_garcons_honneur_cutout.png',
    photoSrc: '/assets/images/temoins_garcons_honneur_1793011674085.jpg',
    bg: '#3A4850',
    panel: '#4F5E67',
    ghostText: 'TÉMOINS',
    description:
      'Cohésion sartoriale raffinée : costumes ajustés en flanelle d’été gris ardoise, gilets assortis et pochettes en twill de soie coordonnées.',
    craftDetails: {
      matiere: 'Drap de laine peignée infroissable & soie imprimée',
      confection: 'Ajustements en atelier pour l’ensemble des témoins',
      delai: 'Pack Témoins · 6 semaines',
      disponibilite: 'Tarif privilège cortège masculin',
    },
  },
  {
    id: 'joaillerie-1',
    category: 'Alliances & Joaillerie',
    subCategory: 'Collection IV · Alliances & Pavage',
    title: "Alliances - L'Éclat de l'Engagement",
    collection: 'Collection IV',
    link: '/collections/alliances-joaillerie',
    src: '/assets/images/alliances_mariage_diamants_cutout.png',
    photoSrc: '/assets/images/alliances_mariage_diamants_1793011674856.jpg',
    bg: '#541521',
    panel: '#6D2331',
    ghostText: 'ALLIANCES',
    description:
      'Duo d’anneaux d’exception en platine 950 et or jaune 18 carats, entièrement sertis de diamants taille brillant pavés sous microscope.',
    craftDetails: {
      matiere: 'Platine PT950, Or 18K (750°) & Diamants D-F / VVS',
      confection: 'Sertissage micro-griffes haute joaillerie Place Vendôme',
      delai: 'Création & Gravure · 3 semaines',
      disponibilite: 'Gravure personnalisée offerte',
    },
  },
  {
    id: 'joaillerie-2',
    category: 'Alliances & Joaillerie',
    subCategory: 'Collection IV · Couronnes & Diadèmes',
    title: 'Joaillerie - Couronnes & Diadèmes Royaux',
    collection: 'Collection IV',
    link: '/collections/couronnes-diademes',
    src: '/assets/images/diademe_couronne_royale_cutout.png',
    photoSrc: '/assets/images/diademe_couronne_royale_1793011675062.jpg',
    bg: '#171E28',
    panel: '#263140',
    ghostText: 'DIADÈMES',
    description:
      'Diadème d’apparat magistral en or blanc rhodié orné de perles fines de culture et constellations de diamants, reflet d’une féerie souveraine.',
    craftDetails: {
      matiere: 'Or blanc 18k rhodié, perles Akoya & 12 carats de diamants',
      confection: 'Structure articulée légère épousant la coiffure',
      delai: 'Pièce d’artisanat d’art · 6 semaines',
      disponibilite: 'Disponible à l’achat ou en location d’exception',
    },
  },
];

const GRAIN_DATA_URI =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E\")";

export default function HeroCarousel() {
  const slides = SLIDES;
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 640;
    }
    return false;
  });
  const [isAutoplayActive, setIsAutoplayActive] = useState<boolean>(true);
  const [selectedSlideModal, setSelectedSlideModal] = useState<SlideData | null>(null);
  const [appointmentBooked, setAppointmentBooked] = useState<boolean>(false);

  const touchStartXRef = useRef<number | null>(null);
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);

  const totalSlides = slides.length;

  useEffect(() => {
    slides.forEach((item) => {
      const img = new Image();
      img.src = item.src;
    });
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navigate = useCallback(
    (direction: 'next' | 'prev') => {
      if (isAnimating) return;
      setIsAnimating(true);
      setActiveIndex((prev) =>
        direction === 'next'
          ? (prev + 1) % totalSlides
          : (prev - 1 + totalSlides) % totalSlides
      );
      setTimeout(() => {
        setIsAnimating(false);
      }, 650);
    },
    [isAnimating, totalSlides]
  );

  const goToSlide = useCallback(
    (targetIndex: number) => {
      if (isAnimating || targetIndex === activeIndex) return;
      setIsAnimating(true);
      setActiveIndex(targetIndex);
      setTimeout(() => {
        setIsAnimating(false);
      }, 650);
    },
    [isAnimating, activeIndex]
  );

  useEffect(() => {
    if (!isAutoplayActive || selectedSlideModal !== null) {
      if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
      return;
    }
    autoplayTimerRef.current = setInterval(() => {
      navigate('next');
    }, 4800);
    return () => {
      if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
    };
  }, [isAutoplayActive, selectedSlideModal, navigate]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedSlideModal !== null) {
        if (e.key === 'Escape') setSelectedSlideModal(null);
        return;
      }
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        navigate('next');
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        navigate('prev');
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsAutoplayActive((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, selectedSlideModal]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchEndX - touchStartXRef.current;
    touchStartXRef.current = null;
    if (Math.abs(deltaX) > 40) {
      if (deltaX < 0) {
        navigate('next');
      } else {
        navigate('prev');
      }
    }
  };

  const currentItem = slides[activeIndex];
  return (
    <div
      className="relative w-full overflow-hidden select-none font-sans"
      style={{
        backgroundColor: currentItem.bg,
        transition: 'background-color 650ms cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="relative w-full"
        style={{
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 50,
            backgroundImage: GRAIN_DATA_URI,
            backgroundSize: '200px 200px',
            backgroundRepeat: 'repeat',
            opacity: 0.35,
          }}
          aria-hidden="true"
        />

        <div
          className={`${anton.className} absolute inset-x-0 flex items-center justify-center pointer-events-none select-none text-[clamp(60px,20vw,280px)] lg:text-[12vw] xl:text-[13vw]`}
          style={{
            zIndex: 2,
            top: isMobile ? '14%' : '16%',
            fontFamily: anton.style.fontFamily,
            fontWeight: 900,
            color: '#FFFFFF',
            opacity: 0.95,
            lineHeight: 0.95,
            letterSpacing: '0',
            whiteSpace: 'nowrap',
            textTransform: 'uppercase',
            transition: 'opacity 650ms ease, transform 650ms ease',
          }}
          aria-hidden="true"
        >
          {currentItem.ghostText}
        </div>

        <header
          className="absolute top-5 sm:top-7 left-4 sm:left-10 flex items-center gap-3 sm:gap-4"
          style={{
            zIndex: 60,
          }}
        >
          <div className="flex flex-col">
            <span
              className="text-sm sm:text-base font-cinzel font-semibold tracking-[0.25em] text-white uppercase"
              style={{
                textShadow: '0 2px 10px rgba(0,0,0,0.3)',
              }}
            >
              OXBRIDE ATELIER
            </span>
            <span className="text-[10px] tracking-[0.22em] text-white/70 uppercase">
              PARIS · HAUTE COUTURE NUPTIALE
            </span>
          </div>

          <div className="hidden md:flex items-center gap-2 pl-4 border-l border-white/20">
            <span className="text-[11px] font-mono tracking-widest text-white/90">
              {String(activeIndex + 1).padStart(2, '0')} / {String(totalSlides).padStart(2, '0')}
            </span>
            <span className="text-[11px] text-white/60 font-medium">
              ·
            </span>
            <span className="text-[11px] tracking-wide text-white/80">
              {currentItem.category}
            </span>
          </div>
        </header>

        <div
          className="absolute top-5 sm:top-7 right-4 sm:right-10 flex items-center gap-2 sm:gap-3"
          style={{ zIndex: 60 }}
        >
          <button
            type="button"
            onClick={() => setIsAutoplayActive((prev) => !prev)}
            aria-label={isAutoplayActive ? 'Pause autoplay' : 'Start autoplay'}
            className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-full border border-white/30 bg-black/20 backdrop-blur-md text-white text-[11px] uppercase tracking-wider hover:bg-white/15 transition-all duration-150 focus:outline-none"
          >
            {isAutoplayActive ? (
              <>
                <Pause size={12} className="text-white" />
                <span className="hidden sm:inline">Autoplay</span>
              </>
            ) : (
              <>
                <Play size={12} className="text-white fill-white" />
                <span className="hidden sm:inline">Reprendre</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setSelectedSlideModal(currentItem)}
            aria-label="Voir la fiche détaillée"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/30 bg-white/10 backdrop-blur-md text-white text-[11px] uppercase tracking-wider hover:bg-white/25 transition-all duration-150"
          >
            <Compass size={13} />
            <span>Fiche Collection</span>
          </button>
        </div>
        <div
          className="absolute inset-0"
          style={{
            zIndex: 10,
          }}
        >
          {slides.map((item, index) => {
            let diff = (index - activeIndex + totalSlides) % totalSlides;
            if (diff > totalSlides / 2) {
              diff -= totalSlides;
            }

            let role: 'center' | 'left' | 'right' | 'back-left' | 'back-right' | 'hidden' =
              'hidden';
            if (diff === 0) role = 'center';
            else if (diff === -1) role = 'left';
            else if (diff === 1) role = 'right';
            else if (diff === -2) role = 'back-left';
            else if (diff === 2) role = 'back-right';
            else role = 'hidden';

            let transform = 'translateX(-50%) scale(0.7)';
            let filter = 'blur(6px)';
            let opacity = 0;
            let zIndex = 1;
            let leftPos = diff > 0 ? (isMobile ? '105%' : '90%') : isMobile ? '-5%' : '10%';
            let height = isMobile ? '12%' : '20%';
            let bottom = isMobile ? '32%' : '10%';
            let cursor = 'default';
            let pointerEvents: React.CSSProperties['pointerEvents'] = 'none';

            if (role === 'center') {
              transform = `translateX(-50%) scale(${isMobile ? 1.25 : 1.68})`;
              filter = 'drop-shadow(0 25px 35px rgba(0,0,0,0.45))';
              opacity = 1;
              zIndex = 25;
              leftPos = '50%';
              height = isMobile ? '60%' : '92%';
              bottom = isMobile ? '22%' : '0';
              cursor = 'pointer';
              pointerEvents = 'auto';
            } else if (role === 'left') {
              transform = 'translateX(-50%) scale(1)';
              filter = 'blur(2px) drop-shadow(0 15px 25px rgba(0,0,0,0.3))';
              opacity = 0.85;
              zIndex = 15;
              leftPos = isMobile ? '20%' : '30%';
              height = isMobile ? '16%' : '28%';
              bottom = isMobile ? '32%' : '12%';
              cursor = 'pointer';
              pointerEvents = 'auto';
            } else if (role === 'right') {
              transform = 'translateX(-50%) scale(1)';
              filter = 'blur(2px) drop-shadow(0 15px 25px rgba(0,0,0,0.3))';
              opacity = 0.85;
              zIndex = 15;
              leftPos = isMobile ? '80%' : '70%';
              height = isMobile ? '16%' : '28%';
              bottom = isMobile ? '32%' : '12%';
              cursor = 'pointer';
              pointerEvents = 'auto';
            } else if (role === 'back-left') {
              transform = 'translateX(-50%) scale(0.85)';
              filter = 'blur(4px)';
              opacity = 0.2;
              zIndex = 5;
              leftPos = isMobile ? '5%' : '18%';
              height = isMobile ? '12%' : '22%';
              bottom = isMobile ? '32%' : '12%';
              cursor = 'pointer';
              pointerEvents = 'auto';
            } else if (role === 'back-right') {
              transform = 'translateX(-50%) scale(0.85)';
              filter = 'blur(4px)';
              opacity = 0.2;
              zIndex = 5;
              leftPos = isMobile ? '95%' : '82%';
              height = isMobile ? '12%' : '22%';
              bottom = isMobile ? '32%' : '12%';
              cursor = 'pointer';
              pointerEvents = 'auto';
            }

            const handleItemClick = () => {
              if (role === 'left' || role === 'back-left') {
                navigate('prev');
              } else if (role === 'right' || role === 'back-right') {
                navigate('next');
              } else if (role === 'center') {
                setSelectedSlideModal(item);
              }
            };

            return (
              <div
                key={item.id}
                onClick={handleItemClick}
                role="button"
                tabIndex={role === 'center' || role === 'left' || role === 'right' ? 0 : -1}
                aria-label={`${item.title} (${role})`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleItemClick();
                  }
                }}
                className="outline-none"
                style={{
                  position: 'absolute',
                  aspectRatio: '0.6 / 1',
                  left: leftPos,
                  bottom: bottom,
                  height: height,
                  transform: transform,
                  filter: filter,
                  opacity: opacity,
                  zIndex: zIndex,
                  cursor: cursor,
                  pointerEvents: pointerEvents,
                  transition:
                    'transform 650ms cubic-bezier(0.4, 0, 0.2, 1), filter 650ms cubic-bezier(0.4, 0, 0.2, 1), opacity 650ms cubic-bezier(0.4, 0, 0.2, 1), left 650ms cubic-bezier(0.4, 0, 0.2, 1), bottom 650ms cubic-bezier(0.4, 0, 0.2, 1), height 650ms cubic-bezier(0.4, 0, 0.2, 1)',
                  willChange: 'transform, filter, opacity',
                }}
              >
                <img
                  src={item.src}
                  alt={item.title}
                  draggable={false}
                  referrerPolicy="no-referrer"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    objectPosition: 'bottom center',
                  }}
                />
              </div>
            );
          })}
        </div>
        <div
          className="absolute bottom-6 sm:bottom-10 left-6 right-6 md:left-12 md:right-12 flex flex-col md:flex-row items-end justify-between gap-6 pointer-events-auto"
          style={{
            zIndex: 60,
          }}
        >
          <div className="overflow-hidden" style={{ maxWidth: isMobile ? '280px' : '380px' }}>
          <div className="flex items-center gap-2 mb-1.5 sm:mb-2 text-stone-300 text-[10px] tracking-widest uppercase">
            <span>{currentItem.collection}</span>
            <span aria-hidden="true">-</span>
            <span>SLIDE {activeIndex + 1}/{totalSlides}</span>
          </div>

          <h1
            className="mb-2 sm:mb-3 text-lg lg:text-xl font-serif text-white tracking-wide leading-snug"
            style={{
              opacity: 0.95,
              letterSpacing: '0',
            }}
          >
            {currentItem.title}
          </h1>

          <p
            className="hidden sm:block text-xs text-stone-300 font-sans leading-relaxed mb-4 sm:mb-5"
            style={{
              lineHeight: 1.6,
            }}
          >
            {currentItem.description}
          </p>

          <div className="flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => navigate('prev')}
              aria-label="Slide précédente"
              disabled={isAnimating}
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-white flex items-center justify-center text-white bg-transparent transition-all duration-150 hover:scale-[1.08] hover:bg-white/12 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <ArrowLeft size={26} strokeWidth={2.25} />
            </button>

            <button
              type="button"
              onClick={() => navigate('next')}
              aria-label="Slide suivante"
              disabled={isAnimating}
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-white flex items-center justify-center text-white bg-transparent transition-all duration-150 hover:scale-[1.08] hover:bg-white/12 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <ArrowRight size={26} strokeWidth={2.25} />
            </button>

            <div className="hidden lg:flex items-center gap-1.5 ml-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => goToSlide(i)}
                  aria-label={`Aller au slide ${i + 1}`}
                  className="p-1 focus:outline-none"
                >
                  <span
                    className={`block h-1.5 rounded-full transition-all duration-300 ${i === activeIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/70'}`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div
          className=""
        >
          <a
            href={currentItem.link}
            onClick={(e) => {
              e.preventDefault();
              setSelectedSlideModal(currentItem);
            }}
            className={`${anton.className} flex items-center gap-3 sm:gap-4 px-6 sm:px-8 lg:px-7 py-3 sm:py-4 lg:py-3.5 text-[clamp(22px,3.5vw,48px)] lg:text-[20px] xl:text-[24px] text-white uppercase tracking-widest no-underline transition-opacity duration-200 cursor-pointer group`}
            style={{
              fontFamily: anton.style.fontFamily,
              fontWeight: 700,
              opacity: 0.95,
              lineHeight: 1.2,
            }}
          >
            <span className="group-hover:opacity-100 transition-opacity whitespace-nowrap">
              DÉCOUVRIR LA COLLECTION
            </span>
            <ArrowRight
              className="w-6 h-6 sm:w-10 sm:h-10 transition-transform group-hover:translate-x-2"
              strokeWidth={2.5}
            />
          </a>
          </div>
        </div>
      </div>
      {selectedSlideModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md"
          onClick={() => setSelectedSlideModal(null)}
        >
          <div
            className="relative w-full max-w-2xl bg-neutral-900 border border-white/20 rounded-2xl p-6 sm:p-8 text-white shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#111215',
            }}
          >
            <div
              className="absolute -top-28 -right-28 w-72 h-72 rounded-full blur-3xl opacity-30 pointer-events-none"
              style={{ backgroundColor: selectedSlideModal.bg }}
            />

            <div className="flex items-start justify-between mb-4 border-b border-white/10 pb-4">
              <div>
                <span className="text-[11px] font-mono tracking-widest text-amber-300/80 uppercase">
                  {selectedSlideModal.subCategory}
                </span>
                <h2
                  className="text-2xl sm:text-3xl uppercase text-white mt-1"
                  style={{ fontFamily: "'Cinzel', serif", letterSpacing: '0.04em' }}
                >
                  {selectedSlideModal.title}
                </h2>
                <div className="flex items-center gap-2 text-xs text-white/60 mt-1 font-mono">
                  <span>Destination URL:</span>
                  <code className="text-white/90 bg-white/10 px-2 py-0.5 rounded text-[11px]">
                    {selectedSlideModal.link}
                  </code>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedSlideModal(null)}
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors shrink-0"
                aria-label="Fermer la fiche"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 mb-6">
              <div
                className="sm:col-span-5 relative h-56 sm:h-auto rounded-xl flex items-center justify-center overflow-hidden border border-white/10 p-4"
                style={{
                  background: `radial-gradient(circle, ${selectedSlideModal.panel} 0%, #15181e 100%)`,
                }}
              >
                <img
                  src={selectedSlideModal.src}
                  alt={selectedSlideModal.title}
                  className="h-full w-full object-contain drop-shadow-2xl"
                />
              </div>

              <div className="sm:col-span-7 flex flex-col justify-between">
                <p className="text-xs sm:text-sm text-white/80 leading-relaxed mb-4">
                  {selectedSlideModal.description}
                </p>

                <div className="space-y-2.5 text-xs">
                  <div className="p-2.5 bg-white/5 rounded-lg border border-white/10">
                    <span className="text-white/50 block text-[10px] uppercase tracking-wider">
                      Matières Nobles
                    </span>
                    <span className="font-semibold text-white/95">
                      {selectedSlideModal.craftDetails.matiere}
                    </span>
                  </div>

                  <div className="p-2.5 bg-white/5 rounded-lg border border-white/10">
                    <span className="text-white/50 block text-[10px] uppercase tracking-wider">
                      Confection
                    </span>
                    <span className="font-semibold text-white/95">
                      {selectedSlideModal.craftDetails.confection}
                    </span>
                  </div>

                  <div className="p-2.5 bg-white/5 rounded-lg border border-white/10">
                    <span className="text-white/50 block text-[10px] uppercase tracking-wider">
                      Délai
                    </span>
                    <span className="font-semibold text-white/95">
                      {selectedSlideModal.craftDetails.delai}
                    </span>
                  </div>

                  <div className="p-2.5 bg-white/5 rounded-lg border border-white/10">
                    <span className="text-white/50 block text-[10px] uppercase tracking-wider">
                      Disponibilité
                    </span>
                    <span className="font-semibold text-white/95">
                      {selectedSlideModal.craftDetails.disponibilite}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mb-5">
              <span className="text-[10px] uppercase tracking-wider text-white/50 block mb-2">
                Parcourir le catalogue complet (12 univers)
              </span>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
                {slides.map((slide, idx) => (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => {
                      goToSlide(idx);
                      setSelectedSlideModal(slide);
                    }}
                    className={`relative w-11 h-14 rounded-md overflow-hidden shrink-0 border transition-all p-1 flex items-center justify-center ${idx === activeIndex ? 'border-white ring-2 ring-white/50 scale-105 bg-white/10' : 'border-white/20 opacity-60 hover:opacity-100 bg-white/5'}`}
                  >
                    <img
                      src={slide.src}
                      alt={slide.title}
                      className="w-full h-full object-contain"
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-white/10">
              <div className="flex items-center gap-2 text-xs text-white/70 w-full sm:w-auto">
                <Sparkles size={14} className="text-amber-400" />
                <span>Atelier Privé Place Vendôme & Paris 8e</span>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setAppointmentBooked(true);
                    setTimeout(() => {
                      setAppointmentBooked(false);
                    }, 2500);
                  }}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-lg border border-white/30 text-white text-xs font-medium hover:bg-white/10 transition-colors flex items-center justify-center gap-1.5"
                >
                  {appointmentBooked ? (
                    <>
                      <CheckCircle2 size={15} className="text-emerald-400" />
                      <span>Rendez-vous Noté</span>
                    </>
                  ) : (
                    <>
                      <Calendar size={14} />
                      <span>Réserver un Essayage</span>
                    </>
                  )}
                </button>

                <a
                  href={selectedSlideModal.link}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-lg text-white text-xs font-medium transition-all flex items-center justify-center gap-1.5 shadow-lg"
                  style={{
                    backgroundColor: selectedSlideModal.bg,
                  }}
                  onClick={() => {
                    window.location.hash = selectedSlideModal.link;
                  }}
                >
                  <span>Accéder à la Collection</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}