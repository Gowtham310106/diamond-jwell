/**
 * POST /api/enquiries
 *
 * The contact form, product enquiries and appointment requests all land here.
 * Every submission is written to the inbox first; email is the second copy.
 * A send failure (no key, bad domain) never loses the enquiry — the admin
 * inbox shows "email not sent" on that row instead.
 */

import { NextResponse } from "next/server";
import { getSettings, upsert } from "@/lib/cms/repo";
import type { Enquiry, EnquiryKind } from "@/lib/cms/types";
import { emailConfigured, renderRows, sendMail } from "@/lib/email";

export const runtime = "nodejs";

const KINDS: EnquiryKind[] = ["enquiry", "appointment", "quote", "product"];
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const recent = new Map<string, number[]>();
function tooMany(ip: string) {
  const now = Date.now();
  const list = (recent.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  list.push(now);
  recent.set(ip, list);
  return list.length > 6;
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  if (tooMany(ip)) {
    return NextResponse.json({ error: "Too many messages in a row. Give it a few minutes or call the studio." }, { status: 429 });
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: "Malformed request." }, { status: 400 });

  // Honeypot: real people never see this field.
  if (typeof body.website === "string" && body.website.trim()) return NextResponse.json({ ok: true });

  const str = (k: string, max = 500) => String(body[k] ?? "").trim().slice(0, max);
  const kind = (KINDS.includes(body.kind as EnquiryKind) ? body.kind : "enquiry") as EnquiryKind;
  const name = str("name", 120);
  const email = str("email", 200);
  const message = str("message", 4000);

  const errors: Record<string, string> = {};
  if (name.length < 2) errors.name = "Please tell us your name.";
  if (!EMAIL.test(email)) errors.email = "That email address does not look right.";
  if (message.length < 10) errors.message = "A sentence or two about the piece helps us answer properly.";
  if (Object.keys(errors).length) return NextResponse.json({ errors }, { status: 422 });

  const settings = await getSettings();

  const enquiry = await upsert<Enquiry>("enquiries", {
    kind,
    name,
    email,
    phone: str("phone", 60),
    intent: str("intent", 120),
    budget: str("budget", 120),
    message,
    productSlug: str("productSlug", 200),
    preferredDate: str("preferredDate", 60),
    status: "new",
    notes: "",
    source: kind === "product" ? "product" : "form",
    emailSent: false,
  });

  let emailSent = false;
  if (emailConfigured()) {
    const to = settings.notifications.enquiryTo.length ? settings.notifications.enquiryTo : [settings.contact.email];
    const label = { enquiry: "Enquiry", appointment: "Appointment request", quote: "Quote request", product: "Product enquiry" }[kind];
    const rows: [string, string][] = [
      ["From", name],
      ["Email", email],
      ["Phone", enquiry.phone],
      ["Looking for", enquiry.intent],
      ["Budget", enquiry.budget],
      ["Piece", enquiry.productSlug ? `${settings.brand.url}/products/${enquiry.productSlug}` : ""],
      ["Preferred date", enquiry.preferredDate],
      ["Message", message],
    ];
    const notify = renderRows(`${label} from ${name}`, rows, `Reply to this email to answer ${name} directly. Also in the admin inbox: ${settings.brand.url}/admin/inbox`);
    const sent = await sendMail({ to, subject: `${label}: ${name}`, replyTo: email, ...notify });
    emailSent = sent.ok;
    if (!sent.ok) console.error("[enquiries] notification failed:", sent.detail);

    if (settings.notifications.autoReply) {
      const reply = renderRows(`We have your message, ${name}`, [["", settings.notifications.autoReplyText]]);
      await sendMail({ to: [email], subject: `Thank you from ${settings.brand.name}`, replyTo: settings.contact.email, ...reply });
    }
  }

  if (emailSent) await upsert<Enquiry>("enquiries", { ...enquiry, emailSent: true });

  return NextResponse.json({ ok: true, id: enquiry._id, emailSent });
}
