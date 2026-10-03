export type SubjectId = "reading" | "writing" | "math";

export type Difficulty = "Beginner" | "Easy" | "Medium" | "Hard";

export type TopicStatus = "strong" | "practicing" | "learning";

export type TopicStat = {
  name: string;
  status: TopicStatus;
  accuracy: number;
  attempts: number;
};

export type SubjectProgress = {
  accuracy: number;
  topics: TopicStat[];
};

export type Question = {
  id: string;
  subject: SubjectId;
  topic: string;
  difficulty: Difficulty;
  prompt: string;
  /** Short hint Milo can offer while the child is thinking. */
  hint: string;
  options: string[];
  answer: string;
  /** Step-by-step explanation shown after a wrong answer. */
  steps: string[];
  visual?: { kind: "blocks" | "numberline" | "groups"; parts: number[] };
};

export type SubjectMeta = {
  id: SubjectId;
  label: string;
  emoji: string;
  blurb: string;
  topics: string[];
  color: "brand" | "sky" | "sun";
};

export const DIFFICULTIES: Difficulty[] = [
  "Beginner",
  "Easy",
  "Medium",
  "Hard",
];

export const SUBJECTS: Record<SubjectId, SubjectMeta> = {
  reading: {
    id: "reading",
    label: "Reading",
    emoji: "📖",
    blurb: "Learn letters, words and comprehension.",
    topics: ["Letters & sounds", "Sight words", "Comprehension"],
    color: "brand",
  },
  writing: {
    id: "writing",
    label: "Writing",
    emoji: "✏️",
    blurb: "Practice letters, words and sentences.",
    topics: ["Letter sounds", "Spelling", "Sentences"],
    color: "sky",
  },
  math: {
    id: "math",
    label: "Math",
    emoji: "🔢",
    blurb: "Practice numbers and problem solving.",
    topics: ["Addition", "Subtraction", "Number comparison"],
    color: "sun",
  },
};

export const SUBJECT_LIST: SubjectMeta[] = [
  SUBJECTS.reading,
  SUBJECTS.writing,
  SUBJECTS.math,
];

export const BADGES = [
  {
    id: "first-lesson",
    emoji: "🏆",
    label: "First Lesson",
    detail: "Finished your very first lesson",
  },
  {
    id: "streak-7",
    emoji: "🔥",
    label: "7 Day Learner",
    detail: "Learned 7 days in a row",
  },
  {
    id: "math-explorer",
    emoji: "⭐",
    label: "Math Explorer",
    detail: "Completed 5 math lessons",
  },
  {
    id: "reading-star",
    emoji: "📖",
    label: "Reading Star",
    detail: "Completed 5 reading lessons",
  },
  {
    id: "writer",
    emoji: "✏️",
    label: "Word Builder",
    detail: "Completed 5 writing lessons",
  },
  {
    id: "perfect",
    emoji: "🎯",
    label: "Perfect Round",
    detail: "Answered every question correctly",
  },
  {
    id: "century",
    emoji: "💯",
    label: "100 XP Club",
    detail: "Earned 100 XP in total",
  },
] as const;

export type BadgeId = (typeof BADGES)[number]["id"];

export const ALL_BADGES = BADGES;
