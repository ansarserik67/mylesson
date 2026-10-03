<div align="center">

# MyLesson

**Your personal tutor. Every day.**

An AI-powered personal tutor for young children that adapts every lesson in
reading, writing and math to the child's own level.

</div>

---

## What it is

MyLesson is an MVP of a consumer learning product for ages 5–10. Instead of
pushing every child through the same worksheet, it tracks how each child
answers and moves the difficulty up or down to match them.

The experience is deliberately built around one loop:

**Learn → Make mistakes → Understand → Improve → Celebrate → Continue**

## Features

### Landing page

A marketing page with a hero product mockup, feature cards, "how it works",
and calls to action into onboarding and the parent view.

- **Adaptive Learning** — the engine measures correct answers, mistakes,
  response time and per-topic accuracy, then adjusts difficulty
  (Beginner → Easy → Medium → Hard).
- **Always Patient** — a wrong answer never shows "Wrong". Milo explains the
  idea step by step with a visual model and offers **Try Again**.
- **Track Progress** — a separate, more professional parent interface.

### Child experience

| Screen | Route | What works |
| --- | --- | --- |
| Onboarding | `/onboarding` | 4 visual steps: name, age, subjects, level placement |
| Dashboard | `/app` | Greeting, today's minutes goal, streak, XP, level, continue-learning card, subject cards |
| Learn | `/app/learn` | Subject + topic picker with per-topic status |
| Lesson | `/app/lesson` | 10 questions, large tap targets, hints, feedback, adaptive difficulty, celebration screen |
| Achievements | `/app/achievements` | Badges, XP level, streak calendar, lesson history |
| Profile | `/app/profile` | Level, XP, streak, badges, per-subject progress, settings |

Rewards run through the whole child experience: XP, streaks, badges and a
celebration screen after every lesson.

### Parent experience

| Screen | Route | What works |
| --- | --- | --- |
| Overview | `/parents` | Learning overview, weekly stats, insights, recommendation |
| Progress | `/parents/progress` | Topic-by-topic accuracy, average response time, lesson history |
| Insights | `/parents/insights` | Strengths, topics needing practice, what the engine tracks |
| Settings | `/parents/settings` | Edit child profile, learning plan, local data controls |

## The adaptive engine

`src/lib/adaptive.ts` is the heart of the product. After every answer it updates
a single piece of state:

- **Difficulty up** when the child gets three answers right in a row (two right,
  fast answers accelerate this).
- **Difficulty down** after two mistakes in a row, and that topic is then
  flagged so the next lesson practises it.
- **Topic tracking** records correct answers, mistakes, total response time and
  streaks per topic, producing a `strong` / `practicing` / `learning` status.
- Difficulty is rebuilt when a level is entered, so the ramp is gradual rather
  than jumping from Beginner to Hard.

## Tech stack

- **Next.js 16** (App Router, static export)
- **TypeScript**
- **React 19**
- **Tailwind CSS 4** (design tokens in `src/app/globals.css`)
- No backend and no external AI API — state lives in `localStorage`, and Milo's
  coaching comes from MyLesson's own adaptive engine.

## Getting started

```bash
cd mylesson
npm install
npm run dev        # http://localhost:4310
```

Other scripts:

```bash
npm run build      # static export to ./out
npm run typecheck  # tsc --noEmit
npm run verify     # checks the adaptive rules and every generated question
```

## Project structure

```
mylesson/
├── src/
│   ├── app/
│   │   ├── page.tsx                  # landing page
│   │   ├── onboarding/page.tsx       # 4-step child onboarding
│   │   ├── app/                      # child experience
│   │   │   ├── page.tsx              # dashboard
│   │   │   ├── learn/page.tsx        # subject + topic picker
│   │   │   ├── lesson/page.tsx       # the lesson screen
│   │   │   ├── achievements/page.tsx
│   │   │   └── profile/page.tsx
│   │   └── parents/                  # parent experience
│   │       ├── page.tsx              # overview
│   │       ├── progress/page.tsx
│   │       ├── insights/page.tsx
│   │       └── settings/page.tsx
│   ├── components/
│   │   ├── ui.tsx                    # Button, Card, ProgressBar, Chip, StatTile
│   │   ├── Logo.tsx                  # logo mark, wordmark, animated XP counter
│   │   ├── Milo.tsx                  # the tutor character + speech bubble
│   │   ├── Shells.tsx                # child + parent navigation shells
│   │   └── Celebration.tsx           # lesson-complete screen
│   └── lib/
│       ├── store.tsx                 # global state, persistence, selectors
│       ├── adaptive.ts               # difficulty engine + Milo's lines
│       ├── questions.ts              # generated question bank
│       ├── seed.ts                   # starter progress for a new profile
│       └── types.ts                  # domain types, subjects, badges
```

## Design system

| Token | Value | Use |
| --- | --- | --- |
| Brand | `#6C63FF` | Primary actions and brand |
| Blue | `#5B8DEF` | Secondary accent |
| Yellow | `#FFB84D` | Rewards, hints, XP |
| Green | `#45C486` | Correct answers, success |
| Canvas | `#F7F8FC` | App background |
| Ink | `#202124` | Main text |
| Muted | `#6B7280` | Secondary text |

Typography is Plus Jakarta Sans for UI and Nunito for the rounded, friendly
headings. Cards use large radii (1.75–2.25rem), soft shadows and generous
whitespace.

## Responsive behaviour

- **Desktop / laptop** — persistent sidebar, content offset, hover lifts on cards.
- **Tablet** — two-column grids.
- **Mobile** — sticky top bar with XP and streak, bottom navigation with the
  four child tabs (Home, Learn, Achievements, Profile) or parent tabs.

## Notes & limitations

- All progress is stored locally in the browser; clearing site data resets it.
- Difficulty, topics and rewards are computed by a deterministic local engine —
  no network calls, no external AI service yet.
- Verified with `npm run typecheck`, `next build`, and `npm run verify` — which
  exercises the adaptive rules and validates all 360 generated questions.

## Roadmap

- Read questions aloud for pre-readers.
- Weekly email digest for parents.
- Multiple child profiles per parent account.
- Server-side progress history across devices.
- LLM-backed Milo for open-ended reading comprehension.

---

© 2026 MyLesson. Built as a product MVP.