import type { Difficulty, Question, SubjectId } from "./types";

/* ------------------------------------------------------------------ *
 * Question bank
 * Deterministic generators so a lesson can be rebuilt and reviewed.
 * ------------------------------------------------------------------ */

let seed = 7;
function rnd() {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
}
function pick<T>(items: T[]): T {
  return items[Math.floor(rnd() * items.length)];
}
function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function id(subject: SubjectId, topic: string) {
  return `${subject}-${topic}-${Math.floor(rnd() * 1e6).toString(36)}`;
}

/* ----------------------------- Reading ---------------------------- */

const SOUND_WORDS: [string, string][] = [
  ["Sun", "S"],
  ["Moon", "M"],
  ["Apple", "A"],
  ["Tiger", "T"],
  ["Ball", "B"],
  ["Rabbit", "R"],
  ["Dog", "D"],
  ["Fish", "F"],
];

const SIGHT_WORDS: [string, string][] = [
  ["the", "the"],
  ["and", "and"],
  ["said", "said"],
  ["you", "you"],
  ["was", "was"],
  ["they", "they"],
  ["have", "have"],
  ["come", "come"],
];

const STORIES: { text: string; question: string; answer: string; wrong: string[] }[] = [
  {
    text: "Lina has a small red ball. She plays with it in the garden.",
    question: "What colour is Lina's ball?",
    answer: "Red",
    wrong: ["Blue", "Green"],
  },
  {
    text: "Tom feeds his cat every morning. The cat is called Mimi.",
    question: "What is the cat's name?",
    answer: "Mimi",
    wrong: ["Tom", "Lina"],
  },
  {
    text: "It is raining today, so Sam takes his blue umbrella to school.",
    question: "Why does Sam take an umbrella?",
    answer: "It is raining",
    wrong: ["It is sunny", "He is cold"],
  },
];

function readingQuestion(topic: string, difficulty: Difficulty): Question {
  if (topic === "Letters & sounds") {
    const [word, sound] = pick(SOUND_WORDS);
    const wrong = SOUND_WORDS.filter(([, s]) => s !== sound)
      .map(([, s]) => s)
      .slice(0, 6);
    return {
      id: id("reading", topic),
      subject: "reading",
      topic,
      difficulty,
      prompt: `Which letter does “${word}” start with?`,
      hint: "Say the word slowly. What is the very first sound?",
      options: shuffle([sound, ...shuffle(wrong).slice(0, 2)]),
      answer: sound,
      steps: [
        `Say it slowly: “${word.toLowerCase()}”.`,
        `The first sound is “${sound.toLowerCase()}”.`,
        `So the first letter is ${sound}.`,
      ],
    };
  }

  if (topic === "Sight words") {
    const [word] = pick(SIGHT_WORDS);
    const wrong = SIGHT_WORDS.filter(([w]) => w !== word)
      .map(([w]) => w)
      .slice(0, 6);
    const sentence = pick([
      `I can read “${word}” in a book.`,
      `My teacher wrote “${word}” on the board.`,
      `Can you find “${word}” on this page?`,
    ]);
    return {
      id: id("reading", topic),
      subject: "reading",
      topic,
      difficulty,
      prompt: `Which word do you see?  →  ${sentence.replace(word, "____")}`,
      hint: "Look at the shape of the word. Which one matches?",
      options: shuffle([word, ...shuffle(wrong).slice(0, 2)]),
      answer: word,
      steps: [
        `The missing word is “${word}”.`,
        `Read it out loud: ${word}.`,
        `Now read the whole sentence again.`,
      ],
    };
  }

  const story = pick(STORIES);
  return {
    id: id("reading", topic),
    subject: "reading",
    topic,
    difficulty,
    prompt: `${story.text}\n\n${story.question}`,
    hint: "Read the story one more time and look for the answer.",
    options: shuffle([story.answer, ...story.wrong]),
    answer: story.answer,
    steps: [
      "Read the story again slowly.",
      `The story tells us: “${story.text}”`,
      `So the answer is: ${story.answer}.`,
    ],
  };
}

/* ----------------------------- Writing ---------------------------- */

const SPELLINGS: [string, string[]][] = [
  ["cat", ["kat", "catt", "caat"]],
  ["house", ["hous", "hause", "housе"]],
  ["friend", ["freind", "frend", "frien"]],
  ["school", ["skool", "shcool", "schol"]],
  ["happy", ["hapy", "happi", "hapyy"]],
  ["water", ["watter", "woter", "watr"]],
];

const SENTENCES: { words: string[]; answer: string; wrong: string[] }[] = [
  {
    words: ["The", "dog", "runs", "fast"],
    answer: "The dog runs fast.",
    wrong: ["Dog the runs fast.", "Runs the dog fast."],
  },
  {
    words: ["I", "like", "my", "school"],
    answer: "I like my school.",
    wrong: ["Like I my school.", "My school I like."],
  },
  {
    words: ["She", "reads", "a", "book"],
    answer: "She reads a book.",
    wrong: ["Reads she a book.", "A book she reads."],
  },
];

const FIRST_SOUNDS: [string, string][] = [
  ["b", "Ball"],
  ["c", "Cat"],
  ["d", "Dog"],
  ["f", "Fish"],
  ["m", "Moon"],
];

function writingQuestion(topic: string, difficulty: Difficulty): Question {
  if (topic === "Letter sounds") {
    const [letter, word] = pick(FIRST_SOUNDS);
    const wrong = FIRST_SOUNDS.filter(([l]) => l !== letter).map(([, w]) => w);
    return {
      id: id("writing", topic),
      subject: "writing",
      topic,
      difficulty,
      prompt: `Which word starts with the letter “${letter}”?`,
      hint: "Say each word out loud and listen to the first sound.",
      options: shuffle([word, ...shuffle(wrong).slice(0, 2)]),
      answer: word,
      steps: [
        `The letter “${letter}” makes the sound “${letter}”.`,
        `“${word}” begins with that sound.`,
        `Try writing “${word}” and say each letter as you write it.`,
      ],
    };
  }

  if (topic === "Spelling") {
    const [word, wrong] = pick(SPELLINGS);
    return {
      id: id("writing", topic),
      subject: "writing",
      topic,
      difficulty,
      prompt: `Which spelling is correct?`,
      hint: "Say the word slowly and count the sounds.",
      options: shuffle([word, ...shuffle(wrong).slice(0, 2)]),
      answer: word,
      steps: [
        `The correct spelling is “${word}”.`,
        `Write it once, then cover it and write it again from memory.`,
      ],
    };
  }

  const item = pick(SENTENCES);
  return {
    id: id("writing", topic),
    subject: "writing",
    topic,
    difficulty,
    prompt: `Put the words in order:\n${item.words.join("  ·  ")}`,
    hint: "A sentence starts with a capital letter and ends with a full stop.",
    options: shuffle([item.answer, ...item.wrong]),
    answer: item.answer,
    steps: [
      "Find the naming word that starts the sentence.",
      "Add the action word next.",
      `The correct sentence is: “${item.answer}”`,
    ],
  };
}

/* ------------------------------ Math ------------------------------ */

const rangeFor: Record<Difficulty, [number, number]> = {
  Beginner: [1, 5],
  Easy: [1, 10],
  Medium: [2, 20],
  Hard: [10, 60],
};

function distractors(answer: number, spread: number) {
  const set = new Set<number>([answer]);
  let guard = 0;
  while (set.size < 3 && guard < 40) {
    guard++;
    const delta = Math.ceil(rnd() * spread) * (rnd() > 0.5 ? 1 : -1);
    const candidate = answer + delta;
    if (candidate >= 0 && candidate !== answer) set.add(candidate);
  }
  while (set.size < 3) set.add(answer + set.size + 1);
  return Array.from(set);
}

function mathQuestion(topic: string, difficulty: Difficulty): Question {
  const [lo, hi] = rangeFor[difficulty];
  const span = hi - lo + 1;

  if (topic === "Addition") {
    const a = lo + Math.floor(rnd() * span);
    const b = lo + Math.floor(rnd() * span);
    const answer = a + b;
    const options = distractors(answer, Math.max(2, Math.round(span / 3)));
    return {
      id: id("math", topic),
      subject: "math",
      topic,
      difficulty,
      prompt: `${a} + ${b} = ?`,
      hint: `Start at ${a} and count up ${b} more.`,
      options: shuffle(options.map(String)),
      answer: String(answer),
      steps: [
        `Start at ${a} and count up ${b} steps.`,
        `${a} + ${b} = ${answer}`,
        `Check it backwards: ${answer} − ${b} = ${a}.`,
      ],
      visual: { kind: "blocks", parts: [a, b] },
    };
  }

  if (topic === "Subtraction") {
    const a = lo + Math.floor(rnd() * span);
    const b = 1 + Math.floor(rnd() * Math.max(1, Math.min(a, hi)));
    const answer = Math.max(0, a - b);
    const options = distractors(answer, Math.max(2, Math.round(span / 3)));
    return {
      id: id("math", topic),
      subject: "math",
      topic,
      difficulty,
      prompt: `${a} − ${b} = ?`,
      hint: `Start at ${a} and count back ${b} steps.`,
      options: shuffle(options.map(String)),
      answer: String(answer),
      steps: [
        `Start at ${a} and count back ${b} steps.`,
        `${a} − ${b} = ${answer}`,
        `Check it: ${answer} + ${b} = ${a}.`,
      ],
      visual: { kind: "blocks", parts: [a, b] },
    };
  }

  const a = lo + Math.floor(rnd() * span);
  const b = lo + Math.floor(rnd() * span);
  const askGreater = rnd() > 0.5;
  const answer = askGreater
    ? a === b
      ? "They are equal"
      : a > b
        ? `${Math.max(a, b)}`
        : `${Math.max(a, b)}`
    : `${Math.min(a, b)}`;
  const other = askGreater ? Math.min(a, b) : Math.max(a, b);

  if (a === b) {
    return {
      id: id("math", topic),
      subject: "math",
      topic,
      difficulty,
      prompt: `Which is greater: ${a} or ${b}?`,
      hint: "Line up the numbers and compare them.",
      options: shuffle([`${a}`, "They are equal", `${a + 1}`]),
      answer: "They are equal",
      steps: [`${a} and ${b} are the same number.`, "So they are equal!"],
      visual: { kind: "numberline", parts: [a, b] },
    };
  }

  return {
    id: id("math", topic),
    subject: "math",
    topic,
    difficulty,
    prompt: askGreater
      ? `Which number is greater?`
      : `Which number is smaller?`,
    hint: "Picture both numbers on a number line.",
    options: shuffle([`${other}`, `${answer}`, `${answer + (askGreater ? 1 : -1)}`]),
    answer: `${answer}`,
    steps: [
      `Put both numbers on a number line: ${Math.min(a, b)} … ${Math.max(a, b)}.`,
      `${askGreater ? "The greater" : "The smaller"} number is ${answer}.`,
    ],
    visual: { kind: "numberline", parts: [a, b] },
  };
}

/* --------------------------- Entry point -------------------------- */

const TOPIC_BUILDERS: Record<string, (d: Difficulty) => Question> = {
  "Letters & sounds": (d) => readingQuestion("Letters & sounds", d),
  "Sight words": (d) => readingQuestion("Sight words", d),
  Comprehension: (d) => readingQuestion("Comprehension", d),
  "Letter sounds": (d) => writingQuestion("Letter sounds", d),
  Spelling: (d) => writingQuestion("Spelling", d),
  Sentences: (d) => writingQuestion("Sentences", d),
  Addition: (d) => mathQuestion("Addition", d),
  Subtraction: (d) => mathQuestion("Subtraction", d),
  "Number comparison": (d) => mathQuestion("Number comparison", d),
};

/** A lesson always starts on an easy win so the child feels capable. */
const WARMUP: Difficulty = "Beginner";

export function buildLesson(
  subject: SubjectId,
  topic: string,
  difficulty: Difficulty,
  length = 10,
): Question[] {
  const questions: Question[] = [];
  const seen = new Set<string>();

  for (let i = 0; i < length; i++) {
    let level: Difficulty = i === 0 ? WARMUP : difficulty;
    if (i > 0 && i % 3 === 2 && difficulty === "Beginner") level = "Easy";

    let question = TOPIC_BUILDERS[topic](level);
    let guard = 0;
    while (seen.has(question.prompt) && guard < 12) {
      question = TOPIC_BUILDERS[topic](level);
      guard++;
    }
    seen.add(question.prompt);
    questions.push(question);
  }

  return questions;
}

export function optionLabel(question: Question, value: string) {
  return question.prompt.includes("\n") ? value : value;
}
