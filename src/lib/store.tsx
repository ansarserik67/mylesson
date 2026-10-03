"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import { applyAnswer, createAdaptive, type AnswerInput, type AdaptiveUpdate } from "./adaptive";
import { seededAdaptive } from "./seed";
import {
  SUBJECTS,
  type BadgeId,
  type Difficulty,
  type Question,
  type SubjectId,
} from "./types";

export type AdaptiveState = {
  difficulty: Record<SubjectId, Difficulty>;
  /** Difficulty at the moment the current lesson started. */
  current: Record<SubjectId, Difficulty>;
  history: {
    subject: SubjectId;
    topic: string;
    correct: boolean;
    ms: number;
    difficulty: Difficulty;
    at: number;
  }[];
  topics: Record<
    string,
    { correct: number; incorrect: number; totalMs: number; streak: number }
  >;
  correctStreak: number;
  incorrectStreak: number;
  currentSubject: SubjectId;
  focusTopic: string | null;
};

export type LessonResult = {
  subject: SubjectId;
  topic: string;
  correct: number;
  total: number;
  xp: number;
  minutes: number;
  ms: number;
  difficulty: Difficulty;
  at: number;
};

export type AppState = {
  ready: boolean;
  child: { name: string; age: number | null; subjects: SubjectId[] } | null;
  totalXp: number;
  streak: number;
  lastActive: string | null;
  minutesToday: number;
  minutesGoal: number;
  lessons: LessonResult[];
  badges: BadgeId[];
  adaptive: AdaptiveState;
  /** Null means "let MyLesson choose" — it picks the topic the child needs most. */
  lesson: { subject: SubjectId; topic: string | null } | null;
  difficultyToast: AdaptiveUpdate["difficultyChange"];
};

const STORAGE_KEY = "mylesson.v1";

const initialState: AppState = {
  ready: false,
  child: null,
  totalXp: 245,
  streak: 5,
  lastActive: null,
  minutesToday: 6,
  minutesGoal: 10,
  lessons: [],
  badges: ["first-lesson", "streak-7", "math-explorer"],
  adaptive: seededAdaptive(),
  lesson: null,
  difficultyToast: null,
};

type Action =
  | { type: "hydrate"; payload: Partial<AppState> }
  | { type: "onboard"; name: string; age: number; subjects: SubjectId[] }
  | { type: "startLesson"; subject: SubjectId; topic: string | null }
  | { type: "endLesson"; result: LessonResult; badges: BadgeId[]; minutesToday: number }
  | { type: "answer"; input: AnswerInput }
  | { type: "clearToast" }
  | { type: "reset" };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "hydrate": {
      return { ...state, ...action.payload, ready: true };
    }
    case "onboard": {
      return {
        ...state,
        child: { name: action.name, age: action.age, subjects: action.subjects },
        lastActive: today(),
      };
    }
    case "startLesson": {
      return {
        ...state,
        lesson: { subject: action.subject, topic: action.topic },
        adaptive: {
          ...state.adaptive,
          current: {
            ...state.adaptive.current,
            [action.subject]: state.adaptive.difficulty[action.subject],
          },
          currentSubject: action.subject,
        },
        lastActive: today(),
      };
    }
    case "answer": {
      const update = applyAnswer(state.adaptive, action.input);
      return {
        ...state,
        adaptive: update.state,
        difficultyToast: update.difficultyChange,
      };
    }
    case "clearToast": {
      return state.difficultyToast === null ? state : { ...state, difficultyToast: null };
    }
    case "endLesson": {
      const result = action.result;
      return {
        ...state,
        totalXp: state.totalXp + result.xp,
        minutesToday: action.minutesToday,
        streak: bumpStreak(state),
        lastActive: today(),
        lessons: [result, ...state.lessons].slice(0, 40),
        badges: Array.from(new Set([...state.badges, ...action.badges])),
        lesson: null,
      };
    }
    case "reset": {
      return { ...initialState, ready: true, adaptive: seededAdaptive() };
    }
    default:
      return state;
  }
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function bumpStreak(state: AppState) {
  if (state.lastActive === today()) return state.streak;
  const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
  return state.lastActive === yesterday ? state.streak + 1 : 1;
}

export function evaluateBadges(state: AppState, result: LessonResult): BadgeId[] {
  const earned: BadgeId[] = [];
  const has = (id: BadgeId) => state.badges.includes(id) || earned.includes(id);
  const countIn = (subject: SubjectId) =>
    state.lessons.filter((l) => l.subject === subject).length + (result.subject === subject ? 1 : 0);

  if (!has("first-lesson")) earned.push("first-lesson");
  if (state.streak + 1 >= 7 && !has("streak-7")) earned.push("streak-7");
  if (countIn("math") >= 5 && !has("math-explorer")) earned.push("math-explorer");
  if (countIn("reading") >= 5 && !has("reading-star")) earned.push("reading-star");
  if (countIn("writing") >= 5 && !has("writer")) earned.push("writer");
  if (result.correct === result.total && result.total >= 5 && !has("perfect")) {
    earned.push("perfect");
  }
  if (state.totalXp + result.xp >= 100 && !has("century")) earned.push("century");

  return earned;
}

export type AppApi = {
  state: AppState;
  actions: {
    onboard: (name: string, age: number, subjects: SubjectId[]) => void;
    startLesson: (subject: SubjectId, topic?: string | null) => void;
    answer: (input: AnswerInput) => void;
    finishLesson: (result: Omit<LessonResult, "at">) => void;
    clearToast: () => void;
    reset: () => void;
  };
};

const AppContext = createContext<AppApi | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Restore the child's journey from the previous visit.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as Partial<AppState>;
        dispatch({
          type: "hydrate",
          payload: {
            child: saved.child ?? null,
            totalXp: saved.totalXp ?? initialState.totalXp,
            streak: saved.streak ?? initialState.streak,
            lastActive: saved.lastActive ?? null,
            minutesToday: saved.minutesToday ?? initialState.minutesToday,
            minutesGoal: saved.minutesGoal ?? initialState.minutesGoal,
            lessons: saved.lessons ?? [],
            badges: saved.badges ?? initialState.badges,
            adaptive: saved.adaptive ?? seededAdaptive(),
          },
        });
      } else {
        dispatch({ type: "hydrate", payload: {} });
      }
    } catch {
      dispatch({ type: "hydrate", payload: {} });
    }
  }, []);

  useEffect(() => {
    if (!state.ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage may be unavailable — the app still works in-memory */
    }
  }, [state]);

  const actions = useMemo(
    () => ({
      onboard: (name: string, age: number, subjects: SubjectId[]) =>
        dispatch({ type: "onboard", name, age, subjects }),
      startLesson: (subject: SubjectId, topic: string | null = null) =>
        dispatch({ type: "startLesson", subject, topic }),
      answer: (input: AnswerInput) => dispatch({ type: "answer", input }),
      finishLesson: (result: Omit<LessonResult, "at">) => {
        const full: LessonResult = { ...result, at: Date.now() };
        dispatch({
          type: "endLesson",
          result: full,
          badges: evaluateBadges(state, full),
          minutesToday: state.minutesToday + result.minutes,
        });
      },
      clearToast: () => dispatch({ type: "clearToast" }),
      reset: () => {
        try {
          window.localStorage.removeItem(STORAGE_KEY);
        } catch {
          /* ignore */
        }
        dispatch({ type: "reset" });
      },
    }),
    [state],
  );

  const value = useMemo(() => ({ state, actions }), [state, actions]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}

/* ---------- derived helpers ---------- */

export function levelOf(totalXp: number) {
  return Math.max(1, Math.floor(totalXp / 100) + 1);
}

export function levelProgress(totalXp: number) {
  const into = totalXp % 100;
  return { into, toNext: 100, percent: into };
}

export function subjectProgress(state: AppState, subject: SubjectId) {
  const topics = SUBJECTS[subject].topics.map((name) => {
    const stats = state.adaptive.topics[name];
    const attempts = stats ? stats.correct + stats.incorrect : 0;
    const accuracy = attempts === 0 ? 0 : Math.round((stats!.correct / attempts) * 100);
    return { name, accuracy, attempts };
  });

  const lessons = state.lessons.filter((l) => l.subject === subject);
  const attempted = topics.filter((t) => t.attempts > 0);
  const accuracy =
    attempted.length > 0
      ? Math.round(attempted.reduce((sum, t) => sum + t.accuracy, 0) / attempted.length)
      : 0;

  // Course progress rewards both accuracy and lessons completed.
  const percent = Math.round(
    Math.min(95, accuracy * 0.6 + Math.min(lessons.length, 8) * 5),
  );

  return { accuracy, topics, lessons: lessons.length, percent };
}

/** How many questions the child has answered in a subject. */
export function questionCount(state: AppState, subject: SubjectId) {
  return state.lessons
    .filter((l) => l.subject === subject)
    .reduce((sum, l) => sum + l.total, 0);
}
