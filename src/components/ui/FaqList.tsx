import { Plus } from "lucide-react";
import { cn } from "@/lib/cn";

export function FaqList({ items, tone = "dark" }: { items: readonly { q: string; a: string }[]; tone?: "dark" | "light" }) {
  return (
    <div className={cn("divide-y", tone === "dark" ? "divide-white/[0.08] border-y border-white/[0.08]" : "divide-char/10 border-y border-char/10")}>
      {items.map((f) => (
        <details key={f.q} className="group">
          <summary className={cn("flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-5 text-left text-lg [&::-webkit-details-marker]:hidden", tone === "dark" ? "text-bone" : "text-char")}>
            {f.q}
            <Plus className={cn("size-5 shrink-0 transition-transform duration-300 group-open:rotate-45", tone === "dark" ? "text-flare" : "text-rouge")} aria-hidden />
          </summary>
          <p className={cn("max-w-3xl pb-6 leading-relaxed", tone === "dark" ? "text-mist/85" : "text-stone")}>{f.a}</p>
        </details>
      ))}
    </div>
  );
}
