"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AlertCircle, Ban, CalendarDays, CalendarPlus, CheckCircle2, ChevronLeft, ChevronRight, Clock, DollarSign, ImagePlus, Search, TrendingUp, UserCheck, Users } from "lucide-react";
import { CATEGORIES, CATEGORY_BY_KEY, SERVICES, SERVICE_BY_ID, fmtDuration, fmtPrice, type StaffKey } from "@/lib/services";
import { WORK } from "@/lib/content";
import {
  STAFF,
  STAFF_BY_KEY,
  addBlock,
  addDays,
  addJourney,
  atTime,
  clientName,
  depositFor,
  liveService,
  overrideService,
  removeBlock,
  scopeOf,
  setStatus,
  startOfDay,
  totals,
  updateClient,
  updateSettings,
  useDB,
  useNow,
  ymd,
  type Appointment,
  type ApptStatus,
  type PayMethod,
} from "@/lib/portal/db";
import { Bars, Drawer, Panel, Stat, StatusBadge, fmtDate, fmtTime, money } from "./ui";
import { PageHead } from "./StudioShell";
import { RescheduleDrawer } from "./ClientPortal";
import { cn } from "@/lib/cn";

function useScope() {
  const session = useDB((s) => s.session);
  return { scope: scopeOf(session), isOwner: session.role === "owner", session };
}
const inScope = (scope: StaffKey | "all", k: StaffKey) => scope === "all" || scope === k;

// ============================================================ appointment drawer
function ApptDrawer({ id, onClose }: { id: string | null; onClose: () => void }) {
  const appts = useDB((s) => s.appts);
  const clients = useDB((s) => s.clients);
  const [move, setMove] = useState<Appointment | null>(null);
  const a = appts.find((x) => x.id === id) ?? null;
  const c = a ? clients.find((x) => x.id === a.clientId) : undefined;
  const svc = a ? SERVICE_BY_ID[a.serviceId] : null;
  const act = (s: ApptStatus, m?: PayMethod) => a && setStatus(a.id, s, m);
  return (
    <>
      <Drawer open={!!a && !move} onClose={onClose} title="Appointment">
        {a && svc && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between gap-3">
                <p className="text-2xl text-bone">{svc.name}</p>
                <StatusBadge s={a.status} />
              </div>
              {a.addOnIds.length > 0 && <p className="text-sm text-silver">+ {a.addOnIds.map((x) => SERVICE_BY_ID[x].name).join(", ")}</p>}
              <p className="mt-2 text-mist/85">
                {fmtDate(a.start, { weekday: "long", month: "long", day: "numeric" })} · {fmtTime(a.start)} · {fmtDuration(a.minutes)}
              </p>
              <p className="text-sm text-silver">with {STAFF_BY_KEY[a.staff].name}</p>
            </div>
            <dl className="grid grid-cols-3 gap-3 text-sm">
              <div className="rounded-xl bg-ink/60 p-3">
                <dt className="text-silver">Total</dt>
                <dd className="text-lg text-bone">{money(a.price)}</dd>
              </div>
              <div className="rounded-xl bg-ink/60 p-3">
                <dt className="text-silver">Deposit</dt>
                <dd className="text-lg text-bone">{money(a.deposit)}</dd>
              </div>
              <div className="rounded-xl bg-ink/60 p-3">
                <dt className="text-silver">Balance</dt>
                <dd className="text-lg text-bone">{a.status === "completed" ? "Paid" : money(Math.max(0, a.price - a.deposit))}</dd>
              </div>
            </dl>
            {c && (
              <div className="rounded-2xl border border-white/10 p-4">
                <p className="text-bone">{clientName(c)}</p>
                <p className="text-sm text-silver">
                  {c.phone} · {c.email}
                </p>
                <p className="mt-2 text-sm text-mist/85">Hair: {c.hair}</p>
                {c.notes && <p className="mt-1 text-sm text-mist/85">Notes: {c.notes}</p>}
                {a.note && <p className="mt-1 text-sm text-mist/85">Booking note: {a.note}</p>}
              </div>
            )}
            <div className="grid grid-cols-2 gap-2">
              {a.status !== "checked-in" && a.status !== "completed" && (
                <button onClick={() => act("checked-in")} className="btn btn-ghost !min-h-11 text-sm">
                  <UserCheck className="size-4" aria-hidden /> Check in
                </button>
              )}
              {a.status !== "completed" && (
                <button onClick={() => act("completed", "Card")} className="btn btn-primary !min-h-11 text-sm">
                  <CheckCircle2 className="size-4" aria-hidden /> Checkout
                </button>
              )}
              {a.status !== "completed" && (
                <button onClick={() => setMove(a)} className="btn btn-ghost !min-h-11 text-sm">
                  <CalendarDays className="size-4" aria-hidden /> Reschedule
                </button>
              )}
              {a.status !== "completed" && a.status !== "no-show" && (
                <button onClick={() => act("no-show")} className="btn btn-ghost !min-h-11 text-sm">
                  <Ban className="size-4" aria-hidden /> No-show
                </button>
              )}
              {a.status !== "canceled" && a.status !== "completed" && (
                <button onClick={() => act("canceled")} className="btn !min-h-11 text-sm text-silver hover:text-paper">
                  Cancel
                </button>
              )}
            </div>
            <p className="text-xs text-silver">Demo actions update this session only. Checkout records the balance on the demo card.</p>
          </div>
        )}
      </Drawer>
      <RescheduleDrawer appt={move} onClose={() => setMove(null)} />
    </>
  );
}

// ============================================================ overview
export function Overview() {
  const { scope, isOwner } = useScope();
  const appts = useDB((s) => s.appts);
  const payments = useDB((s) => s.payments);
  const clients = useDB((s) => s.clients);
  const now = useNow();
  const [open, setOpen] = useState<string | null>(null);
  const today = startOfDay(new Date(now));
  const staffKey = scope === "all" ? undefined : scope;

  const todays = useMemo(() => appts.filter((a) => ymd(new Date(a.start)) === ymd(today) && inScope(scope, a.staff) && a.status !== "canceled"), [appts, scope, today]);
  const week = totals(appts, payments, addDays(today, -6), addDays(today, 1), staffKey);
  const prev = totals(appts, payments, addDays(today, -13), addDays(today, -6), staffKey);
  const month = totals(appts, payments, addDays(today, -29), addDays(today, 1), staffKey);
  const upcoming = appts.filter((a) => new Date(a.start).getTime() > now && inScope(scope, a.staff) && (a.status === "confirmed" || a.status === "booked"));
  const needs = upcoming.filter((a) => a.status === "booked").slice(0, 5);
  const daily = Array.from({ length: 14 }, (_, i) => {
    const d = addDays(today, i - 13);
    const t = totals(appts, payments, d, addDays(d, 1), staffKey);
    return { label: fmtDate(d, { weekday: "narrow" }), value: t.revenue };
  });
  const change = prev.revenue ? Math.round(((week.revenue - prev.revenue) / prev.revenue) * 100) : 0;
  const title = scope === "all" ? "Good day, Kayla." : isOwner ? `${STAFF_BY_KEY[scope].name}’s day` : `Hi, ${STAFF_BY_KEY[scope].short}.`;

  return (
    <div>
      <PageHead title={title} sub={`${fmtDate(today, { weekday: "long", month: "long", day: "numeric" })} · ${scope === "all" ? "whole salon" : "your book only"}`} action={<Link href="/portal/studio/calendar" className="btn btn-primary">Open calendar</Link>} />
      <div data-tour="s-stats" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Today" value={String(todays.length)} sub="appointments" icon={CalendarDays} />
        <Stat label="Last 7 days" value={money(Math.round(week.revenue))} sub={<span className={change >= 0 ? "text-ok" : "text-flare"}>{change >= 0 ? "+" : ""}{change}% vs prior week</span>} icon={DollarSign} />
        <Stat label="Avg ticket (30d)" value={money(Math.round(month.avg))} sub={`${month.done} completed`} icon={TrendingUp} />
        <Stat label="No-shows (30d)" value={String(month.noShow)} sub={`${month.appts ? Math.round((month.noShow / month.appts) * 100) : 0}% of bookings`} icon={AlertCircle} />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.25fr_1fr]">
        <Panel tour="s-today" title="Today’s chair" action={<span className="text-sm text-silver">{todays.length} booked</span>}>
          {todays.length === 0 ? (
            <p className="text-mist/80">No appointments today{today.getDay() === 0 || today.getDay() === 3 ? " — the salon is closed." : "."}</p>
          ) : (
            <ul className="divide-y divide-white/[0.06]">
              {todays.map((a) => {
                const c = clients.find((x) => x.id === a.clientId);
                return (
                  <li key={a.id}>
                    <button onClick={() => setOpen(a.id)} className="flex w-full items-center gap-4 py-3 text-left hover:bg-white/[0.02]">
                      <span className="w-16 shrink-0 text-sm tabular-nums text-silver">{fmtTime(a.start)}</span>
                      <span className="h-9 w-1 shrink-0 rounded-full" style={{ background: STAFF_BY_KEY[a.staff].color }} aria-hidden />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-bone">{clientName(c)}</span>
                        <span className="block truncate text-sm text-silver">
                          {SERVICE_BY_ID[a.serviceId].name}
                          {scope === "all" ? ` · ${STAFF_BY_KEY[a.staff].short}` : ""}
                        </span>
                      </span>
                      <StatusBadge s={a.status} />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </Panel>
        <Panel tour="s-revenue" title="Revenue · last 14 days">
          <Bars data={daily} />
          <p className="mt-3 text-xs text-silver">Deposits + balances collected (demo data).</p>
        </Panel>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Panel tour="s-confirm" title="Needs confirmation" action={<span className="text-sm text-silver">{needs.length}</span>}>
          {needs.length === 0 ? (
            <p className="text-mist/80">All upcoming bookings are confirmed.</p>
          ) : (
            <ul className="space-y-2">
              {needs.map((a) => (
                <li key={a.id} className="flex items-center justify-between gap-3 rounded-xl bg-ink/50 px-3 py-2 text-sm">
                  <span className="min-w-0 truncate text-mist">
                    {fmtDate(a.start)} {fmtTime(a.start)} · {SERVICE_BY_ID[a.serviceId].name}
                  </span>
                  <button onClick={() => setStatus(a.id, "confirmed")} className="min-h-11 shrink-0 rounded-full border border-white/12 px-4 text-sm text-bone hover:border-flare sm:min-h-9 sm:text-xs">
                    Confirm
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Panel>
        <Panel title="Coming up" action={<Link href="/portal/studio/appointments" className="inline-flex min-h-11 items-center text-sm text-flare hover:text-paper">All →</Link>}>
          <ul className="space-y-2">
            {upcoming.slice(0, 6).map((a) => (
              <li key={a.id}>
                <button onClick={() => setOpen(a.id)} className="flex w-full items-center justify-between gap-3 rounded-xl px-2 py-2 text-left text-sm hover:bg-white/[0.03]">
                  <span className="min-w-0 truncate text-mist">
                    <span className="text-bone">{fmtDate(a.start)}</span> · {fmtTime(a.start)} · {SERVICE_BY_ID[a.serviceId].name}
                  </span>
                  <span className="shrink-0 text-silver">{STAFF_BY_KEY[a.staff].short}</span>
                </button>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
      <ApptDrawer id={open} onClose={() => setOpen(null)} />
    </div>
  );
}

// ============================================================ calendar (day view, a column per stylist)
export function CalendarView() {
  const { scope, isOwner, session } = useScope();
  const appts = useDB((s) => s.appts);
  const blocks = useDB((s) => s.blocks);
  const clients = useDB((s) => s.clients);
  const settings = useDB((s) => s.settings);
  const [day, setDay] = useState(() => startOfDay(new Date()));
  const [open, setOpen] = useState<string | null>(null);
  const cols = STAFF.filter((s) => inScope(scope, s.key));
  const h = settings.hours[day.getDay()];
  const startH = 8;
  const endH = 21;
  const pxPerMin = 1.1;
  const top = (iso: string) => (new Date(iso).getHours() * 60 + new Date(iso).getMinutes() - startH * 60) * pxPerMin;

  const block = () => {
    const k: StaffKey = session.role === "stylist" ? session.staff! : scope === "all" ? "kayla" : scope;
    addBlock(k, atTime(day, h.open ?? "12:00"), 60, "Lunch / personal");
  };

  return (
    <div>
      <PageHead
        title="Calendar"
        sub={scope === "all" ? "Every stylist, side by side" : `${STAFF_BY_KEY[scope].name}’s book`}
        action={
          <button data-tour="s-block" onClick={block} disabled={!h.open} className="btn btn-ghost disabled:opacity-40">
            <CalendarPlus className="size-4" aria-hidden /> Block an hour
          </button>
        }
      />
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button onClick={() => setDay((d) => addDays(d, -1))} className="grid size-11 place-items-center rounded-full border border-white/12 text-bone" aria-label="Previous day">
          <ChevronLeft className="size-5" />
        </button>
        <button onClick={() => setDay(startOfDay(new Date()))} className="min-h-11 rounded-full border border-white/12 px-4 text-sm text-bone">
          Today
        </button>
        <button onClick={() => setDay((d) => addDays(d, 1))} className="grid size-11 place-items-center rounded-full border border-white/12 text-bone" aria-label="Next day">
          <ChevronRight className="size-5" />
        </button>
        <p className="ml-2 text-lg text-bone">{fmtDate(day, { weekday: "long", month: "long", day: "numeric" })}</p>
        {!h.open && <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-silver">Salon closed</span>}
      </div>
      {cols.length > 1 && <p className="mb-2 text-xs text-silver md:hidden">Swipe sideways to see every stylist →</p>}
      <div data-tour="s-calendar" className="card-night overflow-x-auto">
        <div className="grid min-w-[640px]" style={{ gridTemplateColumns: `4rem repeat(${cols.length}, minmax(10rem,1fr))` }}>
          <div className="sticky left-0 z-10 border-b border-white/10 bg-onyx" />
          {cols.map((c) => (
            <div key={c.key} className="flex items-center gap-2 border-b border-l border-white/10 px-3 py-3 text-sm text-bone">
              <span className="size-2.5 rounded-full" style={{ background: c.color }} aria-hidden /> {c.name}
            </div>
          ))}
          <div className="relative border-r border-white/5" style={{ height: (endH - startH) * 60 * pxPerMin }}>
            {Array.from({ length: endH - startH }, (_, i) => (
              <span key={i} className="absolute right-2 text-[10px] text-silver" style={{ top: i * 60 * pxPerMin + 3 }}>
                {((startH + i) % 12 || 12) + (startH + i < 12 ? "a" : "p")}
              </span>
            ))}
          </div>
          {cols.map((c) => {
            const list = appts.filter((a) => a.staff === c.key && ymd(new Date(a.start)) === ymd(day) && a.status !== "canceled");
            const bl = blocks.filter((b) => b.staff === c.key && ymd(new Date(b.start)) === ymd(day));
            return (
              <div key={c.key} className="relative border-l border-white/10" style={{ height: (endH - startH) * 60 * pxPerMin }}>
                {Array.from({ length: endH - startH }, (_, i) => (
                  <span key={i} className="absolute inset-x-0 border-t border-white/[0.05]" style={{ top: i * 60 * pxPerMin }} aria-hidden />
                ))}
                {h.open && (
                  <>
                    <span className="absolute inset-x-0 top-0 bg-ink/60" style={{ height: top(atTime(day, h.open).toISOString()) }} aria-hidden />
                    <span className="absolute inset-x-0 bottom-0 bg-ink/60" style={{ top: top(atTime(day, h.close!).toISOString()) }} aria-hidden />
                  </>
                )}
                {bl.map((b) => (
                  <button key={b.id} onClick={() => removeBlock(b.id)} className="absolute inset-x-1 flex items-start rounded-lg border border-dashed border-white/25 bg-white/5 p-2 text-left text-xs text-silver" style={{ top: top(b.start), height: b.minutes * pxPerMin }} title="Remove block">
                    {b.label} · tap to remove
                  </button>
                ))}
                {list.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => setOpen(a.id)}
                    className="absolute inset-x-1 flex flex-col items-start justify-start overflow-hidden rounded-lg p-2 text-left text-xs transition hover:brightness-125"
                    style={{ top: top(a.start), height: Math.max(26, a.minutes * pxPerMin - 2), background: `${c.color}26`, borderLeft: `3px solid ${c.color}` }}
                  >
                    <span className="block truncate font-medium text-bone">{clientName(clients.find((x) => x.id === a.clientId))}</span>
                    <span className="block truncate text-mist/80">
                      {fmtTime(a.start)} · {SERVICE_BY_ID[a.serviceId].name}
                    </span>
                  </button>
                ))}
              </div>
            );
          })}
        </div>
      </div>
      {!isOwner && <p className="mt-3 text-xs text-silver">You only see your own column. Kayla sees the whole salon.</p>}
      <ApptDrawer id={open} onClose={() => setOpen(null)} />
    </div>
  );
}

// ============================================================ appointments list
export function AppointmentsView() {
  const { scope } = useScope();
  const appts = useDB((s) => s.appts);
  const clients = useDB((s) => s.clients);
  const now = useNow();
  const [tab, setTab] = useState<"upcoming" | "past" | "all">("upcoming");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const list = useMemo(() => {
    const term = q.toLowerCase();
    let l = appts.filter((a) => inScope(scope, a.staff));
    if (tab === "upcoming") l = l.filter((a) => new Date(a.start).getTime() >= now - 3600000);
    if (tab === "past") l = l.filter((a) => new Date(a.start).getTime() < now).reverse();
    if (term) l = l.filter((a) => `${clientName(clients.find((c) => c.id === a.clientId))} ${SERVICE_BY_ID[a.serviceId].name}`.toLowerCase().includes(term));
    return l.slice(0, 120);
  }, [appts, clients, scope, tab, q, now]);
  return (
    <div>
      <PageHead title="Appointments" sub="Every booking from the portal and imported from Square (demo)." />
      <div data-tour="s-filters" className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex gap-2">
          {(["upcoming", "past", "all"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} aria-pressed={tab === t} className={cn("min-h-11 rounded-full border px-4 text-sm capitalize", tab === t ? "border-red bg-crimson text-paper" : "border-white/12 text-mist")}>
              {t}
            </button>
          ))}
        </div>
        <label className="relative flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-silver" aria-hidden />
          <span className="sr-only">Search appointments</span>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Client or service" className="h-11 w-full rounded-full border border-white/12 bg-onyx pl-9 pr-3 text-sm text-bone focus:border-flare focus:outline-none" />
        </label>
      </div>
      <ul className="space-y-2 md:hidden">
        {list.length === 0 && <li className="card-night p-5 text-mist/80">No appointments match.</li>}
        {list.map((a) => (
          <li key={a.id}>
            <button onClick={() => setOpen(a.id)} className="card-night flex w-full items-start justify-between gap-3 p-4 text-left">
              <span className="min-w-0">
                <span className="block text-sm text-silver">
                  {fmtDate(a.start)} · {fmtTime(a.start)} · {STAFF_BY_KEY[a.staff].short}
                </span>
                <span className="mt-0.5 block truncate text-bone">{clientName(clients.find((c) => c.id === a.clientId))}</span>
                <span className="block truncate text-sm text-mist/80">{SERVICE_BY_ID[a.serviceId].name}</span>
              </span>
              <span className="flex shrink-0 flex-col items-end gap-2">
                <StatusBadge s={a.status} />
                <span className="tabular-nums text-bone">{money(a.price)}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
      <div className="card-night hidden overflow-x-auto md:block">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="text-left text-xs uppercase tracking-[0.12em] text-silver">
            <tr className="border-b border-white/10">
              <th className="px-4 py-3 font-medium">When</th>
              <th className="px-4 py-3 font-medium">Client</th>
              <th className="px-4 py-3 font-medium">Service</th>
              <th className="px-4 py-3 font-medium">Stylist</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {list.map((a) => (
              <tr key={a.id} onClick={() => setOpen(a.id)} className="cursor-pointer border-b border-white/[0.05] hover:bg-white/[0.03]">
                <td className="whitespace-nowrap px-4 py-3 text-mist">
                  {fmtDate(a.start)} · {fmtTime(a.start)}
                </td>
                <td className="px-4 py-3 text-bone">
                  <button className="min-h-11 text-left" onClick={() => setOpen(a.id)}>
                    {clientName(clients.find((c) => c.id === a.clientId))}
                  </button>
                </td>
                <td className="px-4 py-3 text-mist">{SERVICE_BY_ID[a.serviceId].name}</td>
                <td className="px-4 py-3 text-mist">{STAFF_BY_KEY[a.staff].short}</td>
                <td className="px-4 py-3 tabular-nums text-bone">{money(a.price)}</td>
                <td className="px-4 py-3">
                  <StatusBadge s={a.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ApptDrawer id={open} onClose={() => setOpen(null)} />
    </div>
  );
}

// ============================================================ clients + journey CRM
export function ClientsView() {
  const { scope, session } = useScope();
  const clients = useDB((s) => s.clients);
  const appts = useDB((s) => s.appts);
  const journey = useDB((s) => s.journey);
  const [q, setQ] = useState("");
  const [sel, setSel] = useState<string | null>(null);
  const visible = useMemo(() => {
    const ids = new Set(appts.filter((a) => inScope(scope, a.staff)).map((a) => a.clientId));
    const term = q.toLowerCase();
    return clients.filter((c) => (scope === "all" || ids.has(c.id)) && (!term || `${c.first} ${c.last} ${c.phone} ${c.email}`.toLowerCase().includes(term)));
  }, [clients, appts, scope, q]);
  const c = clients.find((x) => x.id === sel);
  const visits = useMemo(() => appts.filter((a) => a.clientId === sel && a.status === "completed").reverse(), [appts, sel]);
  const jr = useMemo(() => journey.filter((j) => j.clientId === sel).sort((a, b) => b.at.localeCompare(a.at)), [journey, sel]);
  const [note, setNote] = useState({ title: "", text: "", photo: WORK[0].src as string });
  const me: StaffKey = session.role === "stylist" ? session.staff! : scope === "all" ? "kayla" : scope;

  return (
    <div>
      <PageHead title="Clients & Image Journeys" sub={scope === "all" ? `${visible.length} clients` : `${visible.length} clients in your book`} />
      <label className="relative mb-4 block max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-silver" aria-hidden />
        <span className="sr-only">Search clients</span>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Name, phone or email" className="h-11 w-full rounded-full border border-white/12 bg-onyx pl-9 pr-3 text-sm text-bone focus:border-flare focus:outline-none" />
      </label>
      <ul data-tour="s-clients" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {visible.map((x) => {
          const n = appts.filter((a) => a.clientId === x.id && a.status === "completed").length;
          return (
            <li key={x.id}>
              <button onClick={() => setSel(x.id)} className="card-night flex w-full items-center gap-4 p-4 text-left transition hover:border-red/40">
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-red/10 text-flare">{x.first[0]}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-bone">{clientName(x)}</span>
                  <span className="block truncate text-sm text-silver">
                    {n} visits · {x.hair}
                  </span>
                </span>
                {x.tags.slice(0, 1).map((t) => (
                  <span key={t} className="shrink-0 rounded-full bg-red/15 px-2 py-0.5 text-[10px] text-flare">
                    {t}
                  </span>
                ))}
              </button>
            </li>
          );
        })}
      </ul>

      <Drawer open={!!c} onClose={() => setSel(null)} title={c ? clientName(c) : "Client"}>
        {c && (
          <div className="space-y-6">
            <div className="text-sm">
              <p className="text-mist">
                {c.phone} · {c.email}
              </p>
              <p className="mt-1 text-silver">
                Client since {fmtDate(c.since, { month: "long", year: "numeric" })} · prefers {c.preferred ? STAFF_BY_KEY[c.preferred].short : "anyone"} · photos {c.photoConsent ? "OK" : "not OK"}
              </p>
            </div>
            <label className="block text-sm text-mist/85">
              Hair type
              <input value={c.hair} onChange={(e) => updateClient(c.id, { hair: e.target.value })} className="mt-1 h-11 w-full rounded-xl border border-white/12 bg-ink px-3 text-bone" />
            </label>
            <label className="block text-sm text-mist/85">
              Stylist notes
              <textarea value={c.notes} onChange={(e) => updateClient(c.id, { notes: e.target.value })} rows={3} className="mt-1 w-full rounded-xl border border-white/12 bg-ink px-3 py-2 text-bone" />
            </label>

            <section>
              <p className="eyebrow text-silver">Image Journey · shared with the client</p>
              {jr.length === 0 && <p className="mt-2 text-sm text-mist/75">No journey entries yet.</p>}
              <ul className="mt-3 space-y-3">
                {jr.map((j) => (
                  <li key={j.id} className="flex gap-3 rounded-xl bg-ink/60 p-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`${j.photo}-640.webp`} alt="" className="size-16 shrink-0 rounded-lg object-cover" />
                    <div className="min-w-0 text-sm">
                      <p className="text-bone">{j.title}</p>
                      <p className="text-silver">
                        {fmtDate(j.at)} · {STAFF_BY_KEY[j.staff].short}
                      </p>
                      <p className="mt-1 text-mist/85">{j.note}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <form
                className="mt-4 space-y-3 rounded-xl border border-dashed border-white/15 p-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!note.title.trim()) return;
                  addJourney(c.id, me, note.photo, note.title.trim(), note.text.trim());
                  setNote({ title: "", text: "", photo: WORK[0].src });
                }}
              >
                <p className="flex items-center gap-2 text-sm text-bone">
                  <ImagePlus className="size-4 text-flare" aria-hidden /> Add today’s photo & care note
                </p>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {WORK.map((w) => (
                    <button type="button" key={w.src} onClick={() => setNote((n) => ({ ...n, photo: w.src }))} className={cn("shrink-0 overflow-hidden rounded-lg border-2", note.photo === w.src ? "border-red" : "border-transparent")} aria-label={`Use photo: ${w.label}`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={`${w.src}-640.webp`} alt="" className="size-14 object-cover" />
                    </button>
                  ))}
                </div>
                <input value={note.title} onChange={(e) => setNote((n) => ({ ...n, title: e.target.value }))} placeholder="Title — e.g. Fresh knotless, mid-back" className="h-11 w-full rounded-lg border border-white/12 bg-ink px-3 text-sm text-bone" />
                <textarea value={note.text} onChange={(e) => setNote((n) => ({ ...n, text: e.target.value }))} rows={2} placeholder="Care note the client will see" className="w-full rounded-lg border border-white/12 bg-ink px-3 py-2 text-sm text-bone" />
                <button className="btn btn-primary !min-h-10 text-sm">Add to journey</button>
                <p className="text-[11px] text-silver">Demo: choose from salon photos. At launch you snap a photo from your phone.</p>
              </form>
            </section>

            <section>
              <p className="eyebrow text-silver">Visits</p>
              <ul className="mt-2 divide-y divide-white/[0.06] text-sm">
                {visits.slice(0, 12).map((a) => (
                  <li key={a.id} className="flex justify-between gap-3 py-2">
                    <span className="text-mist">{SERVICE_BY_ID[a.serviceId].name}</span>
                    <span className="shrink-0 text-silver">
                      {fmtDate(a.start, { month: "short", day: "numeric" })} · {money(a.price)}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        )}
      </Drawer>
    </div>
  );
}

// ============================================================ finances (owner)
export function FinancesView() {
  const appts = useDB((s) => s.appts);
  const payments = useDB((s) => s.payments);
  const now = useNow();
  const [range, setRange] = useState(30);
  const today = startOfDay(new Date(now));
  const from = addDays(today, -(range - 1));
  const to = addDays(today, 1);
  const all = totals(appts, payments, from, to);
  const byStaff = STAFF.map((s) => ({ label: s.short, value: totals(appts, payments, from, to, s.key).revenue }));
  const catMap = new Map<string, number>();
  appts
    .filter((a) => a.status === "completed" && new Date(a.start) >= from && new Date(a.start) < to)
    .forEach((a) => {
      const k = CATEGORY_BY_KEY[SERVICE_BY_ID[a.serviceId].category].short;
      catMap.set(k, (catMap.get(k) ?? 0) + a.price);
    });
  const byCat = [...catMap.entries()].sort((a, b) => b[1] - a[1]).map(([label, value]) => ({ label, value }));
  const deposits = payments.filter((p) => p.kind === "deposit" && new Date(p.at) >= from && new Date(p.at) < to).reduce((n, p) => n + p.amount, 0);
  const held = appts.filter((a) => new Date(a.start).getTime() > now && (a.status === "confirmed" || a.status === "booked")).reduce((n, a) => n + a.deposit, 0);
  const recent = payments.filter((p) => new Date(p.at).getTime() <= now).slice(-14).reverse();

  return (
    <div>
      <PageHead
        title="Finances"
        sub="Collected deposits and balances (demo data)."
        action={
          <div className="flex gap-2">
            {[7, 30, 90].map((r) => (
              <button key={r} onClick={() => setRange(r)} aria-pressed={range === r} className={cn("min-h-11 rounded-full border px-4 text-sm", range === r ? "border-red bg-crimson text-paper" : "border-white/12 text-mist")}>
                {r} days
              </button>
            ))}
          </div>
        }
      />
      <div data-tour="s-money" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Collected" value={money(Math.round(all.revenue))} sub={`${range} days`} icon={DollarSign} />
        <Stat label="Completed visits" value={String(all.done)} sub={`avg ${money(Math.round(all.avg))}`} icon={CheckCircle2} />
        <Stat label="Deposits taken" value={money(Math.round(deposits))} sub="protects your chair time" icon={TrendingUp} />
        <Stat label="Deposits held" value={money(Math.round(held))} sub="for upcoming visits" icon={Clock} />
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Panel tour="s-bystaff" title="By stylist">
          <Bars data={byStaff} />
        </Panel>
        <Panel title="By service category">
          <ul className="space-y-3">
            {byCat.map((c) => (
              <li key={c.label}>
                <div className="flex justify-between text-sm">
                  <span className="text-mist">{c.label}</span>
                  <span className="tabular-nums text-bone">{money(Math.round(c.value))}</span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-white/5">
                  <div className="h-full rounded-full bg-gradient-to-r from-crimson to-red" style={{ width: `${(c.value / Math.max(1, byCat[0]?.value ?? 1)) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
      <Panel title="Latest payments" className="mt-5">
        <ul className="divide-y divide-white/[0.06] text-sm">
          {recent.map((p) => (
            <li key={p.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5">
              <span className="min-w-0 text-mist">{p.label}</span>
              <span className="text-silver">
                {fmtDate(p.at)} · {p.method}
                {p.staff ? ` · ${STAFF_BY_KEY[p.staff].short}` : ""}
              </span>
              <span className="tabular-nums text-bone">{money(p.amount)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-silver">At launch these come straight from the payment provider (Stripe or Square) — no double entry.</p>
      </Panel>
    </div>
  );
}

// ============================================================ team & payroll (owner)
export function TeamView() {
  const appts = useDB((s) => s.appts);
  const payments = useDB((s) => s.payments);
  const settings = useDB((s) => s.settings);
  const now = useNow();
  const today = startOfDay(new Date(now));
  const from = addDays(today, -13);
  const to = addDays(today, 1);
  return (
    <div>
      <PageHead title="Team & payroll" sub="Last 14 days · each stylist logs in and sees only their own book." />
      <div data-tour="s-team" className="grid gap-4 md:grid-cols-2">
        {STAFF.map((s) => {
          const t = totals(appts, payments, from, to, s.key);
          const openMins = Array.from({ length: 14 }, (_, i) => addDays(from, i)).reduce((n, d) => {
            const h = settings.hours[d.getDay()];
            if (!h.open) return n;
            const [a, b] = [h.open, h.close!].map((x) => Number(x.split(":")[0]) * 60 + Number(x.split(":")[1]));
            return n + (b - a);
          }, 0);
          const booked = appts.filter((a) => a.staff === s.key && a.status !== "canceled" && new Date(a.start) >= from && new Date(a.start) < to).reduce((n, a) => n + a.minutes, 0);
          const util = openMins ? Math.min(100, Math.round((booked / openMins) * 100)) : 0;
          const payout = s.key === "kayla" ? null : (t.revenue * s.commission) / 100;
          return (
            <div key={s.key} className="card-night p-6">
              <div className="flex items-center gap-3">
                <span className="size-3 rounded-full" style={{ background: s.color }} aria-hidden />
                <p className="text-xl text-bone">{s.name}</p>
                <span className="ml-auto text-xs text-silver">{s.categories.filter((c) => c !== "consult").map((c) => CATEGORY_BY_KEY[c].short).join(" · ")}</span>
              </div>
              <dl className="mt-5 grid grid-cols-3 gap-3 text-sm">
                <div>
                  <dt className="text-silver">Revenue</dt>
                  <dd className="text-lg text-bone">{money(Math.round(t.revenue))}</dd>
                </div>
                <div>
                  <dt className="text-silver">Visits</dt>
                  <dd className="text-lg text-bone">{t.done}</dd>
                </div>
                <div>
                  <dt className="text-silver">Chair booked</dt>
                  <dd className="text-lg text-bone">{util}%</dd>
                </div>
              </dl>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/5">
                <div className="h-full rounded-full" style={{ width: `${util}%`, background: s.color }} />
              </div>
              <p className="mt-4 text-sm text-mist/85">{payout == null ? "Owner — keeps salon revenue." : `Est. payout at ${s.commission}% commission: ${money(Math.round(payout))}`}</p>
            </div>
          );
        })}
      </div>
      <p className="mt-4 text-xs text-silver">Commission / booth-rent terms are placeholders for the demo — set the real ones in launch settings.</p>
    </div>
  );
}

// ============================================================ settings (owner)
export function SettingsView() {
  const settings = useDB((s) => s.settings);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");
  const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const list = SERVICES.filter((s) => (cat === "all" || s.category === cat) && (!q || s.name.toLowerCase().includes(q.toLowerCase())));
  return (
    <div>
      <PageHead title="Services & hours" sub="Changes apply instantly to the booking page (this demo session)." />
      <div className="grid gap-5 xl:grid-cols-2">
        <Panel tour="s-hours" title="Opening hours">
          <ul className="space-y-2">
            {[1, 2, 3, 4, 5, 6, 0].map((i) => {
              const h = settings.hours[i];
              const setH = (patch: Partial<{ open: string | null; close: string | null }>) => updateSettings({ hours: settings.hours.map((x, j) => (j === i ? { ...x, ...patch } : x)) });
              return (
                <li key={i} className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-white/[0.05] pb-2 text-sm last:border-0 sm:border-0 sm:pb-0">
                  <span className="w-24 text-mist">{DAYS[i]}</span>
                  <label className="flex min-h-11 items-center gap-2 text-silver">
                    <input type="checkbox" checked={!!h.open} onChange={(e) => setH(e.target.checked ? { open: "10:00", close: "18:00" } : { open: null, close: null })} className="size-5 accent-[#c8140e]" /> Open
                  </label>
                  {h.open && (
                    <span className="flex w-full items-center gap-2 sm:w-auto">
                      <input type="time" value={h.open} onChange={(e) => setH({ open: e.target.value })} className="h-11 min-w-0 flex-1 rounded-lg border border-white/12 bg-ink px-2 text-bone sm:flex-none" aria-label={`${DAYS[i]} opens`} />
                      <span className="text-silver">to</span>
                      <input type="time" value={h.close ?? ""} onChange={(e) => setH({ close: e.target.value })} className="h-11 min-w-0 flex-1 rounded-lg border border-white/12 bg-ink px-2 text-bone sm:flex-none" aria-label={`${DAYS[i]} closes`} />
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </Panel>
        <Panel tour="s-deposits" title="Deposits" action={<span className="needs-tag">proposed</span>}>
          <p className="text-sm text-mist/85">The salon hasn’t published a deposit rule. These defaults protect long appointments; Mermaid Locs keep their real $230 deposit.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {(
              [
                ["under100", "Under $100"],
                ["under300", "$100 – $299"],
                ["over300", "$300 +"],
              ] as const
            ).map(([k, l]) => (
              <label key={k} className="text-sm text-silver">
                {l}
                <span className="mt-1 flex items-center rounded-lg border border-white/12 bg-ink px-2">
                  <span className="text-silver">$</span>
                  <input type="number" min={0} value={settings.deposits[k]} onChange={(e) => updateSettings({ deposits: { ...settings.deposits, [k]: Math.max(0, Number(e.target.value)) } })} className="h-10 w-full bg-transparent px-1 text-bone outline-none" />
                </span>
              </label>
            ))}
          </div>
          <label className="mt-4 block text-sm text-silver">
            Minimum notice for online booking (hours)
            <input type="number" min={0} value={settings.leadHours} onChange={(e) => updateSettings({ leadHours: Math.max(0, Number(e.target.value)) })} className="mt-1 h-10 w-32 rounded-lg border border-white/12 bg-ink px-2 text-bone" />
          </label>
        </Panel>
      </div>
      <Panel tour="s-menu" title={`Menu (${SERVICES.length} services)`} className="mt-5">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search services" className="h-11 rounded-full border border-white/12 bg-ink px-4 text-sm text-bone sm:w-64" aria-label="Search services" />
          <select value={cat} onChange={(e) => setCat(e.target.value)} className="h-11 rounded-full border border-white/12 bg-ink px-4 text-sm text-bone" aria-label="Category">
            <option value="all">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c.key} value={c.key}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <ul className="divide-y divide-white/[0.06] md:hidden">
          {list.map((s0) => {
            const s = liveService(s0, settings);
            return (
              <li key={s.id} className="py-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-bone">{s.name}</p>
                    <p className="text-xs text-silver">
                      {fmtPrice(s0)} on Square · deposit {money(depositFor(s, settings))}
                    </p>
                  </div>
                  <label className="flex min-h-11 shrink-0 items-center gap-2 text-xs text-silver">
                    Online
                    <input type="checkbox" checked={s.active} onChange={(e) => overrideService(s.id, { active: e.target.checked })} className="size-6 accent-[#c8140e]" aria-label={`${s.name} bookable online`} />
                  </label>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-3">
                  <label className="text-xs text-silver">
                    Price ($)
                    {s.price == null ? (
                      <span className="mt-1 flex h-11 items-center text-sm text-silver">Quoted</span>
                    ) : (
                      <input type="number" inputMode="numeric" min={0} value={s.price} onChange={(e) => overrideService(s.id, { price: Math.max(0, Number(e.target.value)) })} className="mt-1 h-11 w-full rounded-lg border border-white/12 bg-ink px-3 text-base text-bone" />
                    )}
                  </label>
                  <label className="text-xs text-silver">
                    Minutes
                    <input type="number" inputMode="numeric" min={5} step={5} value={s.minutes} onChange={(e) => overrideService(s.id, { minutes: Math.max(5, Number(e.target.value)) })} className="mt-1 h-11 w-full rounded-lg border border-white/12 bg-ink px-3 text-base text-bone" />
                  </label>
                </div>
              </li>
            );
          })}
        </ul>
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="text-left text-xs uppercase tracking-[0.12em] text-silver">
              <tr className="border-b border-white/10">
                <th className="py-2 pr-3 font-medium">Service</th>
                <th className="py-2 pr-3 font-medium">Price</th>
                <th className="py-2 pr-3 font-medium">Minutes</th>
                <th className="py-2 pr-3 font-medium">Deposit</th>
                <th className="py-2 font-medium">Online</th>
              </tr>
            </thead>
            <tbody>
              {list.map((s0) => {
                const s = liveService(s0, settings);
                return (
                  <tr key={s.id} className="border-b border-white/[0.05]">
                    <td className="py-2 pr-3 text-bone">
                      {s.name}
                      <span className="block text-xs text-silver">{fmtPrice(s0)} on Square</span>
                    </td>
                    <td className="py-2 pr-3">
                      {s.price == null ? (
                        <span className="text-silver">—</span>
                      ) : (
                        <input type="number" min={0} value={s.price} onChange={(e) => overrideService(s.id, { price: Math.max(0, Number(e.target.value)) })} className="h-9 w-24 rounded-lg border border-white/12 bg-ink px-2 text-bone" aria-label={`${s.name} price`} />
                      )}
                    </td>
                    <td className="py-2 pr-3">
                      <input type="number" min={5} step={5} value={s.minutes} onChange={(e) => overrideService(s.id, { minutes: Math.max(5, Number(e.target.value)) })} className="h-9 w-24 rounded-lg border border-white/12 bg-ink px-2 text-bone" aria-label={`${s.name} minutes`} />
                    </td>
                    <td className="py-2 pr-3 text-mist">{money(depositFor(s, settings))}</td>
                    <td className="py-2">
                      <input type="checkbox" checked={s.active} onChange={(e) => overrideService(s.id, { active: e.target.checked })} className="size-5 accent-[#c8140e]" aria-label={`${s.name} bookable online`} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>
      <p className="mt-4 flex items-center gap-2 text-xs text-silver">
        <Users className="size-4" aria-hidden /> At launch, edits save to the salon’s database and appear for every client instantly.
      </p>
    </div>
  );
}
