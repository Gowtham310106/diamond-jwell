"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, cookieOptions, hashPassword, signSession, verifyPassword } from "@/lib/auth";
import { findAdmin, listAdmins, upsert } from "@/lib/cms/repo";
import type { Admin } from "@/lib/cms/types";

export type LoginState = { error?: string };

/**
 * Sign in. On a fresh install with no admin accounts, the credentials in
 * ADMIN_EMAIL / ADMIN_PASSWORD create the owner — once. After that the env
 * pair is inert and accounts are managed on the Team page.
 */
export async function login(_prev: LoginState, form: FormData): Promise<LoginState> {
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const password = String(form.get("password") ?? "");
  const next = String(form.get("next") ?? "/admin");
  const remember = form.get("remember") === "on" || form.get("remember") === "true";

  if (!email || !password) return { error: "Email and password, please." };

  let admin = await findAdmin(email);

  if (!admin) {
    const admins = await listAdmins();
    const seedEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const seedPassword = process.env.ADMIN_PASSWORD;

    if (admins.length === 0 && seedEmail && seedPassword && email === seedEmail && password === seedPassword) {
      admin = await upsert<Admin>("admins", {
        email,
        name: "Owner",
        passwordHash: hashPassword(password),
        role: "owner",
      });
    } else if (admins.length === 0) {
      return {
        error:
          "No admin account exists yet. Set ADMIN_EMAIL and ADMIN_PASSWORD in the environment and sign in with exactly those to create the owner.",
      };
    }
  }

  if (!admin || !verifyPassword(password, admin.passwordHash)) {
    return { error: "That email and password do not match." };
  }

  let token: string;
  try {
    token = await signSession({ sub: admin._id, email: admin.email, name: admin.name }, remember ? 30 : 1);
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Could not start a session." };
  }

  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, cookieOptions(remember));
  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function logout() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
  redirect("/admin/login");
}
