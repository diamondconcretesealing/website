"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import heroPoster from "@/public/images/hero-poster.jpg";

// Hero background media. The poster is a real next/image overlay so it's
// optimized (AVIF/WebP) and preloaded as the LCP element; the <video> sits at
// the same layer and fades in once it can play, so there's never a black flash.
// On reduced-motion or Save-Data the video is never mounted — the poster alone
// carries the hero (saves the full clip download on constrained connections).
export function HeroVideo() {
  const [playVideo, setPlayVideo] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const conn = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;
    if (!reduce && conn?.saveData !== true) setPlayVideo(true);
  }, []);

  return (
    <>
      {/* LCP image: static import → auto blur + dimensions; preload + 100vw sizes. */}
      <Image
        src={heroPoster}
        alt=""
        aria-hidden="true"
        fill
        preload
        sizes="100vw"
        placeholder="blur"
        className="absolute inset-0 -z-20 h-full w-full object-cover"
      />
      {playVideo && (
        <video
          className={`absolute inset-0 -z-20 h-full w-full object-cover transition-opacity duration-700 ${
            videoReady ? "opacity-100" : "opacity-0"
          }`}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          onCanPlay={() => setVideoReady(true)}
        >
          <source src="/hero.webm" type="video/webm" />
          <source src="/hero.mp4" type="video/mp4" />
        </video>
      )}
    </>
  );
}
