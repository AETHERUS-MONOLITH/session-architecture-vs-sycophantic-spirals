// Routes, anchors and links in dist/ (GATE1_PLAN section 7 D2-D4).
// Usage: node tools/linkcheck.mjs [--dist dist] [--out evidence/gate2]
//  D2 every anchor of GATE1_PLAN section 2 exists on its route (incl. the doc targets L1-L4)
//  D3 every internal href/src resolves to a file in dist/, and every #fragment to an id on the target page
//  D4 no claude.ai in any href or src; no external runtime requests (no http(s) URL in src, link href, CSS url())
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { JSDOM } from 'jsdom';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const DIST = path.resolve(root, opt('--dist', 'dist'));
const OUT = args.includes('--out') ? path.resolve(root, opt('--out')) : null;
const BASE = (process.env.SITE_BASE ?? '/session-architecture-vs-sycophantic-spirals/').replace(/\/?$/, '/');

const ANCHORS = {
  '/': ['top', 'tasks-outcomes', 'reference-model'],
  '/full/': ['top', 'grid', 'conditions', 'runs', 'hypotheses', 'handoff', 'status', 'stopping-rule', 'scoring', 'costs', 'open', 'artifacts', 'instance-state', 'error-path', 'changes', 'tasks-outcomes', 'reference-model',
    'h1', 'h2', 'h3', 'h5', 'h4', 'k1', 'k2', 'c2-c1', 'ref', 'test', 'firing', 'reported', 'evaluation-plan', 'fresh-context-review', 'limits'],
  '/grid/': ['grid', 'conditions', 'runs', 'lanes'],
  '/hypotheses/': ['hypotheses', 'h1', 'h2', 'h3', 'h5', 'h4', 'k1', 'k2', 'c2-c1', 'ref', 'test'],
  '/handoffs/': ['handoff'],
  '/scoring/': ['scoring'],
  '/stopping-rule/': ['stopping-rule', 'firing', 'reported', 'evaluation-plan', 'fresh-context-review', 'limits'],
  '/costs/': ['costs'],
  '/decisions/': ['status', 'open'],
  '/operations/': ['artifacts', 'instance-state', 'error-path'],
  '/changelog/': ['changes', 'versions', 'site-changes', 'ad-01'],
};
const DOC_TARGETS = { L1: '/full/', L2: '/stopping-rule/#stopping-rule', L3: '/costs/#costs', L4: '/scoring/#scoring' };

const htmlFiles = fs.readdirSync(DIST, { recursive: true }).filter((f) => f.endsWith('.html')).map((f) => path.join(DIST, f));
const docs = new Map();
const docFor = (file) => { if (!docs.has(file)) docs.set(file, new JSDOM(fs.readFileSync(file, 'utf8')).window.document); return docs.get(file); };
const routeOf = (file) => '/' + path.relative(DIST, path.dirname(file)).split(path.sep).filter(Boolean).map((s) => s + '/').join('');
const problems = [];
const stats = { pages: htmlFiles.length, internal_links: 0, anchor_links: 0, external_links: 0, claude_ai_hrefs: 0, external_runtime_requests: 0 };

function resolve(urlPath) {
  if (!urlPath.startsWith(BASE)) return null;
  let rel = decodeURIComponent(urlPath.slice(BASE.length));
  let f = path.join(DIST, rel);
  if (rel === '' || rel.endsWith('/')) f = path.join(f, 'index.html');
  return f;
}

// D2
const d2 = [];
for (const [route, ids] of Object.entries(ANCHORS)) {
  const f = path.join(DIST, route.slice(1), 'index.html');
  if (!fs.existsSync(f)) { problems.push(`D1/D2 route missing: ${route}`); continue; }
  const doc = docFor(f);
  for (const id of ids) { const ok = !!doc.getElementById(id); d2.push({ route, id, ok }); if (!ok) problems.push(`D2 anchor missing: ${route}#${id}`); }
}
for (const [k, t] of Object.entries(DOC_TARGETS)) {
  const [p, h] = t.split('#'); const f = path.join(DIST, p.slice(1), 'index.html');
  const ok = fs.existsSync(f) && (!h || !!docFor(f).getElementById(h));
  d2.push({ route: t, id: k, ok }); if (!ok) problems.push(`D2 doc target ${k} ${t} broken`);
}

// D3 + D4 in HTML
for (const file of htmlFiles) {
  const doc = docFor(file);
  const route = routeOf(file);
  for (const el of doc.querySelectorAll('[href],[src]')) {
    for (const attr of ['href', 'src']) {
      const v = el.getAttribute(attr);
      if (v === null) continue;
      if (/claude\.ai/i.test(v)) { stats.claude_ai_hrefs++; problems.push(`D4 claude.ai in ${attr} on ${route}: ${v}`); }
      if (/^[a-z]+:/i.test(v) || v.startsWith('//')) {
        stats.external_links++;
        if (attr === 'src' || el.tagName === 'LINK' || el.tagName === 'SCRIPT') { stats.external_runtime_requests++; problems.push(`external runtime request on ${route}: ${v}`); }
        else problems.push(`external link on ${route}: ${v} (the source has none)`);
        continue;
      }
      const [p, hash] = v.split('#');
      if (p === '') { // in-page anchor
        stats.anchor_links++;
        if (hash && !doc.getElementById(hash)) problems.push(`D3 broken in-page anchor on ${route}: #${hash}`);
        continue;
      }
      stats.internal_links++;
      const target = resolve(p.startsWith('/') ? p : new URL(p, 'http://x' + BASE + route.slice(1)).pathname);
      if (!target || !fs.existsSync(target)) { problems.push(`D3 broken link on ${route}: ${v}`); continue; }
      if (hash && target.endsWith('.html') && !docFor(target).getElementById(hash)) problems.push(`D3 missing anchor on ${route}: ${v}`);
    }
  }
}
// D4 in CSS and JS assets
for (const f of fs.readdirSync(DIST, { recursive: true }).filter((x) => /\.(css|js)$/.test(x))) {
  const text = fs.readFileSync(path.join(DIST, f), 'utf8');
  if (/claude\.ai/i.test(text)) problems.push(`claude.ai string in ${f}`);
  for (const m of text.matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/g)) {
    const u = m[1];
    if (/^(data:|#)/.test(u)) continue;
    if (/^[a-z]+:|^\/\//i.test(u)) { stats.external_runtime_requests++; problems.push(`external url() in ${f}: ${u}`); continue; }
    const target = u.startsWith('/') ? resolve(u) : path.join(DIST, path.dirname(f), u);
    if (!target || !fs.existsSync(target)) problems.push(`D3 broken url() in ${f}: ${u}`);
  }
  if (f.endsWith('.js') && /\bfetch\(|XMLHttpRequest|https?:\/\//.test(text.replace(/https?:\/\/(www\.)?w3\.org[^"'\s]*/g, ''))) problems.push(`possible network request in ${f}`);
}
// Archived PDFs served unchanged.
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'archive/MANIFEST.json'), 'utf8'));
for (const m of manifest.files.filter((x) => x.path.startsWith('archive/historical/'))) {
  const served = path.join(DIST, 'archive/2026-11-03', path.basename(m.path));
  const ok = fs.existsSync(served) && crypto.createHash('sha256').update(fs.readFileSync(served)).digest('hex') === m.sha256;
  if (!ok) problems.push(`served PDF differs from archive: ${m.path}`);
}

const summary = { base: BASE, ...stats, anchors_checked: d2.length, anchors_ok: d2.filter((x) => x.ok).length, problems };
if (OUT) {
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, 'linkcheck.json'), JSON.stringify({ ...summary, anchors: d2 }, null, 1) + '\n');
}
console.log(`linkcheck: ${stats.pages} pages, ${stats.internal_links} internal links, ${stats.anchor_links} in-page anchors, ${stats.external_links} external links, ${stats.claude_ai_hrefs} claude.ai hrefs, ${stats.external_runtime_requests} external runtime requests; anchors ${summary.anchors_ok}/${d2.length}; problems: ${problems.length}`);
for (const p of problems) console.log('  ' + p);
process.exit(problems.length ? 1 : 0);
