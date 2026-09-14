import { notFound } from "next/navigation";
import { getStore } from "@/lib/cms/store";
import { getProduct, getSettings } from "@/lib/cms/repo";
import { Badge, Card, Field, Flash, PageHeader, Select, Textarea, btnOutline } from "@/components/admin/ui";
import { ConfirmButton, SubmitButton } from "@/components/admin/buttons";
import { deleteEnquiry, updateEnquiry } from "../actions";

const KIND_LABEL = { enquiry: "Enquiry", appointment: "Appointment request", quote: "Quote request", product: "Product enquiry" } as const;

export default async function EnquiryDetail(props: { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string; error?: string }> }) {
  const { id } = await props.params;
  const { saved, error } = await props.searchParams;
  const e = await getStore().get("enquiries", id);
  if (!e) notFound();
  const [settings, product] = await Promise.all([getSettings(), e.productSlug ? getProduct(e.productSlug) : null]);

  const subject = encodeURIComponent(`Re: your ${KIND_LABEL[e.kind].toLowerCase()} — ${settings.brand.name}`);
  const body = encodeURIComponent(`Hi ${e.name.split(" ")[0]},\n\n\n\n—\n${settings.brand.name}\n${settings.contact.phone}`);

  return (
    <>
      <PageHeader
        crumbs={[{ href: "/admin/inbox", label: "Inbox" }]}
        title={e.name}
        description={`${KIND_LABEL[e.kind]} · ${new Date(e.createdAt).toLocaleString("en-US", { dateStyle: "long", timeStyle: "short" })}`}
        actions={
          <>
            <a href={`mailto:${e.email}?subject=${subject}&body=${body}`} className={btnOutline}>
              Reply by email
            </a>
            {e.phone && (
              <a href={`tel:${e.phone.replace(/[^\d+]/g, "")}`} className={btnOutline}>
                Call {e.phone}
              </a>
            )}
          </>
        }
      />
      <Flash saved={saved} error={error} />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <Card title="Message">
            <p className="whitespace-pre-wrap font-sans text-[14.5px] leading-relaxed text-ink">{e.message}</p>
            <dl className="mt-6 grid gap-3 border-t border-line pt-5 sm:grid-cols-2">
              {[
                ["Email", e.email],
                ["Phone", e.phone],
                ["Looking for", e.intent],
                ["Budget", e.budget],
                ["Preferred date", e.preferredDate],
                ["Piece", product ? product.name : e.productSlug],
              ]
                .filter(([, v]) => v)
                .map(([k, v]) => (
                  <div key={k}>
                    <dt className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-ink-3">{k}</dt>
                    <dd className="mt-1 font-sans text-[13.5px] text-ink">{v}</dd>
                  </div>
                ))}
            </dl>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Status & notes">
            <form action={updateEnquiry} className="space-y-4">
              <input type="hidden" name="id" value={e._id} />
              <Field label="Status" name="status">
                <Select name="status" defaultValue={e.status}>
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="won">Won — became a sale</option>
                  <option value="closed">Closed</option>
                </Select>
              </Field>
              <Field label="Internal notes" name="notes" hint="Only the team sees these.">
                <Textarea name="notes" defaultValue={e.notes} rows={5} />
              </Field>
              <SubmitButton className="w-full">Save</SubmitButton>
            </form>
            <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
              <span>{e.emailSent ? <Badge tone="good">email sent</Badge> : <Badge tone="warn">email not sent</Badge>}</span>
              <form action={deleteEnquiry}>
                <input type="hidden" name="id" value={e._id} />
                <ConfirmButton message="Delete this enquiry?">Delete</ConfirmButton>
              </form>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
