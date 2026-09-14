"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-session";
import { str } from "@/lib/cms/forms";
import { getStore } from "@/lib/cms/store";
import { remove, upsert } from "@/lib/cms/repo";
import type { Enquiry, EnquiryStatus } from "@/lib/cms/types";

const STATUS: EnquiryStatus[] = ["new", "contacted", "won", "closed"];

export async function updateEnquiry(form: FormData) {
  await requireAdmin();
  const id = str(form, "id", 64);
  const e = await getStore().get("enquiries", id);
  if (!e) redirect("/admin/inbox");
  const status = str(form, "status", 20) as EnquiryStatus;
  await upsert<Enquiry>("enquiries", {
    ...e,
    status: STATUS.includes(status) ? status : e.status,
    notes: form.has("notes") ? str(form, "notes", 4000) : e.notes,
  });
  redirect(form.get("back") === "list" ? "/admin/inbox" : `/admin/inbox/${id}?saved=1`);
}

export async function deleteEnquiry(form: FormData) {
  await requireAdmin();
  await remove("enquiries", str(form, "id", 64));
  redirect("/admin/inbox?saved=Enquiry+deleted.");
}
