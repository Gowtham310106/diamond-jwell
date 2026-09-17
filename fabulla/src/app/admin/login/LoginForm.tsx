"use client";

import { useActionState, useEffect, useState } from "react";
import { CircleNotch, Eye, EyeSlash } from "@phosphor-icons/react";
import { login, type LoginState } from "./actions";

const field =
  "w-full rounded-xl border border-line-2 bg-canvas px-4 py-3 font-sans text-[14px] text-ink transition-colors focus:border-rose focus:outline-none";
const label = "block font-mono text-[10px] uppercase tracking-[0.2em] text-ink-2";

export default function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [remember, setRemember] = useState(true);

  useEffect(() => {
    try {
      const savedEmail = localStorage.getItem("fabulla_admin_email");
      if (savedEmail) {
        setEmail(savedEmail);
        setRemember(true);
      }
    } catch {
      // LocalStorage access may be restricted in private browsing
    }
  }, []);

  const handleFormSubmit = () => {
    try {
      if (remember && email) {
        localStorage.setItem("fabulla_admin_email", email);
      } else if (!remember) {
        localStorage.removeItem("fabulla_admin_email");
      }
    } catch {
      // LocalStorage access safe-guard
    }
  };

  return (
    <form action={action} onSubmit={handleFormSubmit} className="space-y-6" noValidate>
      <input type="hidden" name="next" value={next} />
      <div>
        <label htmlFor="email" className={label}>
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`${field} mt-2`}
        />
      </div>
      <div>
        <label htmlFor="password" className={label}>
          Password
        </label>
        <div className="relative mt-2">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            className={`${field} pr-11`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-3 transition-colors hover:text-ink focus:outline-none"
          >
            {showPassword ? (
              <EyeSlash size={18} weight="light" />
            ) : (
              <Eye size={18} weight="light" />
            )}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <label className="group flex cursor-pointer items-center gap-2.5 select-none">
          <input
            type="checkbox"
            name="remember"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="h-4 w-4 rounded border-line-2 bg-canvas text-rose accent-rose focus:ring-0 focus:ring-offset-0 cursor-pointer"
          />
          <span className="font-sans text-[13px] text-ink-2 transition-colors group-hover:text-ink">
            Remember me
          </span>
        </label>
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
