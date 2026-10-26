"use client";

import { useState } from "react";
import { Check, Send } from "lucide-react";
import { postNetlifyForm } from "@/lib/forms";
import { SITE } from "@/lib/site";

const field =
  "mt-1.5 w-full rounded-xl border border-white/12 bg-ink/70 px-4 py-3 text-bone placeholder:text-silver/70 focus:border-flare focus:outline-none";
const label = "text-sm text-mist/85";

function useSubmit() {
  const [state, setState] = useState<"idle" | "sending" | "ok" | "preview" | "err">("idle");
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    if (data.get("company")) return; // honeypot
    setState("sending");
    const r = await postNetlifyForm(data);
    setState(r);
    if (r === "ok") form.reset();
  }
  return { state, onSubmit };
}

function Status({ state, ok }: { state: string; ok: string }) {
  if (state === "preview") return <p className="text-sm text-warn">Preview mode: forms send once the site is deployed on Netlify.</p>;
  if (state === "err")
    return (
      <p className="text-sm text-flare">
        Something went wrong. Please call {SITE.phone} instead.
      </p>
    );
  if (state === "ok")
    return (
      <p className="flex items-center gap-2 rounded-xl bg-ok/15 px-4 py-3 text-bone" role="status">
        <Check className="size-5 text-ok" aria-hidden /> {ok}
      </p>
    );
  return null;
}

function Honeypot() {
  return (
    <p className="hidden">
      <label>
        Company <input name="company" tabIndex={-1} autoComplete="off" />
      </label>
    </p>
  );
}

export function ContactForm() {
  const { state, onSubmit } = useSubmit();
  return (
    <form name="contact" method="POST" onSubmit={onSubmit} className="grid gap-4">
      <input type="hidden" name="form-name" value="contact" />
      <Honeypot />
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={label}>
          Name
          <input name="name" required autoComplete="name" className={field} />
        </label>
        <label className={label}>
          Phone
          <input name="phone" type="tel" autoComplete="tel" className={field} />
        </label>
      </div>
      <label className={label}>
        Email
        <input name="email" type="email" required autoComplete="email" className={field} />
      </label>
      <label className={label}>
        What can we help with?
        <select name="topic" className={field} defaultValue="A question about a service">
          <option>A question about a service</option>
          <option>Pricing for my hair</option>
          <option>Bridal / event hair</option>
          <option>Something else</option>
        </select>
      </label>
      <label className={label}>
        Message
        <textarea name="message" required rows={4} className={field} placeholder="Tell us about your hair and the look you want" />
      </label>
      <button disabled={state === "sending"} className="btn btn-primary justify-self-start disabled:opacity-60">
        <Send className="size-4" aria-hidden /> {state === "sending" ? "Sending…" : "Send message"}
      </button>
      <Status state={state} ok="Thank you — your message is in. We’ll get back to you soon." />
    </form>
  );
}

export function CareersForm() {
  const { state, onSubmit } = useSubmit();
  return (
    <form name="careers" method="POST" onSubmit={onSubmit} className="grid gap-4">
      <input type="hidden" name="form-name" value="careers" />
      <Honeypot />
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={label}>
          Full name
          <input name="name" required autoComplete="name" className={field} />
        </label>
        <label className={label}>
          Phone
          <input name="phone" type="tel" required autoComplete="tel" className={field} />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={label}>
          Email
          <input name="email" type="email" required autoComplete="email" className={field} />
        </label>
        <label className={label}>
          Instagram / portfolio
          <input name="instagram" placeholder="@yourhandle" className={field} />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={label}>
          Oregon license
          <select name="license" className={field} defaultValue="Licensed cosmetologist">
            <option>Licensed cosmetologist</option>
            <option>Licensed barber</option>
            <option>Licensed (other)</option>
            <option>Student / apprentice</option>
            <option>Natural hair / braiding — tell us more</option>
          </select>
        </label>
        <label className={label}>
          Years behind the chair
          <select name="experience" className={field} defaultValue="3–5 years">
            <option>Under 1 year</option>
            <option>1–2 years</option>
            <option>3–5 years</option>
            <option>6–10 years</option>
            <option>10+ years</option>
          </select>
        </label>
      </div>
      <label className={label}>
        Specialties
        <input name="specialties" placeholder="Locs, braids, color, silk press, barbering…" className={field} />
      </label>
      <label className={label}>
        What are you looking for?
        <select name="looking-for" className={field} defaultValue="Let’s talk about options">
          <option>Let’s talk about options</option>
          <option>Booth / suite rental</option>
          <option>Commission</option>
          <option>Part-time</option>
        </select>
      </label>
      <label className={label}>
        Tell us about you
        <textarea name="message" rows={4} className={field} placeholder="Your story, your clientele, what you want to grow into" />
      </label>
      <button disabled={state === "sending"} className="btn btn-primary justify-self-start disabled:opacity-60">
        <Send className="size-4" aria-hidden /> {state === "sending" ? "Sending…" : "Send application"}
      </button>
      <Status state={state} ok="Application received — thank you! Kayla will be in touch." />
    </form>
  );
}
