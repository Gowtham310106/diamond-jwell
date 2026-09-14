import { notFound } from "next/navigation";
import { getProduct, listCategories, listCollections } from "@/lib/cms/repo";
import type { Product } from "@/lib/cms/types";
import { Card, Checkbox, Field, Flash, Input, PageHeader, Select, Textarea } from "@/components/admin/ui";
import { ConfirmButton, SubmitButton } from "@/components/admin/buttons";
import MediaPicker from "@/components/admin/MediaPicker";
import ListEditor from "@/components/admin/ListEditor";
import { deleteProduct, saveProduct } from "../actions";

const BLANK: Omit<Product, "_id" | "createdAt" | "updatedAt"> = {
  slug: "",
  name: "",
  sku: "",
  categoryId: "",
  collectionIds: [],
  price: null,
  compareAtPrice: null,
  priceNote: "",
  blurb: "",
  detail: "",
  specs: [],
  metal: "",
  stone: "",
  caratWeight: "",
  availability: "available",
  status: "draft",
  images: [],
  video: "",
  orientation: "portrait",
  badges: [],
  featured: false,
  tags: [],
  stockCount: null,
  sortOrder: 0,
};

export default async function ProductEditor(props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const { id } = await props.params;
  const { saved, error } = await props.searchParams;
  const isNew = id === "new";
  const existing = isNew ? null : await getProduct(id);
  if (!isNew && !existing) notFound();

  const p = existing ?? BLANK;
  const [categories, collections] = await Promise.all([listCategories(), listCollections()]);

  return (
    <>
      <PageHeader
        crumbs={[{ href: "/admin/products", label: "Products" }]}
        title={isNew ? "New product" : p.name}
        description={isNew ? "Save as a draft first if the photos are not ready; only published pieces show on the site." : `/products/${p.slug}`}
        actions={
          !isNew && (
            <form action={deleteProduct}>
              <input type="hidden" name="id" value={existing!._id} />
              <ConfirmButton message={`Delete "${p.name}"? It comes off the site immediately.`}>Delete</ConfirmButton>
            </form>
          )
        }
      />
      <Flash saved={saved} error={error} />

      <form action={saveProduct} className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {!isNew && <input type="hidden" name="id" value={existing!._id} />}

        <div className="space-y-6">
          <Card title="The piece">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Name" name="name" className="sm:col-span-2">
                <Input name="name" defaultValue={p.name} required placeholder="Halo Engagement Ring" />
              </Field>
              <Field label="URL slug" name="slug" hint="Leave blank to derive from the name. Changing it breaks old links.">
                <Input name="slug" defaultValue={p.slug} placeholder="halo-engagement-ring" />
              </Field>
              <Field label="SKU" name="sku">
                <Input name="sku" defaultValue={p.sku} />
              </Field>
              <Field label="One-line blurb" name="blurb" hint="Shown under the name on cards." className="sm:col-span-2">
                <Input name="blurb" defaultValue={p.blurb} maxLength={200} />
              </Field>
              <Field label="Description" name="detail" className="sm:col-span-2">
                <Textarea name="detail" defaultValue={p.detail} rows={5} />
              </Field>
            </div>
          </Card>

          <Card title="Photos & video" description="First image is the card and the share image. Drop several; drag order with the arrows. The sparkle generates a cleaner or re-angled variant with AI.">
            <MediaPicker name="images" value={p.images} multiple accept="image" folder="products" />
            <div className="mt-6">
              <MediaPicker name="video" value={p.video ? [p.video] : []} accept="video" folder="products" label="Product video (optional)" />
            </div>
          </Card>

          <Card title="Price">
            <div className="grid gap-5 sm:grid-cols-3">
              <Field label="Price (USD)" name="price" hint="Blank = quote only.">
                <Input name="price" inputMode="decimal" defaultValue={p.price ?? ""} placeholder="4800" />
              </Field>
              <Field label="Compare-at price" name="compareAtPrice" hint="Shown struck through when higher.">
                <Input name="compareAtPrice" inputMode="decimal" defaultValue={p.compareAtPrice ?? ""} />
              </Field>
              <Field label="Price note" name="priceNote" hint={`"Starting at", "Request a quote".`}>
                <Input name="priceNote" defaultValue={p.priceNote} />
              </Field>
            </div>
          </Card>

          <Card title="Details" description="Metal, stone and carat drive the filters on the products page. Specs show as the two-column list on the product page.">
            <div className="grid gap-5 sm:grid-cols-3">
              <Field label="Metal" name="metal">
                <Input name="metal" defaultValue={p.metal} placeholder="18k white gold" list="metals" />
              </Field>
              <Field label="Stone" name="stone">
                <Input name="stone" defaultValue={p.stone} placeholder="Natural diamond" list="stones" />
              </Field>
              <Field label="Carat weight" name="caratWeight">
                <Input name="caratWeight" defaultValue={p.caratWeight} placeholder="1.5ct" />
              </Field>
            </div>
            <datalist id="metals">
              {["18k white gold", "18k yellow gold", "14k white gold", "14k yellow gold", "14k rose gold", "Platinum", "Stainless steel"].map((m) => (
                <option key={m} value={m} />
              ))}
            </datalist>
            <datalist id="stones">
              {["Natural diamond", "Lab-grown diamond", "Moissanite", "Pave diamonds", "Natural or lab-grown", "No stones"].map((m) => (
                <option key={m} value={m} />
              ))}
            </datalist>
            <div className="mt-6">
              <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-2">Specifications</p>
              <ListEditor
                name="specs"
                value={p.specs}
                fields={[
                  { key: "label", label: "Label", width: "narrow", placeholder: "Centre stone" },
                  { key: "value", label: "Value", width: "wide", placeholder: "1.5ct round brilliant" },
                ]}
                addLabel="Add spec"
              />
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Publish">
            <div className="space-y-5">
              <Field label="Status" name="status">
                <Select name="status" defaultValue={p.status}>
                  <option value="draft">Draft (hidden)</option>
                  <option value="published">Published</option>
                </Select>
              </Field>
              <Field label="Availability" name="availability">
                <Select name="availability" defaultValue={p.availability}>
                  <option value="available">Available now</option>
                  <option value="inquire">By enquiry</option>
                  <option value="custom">Made to order</option>
                </Select>
              </Field>
              <Field label="Stock count" name="stockCount" hint="Optional. Blank = not tracked.">
                <Input name="stockCount" inputMode="numeric" defaultValue={p.stockCount ?? ""} />
              </Field>
              <SubmitButton className="w-full">{isNew ? "Create product" : "Save changes"}</SubmitButton>
            </div>
          </Card>

          <Card title="Organise">
            <div className="space-y-5">
              <Field label="Category" name="categoryId">
                <Select name="categoryId" defaultValue={p.categoryId} required>
                  <option value="">Choose…</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </Select>
              </Field>
              <div>
                <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-2">Collections</p>
                <div className="space-y-2">
                  {collections.length === 0 && <p className="font-sans text-[12px] text-ink-3">No collections yet.</p>}
                  {collections.map((c) => (
                    <Checkbox key={c._id} name="collectionIds" value={c._id} defaultChecked={p.collectionIds.includes(c._id) || c.productIds.includes((existing?._id ?? "") as string)} label={c.name} />
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-2">Badges</p>
                <div className="space-y-2">
                  <Checkbox name="badges" value="new" defaultChecked={p.badges.includes("new")} label="New arrival" hint="Shows in the New Arrivals row" />
                  <Checkbox name="badges" value="bestseller" defaultChecked={p.badges.includes("bestseller")} label="Best seller" hint="Shows in the Best Sellers row" />
                  <Checkbox name="badges" value="sale" defaultChecked={p.badges.includes("sale")} label="Sale" />
                  <Checkbox name="badges" value="custom" defaultChecked={p.badges.includes("custom")} label="Custom" />
                </div>
              </div>
              <Checkbox name="featured" defaultChecked={p.featured} label="Featured" hint="Campaign grid on the homepage; sorts first in the catalog." />
              <Field label="Tags" name="tags" hint="Comma-separated. Searchable.">
                <Input name="tags" defaultValue={p.tags.join(", ")} placeholder="iced, gift, under-5k" />
              </Field>
              <Field label="Card shape" name="orientation">
                <Select name="orientation" defaultValue={p.orientation}>
                  <option value="portrait">Portrait (4:5)</option>
                  <option value="square">Square</option>
                  <option value="landscape">Landscape (4:3)</option>
                </Select>
              </Field>
              <Field label="Sort order" name="sortOrder" hint="Lower first.">
                <Input name="sortOrder" inputMode="numeric" defaultValue={p.sortOrder} />
              </Field>
            </div>
          </Card>
        </div>
      </form>
    </>
  );
}
