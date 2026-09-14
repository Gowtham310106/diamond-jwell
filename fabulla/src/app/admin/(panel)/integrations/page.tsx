import { pingAi, CHAT_MODEL, IMAGE_MODEL } from "@/lib/ai";
import { pingStore } from "@/lib/cms/store";
import { emailConfigured } from "@/lib/email";
import { pingStorage } from "@/lib/storage";
import { Badge, Card, PageHeader, Table } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

const ENV: { name: string; purpose: string; where: string; required: boolean }[] = [
  { name: "MONGODB_URI", purpose: "MongoDB Atlas connection string", where: "Atlas → Connect → Drivers", required: true },
  { name: "MONGODB_DB", purpose: "Database name (default: fabulla)", where: "Any name", required: false },
  { name: "ADMIN_SESSION_SECRET", purpose: "Signs admin login cookies (32+ random chars)", where: "Generate one", required: true },
  { name: "ADMIN_EMAIL", purpose: "First owner account (used once)", where: "You", required: true },
  { name: "ADMIN_PASSWORD", purpose: "First owner password (used once)", where: "You", required: true },
  { name: "R2_ACCOUNT_ID", purpose: "Cloudflare account id", where: "Cloudflare → R2 → overview", required: true },
  { name: "R2_ACCESS_KEY_ID", purpose: "R2 API token key", where: "R2 → Manage API tokens", required: true },
  { name: "R2_SECRET_ACCESS_KEY", purpose: "R2 API token secret", where: "R2 → Manage API tokens", required: true },
  { name: "R2_BUCKET", purpose: "Bucket name", where: "R2 → your bucket", required: true },
  { name: "R2_PUBLIC_URL", purpose: "Bucket's public URL (custom domain or r2.dev)", where: "R2 → bucket → Settings → Public access", required: true },
  { name: "RESEND_API_KEY", purpose: "Sends enquiry emails", where: "resend.com → API keys", required: true },
  { name: "EMAIL_FROM", purpose: `Sender, e.g. "Fabulla <hello@fabulladiamonds.com>"`, where: "A domain verified in Resend", required: true },
  { name: "GEMINI_API_KEY", purpose: "Chatbot + AI image variants", where: "aistudio.google.com → API keys", required: true },
  { name: "GEMINI_CHAT_MODEL", purpose: `Chat model (default ${CHAT_MODEL})`, where: "Optional override", required: false },
  { name: "GEMINI_IMAGE_MODEL", purpose: `Image model (default ${IMAGE_MODEL})`, where: "Optional override", required: false },
];

export default async function IntegrationsAdmin() {
  const [store, storage, ai] = await Promise.all([pingStore(), pingStorage(), pingAi()]);
  const email = emailConfigured();

  const rows = [
    { name: "Database", ok: store.ok && !store.detail.includes("cms.json"), detail: store.detail.includes("cms.json") ? "Local file store — set MONGODB_URI for Atlas" : store.detail, warn: store.detail.includes("cms.json") },
    { name: "Media storage", ok: storage.ok && storage.mode === "r2", detail: storage.detail, warn: storage.mode === "local" },
    { name: "Email (Resend)", ok: email, detail: email ? `Sending as ${process.env.EMAIL_FROM || "onboarding@resend.dev (test only)"}` : "RESEND_API_KEY not set — enquiries stay in the inbox only", warn: !email },
    { name: "Gemini", ok: ai.ok, detail: ai.detail, warn: !ai.ok },
  ];

  return (
    <>
      <PageHeader title="Integrations" description="Live status of every external service, and the exact environment variables to set in Vercel. Full walkthrough in SETUP.md in the repository." />

      <Card title="Status" className="mb-6">
        <ul className="divide-y divide-line">
          {rows.map((r) => (
            <li key={r.name} className="flex flex-wrap items-start justify-between gap-3 py-3">
              <div>
                <p className="font-sans text-[13.5px] text-ink">{r.name}</p>
                <p className="font-sans text-[12px] text-ink-3">{r.detail}</p>
              </div>
              <Badge tone={r.ok ? "good" : r.warn ? "warn" : "bad"}>{r.ok ? "connected" : r.warn ? "not configured" : "error"}</Badge>
            </li>
          ))}
        </ul>
        {ai.models.length > 0 && (
          <details className="mt-4">
            <summary className="cursor-pointer font-mono text-[10px] uppercase tracking-[0.16em] text-ink-3">Models visible to this key ({ai.models.length})</summary>
            <p className="mt-2 font-mono text-[11px] leading-relaxed text-ink-2">{ai.models.join(" · ")}</p>
          </details>
        )}
      </Card>

      <Card title="Environment variables" description="Vercel → Project → Settings → Environment Variables. Add each for Production and Preview, then redeploy.">
        <Table head={["Variable", "Purpose", "Where to get it", "Set"]}>
          {ENV.map((v) => {
            const set = Boolean(process.env[v.name]);
            return (
              <tr key={v.name}>
                <td className="px-4 py-2.5 font-mono text-[11px] text-ink">{v.name}</td>
                <td className="px-4 py-2.5 text-ink-2">{v.purpose}</td>
                <td className="px-4 py-2.5 text-ink-3">{v.where}</td>
                <td className="px-4 py-2.5">
                  <Badge tone={set ? "good" : v.required ? "warn" : "neutral"}>{set ? "yes" : v.required ? "missing" : "optional"}</Badge>
                </td>
              </tr>
            );
          })}
        </Table>
      </Card>
    </>
  );
}
