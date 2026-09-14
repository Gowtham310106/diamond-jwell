"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-session";
import { bool, csv, int, rows, str } from "@/lib/cms/forms";
import { getSettings, saveSettings } from "@/lib/cms/repo";

export async function saveSiteSettings(form: FormData) {
  await requireAdmin();
  const s = await getSettings();

  await saveSettings({
    brand: {
      name: str(form, "brand_name", 80) || s.brand.name,
      shortName: str(form, "brand_shortName", 40) || s.brand.shortName,
      tagline: str(form, "brand_tagline", 160),
      description: str(form, "brand_description", 300),
      city: str(form, "brand_city", 80),
      origin: str(form, "brand_origin", 80),
      founded: int(form, "brand_founded", s.brand.founded),
      url: str(form, "brand_url", 200).replace(/\/+$/, "") || s.brand.url,
    },
    contact: {
      phone: str(form, "contact_phone", 40),
      email: str(form, "contact_email", 120),
      instagram: str(form, "contact_instagram", 60),
      instagramPersonal: str(form, "contact_instagramPersonal", 60),
      whatsapp: str(form, "contact_whatsapp", 40),
      address: str(form, "contact_address", 200),
      showroom: str(form, "contact_showroom", 120),
      hours: str(form, "contact_hours", 120),
    },
    notice: str(form, "notice", 160),
    metrics: {
      yearsInChicago: str(form, "metrics_yearsInChicago", 20),
      customTimeline: str(form, "metrics_customTimeline", 40),
      diamondsFromSurat: str(form, "metrics_diamondsFromSurat", 20),
      responseTime: str(form, "metrics_responseTime", 40),
      labGrownSaving: str(form, "metrics_labGrownSaving", 40),
    },
    assurances: rows<{ title: string; detail: string }>(form, "assurances").map((a, i) => ({ id: `a${i}`, ...a })),
    testimonials: rows<{ quote: string; name: string; location: string; piece: string }>(form, "testimonials").map((t, i) => ({ id: `t${i}`, ...t })),
    financing: {
      enabled: bool(form, "financing_enabled"),
      text: str(form, "financing_text", 120),
      href: str(form, "financing_href", 300),
    },
    chatbot: {
      enabled: bool(form, "chatbot_enabled"),
      title: str(form, "chatbot_title", 60) || s.chatbot.title,
      intro: str(form, "chatbot_intro", 400),
      suggestions: rows<{ text: string }>(form, "chatbot_suggestions").map((r) => r.text).slice(0, 4),
    },
    notifications: {
      enquiryTo: csv(form, "notifications_enquiryTo"),
      autoReply: bool(form, "notifications_autoReply"),
      autoReplyText: str(form, "notifications_autoReplyText", 600),
    },
    seo: {
      title: str(form, "seo_title", 120),
      description: str(form, "seo_description", 300),
    },
  });

  redirect("/admin/settings?saved=1");
}
