import Link from "next/link";
import { listAllProducts, listConversations, listEnquiries, listMedia } from "@/lib/cms/repo";
import { getStore } from "@/lib/cms/store";
import { aiConfigured } from "@/lib/ai";
import { emailConfigured } from "@/lib/email";
import { storageMode } from "@/lib/storage";
import { Badge, Card, Notice, PageHeader, Stat, Table, btnQuiet } from "@/components/admin/ui";

const KIND_LABEL = { enquiry: "Enquiry", appointment: "Appointment", quote: "Quote", product: "Product" } as const;

export default async function Dashboard() {
  const [products, enquiries, chats, media] = await Promise.all([listAllProducts(), listEnquiries(), listConversations(), listMedia()]);
  const backend = getStore().describe();

  const newEnquiries = enquiries.filter((e) => e.status === "new");
  const unanswered = chats.filter((c) => c.unanswered);
  const missing = [
    backend.backend === "file" && "MongoDB (MONGODB_URI) — edits are stored in a local file until it is set",
    storageMode() === "local" && "Cloudflare R2 (R2_*) — uploads go to the server disk until it is set",
    !emailConfigured() && "Resend (RESEND_API_KEY) — enquiries are not emailed until it is set",
    !aiConfigured() && "Gemini (GEMINI_API_KEY) — the concierge answers from FAQs only until it is set",
  ].filter(Boolean) as string[];

  return (
    <>
      <PageHeader title="Dashboard" description="What needs a person today." />

      {missing.length > 0 && (
        <div className="mb-6">
          <Notice tone="warn">
            <span className="font-medium">Not connected yet:</span>
            <ul className="mt-1.5 list-disc space-y-0.5 pl-5">
              {missing.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          </Notice>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="New enquiries" value={newEnquiries.length} href="/admin/inbox?status=new" />
        <Stat label="Unanswered chat questions" value={unanswered.length} href="/admin/chats?unanswered=1" />
        <Stat label="Products live" value={products.filter((p) => p.status === "published").length} href="/admin/products?status=published" />
        <Stat label="Media files" value={media.length} href="/admin/media" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card
          title="Latest enquiries"
          actions={
            <Link href="/admin/inbox" className={btnQuiet}>
              All →
            </Link>
          }
        >
          {enquiries.length === 0 ? (
            <p className="font-sans text-[13px] text-ink-3">Nothing yet. Enquiries from the contact form, product pages and appointment requests land here.</p>
          ) : (
            <Table head={["From", "About", "When", "Status"]}>
              {enquiries.slice(0, 6).map((e) => (
                <tr key={e._id} className="hover:bg-surface">
                  <td className="px-4 py-3">
                    <Link href={`/admin/inbox/${e._id}`} className="block text-ink">
                      {e.name}
                    </Link>
                    <span className="font-mono text-[10px] text-ink-3">{e.email}</span>
                  </td>
                  <td className="px-4 py-3 text-ink-2">
                    {KIND_LABEL[e.kind]}
                    {e.intent ? ` · ${e.intent}` : ""}
                    {e.budget ? ` · ${e.budget}` : ""}
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px] text-ink-3">{new Date(e.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</td>
                  <td className="px-4 py-3">
                    <Badge tone={e.status === "new" ? "warn" : e.status === "won" ? "good" : "neutral"}>{e.status}</Badge>
                  </td>
                </tr>
              ))}
            </Table>
          )}
        </Card>

        <div className="space-y-6">
          <Card title="Shortcuts">
            <ul className="space-y-2.5 font-sans text-[13.5px]">
              {[
                ["/admin/products/new", "Add a product"],
                ["/admin/homepage", "Change the hero slides"],
                ["/admin/faqs/new", "Write an FAQ (teaches the chatbot)"],
                ["/admin/media", "Upload photos or a video"],
                ["/admin/settings", "Hours, phone, notice bar"],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="text-ink hover:text-rose-ink">
                    → {label}
                  </Link>
                </li>
              ))}
            </ul>
          </Card>

          <Card title="Storage">
            <dl className="space-y-2 font-sans text-[12.5px]">
              <div className="flex justify-between gap-3">
                <dt className="text-ink-3">Database</dt>
                <dd className="truncate text-right text-ink">{backend.backend === "mongodb" ? "MongoDB Atlas" : "Local file"}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-ink-3">Media</dt>
                <dd className="text-ink">{storageMode() === "r2" ? "Cloudflare R2" : "Server disk"}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-ink-3">Email</dt>
                <dd className="text-ink">{emailConfigured() ? "Resend" : "Off"}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-ink-3">Chatbot</dt>
                <dd className="text-ink">{aiConfigured() ? "Gemini" : "FAQ only"}</dd>
              </div>
            </dl>
          </Card>
        </div>
      </div>
    </>
  );
}
