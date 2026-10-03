"use client";

import { useEffect, useRef, useState } from "react";

export function LogoMark({ size = 38 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      aria-hidden
      className="shrink-0"
    >
      <defs>
        <linearGradient id="ml-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7D75FF" />
          <stop offset="100%" stopColor="#5B8DEF" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="46" height="46" rx="14" fill="url(#ml-grad)" />
      <path
        d="M14 34V15.5c0-1.6 1.3-2.9 2.9-2.9h4.4c1 0 2 .6 2.5 1.5l1.2 2.2 1.2-2.2c.5-.9 1.5-1.5 2.5-1.5h4.4c1.6 0 2.9 1.3 2.9 2.9V34"
        fill="none"
        stroke="#fff"
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="34.5" cy="13.5" r="3.6" fill="#FFB84D" stroke="#fff" strokeWidth="1.6" />
    </svg>
  );
}

export function Logo({
  size = 36,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark size={size} />
      <span className="font-rounded text-[1.35rem] font-extrabold tracking-tight text-ink">
        MyLesson
      </span>
    </span>
  );
}

/** XP value that counts up whenever it changes. */
export function XpCounter({
  value,
  className = "",
}: {
  value: number;
  className?: string;
}) {
  const [shown, setShown] = useState(value);
  const from = useRef(value);

  useEffect(() => {
    const start = from.current;
    if (start === value) return;
    const diff = value - start;
    const duration = 750;
    const t0 = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setShown(Math.round(start + diff * eased));
      if (p < 1) frame = requestAnimationFrame(tick);
      else from.current = value;
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return <span className={`tnum ${className}`}>{shown}</span>;
}
