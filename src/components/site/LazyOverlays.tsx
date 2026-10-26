"use client";

import dynamic from "next/dynamic";

/** Overlays not needed for first paint load after hydration. */
const SpiralPopup = dynamic(() => import("./SpiralPopup").then((m) => m.SpiralPopup), { ssr: false });

export function LazyOverlays() {
  return <SpiralPopup />;
}
