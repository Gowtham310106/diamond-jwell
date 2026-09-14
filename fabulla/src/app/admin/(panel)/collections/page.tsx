import Link from "next/link";
import { Plus } from "@phosphor-icons/react/ssr";
import { listCollections } from "@/lib/cms/repo";
import { Badge, EmptyState, Flash, PageHeader, Table, btnPrimary } from "@/components/admin/ui";

export default async function CollectionsAdmin(props: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  const { saved, error } = await props.searchParams;
  const collections = await listCollections();

  return (
    <>
      <PageHeader
        title="Collections"
        description={`Curated edits — "Under $5,000", "Iced Out", "Gifts". Featured ones get a plate on the homepage; all of them are filters on the products page.`}
        actions={
          <Link href="/admin/collections/new" className={btnPrimary}>
            <Plus size={13} /> New collection
          </Link>
        }
      />
      <Flash saved={saved} error={error} />
      {collections.length === 0 ? (
        <EmptyState title="No collections yet" body="Group pieces the way the studio sells them." />
      ) : (
        <Table head={["Collection", "Pieces", "Homepage", "Order"]}>
          {collections.map((c) => (
            <tr key={c._id} className="hover:bg-surface">
              <td className="px-4 py-3">
                <Link href={`/admin/collections/${c._id}`} className="flex items-center gap-3">
                  <span className="h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-line bg-canvas-2">
                    {c.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={c.image} alt="" className="h-full w-full object-cover" />
                    )}
                  </span>
                  <span>
                    <span className="block text-ink">{c.name}</span>
                    <span className="block font-mono text-[10px] text-ink-3">/products?collection={c.slug}</span>
                  </span>
                </Link>
              </td>
              <td className="px-4 py-3 text-ink-2">{c.productIds.length}</td>
              <td className="px-4 py-3">{c.featured && <Badge tone="good">featured</Badge>}</td>
              <td className="px-4 py-3 font-mono text-[12px] text-ink-3">{c.sortOrder}</td>
            </tr>
          ))}
        </Table>
      )}
    </>
  );
}
