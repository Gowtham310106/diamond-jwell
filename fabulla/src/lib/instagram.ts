/**
 * Instagram Highlights.
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
 *    then set `video` and `cover` below. Nothing else changes: the component
 *    already handles both states.
 *
 * Until then `video` stays null and each card renders the still cover with the
 * play affordance suppressed. No placeholder clips are wired in.
 *
 * Covers are already the client's own photographs from /public/images, so the
 * tray is real even while the clips are outstanding. Replace a cover only when
 * its exported poster frame arrives, so cover and clip show the same piece.
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

const A = (file: string) => `/images/${file}`;

/**
 * Titles mirror the highlight tray on @fabulladiamondco. Confirm against the
 * client's profile before launch and reorder to match their tray order.
 */
export const HIGHLIGHTS: Highlight[] = [
  {
    id: "custom-rings",
    title: "Custom Rings",
    cover: A("ring-radiant-two-tone.jpg"),
    video: null,
    caption: "Engagement pieces, start to finish",
  },
  {
    id: "cuban-links",
    title: "Cuban Links",
    cover: A("chain-cuban-yellow-gold.jpg"),
    video: null,
    caption: "Solid links, hand-finished",
  },
  {
    id: "custom-pieces",
    title: "Custom Pieces",
    cover: A("pendant-custom-interstate.jpg"),
    video: null,
    caption: "Built from the client's own drawing",
  },
  {
    id: "client-pickups",
    title: "Pickups",
    cover: A("bracelet-alhambra-boxed.jpg"),
    video: null,
    caption: "Pieces going home",
  },
  {
    id: "watches",
    title: "Watches",
    cover: A("watch-cartier-santos.jpg"),
    video: null,
    caption: "Bezel and dial work",
  },
  {
    id: "loose-stones",
    title: "Loose Stones",
    cover: A("bracelet-cuban-crown-stones.jpg"),
    video: null,
    caption: "Natural and lab-grown, side by side",
  },
];

export const HAS_REAL_CLIPS = HIGHLIGHTS.some((h) => h.video !== null);
