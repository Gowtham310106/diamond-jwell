import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, verifySession, type Session } from "./auth";

/** The signed-in admin, or null. Server components and actions only. */
export async function currentAdmin(): Promise<Session | null> {
  const jar = await cookies();
  return verifySession(jar.get(SESSION_COOKIE)?.value);
}

/** The proxy already gates /admin; this is the belt to its braces for actions. */
export async function requireAdmin(): Promise<Session> {
  const session = await currentAdmin();
  if (!session) redirect("/admin/login");
  return session;
}
