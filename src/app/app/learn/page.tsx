"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChildShell } from "@/components/Shells";
import { MiloCoach } from "@/components/Milo";
import { Button, Card, Chip, ProgressBar, SectionHeading } from "@/components/ui";
import { difficultyOf, topicStatus, accuracyOf } from "@/lib/adaptive";
import { subjectProgress, useApp } from "@/lib/store";
import { SUBJECTS, SUBJECT_LIST, type SubjectId } from "@/lib/types";

const STATUS_LABEL = {
  strong: "Strong",
  practicing: "Practicing",
  learning: "Learning",
} as const;

const STATUS_DOT = {
  strong: "🟢",
  practicing: "🟡",
  learning: "🔵",
} as const;

export default function LearnPage() {
  const { state, actions } = useApp();
  const router = useRouter();
  const [open, setOpen] = useState<SubjectId | null>(null);

  const go = (subject: SubjectId, topic: string) => {
    actions.startLesson(subject, topic);
    router.push("/app/lesson");
  };

  return (
    <ChildShell>
      <div className="animate-rise mb-7">
        <h1 className="font-rounded text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          What shall we learn today?
        </h1>
        <p className="mt-2 text-lg text-muted">
          Pick a subject. Milo will choose the right level for you.
        </p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SUBJECT_LIST.map((s, i) => {
          const p = subjectProgress(state, s.id);
          const level = difficultyOf(state.adaptive, s.id);
          const tone = s.id === "reading" ? "brand" : s.id === "writing" ? "sky" : "sun";
          const expanded = open === s.id;
          return (
            <Card
              key={s.id}
              className="animate-rise flex flex-col p-6"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <div className="flex items-start justify-between">
                <span className="text-3xl" aria-hidden>
                  {s.emoji}
                </span>
                <Chip tone={tone}>{level}</Chip>
              </div>
              <h2 className="mt-4 font-rounded text-xl font-extrabold text-ink">{s.label}</h2>
              <p className="mt-1 flex-1 text-[15px] leading-relaxed text-muted">{s.blurb}</p>

              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between text-xs font-bold text-muted">
                  <span>Course progress</span>
                  <span className="tnum">{p.percent}%</span>
                </div>
                <ProgressBar value={p.percent} color={tone} />
              </div>

              <div className="mt-5 flex gap-2">
                <Button size="sm" onClick={() => setOpen(expanded ? null : s.id)} variant="secondary">
                  {expanded ? "Hide topics" : "Choose topic"}
                </Button>
                <Button size="sm" onClick={() => go(s.id, s.topics[0])}>
                  Start
                </Button>
              </div>

              {expanded && (
                <ul className="animate-rise mt-4 space-y-2 border-t border-line pt-4">
                  {s.topics.map((topic) => {
                    const stats = state.adaptive.topics[topic];
                    const status = topicStatus(accuracyOf(stats), stats ? stats.correct + stats.incorrect : 0);
                    return (
                      <li key={topic}>
                        <button
                          onClick={() => go(s.id, topic)}
                          className="press flex w-full items-center justify-between gap-3 rounded-2xl px-3 py-2.5 text-left transition hover:bg-canvas"
                        >
                          <span className="text-sm font-bold text-ink">
                            {STATUS_DOT[status]} {topic}
                          </span>
                          <span className="text-xs font-semibold text-muted">
                            {STATUS_LABEL[status]} →
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </Card>
          );
        })}
      </div>

      <section>
        <SectionHeading title="Your learning path" />
        <Card className="animate-rise p-6 sm:p-7">
          <MiloCoach
            size={72}
            mood="happy"
            message={recommendation(state, SUBJECT_LIST.map((s) => s.id))}
          />
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {SUBJECT_LIST.map((s) => {
              const stats = state.adaptive.topics[s.topics[1]];
              const status = topicStatus(
                accuracyOf(stats),
                stats ? stats.correct + stats.incorrect : 0,
              );
              return (
                <div key={s.id} className="rounded-3xl border border-line p-4">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-muted">
                    Focus topic
                  </p>
                  <p className="mt-1 font-rounded text-base font-extrabold text-ink">
                    {s.topics[1]}
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    {STATUS_DOT[status]} {STATUS_LABEL[status]}
                  </p>
                </div>
              );
            })}
          </div>
        </Card>
      </section>
    </ChildShell>
  );
}

function recommendation(
  state: ReturnType<typeof useApp>["state"],
  subjects: SubjectId[],
) {
  const weakest = subjects
    .map((id) => {
      const stats = state.adaptive.topics[SUBJECTS[id].topics[1]];
      return { id, accuracy: accuracyOf(stats) };
    })
    .sort((a, b) => a.accuracy - b.accuracy)[0];

  if (!weakest || weakest.accuracy === 0) {
    return "Let's start with something easy today — I'll find your level as we go.";
  }
  return `${SUBJECTS[weakest.id].topics[1]} is a great next step. Let's practise for ten minutes!`;
}
