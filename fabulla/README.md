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
  existing product photo and returns a cleaner or re-angled version. The
  prompt library lives in `src/lib/ai-prompts.ts`: every preset is the same
  fidelity clause (same physical piece, change nothing), an angle, a
  background and a finish clause, so a set of results match each other.
  Presets: enhance only, front, top-down, three-quarter, side profile, macro,
  black velvet, worn, lifestyle, wide hero; "Generate angle set" runs front,
  three-quarter, profile and macro in one press. A custom description gets
  the fidelity and finish clauses appended. Results are saved to the media
  library beside the original; nothing is replaced without the admin
  choosing it.

### Product images: more than one

A product's `images` list is a slideshow everywhere it appears. The product
page gallery (`ProductGallery`) cross-fades between stacked frames with
arrows, a counter, arrow keys when focused, swipe on touch, and thumbnails;
a video, if set, is the last slide and only mounts while active. Cards
(`CardMedia`) step through up to four frames every 900ms while hovered and
snap back to the cover on leave, with dots underneath; touch screens see the
cover and the dots. Both honour `prefers-reduced-motion` by switching
without the fade.

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

- **Theme:** light and dark, both first class (see below). The footer is a
  terminal dark block in either, not a theme inversion.
- **Color lock:** one accent family. `--color-rose` is a fill and border colour
  only (2.05:1 on cream, so it can never carry text); accent text uses
  `--color-rose-ink`. The one exception is type set on an ink ground, as in the
  `/custom` header, where the ratios invert: rose reads 8.37:1 there and
  rose-ink only 3.44:1. Gold is decorative, used for rules and marks, never body.
- **Shape lock:** cards and media 16px, chips and buttons pill, circular nav
  items full.
- **CTA lock:** one label per intent, defined in `src/lib/site.ts`, reused
  verbatim everywhere.

### Dark mode

Three states, and the default is the absence of a choice:

| State | What is on `<html>` | Behaviour |
|---|---|---|
| Auto (default) | nothing | A CSS media query follows the OS, live, with no JavaScript |
| Light | `data-theme="light"` | Outranks the media query |
| Dark | `data-theme="dark"` | Outranks the media query |

The toggle sits with Call and Book in the header, as a named three-up control
in the mobile drawer, and in the admin sidebar. A stored choice is applied by
a parser-blocking script in `<head>`, so there is no flash of the other theme;
a visitor who has never chosen needs no JavaScript at all.

**Writing components for both themes.** Use the tokens and you get dark for
free — `canvas`, `canvas-2`, `surface`, `ink`, `ink-2`, `ink-3`, `line`,
`line-2`, `gold`, `rose-ink` all flip. Three tokens deliberately do not,
because they colour type against a *fill* rather than against the page:

| Token | Use |
|---|---|
| `on-rose` | any type or icon on a `rose` / `rose-soft` fill |
| `deep` + `on-deep` | the terminal dark ground: footer, notice strip, badges over photos, the highlight lightbox |

`text-ink` on a rose button would turn near-white on pink the moment the theme
flips, which is the one mistake this system makes easy to avoid. Scrims over
photography use `black/NN` rather than a token, since a photograph is
dark-on-dark in both themes. For the rare case a token cannot reach — the
green and amber status tones in the admin are the only ones in the tree —
there is a real `dark:` variant, wired to the same two selectors as the
palette so the two can never disagree.

### Measured contrast (all pass WCAG AA)

Text is measured against the darkest ground it sits on in each theme, which
is what sets the floor.

| Pair | Light | Dark |
|---|---|---|
| ink on canvas / canvas-2 | 17.14 / 16.02 | 16.57 / 15.34 |
| ink-2 on canvas / canvas-2 | 6.14 / 5.74 | 10.15 / 9.39 |
| ink-3 on canvas / canvas-2 | 4.90 / 4.58 | 7.54 / 6.98 |
| rose-ink on canvas / canvas-2 | 4.98 / 4.66 | 10.02 / 9.27 |
| on-rose on rose / rose-soft | 8.37 / 14.07 | 8.37 / 14.07 |
| on-deep on deep | 17.14 | 19.33 |
| footer labels (white/60, white/55) | 6.99 / 6.09 | 7.33 / 6.23 |

Gold stays decorative in both (2.87 light, 8.78 dark) and never carries body
copy. The footer's dimmest labels were below AA at white/45 and white/40
before dark mode went in; lifting them fixed both themes at once.

### Accessibility and performance

- Every scroll-revealed element carries `data-reveal`, and a `<noscript>`
  override in `layout.tsx` forces them visible.
- The theme switch fades the ground rather than cutting, and that fade is
  dropped under `prefers-reduced-motion` with everything else.
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
