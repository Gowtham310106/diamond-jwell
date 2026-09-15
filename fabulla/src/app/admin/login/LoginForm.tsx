"use client";

import { useActionState } from "react";
import { CircleNotch } from "@phosphor-icons/react";
import { login, type LoginState } from "./actions";

const field =
  "w-full rounded-xl border border-line-2 bg-canvas px-4 py-3 font-sans text-[14px] text-ink transition-colors focus:border-rose focus:outline-none";
const label = "block font-mono text-[10px] uppercase tracking-[0.2em] text-ink-2";

export default function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});

  return (
    <form action={action} className="space-y-6" noValidate>
      <input type="hidden" name="next" value={next} />
      <div>
        <label htmlFor="email" className={label}>
          Email
        </label>
        <input id="email" name="email" type="email" autoComplete="username" required className={`${field} mt-2`} />
      </div>
      <div>
        <label htmlFor="password" className={label}>
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={`${field} mt-2`}
        />
      </div>

      {state.error && (
        <p role="alert" className="rounded-xl border border-rose bg-rose-soft px-4 py-3 font-sans text-[13px] leading-relaxed text-on-rose">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="flex w-full items-center justify-center gap-2.5 rounded-full bg-rose px-7 py-3.5 font-sans text-[11px] font-medium uppercase tracking-[0.16em] text-on-rose transition-colors hover:bg-rose-soft disabled:opacity-50"
      >
        {pending && <CircleNotch size={14} className="animate-spin" />}
        Sign in
      </button>
    </form>
  );
}
