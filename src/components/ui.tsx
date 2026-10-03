import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

/* ------------------------------- Buttons ------------------------------- */

export type Variant =
  | "primary"
  | "secondary"
  | "accent"
  | "success"
  | "ghost"
  | "dark"
  | "inverse"
  | "onDark";
export type Size = "sm" | "md" | "lg" | "xl";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand text-white shadow-brand hover:bg-brand-600 hover:-translate-y-0.5 focus-visible:outline-brand",
  secondary:
    "bg-white text-ink border border-line hover:border-brand/40 hover:-translate-y-0.5 shadow-soft",
  accent:
    "bg-sun text-[#5a3a05] shadow-[0_18px_36px_-18px_rgba(255,184,77,0.9)] hover:brightness-105 hover:-translate-y-0.5",
  success:
    "bg-grass text-white shadow-[0_18px_36px_-18px_rgba(69,196,134,0.9)] hover:brightness-105 hover:-translate-y-0.5",
  ghost: "text-ink-soft hover:bg-brand-soft hover:text-brand",
  dark: "bg-ink text-white hover:bg-ink-soft hover:-translate-y-0.5",
  /** For use on top of the purple gradient cards. */
  inverse: "bg-white text-brand shadow-none hover:bg-white hover:brightness-95 hover:-translate-y-0.5",
  onDark: "bg-white/15 text-white backdrop-blur hover:bg-white/25 hover:-translate-y-0.5",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-sm gap-1.5 rounded-2xl",
  md: "h-12 px-5 text-[15px] gap-2 rounded-2xl",
  lg: "h-14 px-7 text-base gap-2 rounded-[1.25rem]",
  xl: "h-16 px-8 text-lg gap-2.5 rounded-[1.4rem]",
};

const base =
  "inline-flex items-center justify-center font-semibold select-none transition-all duration-200 press disabled:opacity-40 disabled:pointer-events-none whitespace-nowrap";

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ComponentProps<"button"> & { variant?: Variant; size?: Size }) {
  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props} />
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className = "",
  href,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant; size?: Size }) {
  return (
    <Link href={href} className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props} />
  );
}

/* -------------------------------- Cards -------------------------------- */

export function Card({
  className = "",
  hover = false,
  ...props
}: ComponentProps<"div"> & { hover?: boolean }) {
  return (
    <div className={`card ${hover ? "card-hover" : ""} ${className}`} {...props} />
  );
}

export function SectionHeading({
  title,
  action,
  className = "",
}: {
  title: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mb-4 flex items-end justify-between gap-4 ${className}`}>
      <h2 className="font-rounded text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
        {title}
      </h2>
      {action}
    </div>
  );
}

/* ------------------------------ Progress ------------------------------- */

const barColors = {
  brand: "bg-gradient-to-r from-brand to-[#8B84FF]",
  sky: "bg-gradient-to-r from-sky to-[#7FA9F3]",
  sun: "bg-gradient-to-r from-sun to-[#FFD08A]",
  grass: "bg-gradient-to-r from-grass to-[#6ED6A3]",
} as const;

export function ProgressBar({
  value,
  color = "brand",
  className = "",
  delay = 0,
}: {
  value: number;
  color?: keyof typeof barColors;
  className?: string;
  delay?: number;
}) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div
      className={`track h-2.5 w-full ${className}`}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={`fill ${barColors[color]}`}
        style={{ width: `${pct}%`, transitionDelay: `${delay}ms` }}
      />
    </div>
  );
}

/* -------------------------------- Misc --------------------------------- */

export function Chip({
  children,
  tone = "brand",
  className = "",
}: {
  children: ReactNode;
  tone?: "brand" | "sky" | "sun" | "grass" | "muted";
  className?: string;
}) {
  const tones = {
    brand: "bg-brand-soft text-brand-600",
    sky: "bg-sky-soft text-[#2F63C4]",
    sun: "bg-sun-soft text-[#9A6212]",
    grass: "bg-grass-soft text-[#1F8A5A]",
    muted: "bg-[#F1F2F7] text-muted",
  } as const;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

export function StatTile({
  icon,
  value,
  label,
  tone = "brand",
}: {
  icon: string;
  value: string;
  label: string;
  tone?: "brand" | "sky" | "sun" | "grass";
}) {
  const tones = {
    brand: "bg-brand-soft",
    sky: "bg-sky-soft",
    sun: "bg-sun-soft",
    grass: "bg-grass-soft",
  } as const;
  return (
    <div className="rounded-3xl border border-line bg-white p-4 sm:p-5">
      <div
        className={`mb-3 grid h-10 w-10 place-items-center rounded-2xl text-lg ${tones[tone]}`}
        aria-hidden
      >
        {icon}
      </div>
      <p className="font-rounded tnum text-2xl font-extrabold text-ink">{value}</p>
      <p className="mt-0.5 text-sm text-muted">{label}</p>
    </div>
  );
}
