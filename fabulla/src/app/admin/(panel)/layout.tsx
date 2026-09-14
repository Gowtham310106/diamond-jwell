import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin-session";
import AdminNav from "@/components/admin/AdminNav";
import { logout } from "../login/actions";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Fabulla admin" },
  robots: { index: false, follow: false },
};

/**
 * Admin shell: a fixed sidebar and a scrolling content column. Same palette
 * as the storefront so it reads as the same product, but denser and without
 * the display flourishes — this is a tool the studio uses every day.
 */
export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();

  return (
    <div className="min-h-dvh bg-canvas-2 lg:flex">
      <aside className="border-b border-line bg-canvas lg:sticky lg:top-0 lg:h-dvh lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r">
        <div className="flex h-full flex-col">
          <div className="border-b border-line px-6 py-5">
            <p className="display text-[22px] leading-none tracking-[0.1em] text-ink">FABULLA</p>
            <p className="mt-1.5 font-mono text-[8.5px] uppercase tracking-[0.3em] text-ink-3">Studio admin</p>
          </div>

          <AdminNav />

          <div className="mt-auto border-t border-line px-6 py-4">
            <p className="truncate font-sans text-[12px] text-ink">{admin.name}</p>
            <p className="truncate font-sans text-[11px] text-ink-3">{admin.email}</p>
            <div className="mt-3 flex items-center gap-4">
              <a href="/" target="_blank" rel="noreferrer" className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-2 hover:text-rose-ink">
                View site ↗
              </a>
              <form action={logout}>
                <button type="submit" className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-2 hover:text-rose-ink">
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <div className="mx-auto max-w-6xl px-5 py-8 lg:px-10 lg:py-10">{children}</div>
      </div>
    </div>
  );
}
