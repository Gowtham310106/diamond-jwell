"use client";

import { useState } from "react";
import { CheckCircle, CircleNotch, WarningCircle } from "@phosphor-icons/react";
import { CONTACT } from "@/lib/site";

/**
 * Enquiry form.
 *
 * There is no backend in this build. Rather than fake a success toast that
 * sends nothing, a validated submit composes a prefilled email to the studio
 * address and hands off to the visitor's mail client, then shows exactly what
 * happened. For a studio that answers every enquiry personally this is a real
 * path, not a stub.
 *
 * TO WIRE A REAL ENDPOINT: replace the body of `submit` with a POST to your
 * handler and set status to "sent" on a 2xx, "error" otherwise. The three
 * states below already exist, so nothing else changes.
 *
 * Accessibility: every label sits above its control, helper text is present in
 * the markup, errors render below the field and are announced, and no field
 * uses a placeholder as its label.
 */

type Status = "idle" | "sending" | "sent" | "error";
type Errors = Partial<Record<"name" | "email" | "message", string>>;

const INTENTS = [
  "A custom piece",
  "Something from the collection",
  "Watch work",
  "Not sure yet",
];

const BUDGETS = [
  "Under $2,500",
  "$2,500 to $5,000",
  "$5,000 to $10,000",
  "Over $10,000",
  "Rather discuss it",
];

const field =
  "w-full rounded-xl border border-line-2 bg-surface px-4 py-3.5 " +
  "font-sans text-[14px] text-ink transition-colors duration-300 " +
  "focus:border-rose focus:outline-none";

const labelCls =
  "block font-mono text-[10px] uppercase tracking-[0.2em] text-ink-2";

export default function EnquiryForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const intent = String(data.get("intent") ?? "");
    const budget = String(data.get("budget") ?? "");
    const message = String(data.get("message") ?? "").trim();

    const next: Errors = {};
    if (name.length < 2) next.name = "Please tell us your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))
      next.email = "That email address does not look right.";
    if (message.length < 10)
      next.message = "A sentence or two about the piece helps us answer properly.";

    setErrors(next);
    if (Object.keys(next).length > 0) {
      setStatus("error");
      return;
    }

    setStatus("sending");

    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      phone && `Phone: ${phone}`,
      `Looking for: ${intent}`,
      budget && `Budget: ${budget}`,
      "",
      message,
    ]
      .filter(Boolean)
      .join("\n");

    const href = `${CONTACT.emailHref}?subject=${encodeURIComponent(
      `Enquiry from ${name}`
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = href;
    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <div
        className="rounded-xl border border-line-2 bg-surface p-10"
        role="status"
      >
        <CheckCircle size={30} weight="light" className="text-rose-ink" />
        <h3 className="display mt-6 text-[28px] text-ink">
          Your email is ready to send
        </h3>
        <p className="mt-4 font-sans text-[14.5px] leading-relaxed text-ink-2">
          We opened a prefilled message in your mail app. Send it and you will
          hear back within 24 hours. If nothing opened, write to us directly at{" "}
          <a
            href={CONTACT.emailHref}
            className="text-rose-ink underline underline-offset-4"
          >
            {CONTACT.email}
          </a>
          .
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-8 font-sans text-[11px] uppercase tracking-[0.16em] text-ink-3 transition-colors hover:text-rose-ink"
        >
          Write another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-7">
      <div className="grid gap-7 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelCls}>
            Your name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={`${field} mt-3 ${errors.name ? "border-rose" : ""}`}
          />
          {errors.name && <FieldError id="name-error">{errors.name}</FieldError>}
        </div>

        <div>
          <label htmlFor="email" className={labelCls}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={`${field} mt-3 ${errors.email ? "border-rose" : ""}`}
          />
          {errors.email && (
            <FieldError id="email-error">{errors.email}</FieldError>
          )}
        </div>
      </div>

      <div className="grid gap-7 sm:grid-cols-2">
        <div>
          <label htmlFor="phone" className={labelCls}>
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            aria-describedby="phone-help"
            className={`${field} mt-3`}
          />
          <p id="phone-help" className="mt-2.5 font-sans text-[12px] text-ink-3">
            Optional. Faster for custom work.
          </p>
        </div>

        <div>
          <label htmlFor="intent" className={labelCls}>
            What are you after
          </label>
          <select
            id="intent"
            name="intent"
            defaultValue={INTENTS[0]}
            className={`${field} mt-3`}
          >
            {INTENTS.map((i) => (
              <option key={i} value={i} className="bg-surface">
                {i}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="budget" className={labelCls}>
          Budget
        </label>
        <select
          id="budget"
          name="budget"
          defaultValue={BUDGETS[4]}
          aria-describedby="budget-help"
          className={`${field} mt-3`}
        >
          {BUDGETS.map((b) => (
            <option key={b} value={b} className="bg-surface">
              {b}
            </option>
          ))}
        </select>
        <p id="budget-help" className="mt-2.5 font-sans text-[12px] text-ink-3">
          A range is enough. It tells us which stones to look at.
        </p>
      </div>

      <div>
        <label htmlFor="message" className={labelCls}>
          What are you picturing
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : "message-help"}
          className={`${field} mt-3 resize-y ${errors.message ? "border-rose" : ""}`}
        />
        {errors.message ? (
          <FieldError id="message-error">{errors.message}</FieldError>
        ) : (
          <p
            id="message-help"
            className="mt-2.5 font-sans text-[12px] text-ink-3"
          >
            A stone shape, a photo you saw, a deadline. Anything at all.
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-rose px-8 py-4 font-sans text-[11px] font-medium uppercase tracking-[0.16em] text-ink transition-all duration-300 hover:bg-rose-soft active:translate-y-[1px] disabled:opacity-60"
      >
        {status === "sending" && (
          <CircleNotch size={14} weight="bold" className="animate-spin" />
        )}
        {status === "sending" ? "Preparing" : "Send enquiry"}
      </button>
    </form>
  );
}

function FieldError({ id, children }: { id: string; children: string }) {
  return (
    <p
      id={id}
      role="alert"
      className="mt-2.5 flex items-center gap-2 font-sans text-[12px] text-rose-ink"
    >
      <WarningCircle size={13} weight="light" />
      {children}
    </p>
  );
}
