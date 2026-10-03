"use client";

import Link from "next/link";
import { useState } from "react";
import { ParentShell } from "@/components/Shells";
import { Button, Card, Chip, SectionHeading } from "@/components/ui";
import { useApp } from "@/lib/store";
import { SUBJECTS, SUBJECT_LIST, type SubjectId } from "@/lib/types";

export default function ParentSettings() {
  const { state, actions } = useApp();
  const [name, setName] = useState(state.child?.name ?? "Alex");
  const [age, setAge] = useState(state.child?.age ?? 7);
  const [subjects, setSubjects] = useState<SubjectId[]>(
    state.child?.subjects?.length ? state.child.subjects : ["reading", "writing", "math"],
  );
  const [saved, setSaved] = useState(false);

  const toggle = (id: SubjectId) =>
    setSubjects((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));

  const save = () => {
    actions.onboard(name.trim() || "Alex", age, subjects.length ? subjects : ["math"]);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  };

  return (
    <ParentShell>
      <header className="animate-rise mb-7">
        <p className="text-[11px] font-bold uppercase tracking-widest text-muted">
          Settings
        </p>
        <h1 className="mt-1 font-rounded text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          Manage {name}&apos;s profile
        </h1>
        <p className="mt-2 text-muted">
          Adjust the details MyLesson uses to build lessons.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <Card className="animate-rise p-6 sm:p-7">
          <SectionHeading title="Child profile" />

          <label className="block">
            <span className="text-sm font-bold text-ink">Name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full rounded-2xl border-2 border-line bg-white px-4 py-3 font-semibold text-ink outline-none transition-colors focus:border-brand"
            />
          </label>

          <div className="mt-5">
            <span className="text-sm font-bold text-ink">Age</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {[5, 6, 7, 8, 9, 10].map((a) => (
                <button
                  key={a}
                  onClick={() => setAge(a)}
                  aria-pressed={age === a}
                  className={`press h-11 w-11 rounded-2xl border-2 font-rounded text-base font-extrabold transition-all ${
                    age === a
                      ? "border-brand bg-brand-soft text-brand-600"
                      : "border-line bg-white text-ink hover:border-brand/40"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <span className="text-sm font-bold text-ink">Subjects</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {SUBJECT_LIST.map((s) => (
                <button
                  key={s.id}
                  onClick={() => toggle(s.id)}
                  aria-pressed={subjects.includes(s.id)}
                  className={`press flex items-center gap-2 rounded-2xl border-2 px-4 py-2.5 text-sm font-bold transition-all ${
                    subjects.includes(s.id)
                      ? "border-brand bg-brand-soft text-brand-600"
                      : "border-line bg-white text-muted hover:border-brand/40"
                  }`}
                >
                  <span aria-hidden>{s.emoji}</span>
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Button onClick={save}>Save changes</Button>
            {saved && <Chip tone="grass">✓ Saved</Chip>}
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="animate-rise p-6 [animation-delay:60ms] sm:p-7">
            <SectionHeading title="Learning plan" />
            <ul className="space-y-3 text-sm">
              <li className="flex items-center justify-between rounded-2xl bg-canvas px-4 py-3">
                <span className="font-semibold text-ink-soft">Daily goal</span>
                <span className="font-bold text-muted">{state.minutesGoal} minutes</span>
              </li>
              <li className="flex items-center justify-between rounded-2xl bg-canvas px-4 py-3">
                <span className="font-semibold text-ink-soft">Lessons per session</span>
                <span className="font-bold text-muted">10 questions</span>
              </li>
              <li className="flex items-center justify-between rounded-2xl bg-canvas px-4 py-3">
                <span className="font-semibold text-ink-soft">Adaptive difficulty</span>
                <Chip tone="grass">Always on</Chip>
              </li>
              <li className="flex items-start justify-between gap-4 rounded-2xl bg-canvas px-4 py-3">
                <span className="font-semibold text-ink-soft">Current levels</span>
                <span className="text-right font-bold text-muted">
                  {Object.entries(state.adaptive.difficulty)
                    .map(([s, d]) => `${SUBJECTS[s as SubjectId].label}: ${d}`)
                    .join(" · ")}
                </span>
              </li>
            </ul>
          </Card>

          <Card className="animate-rise p-6 [animation-delay:120ms] sm:p-7">
            <SectionHeading title="Data & privacy" />
            <p className="text-sm leading-relaxed text-muted">
              This MVP stores progress locally in this browser only — no account, no
              tracking, no data leaves the device. Milo&apos;s coaching is generated by
              MyLesson&apos;s own adaptive engine rather than an external AI service.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link href="/app">
                <Button variant="secondary" size="sm">
                  Open child view
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
                Clear local data
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </ParentShell>
  );
}
