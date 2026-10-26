"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CalendarCheck, CalendarPlus, Check, ChevronLeft, ChevronRight, Clock, CreditCard, Info, Loader2, Lock, MapPin, Search, Sparkles, UserRound } from "lucide-react";
import { CATEGORIES, SERVICE_BY_ID, fmtDuration, fmtPrice, type CategoryKey, type StaffKey } from "@/lib/services";
import { TEAM_BY_KEY } from "@/lib/content";
import { SITE } from "@/lib/site";
import {
  ADDONS_FOR,
  STAFF_BY_KEY,
  addDays,
  createBooking,
  dayStatus,
  db,
  demoCharge,
  depositFor,
  liveServices,
  slotsFor,
  startOfDay,
  staffFor,
  useDB,
  ymd,
  type Slot,
} from "@/lib/portal/db";
import { fmtDate, icsFor, money } from "./ui";
import { cn } from "@/lib/cn";

const STEPS = ["Service", "Extras", "Stylist", "Date & time", "Confirm"] as const;

function readDeepLink(): { step: number; cat: CategoryKey; serviceId: string | null; staff: StaffKey | "any" } {
  const out = { step: 0, cat: "braids" as CategoryKey, serviceId: null as string | null, staff: "any" as StaffKey | "any" };
  if (typeof window === "undefined") return out;
  const p = new URLSearchParams(window.location.search);
  const sid = p.get("service");
  const sk = p.get("stylist") as StaffKey | null;
  if (sk && STAFF_BY_KEY[sk]) {
    out.staff = sk;
    out.cat = STAFF_BY_KEY[sk].categories[0];
  }
  if (sid && SERVICE_BY_ID[sid]) {
    const s = SERVICE_BY_ID[sid];
    out.serviceId = sid;
    out.cat = s.category;
    out.step = (ADDONS_FOR[s.category] ?? []).filter((id) => id !== sid).length ? 1 : 2;
  }
  return out;
}

export function Booker() {
  const session = useDB((s) => s.session);
  const settings = useDB((s) => s.settings);
  const appts = useDB((s) => s.appts); // re-render availability when bookings change

  const [step, setStep] = useState(0);
  const [cat, setCat] = useState<CategoryKey>("braids");
  const [q, setQ] = useState("");
  const [serviceId, setServiceId] = useState<string | null>(null);
  const [addOns, setAddOns] = useState<string[]>([]);
  const [staff, setStaff] = useState<StaffKey | "any">("any");
  // Deep links: /book?service=knotless-braids&stylist=alcion. Applied once after hydration so the
  // server-rendered first step (fast first paint) always matches the client's first render.
  useEffect(() => {
    const init = readDeepLink();
    if (init.serviceId || init.staff !== "any") {
      /* eslint-disable react-hooks/set-state-in-effect */
      setStep(init.step);
      setCat(init.cat);
      setServiceId(init.serviceId);
      setStaff(init.staff);
      /* eslint-enable react-hooks/set-state-in-effect */
    }
  }, []);
  const [dayOffset, setDayOffset] = useState(0);
  const [day, setDay] = useState<Date | null>(null);
  const [slot, setSlot] = useState<Slot | null>(null);
  const [form, setForm] = useState(() => {
    // Prefill when a client is signed in (demo store lives in memory on the client).
    const st = typeof window === "undefined" ? null : db.get();
    const c = st?.session.role === "client" ? st.clients.find((x) => x.id === st.session.clientId) : undefined;
    return { first: c?.first ?? "", last: c?.last ?? "", phone: c?.phone ?? "", email: c?.email ?? "", note: "", photo: true, agree: false };
  });
  const [paying, setPaying] = useState(false);
  const [done, setDone] = useState<null | { id: string; code: string }>(null);

  const services = useMemo(() => liveServices().filter((s) => s.active), [settings]); // eslint-disable-line react-hooks/exhaustive-deps
  const svc = serviceId ? services.find((s) => s.id === serviceId) ?? null : null;
  const addOnList = useMemo(() => (svc ? (ADDONS_FOR[svc.category] ?? []).filter((id) => id !== svc.id).map((id) => SERVICE_BY_ID[id]) : []), [svc]);
  const eligible = useMemo(() => (svc ? staffFor(svc.category).map((s) => s.key) : []), [svc]);
  const staffOk = staff === "any" || eligible.includes(staff);

  const minutes = (svc?.minutes ?? 0) + addOns.reduce((n, id) => n + SERVICE_BY_ID[id].minutes, 0);
  const price = (svc?.price ?? 0) + addOns.reduce((n, id) => n + (SERVICE_BY_ID[id].price ?? 0), 0);
  const fromish = !!svc && (svc.priceType !== "fixed" || addOns.some((id) => SERVICE_BY_ID[id].priceType !== "fixed"));
  const deposit = svc ? depositFor(svc, settings) : 0;

  const today = useMemo(() => startOfDay(new Date()), []);
  const days = useMemo(() => Array.from({ length: 14 }, (_, i) => addDays(today, dayOffset + i)), [today, dayOffset]);
  const maxOffset = settings.windowWeeks * 7 - 14;

  const slots = useMemo(() => (svc && day ? slotsFor(day, minutes, staffOk ? staff : "any", eligible) : []), [svc, day, minutes, staff, staffOk, eligible, appts]); // eslint-disable-line react-hooks/exhaustive-deps
  const dayHasSlots = useMemo(() => {
    const m = new Map<string, number>();
    if (!svc) return m;
    days.forEach((d) => m.set(ymd(d), slotsFor(d, minutes, staffOk ? staff : "any", eligible).length));
    return m;
  }, [days, svc, minutes, staff, staffOk, eligible, appts]); // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = services.filter((s) => (q ? `${s.name} ${s.desc ?? ""}`.toLowerCase().includes(q.toLowerCase()) : s.category === cat) && !(s.addOn && !q));
  const canNext = [!!svc, true, !!svc && staffOk, !!slot, !!form.first && !!form.email && !!form.phone && form.agree][step];
  const assigned = slot ? STAFF_BY_KEY[slot.staff] : staff !== "any" ? STAFF_BY_KEY[staff] : null;

  const goto = (n: number) => {
    setStep(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const next = () => {
    if (step === 0 && addOnList.length === 0) return goto(2);
    goto(Math.min(4, step + 1));
  };
  const back = () => {
    if (step === 2 && addOnList.length === 0) return goto(0);
    goto(Math.max(0, step - 1));
  };

  async function pay() {
    if (!svc || !slot) return;
    setPaying(true);
    await demoCharge(deposit);
    const a = createBooking({
      serviceId: svc.id,
      addOnIds: addOns,
      staff: slot.staff,
      start: slot.start,
      client: { first: form.first.trim(), last: form.last.trim(), phone: form.phone.trim(), email: form.email.trim() },
      note: form.note.trim() || undefined,
      photoConsent: form.photo,
    });
    setPaying(false);
    setDone({ id: a.id, code: `IAI-${a.id.split("_")[1].toUpperCase()}` });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (done && svc && slot)
    return (
      <Confirmation
        code={done.code}
        svcName={svc.name}
        addOns={addOns.map((id) => SERVICE_BY_ID[id].name)}
        stylist={STAFF_BY_KEY[slot.staff].name}
        start={slot.start}
        minutes={minutes}
        price={price}
        fromish={fromish}
        deposit={deposit}
        longDay={!!slot.longDay}
        signedIn={session.role === "client"}
      />
    );

  const summary = (
    <Summary
      svcName={svc?.name}
      addOns={addOns.map((id) => SERVICE_BY_ID[id])}
      stylist={assigned?.name ?? (svc ? "Any available stylist" : undefined)}
      when={slot ? `${fmtDate(slot.start, { weekday: "long", month: "short", day: "numeric" })} · ${slot.label}` : undefined}
      minutes={minutes}
      price={price}
      fromish={fromish}
      deposit={deposit}
      hasSvc={!!svc}
      consult={svc?.priceType === "consult" || svc?.priceType === "varies"}
    />
  );

  return (
    <div className="wrap grid gap-8 pb-40 pt-6 lg:grid-cols-[1fr_22rem] lg:pb-20 lg:pt-10">
      <div className="min-w-0">
        {/* progress */}
        <ol data-tour="b-steps" className="flex items-center gap-1.5" aria-label="Booking steps">
          {STEPS.map((s, i) => (
            <li key={s} className="flex-1">
              <button
                onClick={() => i < step && goto(i)}
                disabled={i >= step}
                className="group w-full py-4 text-left disabled:cursor-default sm:py-2"
                aria-current={i === step ? "step" : undefined}
                aria-label={`Step ${i + 1}: ${s}${i < step ? " (go back)" : ""}`}
              >
                <span className={cn("block h-1 rounded-full transition-colors", i <= step ? "bg-red" : "bg-white/10")} />
                <span className={cn("mt-2 hidden text-xs sm:block", i === step ? "text-bone" : i < step ? "text-mist/80 group-hover:text-paper" : "text-silver/70")}>
                  {i + 1}. {s}
                </span>
              </button>
            </li>
          ))}
        </ol>
        <p className="mt-3 text-xs text-silver sm:hidden">
          Step {step + 1} of 5 · {STEPS[step]}
        </p>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={step} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="mt-8">
            {step === 0 && (
              <section aria-labelledby="h-svc">
                <h1 id="h-svc" className="display text-4xl text-bone sm:text-5xl">
                  What are we doing <span className="script text-[1.2em] text-flare">today?</span>
                </h1>
                <label className="relative mt-6 flex items-center">
                  <Search className="pointer-events-none absolute left-4 size-4 text-silver" aria-hidden />
                  <span className="sr-only">Search services</span>
                  <input value={q} onChange={(e) => setQ(e.target.value)} type="search" placeholder="Search all services" className="h-12 w-full rounded-full border border-white/12 bg-onyx pl-11 pr-4 text-bone placeholder:text-silver/70 focus:border-flare focus:outline-none" />
                </label>
                {!q && (
                  <div className="no-scrollbar -mx-5 mt-4 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0" role="group" aria-label="Category">
                    {CATEGORIES.map((c) => (
                      <button key={c.key} onClick={() => setCat(c.key)} aria-pressed={cat === c.key} className={cn("min-h-11 shrink-0 rounded-full border px-4 text-sm transition", cat === c.key ? "border-red bg-crimson text-paper" : "border-white/12 text-mist/85 hover:border-white/30")}>
                        {c.short}
                      </button>
                    ))}
                  </div>
                )}
                <div data-tour="b-services" className="mt-6 grid gap-2" role="radiogroup" aria-label="Services">
                  {filtered.map((s) => {
                    const on = serviceId === s.id;
                    return (
                      <div key={s.id}>
                        <button
                          role="radio"
                          aria-checked={on}
                          onClick={() => {
                            setServiceId(s.id);
                            setAddOns([]);
                            setSlot(null);
                          }}
                          className={cn("flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition", on ? "border-red bg-red/10" : "border-white/[0.08] bg-onyx hover:border-white/25")}
                        >
                          <span className={cn("grid size-6 shrink-0 place-items-center rounded-full border", on ? "border-red bg-red text-paper" : "border-white/25")}>{on && <Check className="size-3.5" aria-hidden />}</span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-bone">{s.name}</span>
                            <span className="mt-0.5 flex flex-wrap items-center gap-x-3 text-sm text-silver">
                              <span className="flex items-center gap-1">
                                <Clock className="size-3.5" aria-hidden /> {fmtDuration(s.minutes)}
                              </span>
                              {s.desc && <span className="line-clamp-1">{s.desc}</span>}
                            </span>
                          </span>
                          <span className="shrink-0 text-right tabular-nums text-bone">{fmtPrice(s)}</span>
                        </button>
                      </div>
                    );
                  })}
                  {filtered.length === 0 && <div className="rounded-2xl border border-white/[0.08] p-6 text-center text-silver">No match. Try “braids”, “color” or “fade”.</div>}
                </div>
              </section>
            )}

            {step === 1 && svc && (
              <section aria-labelledby="h-extra">
                <h1 id="h-extra" className="display text-4xl text-bone sm:text-5xl">
                  Anything <span className="script text-[1.2em] text-flare">extra?</span>
                </h1>
                <p className="mt-3 text-mist/80">Optional add-ons from the I Am Image menu for {svc.name.toLowerCase()}.</p>
                {svc.noShampoo && (
                  <p className="mt-5 flex items-start gap-3 rounded-2xl border border-red/30 bg-red/10 p-4 text-sm text-mist">
                    <Info className="mt-0.5 size-4 shrink-0 text-flare" aria-hidden /> Shampoo isn’t included with this service. Come with clean, detangled hair — or add a shampoo (recommended).
                  </p>
                )}
                <ul className="mt-6 grid gap-2">
                  {addOnList.map((a) => {
                    const on = addOns.includes(a.id);
                    return (
                      <li key={a.id}>
                        <button
                          role="checkbox"
                          aria-checked={on}
                          onClick={() => {
                            setAddOns((x) => (on ? x.filter((i) => i !== a.id) : [...x, a.id]));
                            setSlot(null);
                          }}
                          className={cn("flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition", on ? "border-red bg-red/10" : "border-white/[0.08] bg-onyx hover:border-white/25")}
                        >
                          <span className={cn("grid size-6 shrink-0 place-items-center rounded-md border", on ? "border-red bg-red text-paper" : "border-white/25")}>{on && <Check className="size-3.5" aria-hidden />}</span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-bone">
                              {a.name}
                              {a.id === "shampoo-steam" && svc.noShampoo && <span className="ml-2 rounded-full bg-red/15 px-2 py-0.5 text-[0.65rem] uppercase tracking-[0.12em] text-flare">Recommended</span>}
                            </span>
                            <span className="text-sm text-silver">
                              + {fmtDuration(a.minutes)}
                              {a.desc ? ` · ${a.desc}` : ""}
                            </span>
                          </span>
                          <span className="shrink-0 text-right tabular-nums text-bone">{a.priceType === "from" && <span className="block text-[10px] uppercase tracking-wider text-silver">from</span>}+{a.price != null ? money(a.price) : ""}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}

            {step === 2 && svc && (
              <section aria-labelledby="h-staff">
                <h1 id="h-staff" className="display text-4xl text-bone sm:text-5xl">
                  Who’s your <span className="script text-[1.2em] text-flare">stylist?</span>
                </h1>
                <div className="mt-6 grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Stylist">
                  <div>
                    <button role="radio" aria-checked={staff === "any"} onClick={() => (setStaff("any"), setSlot(null))} className={cn("flex h-full w-full items-center gap-4 rounded-2xl border p-4 text-left transition", staff === "any" ? "border-red bg-red/10" : "border-white/[0.08] bg-onyx hover:border-white/25")}>
                      <span className="grid size-14 shrink-0 place-items-center rounded-full bg-red/15 text-flare">
                        <Sparkles className="size-6" aria-hidden />
                      </span>
                      <span>
                        <span className="block text-bone">First available</span>
                        <span className="text-sm text-silver">Most open times</span>
                      </span>
                    </button>
                  </div>
                  {eligible.map((k) => {
                    const t = TEAM_BY_KEY[k];
                    const on = staff === k;
                    return (
                      <div key={k}>
                        <button role="radio" aria-checked={on} onClick={() => (setStaff(k), setSlot(null))} className={cn("flex h-full w-full items-center gap-4 rounded-2xl border p-4 text-left transition", on ? "border-red bg-red/10" : "border-white/[0.08] bg-onyx hover:border-white/25")}>
                          {t.photo ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={`${t.photo}-560.webp`} alt="" className="size-14 shrink-0 rounded-full object-cover" />
                          ) : (
                            <span className="grid size-14 shrink-0 place-items-center rounded-full border border-white/15 text-lg text-bone">{t.name[0]}</span>
                          )}
                          <span className="min-w-0">
                            <span className="block text-bone">{t.name}</span>
                            <span className="block text-sm text-silver">{t.role}</span>
                          </span>
                        </button>
                      </div>
                    );
                  })}
                </div>
                {!staffOk && <p className="mt-4 text-sm text-flare">That stylist doesn’t offer this service — choose another or “First available”.</p>}
                <p className="mt-6 text-xs text-silver">Demo: which stylist offers which service is set from the salon’s booking page and will be confirmed by the salon.</p>
              </section>
            )}

            {step === 3 && svc && (
              <section aria-labelledby="h-time">
                <h1 id="h-time" className="display text-4xl text-bone sm:text-5xl">
                  Pick your <span className="script text-[1.2em] text-flare">time.</span>
                </h1>
                <p className="mt-3 text-mist/80">Live availability for {fmtDuration(minutes)}, based on the salon’s real hours.</p>
                <div className="mt-6 flex items-center justify-between">
                  <p className="text-bone">{fmtDate(days[0], { month: "long", year: "numeric" })}</p>
                  <div className="flex gap-2">
                    <button onClick={() => setDayOffset((o) => Math.max(0, o - 7))} disabled={dayOffset === 0} className="grid size-11 place-items-center rounded-full border border-white/12 text-bone disabled:opacity-30" aria-label="Earlier dates">
                      <ChevronLeft className="size-5" />
                    </button>
                    <button onClick={() => setDayOffset((o) => Math.min(maxOffset, o + 7))} disabled={dayOffset >= maxOffset} className="grid size-11 place-items-center rounded-full border border-white/12 text-bone disabled:opacity-30" aria-label="Later dates">
                      <ChevronRight className="size-5" />
                    </button>
                  </div>
                </div>
                <div className="no-scrollbar -mx-5 mt-3 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:grid sm:grid-cols-7 sm:px-0" role="radiogroup" aria-label="Date">
                  {days.map((d) => {
                    const st = dayStatus(d, settings);
                    const n = dayHasSlots.get(ymd(d)) ?? 0;
                    const on = day && ymd(day) === ymd(d);
                    const off = !st.open || n === 0;
                    return (
                      <button
                        key={ymd(d)}
                        role="radio"
                        aria-checked={!!on}
                        disabled={off}
                        onClick={() => (setDay(d), setSlot(null))}
                        className={cn("flex min-h-20 w-16 shrink-0 flex-col items-center justify-center rounded-2xl border text-center transition sm:w-auto", on ? "border-red bg-crimson text-paper" : off ? "border-white/[0.05] text-silver/40" : "border-white/12 bg-onyx text-bone hover:border-white/30")}
                        aria-label={`${fmtDate(d, { weekday: "long", month: "long", day: "numeric" })}${off ? (st.open ? ", fully booked" : `, ${st.reason}`) : `, ${n} times`}`}
                      >
                        <span className="text-[11px] uppercase tracking-wider opacity-80">{fmtDate(d, { weekday: "short" })}</span>
                        <span className="text-xl">{d.getDate()}</span>
                        <span className="text-[10px] opacity-70">{!st.open ? "Closed" : n === 0 ? "Full" : `${n} open`}</span>
                      </button>
                    );
                  })}
                </div>
                {day && (
                  <div className="mt-6">
                    <p className="text-sm text-silver">{fmtDate(day, { weekday: "long", month: "long", day: "numeric" })}</p>
                    {slots.length ? (
                      <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5" role="radiogroup" aria-label="Time">
                        {slots.map((s) => {
                          const on = slot?.start.getTime() === s.start.getTime();
                          return (
                            <div key={s.start.getTime()}>
                              <button role="radio" aria-checked={on} onClick={() => setSlot(s)} className={cn("min-h-12 w-full rounded-xl border text-sm transition", on ? "border-red bg-crimson text-paper" : "border-white/12 bg-onyx text-bone hover:border-white/30")}>
                                {s.label}
                                {staff === "any" && <span className="block text-[10px] opacity-75">{STAFF_BY_KEY[s.staff].short}</span>}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="mt-3 text-mist/80">No openings that day. Try another date or “First available”.</p>
                    )}
                    {slot?.longDay && (
                      <p className="mt-4 flex items-start gap-3 rounded-2xl border border-white/12 bg-onyx p-4 text-sm text-mist">
                        <Info className="mt-0.5 size-4 shrink-0 text-flare" aria-hidden /> This service runs longer than one salon day ({fmtDuration(minutes)}). It starts at opening, and your stylist will confirm a second session with you.
                      </p>
                    )}
                  </div>
                )}
                {!day && <p className="mt-6 text-sm text-silver">Choose a date to see open times.</p>}
              </section>
            )}

            {step === 4 && svc && slot && (
              <section aria-labelledby="h-conf">
                <h1 id="h-conf" className="display text-4xl text-bone sm:text-5xl">
                  Almost <span className="script text-[1.2em] text-flare">yours.</span>
                </h1>
                {session.role !== "client" && (
                  <p className="mt-3 text-sm text-silver">
                    Have an account?{" "}
                    <Link href="/portal" className="text-flare hover:text-paper">
                      Sign in
                    </Link>{" "}
                    to fill this in automatically.
                  </p>
                )}
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {(
                    [
                      ["first", "First name", "given-name", "text"],
                      ["last", "Last name", "family-name", "text"],
                      ["phone", "Mobile", "tel", "tel"],
                      ["email", "Email", "email", "email"],
                    ] as const
                  ).map(([k, l, ac, type]) => (
                    <label key={k} className="text-sm text-mist/85">
                      {l}
                      <input
                        type={type}
                        autoComplete={ac}
                        required={k !== "last"}
                        value={form[k]}
                        onChange={(e) => setForm((f) => ({ ...f, [k]: e.target.value }))}
                        className="mt-1.5 h-12 w-full rounded-xl border border-white/12 bg-onyx px-4 text-bone focus:border-flare focus:outline-none"
                      />
                    </label>
                  ))}
                </div>
                <label className="mt-4 block text-sm text-mist/85">
                  Anything we should know? <span className="text-silver">(optional)</span>
                  <textarea value={form.note} onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))} rows={3} placeholder="Inspiration, hair history, length, color goals…" className="mt-1.5 w-full rounded-xl border border-white/12 bg-onyx px-4 py-3 text-bone placeholder:text-silver/60 focus:border-flare focus:outline-none" />
                </label>
                <label className="mt-4 flex items-start gap-3 text-sm text-mist/85">
                  <input type="checkbox" checked={form.photo} onChange={(e) => setForm((f) => ({ ...f, photo: e.target.checked }))} className="mt-1 size-4 accent-[#c8140e]" />
                  Add before & after photos to my Image Journey (private to me and the salon)
                </label>

                <div className="mt-8 rounded-2xl border border-white/12 bg-onyx p-5">
                  <p className="flex items-center justify-between text-bone">
                    <span className="flex items-center gap-2">
                      <CreditCard className="size-4 text-flare" aria-hidden /> Deposit due today
                    </span>
                    <span className="display text-3xl tabular-nums">{money(deposit)}</span>
                  </p>
                  <div className="mt-4 flex items-center gap-3 rounded-xl border border-dashed border-white/15 p-3 text-sm text-mist">
                    <span className="rounded-md bg-paper px-2 py-1 text-[11px] font-semibold text-char">VISA</span>
                    Demo card •••• 4242
                    <span className="demo-badge ml-auto">Demo</span>
                  </div>
                  <p className="mt-3 flex items-start gap-2 text-xs text-silver">
                    <Lock className="mt-0.5 size-3.5 shrink-0" aria-hidden /> No real card is charged in demo mode. At launch, deposits are taken securely by the salon’s payment provider. The deposit comes off your total; the balance is paid at the salon.
                  </p>
                </div>
                <label className="mt-5 flex items-start gap-3 text-sm text-mist/85">
                  <input type="checkbox" checked={form.agree} onChange={(e) => setForm((f) => ({ ...f, agree: e.target.checked }))} className="mt-1 size-4 accent-[#c8140e]" />
                  <span>
                    I understand “from” prices are confirmed by my stylist before the service, and that the salon’s deposit & cancellation policy applies.{" "}
                    <span className="needs-tag align-middle">policy to confirm</span>
                  </span>
                </label>
              </section>
            )}
          </motion.div>
        </AnimatePresence>

        {/* nav */}
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-ink/95 px-4 py-3 backdrop-blur-xl lg:static lg:mt-10 lg:border-0 lg:bg-transparent lg:p-0">
          <div className="mx-auto flex max-w-[1240px] items-center gap-3">
            <div className="min-w-0 flex-1 lg:hidden">
              {svc ? (
                <p className="truncate text-sm text-bone">
                  {fromish ? "From " : ""}
                  {money(price)}
                </p>
              ) : (
                <p className="text-sm text-silver">Choose a service</p>
              )}
              {svc && (
                <p className="truncate text-xs text-silver">
                  {fmtDuration(minutes)} · {money(deposit)} today
                </p>
              )}
            </div>
            {step > 0 && (
              <button onClick={back} className="btn btn-ghost !min-h-12 !px-4" aria-label="Back">
                <ArrowLeft className="size-4" aria-hidden />
                <span className="hidden sm:inline">Back</span>
              </button>
            )}
            {step < 4 ? (
              <button onClick={next} disabled={!canNext} className="btn btn-primary !min-h-12 disabled:cursor-not-allowed disabled:opacity-40 lg:ml-auto">
                Continue <ArrowRight className="size-4" aria-hidden />
              </button>
            ) : (
              <button onClick={pay} disabled={!canNext || paying} className="btn btn-primary !min-h-12 disabled:cursor-not-allowed disabled:opacity-40 lg:ml-auto">
                {paying ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Lock className="size-4" aria-hidden />} {paying ? "Securing…" : `Pay ${money(deposit)} & book`}
              </button>
            )}
          </div>
        </div>
      </div>

      <aside className="hidden lg:block">
        <div className="sticky top-8">{summary}</div>
      </aside>
    </div>
  );
}

function Summary(p: { svcName?: string; addOns: { id: string; name: string; price: number | null }[]; stylist?: string; when?: string; minutes: number; price: number; fromish: boolean; deposit: number; hasSvc: boolean; consult: boolean }) {
  return (
    <div data-tour="b-summary" className="card-night p-6">
      <p className="eyebrow text-silver">Your booking</p>
      {!p.hasSvc ? (
        <p className="mt-4 text-mist/80">Pick a service to see your price, time and deposit — it updates as you go.</p>
      ) : (
        <>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex gap-3">
              <Sparkles className="mt-0.5 size-4 shrink-0 text-flare" aria-hidden />
              <span className="text-bone">{p.svcName}</span>
            </li>
            {p.addOns.map((a) => (
              <li key={a.id} className="flex gap-3 pl-7 text-mist/80">
                + {a.name}
              </li>
            ))}
            <li className="flex gap-3">
              <UserRound className="mt-0.5 size-4 shrink-0 text-flare" aria-hidden />
              <span className="text-mist">{p.stylist}</span>
            </li>
            <li className="flex gap-3">
              <CalendarCheck className="mt-0.5 size-4 shrink-0 text-flare" aria-hidden />
              <span className={p.when ? "text-mist" : "text-silver"}>{p.when ?? "Date & time not chosen"}</span>
            </li>
            <li className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-flare" aria-hidden />
              <span className="text-mist">1500 NW 18th Ave, Suite 104</span>
            </li>
          </ul>
          <dl className="mt-6 space-y-2 border-t border-white/10 pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-silver">Time</dt>
              <dd className="text-bone">{fmtDuration(p.minutes)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-silver">Total</dt>
              <dd className="text-bone">{p.consult ? "After consultation" : `${p.fromish ? "From " : ""}${money(p.price)}`}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-silver">Due today (deposit)</dt>
              <dd className="text-bone">{money(p.deposit)}</dd>
            </div>
            {!p.consult && (
              <div className="flex justify-between">
                <dt className="text-silver">At the salon</dt>
                <dd className="text-bone">
                  {p.fromish ? "From " : ""}
                  {money(Math.max(0, p.price - p.deposit))}
                </dd>
              </div>
            )}
          </dl>
          <p className="mt-4 text-[11px] leading-relaxed text-silver">Deposit amounts are proposed for the demo and set by the salon at launch.</p>
        </>
      )}
    </div>
  );
}

function Confirmation(p: { code: string; svcName: string; addOns: string[]; stylist: string; start: Date; minutes: number; price: number; fromish: boolean; deposit: number; longDay: boolean; signedIn: boolean }) {
  const when = `${fmtDate(p.start, { weekday: "long", month: "long", day: "numeric" })} at ${p.start.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;
  const download = () => {
    const blob = icsFor(`${p.svcName} — I Am Image`, p.start, p.minutes, `${SITE.address.street}, ${SITE.address.city}, ${SITE.address.region} ${SITE.address.zip}`, `With ${p.stylist}. Booking ${p.code}. Questions: ${SITE.phone}`);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "i-am-image-appointment.ics";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return (
    <div className="wrap max-w-2xl pb-24 pt-10 text-center">
      <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 16 }} className="mx-auto grid size-20 place-items-center rounded-full bg-crimson text-paper shadow-[0_0_60px_rgba(249,37,5,.5)]">
        <Check className="size-9" aria-hidden />
      </motion.div>
      <h1 className="display mt-8 text-5xl text-bone sm:text-6xl">
        You’re <span className="script text-[1.2em] text-flare">booked.</span>
      </h1>
      <p className="mt-4 text-lg text-mist/90">
        {p.svcName} with {p.stylist}
        <br />
        {when}
      </p>
      {p.addOns.length > 0 && <p className="mt-1 text-sm text-silver">+ {p.addOns.join(", ")}</p>}
      <div className="card-night mx-auto mt-8 max-w-md p-6 text-left text-sm">
        <div className="flex justify-between py-1">
          <span className="text-silver">Confirmation</span>
          <span className="font-medium tracking-[0.12em] text-bone">{p.code}</span>
        </div>
        <div className="flex justify-between py-1">
          <span className="text-silver">Deposit paid (demo)</span>
          <span className="text-bone">{money(p.deposit)}</span>
        </div>
        <div className="flex justify-between py-1">
          <span className="text-silver">At the salon</span>
          <span className="text-bone">
            {p.fromish ? "From " : ""}
            {money(Math.max(0, p.price - p.deposit))}
          </span>
        </div>
        <div className="flex justify-between py-1">
          <span className="text-silver">Where</span>
          <span className="text-right text-bone">1500 NW 18th Ave, Suite 104</span>
        </div>
      </div>
      {p.longDay && <p className="mx-auto mt-4 max-w-md text-sm text-mist/80">Your stylist will reach out to confirm the second session for this service.</p>}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button onClick={download} className="btn btn-primary">
          <CalendarPlus className="size-4" aria-hidden /> Add to calendar
        </button>
        <Link href={p.signedIn ? "/portal/client" : "/portal"} className="btn btn-ghost">
          {p.signedIn ? "View in my account" : "Create my account"}
        </Link>
      </div>
      <p className="mt-8 text-sm text-silver">
        Need to change something? Call {SITE.phone} or manage it in your account.{" "}
        <Link href="/" className="text-flare hover:text-paper">
          Back to the website
        </Link>
      </p>
    </div>
  );
}
