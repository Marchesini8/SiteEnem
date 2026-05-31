"use client";

import { useEffect, useMemo, useState } from "react";

function getTimeLeft(target: number) {
  const total = Math.max(0, target - Date.now());
  const hours = Math.floor(total / (1000 * 60 * 60));
  const minutes = Math.floor((total / (1000 * 60)) % 60);
  const seconds = Math.floor((total / 1000) % 60);

  return { hours, minutes, seconds };
}

export function Countdown() {
  const target = useMemo(() => Date.now() + 1000 * 60 * 47, []);
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(target));

  useEffect(() => {
    const interval = window.setInterval(() => setTimeLeft(getTimeLeft(target)), 1000);
    return () => window.clearInterval(interval);
  }, [target]);

  return (
    <div className="inline-flex items-center gap-2 rounded-lg border border-yellow-200 bg-yellow-50 px-3 py-2 text-sm font-bold text-brand-navy">
      <span>Oferta termina em</span>
      <span className="tabular-nums text-brand-blue">
        {String(timeLeft.hours).padStart(2, "0")}:{String(timeLeft.minutes).padStart(2, "0")}:
        {String(timeLeft.seconds).padStart(2, "0")}
      </span>
    </div>
  );
}
