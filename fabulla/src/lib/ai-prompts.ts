/**
 * The prompt library for the Gemini image model.
 *
 * Every product prompt is built from the same three parts so the results
 * match each other on a page: a FIDELITY clause (this is the same physical
 * piece, change nothing about it), an ANGLE, a BACKGROUND, and one FINISH
 * clause describing what "good" looks like for luxury e-commerce. The admin
 * buttons are named presets over this; a free-text box can replace the lot.
 *
 * Kept in its own module because the API route and the MediaPicker both need
 * the list, and a route file may only export handlers.
 */

export const FIDELITY =
  "Use the supplied photograph as the exact reference. This is the same physical piece of jewelry: keep the design, proportions, metal colour and finish, every stone's cut, size, count and placement, the clasp, bail and link pattern identical. Do not add, remove, enlarge or restyle any element. No hands, mannequins, props, text, watermarks or logos unless the prompt asks for them.";

export const FINISH =
  "Professional luxury e-commerce product photography: tack-sharp focus across the whole piece, clean specular highlights on polished metal, bright crisp fire and scintillation in the diamonds, true-to-life colour, no noise, no blur, no haze, no colour cast, no halo artefacts, high resolution.";

export const ANGLES = {
  front: "front-facing and perfectly centred, shot straight on at eye level, the piece filling about 80% of the frame",
  top: "flat-lay from directly above at 90 degrees, the piece laid out naturally with chain or band curved gracefully",
  threeQuarter: "three-quarter view from 45 degrees with the camera slightly above, showing the depth of the setting and the side of the stones",
  profile: "side profile at 90 degrees, showing the height of the setting, the prongs or bezel and the band thickness",
  macro: "macro close-up filling the frame with the centre stone and pavé detail, shallow depth of field, the rest falling softly out of focus",
  back: "rear view showing the gallery, clasp or underside of the setting",
  worn: "worn on a model in a relaxed natural pose, neutral skin tone, cropped close so the piece is the subject, soft window light, background out of focus",
  lifestyle: "styled in a lifestyle scene on a marble vanity with soft morning light and a shallow depth of field, the piece in sharp focus",
} as const;

export const BACKGROUNDS = {
  white: "on a pure white seamless studio background (#FFFFFF) with a soft short contact shadow under the piece",
  cream: "on a warm cream seamless background (#F7F2EA), softly lit from the upper left, gentle contact shadow",
  velvet: "on black velvet with dramatic soft key light catching every facet, subtle vignette",
  stone: "on a polished pale grey marble slab, soft daylight from the upper left, light natural shadow",
} as const;

export type AngleKey = keyof typeof ANGLES;
export type BackgroundKey = keyof typeof BACKGROUNDS;

export function buildPrompt(angle: AngleKey, background: BackgroundKey): string {
  return `Re-photograph this exact piece ${ANGLES[angle]}, ${BACKGROUNDS[background]}. ${FIDELITY} ${FINISH}`;
}

/** Named prompts the admin can press. Keys are stable; they end up in file names. */
export const PRESETS: Record<string, string> = {
  enhance:
    `Enhance this photograph without changing the camera angle, framing or anything about the piece. Remove dust, fingerprints, scratches and stray reflections from the metal, replace the background with a pure white seamless studio background (#FFFFFF) and a soft contact shadow, correct the white balance so the metal reads its true colour, lift the shadows inside the stones, sharpen the facets, and remove any hands, props, text or logos. ${FIDELITY} ${FINISH}`,
  studio: buildPrompt("front", "white"),
  top: buildPrompt("top", "white"),
  angle: buildPrompt("threeQuarter", "white"),
  profile: buildPrompt("profile", "white"),
  macro: buildPrompt("macro", "white"),
  dark: buildPrompt("threeQuarter", "velvet"),
  worn: `Re-photograph this exact piece ${ANGLES.worn}. ${FIDELITY} ${FINISH}`,
  lifestyle: `Re-photograph this exact piece ${ANGLES.lifestyle}. ${FIDELITY} ${FINISH}`,
  hero: `Create a wide cinematic hero image of this exact piece for a website banner: the piece in the right third of the frame on a dark softly lit surface, generous negative space on the left for headline text, a faint reflection under the piece. ${FIDELITY} ${FINISH}`,
};

export const PRESET_LABELS: Record<string, string> = {
  enhance: "Enhance only",
  studio: "Front, white",
  top: "Top-down flat lay",
  angle: "Three-quarter",
  profile: "Side profile",
  macro: "Macro detail",
  dark: "On black velvet",
  worn: "Worn on model",
  lifestyle: "Lifestyle scene",
  hero: "Wide hero banner",
};

/** What "Generate angle set" produces, in the order the product page shows them. */
export const ANGLE_SET = ["studio", "angle", "profile", "macro"] as const;

/** Aspect ratio per preset: cards and product pages want square, the hero is wide. */
export const PRESET_ASPECT: Record<string, string> = { hero: "16:9", worn: "4:5", lifestyle: "4:5" };
