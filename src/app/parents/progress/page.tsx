"use client";

import { ParentShell } from "@/components/Shells";
import { Card, Chip, ProgressBar, SectionHeading } from "@/components/ui";
import { accuracyOf, topicStatus } from "@/lib/adaptive";
import { subjectProgress, useApp } from "@/lib/store";
import { SUBJECTS, type SubjectId } from "@/lib/types";

export default function ParentProgress() {
  const { state } = useApp();
  const name = state.child?.name ?? "Alex";
  const subjects: SubjectId[] = state.child?.subjects?.length
    ? state.child.subjects
    : (["reading", "writing", "math"] as SubjectId[]);

  return (
    <ParentShell>
      <header className="animate-rise mb-7">
        <p className="text-[11px] font-bold uppercase tracking-widest text-muted">
          Detailed report
        </p>
        <h1 className="mt-1 font-rounded text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          {name}&apos;s learning detail
        </h1>
        <p className="mt-2 text-muted">
          Topic-by-topic accuracy, current difficulty and recent lesson history.
        </p>
      </header>

      <div className="space-y-6">
        {subjects.map((id) => {
          const s = SUBJECTS[id];
          const p = subjectProgress(state, id);
          const tone = id === "reading" ? "brand" : id === "writing" ? "sky" : "sun";
          const difficulty = state.adaptive.difficulty[id];
          return (
            <Card key={id} className="animate-rise p-6 sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-canvas text-xl">
                    {s.emoji}
                  </span>
                  <div>
                    <h2 className="font-rounded text-xl font-extrabold text-ink">
                      {s.label}
                    </h2>
                    <p className="text-sm text-muted">
                      {p.lessons} lesson{p.lessons === 1 ? "" : "s"} · {p.accuracy}% accuracy
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Chip tone={tone}>{difficulty}</Chip>
                  <span className="tnum font-rounded text-2xl font-extrabold text-ink">
                    {p.percent}%
                  </span>
                </div>
              </div>

              <ProgressBar value={p.percent} color={tone} className="mt-5 h-3" />

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {p.topics.map((topic) => {
                  const status = topicStatus(topic.accuracy, topic.attempts);
                  const dot =
                    status === "strong" ? "🟢" : status === "practicing" ? "🟡" : "🔵";
                  const label =
                    status === "strong"
                      ? "Strong"
                      : status === "practicing"
                        ? "Practicing"
                        : "Learning";
                  const stats = state.adaptive.topics[topic.name];
                  const avgMs =
                    stats && stats.correct + stats.incorrect > 0
                      ? Math.round(stats.totalMs / (stats.correct + stats.incorrect) / 1000)
                      : 0;
                  return (
                    <div key={topic.name} className="rounded-3xl border border-line p-4">
                      <p className="font-rounded text-sm font-extrabold text-ink">
                        {topic.name}
                      </p>
                      <p className="mt-1 text-sm text-muted">
                        {dot} {label}
                      </p>
                      <div className="mt-3">
                        <ProgressBar
                          value={topic.accuracy}
                          color={status === "strong" ? "grass" : status === "practicing" ? "sun" : "sky"}
                          className="h-2"
                        />
                      </div>
                      <p className="tnum mt-2 text-xs font-semibold text-muted">
                        {topic.attempts} answers
                        {avgMs > 0 ? ` · ${avgMs}s average` : ""}
                      </p>
                    </div>
                  );
                })}
              </div>
            </Card>
          );
        })}
      </div>

      <section className="mt-9">
        <SectionHeading title="Recent activity" />
        {state.lessons.length === 0 ? (
          <Card className="p-6 text-sm text-muted">
            No lessons completed on this device yet. Weekly summaries appear here after the
            first session.
          </Card>
        ) : (
          <Card className="divide-y divide-line p-0">
            {state.lessons.slice(0, 8).map((lesson) => (
              <div
                key={lesson.at}
                className="flex flex-wrap items-center justify-between gap-3 p-5"
              >
                <div>
                  <p className="font-bold text-ink">
                    {SUBJECTS[lesson.subject].label} · {lesson.topic}
                  </p>
                  <p className="text-sm text-muted">
                    {new Date(lesson.at).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    · {lesson.minutes} min · level {lesson.difficulty}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Chip tone="sky">
                    {lesson.correct} / {lesson.total}
                  </Chip>
                  <Chip tone="brand">+{lesson.xp} XP</Chip>
                </div>
              </div>
            ))}
          </Card>
        )}
      </section>
    </ParentShell>
  );
}
