import { createAdaptive } from "./adaptive";
import type { AdaptiveState } from "./store";

/**
 * A brand-new profile still needs something to show a parent. These numbers
 * describe the child's placement lesson: a few topics they are already strong
 * at, and a couple they are still practising.
 */
const SEED_TOPICS: AdaptiveState["topics"] = {
  "Letters & sounds": { correct: 9, incorrect: 1, totalMs: 61_000, streak: 2 },
  "Sight words": { correct: 7, incorrect: 3, totalMs: 96_000, streak: 1 },
  Comprehension: { correct: 5, incorrect: 3, totalMs: 118_000, streak: 1 },
  "Letter sounds": { correct: 8, incorrect: 2, totalMs: 54_000, streak: 2 },
  Spelling: { correct: 5, incorrect: 4, totalMs: 132_000, streak: 0 },
  Sentences: { correct: 6, incorrect: 3, totalMs: 108_000, streak: 1 },
  Addition: { correct: 10, incorrect: 1, totalMs: 48_000, streak: 3 },
  Subtraction: { correct: 6, incorrect: 4, totalMs: 104_000, streak: 0 },
  "Number comparison": { correct: 8, incorrect: 1, totalMs: 52_000, streak: 2 },
};

export function seededAdaptive(): AdaptiveState {
  const base = createAdaptive("math");
  return { ...base, topics: SEED_TOPICS };
}
