"use client";

import { ParentShell } from "@/components/Shells";
import { Card, Chip, ProgressBar, SectionHeading } from "@/components/ui";
import { MiloCoach } from "@/components/Milo";
import { accuracyOf, topicStatus } from "@/lib/adaptive";
import { useApp } from "@/lib/store";
import { SUBJECTS, type SubjectId } from "@/lib/types";

export default function ParentInsights() {
  const { state } = useApp();
  const name = state.child?.name ?? "Alex";
  const subjects: SubjectId[] = state.child?.subjects?.length
    ? state.child.subjects
    : (["reading", "writing", "math"] as SubjectId[]);

  const entries = subjects.flatMap((id) =>
    SUBJECTS[id].topics.map((topic) => {
      const stats = state.adaptive.topics[topic];
      const attempts = stats ? stats.correct + stats.incorrect : 0;
      const accuracy = accuracyOf(stats);
      const avgSeconds =
        stats && attempts > 0 ? Math.round(stats.totalMs / attempts / 1000) : 0;
      return {
        subject: id,
        topic,
        attempts,
        accuracy,
        avgSeconds,
        status: topicStatus(accuracy, attempts),
      };
    }),
  );

  const strengths = [...entries].filter((e) => e.status === "strong").sort((a, b) => b.accuracy - a.accuracy);
  const practice = [...entries].filter((e) => e.status !== "strong").sort((a, b) => a.accuracy - b.accuracy);

  return (
    <ParentShell>
      <header className="animate-rise mb-7">
        <p className="text-[11px] font-bold uppercase tracking-widest text-muted">
          Learning insights
        </p>
        <h1 className="mt-1 font-rounded text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          What MyLesson noticed
        </h1>
        <p className="mt-2 text-muted">
          Plain-language findings from {name}&apos;s answers, updated after every lesson.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr]">
        <div className="space-y-6">
          {subjects.map((id) => (
            <Card key={id} className="animate-rise p-6 sm:p-7">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-canvas text-lg">
                  {SUBJECTS[id].emoji}
                </span>
                <h2 className="font-rounded text-xl font-extrabold text-ink">
                  {SUBJECTS[id].label}
                </h2>
              </div>

              <ul className="mt-5 space-y-3">
                {SUBJECTS[id].topics.map((topic) => {
                  const stats = state.adaptive.topics[topic];
                  const attempts = stats ? stats.correct + stats.incorrect : 0;
                  const accuracy = Math.round(accuracyOf(stats) * 100);
                  const status = topicStatus(accuracyOf(stats), attempts);
                  const dot =
                    status === "strong" ? "🟢" : status === "practicing" ? "🟡" : "🔵";
                  const label =
                    status === "strong"
                      ? "Strong"
                      : status === "practicing"
                        ? "Practicing"
                        : "Learning";
                  return (
                    <li key={topic} className="rounded-3xl bg-canvas p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-bold text-ink-soft">{topic}</span>
                        <span className="text-sm font-semibold text-muted">
                          {dot} {label}
                        </span>
                      </div>
                      <div className="mt-3">
                        <ProgressBar
                          value={accuracy}
                          color={status === "strong" ? "grass" : status === "practicing" ? "sun" : "sky"}
                          className="h-2"
                        />
                      </div>
                      <p className="tnum mt-2 text-xs font-semibold text-muted">
                        {accuracy}% accuracy · {attempts} answers
                      </p>
                    </li>
                  );
                })}
              </ul>
            </Card>
          ))}
        </div>

        <div className="space-y-6">
          <Card className="animate-rise p-6 sm:p-7">
            <SectionHeading title="MyLesson's recommendation" />
            <div className="rounded-3xl bg-gradient-to-br from-brand-soft to-sky-soft p-5">
              <p className="text-[15px] font-semibold leading-relaxed text-ink-soft">
                {buildRecommendation(name, strengths, practice)}
              </p>
            </div>
            <div className="mt-5">
              <MiloCoach
                size={62}
                mood="happy"
                message="I adjust the difficulty automatically, so practice never feels too hard."
              />
            </div>
          </Card>

          <Card className="animate-rise p-6 [animation-delay:80ms] sm:p-7">
            <SectionHeading title="Signals MyLesson tracks" />
            <ul className="space-y-3 text-sm">
              {[
                { icon: "✅", label: "Correct answers", value: `${state.lessons.reduce((s, l) => s + l.correct, 0)}` },
                { icon: "🔄", label: "Mistakes turned into practice", value: `${practice.length} topics` },
                { icon: "⏱️", label: "Average response time", value: `${avgResponse(entries)}s` },
                { icon: "🎚️", label: "Current difficulty", value: Object.entries(state.adaptive.difficulty).map(([s, d]) => `${SUBJECTS[s as SubjectId].label}: ${d}`).join(" · ") },
                { icon: "🔥", label: "Day streak", value: `${state.streak} days` },
              ].map((row) => (
                <li key={row.label} className="flex items-start justify-between gap-4 rounded-2xl bg-canvas px-4 py-3">
                  <span className="font-semibold text-ink-soft">
                    {row.icon} {row.label}
                  </span>
                  <span className="shrink-0 text-right font-bold text-muted">{row.value}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="animate-rise p-6 [animation-delay:120ms] sm:p-7">
            <SectionHeading title="Strongest right now" />
            {strengths.length === 0 ? (
              <p className="text-sm text-muted">
                Keep practising — strengths appear once a few lessons are finished.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {strengths.slice(0, 4).map((s) => (
                  <Chip key={s.topic} tone="grass">
                    🟢 {s.topic} · {Math.round(s.accuracy * 100)}%
                  </Chip>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </ParentShell>
  );
}

function avgResponse(entries: { avgSeconds: number; attempts: number }[]) {
  const active = entries.filter((e) => e.attempts > 0);
  if (active.length === 0) return 6;
  return Math.round(active.reduce((sum, e) => sum + e.avgSeconds, 0) / active.length);
}

function buildRecommendation(
  name: string,
  strengths: { topic: string; accuracy: number }[],
  practice: { topic: string; accuracy: number }[],
) {
  if (practice.length === 0) {
    return `${name} has answered everything confidently so far. We'll introduce harder questions next session to keep things interesting.`;
  }

  const strong = strengths[0]?.topic ?? "addition";
  const weak = practice[0]?.topic ?? "subtraction";

  return `${name} is progressing well in ${strong.toLowerCase()}. We recommend practising ${weak.toLowerCase()} for another 10 minutes this week. MyLesson will lower the difficulty slightly for those questions and bring it back up as ${name} gets them right.`;
}
