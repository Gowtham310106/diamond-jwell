"use client";

import { useState } from "react";
import { CheckCircle, CircleNotch, WarningCircle } from "@phosphor-icons/react";
import type { EnquiryKind } from "@/lib/cms/types";

/**
 * Enquiry form. Posts to /api/enquiries, which writes the message to the
 * admin inbox and emails the studio. The three states (sending, sent, error)
 * are all real: nothing is faked and nothing opens a mail client.
 *
 * `kind` decides the framing: a plain enquiry, an appointment request (asks
 * for a preferred date), a quote, or a question about one piece.
 *
 * Accessibility: every label sits above its control, helper text is present
 * in the markup, errors render below the field and are announced.
 */

type Status = "idle" | "sending" | "sent" | "error";
type Errors = Partial<Record<"name" | "email" | "message", string>>;

const INTENTS = ["A custom piece", "Something from the collection", "Watch work", "A repair or resize", "Not sure yet"];
const BUDGETS = ["Under $2,500", "$2,500 to $5,000", "$5,000 to $10,000", "Over $10,000", "Rather discuss it"];

const field = "w-full rounded-xl border border-line-2 bg-surface px-4 py-3.5 font-sans text-[14px] text-ink transition-colors duration-300 focus:border-rose focus:outline-none";
const labelCls = "block font-mono text-[10px] uppercase tracking-[0.2em] text-ink-2";

const KIND_COPY: Record<EnquiryKind, { heading: string; button: string }> = {
  enquiry: { heading: "Tell us about the piece", button: "Send enquiry" },
  appointment: { heading: "Book a showroom visit", button: "Request appointment" },
  quote: { heading: "Ask for a quote", button: "Request quote" },
  product: { heading: "Ask about this piece", button: "Send enquiry" },
};

export default function EnquiryForm({
  kind = "enquiry",
  productSlug = "",
  productName = "",
  email,
  responseTime,
}: {
  kind?: EnquiryKind;
  productSlug?: string;
  productName?: string;
  email: string;
  responseTime: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [failure, setFailure] = useState<string | null>(null);
  const [mode, setMode] = useState<EnquiryKind>(kind);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const payload = {
      kind: mode,
      name: String(data.get("name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      phone: String(data.get("phone") ?? "").trim(),
      intent: String(data.get("intent") ?? ""),
      budget: String(data.get("budget") ?? ""),
      preferredDate: String(data.get("preferredDate") ?? ""),
      message: String(data.get("message") ?? "").trim(),
      productSlug,
      website: String(data.get("website") ?? ""),
    };

    const next: Errors = {};
    if (payload.name.length < 2) next.name = "Please tell us your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(payload.email)) next.email = "That email address does not look right.";
    if (payload.message.length < 10) next.message = "A sentence or two helps us answer properly.";
    setErrors(next);
    if (Object.keys(next).length > 0) {
      setStatus("error");
      return;
    }

    setStatus("sending");
    setFailure(null);
    try {
      const res = await fetch("/api/enquiries", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const body = (await res.json()) as { ok?: boolean; errors?: Errors; error?: string };
      if (res.status === 422 && body.errors) {
        setErrors(body.errors);
        setStatus("error");
        return;
      }
      if (!res.ok || !body.ok) throw new Error(body.error || "Something went wrong.");
      setStatus("sent");
    } catch (e) {
      setFailure(e instanceof Error ? e.message : "Something went wrong.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-xl border border-line-2 bg-surface p-10" role="status">
        <CheckCircle size={30} weight="light" className="text-rose-ink" />
        <h3 className="display mt-6 text-[28px] text-ink">{mode === "appointment" ? "Request received" : "Message received"}</h3>
        <p className="mt-4 font-sans text-[14.5px] leading-relaxed text-ink-2">
          A real person reads every message. You will hear back within {responseTime}
          {mode === "appointment" ? " to confirm a time" : ""}. If it is urgent, write to{" "}
          <a href={`mailto:${email}`} className="text-rose-ink underline underline-offset-4">
            {email}
          </a>
          .
        </p>
        <button type="button" onClick={() => setStatus("idle")} className="mt-8 font-sans text-[11px] uppercase tracking-[0.16em] text-ink-3 transition-colors hover:text-rose-ink">
          Write another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-7">
      <div>
        <p className={labelCls}>I would like to</p>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {(
            [
              ["enquiry", "Ask a question"],
              ["appointment", "Book a visit"],
              ["quote", "Get a quote"],
            ] as [EnquiryKind, string][]
          ).map(([k, label]) => (
            <button
              key={k}
              type="button"
              onClick={() => setMode(k)}
              aria-pressed={mode === k || (k === "enquiry" && mode === "product")}
              className={`rounded-full border px-4 py-2 font-sans text-[11px] uppercase tracking-[0.14em] transition-colors ${mode === k || (k === "enquiry" && mode === "product") ? "border-rose bg-rose text-ink" : "border-line-2 text-ink-2 hover:border-rose"}`}
            >
              {label}
            </button>
          ))}
        </div>
        {productName && <p className="mt-3 font-sans text-[13px] text-ink-2">About: <span className="text-ink">{productName}</span></p>}
      </div>

      <h3 className="display text-[24px] text-ink">{KIND_COPY[mode].heading}</h3>

      <div className="grid gap-7 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelCls}>Your name</label>
          <input id="name" name="name" autoComplete="name" className={`${field} mt-2`} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "name-error" : undefined} />
          {errors.name && <p id="name-error" role="alert" className="mt-2 font-sans text-[12px] text-rose-ink">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="email" className={labelCls}>Email</label>
          <input id="email" name="email" type="email" autoComplete="email" className={`${field} mt-2`} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "email-error" : undefined} />
          {errors.email && <p id="email-error" role="alert" className="mt-2 font-sans text-[12px] text-rose-ink">{errors.email}</p>}
        </div>
        <div>
          <label htmlFor="phone" className={labelCls}>Phone <span className="normal-case tracking-normal text-ink-3">(optional)</span></label>
          <input id="phone" name="phone" type="tel" autoComplete="tel" className={`${field} mt-2`} />
        </div>
        {mode === "appointment" ? (
          <div>
            <label htmlFor="preferredDate" className={labelCls}>Preferred day</label>
            <input id="preferredDate" name="preferredDate" type="date" className={`${field} mt-2`} />
          </div>
        ) : (
          <div>
            <label htmlFor="intent" className={labelCls}>Looking for</label>
            <select id="intent" name="intent" className={`${field} mt-2`} defaultValue={mode === "product" ? INTENTS[1] : INTENTS[0]}>
              {INTENTS.map((i) => (
                <option key={i}>{i}</option>
              ))}
            </select>
          </div>
        )}
        <div className="sm:col-span-2">
          <label htmlFor="budget" className={labelCls}>Budget <span className="normal-case tracking-normal text-ink-3">(helps us design around it)</span></label>
          <select id="budget" name="budget" className={`${field} mt-2`} defaultValue="">
            <option value="">Prefer not to say</option>
            {BUDGETS.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="message" className={labelCls}>{mode === "appointment" ? "What would you like to see?" : "About the piece"}</label>
        <textarea id="message" name="message" rows={5} className={`${field} mt-2`} aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? "message-error" : undefined} defaultValue={productName ? `I'm interested in the ${productName}. ` : ""} />
        {errors.message && <p id="message-error" role="alert" className="mt-2 font-sans text-[12px] text-rose-ink">{errors.message}</p>}
      </div>

      {/* Honeypot. Hidden from people, filled by bots. */}
      <div className="absolute -left-[9999px] top-0" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {failure && (
        <p role="alert" className="flex items-start gap-2 rounded-xl border border-rose bg-rose-soft px-4 py-3 font-sans text-[13px] text-ink">
          <WarningCircle size={16} className="mt-0.5 shrink-0 text-rose-ink" />
          {failure}
        </p>
      )}

      <button type="submit" disabled={status === "sending"} className="inline-flex items-center gap-2.5 rounded-full bg-rose px-8 py-4 font-sans text-[11px] font-medium uppercase tracking-[0.16em] text-ink transition-colors hover:bg-rose-soft disabled:opacity-50">
        {status === "sending" && <CircleNotch size={14} className="animate-spin" />}
        {KIND_COPY[mode].button}
      </button>
    </form>
  );
}
