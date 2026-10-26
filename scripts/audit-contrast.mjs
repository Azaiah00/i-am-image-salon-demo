// Contrast audit: reads the @theme hexes from globals.css and checks every
// text/background pair the design actually uses (see DESIGN.md) against WCAG AA.
import { readFileSync } from "node:fs";
const css = readFileSync(new URL("../src/app/globals.css", import.meta.url), "utf8");
const tok = Object.fromEntries([...css.matchAll(/--color-([a-z-]+):\s*(#[0-9a-f]{6})/gi)].map((m) => [m[1], m[2]]));
const lum = (hex) => {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};
// [text, background, minimum, note]
const PAIRS = [
  ["bone", "ink", 4.5, "headings / body on page"],
  ["mist", "ink", 4.5, "body text"],
  ["mist", "onyx", 4.5, "body text on alt sections"],
  ["silver", "ink", 4.5, "muted text"],
  ["silver", "onyx", 4.5, "muted text on alt sections"],
  ["silver", "graphite", 4.5, "muted text on cards"],
  ["flare", "ink", 4.5, "red links / accents on dark"],
  ["flare", "onyx", 4.5, "red links on alt sections"],
  ["flare", "graphite", 4.5, "red text on cards"],
  ["paper", "crimson", 4.5, "primary button text"],
  ["paper", "ember", 4.5, "primary button hover"],
  ["char", "bone", 4.5, "text on light sections"],
  ["stone", "bone", 4.5, "muted text on light"],
  ["stone", "paper", 4.5, "muted text on white cards"],
  ["rouge", "bone", 4.5, "red text on light"],
  ["rouge", "paper", 4.5, "red text on white cards"],
  ["red", "ink", 3, "large display / line art only"],
];
let bad = 0;
for (const [t, b, min, note] of PAIRS) {
  const r = ratio(tok[t], tok[b]);
  const pass = r >= min;
  if (!pass) bad++;
  console.log(`${pass ? "PASS" : "FAIL"} ${t} on ${b}: ${r.toFixed(2)}:1 (min ${min}) — ${note}`);
}
process.exit(bad ? 1 : 0);
