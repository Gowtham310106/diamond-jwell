"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowUp,
  ChatCircleDots,
  CircleNotch,
  Phone,
  X,
} from "@phosphor-icons/react";
import {
  CONCIERGE_COPY,
  LIMITS,
  type ChatMessage,
  type ReplySource,
} from "@/lib/concierge";
import { CONTACT } from "@/lib/site";

/**
 * The concierge.
 *
 * A launcher pinned bottom-right that opens a chat panel, talking to
 * /api/chat. Three things shape it:
 *
 * 1. It does not exist over the opening slides. The intro and the banner
 *    carousel are the one uninterrupted stretch of this site, and a chat bubble
 *    floating over them undoes that. A sentinel is rendered at the mount point
 *    and the launcher only appears once the visitor has scrolled past it, so
 *    `<Concierge />` placed after the carousel means "after the slides".
 *    `reveal="immediate"` is for pages that have no slides to clear.
 *
 * 2. Every reply is labelled. A Claude answer and the no-key studio answer read
 *    differently and the panel says which one it got, so nothing is passed off
 *    as more than it is. The disclosure line under the input is permanent.
 *
 * 3. It is a panel, not a modal. It does not trap focus or lock the page
 *    behind a scrim — a visitor mid-question should still be able to scroll the
 *    piece they are asking about. Escape closes it and focus goes back to the
 *    launcher.
 */

type Props = {
  /**
   * "after-slides" waits until the sentinel at this component's position has
   * scrolled out of the top of the viewport. "immediate" shows on load.
   */
  reveal?: "after-slides" | "immediate";
};

type Entry = ChatMessage & { source?: ReplySource };

const PANEL =
  "flex h-[min(560px,calc(100svh-7rem))] w-[min(380px,calc(100vw-2rem))] flex-col " +
  "overflow-hidden rounded-3xl border border-line-2 bg-canvas shadow-[0_24px_60px_rgba(15,23,42,0.22)]";

export default function Concierge({ reveal = "after-slides" }: Props) {
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(reveal === "immediate");
  const [open, setOpen] = useState(false);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState(false);

  const sentinel = useRef<HTMLDivElement>(null);
  const launcher = useRef<HTMLButtonElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);
  const log = useRef<HTMLDivElement>(null);

  /* Reveal once the slides are behind us. */
  useEffect(() => {
    if (reveal === "immediate") return;
    const node = sentinel.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Above the fold line, or on screen: either way the slides are done.
        const passed =
          entry.isIntersecting || entry.boundingClientRect.top < 0;
        setVisible(passed);
      },
      { rootMargin: "0px 0px -20% 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [reveal]);

  /* Escape closes, and focus returns to where it came from. */
  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        launcher.current?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  /* New answers scroll into view; the input takes focus when the panel opens. */
  useEffect(() => {
    if (open) input.current?.focus();
  }, [open]);

  useEffect(() => {
    const node = log.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [entries, sending]);

  const send = useCallback(
    async (text: string) => {
      const question = text.trim().slice(0, LIMITS.maxCharacters);
      if (!question || sending) return;

      const thread: Entry[] = [...entries, { role: "user", content: question }];
      setEntries(thread);
      setDraft("");
      setFailed(false);
      setSending(true);

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: thread.map(({ role, content }) => ({ role, content })),
          }),
        });

        const data = (await response.json()) as {
          reply?: string;
          source?: ReplySource;
          error?: string;
        };

        if (!response.ok || !data.reply) {
          setEntries((current) => [
            ...current,
            {
              role: "assistant",
              content:
                data.error ??
                `${CONCIERGE_COPY.offline} ${CONTACT.phone}.`,
              source: "studio",
            },
          ]);
          setFailed(true);
          return;
        }

        setEntries((current) => [
          ...current,
          {
            role: "assistant",
            content: data.reply as string,
            source: data.source ?? "studio",
          },
        ]);
      } catch {
        setEntries((current) => [
          ...current,
          {
            role: "assistant",
            content: `${CONCIERGE_COPY.offline} ${CONTACT.phone}.`,
            source: "studio",
          },
        ]);
        setFailed(true);
      } finally {
        setSending(false);
        input.current?.focus();
      }
    },
    [entries, sending]
  );

  return (
    <>
      {/* Position marker only: the panel itself is fixed to the viewport. */}
      <div ref={sentinel} aria-hidden="true" className="h-px w-full" />

      <div className="pointer-events-none fixed bottom-5 right-5 z-[2500] flex flex-col items-end gap-3 sm:bottom-7 sm:right-7">
        <AnimatePresence>
          {open && visible && (
            <motion.div
              key="panel"
              className={`pointer-events-auto ${PANEL}`}
              initial={reduce ? false : { opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduce ? undefined : { opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: reduce ? 0 : 0.32, ease: [0.16, 1, 0.3, 1] }}
              role="dialog"
              aria-label={CONCIERGE_COPY.title}
            >
              <header className="flex items-start justify-between gap-4 border-b border-line bg-surface px-5 py-4">
                <div>
                  <p className="display text-[19px] leading-none text-ink">
                    {CONCIERGE_COPY.title}
                  </p>
                  <p className="mt-2 font-mono text-[9.5px] uppercase tracking-[0.2em] text-ink-3">
                    {CONTACT.hours}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    launcher.current?.focus();
                  }}
                  aria-label="Close the concierge"
                  className="-mr-1 -mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink-2 transition-colors duration-300 hover:text-rose-ink"
                >
                  <X size={16} weight="light" />
                </button>
              </header>

              <div
                ref={log}
                className="flex-1 space-y-4 overflow-y-auto px-5 py-5"
                aria-live="polite"
                aria-atomic="false"
              >
                <p className="font-sans text-[13.5px] leading-relaxed text-ink-2">
                  {CONCIERGE_COPY.intro}
                </p>

                {entries.length === 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {CONCIERGE_COPY.suggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => send(suggestion)}
                        className="rounded-full border border-line-2 px-3.5 py-2 text-left font-sans text-[12px] text-ink-2 transition-colors duration-300 hover:border-rose hover:text-rose-ink"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}

                {entries.map((entry, i) => (
                  <Bubble key={i} entry={entry} />
                ))}

                {sending && (
                  <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-3">
                    <CircleNotch size={13} weight="light" className="animate-spin" />
                    Thinking
                  </p>
                )}

                {failed && (
                  <a
                    href={CONTACT.phoneHref}
                    className="inline-flex items-center gap-2 rounded-full border border-line-2 px-4 py-2.5 font-sans text-[11px] uppercase tracking-[0.16em] text-ink transition-colors duration-300 hover:border-rose hover:text-rose-ink"
                  >
                    <Phone size={13} weight="light" />
                    {CONTACT.phone}
                  </a>
                )}
              </div>

              <form
                className="border-t border-line bg-surface px-4 pb-4 pt-3"
                onSubmit={(event) => {
                  event.preventDefault();
                  send(draft);
                }}
              >
                <div className="flex items-end gap-2">
                  <label htmlFor="concierge-input" className="sr-only">
                    Your question for the studio
                  </label>
                  <textarea
                    id="concierge-input"
                    ref={input}
                    rows={1}
                    value={draft}
                    maxLength={LIMITS.maxCharacters}
                    onChange={(event) => setDraft(event.target.value)}
                    onKeyDown={(event) => {
                      // Enter sends; Shift+Enter keeps the line break.
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();
                        send(draft);
                      }
                    }}
                    placeholder="Ask about a piece or a budget"
                    className="max-h-28 min-h-[44px] flex-1 resize-none rounded-2xl border border-line-2 bg-canvas px-4 py-3 font-sans text-[13.5px] text-ink transition-colors duration-300 focus:border-rose focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!draft.trim() || sending}
                    aria-label="Send"
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-rose text-ink transition-all duration-300 hover:bg-rose-soft disabled:pointer-events-none disabled:opacity-40"
                  >
                    <ArrowUp size={16} weight="bold" />
                  </button>
                </div>
                <p className="mt-2.5 font-sans text-[11px] leading-relaxed text-ink-3">
                  {CONCIERGE_COPY.disclosure}
                </p>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {visible && (
            <motion.button
              key="launcher"
              ref={launcher}
              type="button"
              onClick={() => setOpen((current) => !current)}
              aria-expanded={open}
              aria-label={open ? "Close the concierge" : CONCIERGE_COPY.launcher}
              className="pointer-events-auto flex items-center gap-2.5 rounded-full border border-line-2 bg-surface px-5 py-3.5 font-sans text-[11px] uppercase tracking-[0.16em] text-ink shadow-[0_10px_30px_rgba(15,23,42,0.16)] transition-colors duration-300 hover:border-rose hover:text-rose-ink"
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: 14 }}
              transition={{ duration: reduce ? 0 : 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              {open ? (
                <X size={15} weight="light" />
              ) : (
                <ChatCircleDots size={15} weight="light" />
              )}
              <span className={open ? "sr-only" : undefined}>
                {CONCIERGE_COPY.launcher}
              </span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

function Bubble({ entry }: { entry: Entry }) {
  if (entry.role === "user") {
    return (
      <p className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-rose px-4 py-3 font-sans text-[13.5px] leading-relaxed text-ink">
        {entry.content}
      </p>
    );
  }

  return (
    <div className="max-w-[92%]">
      <p className="rounded-2xl rounded-bl-md border border-line bg-surface px-4 py-3 font-sans text-[13.5px] leading-relaxed text-ink">
        {entry.content}
      </p>
      <p className="mt-1.5 pl-1 font-mono text-[9px] uppercase tracking-[0.2em] text-ink-3">
        {entry.source === "claude" ? "AI concierge" : "Studio answer"}
      </p>
    </div>
  );
}
