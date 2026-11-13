// C4: mobile. No horizontal page overflow; tables and lanes scroll inside their containers;
// tap targets of controls at least 24×24 CSS px (inline text links are exempt, WCAG 2.5.8).
import { expect, test } from '@playwright/test';
import { ROUTES } from './helpers';

test.beforeEach(({}, testInfo) => { test.skip(!testInfo.project.name.endsWith('mobile'), 'mobile projects only'); });

for (const route of ROUTES) {
  test(`/${route} no horizontal page overflow, tap targets`, async ({ page }) => {
    await page.goto(route);
    await page.waitForLoadState('networkidle');
    // Compare with the configured viewport: a mobile browser widens innerWidth to fit overflowing content.
    const vw = page.viewportSize()!.width;
    const overflow = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: window.innerWidth, bw: document.body.scrollWidth }));
    expect(overflow, `page wider than the ${vw}px viewport`).toEqual({ sw: vw, iw: vw, bw: vw });
    const small = await page.$$eval('button, .site-nav a, .brand, .site-foot a, .contents-list a, .files a', (els) => els
      .filter((e) => !(e as HTMLElement).closest('p, td'))
      .map((e) => { const r = e.getBoundingClientRect(); return { t: (e.id || e.textContent || '').trim().slice(0, 30), w: r.width, h: r.height }; })
      .filter((r) => r.w > 0 && (r.w < 24 || r.h < 24)));
    expect(small).toEqual([]);
  });
}

test('tables and timelines scroll inside their containers', async ({ page }) => {
  await page.goto('decisions/');
  const t = await page.$eval('#status .scroll', (e) => ({ sw: e.scrollWidth, cw: e.clientWidth, ox: getComputedStyle(e).overflowX }));
  expect(t.sw).toBeGreaterThan(t.cw);
  expect(t.ox).toBe('auto');
  await page.goto('grid/');
  const l = await page.$eval('.tlwrap', (e) => ({ sw: e.scrollWidth, cw: e.clientWidth, ox: getComputedStyle(e).overflowX }));
  expect(l.sw).toBeGreaterThan(l.cw);
  expect(l.ox).toBe('auto');
  const g = await page.$eval('.gridwrap', (e) => ({ sw: e.scrollWidth, cw: e.clientWidth, ox: getComputedStyle(e).overflowX }));
  expect(g.ox).toBe('auto');
  expect(g.sw).toBeGreaterThanOrEqual(g.cw);
});

test('tapping a grid cell selects it on mobile', async ({ page }) => {
  await page.goto('grid/');
  await page.locator('#g-C4-2').tap();
  await expect(page.locator('#g-C4-2')).toHaveClass(/\bsel\b/);
  await expect(page.locator('#len-2')).toHaveAttribute('aria-pressed', 'true');
});
