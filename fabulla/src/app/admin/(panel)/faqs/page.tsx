import Link from "next/link";
import { Plus } from "@phosphor-icons/react/ssr";
import { listFaqs } from "@/lib/cms/repo";
import { Badge, EmptyState, Flash, PageHeader, Table, btnPrimary } from "@/components/admin/ui";

export default async function FaqsAdmin(props: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  const { saved, error } = await props.searchParams;
  const faqs = await listFaqs();

  return (
    <>
      <PageHeader
        title="FAQs"
        description="The questions customers keep asking. Each one can show on the site, teach the chatbot, or both. Chat logs flag questions the bot could not answer — turn those into entries here."
        actions={
          <Link href="/admin/faqs/new" className={btnPrimary}>
            <Plus size={13} /> New FAQ
          </Link>
        }
      />
      <Flash saved={saved} error={error} />
      {faqs.length === 0 ? (
        <EmptyState title="No FAQs yet" body="Start with the five questions the phone rings about most." />
      ) : (
        <Table head={["Question", "Topic", "Used", "Order"]}>
          {faqs.map((f) => (
            <tr key={f._id} className="hover:bg-surface">
              <td className="px-4 py-3">
                <Link href={`/admin/faqs/${f._id}`} className="block text-ink">
                  {f.question}
                </Link>
                <span className="line-clamp-1 font-sans text-[11.5px] text-ink-3">{f.answer}</span>
              </td>
              <td className="px-4 py-3 text-ink-2">{f.topic}</td>
              <td className="px-4 py-3">
                <span className="flex gap-1">
                  {f.showOnSite && <Badge>site</Badge>}
                  {f.useInChat && <Badge tone="good">chat</Badge>}
                </span>
              </td>
              <td className="px-4 py-3 font-mono text-[12px] text-ink-3">{f.sortOrder}</td>
            </tr>
          ))}
        </Table>
      )}
    </>
  );
}
