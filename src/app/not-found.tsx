import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Milo } from "@/components/Milo";
import { ButtonLink } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="grid min-h-dvh place-items-center bg-canvas px-4">
      <div className="w-full max-w-md text-center">
        <Logo size={34} className="justify-center" />
        <Milo size={120} mood="thinking" className="mx-auto mt-8" />
        <h1 className="mt-5 font-rounded text-3xl font-extrabold tracking-tight text-ink">
          This page took a wrong turn.
        </h1>
        <p className="mt-3 text-muted">
          Let&apos;s head back to somewhere friendly.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href="/app">Go to dashboard</ButtonLink>
          <ButtonLink href="/" variant="secondary">
            Home
          </ButtonLink>
        </div>
        <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-muted">
          <Link href="/parents">Parent view</Link>
        </p>
      </div>
    </div>
  );
}
