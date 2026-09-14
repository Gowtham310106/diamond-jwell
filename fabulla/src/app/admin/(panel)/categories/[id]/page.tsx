import { notFound } from "next/navigation";
import { getCategory } from "@/lib/cms/repo";
import type { Category } from "@/lib/cms/types";
import { Card, Checkbox, Field, Flash, Input, PageHeader, Textarea } from "@/components/admin/ui";
import { ConfirmButton, SubmitButton } from "@/components/admin/buttons";
import MediaPicker from "@/components/admin/MediaPicker";
import ListEditor from "@/components/admin/ListEditor";
import { deleteCategory, saveCategory } from "../actions";

const BLANK: Omit<Category, "_id" | "createdAt" | "updatedAt"> = {
  name: "",
  slug: "",
  description: "",
  image: "",
  bannerImage: "",
  bannerTitle: "",
  children: [],
  sortOrder: 99,
  showInNav: true,
  showInBento: true,
};

export default async function CategoryEditor(props: { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string; error?: string }> }) {
  const { id } = await props.params;
  const { saved, error } = await props.searchParams;
  const isNew = id === "new";
  const existing = isNew ? null : await getCategory(id);
  if (!isNew && !existing) notFound();
  const c = existing ?? BLANK;

  return (
    <>
      <PageHeader
        crumbs={[{ href: "/admin/categories", label: "Categories" }]}
        title={isNew ? "New category" : c.name}
        actions={
          !isNew && (
            <form action={deleteCategory}>
              <input type="hidden" name="id" value={existing!._id} />
              <ConfirmButton message={`Delete "${c.name}"?`}>Delete</ConfirmButton>
            </form>
          )
        }
      />
      <Flash saved={saved} error={error} />

      <form action={saveCategory} className="grid gap-6 lg:grid-cols-[1fr_300px]">
        {!isNew && <input type="hidden" name="id" value={existing!._id} />}
        <div className="space-y-6">
          <Card title="Category">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Name" name="name">
                <Input name="name" defaultValue={c.name} required />
              </Field>
              <Field label="URL slug" name="slug" hint="Blank derives from the name.">
                <Input name="slug" defaultValue={c.slug} />
              </Field>
              <Field label="Description" name="description" className="sm:col-span-2">
                <Textarea name="description" defaultValue={c.description} rows={2} />
              </Field>
            </div>
          </Card>

          <Card title="Images" description="The circle image is the nav thumbnail and the homepage tile — pick something that survives a tight crop. The banner sits on the right of the drop-down menu.">
            <div className="grid gap-6 sm:grid-cols-2">
              <MediaPicker name="image" value={c.image ? [c.image] : []} folder="categories" label="Circle & tile image" />
              <MediaPicker name="bannerImage" value={c.bannerImage ? [c.bannerImage] : []} folder="categories" label="Menu banner image" />
            </div>
            <div className="mt-5">
              <Field label="Menu banner title" name="bannerTitle">
                <Input name="bannerTitle" defaultValue={c.bannerTitle} placeholder="Engagement rings, built around your stone." />
              </Field>
            </div>
          </Card>

          <Card title="Menu links" description="Sub-links inside the drop-down and the mobile menu. Paths like /products?category=rings or /custom.">
            <ListEditor
              name="children"
              value={c.children}
              fields={[
                { key: "name", label: "Label", width: "narrow" },
                { key: "href", label: "Link", width: "wide", placeholder: "/products?category=rings" },
              ]}
              addLabel="Add link"
            />
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Display">
            <div className="space-y-4">
              <Checkbox name="showInNav" defaultChecked={c.showInNav} label="Show in header nav" />
              <Checkbox name="showInBento" defaultChecked={c.showInBento} label="Show on homepage grid" />
              <Field label="Sort order" name="sortOrder">
                <Input name="sortOrder" inputMode="numeric" defaultValue={c.sortOrder} />
              </Field>
              <SubmitButton className="w-full">{isNew ? "Create category" : "Save changes"}</SubmitButton>
            </div>
          </Card>
        </div>
      </form>
    </>
  );
}
