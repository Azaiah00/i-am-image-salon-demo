/**
 * DEMO DATA LAYER — I Am Image booking portal.
 * ---------------------------------------------------------------------------
 * Everything lives in memory for the current browser tab (no localStorage, no
 * network). Every screen talks ONLY to this module, so going live is a backend
 * swap with no UI changes:
 *   // TODO: Supabase — tables mirror the types below (clients, appointments, payments, journey, blocks, settings)
 *   // TODO: Stripe or Square — replace demoCharge() with a real deposit intent
 *   // TODO: Auth — replace signIn() with Google / Apple / email-link auth + roles
 * Clients, appointments and payments are FICTIONAL demo records. Services,
 * prices, times, hours and stylists are I Am Image's real published ones.
 */
import { useEffect, useState, useSyncExternalStore } from "react";
import { SERVICES, SERVICE_BY_ID, STAFF_CATEGORIES, type CategoryKey, type Service, type StaffKey } from "@/lib/services";
import { SITE } from "@/lib/site";

export type Role = "guest" | "client" | "stylist" | "owner";
export type ApptStatus = "booked" | "confirmed" | "checked-in" | "completed" | "no-show" | "canceled";
export type PayMethod = "Card" | "Apple Pay" | "Google Pay" | "Cash App" | "Deposit (card on file)";

export type Staff = {
  key: StaffKey;
  name: string;
  short: string;
  color: string;
  categories: CategoryKey[];
  /** Demo commission % shown in the owner's payroll view (proposed — confirm). */
  commission: number;
};

export const STAFF: Staff[] = [
  { key: "kayla", name: "Kayla Means", short: "Kayla", color: "#f92505", categories: STAFF_CATEGORIES.kayla, commission: 100 },
  { key: "alcion", name: "Alcion", short: "Alcion", color: "#e8a33c", categories: STAFF_CATEGORIES.alcion, commission: 60 },
  { key: "mia", name: "Mia", short: "Mia", color: "#c084fc", categories: STAFF_CATEGORIES.mia, commission: 60 },
  { key: "solo", name: "Solo", short: "Solo", color: "#38bdf8", categories: STAFF_CATEGORIES.solo, commission: 60 },
];
export const STAFF_BY_KEY = Object.fromEntries(STAFF.map((s) => [s.key, s])) as Record<StaffKey, Staff>;

export type Client = {
  id: string;
  first: string;
  last: string;
  phone: string;
  email: string;
  hair: string;
  since: string;
  notes: string;
  preferred?: StaffKey;
  photoConsent: boolean;
  tags: string[];
};

export type Appointment = {
  id: string;
  clientId: string;
  staff: StaffKey;
  serviceId: string;
  addOnIds: string[];
  start: string;
  minutes: number;
  price: number;
  deposit: number;
  status: ApptStatus;
  method?: PayMethod;
  createdAt: string;
  note?: string;
  source: "portal" | "square-import" | "studio";
};

export type Payment = { id: string; apptId?: string; clientId?: string; staff?: StaffKey; kind: "deposit" | "balance"; amount: number; method: PayMethod; at: string; label: string };
export type Journey = { id: string; clientId: string; staff: StaffKey; at: string; photo: string; title: string; note: string };
export type Block = { id: string; staff: StaffKey; start: string; minutes: number; label: string };

export type Settings = {
  hours: { open: string | null; close: string | null }[];
  slotStep: number;
  leadHours: number;
  windowWeeks: number;
  holidays: string[];
  /** PROPOSED deposit tiers — the salon has not published a deposit policy (ASSETS-OWED.md). */
  deposits: { under100: number; under300: number; over300: number };
  serviceOverrides: Record<string, { price?: number; minutes?: number; active?: boolean }>;
};

type State = {
  session: { role: Role; clientId?: string; staff?: StaffKey; name?: string; provider?: string; viewAs?: StaffKey | "all" };
  clients: Client[];
  appts: Appointment[];
  payments: Payment[];
  journey: Journey[];
  blocks: Block[];
  settings: Settings;
  toasts: { id: string; text: string }[];
};

// ---------------------------------------------------------------- helpers
let seq = 1000;
export const uid = (p: string) => `${p}_${(seq++).toString(36)}`;
export const ymd = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
export const atTime = (d: Date, hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  const x = new Date(d);
  x.setHours(h, m, 0, 0);
  return x;
};
export const addDays = (d: Date, n: number) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};
export const startOfDay = (d: Date) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};
const minsBetween = (a: string, b: string) => {
  const [ah, am] = a.split(":").map(Number);
  const [bh, bm] = b.split(":").map(Number);
  return bh * 60 + bm - (ah * 60 + am);
};

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/** Real add-ons offered alongside each category (all real I Am Image menu items). */
export const ADDONS_FOR: Partial<Record<CategoryKey, string[]>> = {
  braids: ["shampoo-steam", "length-charge"],
  "weaves-wigs": ["shampoo-steam", "take-out", "clip-ins", "length-charge"],
  locs: ["length-charge"],
  "silk-press": ["protein-treatment", "bang-trim"],
  "color-cuts": ["one-foil", "few-foils", "extra-color", "protein-treatment", "bang-trim"],
  texture: ["walk-around", "protein-treatment"],
  kids: ["shampoo-steam"],
};

export function depositFor(svc: Pick<Service, "id" | "price" | "deposit" | "priceType">, s: Settings = get().settings) {
  if (svc.deposit) return svc.deposit; // real (Mermaid Locs $230)
  const p = svc.price ?? 0;
  if (svc.priceType === "consult" || svc.priceType === "varies") return s.deposits.under300;
  if (p < 100) return s.deposits.under100;
  if (p < 300) return s.deposits.under300;
  return s.deposits.over300;
}

export function staffFor(cat: CategoryKey) {
  return STAFF.filter((s) => s.categories.includes(cat));
}

// ---------------------------------------------------------------- seed (fictional)
const FIRST = ["Aaliyah", "Brianna", "Candace", "Destiny", "Ebony", "Faith", "Gabrielle", "Imani", "Jasmine", "Kendra", "Lauren", "Monique", "Nia", "Octavia", "Precious", "Raven", "Simone", "Tiana", "Valencia", "Whitney", "Marcus", "Andre", "Jamal", "Darnell", "Keisha", "Tasha", "Jordan", "Malik", "Zoe", "Amara"];
const LAST = ["Brooks", "Carter", "Davis", "Ellis", "Foster", "Green", "Harris", "Jackson", "King", "Lewis", "Moore", "Nelson", "Owens", "Parker", "Robinson", "Scott", "Turner", "Vaughn", "Walker", "Young", "Bell", "Coleman", "Dixon", "Freeman", "Gaines", "Hill", "Mitchell", "Reed", "Sims", "Wright"];
const HAIR = ["4C natural", "4B natural", "3C curls", "Relaxed", "Locs", "Color-treated", "Natural, fine", "Short cut"];

/** Weighted picks per stylist (real service ids). */
const MIX: Record<StaffKey, string[]> = {
  kayla: ["silk-press", "color", "shampoo-cut-style", "cecred-hydration", "relaxer", "color-highlight", "full-weave-leave-out", "cecred-silk-press", "dry-cut", "full-weave-closure"],
  alcion: ["knotless-braids", "locs", "start-locs", "feed-in-cornrows", "box-braids-natural", "kids-box-braids", "two-strand-natural", "loc-detox", "interlocking", "braid-styles"],
  mia: ["quick-weave", "bora-bora-knotless", "quick-weave-ponytail", "partial-weave", "fulani-braids", "frontal-install"],
  solo: ["fade-line-up", "fade", "afro-cut", "line-up", "men-facial", "fade-line-up"],
};

function seed(): State {
  const r = rng(20261026);
  const pick = <T,>(a: readonly T[]) => a[Math.floor(r() * a.length)];
  const now = new Date();
  const today = startOfDay(now);
  const settings: Settings = {
    hours: SITE.hours.map((h) => ({ open: h.open, close: h.close })),
    slotStep: 30,
    leadHours: 12,
    windowWeeks: 8,
    holidays: ["2026-11-26", "2026-12-24", "2026-12-25", "2026-12-31", "2027-01-01"],
    deposits: { under100: 15, under300: 40, over300: 75 },
    serviceOverrides: {},
  };

  const clients: Client[] = FIRST.map((f, i) => ({
    id: `c_${i + 1}`,
    first: f,
    last: LAST[i],
    phone: `(503) 555-${String(1000 + Math.floor(r() * 8999)).slice(0, 4)}`,
    email: `${f.toLowerCase()}.${LAST[i].toLowerCase()}@example.com`,
    hair: pick(HAIR),
    since: ymd(addDays(today, -Math.floor(40 + r() * 1800))),
    notes: i % 3 === 0 ? "Tender-headed at the nape — gentle tension." : i % 3 === 1 ? "Wants length retention. Protein every 6 weeks." : "Likes a soft, bouncy finish.",
    preferred: (["kayla", "alcion", "mia", "solo"] as StaffKey[])[i % 4],
    photoConsent: r() > 0.25,
    tags: i % 6 === 0 ? ["VIP"] : i % 7 === 0 ? ["New"] : [],
  }));
  clients[0] = { ...clients[0], first: "Aaliyah", last: "Brooks", email: "aaliyah.demo@example.com", hair: "4C natural · color-treated", preferred: "kayla", tags: ["VIP", "Image Club · Gold"], photoConsent: true };

  const appts: Appointment[] = [];
  const payments: Payment[] = [];
  const methods: PayMethod[] = ["Card", "Apple Pay", "Card", "Cash App", "Google Pay"];

  for (let d = -60; d <= 21; d++) {
    const day = addDays(today, d);
    const h = settings.hours[day.getDay()];
    if (!h.open || settings.holidays.includes(ymd(day))) continue;
    for (const st of STAFF) {
      if (st.key === "mia" && r() < 0.45) continue; // part-time pattern (demo)
      if (d >= 2 && r() < 0.4) continue; // keep some future days open so long services (braids, locs) can book
      const fillFor = st.key === "solo" ? 0.55 : 1; // barber books short appointments; keep the demo mix realistic
      let cursor = atTime(day, h.open);
      const end = atTime(day, h.close!);
      const fill = d < 0 ? 0.85 : d < 7 ? 0.55 : 0.3;
      while (cursor < end) {
        if (r() > fill * fillFor) {
          cursor = new Date(cursor.getTime() + 60 * 60000);
          continue;
        }
        const svc = SERVICE_BY_ID[pick(MIX[st.key])];
        const minutes = Math.min(svc.minutes, 480);
        const finish = new Date(cursor.getTime() + minutes * 60000);
        if (finish > end) break;
        const client = clients[1 + Math.floor(r() * (clients.length - 1))];
        const price = svc.price ?? 150;
        const deposit = depositFor(svc, settings);
        const past = finish < now;
        let status: ApptStatus = past ? (r() < 0.04 ? "no-show" : r() < 0.03 ? "canceled" : "completed") : d === 0 && cursor < now ? "checked-in" : r() < 0.75 ? "confirmed" : "booked";
        if (d === 0 && past) status = "completed";
        const id = uid("a");
        const createdAt = addDays(cursor, -Math.floor(2 + r() * 20)).toISOString();
        const method = pick(methods);
        appts.push({ id, clientId: client.id, staff: st.key, serviceId: svc.id, addOnIds: [], start: cursor.toISOString(), minutes, price, deposit, status, method: status === "completed" ? method : undefined, createdAt, source: d < -30 ? "square-import" : "portal" });
        payments.push({ id: uid("p"), apptId: id, clientId: client.id, staff: st.key, kind: "deposit", amount: deposit, method: "Deposit (card on file)", at: createdAt, label: `Deposit · ${svc.name}` });
        if (status === "completed") payments.push({ id: uid("p"), apptId: id, clientId: client.id, staff: st.key, kind: "balance", amount: Math.max(0, price - deposit), method, at: finish.toISOString(), label: `Balance · ${svc.name}` });
        const next = finish.getTime() + (r() < 0.35 ? 30 : 0) * 60000;
        cursor = new Date(Math.ceil(next / 1800000) * 1800000);
      }
    }
  }

  // The demo client's history + one upcoming visit
  const me = clients[0];
  const openDay = (from: Date, dir: 1 | -1) => {
    const x = new Date(from);
    while (!settings.hours[x.getDay()].open) x.setDate(x.getDate() + dir);
    return x;
  };
  const history: [number, string][] = [
    [-84, "cecred-hydration"],
    [-56, "color"],
    [-28, "cecred-silk-press"],
  ];
  const journeyPhotos = ["/media/work/pixie-color", "/media/work/red-pixie-smile", "/media/work/curls-red-dress"];
  const journey: Journey[] = [];
  history.forEach(([dd, sid], k) => {
    const day = openDay(addDays(today, dd), 1);
    const start = atTime(day, "11:00");
    const svc = SERVICE_BY_ID[sid];
    const id = uid("a");
    const dep = depositFor(svc, settings);
    appts.push({ id, clientId: me.id, staff: "kayla", serviceId: sid, addOnIds: k === 1 ? ["protein-treatment"] : [], start: start.toISOString(), minutes: svc.minutes, price: (svc.price ?? 0) + (k === 1 ? 20 : 0), deposit: dep, status: "completed", method: "Apple Pay", createdAt: addDays(start, -9).toISOString(), source: "portal" });
    payments.push({ id: uid("p"), apptId: id, clientId: me.id, staff: "kayla", kind: "deposit", amount: dep, method: "Deposit (card on file)", at: addDays(start, -9).toISOString(), label: `Deposit · ${svc.name}` });
    payments.push({ id: uid("p"), apptId: id, clientId: me.id, staff: "kayla", kind: "balance", amount: (svc.price ?? 0) + (k === 1 ? 20 : 0) - dep, method: "Apple Pay", at: start.toISOString(), label: `Balance · ${svc.name}` });
    journey.push({
      id: uid("j"),
      clientId: me.id,
      staff: "kayla",
      at: ymd(day),
      photo: journeyPhotos[k],
      title: ["Hydration first", "Color day", "Press + polish"][k],
      note: [
        "Ends were dry — Cécred hydration before any heat. Keep a satin bonnet on at night and skip heat for two weeks.",
        "Honey highlights through the crown, protein add-on to keep strands strong after color. Use a color-safe, sulfate-free shampoo.",
        "Silk press laid beautifully — color is holding. Book your next visit in 4–5 weeks to keep the shape.",
      ][k],
    });
  });
  {
    const day = openDay(addDays(today, 9), 1);
    const start = atTime(day, "12:00");
    for (let i = appts.length - 1; i >= 0; i--) {
      const a = appts[i];
      if (a.staff !== "kayla") continue;
      const s = new Date(a.start).getTime();
      const e = s + a.minutes * 60000;
      if (ymd(new Date(a.start)) === ymd(day) && s < start.getTime() + 150 * 60000 && e > start.getTime()) {
        appts.splice(i, 1);
      }
    }
    const svc = SERVICE_BY_ID["color-highlight"];
    const id = uid("a");
    const dep = depositFor(svc, settings);
    appts.push({ id, clientId: me.id, staff: "kayla", serviceId: svc.id, addOnIds: ["protein-treatment"], start: start.toISOString(), minutes: svc.minutes + 30, price: (svc.price ?? 0) + 20, deposit: dep, status: "confirmed", createdAt: addDays(today, -2).toISOString(), source: "portal" });
    payments.push({ id: uid("p"), apptId: id, clientId: me.id, staff: "kayla", kind: "deposit", amount: dep, method: "Deposit (card on file)", at: addDays(today, -2).toISOString(), label: `Deposit · ${svc.name}` });
  }

  return {
    session: { role: "guest" },
    clients,
    appts: appts.sort((a, b) => a.start.localeCompare(b.start)),
    payments,
    journey,
    blocks: [],
    settings,
    toasts: [],
  };
}

// ---------------------------------------------------------------- store
let state: State | null = null;
const listeners = new Set<() => void>();
function get(): State {
  if (!state) state = seed();
  return state;
}
function set(fn: (s: State) => State) {
  state = fn(get());
  listeners.forEach((l) => l());
}
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const serverSnapshot: State = {
  session: { role: "guest" },
  clients: [],
  appts: [],
  payments: [],
  journey: [],
  blocks: [],
  settings: { hours: SITE.hours.map((h) => ({ open: h.open, close: h.close })), slotStep: 30, leadHours: 12, windowWeeks: 8, holidays: [], deposits: { under100: 15, under300: 40, over300: 75 }, serviceOverrides: {} },
  toasts: [],
};

/** React hook — select a slice of demo state. Selectors must return existing slices (derive with useMemo). */
export function useDB<T>(sel: (s: State) => T): T {
  return useSyncExternalStore(subscribe, () => sel(get()), () => sel(serverSnapshot));
}
export const db = { get };

/** Current time as state (ticks every minute) so render stays pure. */
export function useNow(intervalMs = 60000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), intervalMs);
    return () => window.clearInterval(t);
  }, [intervalMs]);
  return now;
}

/** True after hydration (avoids rendering demo data during SSR). */
const noop = () => () => {};
export function useMounted() {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
}

// ---------------------------------------------------------------- services (with owner edits)
export function liveService(s: Service, settings = get().settings): Service & { active: boolean } {
  const o = settings.serviceOverrides[s.id] ?? {};
  return { ...s, price: o.price ?? s.price, minutes: o.minutes ?? s.minutes, active: o.active ?? true };
}
export function liveServices() {
  return SERVICES.map((s) => liveService(s));
}

// ---------------------------------------------------------------- availability
export type Slot = { start: Date; label: string; staff: StaffKey; longDay?: boolean };

export function dayStatus(d: Date, s = get().settings): { open: boolean; reason?: string } {
  if (s.holidays.includes(ymd(d))) return { open: false, reason: "Closed for the holiday" };
  const h = s.hours[d.getDay()];
  if (!h?.open) return { open: false, reason: "Closed" };
  return { open: true };
}

function busyFor(staff: StaffKey, d: Date, ignoreId?: string) {
  const st = get();
  return st.appts
    .filter((a) => a.staff === staff && a.id !== ignoreId && a.status !== "canceled" && ymd(new Date(a.start)) === ymd(d))
    .map((a) => [new Date(a.start).getTime(), new Date(a.start).getTime() + a.minutes * 60000] as const)
    .concat(st.blocks.filter((b) => b.staff === staff && ymd(new Date(b.start)) === ymd(d)).map((b) => [new Date(b.start).getTime(), new Date(b.start).getTime() + b.minutes * 60000] as const));
}

/**
 * Open start times for a service on a day. `staff` = a stylist key or "any".
 * Services longer than the day (e.g. Sister Locs 12.5 hr) only start at opening
 * and are flagged `longDay` (the stylist confirms a second session).
 */
export function slotsFor(d: Date, minutes: number, staff: StaffKey | "any", eligible: StaffKey[], ignoreId?: string): Slot[] {
  const s = get().settings;
  if (!dayStatus(d, s).open) return [];
  const h = s.hours[d.getDay()];
  const open = atTime(d, h.open!);
  const close = atTime(d, h.close!);
  const dayLen = minsBetween(h.open!, h.close!);
  const earliest = Date.now() + s.leadHours * 3600000;
  const who = staff === "any" ? eligible : [staff];
  const seen = new Map<number, Slot>();
  for (const k of who) {
    const busy = busyFor(k, d, ignoreId);
    if (minutes > dayLen) {
      const t = open.getTime();
      if (t >= earliest && !busy.length) seen.set(t, { start: new Date(t), label: open.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }), staff: k, longDay: true });
      continue;
    }
    for (let t = open.getTime(); t + minutes * 60000 <= close.getTime(); t += s.slotStep * 60000) {
      if (t < earliest || seen.has(t)) continue;
      const e = t + minutes * 60000;
      if (busy.some(([b0, b1]) => t < b1 && e > b0)) continue;
      const dt = new Date(t);
      seen.set(t, { start: dt, label: dt.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }), staff: k });
    }
  }
  return [...seen.values()].sort((a, b) => a.start.getTime() - b.start.getTime());
}

// ---------------------------------------------------------------- actions
export function toast(text: string) {
  const id = uid("t");
  set((s) => ({ ...s, toasts: [...s.toasts, { id, text }] }));
  setTimeout(() => set((s) => ({ ...s, toasts: s.toasts.filter((t) => t.id !== id) })), 3800);
}

export function signIn(role: Role, provider: string, staff?: StaffKey) {
  set((s) => ({
    ...s,
    session:
      role === "owner"
        ? { role, staff: "kayla", name: "Kayla", provider }
        : role === "stylist"
          ? { role, staff: staff ?? "alcion", name: STAFF_BY_KEY[staff ?? "alcion"].short, provider }
          : role === "client"
            ? { role, clientId: "c_1", name: "Aaliyah", provider }
            : { role: "guest" },
  }));
}
/** Owner only: look at the whole salon or one stylist. */
export function setViewAs(v: StaffKey | "all") {
  set((s) => ({ ...s, session: { ...s.session, viewAs: v } }));
}
/** Which stylist's data the studio shows: a stylist only ever sees their own. */
export function scopeOf(session: State["session"]): StaffKey | "all" {
  if (session.role === "stylist") return session.staff ?? "alcion";
  if (session.role === "owner") return session.viewAs ?? "all";
  return "all";
}

export function signOut() {
  set((s) => ({ ...s, session: { role: "guest" } }));
}

/** DEMO payment — never charges anything. // TODO: Stripe PaymentIntent or Square Payments. */
export async function demoCharge(amount: number) {
  await new Promise((r) => setTimeout(r, 1100));
  return { ok: true, id: uid("pi"), amount };
}

export function createBooking(input: {
  serviceId: string;
  addOnIds: string[];
  staff: StaffKey;
  start: Date;
  client: { first: string; last: string; phone: string; email: string };
  note?: string;
  photoConsent: boolean;
}) {
  const st = get();
  const svc = liveService(SERVICE_BY_ID[input.serviceId], st.settings);
  let clientId = st.session.role === "client" ? st.session.clientId! : st.clients.find((c) => c.email.toLowerCase() === input.client.email.toLowerCase())?.id;
  const isNew = !clientId;
  if (!clientId) clientId = uid("c");
  const minutes = svc.minutes + input.addOnIds.reduce((n, id) => n + SERVICE_BY_ID[id].minutes, 0);
  const price = (svc.price ?? 0) + input.addOnIds.reduce((n, id) => n + (SERVICE_BY_ID[id].price ?? 0), 0);
  const deposit = depositFor(svc, st.settings);
  const appt: Appointment = {
    id: uid("a"),
    clientId,
    staff: input.staff,
    serviceId: svc.id,
    addOnIds: input.addOnIds,
    start: input.start.toISOString(),
    minutes,
    price,
    deposit,
    status: "confirmed",
    createdAt: new Date().toISOString(),
    note: input.note,
    source: "portal",
  };
  set((s) => ({
    ...s,
    clients: isNew ? [...s.clients, { id: clientId!, ...input.client, hair: "—", since: ymd(new Date()), notes: input.note ?? "", preferred: input.staff, photoConsent: input.photoConsent, tags: ["New"] }] : s.clients,
    appts: [...s.appts, appt].sort((a, b) => a.start.localeCompare(b.start)),
    payments: [...s.payments, { id: uid("p"), apptId: appt.id, clientId, staff: input.staff, kind: "deposit", amount: deposit, method: "Deposit (card on file)", at: new Date().toISOString(), label: `Deposit · ${svc.name}` }],
  }));
  return appt;
}

export function setStatus(id: string, status: ApptStatus, method: PayMethod = "Card") {
  set((s) => {
    const a = s.appts.find((x) => x.id === id);
    if (!a) return s;
    const svc = SERVICE_BY_ID[a.serviceId];
    const payments = [...s.payments];
    if (status === "completed" && a.status !== "completed") payments.push({ id: uid("p"), apptId: a.id, clientId: a.clientId, staff: a.staff, kind: "balance", amount: Math.max(0, a.price - a.deposit), method, at: new Date().toISOString(), label: `Balance · ${svc.name}` });
    return { ...s, payments, appts: s.appts.map((x) => (x.id === id ? { ...x, status, method: status === "completed" ? method : x.method } : x)) };
  });
  toast(`Appointment marked ${status.replace("-", " ")}`);
}

export function reschedule(id: string, start: Date, staff?: StaffKey) {
  set((s) => ({ ...s, appts: s.appts.map((x) => (x.id === id ? { ...x, start: start.toISOString(), staff: staff ?? x.staff, status: "confirmed" as ApptStatus } : x)).sort((a, b) => a.start.localeCompare(b.start)) }));
  toast("Appointment moved — deposit carried over");
}

export function addBlock(staff: StaffKey, start: Date, minutes: number, label: string) {
  set((s) => ({ ...s, blocks: [...s.blocks, { id: uid("b"), staff, start: start.toISOString(), minutes, label }] }));
  toast("Time blocked on the calendar");
}
export function removeBlock(id: string) {
  set((s) => ({ ...s, blocks: s.blocks.filter((b) => b.id !== id) }));
}

export function updateClient(id: string, patch: Partial<Client>) {
  set((s) => ({ ...s, clients: s.clients.map((c) => (c.id === id ? { ...c, ...patch } : c)) }));
}

export function addJourney(clientId: string, staff: StaffKey, photo: string, title: string, note: string) {
  set((s) => ({ ...s, journey: [...s.journey, { id: uid("j"), clientId, staff, at: ymd(new Date()), photo, title, note }] }));
  toast("Added to the client’s Image Journey");
}

export function updateSettings(patch: Partial<Settings>) {
  set((s) => ({ ...s, settings: { ...s.settings, ...patch } }));
}
export function overrideService(id: string, patch: { price?: number; minutes?: number; active?: boolean }) {
  set((s) => ({ ...s, settings: { ...s.settings, serviceOverrides: { ...s.settings.serviceOverrides, [id]: { ...s.settings.serviceOverrides[id], ...patch } } } }));
}

// ---------------------------------------------------------------- derived
export const clientName = (c?: Client) => (c ? `${c.first} ${c.last}` : "Client");

export function totals(appts: Appointment[], payments: Payment[], from: Date, to: Date, staff?: StaffKey) {
  const inR = (iso: string) => {
    const t = new Date(iso).getTime();
    return t >= from.getTime() && t < to.getTime();
  };
  const p = payments.filter((x) => inR(x.at) && (!staff || x.staff === staff));
  const revenue = p.reduce((n, x) => n + x.amount, 0);
  const a = appts.filter((x) => inR(x.start) && (!staff || x.staff === staff));
  const done = a.filter((x) => x.status === "completed");
  const noShow = a.filter((x) => x.status === "no-show").length;
  const avg = done.length ? done.reduce((n, x) => n + x.price, 0) / done.length : 0;
  return { revenue, appts: a.length, done: done.length, noShow, avg };
}

/** "Image Club" loyalty tier from lifetime visits (demo rule — proposed). */
export function tierFor(visits: number) {
  if (visits >= 10) return { name: "Platinum", next: null as number | null, perk: "Priority booking + 15% off products & add-ons" };
  if (visits >= 5) return { name: "Gold", next: 10, perk: "Free protein treatment every 5th visit" };
  if (visits >= 2) return { name: "Silver", next: 5, perk: "Birthday-month add-on on us" };
  return { name: "Member", next: 2, perk: "Welcome to the Image Club" };
}
