"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-session";
import { bool, int, str } from "@/lib/cms/forms";
import { getStore } from "@/lib/cms/store";
import { listFaqs, remove, upsert } from "@/lib/cms/repo";
import type { Faq } from "@/lib/cms/types";

export async function saveFaq(form: FormData) {
  await requireAdmin();
  const id = str(form, "id", 64);
  const existing = id ? await getStore().get("faqs", id) : null;
  const question = str(form, "question", 200);
  const answer = str(form, "answer", 2000);
  if (!question || !answer) redirect(`/admin/faqs/${id || "new"}?error=${encodeURIComponent("Both a question and an answer are needed.")}`);

  const saved = await upsert<Faq>("faqs", {
    _id: existing?._id,
    createdAt: existing?.createdAt,
    question,
    answer,
    topic: str(form, "topic", 60) || "General",
    sortOrder: int(form, "sortOrder", existing?.sortOrder ?? (await listFaqs()).length + 1),
    showOnSite: bool(form, "showOnSite"),
    useInChat: bool(form, "useInChat"),
  });
  redirect(`/admin/faqs/${saved._id}?saved=1`);
}

export async function deleteFaq(form: FormData) {
  await requireAdmin();
  await remove("faqs", str(form, "id", 64));
  redirect("/admin/faqs?saved=FAQ+deleted.");
}
