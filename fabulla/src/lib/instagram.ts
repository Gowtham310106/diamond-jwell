/**
 * Instagram Highlights rail.
 *
 * ---------------------------------------------------------------------------
 * HOW TO DROP IN THE REAL CLIPS
 * ---------------------------------------------------------------------------
 * 1. Client exports their own media:
 *      Instagram app > Settings > Accounts Center > Your information and
 *      permissions > Download your information > select the account >
 *      "Some of your information" > tick Stories and Story highlights >
 *      Format JSON, Media quality High > Create files.
 *    Meta emails a ZIP. Original quality, no watermark, fully within ToS
 *    because the client owns the account.
 *
 * 2. Normalise each clip for the web before it goes in /public:
 *      ffmpeg -i raw.mp4 -an -vf "scale=720:-2" -c:v libx264 -crf 25 \
 *        -preset slow -pix_fmt yuv420p -movflags +faststart web.mp4
 *      ffmpeg -ss 0.4 -i web.mp4 -frames:v 1 -q:v 3 poster.jpg
 *    -an strips audio (these autoplay muted, so it halves the file).
 *    +faststart moves the moov atom to the front so it streams immediately.
 *    Target under ~1.5MB per clip.
 *
 * 3. Save to /public/highlights/<id>.mp4 and /public/highlights/<id>.jpg,
 *    then set `video` and `poster` below. Nothing else changes: the component
 *    already handles both states.
 *
 * Until then `video` stays null and the rail renders the still cover with the
 * play affordance suppressed. No placeholder clips are wired in.
 * ---------------------------------------------------------------------------
 */

export type Highlight = {
  id: string;
  /** Title as it reads on the profile's highlight tray. */
  title: string;
  /** Cover still. Replace with the exported poster frame. */
  cover: string;
  /** Set once the exported clip is normalised into /public/highlights. */
  video: string | null;
  /** Short caption shown under the tile. */
  caption: string;
};

const U = (id: string, w = 600) =>
  `https://images.unsplash.com/${id}?w=${w}&auto=format&fit=crop&q=80`;

/**
 * Titles mirror the highlight tray on @fabulladiamondco. Confirm against the
 * client's profile before launch and reorder to match their tray order.
 */
export const HIGHLIGHTS: Highlight[] = [
  {
    id: "custom-rings",
    title: "Custom Rings",
    cover: U("photo-1605100804763-247f67b3557e"),
    video: null,
    caption: "Engagement pieces, start to finish",
  },
  {
    id: "cuban-links",
    title: "Cuban Links",
    cover: U("photo-1611591437281-460bfbe1220a"),
    video: null,
    caption: "Solid links, hand-finished",
  },
  {
    id: "the-bench",
    title: "The Bench",
    cover: U("photo-1596944924616-7b38e7cfac36"),
    video: null,
    caption: "Setting, polishing, finishing",
  },
  {
    id: "client-pickups",
    title: "Pickups",
    cover: U("photo-1535632066927-ab7c9ab60908"),
    video: null,
    caption: "Pieces going home",
  },
  {
    id: "watches",
    title: "Watches",
    cover: U("photo-1523275335684-37898b6baf30"),
    video: null,
    caption: "Bezel and dial work",
  },
  {
    id: "loose-stones",
    title: "Loose Stones",
    cover: U("photo-1615655406736-b37c4fabf923"),
    video: null,
    caption: "Natural and lab-grown, side by side",
  },
];

export const HAS_REAL_CLIPS = HIGHLIGHTS.some((h) => h.video !== null);
