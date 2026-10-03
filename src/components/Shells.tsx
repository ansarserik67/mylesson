"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo, LogoMark, XpCounter } from "./Logo";
import { Chip } from "./ui";
import { useApp, levelOf } from "@/lib/store";

const childNav = [
  { href: "/app", label: "Home", icon: "🏠" },
  { href: "/app/learn", label: "Learn", icon: "📚" },
  { href: "/app/achievements", label: "Achievements", icon: "🏆" },
  { href: "/app/profile", label: "Profile", icon: "👤" },
];

const parentNav = [
  { href: "/parents", label: "Overview", icon: "📊" },
  { href: "/parents/progress", label: "Progress", icon: "📈" },
  { href: "/parents/insights", label: "Insights", icon: "💡" },
  { href: "/parents/settings", label: "Settings", icon: "⚙️" },
];

function isActive(pathname: string, href: string, items: { href: string }[]) {
  const match = items
    .filter((i) => pathname === i.href || pathname.startsWith(`${i.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0];
  return match?.href === href;
}

export function ChildShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { state } = useApp();
  const name = state.child?.name ?? "Friend";

  return (
    <div className="min-h-dvh bg-canvas">
      {/* ---------------------------- Sidebar ---------------------------- */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[264px] flex-col border-r border-line bg-white px-5 py-6 lg:flex">
        <Link href="/app" className="mb-8 block">
          <Logo size={36} />
        </Link>

        <nav className="flex flex-col gap-1.5">
          {childNav.map((item) => {
            const active = isActive(pathname, item.href, childNav);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-2xl px-3.5 py-3 text-[15px] font-bold transition-all duration-200 ${
                  active
                    ? "bg-brand-soft text-brand-600"
                    : "text-muted hover:bg-[#F4F5FA] hover:text-ink"
                }`}
              >
                <span className="text-lg" aria-hidden>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-3">
          <div className="rounded-3xl border border-line bg-canvas p-4">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-brand to-sky font-rounded text-lg font-extrabold text-white">
                {name.slice(0, 1).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="truncate font-rounded text-sm font-extrabold text-ink">{name}</p>
                <p className="text-xs text-muted">Level {levelOf(state.totalXp)}</p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <Chip tone="sun">⭐ <XpCounter value={state.totalXp} /></Chip>
              <Chip tone="brand">🔥 {state.streak}</Chip>
            </div>
          </div>
          <Link
            href="/parents"
            className="block rounded-2xl px-3.5 py-2.5 text-sm font-semibold text-muted transition hover:bg-[#F4F5FA] hover:text-ink"
          >
            Switch to Parent view →
          </Link>
        </div>
      </aside>

      {/* ----------------------------- Topbar ---------------------------- */}
      <header className="sticky top-0 z-20 border-b border-line bg-white/85 backdrop-blur-xl lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/app" className="flex items-center gap-2">
            <LogoMark size={30} />
            <span className="font-rounded text-lg font-extrabold tracking-tight">MyLesson</span>
          </Link>
          <div className="flex items-center gap-1.5">
            <Chip tone="sun">⭐ <XpCounter value={state.totalXp} /></Chip>
            <Chip tone="brand">🔥 {state.streak}</Chip>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-4 pb-28 pt-5 sm:px-6 lg:pb-14 lg:pl-[304px] lg:pr-8">
        {children}
      </main>

      {/* ------------------------ Bottom nav (mobile) -------------------- */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-line bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden">
        <div className="mx-auto grid max-w-md grid-cols-4">
          {childNav.map((item) => {
            const active = isActive(pathname, item.href, childNav);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-bold transition-colors ${
                  active ? "text-brand-600" : "text-muted"
                }`}
              >
                <span
                  className={`grid h-9 w-14 place-items-center rounded-2xl text-lg transition-all duration-200 ${
                    active ? "bg-brand-soft" : ""
                  }`}
                  aria-hidden
                >
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export function ParentShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { state } = useApp();
  const name = state.child?.name ?? "Your child";

  return (
    <div className="min-h-dvh bg-canvas">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[264px] flex-col border-r border-line bg-white px-5 py-6 lg:flex">
        <Link href="/" className="mb-2 block">
          <Logo size={34} />
        </Link>
        <p className="mb-8 pl-0.5 text-[11px] font-bold uppercase tracking-widest text-muted">
          Parent view
        </p>

        <nav className="flex flex-col gap-1.5">
          {parentNav.map((item) => {
            const active = isActive(pathname, item.href, parentNav);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-2xl px-3.5 py-3 text-[15px] font-bold transition-all duration-200 ${
                  active
                    ? "bg-ink text-white"
                    : "text-muted hover:bg-[#F4F5FA] hover:text-ink"
                }`}
              >
                <span className="text-base" aria-hidden>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-3">
          <div className="rounded-3xl border border-line bg-canvas p-4 text-sm">
            <p className="font-bold text-ink">{name}</p>
            <p className="mt-0.5 text-muted">
              Age {state.child?.age ?? "—"} · Level {levelOf(state.totalXp)}
            </p>
          </div>
          <Link
            href="/app"
            className="block rounded-2xl px-3.5 py-2.5 text-sm font-semibold text-muted transition hover:bg-[#F4F5FA] hover:text-ink"
          >
            Switch to {name}&apos;s view →
          </Link>
        </div>
      </aside>

      <header className="sticky top-0 z-20 border-b border-line bg-white/85 backdrop-blur-xl lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/parents" className="flex items-center gap-2">
            <LogoMark size={30} />
            <span className="font-rounded text-lg font-extrabold tracking-tight">
              MyLesson
            </span>
          </Link>
          <span className="rounded-full bg-[#F1F2F7] px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-muted">
            Parent
          </span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-4 pb-28 pt-5 sm:px-6 lg:pb-14 lg:pl-[304px] lg:pr-8">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-line bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden">
        <div className="mx-auto grid max-w-md grid-cols-4">
          {parentNav.map((item) => {
            const active = isActive(pathname, item.href, parentNav);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-bold transition-colors ${
                  active ? "text-ink" : "text-muted"
                }`}
              >
                <span
                  className={`grid h-9 w-14 place-items-center rounded-2xl text-lg transition-all duration-200 ${
                    active ? "bg-[#F1F2F7]" : ""
                  }`}
                  aria-hidden
                >
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
