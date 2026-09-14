# Setting up Fabulla

Everything the site needs, in the order to do it. Budget about an hour. Each
step ends with a variable to paste into Vercel; the admin panel's
**Integrations** page (`/admin/integrations`) shows live whether each one
works, so you can check as you go.

Nothing here is optional for a real launch except where marked. Until a
service is connected the site degrades rather than breaks: without the
database, edits go to a local file; without R2, uploads go to the server
disk (wiped on deploy); without Resend, enquiries stay in the admin inbox;
without Gemini, the chatbot answers from your FAQs.

---

## 0. Deploy to Vercel (once)

1. vercel.com → **Add New → Project** → import `Gowtham310106/diamond-jwell`.
2. **Root Directory:** `fabulla`. Framework is detected as Next.js.
3. Deploy once now — it will run on the file store. Then add the variables
   below under **Settings → Environment Variables** (tick Production *and*
   Preview) and **redeploy**.

To set variables from the terminal instead:

```bash
npm i -g vercel && vercel link      # from the fabulla/ folder
vercel env add MONGODB_URI production
# …repeat per variable, or paste a whole .env file:
vercel env pull .env.local          # (pulls, for local dev)
```

---

## 1. Admin login — `ADMIN_SESSION_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`

```bash
openssl rand -base64 32     # → ADMIN_SESSION_SECRET
```

Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` to whatever you want the owner login
to be. They are used **once**: the first sign-in with exactly that pair
creates the owner account in the database. After that, add or remove people
on `/admin/team`; the env pair no longer does anything (you can delete it).

Sign in at **`/admin/login`**.

---

## 2. Database — `MONGODB_URI`, `MONGODB_DB`

1. mongodb.com/atlas → create a free **M0** cluster (any region near
   Virginia is closest to Vercel's default).
2. **Database Access** → Add user (read and write to any database).
3. **Network Access** → Add IP → **Allow access from anywhere** (`0.0.0.0/0`).
   Vercel functions have no fixed IP.
4. **Database → Connect → Drivers** → copy the URI. Replace `<password>`.
   It looks like
   `mongodb+srv://user:pass@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority`.
5. `MONGODB_DB` = `fabulla` (or any name).

On the first request after this is set, every collection is **seeded with
the current catalog, photos, copy and FAQs** — the site looks identical to
before, but now the admin panel edits it.

---

## 3. Photos & videos — `R2_*`

Cloudflare R2 holds every upload. It is S3-compatible, has no egress fees,
and the browser uploads straight to it, so a 40 MB video never passes
through Vercel.

1. dash.cloudflare.com → **R2 Object Storage** → **Create bucket** →
   name `fabulla-media`. → `R2_BUCKET`
2. The **Account ID** is on the R2 overview page (right side). → `R2_ACCOUNT_ID`
3. **Manage R2 API Tokens → Create API token** → permission **Object Read &
   Write**, scoped to the bucket. Copy the **Access Key ID** and **Secret
   Access Key** (shown once). → `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`
4. Bucket → **Settings → Public access**. Either **Connect a custom domain**
   (e.g. `media.fabulladiamonds.com`, recommended) or **Allow access** via the
   `r2.dev` subdomain. The resulting URL → `R2_PUBLIC_URL`
   (e.g. `https://media.fabulladiamonds.com`).
5. Bucket → **Settings → CORS policy** → add:

```json
[
  {
    "AllowedOrigins": ["https://fabulladiamonds.com", "https://*.vercel.app", "http://localhost:3000"],
    "AllowedMethods": ["PUT", "GET", "HEAD"],
    "AllowedHeaders": ["*"],
    "MaxAgeSeconds": 3600
  }
]
```

Without the CORS rule, uploads from the admin panel fail with a network
error. The custom domain also needs to be listed in `next.config.ts`'s image
hosts — it is read from `R2_PUBLIC_URL` automatically, so nothing to edit.

---

## 4. Enquiry emails — `RESEND_API_KEY`, `EMAIL_FROM`

1. resend.com → **Domains → Add domain** → `fabulladiamonds.com` → add the
   DNS records it shows (at your domain registrar) → wait for **Verified**.
2. **API Keys → Create** (Sending access). → `RESEND_API_KEY`
3. `EMAIL_FROM` = `Fabulla Diamonds <hello@fabulladiamonds.com>` (any address
   on the verified domain).

Enquiries go to the address(es) set in **Admin → Settings → Enquiry emails**
(default: the contact email), with the customer's address as reply-to so the
studio answers by hitting Reply. The customer gets an acknowledgement if that
switch is on. Every enquiry is also in **Admin → Inbox** regardless.

Before the domain is verified you can test with
`EMAIL_FROM=onboarding@resend.dev`; it only delivers to the Resend account
owner's own email.

---

## 5. Chatbot & AI photos — `GEMINI_API_KEY`

1. aistudio.google.com → **Get API key** → create. → `GEMINI_API_KEY`
2. Enable billing on the Google Cloud project behind it if you want more than
   the free tier — image generation is not in the free tier.

What it powers:

- **The concierge** (bottom-right of the site): answers from your settings,
  catalog and FAQs. It never invents prices or stock; anything binding it
  hands to the phone number. Every conversation is logged in
  **Admin → Chat logs**, and ones it could not answer are flagged so you can
  turn them into FAQs.
- **Photo variants**: on any product photo in the admin, the sparkle button
  offers "Clean studio shot", "On black velvet", "Three-quarter angle",
  "Wide hero banner", or a prompt of your own. The result lands in the media
  library next to the original; you choose which to use.

Models default to `gemini-3.8-flash` (chat) and `gemini-2.5-flash-image`
(images). If Google retires either, set `GEMINI_CHAT_MODEL` /
`GEMINI_IMAGE_MODEL` — `/admin/integrations` lists what your key can see.

---

## 6. Moving off Vercel later (AWS or anywhere)

Nothing is Vercel-specific. It is a standard Next.js app:

- **Database, media, email, AI** are all external services already — they
  come with you unchanged.
- Run it anywhere Node runs: `pnpm build && pnpm start`, or the
  `Dockerfile`-less path of `next build` output on AWS Amplify / App Runner /
  ECS. Set the same environment variables there.
- Image optimisation (`next/image`) works on any Node host; on a static-only
  host it does not, so keep a Node runtime.

---

## Local development

```bash
cd fabulla
cp .env.example .env.local     # fill in what you have; blanks are fine
pnpm install
pnpm dev                       # http://localhost:3000, admin at /admin/login
```

With no `MONGODB_URI` the site runs from `.data/cms.json` (gitignored) and
uploads land in `.data/uploads/` — a complete working copy for trying the
admin panel before any keys exist.
