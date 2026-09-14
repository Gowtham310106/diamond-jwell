import { getSettings } from "@/lib/cms/repo";
import { Card, Checkbox, Field, Flash, Input, PageHeader, Textarea } from "@/components/admin/ui";
import { SubmitButton } from "@/components/admin/buttons";
import ListEditor from "@/components/admin/ListEditor";
import { saveSiteSettings } from "./actions";

export default async function SettingsAdmin(props: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  const { saved, error } = await props.searchParams;
  const s = await getSettings();

  return (
    <>
      <PageHeader title="Settings" description="Brand, contact details, the notice bar, numbers quoted across the site, and how the chatbot and enquiry emails behave." />
      <Flash saved={saved} error={error} />

      <form action={saveSiteSettings} className="space-y-6">
        <Card title="Brand">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Business name" name="brand_name"><Input name="brand_name" defaultValue={s.brand.name} /></Field>
            <Field label="Short name" name="brand_shortName"><Input name="brand_shortName" defaultValue={s.brand.shortName} /></Field>
            <Field label="Tagline" name="brand_tagline" className="sm:col-span-2"><Input name="brand_tagline" defaultValue={s.brand.tagline} /></Field>
            <Field label="Description" name="brand_description" hint="Footer and default share text." className="sm:col-span-2"><Textarea name="brand_description" defaultValue={s.brand.description} rows={2} /></Field>
            <Field label="City" name="brand_city"><Input name="brand_city" defaultValue={s.brand.city} /></Field>
            <Field label="Origin" name="brand_origin"><Input name="brand_origin" defaultValue={s.brand.origin} /></Field>
            <Field label="Founded" name="brand_founded"><Input name="brand_founded" inputMode="numeric" defaultValue={s.brand.founded} /></Field>
            <Field label="Site URL" name="brand_url" hint="Used in emails and share links."><Input name="brand_url" defaultValue={s.brand.url} /></Field>
          </div>
        </Card>

        <Card title="Contact">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Phone" name="contact_phone"><Input name="contact_phone" defaultValue={s.contact.phone} /></Field>
            <Field label="Email" name="contact_email"><Input name="contact_email" type="email" defaultValue={s.contact.email} /></Field>
            <Field label="Instagram" name="contact_instagram"><Input name="contact_instagram" defaultValue={s.contact.instagram} placeholder="@handle" /></Field>
            <Field label="Personal Instagram" name="contact_instagramPersonal"><Input name="contact_instagramPersonal" defaultValue={s.contact.instagramPersonal} /></Field>
            <Field label="WhatsApp number" name="contact_whatsapp" hint="Optional. International format; adds a WhatsApp link."><Input name="contact_whatsapp" defaultValue={s.contact.whatsapp} placeholder="+12246471571" /></Field>
            <Field label="Street address" name="contact_address" hint="Optional. Shown on the contact page and in search results."><Input name="contact_address" defaultValue={s.contact.address} /></Field>
            <Field label="Showroom line" name="contact_showroom"><Input name="contact_showroom" defaultValue={s.contact.showroom} /></Field>
            <Field label="Hours" name="contact_hours"><Input name="contact_hours" defaultValue={s.contact.hours} /></Field>
          </div>
        </Card>

        <Card title="Notice bar & numbers" description="The strip above the header, and the figures quoted in copy across the site.">
          <Field label="Notice bar" name="notice"><Input name="notice" defaultValue={s.notice} /></Field>
          <div className="mt-5 grid gap-5 sm:grid-cols-3">
            <Field label="Years in Chicago" name="metrics_yearsInChicago"><Input name="metrics_yearsInChicago" defaultValue={s.metrics.yearsInChicago} /></Field>
            <Field label="Custom timeline" name="metrics_customTimeline"><Input name="metrics_customTimeline" defaultValue={s.metrics.customTimeline} /></Field>
            <Field label="Response time" name="metrics_responseTime"><Input name="metrics_responseTime" defaultValue={s.metrics.responseTime} /></Field>
            <Field label="Diamonds cut in Surat" name="metrics_diamondsFromSurat"><Input name="metrics_diamondsFromSurat" defaultValue={s.metrics.diamondsFromSurat} /></Field>
            <Field label="Lab-grown saving" name="metrics_labGrownSaving"><Input name="metrics_labGrownSaving" defaultValue={s.metrics.labGrownSaving} /></Field>
          </div>
        </Card>

        <Card title="Assurance badges" description="Six small promises on the homepage.">
          <ListEditor name="assurances" value={s.assurances.map((a) => ({ title: a.title, detail: a.detail }))} fields={[{ key: "title", label: "Title" }, { key: "detail", label: "Detail" }]} addLabel="Add badge" max={8} />
        </Card>

        <Card title="Testimonials">
          <ListEditor
            name="testimonials"
            value={s.testimonials.map((t) => ({ quote: t.quote, name: t.name, location: t.location, piece: t.piece }))}
            fields={[
              { key: "quote", label: "Quote", type: "textarea" },
              { key: "name", label: "Name", width: "narrow" },
              { key: "location", label: "Location", width: "narrow" },
              { key: "piece", label: "Piece", width: "narrow" },
            ]}
            addLabel="Add testimonial"
            max={12}
          />
        </Card>

        <Card title="Financing banner" description="Optional strip on product pages. Wire it to Affirm/Klarna/your own page.">
          <div className="grid gap-5 sm:grid-cols-[auto_1fr_1fr] sm:items-end">
            <Checkbox name="financing_enabled" defaultChecked={s.financing.enabled} label="Show" />
            <Field label="Text" name="financing_text"><Input name="financing_text" defaultValue={s.financing.text} /></Field>
            <Field label="Link" name="financing_href"><Input name="financing_href" defaultValue={s.financing.href} /></Field>
          </div>
        </Card>

        <Card title="Chatbot" description="The concierge. Answers come from Gemini grounded in this site's data when GEMINI_API_KEY is set, otherwise from the FAQ list.">
          <div className="space-y-5">
            <Checkbox name="chatbot_enabled" defaultChecked={s.chatbot.enabled} label="Show the chat launcher on the site" />
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Panel title" name="chatbot_title"><Input name="chatbot_title" defaultValue={s.chatbot.title} /></Field>
              <Field label="Opening line" name="chatbot_intro" className="sm:col-span-2"><Textarea name="chatbot_intro" defaultValue={s.chatbot.intro} rows={2} /></Field>
            </div>
            <div>
              <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-2">Suggested questions (up to 4)</p>
              <ListEditor name="chatbot_suggestions" value={s.chatbot.suggestions.map((text) => ({ text }))} fields={[{ key: "text", label: "Question", width: "wide" }]} addLabel="Add question" max={4} />
            </div>
          </div>
        </Card>

        <Card title="Enquiry emails" description="Every form submission lands in the Inbox regardless. With Resend connected it is also emailed.">
          <div className="space-y-5">
            <Field label="Send enquiries to" name="notifications_enquiryTo" hint="Comma-separated. Blank uses the contact email above.">
              <Input name="notifications_enquiryTo" defaultValue={s.notifications.enquiryTo.join(", ")} />
            </Field>
            <Checkbox name="notifications_autoReply" defaultChecked={s.notifications.autoReply} label="Send the customer an automatic acknowledgement" />
            <Field label="Acknowledgement text" name="notifications_autoReplyText"><Textarea name="notifications_autoReplyText" defaultValue={s.notifications.autoReplyText} rows={3} /></Field>
          </div>
        </Card>

        <Card title="Search engines">
          <div className="grid gap-5">
            <Field label="Site title" name="seo_title"><Input name="seo_title" defaultValue={s.seo.title} /></Field>
            <Field label="Site description" name="seo_description"><Textarea name="seo_description" defaultValue={s.seo.description} rows={2} /></Field>
          </div>
        </Card>

        <div className="sticky bottom-4 flex justify-end">
          <SubmitButton>Save settings</SubmitButton>
        </div>
      </form>
    </>
  );
}
