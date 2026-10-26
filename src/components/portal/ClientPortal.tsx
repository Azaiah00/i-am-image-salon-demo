"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { CalendarClock, CalendarHeart, CalendarX, Crown, Gift, LogOut, MapPin, RotateCcw, Sparkles } from "lucide-react";
import { SERVICE_BY_ID, fmtDuration } from "@/lib/services";
import { SITE } from "@/lib/site";
import { STAFF_BY_KEY, addDays, setStatus, reschedule, signIn, signOut, slotsFor, startOfDay, tierFor, useDB, useMounted, useNow, ymd, type Appointment } from "@/lib/portal/db";
import { Drawer, Loading, PortalLogo, StatusBadge, fmtDate, fmtTime, money } from "./ui";
import { cn } from "@/lib/cn";
import { maybeStartTour } from "@/lib/portal/tour";

export function ClientPortal() {
  const mounted = useMounted();
  const router = useRouter();
  const session = useDB((s) => s.session);
  const appts = useDB((s) => s.appts);
  const clients = useDB((s) => s.clients);
  const journeyAll = useDB((s) => s.journey);
  const now = useNow();
  const [move, setMove] = useState<Appointment | null>(null);

  const me = clients.find((c) => c.id === session.clientId);
  const mine = useMemo(() => appts.filter((a) => a.clientId === session.clientId), [appts, session.clientId]);
  const upcoming = mine.filter((a) => new Date(a.start).getTime() > now && a.status !== "canceled" && a.status !== "completed");
  const past = mine.filter((a) => a.status === "completed").reverse();
  const journey = useMemo(() => journeyAll.filter((j) => j.clientId === session.clientId).sort((a, b) => b.at.localeCompare(a.at)), [journeyAll, session.clientId]);

  if (!mounted) return <Loading />;
  if (session.role !== "client" || !me)
    return (
      <div className="wrap grid min-h-[70svh] place-items-center text-center">
        <div className="max-w-md">
          <h1 className="display text-5xl text-bone">Client portal</h1>
          <p className="mt-3 text-mist/80">Sign in to see your appointments and Image Journey.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button onClick={() => (signIn("client", "Demo login"), maybeStartTour("client"))} className="btn btn-primary">
              Open as demo client
            </button>
            <Link href="/portal" className="btn btn-ghost">
              Sign in options
            </Link>
          </div>
        </div>
      </div>
    );

  const tier = tierFor(past.length);
  const spent = past.reduce((n, a) => n + a.price, 0);
  const lastSvc = past[0] ? SERVICE_BY_ID[past[0].serviceId] : null;

  return (
    <div>
      <header className="sticky top-0 z-30 border-b border-white/[0.07] bg-ink/90 backdrop-blur-xl">
        <div className="wrap flex items-center justify-between py-3">
          <PortalLogo href="/portal/client" sub="My account" />
          <button
            onClick={() => {
              signOut();
              router.push("/portal");
            }}
            className="inline-flex min-h-11 items-center gap-2 text-sm text-mist/80 hover:text-paper"
          >
            <LogOut className="size-4" aria-hidden /> Sign out
          </button>
        </div>
      </header>

      <div className="wrap pb-24 pt-10">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow text-silver">Welcome back</p>
            <h1 className="display mt-2 text-5xl text-bone sm:text-6xl">
              Hi, <span className="script text-[1.2em] text-flare">{me.first}.</span>
            </h1>
            <p className="mt-2 text-mist/80">
              Client since {fmtDate(me.since, { month: "long", year: "numeric" })} · {me.hair}
            </p>
          </div>
          <Link href="/book" data-tour="c-book" className="btn btn-primary self-start md:self-auto">
            <CalendarHeart className="size-4" aria-hidden /> Book an appointment
          </Link>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-[1.3fr_1fr]">
          {/* Upcoming */}
          <section data-tour="c-upcoming" className="card-night p-6" aria-labelledby="up-h">
            <h2 id="up-h" className="text-xl text-bone">
              Upcoming
            </h2>
            {upcoming.length === 0 ? (
              <div className="mt-4 text-mist/80">
                Nothing booked yet.{" "}
                <Link href="/book" className="text-flare hover:text-paper">
                  Book your next visit →
                </Link>
              </div>
            ) : (
              <ul className="mt-4 space-y-4">
                {upcoming.map((a) => {
                  const s = SERVICE_BY_ID[a.serviceId];
                  return (
                    <li key={a.id} className="rounded-2xl border border-white/[0.08] bg-ink/60 p-5">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="display text-3xl text-bone">{fmtDate(a.start, { weekday: "long", month: "short", day: "numeric" })}</p>
                          <p className="mt-1 text-mist/85">
                            {fmtTime(a.start)} · {s.name}
                            {a.addOnIds.length > 0 && ` + ${a.addOnIds.map((id) => SERVICE_BY_ID[id].name).join(", ")}`}
                          </p>
                          <p className="text-sm text-silver">
                            with {STAFF_BY_KEY[a.staff].name} · {fmtDuration(a.minutes)}
                          </p>
                        </div>
                        <StatusBadge s={a.status} />
                      </div>
                      <p className="mt-3 flex items-center gap-2 text-sm text-silver">
                        <MapPin className="size-4 text-flare" aria-hidden /> {SITE.address.street}
                      </p>
                      <p className="mt-1 text-sm text-silver">
                        Deposit paid {money(a.deposit)} · balance {money(Math.max(0, a.price - a.deposit))} at the salon
                      </p>
                      <div data-tour="c-manage" className="mt-4 flex flex-wrap gap-2">
                        <button onClick={() => setMove(a)} className="btn btn-ghost !min-h-11 !px-4 text-sm">
                          <CalendarClock className="size-4" aria-hidden /> Reschedule
                        </button>
                        <button onClick={() => setStatus(a.id, "canceled")} className="btn !min-h-11 !px-4 text-sm text-silver hover:text-paper">
                          <CalendarX className="size-4" aria-hidden /> Cancel
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
            {lastSvc && (
              <Link data-tour="c-again" href={`/book?service=${lastSvc.id}&stylist=${past[0].staff}`} className="mt-5 flex items-center justify-between gap-4 rounded-2xl border border-dashed border-white/15 p-4 text-sm text-mist transition hover:border-flare">
                <span className="flex items-center gap-3">
                  <RotateCcw className="size-4 text-flare" aria-hidden /> Book again: {lastSvc.name} with {STAFF_BY_KEY[past[0].staff].short}
                </span>
                <span className="text-flare">→</span>
              </Link>
            )}
          </section>

          {/* Rewards */}
          <section data-tour="c-club" className="relative overflow-hidden rounded-[var(--radius-card)] bg-crimson p-6 text-paper" aria-labelledby="club-h">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img width={570} height={570} src="/media/brand/spiral.svg" alt="" aria-hidden className="pointer-events-none absolute -right-10 -top-10 size-56 opacity-25 mix-blend-screen" />
            <p className="eyebrow flex items-center gap-2 text-paper">
              <Crown className="size-4" aria-hidden /> Image Club <span className="demo-badge !bg-ink">Demo</span>
            </p>
            <h2 id="club-h" className="display mt-3 text-5xl">
              {tier.name}
            </h2>
            <p className="mt-2 text-paper">{tier.perk}</p>
            {tier.next && (
              <>
                <div className="mt-5 h-2 overflow-hidden rounded-full bg-ink/30">
                  <div className="h-full rounded-full bg-paper" style={{ width: `${Math.min(100, (past.length / tier.next) * 100)}%` }} />
                </div>
                <p className="mt-2 text-sm text-paper">
                  {past.length} of {tier.next} visits to the next tier
                </p>
              </>
            )}
            <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-2xl bg-ink/25 p-3">
                <p className="text-paper">Visits</p>
                <p className="display text-3xl">{past.length}</p>
              </div>
              <div className="rounded-2xl bg-ink/25 p-3">
                <p className="text-paper">Invested in your hair</p>
                <p className="display text-3xl">{money(spent)}</p>
              </div>
            </div>
            <p className="mt-4 flex items-center gap-2 text-xs text-paper">
              <Gift className="size-4" aria-hidden /> Loyalty rules are a proposal for the salon to confirm.
            </p>
          </section>
        </div>

        {/* Image Journey */}
        <section data-tour="c-journey" className="mt-10" aria-labelledby="journey-h">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow flex items-center gap-2 text-silver">
                <Sparkles className="size-4 text-flare" aria-hidden /> Your Image Journey
              </p>
              <h2 id="journey-h" className="display mt-2 text-4xl text-bone">
                Every visit, every <span className="script text-[1.2em] text-flare">change.</span>
              </h2>
              <p className="mt-2 max-w-xl text-mist/80">Photos and care notes from your stylist after each appointment — the same timeline your stylist sees, so every visit builds on the last.</p>
            </div>
          </div>
          <ol className="relative mt-8 space-y-6 border-l border-red/40 pl-6 sm:pl-8">
            {journey.map((j) => (
              <li key={j.id} className="relative">
                <span aria-hidden className="absolute -left-[31px] top-2 size-3 rounded-full bg-red ring-4 ring-ink sm:-left-[39px]" />
                <div className="card-night grid gap-5 overflow-hidden p-4 sm:grid-cols-[11rem_1fr] sm:p-5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`${j.photo}-640.webp`} alt={`${j.title} — photo from ${fmtDate(j.at)}`} className="aspect-[4/5] w-full rounded-xl object-cover sm:w-44" loading="lazy" />
                  <div>
                    <p className="text-sm text-silver">
                      {fmtDate(j.at, { month: "long", day: "numeric", year: "numeric" })} · with {STAFF_BY_KEY[j.staff].name}
                    </p>
                    <p className="mt-1 text-2xl text-bone">{j.title}</p>
                    <p className="mt-2 leading-relaxed text-mist/85">{j.note}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-xs text-silver">Demo photos are real I Am Image client work used as placeholders for a fictional client.</p>
        </section>

        {/* History */}
        <section data-tour="c-history" className="card-night mt-10 p-6" aria-labelledby="hist-h">
          <h2 id="hist-h" className="text-xl text-bone">
            Visit history
          </h2>
          <ul className="mt-4 divide-y divide-white/[0.07]">
            {past.map((a) => (
              <li key={a.id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
                <span className="text-bone">{SERVICE_BY_ID[a.serviceId].name}</span>
                <span className="text-silver">
                  {fmtDate(a.start, { month: "short", day: "numeric", year: "numeric" })} · {STAFF_BY_KEY[a.staff].short}
                </span>
                <span className="tabular-nums text-mist">{money(a.price)}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <RescheduleDrawer appt={move} onClose={() => setMove(null)} />
    </div>
  );
}

export function RescheduleDrawer({ appt, onClose }: { appt: Appointment | null; onClose: () => void }) {
  const [day, setDay] = useState<Date | null>(null);
  const appts = useDB((s) => s.appts);
  const today = useMemo(() => startOfDay(new Date()), []);
  const days = useMemo(() => Array.from({ length: 21 }, (_, i) => addDays(today, i + 1)), [today]);
  const slots = useMemo(() => (appt && day ? slotsFor(day, appt.minutes, appt.staff, [appt.staff], appt.id) : []), [appt, day, appts]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <Drawer open={!!appt} onClose={() => (setDay(null), onClose())} title="Reschedule">
      {appt && (
        <div>
          <p className="text-mist/85">
            {SERVICE_BY_ID[appt.serviceId].name} with {STAFF_BY_KEY[appt.staff].name}. Your deposit carries over.
          </p>
          <div className="mt-5 grid grid-cols-4 gap-2 sm:grid-cols-5">
            {days.map((d) => {
              const n = slotsFor(d, appt.minutes, appt.staff, [appt.staff], appt.id).length;
              const on = day && ymd(day) === ymd(d);
              return (
                <button key={ymd(d)} disabled={!n} onClick={() => setDay(d)} className={cn("min-h-16 rounded-xl border text-center text-sm transition", on ? "border-red bg-crimson text-paper" : n ? "border-white/12 text-bone hover:border-white/30" : "border-white/[0.05] text-silver/40")}>
                  <span className="block text-[10px] uppercase">{fmtDate(d, { weekday: "short" })}</span>
                  {d.getDate()}
                </button>
              );
            })}
          </div>
          {day && (
            <ul className="mt-5 grid grid-cols-3 gap-2">
              {slots.map((s) => (
                <li key={s.start.getTime()}>
                  <button
                    onClick={() => {
                      reschedule(appt.id, s.start);
                      setDay(null);
                      onClose();
                    }}
                    className="min-h-11 w-full rounded-xl border border-white/12 text-sm text-bone hover:border-flare"
                  >
                    {s.label}
                  </button>
                </li>
              ))}
              {slots.length === 0 && <li className="col-span-3 text-sm text-silver">No times left that day.</li>}
            </ul>
          )}
        </div>
      )}
    </Drawer>
  );
}
