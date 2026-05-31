"use client";

import { useRef, useState } from "react";
import { Play } from "lucide-react";

export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasStarted, setHasStarted] = useState(false);

  async function handlePlay() {
    const video = videoRef.current;
    if (!video) return;

    setHasStarted(true);
    video.controls = true;
    await video.play();
  }

  return (
    <div className="relative mx-auto max-w-[420px] overflow-hidden rounded-2xl border border-blue-100 bg-brand-navy shadow-glow animate-pulseSoft sm:max-w-[520px] lg:max-w-none">
      <video
        ref={videoRef}
        className="aspect-[9/16] w-full bg-brand-navy object-cover sm:aspect-[4/5] lg:aspect-[1024/1365]"
        src="/images/gps-do-vestibulando.mp4"
        playsInline
        preload="none"
        aria-label="Vídeo de apresentação do Guia Definitivo ENEM 2026"
      />

      {!hasStarted ? (
        <button
          type="button"
          onClick={handlePlay}
          className="absolute inset-0 grid place-items-center bg-brand-navy/35 text-brand-navy transition hover:bg-brand-navy/20"
          aria-label="Assistir vídeo"
        >
          <span className="grid h-24 w-24 place-items-center rounded-full bg-brand-yellow shadow-2xl shadow-yellow-300/40 animate-pulseSoft transition hover:scale-105">
            <Play size={42} fill="currentColor" className="ml-1" aria-hidden="true" />
          </span>
        </button>
      ) : null}
    </div>
  );
}
