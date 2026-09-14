/**
 * FormData helpers for server actions. Every admin form posts plain fields
 * plus a few JSON-serialised lists from the client editors.
 */

export function str(form: FormData, key: string, max = 2000): string {
  return String(form.get(key) ?? "").trim().slice(0, max);
}

export function num(form: FormData, key: string): number | null {
  const raw = str(form, key, 32).replace(/[$,\s]/g, "");
  if (raw === "") return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

export function int(form: FormData, key: string, fallback = 0): number {
  const n = num(form, key);
  return n === null ? fallback : Math.round(n);
}

export function bool(form: FormData, key: string): boolean {
  const v = form.get(key);
  return v === "on" || v === "true" || v === "1";
}

export function list(form: FormData, key: string): string[] {
  return form.getAll(key).map((v) => String(v).trim()).filter(Boolean);
}

export function csv(form: FormData, key: string): string[] {
  return str(form, key)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function json<T>(form: FormData, key: string, fallback: T): T {
  try {
    const raw = form.get(key);
    if (typeof raw !== "string" || !raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/** Rows from ListEditor: drop rows that are entirely blank, trim the rest. */
export function rows<T extends Record<string, string>>(form: FormData, key: string): T[] {
  return json<Record<string, string>[]>(form, key, [])
    .map((r) => Object.fromEntries(Object.entries(r).map(([k, v]) => [k, String(v ?? "").trim()])))
    .filter((r) => Object.values(r).some(Boolean)) as T[];
}

export function urls(form: FormData, key: string): string[] {
  return json<string[]>(form, key, []).filter((u) => typeof u === "string" && u.trim()).map((u) => u.trim());
}
