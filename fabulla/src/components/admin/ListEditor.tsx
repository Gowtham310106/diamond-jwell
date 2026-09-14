"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, Plus, X } from "@phosphor-icons/react";
import { btnOutline, inputCls } from "./ui";

/**
 * Repeatable rows of small text fields — specs on a product, links under a
 * category, testimonials, assurances. Serialises to one hidden JSON input so
 * the server action reads a list, not twenty numbered fields.
 */

export type ListField = { key: string; label: string; type?: "text" | "textarea"; placeholder?: string; width?: "narrow" | "wide" };

type Row = Record<string, string>;

export default function ListEditor({
  name,
  value,
  fields,
  addLabel = "Add row",
  max = 30,
}: {
  name: string;
  value: Row[];
  fields: ListField[];
  addLabel?: string;
  max?: number;
}) {
  const [rows, setRows] = useState<Row[]>(value);

  function update(i: number, key: string, v: string) {
    setRows((r) => r.map((row, j) => (j === i ? { ...row, [key]: v } : row)));
  }
  function move(i: number, dir: -1 | 1) {
    setRows((r) => {
      const next = r.slice();
      const j = i + dir;
      if (j < 0 || j >= next.length) return r;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }

  return (
    <div>
      <input type="hidden" name={name} value={JSON.stringify(rows)} />
      <ul className="space-y-2">
        {rows.map((row, i) => (
          <li key={i} className="flex items-start gap-2 rounded-xl border border-line bg-surface p-3">
            <div className="grid flex-1 gap-2 sm:grid-cols-12">
              {fields.map((f) => {
                const span = f.width === "wide" ? "sm:col-span-8" : f.width === "narrow" ? "sm:col-span-3" : "sm:col-span-6";
                return f.type === "textarea" ? (
                  <textarea
                    key={f.key}
                    value={row[f.key] ?? ""}
                    onChange={(e) => update(i, f.key, e.target.value)}
                    placeholder={f.placeholder ?? f.label}
                    aria-label={f.label}
                    className={`${inputCls} min-h-[60px] ${span} sm:col-span-12`}
                  />
                ) : (
                  <input
                    key={f.key}
                    value={row[f.key] ?? ""}
                    onChange={(e) => update(i, f.key, e.target.value)}
                    placeholder={f.placeholder ?? f.label}
                    aria-label={f.label}
                    className={`${inputCls} ${span}`}
                  />
                );
              })}
            </div>
            <div className="flex shrink-0 flex-col gap-0.5 pt-1">
              <button type="button" onClick={() => move(i, -1)} aria-label="Move up" className="rounded p-1 text-ink-3 hover:text-ink">
                <ArrowUp size={12} />
              </button>
              <button type="button" onClick={() => move(i, 1)} aria-label="Move down" className="rounded p-1 text-ink-3 hover:text-ink">
                <ArrowDown size={12} />
              </button>
              <button type="button" onClick={() => setRows((r) => r.filter((_, j) => j !== i))} aria-label="Remove" className="rounded p-1 text-ink-3 hover:text-rose-ink">
                <X size={12} />
              </button>
            </div>
          </li>
        ))}
      </ul>
      {rows.length < max && (
        <button
          type="button"
          onClick={() => setRows((r) => [...r, Object.fromEntries(fields.map((f) => [f.key, ""]))])}
          className={`${btnOutline} mt-3`}
        >
          <Plus size={13} /> {addLabel}
        </button>
      )}
    </div>
  );
}
