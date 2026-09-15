"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SquaresFour,
  Diamond,
  Tag,
  Stack,
  House,
  Sliders,
  Tray,
  Question,
  ChatCircleDots,
  Images,
  Users,
  Plugs,
} from "@phosphor-icons/react";

const GROUPS: { label: string; items: { href: string; label: string; Icon: typeof SquaresFour }[] }[] = [
  {
    label: "Overview",
    items: [{ href: "/admin", label: "Dashboard", Icon: SquaresFour }],
  },
  {
    label: "Catalog",
    items: [
      { href: "/admin/products", label: "Products", Icon: Diamond },
      { href: "/admin/categories", label: "Categories", Icon: Tag },
      { href: "/admin/collections", label: "Collections", Icon: Stack },
      { href: "/admin/media", label: "Media", Icon: Images },
    ],
  },
  {
    label: "Site",
    items: [
      { href: "/admin/homepage", label: "Homepage", Icon: House },
      { href: "/admin/settings", label: "Settings", Icon: Sliders },
      { href: "/admin/faqs", label: "FAQs", Icon: Question },
    ],
  },
  {
    label: "Customers",
    items: [
      { href: "/admin/inbox", label: "Inbox", Icon: Tray },
      { href: "/admin/chats", label: "Chat logs", Icon: ChatCircleDots },
    ],
  },
  {
    label: "System",
    items: [
      { href: "/admin/team", label: "Team", Icon: Users },
      { href: "/admin/integrations", label: "Integrations", Icon: Plugs },
    ],
  },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 overflow-x-auto px-3 py-3 lg:block lg:overflow-visible lg:px-3 lg:py-4" aria-label="Admin">
      {GROUPS.map((group) => (
        <div key={group.label} className="flex shrink-0 gap-1 lg:mb-5 lg:block">
          <p className="hidden px-3 pb-1.5 font-mono text-[9px] uppercase tracking-[0.22em] text-ink-3 lg:block">
            {group.label}
          </p>
          {group.items.map(({ href, label, Icon }) => {
            const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-2.5 whitespace-nowrap rounded-lg px-3 py-2 font-sans text-[13px] transition-colors ${
                  active ? "bg-rose-soft text-on-rose" : "text-ink-2 hover:bg-surface hover:text-ink"
                }`}
              >
                <Icon size={16} weight={active ? "fill" : "light"} className={active ? "text-rose-ink" : ""} />
                {label}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
