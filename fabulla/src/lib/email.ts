/**
 * Outbound email through Resend.
 *
 * Without RESEND_API_KEY nothing is sent and the caller records that, so an
 * enquiry is never lost: it is always in the admin inbox, and the email is a
 * second copy. EMAIL_FROM must be an address on a domain verified in Resend;
 * `onboarding@resend.dev` works for testing but only delivers to the account
 * owner's own address.
 */

import { Resend } from "resend";

export type Mail = {
  to: string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
};

export function emailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

export async function sendMail(mail: Mail): Promise<{ ok: boolean; detail: string }> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { ok: false, detail: "RESEND_API_KEY not set" };
  const from = process.env.EMAIL_FROM || "Fabulla Diamonds <onboarding@resend.dev>";

  const resend = new Resend(key);
  const { data, error } = await resend.emails.send({
    from,
    to: mail.to,
    subject: mail.subject,
    html: mail.html,
    text: mail.text,
    replyTo: mail.replyTo,
  });

  if (error) return { ok: false, detail: `${error.name}: ${error.message}` };
  return { ok: true, detail: data?.id ?? "sent" };
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** A plain, readable notification. No template engine: the studio reads it on a phone. */
export function renderRows(title: string, rows: [string, string][], footer?: string) {
  const trs = rows
    .filter(([, v]) => v)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px 6px 0;color:#696e7a;font-size:12px;text-transform:uppercase;letter-spacing:.08em;vertical-align:top;white-space:nowrap">${esc(k)}</td><td style="padding:6px 0;color:#0f172a;font-size:15px;line-height:1.5;white-space:pre-wrap">${esc(v)}</td></tr>`
    )
    .join("");
  const html = `<div style="font-family:ui-sans-serif,system-ui,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#0f172a"><h1 style="font-weight:500;font-size:22px;margin:0 0 18px">${esc(title)}</h1><table style="border-collapse:collapse">${trs}</table>${footer ? `<p style="margin-top:24px;color:#696e7a;font-size:13px">${esc(footer)}</p>` : ""}</div>`;
  const text = [title, "", ...rows.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`), footer ? `\n${footer}` : ""].join("\n");
  return { html, text };
}
