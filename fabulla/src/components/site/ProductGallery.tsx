"use client";

import Image from "next/image";
import { useState } from "react";
import { Play } from "@phosphor-icons/react";

/**
 * Product gallery: one large plate, thumbnails beneath, an optional video as
 * the last thumbnail. Keyboard reachable — the thumbnails are buttons.
 */
export default function ProductGallery({ images, video, name }: { images: string[]; video: string; name: string }) {
  const items = [...images.map((src) => ({ kind: "image" as const, src })), ...(video ? [{ kind: "video" as const, src: video }] : [])];
  const [active, setActive] = useState(0);
  const current = items[active] ?? items[0];

  if (!current) {
    return <div className="aspect-[4/5] rounded-2xl border border-line bg-canvas-2" />;
  }

  return (
    <div>
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-line bg-canvas-2">
        {current.kind === "video" ? (
          <video key={current.src} src={current.src} controls autoPlay muted playsInline className="h-full w-full object-cover" />
        ) : (
          <Image key={current.src} src={current.src} alt={`${name} by Fabulla Diamonds Co.`} fill priority quality={90} sizes="(max-width: 1024px) 100vw, 55vw" className="object-cover" />
        )}
      </div>
      {items.length > 1 && (
        <ul className="mt-3 flex gap-3 overflow-x-auto pb-1">
          {items.map((item, i) => (
            <li key={item.src + i} className="shrink-0">
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={item.kind === "video" ? "Play video" : `View image ${i + 1}`}
                aria-current={i === active}
                className={`relative h-20 w-20 overflow-hidden rounded-xl border transition-colors ${i === active ? "border-rose" : "border-line hover:border-line-2"}`}
              >
                {item.kind === "video" ? (
                  <span className="flex h-full w-full items-center justify-center bg-ink text-canvas">
                    <Play size={18} weight="fill" />
                  </span>
                ) : (
                  <Image src={item.src} alt="" fill sizes="80px" className="object-cover" />
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
