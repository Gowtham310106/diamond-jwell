import Link from "next/link";
import { listConversations, remove } from "@/lib/cms/repo";
import { requireAdmin } from "@/lib/admin-session";
import { Badge, EmptyState, Flash, PageHeader, btnQuiet } from "@/components/admin/ui";
import { ConfirmButton } from "@/components/admin/buttons";

async function deleteConversation(form: FormData) {
  "use server";
  await requireAdmin();
  const id = String(form.get("id") ?? "");
  if (id) await remove("conversations", id);
}

export default async function ChatsAdmin(props: { searchParams: Promise<{ unanswered?: string; saved?: string }> }) {
  const { unanswered, saved } = await props.searchParams;
  const all = await listConversations();
  const items = unanswered ? all.filter((c) => c.unanswered) : all;

  return (
    <>
      <PageHeader
        title="Chat logs"
        description="What visitors ask the concierge. A conversation is flagged when the bot had to hand off to the studio — those questions are FAQs waiting to be written."
      />
      <Flash saved={saved} />
      <div className="mb-5 flex gap-2">
        <Link href="/admin/chats" className={`rounded-full border px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] ${!unanswered ? "border-rose bg-rose-soft text-on-rose" : "border-line-2 text-ink-2"}`}>
          All · {all.length}
        </Link>
        <Link href="/admin/chats?unanswered=1" className={`rounded-full border px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] ${unanswered ? "border-rose bg-rose-soft text-on-rose" : "border-line-2 text-ink-2"}`}>
          Unanswered · {all.filter((c) => c.unanswered).length}
        </Link>
      </div>

      {items.length === 0 ? (
        <EmptyState title="No conversations yet" body="Chats are logged the moment a visitor sends a question." />
      ) : (
        <ul className="space-y-3">
          {items.map((c) => {
            const lastQuestion = [...c.turns].reverse().find((t) => t.role === "user")?.content ?? "";
            return (
              <li key={c._id} className="rounded-2xl border border-line bg-canvas">
                <details>
                  <summary className="flex cursor-pointer list-none flex-wrap items-center gap-3 px-5 py-4">
                    <span className="flex-1 font-sans text-[13.5px] text-ink">{lastQuestion}</span>
                    <span className="flex items-center gap-2">
                      {c.unanswered && <Badge tone="warn">unanswered</Badge>}
                      <Badge>{c.source}</Badge>
                      <span className="font-mono text-[10px] text-ink-3">
                        {c.turns.length / 2} turn{c.turns.length > 2 ? "s" : ""} · {new Date(c.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                    </span>
                  </summary>
                  <div className="border-t border-line px-5 py-4">
                    <ol className="space-y-3">
                      {c.turns.map((t, i) => (
                        <li key={i} className={`max-w-[80%] rounded-xl px-4 py-2.5 font-sans text-[13px] leading-relaxed ${t.role === "user" ? "ml-auto bg-rose-soft text-on-rose" : "border border-line bg-surface text-ink-2"}`}>
                          {t.content}
                        </li>
                      ))}
                    </ol>
                    <div className="mt-4 flex items-center justify-between">
                      <Link href={`/admin/faqs/new?question=${encodeURIComponent(lastQuestion.slice(0, 180))}`} className={btnQuiet}>
                        Write an FAQ for this →
                      </Link>
                      <form action={deleteConversation}>
                        <input type="hidden" name="id" value={c._id} />
                        <ConfirmButton message="Delete this conversation?">Delete</ConfirmButton>
                      </form>
                    </div>
                    {c.page && <p className="mt-2 font-mono text-[10px] text-ink-3">Asked on {c.page}</p>}
                  </div>
                </details>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
