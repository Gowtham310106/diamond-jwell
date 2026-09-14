import { notFound } from "next/navigation";
import { getStore } from "@/lib/cms/store";
import { listFaqs } from "@/lib/cms/repo";
import type { Faq } from "@/lib/cms/types";
import { Card, Checkbox, Field, Flash, Input, PageHeader, Textarea } from "@/components/admin/ui";
import { ConfirmButton, SubmitButton } from "@/components/admin/buttons";
import { deleteFaq, saveFaq } from "../actions";

export default async function FaqEditor(props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; error?: string; question?: string }>;
}) {
  const { id } = await props.params;
  const { saved, error, question } = await props.searchParams;
  const isNew = id === "new";
  const existing = isNew ? null : await getStore().get("faqs", id);
  if (!isNew && !existing) notFound();
  const topics = [...new Set((await listFaqs()).map((f) => f.topic))];

  const f: Omit<Faq, "_id" | "createdAt" | "updatedAt"> = existing ?? {
    question: question ?? "",
    answer: "",
    topic: "General",
    sortOrder: 99,
    showOnSite: true,
    useInChat: true,
  };

  return (
    <>
      <PageHeader
        crumbs={[{ href: "/admin/faqs", label: "FAQs" }]}
        title={isNew ? "New FAQ" : "Edit FAQ"}
        actions={
          !isNew && (
            <form action={deleteFaq}>
              <input type="hidden" name="id" value={existing!._id} />
              <ConfirmButton>Delete</ConfirmButton>
            </form>
          )
        }
      />
      <Flash saved={saved} error={error} />
      <form action={saveFaq} className="grid gap-6 lg:grid-cols-[1fr_300px]">
        {!isNew && <input type="hidden" name="id" value={existing!._id} />}
        <Card>
          <div className="space-y-5">
            <Field label="Question" name="question" hint="Written the way a customer would ask it.">
              <Input name="question" defaultValue={f.question} required />
            </Field>
            <Field label="Answer" name="answer" hint="Two to four sentences. The chatbot uses this text, so keep prices and promises accurate.">
              <Textarea name="answer" defaultValue={f.answer} rows={6} required />
            </Field>
            <Field label="Topic" name="topic" hint="Groups the FAQ page.">
              <Input name="topic" defaultValue={f.topic} list="topics" />
              <datalist id="topics">
                {topics.map((t) => (
                  <option key={t} value={t} />
                ))}
              </datalist>
            </Field>
          </div>
        </Card>
        <Card title="Use">
          <div className="space-y-4">
            <Checkbox name="showOnSite" defaultChecked={f.showOnSite} label="Show on the site" hint="Homepage FAQ section and /faq" />
            <Checkbox name="useInChat" defaultChecked={f.useInChat} label="Teach the chatbot" />
            <Field label="Sort order" name="sortOrder">
              <Input name="sortOrder" inputMode="numeric" defaultValue={f.sortOrder} />
            </Field>
            <SubmitButton className="w-full">{isNew ? "Create FAQ" : "Save"}</SubmitButton>
          </div>
        </Card>
      </form>
    </>
  );
}
