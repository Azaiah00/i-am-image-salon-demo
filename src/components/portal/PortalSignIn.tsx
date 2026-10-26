"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CalendarHeart, Check, Compass, Crown, KeyRound, Loader2, Lock, Mail, Scissors, ShieldCheck, UserRound } from "lucide-react";
import { signIn, STAFF } from "@/lib/portal/db";
import { maybeStartTour, setWantGuide, useWantGuide, type TourRole } from "@/lib/portal/tour";
import type { StaffKey } from "@/lib/services";
import { PortalLogo } from "./ui";
import { cn } from "@/lib/cn";

const STYLISTS = STAFF.filter((s) => s.key !== "kayla");

const VIEWS: {
  role: TourRole;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  who: string;
  sub: string;
  points: string[];
}[] = [
  {
    role: "client",
    icon: UserRound,
    title: "Client",
    who: "Aaliyah B. · a regular client",
    sub: "What a client sees after booking",
    points: ["Upcoming visits, reschedule & cancel", "Image Club rewards", "Image Journey photo timeline", "The 5-step booking flow"],
  },
  {
    role: "owner",
    icon: Crown,
    title: "Owner",
    who: "Kayla Means · salon owner",
    sub: "The whole salon in one place",
    points: ["Every stylist's calendar side by side", "Clients, notes & journeys", "Finances, deposits & payroll", "Hours, deposits & menu editor"],
  },
  {
    role: "stylist",
    icon: Scissors,
    title: "Stylist",
    who: "A stylist on the team",
    sub: "Only their own chair",
    points: ["Their own calendar & clients", "Check-in, complete & take payment", "Add Image Journey photos", "Owner-only pages stay hidden"],
  },
];

const EMAIL: Record<TourRole, (s: StaffKey) => string> = {
  client: () => "aaliyah.demo@example.com",
  owner: () => "owner.demo@example.com",
  stylist: (s) => `${s}.demo@example.com`,
};

export function PortalSignIn() {
  const router = useRouter();
  const wantGuide = useWantGuide();
  const [role, setRole] = useState<TourRole>("client");
  const [stylist, setStylist] = useState<StaffKey>("alcion");
  const [busy, setBusy] = useState(false);

  const view = VIEWS.find((v) => v.role === role)!;
  const name = role === "owner" ? "Kayla" : role === "stylist" ? STAFF.find((s) => s.key === stylist)!.short : "Aaliyah";

  const go = (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    window.setTimeout(() => {
      signIn(role, "Demo login", role === "stylist" ? stylist : undefined);
      maybeStartTour(role);
      router.push(role === "client" ? "/portal/client" : "/portal/studio");
    }, 900);
  };

  return (
    <div className="grid min-h-[calc(100svh-44px)] lg:grid-cols-[0.9fr_1.1fr]">
      <aside className="relative hidden overflow-hidden border-r border-white/[0.06] bg-ink lg:block">
        <div aria-hidden className="absolute left-1/2 top-1/3 size-[34rem] -translate-x-1/2 rounded-full bg-crimson/20 blur-[120px]" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img width={600} height={800} src="/media/art/silkpress.svg" alt="" aria-hidden className="absolute inset-x-0 top-8 mx-auto h-[58%] w-auto" />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink via-ink/95 to-transparent p-12 pt-32">
          <p className="eyebrow text-flare">I Am Image · Booking portal demo</p>
          <p className="display mt-4 text-6xl text-bone">
            One portal. <span className="script text-[1.2em] text-flare">Three</span> views.
          </p>
          <p className="mt-5 max-w-md leading-relaxed text-mist/85">Clients, the owner and every stylist use the same live calendar, each seeing only what they should. Choose a view, and the guide shows you how each part works now and what it does at launch.</p>
        </div>
      </aside>

      <div className="flex min-w-0 flex-col px-4 py-6 sm:px-10 sm:py-8">
        <div className="flex items-center justify-between gap-3">
          <PortalLogo href="/" sub="Portal demo" />
          <Link href="/" className="inline-flex min-h-11 items-center gap-1 text-sm text-mist/80 hover:text-paper">
            <ArrowLeft className="size-4" aria-hidden /> Website
          </Link>
        </div>

        <div className="mx-auto w-full max-w-xl py-8 sm:py-10">
          <AnimatePresence mode="wait" initial={false}>
            {!busy ? (
              <motion.div key="pick" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
                <p className="eyebrow flex items-center gap-2 text-flare">
                  <Compass className="size-4" aria-hidden /> Step 1 · Choose a view
                </p>
                <h1 className="display mt-3 text-[clamp(2.4rem,8vw,3.6rem)] text-bone">Who do you want to be?</h1>
                <p className="mt-2 text-mist/80">A working demo with sample clients and appointments. Nothing is real, nothing is charged, and it resets when you refresh.</p>

                <div className="mt-7 grid gap-3" role="group" aria-label="Choose a perspective">
                  {VIEWS.map((v) => {
                    const active = v.role === role;
                    return (
                      <button
                        key={v.role}
                        type="button"
                        onClick={() => setRole(v.role)}
                        aria-pressed={active}
                        data-view={v.role}
                        className={cn(
                          "group relative w-full rounded-3xl border p-4 text-left transition sm:p-5",
                          active ? "border-flare bg-gradient-to-br from-crimson/25 via-graphite to-onyx shadow-[0_20px_60px_-30px_rgba(249,37,5,0.8)]" : "border-white/12 bg-onyx hover:border-white/30",
                        )}
                      >
                        <div className="flex items-start gap-3 sm:gap-4">
                          <span className={cn("grid size-11 shrink-0 place-items-center rounded-2xl transition", active ? "bg-crimson text-paper" : "bg-red/10 text-flare")}>
                            <v.icon className="size-5" aria-hidden />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="flex items-center justify-between gap-2">
                              <span className="text-xl text-bone">{v.title}</span>
                              <span aria-hidden className={cn("grid size-6 shrink-0 place-items-center rounded-full border transition", active ? "border-flare bg-flare text-ink" : "border-white/20 text-transparent")}>
                                <Check className="size-3.5" />
                              </span>
                            </span>
                            <span className="block text-sm text-silver">{v.sub}</span>
                            <span className={cn("grid overflow-hidden transition-all duration-300", active ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
                              <span className="min-h-0">
                                <span className="grid gap-1.5 sm:grid-cols-2">
                                  {v.points.map((p) => (
                                    <span key={p} className="flex items-start gap-2 text-[13px] leading-snug text-mist/90">
                                      <span aria-hidden className="mt-1.5 size-1.5 shrink-0 rounded-full bg-flare" />
                                      {p}
                                    </span>
                                  ))}
                                </span>
                              </span>
                            </span>
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Step 2: demo sign-in */}
                <form onSubmit={go} className="mt-6 rounded-3xl border border-white/12 bg-onyx p-4 sm:p-6" aria-labelledby="login-h">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p id="login-h" className="eyebrow flex items-center gap-2 text-flare">
                      <KeyRound className="size-4" aria-hidden /> Step 2 · Demo sign-in
                    </p>
                    <span className="demo-badge">Filled in for you</span>
                  </div>
                  <p className="mt-2 text-sm text-silver">{view.who}</p>

                  {role === "stylist" && (
                    <div className="mt-4">
                      <p className="mb-2 text-sm text-mist">Which stylist?</p>
                      <div className="grid grid-cols-3 gap-2" role="group" aria-label="Stylist">
                        {STYLISTS.map((s) => (
                          <button
                            key={s.key}
                            type="button"
                            onClick={() => setStylist(s.key as StaffKey)}
                            aria-pressed={stylist === s.key}
                            className={cn("min-h-11 rounded-xl border text-sm transition", stylist === s.key ? "border-flare bg-crimson text-paper" : "border-white/12 text-bone hover:border-white/30")}
                          >
                            {s.short}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                    <label className="block min-w-0">
                      <span className="mb-1.5 block text-xs text-silver">Email</span>
                      <span className="relative block">
                        <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-silver" aria-hidden />
                        <input readOnly value={EMAIL[role](stylist)} autoComplete="off" className="h-12 w-full truncate rounded-xl border border-white/12 bg-ink pl-9 pr-3 text-sm text-bone focus:border-flare focus:outline-none" />
                      </span>
                    </label>
                    <label className="block min-w-0">
                      <span className="mb-1.5 block text-xs text-silver">Password</span>
                      <span className="relative block">
                        <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-silver" aria-hidden />
                        <input readOnly type="password" value="demo-only" autoComplete="off" className="h-12 w-full rounded-xl border border-white/12 bg-ink pl-9 pr-3 text-sm text-bone focus:border-flare focus:outline-none" />
                      </span>
                    </label>
                  </div>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={wantGuide}
                    onClick={() => setWantGuide(!wantGuide)}
                    className="mt-4 flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-ink/60 p-3 text-left transition hover:border-white/25"
                  >
                    <span aria-hidden className={cn("relative h-6 w-11 shrink-0 rounded-full transition-colors", wantGuide ? "bg-crimson" : "bg-white/15")}>
                      <span className={cn("absolute top-0.5 size-5 rounded-full bg-paper shadow transition-all", wantGuide ? "left-[22px]" : "left-0.5")} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm text-bone">Guided walkthrough {wantGuide ? "on" : "off"}</span>
                      <span className="block text-xs text-silver">Step-by-step cards explain each feature. Turn it on or off any time from the red bar at the top.</span>
                    </span>
                  </button>

                  <button type="submit" className="btn btn-primary mt-5 w-full">
                    Sign in as {name} {role === "owner" ? "(owner)" : role === "stylist" ? "(stylist)" : ""} <ArrowRight className="size-4" aria-hidden />
                  </button>
                </form>

                <div className="my-6 flex items-center gap-3 text-xs text-silver">
                  <span className="h-px flex-1 bg-white/10" /> or <span className="h-px flex-1 bg-white/10" />
                </div>
                <Link href="/book" className="btn btn-ghost w-full">
                  <CalendarHeart className="size-4" aria-hidden /> Book as a guest
                </Link>
                <p className="mt-6 flex items-start gap-2 text-xs leading-relaxed text-silver">
                  <ShieldCheck className="mt-0.5 size-4 shrink-0" aria-hidden /> Demo sign-in only. No real password is used and nothing leaves your browser. At launch, people sign in with Google, Apple or a one-time email link, and their account opens the right view automatically.
                </p>
              </motion.div>
            ) : (
              <motion.div key="auth" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid place-items-center py-20 text-center" role="status">
                <div className="relative grid size-20 place-items-center rounded-full border border-white/15">
                  <Loader2 className="size-8 animate-spin text-flare" aria-hidden />
                  <KeyRound className="absolute size-4 text-mist" aria-hidden />
                </div>
                <p className="display mt-6 text-3xl text-bone">Signing in as {name}…</p>
                <p className="mt-1 text-sm text-silver">{wantGuide ? "Your guide is getting ready" : "Opening the " + view.title.toLowerCase() + " view"}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
