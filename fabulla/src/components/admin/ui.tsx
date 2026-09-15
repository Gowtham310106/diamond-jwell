import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Admin primitives. Server-safe (no hooks); the interactive pieces live in
 * their own client files. Class strings are exported so client components
 * can share the exact look without importing a server module's JSX.
 */

export const inputCls =
  "w-full rounded-lg border border-line-2 bg-surface px-3.5 py-2.5 font-sans text-[13.5px] text-ink transition-colors placeholder:text-ink-3 focus:border-rose focus:outline-none disabled:opacity-50";
export const labelCls = "block font-mono text-[10px] uppercase tracking-[0.18em] text-ink-2";
export const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-full bg-rose px-5 py-2.5 font-sans text-[11px] font-medium uppercase tracking-[0.14em] text-on-rose transition-colors hover:bg-rose-soft disabled:opacity-50";
export const btnOutline =
  "inline-flex items-center justify-center gap-2 rounded-full border border-line-2 px-5 py-2.5 font-sans text-[11px] uppercase tracking-[0.14em] text-ink transition-colors hover:border-rose hover:text-rose-ink disabled:opacity-50";
export const btnQuiet =
  "inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-2 transition-colors hover:text-rose-ink disabled:opacity-50";
export const btnDanger =
  "inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-rose-ink transition-colors hover:text-ink disabled:opacity-50";

export function PageHeader({
  title,
  description,
  actions,
  crumbs,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  crumbs?: { href: string; label: string }[];
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        {crumbs && (
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-3">
            {crumbs.map((c, i) => (
              <span key={c.href}>
                {i > 0 && <span className="mx-2">/</span>}
                <Link href={c.href} className="hover:text-rose-ink">
                  {c.label}
                </Link>
              </span>
            ))}
          </p>
        )}
        <h1 className="display text-[32px] leading-none text-ink">{title}</h1>
        {description && <p className="mt-2.5 max-w-xl font-sans text-[13.5px] leading-relaxed text-ink-2">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
    </div>
  );
}

export function Card({
  title,
  description,
  children,
  className,
  actions,
}: {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  actions?: ReactNode;
}) {
  return (
    <section className={cn("rounded-2xl border border-line bg-canvas p-6", className)}>
      {(title || actions) && (
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            {title && <h2 className="display text-[20px] leading-tight text-ink">{title}</h2>}
            {description && <p className="mt-1.5 font-sans text-[12.5px] leading-relaxed text-ink-3">{description}</p>}
          </div>
          {actions}
        </div>
      )}
      {children}
    </section>
  );
}

export function Field({
  label,
  name,
  hint,
  children,
  className,
}: {
  label: string;
  name?: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={name} className={labelCls}>
        {label}
      </label>
      <div className="mt-1.5">{children}</div>
      {hint && <p className="mt-1.5 font-sans text-[11.5px] leading-relaxed text-ink-3">{hint}</p>}
    </div>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} id={props.id ?? props.name} className={cn(inputCls, props.className)} />;
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} id={props.id ?? props.name} className={cn(inputCls, "min-h-[96px] resize-y", props.className)} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} id={props.id ?? props.name} className={cn(inputCls, "pr-9", props.className)} />;
}

export function Checkbox({ label, hint, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string }) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <input type="checkbox" {...props} className="mt-0.5 h-4 w-4 accent-[#a45656]" />
      <span>
        <span className="block font-sans text-[13.5px] text-ink">{label}</span>
        {hint && <span className="block font-sans text-[11.5px] text-ink-3">{hint}</span>}
      </span>
    </label>
  );
}

/**
 * Status tones. Green and amber are the one place the palette cannot help —
 * there is no "success" in a jewelry brand system — so they are the one place
 * that reaches for `dark:`.
 */
const tones = {
  neutral: "border-line-2 text-ink-2",
  good: "border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-400/40 dark:bg-emerald-400/10 dark:text-emerald-300",
  warn: "border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-400/40 dark:bg-amber-400/10 dark:text-amber-300",
  bad: "border-rose bg-rose-soft text-on-rose",
  ink: "border-deep bg-deep text-on-deep",
};

export function Badge({ tone = "neutral", children }: { tone?: keyof typeof tones; children: ReactNode }) {
  return (
    <span className={cn("inline-block rounded-full border px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.16em]", tones[tone])}>
      {children}
    </span>
  );
}

export function Notice({ tone = "neutral", children }: { tone?: keyof typeof tones; children: ReactNode }) {
  return (
    <div className={cn("rounded-xl border px-4 py-3 font-sans text-[13px] leading-relaxed", tones[tone])} role="status">
      {children}
    </div>
  );
}

/** Reads ?saved= / ?error= that server actions redirect with. */
export function Flash({ saved, error }: { saved?: string; error?: string }) {
  if (error) return <div className="mb-6"><Notice tone="bad">{error}</Notice></div>;
  if (saved) return <div className="mb-6"><Notice tone="good">{saved === "1" ? "Saved." : saved}</Notice></div>;
  return null;
}

export function EmptyState({ title, body, action }: { title: string; body?: string; action?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-line-2 px-6 py-14 text-center">
      <p className="display text-[22px] text-ink">{title}</p>
      {body && <p className="mx-auto mt-2 max-w-md font-sans text-[13px] leading-relaxed text-ink-3">{body}</p>}
      {action && <div className="mt-6 flex justify-center">{action}</div>}
    </div>
  );
}

export function Table({ head, children }: { head: string[]; children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-line bg-canvas">
      <table className="w-full text-left font-sans text-[13px]">
        <thead>
          <tr className="border-b border-line">
            {head.map((h) => (
              <th key={h} className="px-4 py-3 font-mono text-[9.5px] font-normal uppercase tracking-[0.18em] text-ink-3">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">{children}</tbody>
      </table>
    </div>
  );
}

export function Stat({ label, value, href }: { label: string; value: string | number; href?: string }) {
  const body = (
    <div className="rounded-2xl border border-line bg-canvas p-5 transition-colors hover:border-rose">
      <p className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-ink-3">{label}</p>
      <p className="display mt-2 text-[34px] leading-none text-ink">{value}</p>
    </div>
  );
  return href ? <Link href={href}>{body}</Link> : body;
}
