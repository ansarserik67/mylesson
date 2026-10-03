"use client";

import { ChildShell } from "@/components/Shells";
import { MiloCoach } from "@/components/Milo";
import { Card, Chip, ProgressBar, SectionHeading, StatTile } from "@/components/ui";
import { XpCounter } from "@/components/Logo";
import { levelOf, levelProgress, useApp } from "@/lib/store";
import { ALL_BADGES, SUBJECTS } from "@/lib/types";

export default function AchievementsPage() {
  const { state } = useApp();
  const name = state.child?.name ?? "Alex";
  const level = levelOf(state.totalXp);
  const lp = levelProgress(state.totalXp);
  const earned = new Set(state.badges);

  return (
    <ChildShell>
      <div className="animate-rise mb-7">
        <h1 className="font-rounded text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          🏆 Achievements
        </h1>
        <p className="mt-2 text-lg text-muted">
          Every badge is something you learned, {name}.
        </p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <StatTile icon="⭐" value={`${state.totalXp}`} label="Total XP" tone="sun" />
        <StatTile icon="🔥" value={`${state.streak} days`} label="Current streak" tone="brand" />
        <StatTile
          icon="🏅"
          value={`${earned.size} / ${ALL_BADGES.length}`}
          label="Badges unlocked"
          tone="grass"
        />
      </div>

      <Card className="animate-rise mb-8 p-6 sm:p-7">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-muted">
              Level {level}
            </p>
            <p className="tnum mt-1 font-rounded text-3xl font-extrabold text-ink">
              <XpCounter value={state.totalXp} /> XP
            </p>
          </div>
          <p className="text-sm font-semibold text-muted">
            {lp.toNext - lp.into} XP to Level {level + 1}
          </p>
        </div>
        <ProgressBar value={lp.percent} color="brand" className="mt-4 h-3" />

        <div className="mt-6 grid grid-cols-7 gap-2">
          {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => {
            const active = i < Math.min(7, state.streak);
            return (
              <div key={`${day}-${i}`} className="text-center">
                <div
                  className={`grid h-11 place-items-center rounded-2xl text-lg transition-all duration-300 ${
                    active
                      ? "bg-gradient-to-br from-brand to-sky text-white"
                      : "border border-line bg-white"
                  }`}
                  style={{ transitionDelay: `${i * 60}ms` }}
                >
                  {active ? "🔥" : ""}
                </div>
                <span className="mt-1 block text-[11px] font-bold text-muted">{day}</span>
              </div>
            );
          })}
        </div>
      </Card>

      <section className="mb-8">
        <SectionHeading title="Badges" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ALL_BADGES.map((badge, i) => {
            const unlocked = earned.has(badge.id);
            return (
              <Card
                key={badge.id}
                hover={unlocked}
                className={`animate-rise flex items-center gap-4 p-5 ${
                  unlocked ? "" : "opacity-70"
                }`}
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <span
                  className={`grid h-14 w-14 shrink-0 place-items-center rounded-3xl text-2xl ${
                    unlocked ? "bg-sun-soft" : "bg-[#F1F2F7] grayscale"
                  }`}
                  aria-hidden
                >
                  {badge.emoji}
                </span>
                <div className="min-w-0">
                  <p className="font-rounded text-base font-extrabold text-ink">
                    {badge.label}
                  </p>
                  <p className="mt-0.5 text-sm text-muted">{badge.detail}</p>
                  {unlocked && (
                    <Chip tone="grass" className="mt-2">
                      Unlocked
                    </Chip>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      <section>
        <SectionHeading title="Recent lessons" />
        {state.lessons.length === 0 ? (
          <Card className="p-6">
            <MiloCoach
              size={68}
              mood="happy"
              message="Finish your first lesson and it will show up right here!"
            />
          </Card>
        ) : (
          <ul className="space-y-3">
            {state.lessons.slice(0, 6).map((lesson) => {
              const pct = Math.round((lesson.correct / lesson.total) * 100);
              return (
                <li key={lesson.at}>
                  <Card className="animate-rise flex flex-wrap items-center gap-4 p-5">
                    <span className="text-2xl" aria-hidden>
                      {SUBJECTS[lesson.subject].emoji}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-rounded text-base font-extrabold text-ink">
                        {SUBJECTS[lesson.subject].label} · {lesson.topic}
                      </p>
                      <p className="text-sm text-muted">
                        {lesson.correct} / {lesson.total} correct · {lesson.difficulty}
                      </p>
                    </div>
                    <Chip tone={pct >= 80 ? "grass" : pct >= 60 ? "sun" : "sky"}>
                      {pct}%
                    </Chip>
                    <Chip tone="brand">+{lesson.xp} XP</Chip>
                  </Card>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </ChildShell>
  );
}
