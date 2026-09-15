"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-session";
import { json, rows, str, urls } from "@/lib/cms/forms";
import { getSettings, saveSettings } from "@/lib/cms/repo";
import type { HeroSlide, HomeSection, Highlight, ProcessStep, SectionKey } from "@/lib/cms/types";
import { DEFAULT_SETTINGS } from "@/lib/cms/seed";

const KEYS = DEFAULT_SETTINGS.sections.map((s) => s.key);

export async function saveHomepage(form: FormData) {
  await requireAdmin();
  const current = await getSettings();

  const hero = json<HeroSlide[]>(form, "hero", current.hero)
    .filter((s) => s && typeof s === "object")
    .map((s, i) => ({
      id: String(s.id || `hero_${i}`),
      kind: s.kind === "video" ? ("video" as const) : ("image" as const),
      src: String(s.src ?? "").trim(),
      poster: String(s.poster ?? "").trim(),
      eyebrow: String(s.eyebrow ?? "").trim().slice(0, 60),
      title: String(s.title ?? "").trim().slice(0, 120),
      description: String(s.description ?? "").trim().slice(0, 400),
      ctaLabel: String(s.ctaLabel ?? "").trim().slice(0, 60),
      ctaHref: String(s.ctaHref ?? "").trim().slice(0, 300),
      enabled: Boolean(s.enabled),
    }));

  // Sections: keep exactly the known keys, in the order posted, defaults for any missing.
  const posted = json<HomeSection[]>(form, "sections", current.sections).filter((s) => KEYS.includes(s?.key));
  const sections: HomeSection[] = [
    ...posted.map((s) => ({ key: s.key as SectionKey, enabled: Boolean(s.enabled), title: String(s.title ?? "").slice(0, 120), subtitle: String(s.subtitle ?? "").slice(0, 160) })),
    ...current.sections.filter((s) => !posted.some((p) => p.key === s.key)),
  ];

  const highlights: Highlight[] = rows<{ title: string; caption: string; cover: string; video: string }>(form, "highlights").map((h, i) => ({
    id: `h_${i}_${h.title.slice(0, 12).replace(/\W+/g, "")}`,
    title: h.title,
    caption: h.caption,
    cover: h.cover,
    video: h.video,
  }));

  const process: ProcessStep[] = current.process.map((step, i) => ({
    ...step,
    title: str(form, `process_title_${i}`, 80) || step.title,
    body: str(form, `process_body_${i}`, 400) || step.body,
    image: urls(form, `process_image_${i}`)[0] ?? step.image,
  }));

  await saveSettings({
    hero,
    sections,
    highlights,
    process,
    campaign: {
      eyebrow: str(form, "campaign_eyebrow", 60),
      title: str(form, "campaign_title", 120),
      body: str(form, "campaign_body", 400),
    },
    craftsmanship: { image: urls(form, "craftsmanship_image")[0] ?? current.craftsmanship.image },
    about: { image: urls(form, "about_image")[0] ?? current.about.image },
    nav: { allImage: urls(form, "nav_all_image")[0] ?? current.nav.allImage },
  });

  redirect("/admin/homepage?saved=1");
}
