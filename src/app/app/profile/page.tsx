"use client";

import Link from "next/link";
import { ChildShell } from "@/components/Shells";
import { Milo } from "@/components/Milo";
import { Button, Card, Chip, ProgressBar, SectionHeading } from "@/components/ui";
import { XpCounter } from "@/components/Logo";
import { levelOf, levelProgress, subjectProgress, useApp } from "@/lib/store";
import { ALL_BADGES, SUBJECTS, type SubjectId } from "@/lib/types";

export default function ProfilePage() {
  const { state, actions } = useApp();
  const name = state.child?.name ?? "Alex";
  const age = state.child?.age ?? 7;
  const level = levelOf(state.totalXp);
  const lp = levelProgress(state.totalXp);
  const earned = new Set(state.badges);
  const subjects: SubjectId[] = state.child?.subjects?.length
    ? state.child.subjects
    : (["reading", "writing", "math"] as SubjectId[]);

  return (
    <ChildShell>
      <Card className="animate-rise mb-7 overflow-hidden p-0">
        <div className="bg-gradient-to-br from-brand via-[#6f66ff] to-sky px-6 py-8 sm:px-8">
          <div className="flex flex-wrap items-center gap-6">
            <div className="grid h-24 w-24 shrink-0 place-items-center rounded-[2rem] border-4 border-white/25 bg-white/15 font-rounded text-4xl font-extrabold text-white backdrop-blur">
              {name.slice(0, 1).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="font-rounded text-3xl font-extrabold tracking-tight text-white">
                {name}
              </h1>
              <p className="mt-1 text-white/85">Age {age} · MyLesson learner</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-white/15 px-3.5 py-1.5 text-sm font-bold text-white backdrop-blur">
                  Level {level}
                </span>
                <span className="rounded-full bg-white/15 px-3.5 py-1.5 text-sm font-bold text-white backdrop-blur">
                  ⭐ <XpCounter value={state.totalXp} /> XP
                </span>
                <span className="rounded-full bg-white/15 px-3.5 py-1.5 text-sm font-bold text-white backdrop-blur">
                  🔥 {state.streak} day streak
                </span>
              </div>
            </div>
            <Milo size={104} mood="happy" className="hidden sm:block" />
          </div>
        </div>

        <div className="grid gap-6 p-6 sm:grid-cols-[1fr_1fr] sm:p-7">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-muted">
              Progress to Level {level + 1}
            </p>
            <ProgressBar value={lp.percent} color="brand" className="mt-3 h-3" />
            <p className="mt-2 text-sm text-muted">
              {lp.into} / {lp.toNext} XP · {lp.toNext - lp.into} XP to go
            </p>
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-muted">
              Today
            </p>
            <ProgressBar
              value={(state.minutesToday / state.minutesGoal) * 100}
              color="grass"
              className="mt-3 h-3"
            />
            <p className="tnum mt-2 text-sm text-muted">
              {state.minutesToday} / {state.minutesGoal} minutes learned
            </p>
          </div>
        </div>
      </Card>

      <section className="mb-8">
        <SectionHeading title="Badges" />
        <div className="grid gap-4 sm:grid-cols-3">
          {ALL_BADGES.filter((b) => earned.has(b.id)).map((badge, i) => (
            <Card
              key={badge.id}
              hover
              className="animate-rise p-5 text-center"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <span className="grid h-16 w-16 mx-auto place-items-center rounded-3xl bg-sun-soft text-3xl">
                {badge.emoji}
              </span>
              <p className="mt-3 font-rounded text-base font-extrabold text-ink">
                {badge.label}
              </p>
              <p className="mt-1 text-sm text-muted">{badge.detail}</p>
            </Card>
          ))}
          {earned.size === 0 && (
            <Card className="p-5 text-center sm:col-span-3">
              <p className="text-sm text-muted">
                No badges yet — finish a lesson to earn your first one.
              </p>
            </Card>
          )}
        </div>
      </section>

      <section className="mb-8">
        <SectionHeading title="My subjects" />
        <div className="space-y-4">
          {subjects.map((id) => {
            const s = SUBJECTS[id];
            const p = subjectProgress(state, id);
            const tone = id === "reading" ? "brand" : id === "writing" ? "sky" : "sun";
            return (
              <Card key={id} className="flex flex-wrap items-center gap-5 p-5 sm:p-6">
                <span className="text-3xl" aria-hidden>
                  {s.emoji}
                </span>
                <div className="min-w-[140px] flex-1">
                  <p className="font-rounded text-lg font-extrabold text-ink">{s.label}</p>
                  <p className="text-sm text-muted">{s.blurb}</p>
                </div>
                <div className="w-full sm:w-56">
                  <ProgressBar value={p.percent} color={tone} />
                  <p className="tnum mt-1.5 text-xs font-bold text-muted">
                    {p.percent}% · {p.lessons} lessons
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      <section>
        <SectionHeading title="Settings" />
        <Card className="divide-y divide-line p-0">
          <Row label="Name" value={name} />
          <Row label="Age" value={`${age} years`} />
          <Row
            label="Subjects"
            value={subjects.map((id) => SUBJECTS[id].label).join(", ")}
          />
          <Row
            label="Difficulty"
            value={Object.entries(state.adaptive.difficulty)
              .map(([s, d]) => `${SUBJECTS[s as SubjectId].label}: ${d}`)
              .join(" · ")}
          />
          <div className="flex flex-wrap items-center justify-between gap-3 p-5">
            <div>
              <p className="font-bold text-ink">Start over</p>
              <p className="text-sm text-muted">
                Clears progress on this device and returns to onboarding.
              </p>
            </div>
            <div className="flex gap-2">
              <Link href="/onboarding">
                <Button variant="secondary" size="sm">
                  Edit profile
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (window.confirm("Clear all local progress and start again?")) {
                    actions.reset();
                  }
                }}
              >
                Reset
              </Button>
            </div>
          </div>
        </Card>
      </section>
    </ChildShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 p-5">
      <p className="font-bold text-ink">{label}</p>
      <p className="text-sm font-semibold text-muted">{value}</p>
    </div>
  );
}
