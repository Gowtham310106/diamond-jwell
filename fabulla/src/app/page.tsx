import ScrollIntro from "@/components/home/ScrollIntro";
import HeroCarousel from "@/components/home/HeroCarousel";
import Collections from "@/components/home/Collections";
import CategoryBento from "@/components/home/CategoryBento";
import InstagramHighlights from "@/components/home/InstagramHighlights";
import Assurance from "@/components/home/Assurance";
import Campaign from "@/components/home/Campaign";
import Craftsmanship from "@/components/home/Craftsmanship";
import Testimonials from "@/components/home/Testimonials";
import ClosingCta from "@/components/home/ClosingCta";
import GoldRule from "@/components/ui/GoldRule";

/**
 * Homepage, following the diamond-jwellery reference build's UI/UX.
 *
 * Flow:
 *   ScrollIntro ........ four screens that stack and pin, chrome floating over
 *   HeroCarousel ....... banner rotation, the page proper starts here
 *   Collections ........ one tall plate beside two stacked
 *   CategoryBento ...... Bluestone-derived named-area field, 6 tiles, 30 cells
 *   InstagramHighlights  circular tray driving a 3D coverflow
 *   Assurance .......... held heading beside a badge grid
 *   Campaign ........... editorial card beside a product grid
 *   Craftsmanship ...... copy and features beside the certificate card
 *   Testimonials ....... three client cards
 *   ClosingCta ......... the one centred moment
 *
 * Gold rules separate the upper sections exactly as in the reference, then
 * stop once the sections start carrying their own top borders, so the page
 * never shows a rule and a border stacked together.
 *
 * The intro is full-bleed and sits above <main>'s normal flow, so the rest of
 * the page is given an opaque ground to scroll up over it.
 */
export default function HomePage() {
  return (
    <>
      <ScrollIntro />

      <div className="relative z-10 bg-canvas">
        <HeroCarousel />
        <GoldRule />
        <Collections />
        <GoldRule />
        <CategoryBento />
        <InstagramHighlights />
        <Assurance />
        <Campaign />
        <Craftsmanship />
        <Testimonials />
        <ClosingCta />
      </div>
    </>
  );
}
