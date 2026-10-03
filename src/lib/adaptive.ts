import type { AdaptiveState } from "./store";
import type { Difficulty, Question, SubjectId, TopicStatus } from "./types";
import { DIFFICULTIES } from "./types";

export type AnswerInput = {
  subject: SubjectId;
  topic: string;
  difficulty: Difficulty;
  correct: boolean;
  ms: number;
};

export type AdaptiveUpdate = {
  state: AdaptiveState;
  /** Set when Milo should mention that the level just changed. */
  difficultyChange: "up" | "down" | null;
  /** Set when a topic needs a bit more practice. */
  needsPractice: boolean;
};

const FAST_MS = 7000;

export function createAdaptive(subject: SubjectId = "math"): AdaptiveState {
  return {
    difficulty: { reading: "Easy", writing: "Easy", math: "Easy" },
    current: { reading: "Easy", writing: "Easy", math: "Easy" },
    history: [],
    topics: {},
    correctStreak: 0,
    incorrectStreak: 0,
    currentSubject: subject,
    focusTopic: null,
  };
}

/**
 * The heart of MyLesson: every answer nudges the child's level.
 * Two right answers in a row -> a little harder. Two wrong in a row -> step
 * back down and re-teach the topic instead of pushing forward.
 */
export function applyAnswer(
  prev: AdaptiveState,
  input: AnswerInput,
): AdaptiveUpdate {
  const { subject, topic, difficulty, correct, ms } = input;

  const correctStreak = correct ? prev.correctStreak + 1 : 0;
  const incorrectStreak = correct ? 0 : prev.incorrectStreak + 1;

  const index = DIFFICULTIES.indexOf(difficulty);
  let next = difficulty;
  let difficultyChange: "up" | "down" | null = null;

  const fastEnough = ms > 0 && ms < FAST_MS;

  // Three right answers in a row — and quick answers move faster.
  // Rebuilds happen when a level is entered, so this ramps up gradually.
  const up =
    (correctStreak >= 3 && index < DIFFICULTIES.length - 1) ||
    (correctStreak >= 2 && fastEnough && index < DIFFICULTIES.length - 1);

  if (up) {
    next = DIFFICULTIES[index + 1];
    difficultyChange = "up";
  } else if (incorrectStreak >= 2 && index > 0) {
    next = DIFFICULTIES[index - 1];
    difficultyChange = "down";
  }

  const previousTopic = prev.topics[topic] ?? {
    correct: 0,
    incorrect: 0,
    totalMs: 0,
    streak: 0,
  };

  const topicNext = {
    correct: previousTopic.correct + (correct ? 1 : 0),
    incorrect: previousTopic.incorrect + (correct ? 0 : 1),
    totalMs: previousTopic.totalMs + ms,
    streak: correct ? previousTopic.streak + 1 : 0,
  };

  // Practise again either when this topic keeps tripping them up, or when the
  // level was just stepped down — both cases need the same easier practice.
  const needsPractice =
    (!correct && topicNext.incorrect >= 2 && topicNext.streak === 0) ||
    difficultyChange === "down";

  return {
    state: {
      ...prev,
      difficulty: { ...prev.difficulty, [subject]: next },
      current: { ...prev.current, [subject]: next },
      correctStreak,
      incorrectStreak,
      currentSubject: subject,
      focusTopic: needsPractice
        ? topic
        : correct && topicNext.streak >= 2
          ? null
          : prev.focusTopic,
      history: [
        ...prev.history.slice(-59),
        { subject, topic, correct, ms, difficulty, at: Date.now() },
      ],
      topics: { ...prev.topics, [topic]: topicNext },
    },
    difficultyChange,
    needsPractice,
  };
}

export function topicStatus(accuracy: number, attempts: number): TopicStatus {
  if (attempts < 4) return "learning";
  if (accuracy >= 0.8) return "strong";
  if (accuracy >= 0.5) return "practicing";
  return "learning";
}

export function accuracyOf(stats: { correct: number; incorrect: number } | undefined) {
  if (!stats) return 0;
  const total = stats.correct + stats.incorrect;
  return total === 0 ? 0 : stats.correct / total;
}

/** Weakest topic first, used to decide what the next lesson should cover. */
export function weakestTopic(state: AdaptiveState, subject: SubjectId): string | null {
  const entries = Object.entries(state.topics).filter(([, s]) => {
    const total = s.correct + s.incorrect;
    return total >= 2;
  });
  if (entries.length === 0) return null;
  const [topic] = entries.sort((a, b) => accuracyOf(a[1]) - accuracyOf(b[1]))[0];
  return topic;
}

export function strongestTopic(state: AdaptiveState): string | null {
  const entries = Object.entries(state.topics).filter(([, s]) => {
    const total = s.correct + s.incorrect;
    return total >= 2;
  });
  if (entries.length === 0) return null;
  const [topic] = entries.sort((a, b) => accuracyOf(b[1]) - accuracyOf(a[1]))[0];
  return topic;
}

export function difficultyOf(state: AdaptiveState, subject: SubjectId): Difficulty {
  return state.difficulty[subject] ?? "Easy";
}

/** Milo reacts to the child's answer with one short, kind sentence. */
export function miloLine(update: AdaptiveUpdate, correct: boolean, next: Question): string {
  if (update.difficultyChange === "up") {
    return "Great job! Let's try something a little harder.";
  }
  if (update.difficultyChange === "down") {
    return "Let's take it step by step. I'll help you.";
  }
  if (!correct) {
    return "That's okay! Mistakes help us learn.";
  }
  if (next.difficulty === "Hard") {
    return "Wow, you are on a roll today!";
  }
  return "Nice thinking! Keep going.";
}
