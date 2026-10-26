// Flow audit: checks the BUILT HTML (run `npm run build` first).
// Titles, descriptions, one H1, image alts, NAP, emoji, placeholders,
// internal links and the full Square menu (names + prices) on /services.
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const APP = join(ROOT, ".next/server/app");
const fails = [];
const warn = [];
const ok = (c, m) => (c ? null : fails.push(m));

function walk(dir, out = []) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (f.endsWith(".html")) out.push(p);
  }
  return out;
}
const strip = (h) => h.replace(/<!-- -->/g, "").replace(/<script[\s\S]*?<\/script>/g, "").replace(/<style[\s\S]*?<\/style>/g, "");
const text = (h) => strip(h).replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, " ");

const files = walk(APP).filter((f) => !/_not-found|_global-error/.test(f));
const routes = new Set(files.map((f) => f.slice(APP.length).replace(/\.html$/, "").replace(/\/index$/, "") || "/"));
routes.add("/");
const isPortal = (r) => r.startsWith("/portal") || r === "/book";

for (const f of files) {
  const route = f.slice(APP.length).replace(/\.html$/, "").replace(/^\/index$/, "/") || "/";
  const html = readFileSync(f, "utf8");
  const body = strip(html);
  const t = ((html.match(/<title>([^<]*)<\/title>/) || [])[1] ?? "").replace(/&amp;/g, "&");
  const d = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1] ?? "";
  ok(t, `${route}: missing <title>`);
  if (!isPortal(route)) {
    if (t.length > 70) warn.push(`${route}: title ${t.length} chars — "${t}"`);
    ok(d.length >= 70 && d.length <= 165, `${route}: description ${d.length} chars`);
    const h1 = (body.match(/<h1[\s>]/g) || []).length;
    ok(h1 === 1, `${route}: ${h1} <h1> elements`);
    ok(/\(503\) 224-0399/.test(body), `${route}: phone missing`);
    ok(/1500 NW 18th Ave/.test(body), `${route}: address missing`);
    ok(/<link rel="canonical"/.test(html), `${route}: canonical missing`);
  }
  for (const img of body.match(/<img\b[^>]*>/g) || []) ok(/\balt="/.test(img), `${route}: <img> without alt: ${img.slice(0, 90)}`);
  const tx = text(html);
  ok(!/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(tx), `${route}: emoji in visible text`);
  ok(!/lorem|ipsum|TODO|TBD|undefined|NaN/.test(tx), `${route}: placeholder / debug text visible`);
  for (const m of body.matchAll(/href="(\/[^"#?]*)/g)) {
    const h = m[1].replace(/\/$/, "") || "/";
    if (/\.(png|jpg|webp|svg|xml|txt|webmanifest|html|ico)$/.test(h) || h.startsWith("/_next")) continue;
    ok(routes.has(h), `${route}: broken internal link ${h}`);
  }
  // wrong facts that must never appear
  ok(!/Mon(day)?[^.]{0,20}1:00 ?PM/.test(tx), `${route}: Yelp's 1 PM opening time shown`);
}

// Full menu vs the Square snapshot
const menu = readFileSync(join(ROOT, "scripts/square-menu-2026-10-26.txt"), "utf8").trim().split("\n");
const servicesHtml = text(readFileSync(join(APP, "services.html"), "utf8"));
const ts = readFileSync(join(ROOT, "src/lib/services.ts"), "utf8");
for (const line of menu) {
  const [name, price] = line.split("|");
  ok(ts.includes(`square: "${name}"`), `services.ts missing Square item "${name}"`);
  const num = (price.match(/\$([\d,]+)/) || [])[1];
  if (num) ok(servicesHtml.includes(`$${num.replace(/\.00$/, "")}`) || servicesHtml.includes(`$${num}`), `/services missing price $${num} (${name})`);
}
ok(existsSync(join(ROOT, "public/og.jpg")), "public/og.jpg missing");

console.log(`Checked ${files.length} pages, ${menu.length} menu items.`);
warn.forEach((w) => console.log("WARN", w));
if (fails.length) {
  fails.forEach((f) => console.log("FAIL", f));
  process.exit(1);
}
console.log("Flow audit passed.");
