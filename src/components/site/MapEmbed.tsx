"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import { SITE } from "@/lib/site";

/** Click-to-load Google map (keeps third-party scripts off the first paint). */
export function MapEmbed() {
  const [on, setOn] = useState(false);
  const q = encodeURIComponent(`I Am Image, ${SITE.address.street}, ${SITE.address.city}, ${SITE.address.region} ${SITE.address.zip}`);
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-card)] border border-white/[0.08] bg-onyx">
      {on ? (
        <iframe
          title="Map to I Am Image Salon"
          src={`https://www.google.com/maps?q=${q}&output=embed`}
          className="absolute inset-0 size-full grayscale-[0.35] invert-[0.92] hue-rotate-180"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <button onClick={() => setOn(true)} className="group absolute inset-0 grid place-items-center text-center">
          <span aria-hidden className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(244,241,238,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(244,241,238,.08)_1px,transparent_1px)] [background-size:44px_44px]" />
          <span className="relative">
            <span className="mx-auto grid size-14 place-items-center rounded-full bg-crimson text-paper shadow-[0_0_40px_rgba(249,37,5,.5)] transition group-hover:scale-110">
              <MapPin className="size-6" aria-hidden />
            </span>
            <span className="mt-4 block text-bone">Show the map</span>
            <span className="text-sm text-silver">1500 NW 18th Ave · Northwest District</span>
          </span>
        </button>
      )}
    </div>
  );
}
