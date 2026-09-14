import type { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

export default async function LoginPage(props: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await props.searchParams;

  return (
    <div className="flex min-h-dvh items-center justify-center bg-canvas-2 px-5 py-16">
      <div className="w-full max-w-sm">
        <p className="display text-center text-[30px] tracking-[0.1em] text-ink">FABULLA</p>
        <p className="mt-1.5 text-center font-mono text-[9px] uppercase tracking-[0.3em] text-ink-3">
          Studio admin
        </p>
        <div className="mt-10 rounded-2xl border border-line bg-surface p-8 shadow-sm">
          <LoginForm next={next ?? "/admin"} />
        </div>
        <p className="mt-6 text-center font-sans text-[12px] text-ink-3">
          First time here? See <span className="font-mono">SETUP.md</span> for the owner account.
        </p>
      </div>
    </div>
  );
}
