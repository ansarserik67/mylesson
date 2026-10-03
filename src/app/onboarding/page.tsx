"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Milo, MiloCoach } from "@/components/Milo";
import { Button, Card, Chip, ProgressBar } from "@/components/ui";
import { useApp } from "@/lib/store";
import { SUBJECT_LIST, type SubjectId } from "@/lib/types";

const AGES = [5, 6, 7, 8, 9, 10];

export default function OnboardingPage() {
  const router = useRouter();
  const { actions } = useApp();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [age, setAge] = useState<number | null>(null);
  const [subjects, setSubjects] = useState<SubjectId[]>([]);

  const toggleSubject = (id: SubjectId) =>
    setSubjects((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );

  const finish = () => {
    actions.onboard(name.trim() || "Alex", age ?? 7, subjects.length ? subjects : ["reading", "math"]);
    router.push("/app");
  };

  return (
    <div className="min-h-dvh bg-canvas">
      <header className="mx-auto flex max-w-3xl items-center justify-between px-4 py-5 sm:px-6">
        <Link href="/" aria-label="Back to home">
          <Logo size={32} />
        </Link>
        <span className="text-sm font-bold text-muted">
          Step {step + 1} of 4
        </span>
      </header>

      <div className="mx-auto max-w-3xl px-4 pb-16 sm:px-6">
        <ProgressBar value={(step / 4) * 100} color="brand" className="mb-10 h-2" />

        <Card className="animate-rise p-6 sm:p-10">
          {step === 0 && (
            <div key="s0" className="animate-rise">
              <h1 className="font-rounded text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
                Hi! 👋
              </h1>
              <p className="mt-3 text-lg text-muted">What&apos;s your name?</p>

              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && name.trim()) setStep(1);
                }}
                placeholder="Alex"
                autoFocus
                className="mt-8 w-full rounded-3xl border-2 border-line bg-white px-5 py-4 font-rounded text-2xl font-extrabold text-ink outline-none transition-colors placeholder:text-[#c4c7d2] focus:border-brand"
              />

              <div className="mt-8 flex items-center justify-between gap-4">
                <div className="hidden items-center gap-3 sm:flex">
                  <Milo size={56} mood="happy" />
                  <p className="max-w-[220px] text-sm font-semibold text-muted">
                    I&apos;ll be your tutor. Nice to meet you!
                  </p>
                </div>
                <Button
                  size="lg"
                  disabled={!name.trim()}
                  onClick={() => setStep(1)}
                  className="w-full sm:w-auto"
                >
                  Continue →
                </Button>
              </div>
            </div>
          )}

          {step === 1 && (
            <div key="s1" className="animate-rise">
              <h1 className="font-rounded text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
                How old are you{name ? `, ${name.trim()}` : ""}?
              </h1>
              <p className="mt-3 text-lg text-muted">
                This helps Milo pick the right starting level.
              </p>

              <div className="mt-8 grid grid-cols-3 gap-3 sm:gap-4">
                {AGES.map((a) => {
                  const active = age === a;
                  return (
                    <button
                      key={a}
                      onClick={() => setAge(a)}
                      aria-pressed={active}
                      className={`press grid h-24 place-items-center rounded-3xl border-2 font-rounded text-3xl font-extrabold transition-all duration-200 sm:h-28 ${
                        active
                          ? "border-brand bg-brand-soft text-brand-600 shadow-soft"
                          : "border-line bg-white text-ink hover:border-brand/40 hover:-translate-y-1"
                      }`}
                    >
                      {a}
                    </button>
                  );
                })}
              </div>

              <div className="mt-8 flex items-center justify-between gap-3">
                <Button variant="ghost" onClick={() => setStep(0)}>
                  ← Back
                </Button>
                <Button size="lg" disabled={age === null} onClick={() => setStep(2)}>
                  Continue →
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div key="s2" className="animate-rise">
              <h1 className="font-rounded text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
                What would you like to learn?
              </h1>
              <p className="mt-3 text-lg text-muted">
                Pick as many as you like — you can change this later.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-3 sm:gap-4">
                {SUBJECT_LIST.map((s) => {
                  const active = subjects.includes(s.id);
                  return (
                    <button
                      key={s.id}
                      onClick={() => toggleSubject(s.id)}
                      aria-pressed={active}
                      className={`press relative flex items-center gap-4 rounded-3xl border-2 p-5 text-left transition-all duration-200 sm:flex-col sm:items-start sm:gap-3 sm:p-6 ${
                        active
                          ? "border-brand bg-brand-soft/60 shadow-soft"
                          : "border-line bg-white hover:border-brand/40 hover:-translate-y-1"
                      }`}
                    >
                      <span className="text-3xl" aria-hidden>
                        {s.emoji}
                      </span>
                      <span>
                        <span className="block font-rounded text-lg font-extrabold text-ink">
                          {s.label}
                        </span>
                        <span className="mt-0.5 block text-sm text-muted">{s.blurb}</span>
                      </span>
                      {active && (
                        <span className="absolute right-4 top-4 grid h-6 w-6 place-items-center rounded-full bg-brand text-xs font-bold text-white">
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mt-8 flex items-center justify-between gap-3">
                <Button variant="ghost" onClick={() => setStep(1)}>
                  ← Back
                </Button>
                <Button
                  size="lg"
                  disabled={subjects.length === 0}
                  onClick={() => setStep(3)}
                >
                  Continue →
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div key="s3" className="animate-rise text-center">
              <Milo size={128} mood="happy" className="mx-auto" />
              <h1 className="mt-6 font-rounded text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
                Let&apos;s find your level!
              </h1>
              <p className="mx-auto mt-4 max-w-lg text-lg leading-relaxed text-muted">
                We&apos;ll start with a few simple questions so MyLesson can create the
                perfect learning path for you.
              </p>

              <div className="mx-auto mt-8 flex max-w-md flex-wrap justify-center gap-2">
                <Chip tone="brand">👤 {name.trim() || "Alex"}</Chip>
                <Chip tone="sky">🎂 Age {age ?? 7}</Chip>
                {subjects.map((id) => {
                  const s = SUBJECT_LIST.find((x) => x.id === id)!;
                  return (
                    <Chip key={id} tone="sun">
                      {s.emoji} {s.label}
                    </Chip>
                  );
                })}
              </div>

              <div className="mt-9 flex flex-col-reverse items-center justify-center gap-3 sm:flex-row">
                <Button variant="ghost" onClick={() => setStep(2)}>
                  ← Back
                </Button>
                <Button size="xl" onClick={finish}>
                  Let&apos;s Go →
                </Button>
              </div>

              <div className="mx-auto mt-10 max-w-sm">
                <MiloCoach
                  message="I'll start easy and grow with you. Ready when you are!"
                  size={56}
                />
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
