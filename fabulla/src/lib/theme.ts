/**
 * Theme preference.
 *
 * Three states, one of which is the absence of a choice:
 *
 *   "system"  nothing stored, no data-theme attribute. The CSS media query
 *             governs, so the page follows the OS live — including when the
 *             visitor's machine flips at sunset with the tab already open.
 *   "light"   data-theme="light", which outranks the media query.
 *   "dark"    data-theme="dark".
 *
 * Keeping "system" as *no attribute* is the whole trick: it means the default
 * experience needs no JavaScript at all, and the inline script below only has
 * work to do for a visitor who has actually chosen.
 */

export type ThemeChoice = "system" | "light" | "dark";

export const THEME_STORAGE_KEY = "fabulla-theme";

/**
 * Runs in <head> before first paint, so a stored choice is on the element
 * before the browser paints anything and there is no flash of the other
 * theme. Deliberately tiny, dependency-free, and silent if storage is walled
 * off (private mode, blocked cookies) — the site is still correct, it just
 * follows the OS for that visit.
 */
export const THEME_SCRIPT = `(function(){try{var c=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY
)});if(c==="light"||c==="dark"){document.documentElement.setAttribute("data-theme",c)}}catch(e){}})();`;

export function readStoredChoice(): ThemeChoice {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return stored === "light" || stored === "dark" ? stored : "system";
  } catch {
    return "system";
  }
}

/** Sets or clears the attribute, and remembers the choice. */
export function applyChoice(choice: ThemeChoice) {
  const root = document.documentElement;
  if (choice === "system") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", choice);

  try {
    if (choice === "system") localStorage.removeItem(THEME_STORAGE_KEY);
    else localStorage.setItem(THEME_STORAGE_KEY, choice);
  } catch {
    // Storage unavailable: the choice holds for this page, not the next one.
  }
}

/** What the visitor actually sees right now, given the choice and the OS. */
export function resolveChoice(choice: ThemeChoice): "light" | "dark" {
  if (choice !== "system") return choice;
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export const THEME_ORDER: ThemeChoice[] = ["light", "dark", "system"];

export const THEME_LABEL: Record<ThemeChoice, string> = {
  light: "Light",
  dark: "Dark",
  system: "Auto",
};
