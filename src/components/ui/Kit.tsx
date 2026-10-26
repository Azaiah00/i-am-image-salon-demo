import { Camera, Star } from "lucide-react";
import { cn } from "@/lib/cn";

/** The logo's spiral, as a small inline glyph (single stroke). */
export function SpiralGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <path d="M12.6 12.1c-.4.5-1.3.4-1.6-.2-.4-.8.3-1.8 1.2-1.9 1.4-.2 2.4 1.2 2.1 2.5-.4 1.9-2.6 2.8-4.3 2.1-2.3-.9-3-3.8-1.9-5.8 1.3-2.5 4.6-3.3 7-2 2.9 1.6 3.6 5.4 2 8.1-1.9 3.2-6.2 4-9.2 2.1C4.7 15 3.9 10.2 6 6.8" />
    </svg>
  );
}

export function Eyebrow({ children, className, tone = "dark" }: { children: React.ReactNode; className?: string; tone?: "dark" | "light" }) {
  return (
    <p className={cn("eyebrow flex items-center gap-2", tone === "dark" ? "text-silver" : "text-stone", className)}>
      <SpiralGlyph className={cn("size-4 shrink-0", tone === "dark" ? "text-red" : "text-rouge")} />
      {children}
    </p>
  );
}

/** One accent word per heading, in the logo's "Salon" script, logo red. */
export function Accent({ children, tone = "dark" }: { children: React.ReactNode; tone?: "dark" | "light" }) {
  return <em className={cn("script not-italic pr-1 text-[1.18em] leading-[0.7]", tone === "dark" ? "text-flare" : "text-rouge")}>{children}</em>;
}

export function SectionTitle({
  eyebrow,
  title,
  intro,
  align = "left",
  tone = "dark",
  id,
  as: As = "h2",
}: {
  eyebrow: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  align?: "left" | "center";
  tone?: "dark" | "light";
  id?: string;
  as?: "h1" | "h2";
}) {
  return (
    <div className={cn("reveal max-w-2xl", align === "center" && "mx-auto text-center")}>
      <Eyebrow tone={tone} className={cn(align === "center" && "justify-center")}>
        {eyebrow}
      </Eyebrow>
      <As id={id} className={cn("display mt-4 text-[clamp(2.3rem,5.6vw,4.3rem)]", tone === "dark" ? "text-bone" : "text-char")}>
        {title}
      </As>
      {intro && <p className={cn("mt-5 text-base leading-relaxed sm:text-lg", tone === "dark" ? "text-mist/85" : "text-stone")}>{intro}</p>}
    </div>
  );
}

/** Responsive real photo: `src` is the path without extension; -640 variant for small screens. */
export function Img({
  src,
  alt,
  w,
  h,
  className,
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority = false,
  small = 640,
}: {
  src: string;
  alt: string;
  w: number;
  h: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
  small?: number;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`${src}.webp`}
      srcSet={`${src}-${small}.webp ${small}w, ${src}.webp ${w}w`}
      sizes={sizes}
      alt={alt}
      width={w}
      height={h}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      className={className}
    />
  );
}

/** Branded stand-in where the salon still owes a real photo. Never ships silently. */
export function PhotoSlot({ label, className, art }: { label: string; className?: string; art?: string }) {
  return (
    <div className={cn("relative grid place-items-center overflow-hidden rounded-[var(--radius-card)] border border-dashed border-flare/50 bg-onyx", className)}>
      {art && (
        // eslint-disable-next-line @next/next/no-img-element
        <img width={600} height={800} src={art} alt="" aria-hidden className="absolute inset-0 m-auto h-[82%] w-auto opacity-35" loading="lazy" />
      )}
      <div className="relative flex flex-col items-center gap-2 p-4 text-center">
        <Camera className="size-5 text-flare" aria-hidden />
        <span className="needs-tag">Needs real photo</span>
        <span className="text-xs text-silver">{label}</span>
      </div>
    </div>
  );
}

export function Stars({ className }: { className?: string }) {
  return (
    <span className={cn("flex text-red", className)} aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="size-4 fill-current" />
      ))}
    </span>
  );
}

export function PageHero({
  eyebrow,
  title,
  intro,
  art,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  art?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-white/5 bg-ink pb-16 pt-32 sm:pb-20 sm:pt-40">
      <div aria-hidden className="absolute -right-40 -top-40 size-[34rem] rounded-full bg-crimson/15 blur-3xl" />
      {art && (
        // eslint-disable-next-line @next/next/no-img-element
        <img width={600} height={800} src={art} alt="" aria-hidden loading="lazy" className="pointer-events-none absolute -bottom-6 right-[-6%] hidden h-[115%] w-auto opacity-55 md:block lg:right-[4%]" />
      )}
      <div className="wrap relative">
        <div className="max-w-2xl">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="display mt-4 text-[clamp(2.7rem,7vw,5.2rem)] text-bone">{title}</h1>
          {intro && <p className="mt-5 max-w-xl text-base leading-relaxed text-mist/85 sm:text-lg">{intro}</p>}
          {children}
        </div>
      </div>
    </section>
  );
}
