"use client";

import Image from "next/image";
import { useState } from "react";

type Props = {
  before: string;
  after: string;
  /** Base alt text; " — before"/" — after" is appended per layer. */
  alt: string;
};

/**
 * Draggable before/after image comparison. The "after" image is the base layer;
 * the "before" image sits on top, clipped to the left of the handle. Drag the
 * handle, or focus it and use the arrow keys (the range input drives position).
 */
export function BeforeAfter({ before, after, alt }: Props) {
  const [pos, setPos] = useState(50);
  const [moved, setMoved] = useState(false);

  return (
    <div className="relative h-full w-full select-none overflow-hidden">
      {/* AFTER — base layer */}
      <Image
        src={after}
        alt={`${alt} — after`}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover"
      />

      {/* BEFORE — clipped to the left of the handle */}
      <Image
        src={before}
        alt={`${alt} — before`}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      />

      {/* corner labels */}
      <span className="pointer-events-none absolute left-3 top-3 font-display text-xs uppercase tracking-wider text-white/80">
        Before
      </span>
      <span className="pointer-events-none absolute right-3 top-3 font-display text-xs uppercase tracking-wider text-white/80">
        After
      </span>

      {/* divider + grip */}
      <div
        className="pointer-events-none absolute inset-y-0 w-px bg-white/80"
        style={{ left: `${pos}%` }}
      >
        <span
          className={`absolute top-1/2 left-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-brand bg-surface text-brand ${
            moved ? "" : "animate-pulse"
          }`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M9 6l-5 6 5 6M15 6l5 6-5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>

      {/* affordance hint — fades out once the user drags */}
      {!moved && (
        <span className="pointer-events-none absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-line bg-ink/70 px-3 py-1 font-display text-[10px] uppercase tracking-wider text-white/85 backdrop-blur-sm">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M9 6l-5 6 5 6M15 6l5 6-5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Drag to compare
        </span>
      )}

      {/* full-area control: pointer drag + keyboard */}
      <input
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => {
          setPos(Number(e.target.value));
          setMoved(true);
        }}
        aria-label={`${alt}: drag to compare before and after`}
        className="absolute inset-0 h-full w-full cursor-ew-resize appearance-none bg-transparent opacity-0"
      />
    </div>
  );
}
