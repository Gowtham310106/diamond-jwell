# Fabulla Diamonds Co.

A redesign of [fabulladiamonds.com](https://fabulladiamonds.com), built as a
separate app alongside `nextjs_jewelry`.

Next.js 16.2.10 (App Router, Turbopack) · React 19 · Tailwind v4 · Motion ·
Phosphor Icons.

```bash
cd fabulla && npm run dev
```

---

## Direction

The homepage follows the **UI/UX language of the `nextjs_jewelry` reference
build**: cinematic sticky intro, two-tier navbar, circular category nav with a
full-width mega-menu, banner carousel, gold section rules, the Bluestone-derived
bento field, and the 3D coverflow.

Palette is the reference's cream and gold, with **one substitution**: its
sky-blue accent (`#0EA5E9`) is replaced by Fabulla's own dusty rose
(`#DDA3A3`). Blue fights gold in a jewelry system, and the rose is the client's
actual brand colour, so the page reads as the reference without reading as a
clone of the brand that reference was cloned from.

### Locks

- **Theme lock:** light, one mode, whole site. The footer's navy ground is the
  page's own type colour used as one terminal block, not a theme inversion.
- **Color lock:** one accent family. `--color-rose` is a fill and border colour
  only (2.05:1 on cream, so it can never carry text); accent text uses
  `--color-rose-ink`. Gold is decorative, used for rules and marks, never body.
- **Shape lock:** cards and media 16px, chips and buttons pill, circular nav
  items full.
- **CTA lock:** one label per intent, defined in `src/lib/site.ts`, reused
  verbatim in header, hero, campaign and closing sections.

### Measured contrast (all pass WCAG AA)

| Pair | Ratio |
|---|---|
| ink on canvas | 17.14 |
| ink-2 on canvas | 6.14 |
| ink-3 on canvas / canvas-2 / surface | 4.90 / 4.58 / 5.11 |
| rose-ink on canvas / canvas-2 / surface | 4.98 / 4.66 / 5.19 |
| ink on rose (primary button) | 8.37 |

`ink-3` and `rose-ink` are tuned against `--color-canvas-2`, the darkest of the
three grounds. Values one step lighter cleared AA on the base cream but landed
at 4.45 and 4.41 on the banded sections.

---

## Homepage flow

| Section | Layout family |
|---|---|
| `ScrollIntro` | four screens that stack and pin, chrome floating over |
| `HeroCarousel` | banner rotation with arrows and dots |
| `Collections` | one tall plate beside two stacked |
| `CategoryBento` | named-area field, 6 tiles across a 6x6 grid |
| `InstagramHighlights` | circular tray driving a 3D coverflow |
| `Assurance` | held heading beside a badge grid |
| `Campaign` | editorial card beside a product grid |
| `Craftsmanship` | copy and features beside the certificate card |
| `Testimonials` | three client cards |
| `ClosingCta` | the one centred moment |

### What was changed from the reference, and why

1. **No scroll listeners.** The reference drove the intro captions and the
   navbar state from `window.addEventListener("scroll")`, which fires every
   frame and re-renders the tree each time. Both now read from Motion's
   `useScroll` and commit state only on an actual change: four re-renders
   across 400vh instead of hundreds.
2. **Chrome collapses.** Keeping all three header tiers expanded costs about
   180px of viewport forever. The notice strip hides and the category circles
   shrink to 44px with labels dropped once you scroll, settling at ~110px while
   the mega-menu stays reachable.
3. **Bento retuned for six categories.** The reference had sixteen items and a
   23-row template. A first pass at five rows gave pendants a single row, which
   rendered as a 104px strip beside a 327px neighbour. The 6x6 template gives
   every tile at least two rows and keeps widths uneven (664 / 440 / 216).
4. **Carousel is accessible.** Autoplay pauses on hover and focus and stops
   under `prefers-reduced-motion`; only the headline block is a link, so the
   arrows are ordinary buttons rather than `stopPropagation` escapes.
5. **Mega-menu links resolve.** The reference used `"#"` placeholders
   throughout. Every entry here points at a real route.
6. **Reduced motion is honoured.** The intro collapses to a single static
   screen rather than pinning the viewport for four screen-heights.
7. **Dead assets dropped.** The reference's badge SVGs and divider PNG belong
   to the brand it was cloned from; those are Phosphor glyphs and a CSS rule
   here.

---

## Routes

Slugs are frozen from the live site so inbound links and search ranking survive.

`/` · `/products` (with `?category=`) · `/products/[slug]` (all six
prerendered) · `/custom` · `/about` · `/contact`

---

## Instagram highlights

`src/components/home/InstagramHighlights.tsx` handles both data states. While
`video` is `null` a card is a still that opens the profile and shows no play
affordance, because promising a clip that is not there is worse than not
offering one. Set `video` and the same card becomes a player, no markup change.

**No placeholder clips are wired in.** The four macro clips in `public/video`
are used only by the cinematic intro.

To fill it in, see the header comment in `src/lib/instagram.ts`. In short:

1. The client exports their own media: Instagram → Settings → Accounts Center →
   Download your information → tick Stories and Story highlights → JSON, High
   media quality. Original quality, no watermark, within ToS because they own
   the account. Instagram's web profile is behind a login wall, so this export
   is the only clean route.
2. Normalise each clip:
   ```bash
   ffmpeg -i raw.mp4 -an -vf "scale=720:-2" -c:v libx264 -crf 25 -preset slow -pix_fmt yuv420p -movflags +faststart web.mp4
   ```
3. Save to `public/highlights/` and set `video` and `cover` in
   `src/lib/instagram.ts`.

Confirm the highlight titles and their order against the live profile before
launch; the current titles are a best guess at the tray.

---

## Open items for the client

1. **No product photography exists.** Every image on the current live site is
   Unsplash stock, and those exact photo IDs are preserved here so the redesign
   is a like-for-like comparison. Real shots would lift this more than any
   further code.
2. **The wordmark is set in type, not the client's logo.** The live mark is a
   40px JPEG, unusable at scale. Needs the client's sign-off and vector file.
3. **The enquiry form has no backend.** A validated submit composes a prefilled
   email. Replace the body of `submit` in `EnquiryForm.tsx`; the loading, sent
   and error states already exist.
4. **`/track`, `/privacy`, `/terms` are linked but not built.**
5. **The intro clips are generic macro footage**, carried over from the
   reference project. They should become real Fabulla footage.

---

## Accessibility and performance

- Every scroll-revealed element carries `data-reveal`, and a `<noscript>`
  override in `layout.tsx` forces them visible. Without it the page ships
  dozens of elements at `opacity: 0` and is blank when JavaScript is blocked.
- No `window.addEventListener("scroll")` anywhere.
- All motion collapses under `prefers-reduced-motion`, in CSS and via
  `useReducedMotion()`.
- Mega-menu closes on Escape; hover opens only on real hover devices so a tap
  cannot strand it open.
- Form labels sit above their controls, helper text is in the markup, errors
  render below the field with `role="alert"`.
