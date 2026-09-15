import Link from "next/link";
import { listEnquiries } from "@/lib/cms/repo";
import { Badge, EmptyState, Flash, PageHeader, Table } from "@/components/admin/ui";
import { updateEnquiry } from "./actions";

const KIND_LABEL = { enquiry: "Enquiry", appointment: "Appointment", quote: "Quote", product: "Product" } as const;
const TONE = { new: "warn", contacted: "neutral", won: "good", closed: "neutral" } as const;

export default async function InboxAdmin(props: { searchParams: Promise<{ status?: string; saved?: string; error?: string }> }) {
  const { status = "", saved, error } = await props.searchParams;
  const all = await listEnquiries();
  const items = status ? all.filter((e) => e.status === status) : all;

  return (
    <>
      <PageHeader title="Inbox" description="Every enquiry, appointment and quote request from the site. Reply by email; track where each one stands here." />
      <Flash saved={saved} error={error} />

      <div className="mb-5 flex flex-wrap gap-2">
        {[
          ["", "All"],
          ["new", "New"],
          ["contacted", "Contacted"],
          ["won", "Won"],
          ["closed", "Closed"],
        ].map(([value, label]) => (
          <Link
            key={value}
            href={value ? `/admin/inbox?status=${value}` : "/admin/inbox"}
            className={`rounded-full border px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] ${status === value ? "border-rose bg-rose-soft text-on-rose" : "border-line-2 text-ink-2 hover:border-rose"}`}
          >
            {label} · {value ? all.filter((e) => e.status === value).length : all.length}
          </Link>
        ))}
      </div>

      {items.length === 0 ? (
        <EmptyState title="Inbox is clear" body="New submissions appear here the moment they are sent, whether or not email is connected." />
      ) : (
        <Table head={["From", "Type", "Message", "When", "Status", "Email"]}>
          {items.map((e) => (
            <tr key={e._id} className="align-top hover:bg-surface">
              <td className="px-4 py-3">
                <Link href={`/admin/inbox/${e._id}`} className="block text-ink">
                  {e.name}
                </Link>
                <span className="block font-mono text-[10px] text-ink-3">{e.email}</span>
                {e.phone && <span className="block font-mono text-[10px] text-ink-3">{e.phone}</span>}
              </td>
              <td className="px-4 py-3 text-ink-2">
                {KIND_LABEL[e.kind]}
                {e.intent && <span className="block text-[11.5px] text-ink-3">{e.intent}</span>}
                {e.budget && <span className="block text-[11.5px] text-ink-3">{e.budget}</span>}
              </td>
              <td className="max-w-md px-4 py-3 text-ink-2">
                <Link href={`/admin/inbox/${e._id}`} className="line-clamp-2">
                  {e.message}
                </Link>
              </td>
              <td className="whitespace-nowrap px-4 py-3 font-mono text-[11px] text-ink-3">
                {new Date(e.createdAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
              </td>
              <td className="px-4 py-3">
                <form action={updateEnquiry} className="flex items-center gap-2">
                  <input type="hidden" name="id" value={e._id} />
                  <input type="hidden" name="back" value="list" />
                  <select name="status" defaultValue={e.status} className="rounded-lg border border-line-2 bg-surface px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-ink">
                    {["new", "contacted", "won", "closed"].map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <button type="submit" className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-3 hover:text-rose-ink">
                    Set
                  </button>
                </form>
                <span className="mt-1 block">
                  <Badge tone={TONE[e.status]}>{e.status}</Badge>
                </span>
              </td>
              <td className="px-4 py-3">{e.emailSent ? <Badge tone="good">sent</Badge> : <Badge tone="warn">not sent</Badge>}</td>
            </tr>
          ))}
        </Table>
      )}
    </>
  );
}
