"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CalendarHeart, Crown, KeyRound, Loader2, Mail, Scissors, ShieldCheck, Smartphone, UserRound } from "lucide-react";
import { signIn, STAFF } from "@/lib/portal/db";
import type { StaffKey } from "@/lib/services";
import { PortalLogo } from "./ui";

type Step = "choose" | "auth" | "role";

export function PortalSignIn() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("choose");
  const [provider, setProvider] = useState("");

  const start = (p: string) => {
    setProvider(p);
    setStep("auth");
    setTimeout(() => setStep("role"), 1400);
  };

  const card = "flex min-h-14 items-center gap-3 rounded-2xl border border-white/12 bg-onyx px-5 text-left text-bone transition hover:border-flare";

  return (
    <div className="grid min-h-[calc(100svh-28px)] lg:grid-cols-[1.05fr_1fr]">
      <aside className="relative hidden overflow-hidden border-r border-white/[0.06] bg-ink lg:block">
        <div aria-hidden className="absolute left-1/2 top-1/3 size-[34rem] -translate-x-1/2 rounded-full bg-crimson/20 blur-[120px]" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img width={600} height={800} src="/media/art/silkpress.svg" alt="" aria-hidden className="absolute inset-x-0 top-8 mx-auto h-[62%] w-auto" />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink via-ink/95 to-transparent p-12 pt-32">
          <p className="eyebrow text-flare">I Am Image · Booking portal</p>
          <h1 className="display mt-4 text-6xl text-bone">
            Your image, booked in <span className="script text-[1.2em] text-flare">seconds.</span>
          </h1>
          <ul className="mt-6 grid gap-2 text-mist/85">
            <li>· Live availability for every stylist, on the salon’s real hours</li>
            <li>· Price, time and deposit update as you choose — no surprises</li>
            <li>· Your Image Journey: before & afters, care notes and rewards</li>
          </ul>
        </div>
      </aside>

      <div className="flex flex-col px-5 py-8 sm:px-10">
        <div className="flex items-center justify-between">
          <PortalLogo href="/" />
          <Link href="/" className="inline-flex min-h-11 items-center gap-1 text-sm text-mist/80 hover:text-paper">
            <ArrowLeft className="size-4" aria-hidden /> Website
          </Link>
        </div>

        <div className="mx-auto my-auto w-full max-w-md py-10">
          <AnimatePresence mode="wait" initial={false}>
            {step === "choose" && (
              <motion.div key="choose" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
                <h2 className="display text-5xl text-bone">Welcome back.</h2>
                <p className="mt-2 text-mist/80">Sign in to book, manage appointments and see your Image Journey.</p>
                <div className="mt-8 grid gap-3">
                  <button onClick={() => start("Google")} className={card}>
                    <span className="grid size-8 place-items-center rounded-full bg-paper text-sm font-bold text-char">G</span>
                    Continue with Google
                    <span className="ml-auto text-[10px] font-semibold uppercase tracking-widest text-flare">Demo</span>
                  </button>
                  <button onClick={() => start("Apple")} className={card}>
                    <Smartphone className="size-6 text-mist" aria-hidden />
                    Continue with Apple
                    <span className="ml-auto text-[10px] font-semibold uppercase tracking-widest text-flare">Demo</span>
                  </button>
                  <button onClick={() => start("email link")} className={card}>
                    <Mail className="size-6 text-mist" aria-hidden />
                    Email me a sign-in link
                    <span className="ml-auto text-[10px] font-semibold uppercase tracking-widest text-flare">Demo</span>
                  </button>
                </div>
                <div className="my-6 flex items-center gap-3 text-xs text-silver">
                  <span className="h-px flex-1 bg-white/10" /> or <span className="h-px flex-1 bg-white/10" />
                </div>
                <Link href="/book" className="btn btn-primary w-full">
                  <CalendarHeart className="size-4" aria-hidden /> Book as a guest
                </Link>
                <p className="mt-6 flex items-start gap-2 text-xs leading-relaxed text-silver">
                  <ShieldCheck className="mt-0.5 size-4 shrink-0" aria-hidden /> Demo sign-in: no password is asked for and nothing leaves your browser. At launch this connects to secure Google, Apple and email sign-in, and each account only sees its own side.
                </p>
              </motion.div>
            )}

            {step === "auth" && (
              <motion.div key="auth" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid place-items-center py-16 text-center" role="status">
                <div className="relative grid size-20 place-items-center rounded-full border border-white/15">
                  <Loader2 className="size-8 animate-spin text-flare" aria-hidden />
                  <KeyRound className="absolute size-4 text-mist" aria-hidden />
                </div>
                <p className="display mt-6 text-3xl text-bone">Signing you in…</p>
                <p className="mt-1 text-sm text-silver">Verifying with {provider} (demo)</p>
              </motion.div>
            )}

            {step === "role" && (
              <motion.div key="role" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                <p className="eyebrow text-flare">Signed in with {provider}</p>
                <h2 className="display mt-2 text-5xl text-bone">Where to?</h2>
                <p className="mt-2 text-sm text-mist/75">For the demo you can open every side. At launch, the account decides which one you see.</p>
                <div className="mt-8 grid gap-3">
                  <RoleCard
                    icon={UserRound}
                    title="Client"
                    sub="Book, reschedule, Image Journey & rewards"
                    foot="Demo client “Aaliyah B.”"
                    onClick={() => {
                      signIn("client", provider);
                      router.push("/portal/client");
                    }}
                  />
                  <RoleCard
                    icon={Crown}
                    title="Owner — Kayla"
                    sub="Every stylist’s calendar, clients, finances & settings"
                    foot="Owner sees everything"
                    onClick={() => {
                      signIn("owner", provider);
                      router.push("/portal/studio");
                    }}
                  />
                  <div className="rounded-3xl border border-white/12 bg-onyx p-5">
                    <div className="flex items-center gap-3">
                      <span className="grid size-11 place-items-center rounded-2xl bg-red/10 text-flare">
                        <Scissors className="size-5" aria-hidden />
                      </span>
                      <div>
                        <p className="text-lg text-bone">Stylist</p>
                        <p className="text-sm text-silver">Only your own calendar, clients & earnings</p>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-2">
                      {STAFF.filter((s) => s.key !== "kayla").map((s) => (
                        <button
                          key={s.key}
                          onClick={() => {
                            signIn("stylist", provider, s.key as StaffKey);
                            router.push("/portal/studio");
                          }}
                          className="min-h-11 rounded-xl border border-white/12 text-sm text-bone transition hover:border-flare"
                        >
                          {s.short}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function RoleCard({ icon: Icon, title, sub, foot, onClick }: { icon: React.ComponentType<{ className?: string }>; title: string; sub: string; foot: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="group rounded-3xl border border-white/12 bg-gradient-to-br from-graphite to-onyx p-5 text-left transition hover:border-flare">
      <div className="flex items-center gap-3">
        <span className="grid size-11 place-items-center rounded-2xl bg-red/10 text-flare">
          <Icon className="size-5" aria-hidden />
        </span>
        <div>
          <p className="text-lg text-bone">{title}</p>
          <p className="text-sm text-silver">{sub}</p>
        </div>
        <ArrowRight className="ml-auto size-5 text-flare transition group-hover:translate-x-1" aria-hidden />
      </div>
      <p className="mt-3 text-xs text-silver">{foot}</p>
    </button>
  );
}
