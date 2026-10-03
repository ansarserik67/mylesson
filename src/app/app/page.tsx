"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChildShell } from "@/components/Shells";
import { Milo } from "@/components/Milo";
import { Button, Card, Chip, ProgressBar, SectionHeading, StatTile } from "@/components/ui";
import { XpCounter } from "@/components/Logo";
import { levelOf, levelProgress, subjectProgress, useApp } from "@/lib/store";
import { SUBJECT_LIST, SUBJECTS, type SubjectId } from "@/lib/types";

function greetingFor(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function ChildDashboard() {
  const { state, actions } = useApp();
  const router = useRouter();

  const name = state.child?.name ?? "Alex";
  const hour = new Date().getHours();
  const level = levelOf(state.totalXp);
  const lp = levelProgress(state.totalXp);

  const subjectIds: SubjectId[] = state.child?.subjects?.length
    ? state.child.subjects
    : (["reading", "writing", "math"] as SubjectId[]);

  const ranked = subjectIds
    .map((id) => ({ id, progress: subjectProgress(state, id) }))
    .sort((a, b) => a.progress.percent - b.progress.percent);

  const focus = ranked[0];
  const focusSubject = SUBJECTS[focus.id];
  const focusTopic =
    state.adaptive.focusTopic && focusSubject.topics.includes(state.adaptive.focusTopic)
      ? state.adaptive.focusTopic
      : focusSubject.topics[0];

  const start = () => {
    actions.startLesson(focus.id, focusTopic);
    router.push("/app/lesson");
  };

  return (
    <ChildShell>
      {/* ------------------------- Greeting ------------------------- */}
      <div className="animate-rise mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-rounded text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            {greetingFor(hour)}, {name}! 👋
          </h1>
          <p className="mt-2 text-lg text-muted">Ready to learn something new?</p>
        </div>
        <div className="hidden shrink-0 sm:block">
          <Milo size={92} mood="happy" />
        </div>
      </div>

      {/* --------------------- Today's progress ---------------------- */}
      <Card className="animate-rise mb-8 overflow-hidden p-0 [animation-delay:80ms]">
        <div className="grid gap-6 p-6 sm:grid-cols-[1.2fr_1fr] sm:p-7">
          <div>
            <div className="mb-1 flex items-baseline justify-between gap-3">
              <h2 className="font-rounded text-lg font-extrabold text-ink">
                Today&apos;s Progress
              </h2>
              <span className="tnum text-sm font-bold text-muted">
                {state.minutesToday} / {state.minutesGoal} minutes
              </span>
            </div>
            <p className="mb-4 text-sm text-muted">
              {state.minutesToday >= state.minutesGoal
                ? "Goal reached — nice work today!"
                : `${state.minutesGoal - state.minutesToday} minutes left to reach today's goal.`}
            </p>
            <ProgressBar
              value={Math.min(100, (state.minutesToday / state.minutesGoal) * 100)}
              color="brand"
              className="h-3.5"
            />

            <div className="mt-6 flex flex-wrap gap-2">
              <Chip tone="sun" className="px-3.5 py-1.5 text-sm">
                🔥 <strong>{state.streak} day streak</strong>
              </Chip>
              <Chip tone="brand" className="px-3.5 py-1.5 text-sm">
                ⭐ <XpCounter value={state.totalXp} /> XP
              </Chip>
              <Chip tone="sky" className="px-3.5 py-1.5 text-sm">
                Level {level}
              </Chip>
            </div>
          </div>

          <div className="rounded-3xl bg-gradient-to-br from-brand-soft to-sky-soft p-5">
            <p className="text-[11px] font-bold uppercase tracking-widest text-muted">
              Level {level}
            </p>
            <p className="tnum mt-1 font-rounded text-2xl font-extrabold text-ink">
              {lp.into} / {lp.toNext} XP
            </p>
            <ProgressBar value={lp.percent} color="sky" className="mt-3 h-2.5" />
            <p className="mt-3 text-sm text-muted">
              {lp.toNext - lp.into} XP until Level {level + 1}.
            </p>
          </div>
        </div>
      </Card>

      {/* ---------------------- Continue learning -------------------- */}
      <section className="mb-9">
        <SectionHeading
          title="Continue Learning"
          action={
            <Link
              href="/app/learn"
              className="text-sm font-bold text-brand transition hover:text-brand-600"
            >
              All subjects →
            </Link>
          }
        />

        <Card className="animate-rise relative overflow-hidden p-0 [animation-delay:120ms]">
          <div className="grid gap-6 bg-gradient-to-br from-brand to-[#7a72ff] p-6 text-white sm:grid-cols-[1.4fr_1fr] sm:p-8">
            <div className="relative z-10">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-widest">
                Pick up where you left off
              </span>
              <h3 className="mt-4 font-rounded text-3xl font-extrabold tracking-tight">
                {focusSubject.emoji} {focusSubject.label}
              </h3>
              <p className="mt-1 text-lg font-semibold text-white/85">
                {focusTopic}
              </p>

              <div className="mt-5 max-w-sm">
                <div className="mb-2 flex items-center justify-between text-sm font-semibold text-white/80">
                  <span>Progress</span>
                  <span className="tnum">{focus.progress.percent}%</span>
                </div>
                <div className="track h-3 bg-white/20">
                  <div
                    className="fill bg-white"
                    style={{ width: `${Math.max(6, focus.progress.percent)}%` }}
                  />
                </div>
              </div>

              <Button
                size="lg"
                variant="inverse"
                onClick={start}
                className="mt-6"
              >
                Continue →
              </Button>
            </div>

            <div className="relative hidden items-end justify-end sm:flex">
              <div className="absolute right-0 top-0 text-right">
                <p className="text-[11px] font-bold uppercase tracking-widest text-white/70">
                  Milo says
                </p>
                <p className="mt-1 max-w-[190px] rounded-3xl rounded-tr-md bg-white/15 px-4 py-3 text-sm font-semibold leading-snug backdrop-blur">
                  {state.adaptive.topics[focusTopic]
                    ? `You're doing well in ${focusSubject.label.toLowerCase()}. Let's practise ${focusTopic.toLowerCase()} today.`
                    : `Let's start with ${focusTopic.toLowerCase()}. I'll help you!`}
                </p>
              </div>
              <Milo size={132} mood="cheer" className="mt-16" />
            </div>
          </div>
        </Card>
      </section>

      {/* --------------------------- Explore ------------------------- */}
      <section className="mb-9">
        <SectionHeading title="Explore" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SUBJECT_LIST.filter((s) => subjectIds.includes(s.id)).map((s, i) => {
            const p = subjectProgress(state, s.id);
            const tone =
              s.id === "reading" ? "brand" : s.id === "writing" ? "sky" : "sun";
            return (
              <Card
                key={s.id}
                hover
                className="animate-rise flex flex-col p-6"
                style={{ animationDelay: `${160 + i * 70}ms` }}
              >
                <div className="mb-4 text-3xl" aria-hidden>
                  {s.emoji}
                </div>
                <h3 className="font-rounded text-lg font-extrabold text-ink">{s.label}</h3>
                <p className="mt-1 flex-1 text-[15px] leading-relaxed text-muted">
                  {s.blurb}
                </p>
                <div className="mt-5">
                  <ProgressBar value={p.percent} color={tone} />
                  <div className="mt-2 flex items-center justify-between">
                    <span className="tnum text-xs font-bold text-muted">
                      {p.percent}% complete
                    </span>
                    <button
                      onClick={() => {
                        actions.startLesson(s.id, null);
                        router.push("/app/lesson");
                      }}
                      className="text-sm font-bold text-brand transition hover:text-brand-600"
                    >
                      Start →
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* ------------------------- Quick stats ----------------------- */}
      <section className="grid gap-4 sm:grid-cols-3">
        <StatTile
          icon="🏅"
          value={`${state.badges.length}`}
          label="Badges earned"
          tone="sun"
        />
        <StatTile
          icon="📚"
          value={`${state.lessons.length}`}
          label="Lessons completed"
          tone="brand"
        />
        <StatTile
          icon="🎯"
          value={`${averageAccuracy(state.lessons)}%`}
          label="Average accuracy"
          tone="grass"
        />
      </section>
    </ChildShell>
  );
}

function averageAccuracy(lessons: { correct: number; total: number }[]) {
  if (lessons.length === 0) return 87;
  const total = lessons.reduce((sum, l) => sum + l.total, 0);
  const correct = lessons.reduce((sum, l) => sum + l.correct, 0);
  return Math.round((correct / total) * 100);
}
