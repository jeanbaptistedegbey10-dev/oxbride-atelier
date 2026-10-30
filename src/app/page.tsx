import HeroCarousel from "@/components/hero/HeroCarousel";
import EditorialManifesto from "@/components/sections/EditorialManifesto";
import CollectionsGrid from "@/components/sections/CollectionsGrid";
import PrivateSalonCTA from "@/components/sections/PrivateSalonCTA";
import DetailLookbookGallery from "@/components/sections/DetailLookbookGallery";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col">
      {/* 1. Hero / Carrousel principal */}
      <HeroCarousel />

      {/* 2. L'Art de la Haute Confection (Manifeste éditorial) */}
      <EditorialManifesto />

      {/* 3. Grille des collections */}
      <CollectionsGrid />

      {/* 4. Réservation Salon Privé */}
      <PrivateSalonCTA />

      {/* 5. Lookbook et détails des pièces */}
      <DetailLookbookGallery />
    </main>
  );
}