import { applyAnswer, createAdaptive } from "../src/lib/adaptive";
import { answerLine, buildLesson } from "../src/lib/questions";
import { SUBJECTS, type Question } from "../src/lib/types";

let fail = 0;
const check = (label: string, got: unknown, want: unknown) => {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (!ok) fail++;
  console.log(`${ok ? "ok  " : "FAIL"} ${label} -> ${JSON.stringify(got)}`);
};

const answer = (
  s: ReturnType<typeof createAdaptive>,
  correct: boolean,
  ms: number,
  difficulty: string,
  topic = "Addition",
) =>
  applyAnswer(s, {
    subject: "math",
    topic,
    difficulty: difficulty as never,
    correct,
    ms,
  });

// 3 correct in a row raises difficulty
let s = createAdaptive("math");
for (let i = 0; i < 3; i++) s = answer(s, true, 4000, "Easy").state;
check("3 correct: Easy -> Medium", s.difficulty.math, "Medium");

// 2 slow correct stays put
let slow = createAdaptive("math");
for (let i = 0; i < 2; i++) slow = answer(slow, true, 20000, "Easy").state;
check("2 slow correct stays Easy", slow.difficulty.math, "Easy");

// 2 fast correct accelerates
let fast = createAdaptive("math");
for (let i = 0; i < 2; i++) fast = answer(fast, true, 3000, "Easy").state;
check("2 fast correct: Easy -> Medium", fast.difficulty.math, "Medium");

// 2 wrong lowers + flags practice
let d = createAdaptive("math");
d = answer(d, false, 9000, "Medium").state;
const upd = answer(d, false, 9000, "Medium", "Subtraction");
d = upd.state;
check("2 wrong: Medium -> Easy", d.difficulty.math, "Easy");
check("2 wrong flags practice", upd.needsPractice, true);
check("focus topic set", d.focusTopic, "Subtraction");

// never exceeds bounds
let h = createAdaptive("math");
for (let i = 0; i < 8; i++) h = answer(h, true, 2000, h.difficulty.math).state;
check("caps at Hard", h.difficulty.math, "Hard");
let l = createAdaptive("math");
for (let i = 0; i < 8; i++) l = answer(l, false, 9000, l.difficulty.math).state;
check("floors at Beginner", l.difficulty.math, "Beginner");

// one wrong answer must NOT drop the level (avoids punishment feel)
let one = createAdaptive("math");
one = answer(one, false, 9000, "Medium").state;
check("single mistake keeps Medium", one.difficulty.math, "Medium");

// question bank integrity for every subject/topic/level
let bad = 0;
let total = 0;
for (const subject of Object.keys(SUBJECTS) as (keyof typeof SUBJECTS)[]) {
  for (const topic of SUBJECTS[subject].topics) {
    for (const level of ["Beginner", "Easy", "Medium", "Hard"] as const) {
      for (const q of buildLesson(subject, topic, level, 10)) {
        total++;
        const uniq = new Set(q.options).size === q.options.length;
        if (!uniq || !q.options.includes(q.answer) || q.options.length < 3) {
          bad++;
          console.log("BAD", subject, topic, level, q.prompt, q.options, q.answer);
        }
      }
    }
  }
}
check("every generated question is answerable", bad, 0);
console.log(`checked ${total} generated questions`);

// The correct-answer line must never render a doubled "= =".
const mk = (prompt: string, answer: string): Question => ({
  id: "x",
  subject: "math",
  topic: "Addition",
  difficulty: "Easy",
  prompt,
  hint: "",
  options: [answer],
  answer,
  steps: [],
});
check(
  "equation line",
  answerLine(mk("2 + 5 = ?", "7")),
  "2 + 5 = 7",
);
check(
  "subtraction line",
  answerLine(mk("9 - 3 = ?", "6")),
  "9 - 3 = 6",
);
check(
  "prose line shows answer only",
  answerLine(mk("Which letter does “Sun” start with?", "S")),
  "S",
);

let badLine = 0;
for (const subject of Object.keys(SUBJECTS) as (keyof typeof SUBJECTS)[]) {
  for (const topic of SUBJECTS[subject].topics) {
    for (const level of ["Beginner", "Easy", "Medium", "Hard"] as const) {
      for (const q of buildLesson(subject, topic, level, 10)) {
        const line = answerLine(q);
        const isEq = q.prompt.includes("=") && q.prompt.trim().endsWith("?");
        if (line.includes("= =") || (isEq && !line.endsWith(`= ${q.answer}`))) {
          badLine++;
          console.log("BAD LINE", q.prompt, "->", line);
        }
      }
    }
  }
}
check("no doubled equals in any answer line", badLine, 0);

console.log(fail === 0 ? "ALL CHECKS PASSED" : `${fail} CHECK(S) FAILED`);
process.exit(fail === 0 ? 0 : 1);