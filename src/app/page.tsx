import Link from "next/link";
import { Milo } from "@/components/Milo";
import { Logo, LogoMark } from "@/components/Logo";
import { ButtonLink, Card, Chip } from "@/components/ui";

const features = [
  {
    icon: "🎯",
    title: "Adaptive Learning",
    body: "MyLesson understands what your child knows and adjusts every lesson.",
    tone: "bg-brand-soft",
  },
  {
    icon: "🤝",
    title: "Always Patient",
    body: "Mistakes are part of learning. MyLesson explains and encourages instead of judging.",
    tone: "bg-sun-soft",
  },
  {
    icon: "📈",
    title: "Track Progress",
    body: "Parents can easily see what their child is learning and where they need more practice.",
    tone: "bg-grass-soft",
  },
];

const steps = [
  {
    n: "01",
    title: "Meet Milo",
    body: "A two-minute welcome finds your child's level in reading, writing and math.",
  },
  {
    n: "02",
    title: "Learn a little every day",
    body: "Short lessons built around your child — not a fixed curriculum.",
  },
  {
    n: "03",
    title: "See what's working",
    body: "Parents get a clear weekly view of progress, accuracy and what to practise next.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-dvh overflow-x-hidden bg-canvas">
      {/* ------------------------------ Nav ------------------------------ */}
      <header className="sticky top-0 z-40 border-b border-line/70 bg-canvas/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" aria-label="MyLesson home">
            <Logo size={34} />
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-semibold text-muted md:flex">
            <a className="transition-colors hover:text-ink" href="#features">
              Features
            </a>
            <a className="transition-colors hover:text-ink" href="#how">
              How it works
            </a>
            <Link className="transition-colors hover:text-ink" href="/parents">
              For Parents
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/app"
              className="rounded-2xl px-3.5 py-2.5 text-sm font-bold text-ink-soft transition-colors hover:bg-white hover:text-brand"
            >
              Log in
            </Link>
            <ButtonLink href="/onboarding" size="sm" className="hidden sm:inline-flex">
              Get Started
            </ButtonLink>
          </div>
        </div>
      </header>

      {/* ----------------------------- Hero ------------------------------ */}
      <section className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-brand/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 top-40 h-80 w-80 rounded-full bg-sky/10 blur-3xl"
        />

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pb-16 pt-14 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:pb-24 lg:pt-20">
          <div className="animate-rise">
            <Chip tone="brand" className="mb-5">
              ✨ Your personal tutor. Every day.
            </Chip>
            <h1 className="font-rounded text-[2.6rem] font-extrabold leading-[1.05] tracking-tight text-ink sm:text-6xl">
              A personal tutor for
              <span className="relative whitespace-nowrap">
                {" "}
                every child
                <svg
                  className="absolute -bottom-2 left-0 h-3 w-full text-sun"
                  viewBox="0 0 300 12"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M2 9C60 3 150 2 298 7"
                    stroke="currentColor"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              .
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
              MyLesson adapts every lesson to your child&apos;s level, helping them learn
              reading, writing and math at their own pace.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/onboarding" size="lg" className="w-full sm:w-auto">
                Start Learning
              </ButtonLink>
              <ButtonLink
                href="/parents"
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto"
              >
                For Parents
              </ButtonLink>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted">
              <span className="flex items-center gap-2">
                <span className="flex -space-x-2">
                  {["#6C63FF", "#5B8DEF", "#45C486", "#FFB84D"].map((c) => (
                    <span
                      key={c}
                      className="h-6 w-6 rounded-full border-2 border-canvas"
                      style={{ background: c }}
                    />
                  ))}
                </span>
                Loved by 12,400+ families
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-ink-soft">
                ⭐ 4.9 average rating
              </span>
            </div>
          </div>

          <div className="animate-rise [animation-delay:120ms]">
            <HeroMockup />
          </div>
        </div>
      </section>

      {/* --------------------------- Features ---------------------------- */}
      <section id="features" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-12 sm:px-6 lg:py-16">
        <div className="mb-8 max-w-2xl">
          <h2 className="font-rounded text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Built around your child
          </h2>
          <p className="mt-3 text-lg text-muted">
            Three ideas that shape every single lesson on MyLesson.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {features.map((f, i) => (
            <Card
              key={f.title}
              hover
              className="animate-rise p-6 sm:p-7"
              style={{ animationDelay: `${i * 90}ms` }}
            >
              <div
                className={`mb-5 grid h-12 w-12 place-items-center rounded-2xl text-xl ${f.tone}`}
                aria-hidden
              >
                {f.icon}
              </div>
              <h3 className="font-rounded text-lg font-extrabold text-ink">{f.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">{f.body}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* -------------------------- How it works ------------------------- */}
      <section id="how" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-12 sm:px-6 lg:py-16">
        <Card className="overflow-hidden">
          <div className="grid gap-10 p-7 sm:p-10 lg:grid-cols-[1fr_0.85fr] lg:p-12">
            <div>
              <Chip tone="sky" className="mb-4">
                How it works
              </Chip>
              <h2 className="font-rounded text-3xl font-extrabold tracking-tight text-ink">
                Ten minutes a day is enough.
              </h2>
              <div className="mt-8 space-y-6">
                {steps.map((s) => (
                  <div key={s.n} className="flex gap-4">
                    <span className="font-rounded tnum mt-0.5 text-sm font-extrabold text-brand">
                      {s.n}
                    </span>
                    <div>
                      <h3 className="font-rounded text-base font-extrabold text-ink">
                        {s.title}
                      </h3>
                      <p className="mt-1 text-[15px] leading-relaxed text-muted">{s.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative grid place-items-center rounded-[2rem] bg-gradient-to-br from-brand-soft via-white to-sky-soft p-6">
              <div className="w-full max-w-[280px] text-center">
                <Milo size={112} mood="happy" className="mx-auto" />
                <p className="mt-4 font-rounded text-lg font-extrabold text-ink">
                  &ldquo;Let&apos;s solve this one together.&rdquo;
                </p>
                <p className="mt-1 text-sm text-muted">
                  Milo keeps lessons kind, calm and encouraging.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* ----------------------------- CTA ------------------------------- */}
      <section className="mx-auto max-w-6xl px-4 pb-20 pt-6 sm:px-6">
        <div className="relative overflow-hidden rounded-[2.25rem] bg-gradient-to-br from-brand via-[#6f66ff] to-sky px-7 py-12 text-center shadow-brand sm:px-12 sm:py-16">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-25 [background:radial-gradient(circle_at_20%_20%,#fff,transparent_45%),radial-gradient(circle_at_80%_70%,#FFB84D,transparent_40%)]"
          />
          <div className="relative">
            <h2 className="font-rounded text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Learning that fits your child.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-white/85">
              Start with a free placement lesson. No credit card, no pressure — just ten
              friendly minutes.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <ButtonLink href="/onboarding" variant="accent" size="lg">
                Start Learning
              </ButtonLink>
              <ButtonLink href="/parents" variant="onDark" size="lg">
                See the parent view
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------- Footer ----------------------------- */}
      <footer className="border-t border-line bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between">
          <div>
            <Logo size={30} />
            <p className="mt-2 text-sm text-muted">Your personal tutor. Every day.</p>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm font-semibold text-muted">
            <a href="#features" className="hover:text-ink">
              Features
            </a>
            <a href="#how" className="hover:text-ink">
              How it works
            </a>
            <Link href="/parents" className="hover:text-ink">
              For Parents
            </Link>
            <Link href="/app" className="hover:text-ink">
              Log in
            </Link>
          </div>
          <p className="text-xs text-muted">© 2026 MyLesson. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

/* ------------------------- Hero product mockup ------------------------- */

function HeroMockup() {
  return (
    <div className="relative mx-auto w-full max-w-[520px]">
      <div
        aria-hidden
        className="absolute -inset-6 rounded-[3rem] bg-gradient-to-br from-brand/12 to-sky/12 blur-2xl"
      />

      <Card className="relative overflow-hidden p-0 shadow-card">
        <div className="flex items-center justify-between border-b border-line bg-white px-5 py-3.5">
          <span className="flex items-center gap-2">
            <LogoMark size={26} />
            <span className="font-rounded text-sm font-extrabold">Math</span>
          </span>
          <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-bold text-brand-600">
            Question 4 / 10
          </span>
        </div>

        <div className="bg-gradient-to-b from-white to-canvas px-5 py-6">
          <div className="track mb-6 h-2">
            <div className="fill bg-gradient-to-r from-brand to-sky" style={{ width: "40%" }} />
          </div>

          <p className="font-rounded text-center text-lg font-extrabold text-ink">
            Let&apos;s solve this together!
          </p>
          <p className="tnum mt-1 text-center font-rounded text-4xl font-extrabold text-ink">
            7 + 5 = ?
          </p>

          <div className="mt-6 grid grid-cols-3 gap-3">
            {["10", "12", "13"].map((v, i) => (
              <div
                key={v}
                className={`grid h-16 place-items-center rounded-3xl font-rounded text-xl font-extrabold ${
                  i === 1
                    ? "bg-grass text-white shadow-[0_16px_30px_-16px_rgba(69,196,134,0.9)]"
                    : "border border-line bg-white text-ink"
                }`}
              >
                {v}
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center gap-3 rounded-3xl border border-line bg-white p-3">
            <Milo size={52} mood="cheer" />
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted">
                Milo
              </p>
              <p className="text-sm font-bold text-[#1F8A5A]">
                Amazing! 7 + 5 = 12 · +10 XP
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* floating stat cards */}
      <Card className="animate-float absolute -left-4 bottom-16 hidden p-3.5 shadow-card sm:block">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted">
          Today
        </p>
        <p className="tnum font-rounded text-lg font-extrabold text-ink">6 / 10 min</p>
        <div className="track mt-2 h-1.5 w-28">
          <div className="fill bg-gradient-to-r from-brand to-sky" style={{ width: "60%" }} />
        </div>
      </Card>

      <Card className="animate-float absolute -right-3 -top-4 hidden p-3.5 shadow-card [animation-delay:1.2s] sm:block">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-2xl bg-sun-soft text-base">
            🔥
          </span>
          <div>
            <p className="font-rounded text-base font-extrabold leading-none text-ink">
              5 day
            </p>
            <p className="text-[11px] text-muted">streak</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
