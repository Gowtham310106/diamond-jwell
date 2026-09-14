import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import { getSettings, listCategories } from "@/lib/cms/repo";

/**
 * Storefront chrome. Everything under (site) gets the header, the main
 * landmark and the footer; the admin panel under /admin does not.
 *
 * Header and footer read the CMS here, once per request, and receive plain
 * props — they are client components and cannot hit the store themselves.
 */
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, categories] = await Promise.all([getSettings(), listCategories()]);

  return (
    <>
      <Header settings={settings} categories={categories} />
      <main id="main">{children}</main>
      <Footer settings={settings} categories={categories} />
    </>
  );
}
