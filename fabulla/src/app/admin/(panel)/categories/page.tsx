import Link from "next/link";
import { Plus } from "@phosphor-icons/react/ssr";
import { listAllProducts, listCategories } from "@/lib/cms/repo";
import { Badge, Flash, PageHeader, Table, btnPrimary } from "@/components/admin/ui";

export default async function CategoriesAdmin(props: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  const { saved, error } = await props.searchParams;
  const [categories, products] = await Promise.all([listCategories(), listAllProducts()]);

  return (
    <>
      <PageHeader
        title="Categories"
        description="The circles in the header, the tiles on the homepage, the filters on the products page. Order here is order everywhere."
        actions={
          <Link href="/admin/categories/new" className={btnPrimary}>
            <Plus size={13} /> New category
          </Link>
        }
      />
      <Flash saved={saved} error={error} />
      <Table head={["Category", "Products", "Shown", "Order"]}>
        {categories.map((c) => (
          <tr key={c._id} className="hover:bg-surface">
            <td className="px-4 py-3">
              <Link href={`/admin/categories/${c._id}`} className="flex items-center gap-3">
                <span className="h-11 w-11 shrink-0 overflow-hidden rounded-full border border-line bg-canvas-2">
                  {c.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={c.image} alt="" className="h-full w-full object-cover" />
                  )}
                </span>
                <span>
                  <span className="block text-ink">{c.name}</span>
                  <span className="block font-mono text-[10px] text-ink-3">/products?category={c.slug}</span>
                </span>
              </Link>
            </td>
            <td className="px-4 py-3 text-ink-2">{products.filter((p) => p.categoryId === c._id).length}</td>
            <td className="px-4 py-3">
              <span className="flex gap-1">
                {c.showInNav && <Badge>nav</Badge>}
                {c.showInBento && <Badge>homepage</Badge>}
              </span>
            </td>
            <td className="px-4 py-3 font-mono text-[12px] text-ink-3">{c.sortOrder}</td>
          </tr>
        ))}
      </Table>
    </>
  );
}
