import Link from "next/link";
import { Plus } from "@phosphor-icons/react/ssr";
import { listAllProducts, listCategories } from "@/lib/cms/repo";
import { formatPrice } from "@/lib/utils";
import { Badge, EmptyState, Flash, Input, PageHeader, Select, Table, btnPrimary, btnQuiet } from "@/components/admin/ui";
import { duplicateProduct, setProductStatus } from "./actions";

export default async function ProductsAdmin(props: {
  searchParams: Promise<{ q?: string; status?: string; category?: string; saved?: string; error?: string }>;
}) {
  const { q = "", status = "", category = "", saved, error } = await props.searchParams;
  const [all, categories] = await Promise.all([listAllProducts(), listCategories()]);

  const items = all.filter((p) => {
    if (status && p.status !== status) return false;
    if (category && p.categoryId !== category) return false;
    if (q) {
      const hay = `${p.name} ${p.sku} ${p.slug} ${p.metal} ${p.stone} ${p.tags.join(" ")}`.toLowerCase();
      if (!hay.includes(q.toLowerCase())) return false;
    }
    return true;
  });

  return (
    <>
      <PageHeader
        title="Products"
        description={`${all.length} pieces · ${all.filter((p) => p.status === "published").length} live on the site`}
        actions={
          <Link href="/admin/products/new" className={btnPrimary}>
            <Plus size={13} /> New product
          </Link>
        }
      />
      <Flash saved={saved} error={error} />

      <form className="mb-5 grid gap-3 sm:grid-cols-[1fr_180px_180px_auto]" method="get">
        <Input name="q" defaultValue={q} placeholder="Search name, SKU, metal, tags" />
        <Select name="status" defaultValue={status}>
          <option value="">Any status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </Select>
        <Select name="category" defaultValue={category}>
          <option value="">Any category</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </Select>
        <button type="submit" className={btnQuiet}>
          Filter
        </button>
      </form>

      {items.length === 0 ? (
        <EmptyState
          title={all.length === 0 ? "No products yet" : "Nothing matches"}
          body={all.length === 0 ? "Add the first piece and it appears on the site the moment it is published." : "Try a different search or clear the filters."}
          action={
            <Link href="/admin/products/new" className={btnPrimary}>
              <Plus size={13} /> New product
            </Link>
          }
        />
      ) : (
        <Table head={["Piece", "Category", "Price", "Status", "Badges", ""]}>
          {items.map((p) => (
            <tr key={p._id} className="hover:bg-surface">
              <td className="px-4 py-3">
                <Link href={`/admin/products/${p._id}`} className="flex items-center gap-3">
                  <span className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-line bg-canvas-2">
                    {p.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.image} alt="" className="h-full w-full object-cover" />
                    )}
                  </span>
                  <span>
                    <span className="block font-sans text-[13.5px] text-ink">{p.name}</span>
                    <span className="block font-mono text-[10px] text-ink-3">/{p.slug}{p.sku ? ` · ${p.sku}` : ""}</span>
                  </span>
                </Link>
              </td>
              <td className="px-4 py-3 text-ink-2">{p.category?.name ?? <span className="text-rose-ink">Unassigned</span>}</td>
              <td className="px-4 py-3 font-mono text-[12px] text-ink">
                {p.price !== null ? `${p.priceNote ? `${p.priceNote} ` : ""}${formatPrice(p.price)}` : p.priceNote || "Quote"}
              </td>
              <td className="px-4 py-3">
                <form action={setProductStatus}>
                  <input type="hidden" name="id" value={p._id} />
                  <input type="hidden" name="status" value={p.status === "published" ? "draft" : "published"} />
                  <button type="submit" title={p.status === "published" ? "Unpublish" : "Publish"}>
                    <Badge tone={p.status === "published" ? "good" : "warn"}>{p.status}</Badge>
                  </button>
                </form>
              </td>
              <td className="px-4 py-3">
                <span className="flex flex-wrap gap-1">
                  {p.featured && <Badge tone="ink">featured</Badge>}
                  {p.badges.map((b) => (
                    <Badge key={b}>{b}</Badge>
                  ))}
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                <span className="flex justify-end gap-4">
                  <form action={duplicateProduct}>
                    <input type="hidden" name="id" value={p._id} />
                    <button type="submit" className={btnQuiet}>
                      Duplicate
                    </button>
                  </form>
                  <Link href={`/products/${p.slug}`} target="_blank" className={btnQuiet}>
                    View ↗
                  </Link>
                </span>
              </td>
            </tr>
          ))}
        </Table>
      )}
    </>
  );
}
