"use client";

import Link from "next/link";
import { ParentShell } from "@/components/Shells";
import { Card, Chip, ProgressBar, SectionHeading, StatTile } from "@/components/ui";
import { MiloCoach } from "@/components/Milo";
import { accuracyOf, topicStatus } from "@/lib/adaptive";
import { levelOf, subjectProgress, useApp } from "@/lib/store";
import { SUBJECTS, SUBJECT_LIST, type SubjectId } from "@/lib/types";

export default function ParentOverview() {
  const { state } = useApp();
  const name = state.child?.name ?? "Alex";
  const subjects: SubjectId[] = state.child?.subjects?.length
    ? state.child.subjects
    : (["reading", "writing", "math"] as SubjectId[]);

  const totals = weeklyTotals(state.lessons);
  const weakest = weakestTopic(state, subjects);

  return (
    <ParentShell>
      <header className="animate-rise mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-muted">
            Parent dashboard
          </p>
          <h1 className="mt-1 font-rounded text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            {name}&apos;s Progress
          </h1>
          <p className="mt-2 text-muted">
            Age {state.child?.age ?? 7} · Level {levelOf(state.totalXp)} · {state.totalXp} XP
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Chip tone="grass">🟢 On track</Chip>
          <Chip tone="sun">🔥 {state.streak} day streak</Chip>
        </div>
      </header>

      {/* --------------------- Learning overview ---------------------- */}
      <section className="mb-8">
        <SectionHeading
          title="Learning Overview"
          action={
            <Link
              href="/parents/progress"
              className="text-sm font-bold text-brand hover:text-brand-600"
            >
              Full report →
            </Link>
          }
        />
        <div className="grid gap-4 lg:grid-cols-3">
          {subjects.map((id, i) => {
            const s = SUBJECTS[id];
            const p = subjectProgress(state, id);
            const tone = id === "reading" ? "brand" : id === "writing" ? "sky" : "sun";
            return (
              <Card
                key={id}
                className="animate-rise p-6"
                style={{ animationDelay: `${i * 70}ms` }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-rounded text-base font-extrabold text-ink">
                    {s.label}
                  </span>
                  <span className="text-lg" aria-hidden>
                    {s.emoji}
                  </span>
                </div>
                <p className="tnum mt-3 font-rounded text-3xl font-extrabold text-ink">
                  {p.percent}%
                </p>
                <ProgressBar value={p.percent} color={tone} className="mt-3" />
                <p className="mt-3 text-sm text-muted">
                  {p.lessons} lesson{p.lessons === 1 ? "" : "s"} · {p.accuracy}% accuracy
                </p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* -------------------------- This week ------------------------- */}
      <section className="mb-8">
        <SectionHeading title="This Week" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatTile
            icon="⏱️"
            value={totals.time || "4h 20m"}
            label="Learning time"
            tone="brand"
          />
          <StatTile
            icon="✅"
            value={totals.questions ? `${totals.questions}` : "126"}
            label="Questions completed"
            tone="sky"
          />
          <StatTile
            icon="🎯"
            value={`${totals.accuracy || 87}%`}
            label="Average accuracy"
            tone="grass"
          />
          <StatTile icon="🔥" value={`${state.streak}`} label="Day streak" tone="sun" />
        </div>
      </section>

      {/* --------------------- Insights + recommendation -------------- */}
      <section className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <Card className="animate-rise p-6 sm:p-7">
          <SectionHeading title="Learning Insights" />
          <div className="space-y-5">
            {subjects.slice(0, 2).map((id) => (
              <div key={id}>
                <p className="mb-2 font-rounded text-base font-extrabold text-ink">
                  {SUBJECTS[id].emoji} {SUBJECTS[id].label}
                </p>
                <ul className="space-y-2">
                  {SUBJECTS[id].topics.map((topic) => {
                    const stats = state.adaptive.topics[topic];
                    const status = topicStatus(
                      accuracyOf(stats),
                      stats ? stats.correct + stats.incorrect : 0,
                    );
                    const label =
                      status === "strong"
                        ? "Strong"
                        : status === "practicing"
                          ? "Practicing"
                          : "Learning";
                    const dot =
                      status === "strong" ? "🟢" : status === "practicing" ? "🟡" : "🔵";
                    return (
                      <li
                        key={topic}
                        className="flex items-center justify-between rounded-2xl bg-canvas px-4 py-2.5"
                      >
                        <span className="text-sm font-bold text-ink-soft">{topic}</span>
                        <span className="text-sm font-semibold text-muted">
                          {dot} {label}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </Card>

        <Card className="animate-rise flex flex-col p-6 [animation-delay:80ms] sm:p-7">
          <SectionHeading title="MyLesson's recommendation" />
          <div className="flex-1 rounded-3xl bg-gradient-to-br from-brand-soft to-sky-soft p-5">
            <p className="text-[15px] font-semibold leading-relaxed text-ink-soft">
              {recommendation(name, state, weakest)}
            </p>
          </div>
          <div className="mt-5">
            <MiloCoach
              size={62}
              mood="happy"
              message="Short, daily practice works best. Ten minutes is plenty."
            />
          </div>
        </Card>
      </section>
    </ParentShell>
  );
}

function weeklyTotals(lessons: { correct: number; total: number; minutes: number }[]) {
  if (lessons.length === 0) return { time: "", questions: 0, accuracy: 0 };
  const minutes = lessons.reduce((sum, l) => sum + l.minutes, 0);
  const questions = lessons.reduce((sum, l) => sum + l.total, 0);
  const correct = lessons.reduce((sum, l) => sum + l.correct, 0);
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return {
    time: h > 0 ? `${h}h ${m}m` : `${m}m`,
    questions,
    accuracy: questions === 0 ? 0 : Math.round((correct / questions) * 100),
  };
}

function weakestTopic(state: ReturnType<typeof useApp>["state"], subjects: SubjectId[]) {
  let best: { topic: string; accuracy: number } | null = null;
  for (const id of subjects) {
    for (const topic of SUBJECTS[id].topics) {
      const stats = state.adaptive.topics[topic];
      const attempts = stats ? stats.correct + stats.incorrect : 0;
      if (attempts < 2) continue;
      const acc = accuracyOf(stats);
      if (!best || acc < best.accuracy) best = { topic, accuracy: acc };
    }
  }
  return best;
}

function recommendation(
  name: string,
  state: ReturnType<typeof useApp>["state"],
  weakest: { topic: string; accuracy: number } | null,
) {
  const strongTopic = Object.entries(state.adaptive.topics)
    .filter(([, s]) => s.correct + s.incorrect >= 4)
    .sort((a, b) => accuracyOf(b[1]) - accuracyOf(a[1]))[0];

  const strongName = strongTopic?.[0] ?? "addition";

  if (!weakest) {
    return `${name} is just getting started. After a few more lessons we'll be able to recommend exactly what to practise next.`;
  }

  return `${name} is progressing well in ${strongName.toLowerCase()}. We recommend practising ${weakest.topic.toLowerCase()} for another 10 minutes this week.`;
}
