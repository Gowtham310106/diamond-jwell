import { getSettings } from "@/lib/cms/repo";
import { Card, Field, Flash, Input, PageHeader, Textarea } from "@/components/admin/ui";
import { SubmitButton } from "@/components/admin/buttons";
import HeroEditor from "@/components/admin/HeroEditor";
import SectionsEditor from "@/components/admin/SectionsEditor";
import ListEditor from "@/components/admin/ListEditor";
import MediaPicker from "@/components/admin/MediaPicker";
import { saveHomepage } from "./actions";

export default async function HomepageAdmin(props: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  const { saved, error } = await props.searchParams;
  const s = await getSettings();

  return (
    <>
      <PageHeader title="Homepage" description="Hero slides, which sections show and in what order, and the copy on the editorial blocks. Products in the rows come from their badges." />
      <Flash saved={saved} error={error} />

      <form action={saveHomepage} className="space-y-6">
        <Card title="Hero slides" description="Full-width at the top of the page. Images or MP4 clips; a poster still keeps a video slide from flashing black while it loads.">
          <HeroEditor name="hero" value={s.hero} />
        </Card>

        <Card title="Sections" description="Untick to hide a section; drag order with the arrows. Rows fill themselves: New arrivals from the 'New' badge, Best sellers from the 'Best seller' badge, Collections from featured collections, FAQ from FAQs marked 'show on site'.">
          <SectionsEditor name="sections" value={s.sections} />
        </Card>

        <Card title="Campaign card" description="The dark editorial card beside the featured product grid.">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Eyebrow" name="campaign_eyebrow">
              <Input name="campaign_eyebrow" defaultValue={s.campaign.eyebrow} />
            </Field>
            <Field label="Title" name="campaign_title">
              <Input name="campaign_title" defaultValue={s.campaign.title} />
            </Field>
            <Field label="Body" name="campaign_body" className="sm:col-span-2">
              <Textarea name="campaign_body" defaultValue={s.campaign.body} rows={2} />
            </Field>
          </div>
        </Card>

        <Card title="Instagram highlights" description="The circular tray and coverflow. Cover is a still; the video is optional and plays in a lightbox when set. Paste a URL from the media library or upload on the Media page first.">
          <ListEditor
            name="highlights"
            value={s.highlights.map((h) => ({ title: h.title, caption: h.caption, cover: h.cover, video: h.video }))}
            fields={[
              { key: "title", label: "Title", width: "narrow" },
              { key: "caption", label: "Caption", width: "narrow" },
              { key: "cover", label: "Cover image URL", width: "narrow", placeholder: "/images/… or https://…" },
              { key: "video", label: "Video URL (optional)", width: "narrow" },
            ]}
            addLabel="Add highlight"
            max={10}
          />
        </Card>

        <Card title="Custom process" description="The three steps on the /custom page, each with its own plate.">
          <div className="grid gap-6 md:grid-cols-3">
            {s.process.map((step, i) => (
              <div key={step.id} className="space-y-3 rounded-xl border border-line bg-surface p-4">
                <MediaPicker name={`process_image_${i}`} value={step.image ? [step.image] : []} folder="pages" label={`Step ${i + 1} image`} />
                <Input name={`process_title_${i}`} defaultValue={step.title} aria-label="Step title" />
                <Textarea name={`process_body_${i}`} defaultValue={step.body} rows={3} aria-label="Step body" />
              </div>
            ))}
          </div>
        </Card>

        <Card title="Other plates">
          <div className="grid gap-6 sm:grid-cols-2">
            <MediaPicker name="craftsmanship_image" value={s.craftsmanship.image ? [s.craftsmanship.image] : []} folder="pages" label="Craftsmanship section image" />
            <MediaPicker name="about_image" value={s.about.image ? [s.about.image] : []} folder="pages" label="About page image" />
          </div>
        </Card>

        <div className="sticky bottom-4 flex justify-end">
          <SubmitButton>Save homepage</SubmitButton>
        </div>
      </form>
    </>
  );
}
