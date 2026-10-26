"use client";

/**
 * Demo walkthrough ("guide") — a role-aware tour that points at real parts of the
 * portal and explains what each one does now (demo) and what it does at launch.
 * Memory-only state, like the rest of the demo. Targets are `data-tour="…"` attributes.
 */
import { useSyncExternalStore } from "react";

export type TourRole = "client" | "owner" | "stylist";

export type TourStep = {
  /** Page the step lives on. The guide navigates there before showing the step. */
  route?: string;
  /** `data-tour` value to spotlight. No target = centered card. */
  target?: string;
  title: string;
  body: string;
  /** What changes when the portal goes live for the salon. */
  live?: string;
  /** A small "try it" nudge. */
  tryIt?: string;
};

const C = "/portal/client";
const S = "/portal/studio";

export const TOURS: Record<TourRole, TourStep[]> = {
  client: [
    {
      route: C,
      title: "Welcome to your client account",
      body: "This is what an I Am Image client sees after signing in. The guide walks you through every part. Click around at any time: it's a live demo with sample data.",
      live: "Clients sign in with Google, Apple or a one-time email link. No passwords to remember.",
    },
    {
      route: C,
      target: "c-upcoming",
      title: "Upcoming appointments",
      body: "Every booked visit shows the date, time, stylist, length and address, plus the deposit already paid and the balance due at the salon.",
      live: "Confirmations and reminders go out automatically by text and email, with a one-tap add-to-calendar link.",
    },
    {
      route: C,
      target: "c-manage",
      title: "Reschedule or cancel yourself",
      body: "Clients can move their own appointment. The reschedule drawer only offers times that are actually open for that stylist and that service length.",
      live: "Changes follow the salon's cancellation window and deposit rules, and the stylist is notified instantly. No phone tag.",
      tryIt: "Tap Reschedule to see open times.",
    },
    {
      route: C,
      target: "c-again",
      title: "Book again in one tap",
      body: "The last service and stylist are remembered, so a repeat client goes straight to the right booking.",
      live: "Retouch and maintenance reminders can nudge clients back at the right interval for their style.",
    },
    {
      route: C,
      target: "c-club",
      title: "Image Club rewards",
      body: "A loyalty tier that grows with every completed visit, with a progress bar to the next perk.",
      live: "Visits are counted automatically from real appointments and perks apply at checkout. Tiers and perks are set by the salon.",
    },
    {
      route: C,
      target: "c-journey",
      title: "Image Journey",
      body: "A photo timeline of every visit with care notes from the stylist. It's the same timeline the stylist sees, so each appointment builds on the last.",
      live: "Stylists add photos from their phone right after the appointment, and the client gets a notification.",
    },
    {
      route: C,
      target: "c-history",
      title: "Visit history",
      body: "Every past service, date, stylist and price in one place.",
      live: "Receipts for each visit can be downloaded or emailed.",
    },
    {
      route: C,
      target: "c-book",
      title: "Book a new appointment",
      body: "Next, the booking flow. It's the same page someone reaches from the website's Book buttons or a shared link.",
    },
    {
      route: "/book",
      target: "b-steps",
      title: "Five simple steps",
      body: "Service, extras, stylist, date & time, then details. Clients can jump back to any finished step without losing anything.",
    },
    {
      route: "/book",
      target: "b-services",
      title: "The full I Am Image menu",
      body: "The salon's full Square menu with real prices and times, searchable and grouped by category.",
      live: "The salon edits prices, times and which services are bookable from their own studio, and the change shows here instantly.",
      tryIt: "Pick any service to watch the total update.",
    },
    {
      route: "/book",
      target: "b-summary",
      title: "Always-visible total",
      body: "Price, time and deposit update with every choice, so there are no surprises at checkout.",
      live: "Deposits are taken securely by card, Apple Pay or Google Pay through Stripe, and the card stays on file for the balance.",
    },
    {
      title: "That's the client side",
      body: "Want to see the other side of the same appointments? Switch to the owner or stylist view. You can also turn the guide off and explore freely.",
    },
  ],

  owner: [
    {
      route: S,
      title: "Welcome to the owner studio",
      body: "This is Kayla's view: the whole salon in one place. Every booking a client makes on the website lands here. The guide walks you through each page.",
      live: "The owner signs in with their own account and only owners can open this side.",
    },
    {
      route: S,
      target: "s-nav",
      title: "Everything in one menu",
      body: "Overview, calendar, appointments, clients, finances, team and the services & hours editor. On a phone, it all sits behind this menu button.",
    },
    {
      route: S,
      target: "s-who",
      title: "See the whole salon or one stylist",
      body: "Switch between the whole salon and any single stylist's book (on a phone, it's at the top of the menu). Every page, number and chart follows this choice.",
      tryIt: "Change “Viewing” to a stylist.",
    },
    {
      route: S,
      target: "s-stats",
      title: "Today at a glance",
      body: "Today's appointments, last 7 days of revenue against the week before, average ticket and no-shows.",
      live: "Numbers come straight from real bookings and Stripe payments. No spreadsheets.",
    },
    {
      route: S,
      target: "s-today",
      title: "Today's chair",
      body: "Tap any appointment to open it: check the client in, mark it complete and take the balance, mark a no-show, or reschedule.",
      live: "Completing a visit charges the remaining balance to the card on file in one tap.",
      tryIt: "Open an appointment.",
    },
    {
      route: S,
      target: "s-confirm",
      title: "Needs confirmation",
      body: "New bookings waiting for a yes. Confirming one updates the client's account immediately.",
      live: "The client gets a confirmation text and email the moment you confirm.",
    },
    {
      route: `${S}/calendar`,
      target: "s-calendar",
      title: "Side-by-side calendar",
      body: "Every stylist's day in columns, on the salon's real opening hours. Tap a booking to manage it.",
      live: "Two-way sync with Google or Apple Calendar keeps personal plans and salon bookings from clashing.",
    },
    {
      route: `${S}/calendar`,
      target: "s-block",
      title: "Block time",
      body: "Block an hour for lunch, a break or a personal errand. That time disappears from the booking page straight away.",
    },
    {
      route: `${S}/appointments`,
      target: "s-filters",
      title: "Every appointment, searchable",
      body: "Upcoming, past or all, searchable by client or service.",
      live: "Existing Square appointments are imported once, so nothing is lost when the salon switches over.",
    },
    {
      route: `${S}/clients`,
      target: "s-clients",
      title: "Clients & Image Journeys",
      body: "Every client with contact details, notes, visit count and their Image Journey. Open a client to add a new photo and care note to their timeline.",
      live: "Photos uploaded here appear in the client's own account instantly.",
      tryIt: "Open any client.",
    },
    {
      route: `${S}/finances`,
      target: "s-money",
      title: "Finances",
      body: "Money collected, completed visits, deposits taken and deposits held for upcoming visits, for 7, 30 or 90 days.",
      live: "Payouts and payment history come straight from Stripe. Reports can be exported for the bookkeeper.",
    },
    {
      route: `${S}/finances`,
      target: "s-bystaff",
      title: "Revenue by stylist",
      body: "See at a glance who is bringing in what, with a breakdown by service category beside it.",
    },
    {
      route: `${S}/team`,
      target: "s-team",
      title: "Team & payroll",
      body: "Each stylist's revenue, completed visits, how full their chair is and their commission for the last 14 days.",
      live: "Commission percentages are set per stylist, so payroll is a number to copy, not a calculation.",
    },
    {
      route: `${S}/settings`,
      target: "s-hours",
      title: "Opening hours",
      body: "Change the hours and the booking page follows instantly. Closed days can't be booked.",
    },
    {
      route: `${S}/settings`,
      target: "s-deposits",
      title: "Deposit rules",
      body: "Set the deposit by price band. Every service's deposit updates on the booking page.",
      live: "Deposits protect the chair: no-shows forfeit them automatically according to the salon's policy.",
    },
    {
      route: `${S}/settings`,
      target: "s-menu",
      title: "Your menu, your control",
      body: "Change any service's price or time, or switch it off, without calling a developer.",
    },
    {
      title: "That's the owner studio",
      body: "Now see what a stylist sees, or what a client sees, using the same live data. You can also turn the guide off and click around freely.",
    },
  ],

  stylist: [
    {
      route: S,
      title: "Welcome to the stylist studio",
      body: "This is what a stylist on the I Am Image team sees. It's the same tools as the owner, limited to their own chair.",
      live: "Each stylist gets their own login. They can never see another stylist's clients or earnings.",
    },
    {
      route: S,
      target: "s-who",
      title: "Your book only",
      body: "Stylists are locked to their own calendar, clients and earnings. Finances, payroll and salon settings are owner-only and hidden here.",
    },
    {
      route: S,
      target: "s-stats",
      title: "Your day and your numbers",
      body: "Today's appointments, your revenue for the week and your average ticket.",
    },
    {
      route: S,
      target: "s-today",
      title: "Run your chair",
      body: "Tap an appointment to check the client in, complete it and take the balance, or reschedule.",
      live: "Stylists get a text when a new client books with them.",
      tryIt: "Open an appointment.",
    },
    {
      route: `${S}/calendar`,
      target: "s-calendar",
      title: "Your calendar",
      body: "Your day on the salon's real hours. Block time for breaks and it disappears from the booking page.",
    },
    {
      route: `${S}/clients`,
      target: "s-clients",
      title: "Your clients & their journeys",
      body: "Your clients' notes and history before they sit down, and a place to add today's photo and care notes.",
      live: "Snap a photo right after the service and it lands in the client's Image Journey.",
    },
    {
      title: "That's the stylist side",
      body: "Switch to the owner to see the whole salon, or to a client to see the booking side. You can also turn the guide off and explore.",
    },
  ],
};

type TourState = { on: boolean; role: TourRole | null; step: number };

let state: TourState = { on: false, role: null, step: 0 };
/** Whether new sign-ins should start the guide (the switch on the sign-in screen). */
let wantGuide = true;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const server: TourState = { on: false, role: null, step: 0 };

export function useTour() {
  return useSyncExternalStore(subscribe, () => state, () => server);
}
export function useWantGuide() {
  return useSyncExternalStore(subscribe, () => wantGuide, () => true);
}
export function setWantGuide(v: boolean) {
  wantGuide = v;
  emit();
}
export function startTour(role: TourRole, step = 0) {
  state = { on: true, role, step };
  emit();
}
export function stopTour() {
  state = { ...state, on: false };
  emit();
}
export function goStep(step: number) {
  if (!state.role) return;
  const max = TOURS[state.role].length - 1;
  state = { ...state, step: Math.max(0, Math.min(max, step)) };
  emit();
}
/** Start the guide after a demo sign-in if the visitor left it switched on. */
export function maybeStartTour(role: TourRole) {
  if (wantGuide) startTour(role);
  else state = { on: false, role, step: 0 };
  emit();
}
