import HeroCarousel from "@/components/hero/HeroCarousel";
import CollectionsGrid from "@/components/sections/CollectionsGrid";
import DetailLookbookGallery from "@/components/sections/DetailLookbookGallery";
import EditorialManifesto from "@/components/sections/EditorialManifesto";
import PrivateSalonCTA from "@/components/sections/PrivateSalonCTA";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <HeroCarousel />
      <CollectionsGrid />
      <DetailLookbookGallery />
      <EditorialManifesto />
      <PrivateSalonCTA />
    </main>
  );
}