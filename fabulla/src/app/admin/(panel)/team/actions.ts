"use server";

import { redirect } from "next/navigation";
import { currentAdmin, requireAdmin } from "@/lib/admin-session";
import { hashPassword } from "@/lib/auth";
import { str } from "@/lib/cms/forms";
import { getStore } from "@/lib/cms/store";
import { findAdmin, listAdmins, remove, upsert } from "@/lib/cms/repo";
import type { Admin } from "@/lib/cms/types";

const back = (msg: string, ok = true) => redirect(`/admin/team?${ok ? "saved" : "error"}=${encodeURIComponent(msg)}`);

export async function addAdmin(form: FormData) {
  await requireAdmin();
  const email = str(form, "email", 120).toLowerCase();
  const name = str(form, "name", 80) || email.split("@")[0];
  const password = String(form.get("password") ?? "");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) back("That email does not look right.", false);
  if (password.length < 10) back("Passwords need at least 10 characters.", false);
  if (await findAdmin(email)) back("There is already an account with that email.", false);
  await upsert<Admin>("admins", { email, name, passwordHash: hashPassword(password), role: "staff" });
  back(`${name} can now sign in.`);
}

export async function removeAdmin(form: FormData) {
  const me = await requireAdmin();
  const id = str(form, "id", 64);
  if (id === me.sub) back("You cannot remove your own account.", false);
  const admins = await listAdmins();
  const target = admins.find((a) => a._id === id);
  if (!target) back("Account not found.", false);
  if (target!.role === "owner" && admins.filter((a) => a.role === "owner").length === 1) back("Add another owner before removing this one.", false);
  await remove("admins", id);
  back("Account removed.");
}

export async function changePassword(form: FormData) {
  const me = await currentAdmin();
  if (!me) redirect("/admin/login");
  const password = String(form.get("password") ?? "");
  if (password.length < 10) back("Passwords need at least 10 characters.", false);
  const admin = await getStore().get("admins", me.sub);
  if (!admin) back("Account not found.", false);
  await upsert<Admin>("admins", { ...admin!, passwordHash: hashPassword(password) });
  back("Password changed.");
}
