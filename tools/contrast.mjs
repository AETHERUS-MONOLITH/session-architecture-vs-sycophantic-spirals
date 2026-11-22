// Token contrast check (GATE1_PLAN section 6): WCAG 2.1 AA, 4.5:1 for text and 3:1 for non-text UI,
// in the light and the dark theme, on the tokens as resolved from source.css plus site.css.
// Usage: node tools/contrast.mjs [--out evidence/gate2]
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const css = (f) => fs.readFileSync(path.join(root, 'src/styles', f), 'utf8');
const vars = (block) => Object.fromEntries([...block.matchAll(/--([a-z-]+):\s*(#[0-9a-f]{6})/gi)].map((m) => [m[1], m[2].toLowerCase()]));
const src = css('source.css'), site = css('site.css');
const lightSrc = vars(src.match(/:root\s*\{([^}]*)\}/)[1]);
const darkSrc = vars(src.match(/:root\[data-theme="dark"\]\s*\{([^}]*)\}/)[1]);
const lightSite = vars(site.match(/:root\s*\{([^}]*)\}/)[1]);
const darkSite = vars((site.match(/:root\[data-theme="dark"\]\s*\{([^}]*)\}/) || ['', ''])[1]);
const themes = { light: { ...lightSrc, ...lightSite }, dark: { ...darkSrc, ...darkSite } };
const lum = (h) => { const c = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const PAIRS = [
  ['fg', 'bg', 4.5, 'body text on page'], ['fg', 'surface', 4.5, 'text in panels'], ['muted', 'surface', 4.5, 'hints, labels, dashed-cell text'],
  ['muted', 'bg', 4.5, 'muted text on page'], ['muted', 'hi', 4.5, 'lane label on a selected lane'], ['fg', 'hi', 4.5, 'text on a selected lane'],
  ['fg', 'core-soft', 4.5, 'tags, stat-p labels'], ['muted', 'core-soft', 4.5, 'plan key box text'], ['core-ink', 'core', 4.5, 'core cells, work blocks, pressed length button'],
  ['core-ink', 'model-b', 4.5, 'model-B work block labels'], ['core', 'surface', 4.5, 'stat-r label text'], ['surface', 'fg', 4.5, 'score block label'],
  ['ext', 'surface', 3, 'dashed extension border in panels'], ['ext', 'bg', 3, 'dashed status banner border on page'], ['core', 'surface', 3, 'work block, review border'],
  ['model-b', 'surface', 3, 'model-B blocks and borders'], ['indep', 'surface', 3, 'separate-instance border'], ['cut', 'surface', 3, 'cut bar'],
  ['fg', 'surface', 3, 'focus ring, selection ring'], ['core', 'core-soft', 3, 'structured-report border on hatch'],
];
const rows = []; let fail = 0;
for (const [t, v] of Object.entries(themes)) for (const [a, b, min, use] of PAIRS) {
  const r = ratio(v[a], v[b]); const ok = r >= min; if (!ok) fail++;
  rows.push({ theme: t, fg: `${a} ${v[a]}`, bg: `${b} ${v[b]}`, ratio: Math.round(r * 100) / 100, min, ok, use });
}
for (const r of rows) console.log(`${r.ok ? 'PASS' : 'FAIL'} ${r.theme.padEnd(5)} ${r.fg.padEnd(22)} on ${r.bg.padEnd(20)} ${String(r.ratio).padStart(5)} >= ${r.min}  ${r.use}`);
const i = process.argv.indexOf('--out');
if (i > 0) { const out = path.resolve(root, process.argv[i + 1]); fs.mkdirSync(out, { recursive: true }); fs.writeFileSync(path.join(out, 'contrast.md'), '# Token contrast (WCAG 2.1 AA)\n\n| Theme | Foreground | Background | Ratio | Minimum | Result | Use |\n|---|---|---|---|---|---|---|\n' + rows.map((r) => `| ${r.theme} | ${r.fg} | ${r.bg} | ${r.ratio} | ${r.min} | ${r.ok ? 'pass' : 'FAIL'} | ${r.use} |`).join('\n') + '\n'); }
console.log(fail ? `${fail} pair(s) below the minimum` : `all ${rows.length} pairs pass`);
process.exit(fail ? 1 : 0);
