"use client";

import { useEffect, useState } from "react";
import { Milo } from "./Milo";
import { Button, Card } from "./ui";
import { XpCounter } from "./Logo";
import type { LessonResult } from "@/lib/store";

const CONFETTI = ["#6C63FF", "#5B8DEF", "#FFB84D", "#45C486", "#8B84FF", "#FFD08A"];

export function Celebration({
  result,
  onContinue,
  onAgain,
}: {
  result: LessonResult;
  onContinue: () => void;
  onAgain: () => void;
}) {
  const stars = starsFor(result);
  const [burst, setBurst] = useState(0);

  useEffect(() => {
    setBurst((b) => b + 1);
  }, [result.at]);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-[#202124]/35 px-4 py-8 backdrop-blur-sm">
      <Card className="animate-pop relative w-full max-w-lg overflow-hidden p-7 text-center sm:p-9">
        {/* confetti */}
        <div key={burst} aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          {Array.from({ length: 26 }).map((_, i) => (
            <span
              key={i}
              className="animate-sparkle absolute block rounded-sm"
              style={{
                left: `${(i * 37) % 100}%`,
                top: `${-10 + ((i * 13) % 40)}%`,
                width: 8,
                height: 8,
                background: CONFETTI[i % CONFETTI.length],
                animationDelay: `${i * 45}ms`,
                transform: `rotate(${i * 23}deg)`,
              }}
            />
          ))}
        </div>

        <div className="relative">
          <Milo size={112} mood="cheer" className="mx-auto" />
          <h1 className="mt-5 font-rounded text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Lesson Complete! 🎉
          </h1>

          <p className="tnum mt-3 font-rounded text-4xl font-extrabold text-brand">
            +<XpCounter value={result.xp} /> XP
          </p>

          <div className="mt-6 flex items-center justify-center gap-2 text-3xl">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={i < stars ? "animate-pop" : "opacity-25 grayscale"}
                style={{ animationDelay: `${200 + i * 110}ms` }}
                aria-hidden
              >
                ⭐
              </span>
            ))}
          </div>
          <p className="tnum mt-2 font-rounded text-xl font-extrabold text-ink">
            {result.correct} / {result.total}
          </p>

          <p className="mt-4 text-lg font-semibold text-muted">
            You&apos;re doing great!
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button size="lg" onClick={onContinue}>
              Continue Learning
            </Button>
            <Button variant="secondary" size="lg" onClick={onAgain}>
              Practise again
            </Button>
          </div>

          <p className="mt-5 text-xs font-semibold uppercase tracking-widest text-muted">
            {result.minutes} min · {Math.round((result.correct / result.total) * 100)}% accuracy
          </p>
        </div>
      </Card>
    </div>
  );
}

export function starsFor(result: LessonResult) {
  const pct = result.total === 0 ? 0 : result.correct / result.total;
  if (pct >= 1) return 5;
  if (pct >= 0.9) return 4;
  if (pct >= 0.7) return 3;
  if (pct >= 0.5) return 2;
  return 1;
}
