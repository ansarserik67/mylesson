"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Celebration } from "@/components/Celebration";
import { Milo, MiloCoach, MiloSays, type MiloMood } from "@/components/Milo";
import { Button, Card, Chip } from "@/components/ui";
import { difficultyOf, miloLine, type AdaptiveUpdate } from "@/lib/adaptive";
import { buildLesson } from "@/lib/questions";
import { useApp, type LessonResult } from "@/lib/store";
import { SUBJECTS, type Question, type SubjectId } from "@/lib/types";

const LESSON_LENGTH = 10;

export default function LessonPage() {
  const { state, actions } = useApp();
  const router = useRouter();

  const subject: SubjectId = state.lesson?.subject ?? "math";
  const meta = SUBJECTS[subject];

  const topic = useMemo(() => {
    const chosen = state.lesson?.topic;
    if (chosen) return chosen;
    return state.adaptive.focusTopic && meta.topics.includes(state.adaptive.focusTopic)
      ? state.adaptive.focusTopic
      : meta.topics[0];
    // The lesson topic is fixed when the lesson starts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startDifficulty = difficultyOf(state.adaptive, subject);

  // The plan is rebuilt as the child's level moves during the lesson.
  const [questions, setQuestions] = useState<Question[]>(() =>
    buildLesson(subject, topic, startDifficulty, LESSON_LENGTH),
  );
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");
  const [mood, setMood] = useState<MiloMood>("idle");
  const [message, setMessage] = useState(
    `Let's warm up with one easy one, then we'll go step by step.`,
  );
  const [miloTone, setMiloTone] = useState<"neutral" | "correct" | "hint">("neutral");
  const [attempt, setAttempt] = useState(0);
  const [hintOpen, setHintOpen] = useState(false);
  const [result, setResult] = useState<LessonResult | null>(null);

  const lessonStart = useRef(Date.now());
  const startedAt = useRef(Date.now());
  const answeredCorrect = useRef(0);
  const answeredTotal = useRef(0);
  const lessonXp = useRef(0);
  const rebuiltFor = useRef(startDifficulty);

  const question = questions[index];
  const isLast = index >= questions.length - 1;

  const rebuildIfNeeded = () => {
    const now = difficultyOf(state.adaptive, subject);
    if (now === rebuiltFor.current) return;
    rebuiltFor.current = now;
    const upcoming = buildLesson(subject, topic, now, LESSON_LENGTH).slice(index + 1);
    setQuestions((prev) => [...prev.slice(0, index + 1), ...upcoming]);
  };

  const choose = (value: string) => {
    if (status !== "idle" || !question) return;
    const ms = Date.now() - startedAt.current;
    const correct = value === question.answer;

    setPicked(value);
    // Accuracy is measured on the first try — retries earn XP, not marks.
    if (attempt === 0) answeredTotal.current += 1;
    if (correct) {
      if (attempt === 0) answeredCorrect.current += 1;
      lessonXp.current += attempt === 0 ? 10 : 5;
    }

    actions.answer({
      subject,
      topic,
      difficulty: question.difficulty,
      correct,
      ms,
    });

    if (correct) {
      setStatus("correct");
      setMood("cheer");
      setMiloTone("correct");
      const update: AdaptiveUpdate = {
        state: state.adaptive,
        difficultyChange: null,
        needsPractice: false,
      };
      setMessage(miloLine(update, true, questions[index + 1] ?? question));
    } else {
      setStatus("wrong");
      setMood("thinking");
      setMiloTone("hint");
      setMessage("Let's solve this one together.");
      setHintOpen(true);
    }
  };

  const next = () => {
    setPicked(null);
    setStatus("idle");
    setMood("idle");
    setMiloTone("neutral");
    setHintOpen(false);
    startedAt.current = Date.now();
    rebuildIfNeeded();

    if (isLast) {
      const total = Math.max(1, answeredTotal.current || questions.length);
      const elapsed = (Date.now() - lessonStart.current) / 60_000;
      const minutes = Math.min(12, Math.max(3, Math.round(elapsed) || 4));
      const payload = {
        subject,
        topic,
        correct: answeredCorrect.current,
        total,
        xp: lessonXp.current + 20,
        minutes,
        ms: Date.now(),
        difficulty: rebuiltFor.current,
      };
      actions.finishLesson(payload);
      setResult({ ...payload, at: Date.now() });
      setMood("cheer");
      setMessage("Amazing work today! I'm proud of you.");
      return;
    }

    setIndex((i) => i + 1);
    setMessage(
      subject === "math"
        ? "You're doing great. Let's keep going."
        : "Nice! Here comes the next one.",
    );
  };

  const tryAgain = () => {
    setPicked(null);
    setStatus("idle");
    setMood("idle");
    setMessage("Take your time. You can do this one.");
    setMiloTone("neutral");
    setAttempt((a) => a + 1);
    startedAt.current = Date.now();
  };

  // Keep the tutor line in sync when difficulty shifts mid-lesson.
  useEffect(() => {
    if (state.difficultyToast === "up") {
      setMiloTone("correct");
      setMessage("Great job! Let's try something a little harder.");
      setMood("cheer");
    } else if (state.difficultyToast === "down") {
      setMiloTone("hint");
      setMessage("Let's slow down and take it step by step.");
      setMood("thinking");
    }
  }, [state.difficultyToast]);

  useEffect(() => {
    if (state.difficultyToast) actions.clearToast();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.difficultyToast]);

  if (!question) {
    return (
      <div className="grid min-h-dvh place-items-center px-6 text-center">
        <div>
          <p className="text-lg font-bold text-muted">No lesson in progress.</p>
          <Link href="/app" className="mt-4 inline-block font-bold text-brand">
            Back to dashboard →
          </Link>
        </div>
      </div>
    );
  }

  const progressPct = (index / questions.length) * 100;

  return (
    <div className="min-h-dvh bg-canvas">
      {/* ---------------------------- Top bar ---------------------------- */}
      <header className="sticky top-0 z-30 border-b border-line bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl items-center gap-4 px-4 py-3 sm:px-6">
          <Link
            href="/app"
            className="flex items-center gap-1.5 rounded-2xl px-2.5 py-2 text-sm font-bold text-muted transition hover:bg-canvas hover:text-ink"
          >
            ← Back
          </Link>

          <div className="min-w-0 flex-1 text-center">
            <p className="font-rounded text-sm font-extrabold text-ink">
              {meta.emoji} {meta.label}
            </p>
            <p className="truncate text-[11px] font-semibold text-muted">{topic}</p>
          </div>

          <span className="tnum shrink-0 rounded-full bg-brand-soft px-3 py-1.5 text-xs font-bold text-brand-600">
            Question {index + 1} / {questions.length}
          </span>
        </div>
        <div className="mx-auto max-w-3xl px-4 pb-3 sm:px-6">
          <div className="track h-2">
            <div
              className="fill bg-gradient-to-r from-brand to-sky"
              style={{ width: `${Math.max(4, progressPct)}%` }}
            />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 pb-16 pt-7 sm:px-6">
        <div className="animate-rise">
          <MiloCoach message={message} mood={mood} tone={miloTone} size={78} />
        </div>

        {/* -------------------------- Question --------------------------- */}
        <Card className="animate-rise mt-6 p-6 sm:p-8 [animation-delay:80ms]">
          <p className="text-center font-rounded text-xl font-extrabold text-ink sm:text-2xl">
            Let&apos;s solve this together!
          </p>

          <p className="mt-4 whitespace-pre-line text-center font-rounded text-3xl font-extrabold leading-snug tracking-tight text-ink sm:text-4xl">
            {question.prompt}
          </p>

          {question.visual && status !== "correct" && (
            <VisualHint question={question} />
          )}

          <div
            className={`mt-8 grid gap-3 sm:gap-4 ${
              question.options.length === 3 ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-2"
            }`}
          >
            {question.options.map((option) => {
              const isPicked = picked === option;
              const isAnswer = option === question.answer;
              const revealCorrect = status === "correct" && isAnswer;
              const revealWrong = status === "wrong" && isPicked;

              return (
                <button
                  key={option}
                  onClick={() => choose(option)}
                  disabled={status !== "idle"}
                  className={`press grid h-20 place-items-center rounded-3xl border-2 px-4 font-rounded text-2xl font-extrabold transition-all duration-200 sm:h-24 sm:text-3xl ${
                    revealCorrect
                      ? "animate-pop border-grass bg-grass text-white shadow-[0_18px_36px_-18px_rgba(69,196,134,0.9)]"
                      : revealWrong
                        ? "border-[#f0b4a8] bg-[#fdeceA] text-[#B4442F]"
                        : status !== "idle"
                          ? "border-line bg-white text-muted opacity-60"
                          : "border-line bg-white text-ink hover:-translate-y-1 hover:border-brand/50 hover:shadow-soft"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>

          {status === "idle" && (
            <div className="mt-6 text-center">
              {hintOpen ? (
                <MiloSays tone="hint" className="mx-auto inline-block text-left">
                  💡 {question.hint}
                </MiloSays>
              ) : (
                <button
                  onClick={() => setHintOpen(true)}
                  className="text-sm font-bold text-muted transition hover:text-brand"
                >
                  Need a hint? Ask Milo 💡
                </button>
              )}
            </div>
          )}
        </Card>

        {/* --------------------------- Feedback -------------------------- */}
        {status === "correct" && (
          <Card className="animate-pop mt-5 border-[#c9f0dc] bg-grass-soft p-6 text-center">
            <div className="flex justify-center gap-2 text-3xl" aria-hidden>
              <span className="animate-pop">🎉</span>
            </div>
            <h2 className="mt-3 font-rounded text-2xl font-extrabold text-[#1F8A5A]">
              Amazing!
            </h2>
            <p className="tnum mt-1 font-rounded text-lg font-extrabold text-ink">
              {question.prompt.includes("?")
                ? question.prompt.replace("?", `= ${question.answer}`)
                : question.answer}
            </p>
            <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-sm font-extrabold text-grass">
              +10 XP
            </p>
            <div className="mt-5">
              <Button size="lg" onClick={next} className="w-full sm:w-auto">
                {isLast ? "Finish lesson →" : "Next →"}
              </Button>
            </div>
          </Card>
        )}

        {status === "wrong" && (
          <Card className="animate-pop mt-5 border-[#ffe2b8] bg-sun-soft p-6">
            <div className="text-center">
              <h2 className="font-rounded text-2xl font-extrabold text-[#8A5A12]">
                Almost!
              </h2>
              <p className="mt-1 text-[15px] font-semibold text-[#8A5A12]/85">
                Let&apos;s think about it together.
              </p>
            </div>

            <ol className="mt-5 space-y-3">
              {question.steps.map((step, i) => (
                <li
                  key={step}
                  className="animate-rise flex gap-3 rounded-2xl bg-white/80 p-3.5"
                  style={{ animationDelay: `${i * 90}ms` }}
                >
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-sun text-xs font-extrabold text-[#5a3a05]">
                    {i + 1}
                  </span>
                  <span className="text-[15px] font-semibold text-ink-soft">{step}</span>
                </li>
              ))}
            </ol>

            {question.visual && <VisualHint question={question} big />}

            <div className="mt-5 flex justify-center">
              <Button
                size="lg"
                variant="accent"
                onClick={tryAgain}
                key={attempt}
                className="w-full sm:w-auto"
              >
                Try Again
              </Button>
            </div>
          </Card>
        )}

        {/* --------------------------- Footer ---------------------------- */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          <Chip tone="muted">Level {rebuiltFor.current}</Chip>
          <Chip tone="brand">⭐ {lessonXp.current} XP this lesson</Chip>
          {attempt > 0 && <Chip tone="sun">🔁 {attempt} retry</Chip>}
        </div>
      </main>

      {result && (
        <Celebration
          result={result}
          onContinue={() => router.push("/app")}
          onAgain={() => {
            setResult(null);
            answeredCorrect.current = 0;
            answeredTotal.current = 0;
            lessonXp.current = 0;
            rebuiltFor.current = difficultyOf(state.adaptive, subject);
            setQuestions(buildLesson(subject, topic, rebuiltFor.current, LESSON_LENGTH));
            setIndex(0);
            setPicked(null);
            setStatus("idle");
            setMessage("Fresh round! Let's go.");
            startedAt.current = Date.now();
            lessonStart.current = Date.now();
          }}
        />
      )}
    </div>
  );
}

/* --------------------------- Visual helpers --------------------------- */

function VisualHint({ question, big = false }: { question: Question; big?: boolean }) {
  const visual = question.visual;
  if (!visual) return null;

  if (visual.kind === "blocks") {
    const [a, b] = visual.parts;
    const removing = question.topic === "Subtraction";
    return (
      <div className={`mt-6 flex flex-wrap justify-center gap-1.5 ${big ? "" : "opacity-90"}`}>
        {Array.from({ length: a }).map((_, i) => (
          <span
            key={i}
            className="animate-sparkle grid h-6 w-6 place-items-center rounded-lg text-[10px] font-bold"
            style={{
              animationDelay: `${i * 22}ms`,
              background: i < a - (removing ? b : 0) ? "#EEECFF" : "#FFE3E0",
              color: i < a - (removing ? b : 0) ? "#5A50F0" : "#B4442F",
            }}
          >
            {i < a - (removing ? b : 0) ? "" : "×"}
          </span>
        ))}
        {!removing && (
          <>
            <span className="mx-1 self-center font-rounded text-lg font-extrabold text-muted">
              +
            </span>
            {Array.from({ length: b }).map((_, i) => (
              <span
                key={`b${i}`}
                className="animate-sparkle h-6 w-6 rounded-lg bg-sky-soft"
                style={{ animationDelay: `${(a + i) * 22}ms` }}
              />
            ))}
          </>
        )}
      </div>
    );
  }

  const [a, b] = visual.parts;
  const lo = Math.min(a, b);
  const hi = Math.max(a, b);
  return (
    <div className="mt-6">
      <div className="relative mx-auto flex max-w-md items-center justify-between rounded-2xl bg-canvas px-4 py-3">
        <span className="tnum font-rounded text-lg font-extrabold text-ink">{lo}</span>
        <span className="mx-3 h-1 flex-1 rounded-full bg-gradient-to-r from-brand to-sky" />
        <span className="tnum font-rounded text-lg font-extrabold text-ink">{hi}</span>
      </div>
      <p className="mt-2 text-center text-xs font-semibold text-muted">
        Numbers grow to the right
      </p>
    </div>
  );
}
