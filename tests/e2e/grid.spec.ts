// C1, C2: grid cells and length buttons on /grid/ and /full/, against the source behaviour.
import { expect, test } from '@playwright/test';
import { CELL_IDS, GRID_ROUTES, LANE_ORDER, laneSel, watch } from './helpers';

const SESSIONS: Record<number, number> = { 2: 20, 5: 8, 10: 4, 20: 2 };

for (const route of GRID_ROUTES) {
  test.describe(`/${route}`, () => {
    test('default state equals the source: length 10, no selection', async ({ page }) => {
      await page.goto(route);
      await expect(page.locator('#lanes > .lane')).toHaveCount(8);
      await expect(page.locator('.seg-btn[aria-pressed="true"]')).toHaveAttribute('id', 'len-10');
      await expect(page.locator('button.cell.sel')).toHaveCount(0);
      expect(await laneSel(page)).toEqual([]);
      await expect(page.locator('#budget-label')).toHaveText('40');
    });

    test('all 26 grid buttons select their lane and length and scroll #runs into view', async ({ page }) => {
      const problems = watch(page);
      await page.goto(route);
      expect(await page.$$eval('button.cell', (bs) => bs.map((b) => b.id))).toEqual(CELL_IDS);
      let n = 10;
      for (const id of CELL_IDS) {
        const btn = page.locator(`#${id}`);
        const c = (await btn.getAttribute('data-c'))!;
        const dn = await btn.getAttribute('data-n');
        if (dn) n = Number(dn);
        await page.evaluate(() => window.scrollTo(0, 0));
        await btn.click();
        await expect(btn).toHaveClass(/\bsel\b/);
        await expect(btn).toHaveAttribute('aria-pressed', 'true');
        await expect(page.locator('button.cell.sel')).toHaveCount(1);
        expect(await laneSel(page), id).toEqual([LANE_ORDER.indexOf(c)]);
        await expect(page.locator('.seg-btn[aria-pressed="true"]')).toHaveAttribute('id', `len-${n}`);
        await expect.poll(async () => page.evaluate(() => {
          const r = document.getElementById('runs')!.getBoundingClientRect();
          const max = document.scrollingElement!.scrollHeight - innerHeight;
          return (Math.abs(r.top) <= 40 || scrollY >= max - 2) && r.top < innerHeight;
        }), { message: `#runs in view after ${id}`, timeout: 5000 }).toBe(true);
      }
      expect(problems).toEqual([]);
    });

    test('length buttons re-render lanes and meta', async ({ page }) => {
      const problems = watch(page);
      await page.goto(route);
      for (const n of [2, 5, 10, 20]) {
        await page.locator(`#len-${n}`).click();
        await expect(page.locator('.seg-btn[aria-pressed="true"]')).toHaveAttribute('id', `len-${n}`);
        await expect(page.locator('#lanes > .lane')).toHaveCount(8);
        const s = SESSIONS[n];
        await expect(page.locator('#lanes > .lane').nth(2).locator('.meta')).toHaveText(`${s} sessions${s} instances`);
        await expect(page.locator('#lanes > .lane').nth(6).locator('.meta')).toHaveText(`${s} sessions${2 * s - 1} instances`);
        await expect(page.locator('#lanes > .lane').nth(0).locator('.meta')).toHaveText('1 session1 instance');
        await expect(page.locator('#lanes > .lane').nth(1).locator('.meta')).toHaveText('1 session3 reviews');
        await expect(page.locator('#lanes')).toHaveClass(n <= 5 ? /\bdense\b/ : /^lanes$/);
        // C3 snapshots per AD-01; C4 alternates model families.
        await expect(page.locator('#lanes > .lane').nth(6).locator('.b.snap')).toHaveCount(s - 1);
        await expect(page.locator('#lanes > .lane').nth(7).locator('.inst.mb')).toHaveCount(Math.floor(s / 2));
        const ext = n === 5 || n === 20;
        await expect(page.locator('#lanes > .lane').nth(2).locator('.rowlab span')).toHaveText(ext ? 'Self-summary · ext.' : 'Self-summary');
        await expect(page.locator('#lanes > .lane').nth(5).locator('.rowlab span')).toHaveText('Report, no review · opt.');
      }
      expect(problems).toEqual([]);
    });

    test('URL state ?c=&n= restores and records a selection', async ({ page }) => {
      await page.goto(route + '?c=C3&n=5');
      await expect(page.locator('#g-C3-5')).toHaveClass(/\bsel\b/);
      await expect(page.locator('#len-5')).toHaveAttribute('aria-pressed', 'true');
      await page.locator('#g-C1R-2').click();
      await expect.poll(() => new URL(page.url()).search).toBe('?c=C1R&n=2');
    });
  });
}
