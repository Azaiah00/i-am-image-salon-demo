"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LOGO, SPIRAL } from "@/lib/brand";

gsap.registerPlugin(ScrollTrigger);

/**
 * The logo's two faces (a Rubin vase that is also the "I"), drawn in red as you
 * scroll, then filled in bone — "two faces, one image". Scrubbed by scroll, so
 * the visitor literally draws the logo. Static and filled under reduced motion.
 */
export function MirrorFaces({ className }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    const outline = svg.querySelectorAll<SVGPathElement>(".mf-line");
    const fill = svg.querySelectorAll<SVGPathElement>(".mf-fill");
    const spiral = svg.querySelector<SVGPathElement>(".mf-spiral");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(outline, { strokeDashoffset: 0 });
      gsap.set(fill, { opacity: 1 });
      if (spiral) gsap.set(spiral, { strokeDashoffset: 0 });
      return;
    }
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: svg, start: "top 85%", end: "center 45%", scrub: 0.9 },
      });
      tl.to(spiral, { strokeDashoffset: 0, duration: 0.6 }, 0)
        .to(outline, { strokeDashoffset: 0, duration: 1 }, 0.1)
        .to(fill, { opacity: 1, duration: 0.35 }, 0.85)
        .to(outline, { opacity: 0.35, duration: 0.3 }, 0.95);
    }, svg);
    return () => ctx.revert();
  }, []);

  // crop: spiral (y 8..570) + vase (y 626..1691)
  return (
    <svg ref={ref} viewBox={`0 0 ${LOGO.w} 1700`} className={className} role="img" aria-label="The I Am Image logo: two faces in profile forming the letter I, with a red spiral above">
      <path className="mf-fill" d={LOGO.vase} fill="#f4f1ee" fillRule="evenodd" opacity={0} />
      <path className="mf-fill" d={LOGO.image} fill="#f92505" fillRule="evenodd" opacity={0} />
      <path
        className="mf-line"
        d={LOGO.vase}
        fill="none"
        stroke="#f92505"
        strokeWidth={4}
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1}
      />
      <g transform="translate(160 2)">
        <path className="mf-spiral" d={SPIRAL.d} fill="none" stroke="#f92505" strokeWidth={9} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1} />
      </g>
    </svg>
  );
}
