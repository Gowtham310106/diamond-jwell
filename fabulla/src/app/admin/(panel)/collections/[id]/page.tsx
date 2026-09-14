import { notFound } from "next/navigation";
import { getCollection, listAllProducts } from "@/lib/cms/repo";
import type { Collection } from "@/lib/cms/types";
import { Card, Checkbox, Field, Flash, Input, PageHeader, Textarea } from "@/components/admin/ui";
import { ConfirmButton, SubmitButton } from "@/components/admin/buttons";
import MediaPicker from "@/components/admin/MediaPicker";
import { deleteCollection, saveCollection } from "../actions";

const BLANK: Omit<Collection, "_id" | "createdAt" | "updatedAt"> = {
  name: "",
  slug: "",
  description: "",
  image: "",
  productIds: [],
  sortOrder: 99,
  featured: false,
};

export default async function CollectionEditor(props: { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string; error?: string }> }) {
  const { id } = await props.params;
  const { saved, error } = await props.searchParams;
  const isNew = id === "new";
  const existing = isNew ? null : await getCollection(id);
  if (!isNew && !existing) notFound();
  const c = existing ?? BLANK;
  const products = await listAllProducts();

  return (
    <>
      <PageHeader
        crumbs={[{ href: "/admin/collections", label: "Collections" }]}
        title={isNew ? "New collection" : c.name}
        actions={
          !isNew && (
            <form action={deleteCollection}>
              <input type="hidden" name="id" value={existing!._id} />
              <ConfirmButton message={`Delete "${c.name}"? Products are not affected.`}>Delete</ConfirmButton>
            </form>
          )
        }
      />
      <Flash saved={saved} error={error} />

      <form action={saveCollection} className="grid gap-6 lg:grid-cols-[1fr_300px]">
        {!isNew && <input type="hidden" name="id" value={existing!._id} />}
        <div className="space-y-6">
          <Card title="Collection">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Name" name="name">
                <Input name="name" defaultValue={c.name} required />
              </Field>
              <Field label="URL slug" name="slug">
                <Input name="slug" defaultValue={c.slug} />
              </Field>
              <Field label="Description" name="description" hint="Shown on the homepage plate." className="sm:col-span-2">
                <Textarea name="description" defaultValue={c.description} rows={2} />
              </Field>
            </div>
            <div className="mt-5">
              <MediaPicker name="image" value={c.image ? [c.image] : []} folder="collections" label="Cover image" />
            </div>
          </Card>

          <Card title="Pieces in this collection" description="Tick the products. Order on the site follows the catalog order.">
            {products.length === 0 ? (
              <p className="font-sans text-[13px] text-ink-3">No products yet.</p>
            ) : (
              <ul className="grid gap-2 sm:grid-cols-2">
                {products.map((p) => (
                  <li key={p._id} className="rounded-lg border border-line bg-surface px-3 py-2">
                    <Checkbox name="productIds" value={p._id} defaultChecked={c.productIds.includes(p._id)} label={p.name} hint={p.status === "draft" ? "draft" : p.category?.name} />
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Display">
            <div className="space-y-4">
              <Checkbox name="featured" defaultChecked={c.featured} label="Feature on homepage" hint="The first three featured collections make the Collections section." />
              <Field label="Sort order" name="sortOrder">
                <Input name="sortOrder" inputMode="numeric" defaultValue={c.sortOrder} />
              </Field>
              <SubmitButton className="w-full">{isNew ? "Create collection" : "Save changes"}</SubmitButton>
            </div>
          </Card>
        </div>
      </form>
    </>
  );
}
