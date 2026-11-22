// Post-deploy smoke test against the public URL (GATE1_PLAN section 7 F; ticket section 7).
// Usage: node tools/smoke.mjs https://aetherus-monolith.github.io/session-architecture-vs-sycophantic-spirals/
// Checks every route for HTTP 200 and its anchors, the four doc-migration targets L1-L4, and that no
// page links to claude.ai.
const base = (process.argv[2] || '').replace(/\/?$/, '/');
if (!/^https?:\/\//.test(base)) { console.error('usage: node tools/smoke.mjs <public base URL>'); process.exit(2); }
const CHECKS = [
  ['L1', 'full/', ['runs', 'stopping-rule', 'costs', 'scoring', 'changes']],
  ['L2', 'stopping-rule/', ['stopping-rule']],
  ['L3', 'costs/', ['costs']],
  ['L4', 'scoring/', ['scoring']],
  ['', '', ['top', 'tasks-outcomes']], ['', 'grid/', ['grid', 'runs', 'lanes']], ['', 'hypotheses/', ['h1', 'test']],
  ['', 'handoffs/', ['handoff']], ['', 'decisions/', ['status', 'open']], ['', 'operations/', ['artifacts', 'instance-state', 'error-path']],
  ['', 'changelog/', ['changes', 'versions', 'site-changes']],
];
let fail = 0;
for (const [label, p, ids] of CHECKS) {
  const u = base + p;
  let status = 0, html = '';
  try { const r = await fetch(u, { redirect: 'follow' }); status = r.status; html = await r.text(); } catch (e) { html = String(e); }
  const missing = ids.filter((id) => !html.includes(`id="${id}"`));
  const claude = /href="[^"]*claude\.ai/.test(html);
  const ok = status === 200 && !missing.length && !claude;
  if (!ok) fail++;
  console.log(`${ok ? 'PASS' : 'FAIL'} ${label.padEnd(2)} ${u} HTTP ${status}${missing.length ? ' missing #' + missing.join(' #') : ''}${claude ? ' claude.ai link' : ''}`);
}
for (const f of ['archive/2026-11-03/Session_Architecture_Grid_2026-11-03.pdf', 'archive/2026-11-03/API_cost_estimate_2026-11-03.pdf']) {
  const r = await fetch(base + f, { method: 'HEAD' }); const ok = r.status === 200; if (!ok) fail++;
  console.log(`${ok ? 'PASS' : 'FAIL'}    ${base + f} HTTP ${r.status}`);
}
process.exit(fail ? 1 : 0);
