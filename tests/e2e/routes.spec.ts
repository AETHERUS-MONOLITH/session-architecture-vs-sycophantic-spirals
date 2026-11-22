// D1, D2, C5, C7, C8 and the status banner: every route under the project base path.
import { expect, test } from '@playwright/test';
import { axe, ROUTES, watch } from './helpers';

const ANCHORS: Record<string, string[]> = {
  '': ['top', 'tasks-outcomes', 'reference-model'],
  'full/': ['top', 'grid', 'conditions', 'runs', 'hypotheses', 'handoff', 'status', 'stopping-rule', 'scoring', 'costs', 'open', 'artifacts', 'instance-state', 'error-path', 'changes', 'tasks-outcomes'],
  'grid/': ['grid', 'conditions', 'runs'],
  'hypotheses/': ['hypotheses', 'h1', 'h2', 'h3', 'h5', 'h4', 'k1', 'k2', 'c2-c1', 'ref', 'test'],
  'handoffs/': ['handoff'],
  'scoring/': ['scoring'],
  'stopping-rule/': ['stopping-rule', 'firing', 'reported', 'evaluation-plan', 'fresh-context-review', 'limits'],
  'costs/': ['costs'],
  'decisions/': ['status', 'open'],
  'operations/': ['artifacts', 'instance-state', 'error-path'],
  'changelog/': ['changes', 'versions', 'site-changes'],
};

for (const route of ROUTES) {
  test.describe(`/${route}`, () => {
    test('HTTP 200, anchors, banner, footer, no console errors', async ({ page }) => {
      const problems = watch(page);
      const res = await page.goto(route);
      expect(res?.status()).toBe(200);
      for (const id of ANCHORS[route]) await expect(page.locator(`[id="${id}"]`), `#${id}`).toHaveCount(1);
      await expect(page.locator('[data-status-banner]')).toHaveText('Design documentation of a planned study (AISC 12). It reports no results.');
      await expect(page.locator('[data-content-version]')).toContainText('1794606123-2939');
      expect(await page.locator('a[href*="claude.ai"]').count()).toBe(0);
      await page.waitForLoadState('networkidle');
      expect(problems).toEqual([]);
    });
    for (const scheme of ['light', 'dark'] as const) {
      test(`axe and console, ${scheme} theme`, async ({ page }, testInfo) => {
        const problems = watch(page);
        await page.emulateMedia({ colorScheme: scheme });
        await page.goto(route);
        await page.waitForLoadState('networkidle');
        const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
        expect(bg).toBe(scheme === 'dark' ? 'rgb(17, 22, 29)' : 'rgb(246, 247, 249)');
        await axe(page, testInfo, `${route || 'index'}-${scheme}`);
        expect(problems).toEqual([]);
      });
    }
  });
}

test('doc migration targets L1-L4 resolve to their sections', async ({ page }) => {
  for (const [path, id] of [['full/', 'runs'], ['stopping-rule/', 'stopping-rule'], ['costs/', 'costs'], ['scoring/', 'scoring']]) {
    const res = await page.goto(path);
    expect(res?.status()).toBe(200);
    await expect(page.locator(`#${id}`)).toBeVisible();
  }
});

test('the 3 Nov PDFs are served', async ({ request, baseURL }) => {
  for (const f of ['Session_Architecture_Grid_2026-11-03.pdf', 'API_cost_estimate_2026-11-03.pdf']) {
    const r = await request.get(`${baseURL}archive/2026-11-03/${f}`);
    expect(r.status()).toBe(200);
    expect(r.headers()['content-type']).toContain('pdf');
  }
});
