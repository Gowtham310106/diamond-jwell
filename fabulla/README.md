# Fabulla Diamonds Co.

The studio's website and the admin panel that runs it. A redesign of
[fabulladiamonds.com](https://fabulladiamonds.com), built alongside the
`nextjs_jewelry` reference.

Next.js 16 (App Router, Turbopack) · React 19 · Tailwind v4 · Motion ·
Phosphor Icons · MongoDB Atlas · Cloudflare R2 · Resend · Google Gemini.

```bash
cd fabulla && pnpm install && pnpm dev     # site at :3000, admin at /admin/login
```

**Setting it up for real** — keys, Vercel, Atlas, R2, Resend, Gemini — is
walked through step by step in [SETUP.md](./SETUP.md).

---

## What it is

Two apps in one Next.js project:

| Path | What |
|---|---|
| `/` `/products` `/products/[slug]` `/custom` `/about` `/faq` `/contact` | The storefront. Every word and image comes from the CMS. |
| `/admin` | The studio's panel. Sign in required. |
| `/api/chat` `/api/enquiries` | Public endpoints: the concierge, the contact form. |
| `/api/admin/*` | Uploads, media registry, AI images. Session-gated. |

### The admin panel

- **Products** — every field a card or page shows: photos (drag-order, first
  is the cover), video, price / compare-at / note, metal, stone, carat, specs,
  badges (New, Best seller, Sale, Custom), featured, tags, stock, draft or
  published. Duplicate, delete, publish from the list.
- **Categories** — the header circles, the homepage tiles, the filters; each
  with its own menu links and drop-down banner.
- **Collections** — curated edits ("Iced Out", "Under $5,000"); featured ones
  get a plate on the homepage, all are filters.
- **Media** — library of every upload, alt text, copy URL. Uploads go straight
  to Cloudflare R2 from the browser.
- **Homepage** — hero slides (image *or* video, with poster), which sections
  show and in what order, section headings, campaign card, Instagram
  highlights, custom-process steps, page plates.
- **Settings** — brand, contact (phone, email, Instagram, WhatsApp, address,
  hours), notice bar, the numbers quoted in copy, assurance badges,
  testimonials, financing banner, chatbot copy, enquiry-email routing, SEO.
- **FAQs** — questions grouped by topic; each can show on the site and/or
  teach the chatbot.
- **Inbox** — every enquiry, appointment and quote request with status
  (new / contacted / won / closed), internal notes, reply-by-email, and
  whether the notification email went out.
- **Chat logs** — what visitors asked; conversations the bot had to hand off
  are flagged, with a one-click "write an FAQ for this".
- **Team** — add and remove people, change password.
- **Integrations** — live pings of MongoDB, R2, Resend and Gemini, and a
  checklist of every environment variable with whether it is set.

### AI, in two places

- **The concierge** (`/api/chat`): Gemini, grounded in a system prompt built
  at request time from settings, the published catalog and the FAQs. It is
  told never to invent prices, stock, dates or policy, and to hand anything
  binding to the phone number. Every reply is labelled "AI concierge" or
  "Studio answer" (the FAQ-matcher fallback when there is no key or Gemini
  fails). Conversations are logged for the admin.
- **Photo variants** (`/api/admin/ai/image`): Gemini's image model takes an
  existing product photo and returns a cleaner or re-angled version — studio
  white, black velvet, three-quarter, wide hero — or a custom prompt. The
  result is saved to the media library beside the original; nothing is
  replaced without the admin choosing it.

---

## Architecture

```
src/lib/cms/
  types.ts     every document type; string _ids, ISO timestamps
  store.ts     MongoDB when MONGODB_URI is set, else .data/cms.json — same
               four-method interface, seeded on first read, memoised per request
  seed.ts      the starting content: catalog, photos, copy, FAQs
  repo.ts      the queries: settings, catalog with filters/search/sort/paging,
               inbox, FAQs, chats, team, media; revalidates the site on write
  forms.ts     FormData helpers for server actions
src/lib/
  auth.ts      scrypt passwords, HMAC session cookie (Web Crypto: edge + node)
  storage.ts   R2 presigned uploads / server writes, local fallback
  email.ts     Resend
  ai.ts        Gemini chat + image edit + health ping
  concierge.ts system prompt and FAQ fallback
src/proxy.ts   gates /admin and /api/admin on the session cookie
src/app/
  (site)/      storefront pages + layout with header/footer
  admin/(panel)/  admin pages, one folder per entity with actions.ts
  admin/login/
  api/
src/components/
  site/        header, nav, footer, product card, gallery, form, concierge
  home/        homepage sections, each fed by props
  admin/       panel primitives, media picker, list/hero/sections editors
```

**One query path for both databases.** The store loads a collection whole and
every filter, search and sort runs in JavaScript. A studio's catalog is a few
hundred documents; this is faster than a round-trip per facet and it means
the file store used for local dev behaves identically to Atlas.

**Caching.** Public pages are ISR (`revalidate = 60`) and every admin write
calls `revalidatePath("/", "layout")`, so edits appear immediately and idle
traffic is served from cache.

**Uploads.** The admin asks `/api/admin/uploads/presign` for a signed R2 PUT
URL and uploads from the browser, then registers the object. Without R2 the
same control falls back to a multipart upload into `.data/uploads`.

---

## Design

### Direction

The homepage follows the UI/UX language of the `nextjs_jewelry` reference
build: two-tier navbar, circular category nav with a full-width mega-menu,
banner carousel with image or video slides, gold section rules, the
Bluestone-derived bento field, the 3D coverflow. Product showcase rows and
the filter sidebar follow the icebox.com pattern — horizontal rails of cards
on the homepage, faceted filters (category, collection, price band, metal,
stone, availability) with sort and search on the catalog.

Palette is the reference's cream and gold, with one substitution: its
sky-blue accent is replaced by Fabulla's own dusty rose (`#DDA3A3`).

### Locks

- **Theme lock:** light, one mode, whole site. The footer's navy ground is the
  page's own type colour used as one terminal block, not a theme inversion.
- **Color lock:** one accent family. `--color-rose` is a fill and border colour
  only (2.05:1 on cream, so it can never carry text); accent text uses
  `--color-rose-ink`. The one exception is type set on an ink ground, as in the
  `/custom` header, where the ratios invert: rose reads 8.37:1 there and
  rose-ink only 3.44:1. Gold is decorative, used for rules and marks, never body.
- **Shape lock:** cards and media 16px, chips and buttons pill, circular nav
  items full.
- **CTA lock:** one label per intent, defined in `src/lib/site.ts`, reused
  verbatim everywhere.

### Measured contrast (all pass WCAG AA)

| Pair | Ratio |
|---|---|
| ink on canvas | 17.14 |
| ink-2 on canvas | 6.14 |
| ink-3 on canvas / canvas-2 / surface | 4.90 / 4.58 / 5.11 |
| rose-ink on canvas / canvas-2 / surface | 4.98 / 4.66 / 5.19 |
| ink on rose (primary button) | 8.37 |

### Accessibility and performance

- Every scroll-revealed element carries `data-reveal`, and a `<noscript>`
  override in `layout.tsx` forces them visible.
- No `window.addEventListener("scroll")` anywhere; motion collapses under
  `prefers-reduced-motion`.
- Mega-menu closes on Escape; hover opens only on real hover devices.
- Forms: labels above controls, errors below with `role="alert"`, a honeypot
  instead of a CAPTCHA.
- The FAQ accordion and the product filters are plain HTML (`<details>`,
  links), so they work before hydration and every answer is indexable.
  Product pages ship `Product` JSON-LD; the FAQ page ships `FAQPage`;
  `sitemap.xml` and `robots.txt` are generated from the catalog.

---

## Open items for the client

1. **Photography is low-resolution.** The shipped frames are 430–700px on the
   long edge — fine on cards, soft on the hero. Upload re-exports at 2000px+
   through the admin; or use the AI variant button as a stopgap.
2. **Earrings has no photograph.** The category still uses a stock stand-in.
3. **The wordmark is set in type.** Needs the client's vector logo.
4. **`/privacy` and `/terms` are linked but not built.**
5. **Read the chatbot's answers for tone before launch**, and write the
   first ten FAQs — the concierge is only as good as they are.
