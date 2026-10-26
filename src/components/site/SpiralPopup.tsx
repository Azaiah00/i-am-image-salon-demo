"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { CalendarHeart, Gift, X } from "lucide-react";
import { postNetlifyForm } from "@/lib/forms";
import { BOOK_HREF } from "@/lib/site";
import { SPIRAL } from "@/lib/brand";

/**
 * GAMIFIED CAPTURE — "Spin the Spiral" (agency Gamified Popup Library: spin-the-wheel,
 * re-skinned as the logo's spiral). Opens on exit intent (desktop), after 55% scroll
 * (phones) or after 35 s. Once per visit (memory only — no storage).
 * PRIZES ARE PROPOSED — Kayla confirms the real offers (ASSETS-OWED.md).
 */
const PRIZES = [
  { label: "$10 off", long: "$10 off your next service", weight: 30 },
  { label: "Free protein", long: "A free protein treatment add-on ($20 value)", weight: 22 },
  { label: "Free bang trim", long: "A free bang trim with any service", weight: 16 },
  { label: "$15 off braids", long: "$15 off any braid style", weight: 14 },
  { label: "Free consult", long: "A free consultation ($50 value)", weight: 12 },
  { label: "$20 off color", long: "$20 off any color service", weight: 6 },
] as const;

let shownThisVisit = false;

export function SpiralPopup() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"form" | "spinning" | "won">("form");
  const [angle, setAngle] = useState(0);
  const [prize, setPrize] = useState<number | null>(null);
  const [code, setCode] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const show = useCallback(() => {
    if (shownThisVisit) return;
    shownThisVisit = true;
    setOpen(true);
  }, []);

  useEffect(() => {
    if (shownThisVisit || pathname.startsWith("/book") || pathname.startsWith("/portal")) return;
    const t = window.setTimeout(show, 35000);
    const onLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !e.relatedTarget) show();
    };
    const onScroll = () => {
      if (window.matchMedia("(max-width: 767px)").matches) {
        const p = window.scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        if (p > 0.55) show();
      }
    };
    document.addEventListener("mouseout", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("mouseout", onLeave);
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname, show]);

  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open]);

  async function spin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (data.get("company")) return;
    // weighted pick
    const total = PRIZES.reduce((n, p) => n + p.weight, 0);
    let r = Math.random() * total;
    let idx = 0;
    for (let i = 0; i < PRIZES.length; i++) {
      r -= PRIZES[i].weight;
      if (r <= 0) {
        idx = i;
        break;
      }
    }
    const seg = 360 / PRIZES.length;
    // pointer at top: rotate so segment idx center lands at 0deg
    const target = 360 * 6 + (360 - (idx * seg + seg / 2));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setStep("spinning");
    setAngle(target);
    const c = `SPIRAL-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    setCode(c);
    data.set("prize", `${PRIZES[idx].long} (${c})`);
    void postNetlifyForm(data);
    window.setTimeout(
      () => {
        setPrize(idx);
        setStep("won");
      },
      reduce ? 50 : 4700,
    );
  }

  if (!open) return null;
  const seg = 360 / PRIZES.length;

  return (
    <div className="fixed inset-0 z-[120] grid place-items-center p-3" role="dialog" aria-modal="true" aria-labelledby="spiral-title">
      <button className="absolute inset-0 bg-ink/80 backdrop-blur-sm" aria-label="Close" onClick={() => setOpen(false)} tabIndex={-1} />
      <div className="relative max-h-[calc(100svh-1.5rem)] w-full max-w-[52rem] overflow-y-auto rounded-[1.6rem] border border-white/10 bg-onyx shadow-[0_40px_120px_-30px_rgba(249,37,5,.45)]">
        <button ref={closeRef} onClick={() => setOpen(false)} className="absolute right-3 top-3 z-10 grid size-11 place-items-center rounded-full text-mist hover:bg-white/5 hover:text-paper" aria-label="Close">
          <X className="size-5" />
        </button>
        <div className="grid items-center gap-6 p-5 sm:p-8 md:grid-cols-[1fr_1fr] md:gap-8">
          {/* WHEEL */}
          <div className="relative mx-auto aspect-square w-full max-w-[min(17rem,34svh)] md:max-w-[min(22rem,60svh)]">
            <div aria-hidden className="absolute left-1/2 top-[-6px] z-10 -translate-x-1/2">
              <svg width="26" height="30" viewBox="0 0 26 30">
                <path d="M13 30 2 4a12 12 0 1 1 22 0L13 30Z" fill="#f4f1ee" />
                <circle cx="13" cy="10" r="4" fill="#c8140e" />
              </svg>
            </div>
            <svg
              viewBox="-110 -110 220 220"
              className="size-full"
              style={{ transform: `rotate(${angle}deg)`, transition: step === "form" ? "none" : "transform 4.5s cubic-bezier(.16,1,.3,1)" }}
              aria-hidden
            >
              <circle r="108" fill="#0b0a0a" stroke="#f92505" strokeWidth="2" />
              {PRIZES.map((p, i) => {
                const a0 = ((i * seg - 90) * Math.PI) / 180;
                const a1 = (((i + 1) * seg - 90) * Math.PI) / 180;
                const x0 = Math.cos(a0) * 104;
                const y0 = Math.sin(a0) * 104;
                const x1 = Math.cos(a1) * 104;
                const y1 = Math.sin(a1) * 104;
                const mid = i * seg + seg / 2;
                return (
                  <g key={p.label}>
                    <path d={`M0 0L${x0.toFixed(2)} ${y0.toFixed(2)}A104 104 0 0 1 ${x1.toFixed(2)} ${y1.toFixed(2)}Z`} fill={i % 2 ? "#1c1919" : "#c8140e"} stroke="#0b0a0a" strokeWidth="1.5" />
                    <text
                      transform={`rotate(${mid}) translate(0 -64) rotate(${mid > 90 && mid < 270 ? 180 : 0})`}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="#f4f1ee"
                      fontSize="9.5"
                      fontFamily="Jost, sans-serif"
                      letterSpacing=".04em"
                    >
                      {p.label}
                    </text>
                  </g>
                );
              })}
              <circle r="30" fill="#0b0a0a" stroke="#f4f1ee" strokeOpacity=".2" />
              <g transform={`translate(-22 -22) scale(${44 / SPIRAL.w})`}>
                <path d={SPIRAL.d} fill="none" stroke="#f92505" strokeWidth={24} strokeLinecap="round" />
              </g>
            </svg>
          </div>

          {/* COPY / FORM */}
          <div>
            {step !== "won" ? (
              <>
                <p className="eyebrow flex items-center gap-2 text-silver">
                  <Gift className="size-4 text-flare" aria-hidden /> A little gift
                </p>
                <h2 id="spiral-title" className="display mt-3 text-[2.6rem] leading-[0.95] text-bone sm:text-5xl">
                  Spin the <span className="script text-[1.25em] leading-[0.6] text-flare">Spiral</span>
                </h2>
                <p className="mt-3 text-mist/85">Every spin wins something for your next visit to I Am Image. Where should we send it?</p>
                <form ref={formRef} name="spin-the-spiral" method="POST" onSubmit={spin} className="mt-5 grid gap-3">
                  <input type="hidden" name="form-name" value="spin-the-spiral" />
                  <input type="hidden" name="prize" value="" />
                  <p className="hidden">
                    <label>
                      Company <input name="company" tabIndex={-1} autoComplete="off" />
                    </label>
                  </p>
                  <label className="sr-only" htmlFor="sp-name">
                    First name
                  </label>
                  <input id="sp-name" name="name" required autoComplete="given-name" placeholder="First name" autoFocus className="min-h-12 rounded-xl border border-white/12 bg-ink px-4 text-bone placeholder:text-silver/70 focus:border-flare focus:outline-none" />
                  <label className="sr-only" htmlFor="sp-email">
                    Email
                  </label>
                  <input id="sp-email" name="email" type="email" required autoComplete="email" placeholder="Email" className="min-h-12 rounded-xl border border-white/12 bg-ink px-4 text-bone placeholder:text-silver/70 focus:border-flare focus:outline-none" />
                  <button disabled={step === "spinning"} className="btn btn-primary mt-1 disabled:opacity-70">
                    {step === "spinning" ? "Spinning…" : "Spin the spiral"}
                  </button>
                  <p className="text-[0.72rem] leading-relaxed text-silver">One spin per guest. New and returning clients welcome. By spinning you agree to receive occasional emails from I Am Image — unsubscribe any time. Demo offers: final prizes and terms are set by the salon.</p>
                </form>
              </>
            ) : (
              <div role="status">
                <p className="eyebrow text-flare">You won</p>
                <h2 id="spiral-title" className="display mt-3 text-4xl leading-tight text-bone sm:text-5xl">
                  {PRIZES[prize!].long}
                </h2>
                <p className="mt-4 text-mist/85">
                  Mention code <strong className="rounded-md bg-red/15 px-2 py-0.5 font-medium tracking-[0.12em] text-paper">{code}</strong> when you book — screenshot this so you have it.
                </p>
                <Link href={BOOK_HREF} onClick={() => setOpen(false)} className="btn btn-primary mt-6">
                  <CalendarHeart className="size-4" aria-hidden /> Book now & use it
                </Link>
                <button onClick={() => setOpen(false)} className="mt-3 block min-h-11 text-sm text-silver hover:text-paper">
                  Maybe later
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
