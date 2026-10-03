"use client";

import { useEffect, useState } from "react";

export type MiloMood = "idle" | "happy" | "thinking" | "cheer";

/**
 * Milo — the MyLesson tutor. Deliberately simple and soft so it reads as
 * friendly, never as a loud cartoon mascot.
 */
export function Milo({
  size = 96,
  mood = "idle",
  className = "",
}: {
  size?: number;
  mood?: MiloMood;
  className?: string;
}) {
  const bounce = mood === "happy" || mood === "cheer";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      className={`${bounce ? "animate-float" : ""} ${className}`}
      aria-label="Milo, your tutor"
      role="img"
    >
      <defs>
        <linearGradient id="milo-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8E87FF" />
          <stop offset="100%" stopColor="#6C63FF" />
        </linearGradient>
        <linearGradient id="milo-belly" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#EDEBFF" />
        </linearGradient>
      </defs>

      {/* soft shadow */}
      <ellipse cx="60" cy="110" rx="26" ry="5" fill="#202124" opacity="0.08" />

      {/* ears */}
      <circle cx="30" cy="34" r="11" fill="#7C74FF" />
      <circle cx="90" cy="34" r="11" fill="#7C74FF" />

      {/* body */}
      <rect x="14" y="24" width="92" height="80" rx="34" fill="url(#milo-body)" />
      <rect x="34" y="60" width="52" height="38" rx="19" fill="url(#milo-belly)" />

      {/* eyes */}
      {mood === "thinking" ? (
        <>
          <path d="M40 54h12" stroke="#202124" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M68 54h12" stroke="#202124" strokeWidth="4.5" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="46" cy="54" r="6.5" fill="#202124" />
          <circle cx="74" cy="54" r="6.5" fill="#202124" />
          <circle cx="48" cy="51.5" r="2.2" fill="#fff" />
          <circle cx="76" cy="51.5" r="2.2" fill="#fff" />
        </>
      )}

      {/* cheeks */}
      <circle cx="34" cy="66" r="5" fill="#FFB84D" opacity="0.5" />
      <circle cx="86" cy="66" r="5" fill="#FFB84D" opacity="0.5" />

      {/* smile */}
      {mood === "cheer" ? (
        <path
          d="M50 68c3.5 6 16.5 6 20 0"
          fill="none"
          stroke="#202124"
          strokeWidth="4"
          strokeLinecap="round"
        />
      ) : mood === "thinking" ? (
        <path d="M52 70h16" stroke="#202124" strokeWidth="4" strokeLinecap="round" />
      ) : (
        <path
          d="M51 67c3 4.5 15 4.5 18 0"
          fill="none"
          stroke="#202124"
          strokeWidth="4"
          strokeLinecap="round"
        />
      )}

      {/* graduation cap — the "tutor" cue */}
      <path d="M60 8l22 8-22 8-22-8z" fill="#202124" />
      <path d="M74 20v10" stroke="#202124" strokeWidth="3" strokeLinecap="round" />
      <circle cx="74" cy="32" r="3.4" fill="#FFB84D" />
    </svg>
  );
}

/** Milo's speech bubble. Keeps messages to one short sentence. */
export function MiloSays({
  children,
  className = "",
  tone = "neutral",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "neutral" | "correct" | "hint";
}) {
  const [key, setKey] = useState(0);
  useEffect(() => setKey((k) => k + 1), [children]);

  const tones = {
    neutral: "bg-white border-line text-ink-soft",
    correct: "bg-grass-soft border-[#bfeed7] text-[#1F8A5A]",
    hint: "bg-sun-soft border-[#ffe2b8] text-[#8A5A12]",
  } as const;

  return (
    <div
      key={key}
      className={`animate-rise relative rounded-3xl border px-4 py-3 text-sm font-semibold leading-snug shadow-soft ${tones[tone]} ${className}`}
    >
      {children}
    </div>
  );
}

export function MiloCoach({
  message,
  mood = "idle",
  size = 64,
  tone = "neutral",
  label = "Milo",
}: {
  message: string;
  mood?: MiloMood;
  size?: number;
  tone?: "neutral" | "correct" | "hint";
  label?: string;
}) {
  return (
    <div className="flex items-end gap-3">
      <div className="shrink-0">
        <Milo size={size} mood={mood} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="mb-1 text-[11px] font-bold uppercase tracking-widest text-muted">
          {label}
        </p>
        <MiloSays tone={tone}>{message}</MiloSays>
      </div>
    </div>
  );
}
