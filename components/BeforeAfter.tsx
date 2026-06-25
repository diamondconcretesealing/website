"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { blurProps } from "@/lib/blur";

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
 *
 * One-time hint: the first time it's comfortably in view AND both images have
 * loaded, it sweeps back and forth once to reveal the drag affordance, then
 * settles at center. It never auto-moves again — the user takes it from there.
 * Skipped entirely under prefers-reduced-motion.
 */
export function BeforeAfter({ before, after, alt }: Props) {
  const [pos, setPos] = useState(50);
  const [moved, setMoved] = useState(false);

  const rafRef = useRef<number | null>(null);
  const movedRef = useRef(false);
  const sweptRef = useRef(false); // the one-time demo has already run
  const inViewRef = useRef(false);
  const loadedRef = useRef(0); // how many of the two images have loaded
  const maybeSweepRef = useRef<() => void>(() => {});
  const rootElRef = useRef<HTMLDivElement>(null);

  // User grabbed the slider — cancel any demo and let them drive for good.
  function takeOver() {
    movedRef.current = true;
    sweptRef.current = true;
    setMoved(true);
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }

  // Called by both image onLoad and the observer; runs the demo when every gate
  // is satisfied (in view, both images loaded, not yet swept, not interacted).
  function onImageLoad() {
    loadedRef.current += 1;
    maybeSweepRef.current();
  }

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // A single smooth back-and-forth: center → right → left → center.
    const runSweep = () => {
      const start = performance.now();
      const DURATION = 2400;
      const AMP = 38; // 50 ± 38 → ~12%..88%
      const tick = (now: number) => {
        if (movedRef.current) return;
        const p = (now - start) / DURATION;
        if (p >= 1) {
          setPos(50);
          rafRef.current = null;
          return;
        }
        setPos(50 + Math.sin(p * Math.PI * 2) * AMP);
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    };

    const maybeSweep = () => {
      if (sweptRef.current || movedRef.current) return;
      if (!inViewRef.current || loadedRef.current < 2) return;
      sweptRef.current = true;
      runSweep();
    };
    maybeSweepRef.current = maybeSweep;

    const el = rootElRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          inViewRef.current = e.isIntersecting && e.intersectionRatio >= 0.6;
        }
        maybeSweep();
      },
      { threshold: [0, 0.6] }
    );
    io.observe(el);
    // In case images were already loaded (cache) before this effect ran.
    maybeSweep();
    return () => {
      io.disconnect();
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      ref={rootElRef}
      className="relative h-full w-full select-none overflow-hidden"
    >
      {/* AFTER — base layer */}
      <Image
        src={after}
        alt={`${alt} — after`}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover"
        onLoad={onImageLoad}
        {...blurProps(after)}
      />

      {/* BEFORE — clipped to the left of the handle */}
      <Image
        src={before}
        alt={`${alt} — before`}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        onLoad={onImageLoad}
        {...blurProps(before)}
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
          takeOver();
        }}
        aria-label={`${alt}: drag to compare before and after`}
        className="absolute inset-0 h-full w-full cursor-ew-resize appearance-none bg-transparent opacity-0"
      />
    </div>
  );
}
