import { expect, type Page, type TestInfo } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

export const ROUTES = ['', 'full/', 'grid/', 'hypotheses/', 'handoffs/', 'scoring/', 'stopping-rule/', 'costs/', 'decisions/', 'operations/', 'changelog/'];
export const GRID_ROUTES = ['grid/', 'full/'];
export const CELL_IDS = ['g-C0', 'g-C0R',
  ...['C1', 'C1R', 'C2', 'C2X', 'C3', 'C4'].flatMap((c) => [2, 5, 10, 20].map((n) => `g-${c}-${n}`))];
export const LANE_ORDER = ['C0', 'C0R', 'C1', 'C1R', 'C2', 'C2X', 'C3', 'C4'];

/** Collects console errors and warnings, page errors and requests to other hosts. */
export function watch(page: Page) {
  const problems: string[] = [];
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') problems.push(`console.${m.type()}: ${m.text()}`); });
  page.on('pageerror', (e) => problems.push(`pageerror: ${e.message}`));
  page.on('request', (r) => {
    const u = new URL(r.url());
    const own = new URL(page.url() || 'http://127.0.0.1');
    if (u.protocol.startsWith('http') && u.host !== own.host && !['127.0.0.1', 'localhost'].includes(u.hostname)) problems.push(`external request: ${r.url()}`);
  });
  page.on('requestfailed', (r) => problems.push(`request failed: ${r.url()} ${r.failure()?.errorText}`));
  page.on('response', (r) => { if (r.status() >= 400) problems.push(`HTTP ${r.status()}: ${r.url()}`); });
  return problems;
}

export async function axe(page: Page, testInfo: TestInfo, label: string) {
  const res = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
  const serious = res.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
  const summary = res.violations.map((v) => `${v.impact} ${v.id} (${v.nodes.length})`);
  await testInfo.attach(`axe-${label}.json`, { body: JSON.stringify({ violations: res.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.map((n) => n.target) })), passes: res.passes.length, incomplete: res.incomplete.map((v) => v.id) }, null, 1), contentType: 'application/json' });
  expect(serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).slice(0, 5).join(' | ')}`), `axe serious/critical on ${label}; all: ${summary.join(', ')}`).toEqual([]);
  return res;
}

export async function laneSel(page: Page) {
  return page.$$eval('#lanes > .lane', (ls) => ls.map((l, i) => (l.classList.contains('sel') ? i : -1)).filter((i) => i >= 0));
}
