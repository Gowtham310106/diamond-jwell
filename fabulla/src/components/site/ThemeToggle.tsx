"use client";

import { useEffect, useState } from "react";
import { Sun, Moon, CircleHalf } from "@phosphor-icons/react";
import {
  THEME_LABEL,
  THEME_ORDER,
  applyChoice,
  readStoredChoice,
  resolveChoice,
  type ThemeChoice,
} from "@/lib/theme";

/**
 * Light / Dark / Auto, in one control.
 *
 * Two shapes from the same state: an icon button for the header and sidebar,
 * and a three-up segmented control for the mobile drawer, where there is room
 * to name the options and no tooltip to lean on.
 *
 * Auto is a real third state rather than a hidden default — a visitor who has
 * picked dark on a machine that is light should be able to get back to
 * "follow my system" without clearing site data.
 *
 * Before mount the button renders with the Auto glyph and no assertion about
 * which theme is on, because the server cannot know: the choice lives in
 * localStorage and on the OS. It occupies the same box either way, so
 * nothing moves when the real state arrives.
 */

const ICON = { light: Sun, dark: Moon, system: CircleHalf } as const;

export default function ThemeToggle({
  variant = "icon",
  className = "",
  showLabel = true,
  size = 21,
}: {
  variant?: "icon" | "segmented";
  className?: string;
  /** The header stacks a caption under the glyph; a dense toolbar does not. */
  showLabel?: boolean;
  size?: number;
}) {
  const [choice, setChoice] = useState<ThemeChoice>("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setChoice(readStoredChoice());
    setMounted(true);
  }, []);

  function choose(next: ThemeChoice) {
    setChoice(next);
    applyChoice(next);
  }

  if (variant === "segmented") {
    return (
      <div className={className}>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-3">Appearance</p>
        <div
          role="group"
          aria-label="Appearance"
          className="mt-2.5 flex gap-1 rounded-full border border-line-2 p-1"
        >
          {THEME_ORDER.map((option) => {
            const Icon = ICON[option];
            const active = mounted && choice === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => choose(option)}
                aria-pressed={active}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-2 font-sans text-[11px] uppercase tracking-[0.12em] transition-colors duration-300 ${
                  active ? "bg-rose text-on-rose" : "text-ink-2 hover:text-ink"
                }`}
              >
                <Icon size={13} weight={active ? "fill" : "light"} />
                {THEME_LABEL[option]}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Where the next press goes. From an explicit choice it is a plain cycle
  // light → dark → auto; from auto it is whichever theme the visitor is NOT
  // currently looking at, so the first press always visibly does something.
  // A fixed order would otherwise send someone on a dark machine from auto to
  // light-that-is-already-light and look broken.
  const next: ThemeChoice =
    choice === "light" ? "dark" : choice === "dark" ? "system" : resolveChoice("system") === "dark" ? "light" : "dark";
  const Icon = mounted ? ICON[choice] : CircleHalf;
  const showing = mounted && choice === "system" ? ` (${resolveChoice("system")})` : "";

  return (
    <button
      type="button"
      onClick={() => choose(next)}
      title={mounted ? `Appearance: ${THEME_LABEL[choice]}${showing}` : "Appearance"}
      aria-label={
        mounted
          ? `Appearance: ${THEME_LABEL[choice]}${showing}. Switch to ${THEME_LABEL[next].toLowerCase()}.`
          : "Appearance"
      }
      className={`group flex flex-col items-center transition-opacity hover:opacity-70 ${className}`}
    >
      <Icon size={size} weight="light" />
      {showLabel && (
        <span className="mt-0.5 hidden font-mono text-[8px] uppercase tracking-[0.16em] sm:block">
          {mounted ? THEME_LABEL[choice] : "Theme"}
        </span>
      )}
    </button>
  );
}
