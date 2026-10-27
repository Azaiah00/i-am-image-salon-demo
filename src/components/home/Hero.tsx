"use client";

import Link from "next/link";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ArrowRight, CalendarHeart } from "lucide-react";
import { BOOK_HREF, SITE } from "@/lib/site";
import { SPIRAL } from "@/lib/brand";
import { Stars } from "@/components/ui/Kit";
import { cn } from "@/lib/cn";

/**
 * SIGNATURE HERO — "One woman. Every image."
 * The same red line-art woman (generated on Kie.ai, then traced to SVG centerlines,
 * public/media/hero/lines.json). Her face and shoulders (`base`) are drawn once in bone;
 * only her HAIR redraws in logo red, cycling through the four styles I Am Image is known
 * for: locs → knotless braids → silk press → color & cut. The logo's spiral spins above
 * her like a thought each time she changes. Visitors can tap a style to change it.
 * Honors prefers-reduced-motion (static, no autoplay) and pauses off-screen.
 */
const FRAMES = [
  { key: "locs", label: "Locs", caption: "Starter locs · retwists · interlocking", href: "/services/locs" },
  { key: "braids", label: "Braids", caption: "Knotless · box · Fulani · boho", href: "/services/braids" },
  { key: "silkpress", label: "Silk Press", caption: "Cécred silk press · blowouts · treatments", href: "/services/silk-press" },
  { key: "pixie", label: "Color & Cut", caption: "Pixies · precision cuts · color", href: "/services/color-and-cuts" },
] as const;

const HOLD = 3.6; // seconds each style is held

/** Strokes are pre-merged into ~10 bucket paths per layer (top → bottom) so only ~54 SVG
 *  elements animate. Each bucket's dash length = its longest strand, so every strand in a
 *  bucket draws at the same pen speed (dash patterns restart per subpath). */
type Part = { d: string; len: number };
type Lines = { w: number; h: number; base: Part[]; frames: { key: string; parts: Part[] }[] };

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [lines, setLines] = useState<Lines | null>(null);
  const [active, setActive] = useState(0);
  const [ready, setReady] = useState(false);
  const activeRef = useRef(0);
  const busy = useRef(false);
  const auto = useRef<gsap.core.Tween | null>(null);
  const progress = useRef<HTMLSpanElement[]>([]);
  const reduce = useRef(false);
  const visible = useRef(true);
  const goRef = useRef<(n: number) => void>(() => {});

  useEffect(() => {
    let alive = true;
    // Load the line art after first paint so it never competes with the headline (LCP).
    const go = () =>
      fetch("/media/hero/lines.json")
        .then((r) => r.json())
        .then((d: Lines) => alive && setLines(d))
        .catch(() => {});
    const idle = (cb: () => void) => {
      if (typeof window.requestIdleCallback === "function") window.requestIdleCallback(cb, { timeout: 1200 });
      else setTimeout(cb, 300);
    };
    if (document.readyState === "complete") idle(go);
    else window.addEventListener("load", () => idle(go), { once: true });
    return () => {
      alive = false;
    };
  }, []);

  const q = useCallback((sel: string) => Array.from(svgRef.current?.querySelectorAll<SVGPathElement>(sel) ?? []), []);

  /** Restart the auto-advance timer (and the chip's progress bar). */
  const schedule = useCallback(() => {
    auto.current?.kill();
    progress.current.forEach((p) => p && gsap.set(p, { scaleX: 0 }));
    if (reduce.current) return;
    const bar = progress.current[activeRef.current];
    auto.current = gsap.to(bar ?? {}, {
      scaleX: 1,
      duration: HOLD,
      ease: "none",
      onComplete: () => goRef.current((activeRef.current + 1) % FRAMES.length),
    });
    if (!visible.current || document.hidden) auto.current.pause();
  }, []);

  const go = useCallback(
    (next: number) => {
      if (busy.current || next === activeRef.current || !svgRef.current) return;
      busy.current = true;
      auto.current?.kill();
      const prev = activeRef.current;
      activeRef.current = next;
      setActive(next);
      const out = q(`g[data-f="${prev}"] path`);
      const inn = q(`g[data-f="${next}"] path`);
      const tl = gsap.timeline({
        onComplete: () => {
          busy.current = false;
          schedule();
        },
      });
      // the spiral turns, like a thought
      tl.to(".hero-spiral", { rotate: "+=200", scale: 1.08, duration: 1.1, ease: "power2.inOut", transformOrigin: "50% 50%" }, 0)
        .to(".hero-spiral", { scale: 1, duration: 0.8, ease: "power2.out" }, 1.1)
        // mirror glint sweeps across her
        .fromTo(".hero-glint", { xPercent: -120, opacity: 0 }, { xPercent: 120, opacity: 1, duration: 1.5, ease: "power2.inOut" }, 0.1)
        .to(".hero-glint", { opacity: 0, duration: 0.3 }, 1.35)
        // old hair retracts…
        .to(out, { strokeDashoffset: (_i: number, el: SVGPathElement) => Number(el.dataset.len), duration: 0.9, ease: "power2.in", stagger: { amount: 0.35, from: "end" } }, 0)
        // …new hair draws on
        .set(`g[data-f="${next}"]`, { autoAlpha: 1 }, 0.5)
        .to(inn, { strokeDashoffset: 0, duration: 1.3, ease: "power2.inOut", stagger: { amount: 0.55, from: "start" } }, 0.55)
        .set(`g[data-f="${prev}"]`, { autoAlpha: 0 }, ">");
    },
    [q, schedule],
  );
  useEffect(() => {
    goRef.current = go;
  }, [go]);

  // Intro: base draws, then the first hairstyle, then autoplay.
  useEffect(() => {
    if (!lines || !svgRef.current) return;
    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      const base = q("g.base path");
      const first = q('g[data-f="0"] path');
      if (reduce.current) {
        gsap.set([...base, ...first], { strokeDashoffset: 0 });
        gsap.set('g[data-f="0"]', { autoAlpha: 1 });
        gsap.set(".hero-spiral path", { strokeDashoffset: 0 });
        setReady(true);
        return;
      }
      const tl = gsap.timeline({ delay: 0.15, onComplete: () => (setReady(true), schedule()) });
      tl.to(".hero-spiral path", { strokeDashoffset: 0, duration: 2.2, ease: "power2.out" }, 0)
        .to(base, { strokeDashoffset: 0, duration: 1.6, ease: "power2.inOut", stagger: { amount: 0.8 } }, 0.1)
        .set('g[data-f="0"]', { autoAlpha: 1 }, 0.9)
        .to(first, { strokeDashoffset: 0, duration: 1.6, ease: "power2.inOut", stagger: { amount: 0.7 } }, 0.95);
      gsap.to(".hero-stage", { y: -6, duration: 5, ease: "sine.inOut", yoyo: true, repeat: -1 });
    }, root.current ?? undefined);
    return () => {
      auto.current?.kill();
      ctx.revert();
    };
  }, [lines, q, schedule]);

  // Pause autoplay while off-screen or the tab is hidden.
  useEffect(() => {
    if (!root.current) return;
    const io = new IntersectionObserver(([e]) => {
      visible.current = e.isIntersecting;
      if (e.isIntersecting) auto.current?.resume();
      else auto.current?.pause();
    });
    io.observe(root.current);
    const vis = () => (document.hidden ? auto.current?.pause() : visible.current && auto.current?.resume());
    document.addEventListener("visibilitychange", vis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", vis);
    };
  }, []);

  // Desktop pointer parallax on the stage.
  useEffect(() => {
    const el = root.current?.querySelector<HTMLElement>(".hero-parallax");
    if (!el || window.matchMedia("(pointer: coarse), (prefers-reduced-motion: reduce)").matches) return;
    const qx = gsap.quickTo(el, "x", { duration: 1.2, ease: "power3.out" });
    const qy = gsap.quickTo(el, "y", { duration: 1.2, ease: "power3.out" });
    const on = (e: PointerEvent) => {
      qx((e.clientX / window.innerWidth - 0.5) * -16);
      qy((e.clientY / window.innerHeight - 0.5) * -10);
    };
    window.addEventListener("pointermove", on, { passive: true });
    return () => window.removeEventListener("pointermove", on);
  }, []);

  const f = FRAMES[active];

  return (
    <section ref={root} aria-labelledby="hero-title" className="relative min-h-[100svh] overflow-hidden bg-ink">
      {/* ambient red bloom + floor reflection line */}
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-[6%] size-[26rem] -translate-x-1/2 rounded-full bg-crimson/[0.14] blur-[90px] lg:left-[68%] lg:top-[16%] lg:size-[46rem] lg:blur-[110px]" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" />

      {/* STAGE */}
      <div className="hero-parallax absolute inset-x-0 top-[4.25rem] flex h-[45svh] justify-center md:h-[40svh] lg:inset-y-0 lg:left-[52%] lg:right-0 lg:top-0 lg:h-auto lg:items-center xl:left-[42%]">
        <div className="hero-stage relative h-full w-full max-w-[min(92vw,640px)] lg:h-[86svh] lg:max-w-none">
          {lines && <Figure lines={lines} svgRef={svgRef} />}
          <div aria-hidden className="hero-glint pointer-events-none absolute inset-y-0 left-1/4 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/[0.07] to-transparent opacity-0" />
        </div>
      </div>
      {/* mobile veil so copy reads over the figure */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 top-[34svh] bg-gradient-to-b from-transparent via-ink/90 via-[38%] to-ink lg:hidden" />

      {/* COPY */}
      <div className="wrap relative z-10 flex min-h-[100svh] flex-col justify-end pb-8 pt-[47svh] lg:justify-center lg:pb-10 lg:pt-28">
        <div className="max-w-[38rem]">
          <p className="eyebrow flex flex-wrap items-center gap-x-3 gap-y-1 text-silver">
            <span className="text-flare">NW Portland</span>
            <span aria-hidden className="h-px w-6 bg-red/70" />
            <span>Since 2011</span>
            <span aria-hidden className="h-px w-6 bg-red/70" />
            <span>Women · Men · Kids</span>
          </p>
          <h1 id="hero-title" className="display mt-4 text-[clamp(2.45rem,6.6vw,4.7rem)] text-bone lg:mt-5">
            <span className="block">Elevate your look.</span>
            <span className="block">
              Empower your <span className="script text-[1.3em] leading-[0.6] text-flare">image.</span>
            </span>
          </h1>
          <p className="mt-4 max-w-md text-base leading-relaxed text-mist/90 sm:text-lg lg:mt-6">
            Locs, braids, Cécred silk presses, color, precision cuts and sew-ins — by stylists who listen first and personalize every visit.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3 lg:mt-8">
            <Link href={BOOK_HREF} className="btn btn-primary">
              <CalendarHeart className="size-4" aria-hidden /> Book your appointment
            </Link>
            <Link href="/services" className="btn btn-ghost">
              See the menu <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
          <a href={SITE.googleReviewsUrl} target="_blank" rel="noopener" className="mt-4 inline-flex min-h-11 items-center gap-3 text-sm text-mist/90 hover:text-paper">
            <Stars />
            <span>
              <strong className="font-semibold text-paper">5.0</strong> from {SITE.rating.count} Google reviews
            </span>
          </a>

          {/* Style switcher — tap to change her hair */}
          <div className="mt-5 border-t border-white/[0.08] pt-5">
            <p className="eyebrow text-[0.66rem] text-silver" id="style-switch-label">
              One woman. Every image. <span className="sr-only">Choose a hairstyle to see it drawn.</span>
            </p>
            <div role="group" aria-labelledby="style-switch-label" className="mt-3 grid grid-cols-4 gap-1.5 sm:gap-2">
              {FRAMES.map((fr, i) => (
                <button
                  key={fr.key}
                  type="button"
                  onClick={() => go(i)}
                  aria-pressed={i === active}
                  disabled={!ready}
                  className={cn(
                    "relative min-h-11 overflow-hidden rounded-full border px-2 text-[0.8rem] tracking-[0.04em] transition-colors disabled:cursor-default sm:text-sm",
                    i === active ? "border-red/70 bg-red/10 text-paper" : "border-white/12 text-mist/80 hover:border-white/30 hover:text-paper",
                  )}
                >
                  {fr.label}
                  <span
                    ref={(el) => {
                      if (el) progress.current[i] = el;
                    }}
                    aria-hidden
                    className="absolute inset-x-3 bottom-1 h-px origin-left scale-x-0 bg-red"
                  />
                </button>
              ))}
            </div>
            <p className="mt-3 text-sm text-silver" aria-live="polite">
              <Link href={f.href} className="inline-flex min-h-11 items-center gap-2 hover:text-paper">
                {f.caption} <ArrowRight className="size-3.5 text-flare" aria-hidden />
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

const Figure = memo(function Figure({ lines, svgRef }: { lines: Lines; svgRef: React.RefObject<SVGSVGElement | null> }) {
  // Spiral sits above her head, like the logo's spiral above the "I".
  const s = 0.36;
  return (
    <svg
      ref={svgRef}
      viewBox={`-60 -150 ${lines.w + 120} ${lines.h + 160}`}
      preserveAspectRatio="xMidYMid meet"
      className="hero-svg absolute inset-0 size-full"
      role="img"
      aria-label="Red line drawing of a woman whose hairstyle changes between locs, knotless braids, a silk press and a pixie cut"
    >
      <g transform={`translate(${lines.w * 0.56} -150) scale(${s})`}>
        <g className="hero-spiral-slow">
          <g className="hero-spiral">
          <path d={SPIRAL.d} fill="none" stroke="#f92505" strokeWidth={9} strokeLinecap="round" strokeDasharray={SPIRAL.len} strokeDashoffset={SPIRAL.len} opacity={0.9} />
          </g>
        </g>
      </g>
      <g className="base" fill="none" stroke="#f4f1ee" strokeOpacity={0.88} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        {lines.base.map((p, i) => (
          <path key={i} d={p.d} strokeDasharray={`${p.len} ${p.len}`} strokeDashoffset={p.len} data-len={p.len} />
        ))}
      </g>
      {lines.frames.map((fr, fi) => (
        <g key={fr.key} data-f={fi} className="hair" fill="none" stroke="#f92505" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" style={{ visibility: "hidden" }}>
          {fr.parts.map((p, i) => (
            <path key={i} d={p.d} strokeDasharray={`${p.len} ${p.len}`} strokeDashoffset={p.len} data-len={p.len} />
          ))}
        </g>
      ))}
      <style>{`
        .hero-spiral-slow { transform-box: fill-box; transform-origin: 50% 50%; animation: spin-slow 60s linear infinite; }
        @media (prefers-reduced-motion: reduce) { .hero-spiral-slow { animation: none; } }
        @media (min-width: 1024px) and (prefers-reduced-motion: no-preference) {
          .hero-svg .hair { filter: drop-shadow(0 0 5px rgba(249,37,5,.55)); }
        }
      `}</style>
    </svg>
  );
});
