import HeroCarousel from "@/components/home/HeroCarousel";
import Collections from "@/components/home/Collections";
import CategoryBento from "@/components/home/CategoryBento";
import ProductRow from "@/components/home/ProductRow";
import InstagramHighlights from "@/components/home/InstagramHighlights";
import Assurance from "@/components/home/Assurance";
import Campaign from "@/components/home/Campaign";
import Craftsmanship from "@/components/home/Craftsmanship";
import Testimonials from "@/components/home/Testimonials";
import FaqSection from "@/components/home/FaqSection";
import ClosingCta from "@/components/home/ClosingCta";
import Concierge from "@/components/site/Concierge";
import GoldRule from "@/components/ui/GoldRule";
import { conciergeCopy } from "@/lib/concierge";
import { bestSellers, featuredProducts, getSettings, listCategories, listCollections, listFaqs, newArrivals } from "@/lib/cms/repo";

/**
 * Homepage, composed from the CMS.
 *
 * The admin decides which sections show and in what order; each section
 * fills itself from the catalog (badges, featured flags, featured
 * collections, FAQs marked for the site). The concierge sits directly after
 * the hero and reveals itself once the slides scroll past.
 */
export const revalidate = 60;

export default async function HomePage() {
  const [settings, categories, collections, faqs, arrivals, sellers, featured] = await Promise.all([
    getSettings(),
    listCategories(),
    listCollections(),
    listFaqs(),
    newArrivals(8),
    bestSellers(8),
    featuredProducts(4),
  ]);

  const copy = conciergeCopy(settings);
  const enabled = settings.sections.filter((s) => s.enabled);

  return (
    <div className="relative z-10 bg-canvas">
      {enabled.map((section, i) => {
        const key = section.key;
        const rule = i > 0 && i < 4 ? <GoldRule /> : null;
        switch (key) {
          case "hero":
            return (
              <div key={key}>
                <HeroCarousel slides={settings.hero.filter((s) => s.enabled && s.src)} />
                {settings.chatbot.enabled && <Concierge copy={copy} />}
              </div>
            );
          case "categories":
            return (
              <div key={key}>
                {rule}
                <CategoryBento title={section.title} subtitle={section.subtitle} categories={categories.filter((c) => c.showInBento && c.image)} />
              </div>
            );
          case "collections":
            return (
              <div key={key}>
                {rule}
                <Collections title={section.title} subtitle={section.subtitle} collections={collections.filter((c) => c.featured)} />
              </div>
            );
          case "newArrivals":
            return (
              <div key={key}>
                {rule}
                <ProductRow title={section.title} subtitle={section.subtitle} products={arrivals} href="/products?sort=newest" />
              </div>
            );
          case "bestSellers":
            return (
              <div key={key}>
                {rule}
                <ProductRow title={section.title} subtitle={section.subtitle} products={sellers} href="/products?badge=bestseller" />
              </div>
            );
          case "highlights":
            return <InstagramHighlights key={key} title={section.title} subtitle={section.subtitle} highlights={settings.highlights} instagram={settings.contact.instagram} />;
          case "assurance":
            return <Assurance key={key} title={section.title} subtitle={section.subtitle} items={settings.assurances} />;
          case "campaign":
            return <Campaign key={key} settings={settings} products={featured} image={featured[0]?.images[1] ?? featured[featured.length - 1]?.image ?? settings.craftsmanship.image} />;
          case "craftsmanship":
            return <Craftsmanship key={key} settings={settings} />;
          case "testimonials":
            return <Testimonials key={key} title={section.title} subtitle={section.subtitle} items={settings.testimonials} />;
          case "faq":
            return <FaqSection key={key} title={section.title} subtitle={section.subtitle} faqs={faqs.filter((f) => f.showOnSite)} />;
          case "closing":
            return <ClosingCta key={key} settings={settings} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
