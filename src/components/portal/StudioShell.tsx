"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { CalendarDays, CalendarHeart, ClipboardList, Crown, ExternalLink, LayoutDashboard, LogOut, Menu, Settings2, Users, UsersRound, Wallet, X } from "lucide-react";
import { STAFF, STAFF_BY_KEY, scopeOf, setViewAs, signIn, signOut, useDB, useMounted } from "@/lib/portal/db";
import type { StaffKey } from "@/lib/services";
import { Loading, PortalLogo } from "./ui";
import { cn } from "@/lib/cn";

const NAV = [
  { href: "/portal/studio", label: "Overview", icon: LayoutDashboard, owner: false },
  { href: "/portal/studio/calendar", label: "Calendar", icon: CalendarDays, owner: false },
  { href: "/portal/studio/appointments", label: "Appointments", icon: ClipboardList, owner: false },
  { href: "/portal/studio/clients", label: "Clients & journeys", icon: Users, owner: false },
  { href: "/portal/studio/finances", label: "Finances", icon: Wallet, owner: true },
  { href: "/portal/studio/team", label: "Team & payroll", icon: UsersRound, owner: true },
  { href: "/portal/studio/settings", label: "Services & hours", icon: Settings2, owner: true },
];

export function StudioShell({ children }: { children: React.ReactNode }) {
  const mounted = useMounted();
  const pathname = usePathname();
  const router = useRouter();
  const session = useDB((s) => s.session);
  const [open, setOpen] = useState(false);

  if (!mounted) return <Loading />;
  const role = session.role;
  if (role !== "owner" && role !== "stylist")
    return (
      <div className="wrap grid min-h-[80svh] place-items-center text-center">
        <div className="max-w-md">
          <Crown className="mx-auto size-10 text-flare" aria-hidden />
          <h1 className="display mt-4 text-5xl text-bone">Salon studio</h1>
          <p className="mt-3 text-mist/80">For Kayla and the I Am Image team. For the demo, open it with one tap.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button onClick={() => signIn("owner", "Google")} className="btn btn-primary">
              Enter as Kayla (owner)
            </button>
            <button onClick={() => signIn("stylist", "Google", "alcion")} className="btn btn-ghost">
              Enter as Alcion (stylist)
            </button>
          </div>
        </div>
      </div>
    );

  const isOwner = role === "owner";
  const scope = scopeOf(session);
  const items = NAV.filter((n) => isOwner || !n.owner);
  const ownerOnly = NAV.find((n) => n.owner && (pathname === n.href || pathname.startsWith(`${n.href}/`)));

  const nav = (
    <nav aria-label="Studio" className="flex flex-col gap-1">
      {items.map((n) => {
        const active = n.href === "/portal/studio" ? pathname === n.href : pathname.startsWith(n.href);
        return (
          <Link
            key={n.href}
            href={n.href}
            onClick={() => setOpen(false)}
            className={cn("flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm transition", active ? "bg-gradient-to-r from-red/20 to-transparent font-medium text-paper" : "text-mist/75 hover:bg-white/5 hover:text-paper")}
            aria-current={active ? "page" : undefined}
          >
            <n.icon className={cn("size-[18px]", active ? "text-flare" : "text-silver")} aria-hidden />
            {n.label}
          </Link>
        );
      })}
    </nav>
  );

  const who = (
    <div className="rounded-2xl border border-white/10 p-3">
      <p className="text-[11px] uppercase tracking-[0.16em] text-silver">{isOwner ? "Owner" : "Stylist"}</p>
      <p className="mt-0.5 text-bone">{isOwner ? "Kayla Means" : STAFF_BY_KEY[session.staff!].name}</p>
      {isOwner && (
        <label className="mt-3 block text-xs text-silver">
          Viewing
          <select value={scope} onChange={(e) => setViewAs(e.target.value as StaffKey | "all")} className="mt-1 h-10 w-full rounded-lg border border-white/12 bg-ink px-2 text-sm text-bone">
            <option value="all">Whole salon</option>
            {STAFF.map((s) => (
              <option key={s.key} value={s.key}>
                {s.name}
              </option>
            ))}
          </select>
        </label>
      )}
    </div>
  );

  const extras = (
    <div className="space-y-1 border-t border-white/10 pt-4 text-sm">
      <Link href="/book" className="flex min-h-11 items-center gap-2 text-mist/75 hover:text-paper">
        <CalendarHeart className="size-4" aria-hidden /> Client booking view
      </Link>
      <Link href="/" className="flex min-h-11 items-center gap-2 text-mist/75 hover:text-paper">
        <ExternalLink className="size-4" aria-hidden /> View website
      </Link>
      <button
        onClick={() => {
          signOut();
          router.push("/portal");
        }}
        className="flex min-h-11 w-full items-center gap-2 text-mist/75 hover:text-paper"
      >
        <LogOut className="size-4" aria-hidden /> Sign out
      </button>
    </div>
  );

  return (
    <div className="lg:grid lg:grid-cols-[264px_1fr]">
      <aside className="sticky top-0 hidden h-[calc(100svh-28px)] flex-col gap-6 overflow-y-auto border-r border-white/[0.07] bg-onyx p-5 lg:flex">
        <PortalLogo href="/portal/studio" sub={isOwner ? "Owner studio" : "Stylist studio"} />
        {who}
        <div className="flex-1">{nav}</div>
        {extras}
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-white/[0.07] bg-ink/90 px-4 py-3 backdrop-blur-xl lg:hidden">
          <button onClick={() => setOpen(true)} className="grid size-11 place-items-center rounded-full text-bone" aria-label="Open menu">
            <Menu className="size-5" />
          </button>
          <PortalLogo href="/portal/studio" sub={isOwner ? "Owner studio" : "Stylist studio"} />
        </header>
        {open && (
          <div className="fixed inset-0 z-[70] lg:hidden" role="dialog" aria-modal="true" aria-label="Studio menu">
            <button className="absolute inset-0 bg-ink/70" onClick={() => setOpen(false)} aria-label="Close menu" />
            <div className="absolute inset-y-0 left-0 flex w-[min(19rem,86vw)] flex-col gap-5 overflow-y-auto overscroll-contain bg-onyx p-5">
              <div className="flex items-center justify-between">
                <PortalLogo href="/portal/studio" sub={isOwner ? "Owner studio" : "Stylist studio"} />
                <button onClick={() => setOpen(false)} className="grid size-11 place-items-center text-bone" aria-label="Close menu">
                  <X className="size-5" />
                </button>
              </div>
              {who}
              <div className="flex-1">{nav}</div>
              {extras}
            </div>
          </div>
        )}
        <div className="px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
          {ownerOnly && !isOwner ? (
            <div className="card-night p-8 text-center">
              <p className="text-xl text-bone">Owner only</p>
              <p className="mt-2 text-mist/80">Stylists see only their own calendar, clients and earnings.</p>
            </div>
          ) : (
            children
          )}
        </div>
      </div>
    </div>
  );
}

export function PageHead({ title, sub, action }: { title: string; sub?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="display text-4xl text-bone sm:text-5xl">{title}</h1>
        {sub && <p className="mt-2 text-mist/75">{sub}</p>}
      </div>
      {action}
    </div>
  );
}
