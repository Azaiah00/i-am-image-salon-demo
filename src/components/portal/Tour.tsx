"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Compass, MousePointerClick, Repeat2, X, Zap } from "lucide-react";
import { useDB, useMounted } from "@/lib/portal/db";
import { TOURS, goStep, startTour, stopTour, useTour, type TourRole } from "@/lib/portal/tour";
import { cn } from "@/lib/cn";

const ROLE_LABEL: Record<TourRole, string> = { client: "Client view", owner: "Owner view", stylist: "Stylist view" };
const PAD = 8;

type Box = { top: number; left: number; width: number; height: number };
type Pos = { top: number; left: number; place: "below" | "above" | "corner" };

function visibleTarget(name: string): HTMLElement | null {
  const els = Array.from(document.querySelectorAll<HTMLElement>(`[data-tour="${name}"]`));
  return (
    els.find((e) => {
      const r = e.getBoundingClientRect();
      return r.width > 0 && r.height > 0 && getComputedStyle(e).visibility !== "hidden";
    }) ?? null
  );
}

/** Role of the signed-in demo account, if any. */
function useSessionRole(): TourRole | null {
  const role = useDB((s) => s.session.role);
  return role === "client" || role === "owner" || role === "stylist" ? role : null;
}

/** The guided walkthrough: spotlight + explainer card. Lives in the portal layout. */
export function TourGuide() {
  const mounted = useMounted();
  const tour = useTour();
  const sessionRole = useSessionRole();
  const pathname = usePathname();
  const router = useRouter();

  const steps = tour.role ? TOURS[tour.role] : [];
  const step = tour.on ? steps[tour.step] : undefined;
  const key = `${tour.role}-${tour.step}`;
  const onRoute = !!step && (!step.route || pathname === step.route);

  const targetRef = useRef<HTMLElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [found, setFound] = useState<{ key: string; has: boolean } | null>(null);
  const [box, setBox] = useState<Box | null>(null);
  const [pos, setPos] = useState<Pos | null>(null);

  // The guide belongs to one perspective: signing out or switching ends it.
  useEffect(() => {
    if (tour.on && sessionRole !== tour.role) stopTour();
  }, [tour.on, tour.role, sessionRole]);

  // Go to the page the step lives on.
  useEffect(() => {
    if (step?.route && pathname !== step.route) router.push(step.route);
  }, [step, pathname, router]);

  // Find (and scroll to) the step's target once its page has rendered.
  useEffect(() => {
    if (!step || !onRoute) return;
    const target = step.target;
    let tries = 0;
    const id = window.setInterval(() => {
      const el = target ? visibleTarget(target) : null;
      if (!target || el || ++tries > 18) {
        window.clearInterval(id);
        targetRef.current = el;
        if (el) {
          const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
          const r = el.getBoundingClientRect();
          const mobile = window.innerWidth < 640;
          const fits = r.height < window.innerHeight * (mobile ? 0.42 : 0.6);
          const y = mobile || !fits ? r.top + window.scrollY - 96 : r.top + window.scrollY - (window.innerHeight - r.height) / 2;
          window.scrollTo({ top: Math.max(0, y), behavior: reduce ? "auto" : "smooth" });
        }
        setFound({ key, has: !!el });
      }
    }, 80);
    return () => window.clearInterval(id);
  }, [step, onRoute, key]);

  // Keep the spotlight and card glued to the target while things scroll or resize.
  useEffect(() => {
    if (!tour.on) return;
    let raf = 0;
    let last = "";
    const tick = () => {
      const el = targetRef.current;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      let b: Box | null = null;
      if (el && el.isConnected) {
        const r = el.getBoundingClientRect();
        const top = Math.max(r.top - PAD, 6);
        const bottom = Math.min(r.bottom + PAD, vh - 6);
        b = { top, left: Math.max(r.left - PAD, 6), width: Math.min(r.width + PAD * 2, vw - 12), height: Math.max(0, bottom - top) };
      }
      const card = cardRef.current;
      let p: Pos | null = null;
      if (card && vw >= 640) {
        const ch = card.offsetHeight;
        const cw = card.offsetWidth;
        if (b) {
          const left = Math.min(Math.max(b.left, 16), vw - cw - 16);
          if (b.top + b.height + 14 + ch < vh - 12) p = { top: b.top + b.height + 14, left, place: "below" };
          else if (b.top - 14 - ch > 12) p = { top: b.top - 14 - ch, left, place: "above" };
          else p = { top: vh - ch - 20, left: vw - cw - 20, place: "corner" };
        } else p = { top: Math.max(20, (vh - ch) / 2), left: (vw - cw) / 2, place: "corner" };
      }
      const sig = JSON.stringify([b, p]);
      if (sig !== last) {
        last = sig;
        setBox(b);
        setPos(p);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [tour.on]);

  // Keyboard: Esc ends, arrows move (unless typing).
  useEffect(() => {
    if (!tour.on) return;
    const k = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT")) return;
      if (e.key === "Escape") stopTour();
      if (e.key === "ArrowRight") goStep(tour.step + 1);
      if (e.key === "ArrowLeft") goStep(tour.step - 1);
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [tour.on, tour.step]);

  // Move focus to the card on each step so keyboard and screen-reader users follow along.
  useEffect(() => {
    if (found?.key === key && tour.on) cardRef.current?.focus({ preventScroll: true });
  }, [found, key, tour.on]);

  if (!mounted || !tour.on || !step || !tour.role) return null;
  const ready = onRoute && found?.key === key;
  if (!ready) return null;

  const total = steps.length;
  const last = tour.step === total - 1;
  const spot = found.has ? box : null;

  return (
    <>
      {/* dim + spotlight (never blocks clicks, so visitors can try things) */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-[90]">
        {spot ? (
          <div
            className="absolute rounded-2xl ring-2 ring-flare transition-all duration-300 ease-out motion-reduce:transition-none"
            style={{ top: spot.top, left: spot.left, width: spot.width, height: spot.height, boxShadow: "0 0 0 200vmax rgba(11,10,10,0.66), 0 0 40px 4px rgba(249,37,5,0.35)" }}
          />
        ) : (
          <div className="absolute inset-0 bg-ink/70" />
        )}
      </div>

      <div
        ref={cardRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="false"
        aria-labelledby="tour-title"
        aria-describedby="tour-body"
        className={cn(
          "fixed z-[95] w-auto overflow-hidden rounded-3xl border border-white/12 bg-onyx/[0.97] text-mist shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] outline-none backdrop-blur-xl",
          "inset-x-2 bottom-2 max-h-[48svh] overflow-y-auto sm:inset-x-auto sm:bottom-auto sm:max-h-[min(70svh,34rem)] sm:w-[23.5rem]",
          !pos && "sm:invisible",
        )}
        style={pos ? { top: pos.top, left: pos.left, transition: "top .3s ease, left .3s ease" } : undefined}
      >
        <div className="h-1 bg-white/5">
          <div className="h-full bg-gradient-to-r from-crimson to-flare transition-all duration-300" style={{ width: `${((tour.step + 1) / total) * 100}%` }} />
        </div>
        <div className="p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-flare">
              <Compass className="size-4" aria-hidden /> {ROLE_LABEL[tour.role]}
              <span className="text-silver">
                · {tour.step + 1} of {total}
              </span>
            </p>
            <button onClick={stopTour} className="-mr-2 grid size-10 place-items-center rounded-full text-silver hover:bg-white/5 hover:text-paper" aria-label="Turn the guide off">
              <X className="size-5" />
            </button>
          </div>
          <h2 id="tour-title" className="display mt-1 text-[1.6rem] leading-tight text-bone sm:mt-2 sm:text-[1.9rem]">
            {step.title}
          </h2>
          <p id="tour-body" className="mt-1.5 text-[0.9rem] leading-relaxed text-mist/90 sm:mt-2 sm:text-[0.95rem]">
            {step.body}
          </p>
          {step.tryIt && (
            <p className="mt-3 flex items-center gap-2 text-sm text-bone">
              <MousePointerClick className="size-4 shrink-0 text-flare" aria-hidden /> {step.tryIt}
            </p>
          )}
          {step.live && (
            <div className="mt-3 rounded-2xl border border-red/30 bg-red/[0.08] p-3 sm:mt-4 sm:p-3.5">
              <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-flare">
                <Zap className="size-3.5" aria-hidden /> When it goes live
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-mist/90">{step.live}</p>
            </div>
          )}

          {last ? (
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              <Link href="/portal" onClick={stopTour} className="btn btn-primary !min-h-11 !px-4 text-sm">
                <Repeat2 className="size-4" aria-hidden /> Switch view
              </Link>
              <button onClick={stopTour} className="btn btn-ghost !min-h-11 !px-4 text-sm">
                Explore freely
              </button>
              <button onClick={() => goStep(0)} className="text-sm text-silver underline-offset-4 hover:text-paper hover:underline sm:col-span-2">
                Restart this tour
              </button>
            </div>
          ) : (
            <div className="mt-4 flex items-center justify-between gap-3 sm:mt-5">
              <button onClick={() => goStep(tour.step - 1)} disabled={tour.step === 0} className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-sm text-mist hover:text-paper disabled:opacity-30">
                <ArrowLeft className="size-4" aria-hidden /> Back
              </button>
              <button onClick={() => goStep(tour.step + 1)} className="btn btn-primary !min-h-11 !px-5 text-sm">
                {tour.step === 0 ? "Start the tour" : "Next"} <ArrowRight className="size-4" aria-hidden />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/** Guide on/off switch + "switch view", shown in the demo banner. */
export function GuideControls() {
  const mounted = useMounted();
  const tour = useTour();
  const role = useSessionRole();
  if (!mounted || !role) return null;
  const on = tour.on && tour.role === role;
  return (
    <div className="flex shrink-0 items-center gap-1 sm:gap-2">
      <button
        role="switch"
        aria-checked={on}
        onClick={() => (on ? stopTour() : startTour(role, tour.role === role && tour.step < TOURS[role].length - 1 ? tour.step : 0))}
        className="inline-flex min-h-8 items-center gap-2 rounded-full bg-ink/25 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-paper hover:bg-ink/40"
      >
        <span aria-hidden className={cn("relative h-4 w-7 rounded-full transition-colors", on ? "bg-paper" : "bg-ink/50")}>
          <span className={cn("absolute top-0.5 size-3 rounded-full transition-all", on ? "left-3.5 bg-crimson" : "left-0.5 bg-paper/80")} />
        </span>
        Guide
      </button>
      <Link href="/portal" onClick={stopTour} className="inline-flex min-h-8 items-center gap-1.5 rounded-full bg-ink/25 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-paper hover:bg-ink/40">
        <Repeat2 className="size-3.5" aria-hidden /> <span className="hidden sm:inline">Switch</span> view
      </Link>
    </div>
  );
}
