// C3: keyboard. Tab reaches every grid and length button in DOM order, the focus ring is visible,
// Enter and Space activate.
import { expect, test } from '@playwright/test';
import { CELL_IDS, GRID_ROUTES, laneSel } from './helpers';

for (const route of GRID_ROUTES) {
  test(`/${route} Tab order, focus ring, Enter and Space`, async ({ page, browserName }, testInfo) => {
    test.skip(testInfo.project.name.endsWith('mobile'), 'keyboard checks run on the desktop projects');
    await page.goto(route);
    const seen: string[] = [];
    await page.locator('body').focus();
    for (let i = 0; i < 400 && !seen.includes('len-20'); i++) {
      await page.keyboard.press('Tab');
      const id = await page.evaluate(() => document.activeElement?.id || document.activeElement?.tagName || '');
      seen.push(id);
    }
    const order = seen.filter((x) => x.startsWith('g-') || x.startsWith('len-'));
    expect(order).toEqual([...CELL_IDS, 'len-2', 'len-5', 'len-10', 'len-20']);

    await page.locator('#g-C2-10').focus();
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Tab');
    const ring = await page.evaluate(() => { const s = getComputedStyle(document.activeElement!); return { id: document.activeElement!.id, style: s.outlineStyle, width: s.outlineWidth, visible: document.activeElement!.matches(':focus-visible') }; });
    expect(ring).toEqual({ id: 'g-C2-10', style: 'solid', width: '2px', visible: true });

    await page.keyboard.press('Enter');
    await expect(page.locator('#g-C2-10')).toHaveClass(/\bsel\b/);
    expect(await laneSel(page)).toEqual([4]);

    await page.locator('#len-5').focus();
    await page.keyboard.press('Space');
    await expect(page.locator('#len-5')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('#g-C2-5')).toHaveClass(/\bsel\b/);

    await page.locator('#g-C0').focus();
    await page.keyboard.press('Space');
    await expect(page.locator('#g-C0')).toHaveClass(/\bsel\b/);
    expect(await laneSel(page)).toEqual([0]);
    void browserName;
  });
}

test('skip link moves focus to the main content', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.endsWith('mobile'), 'desktop only');
  await page.goto('costs/');
  await page.keyboard.press('Tab');
  await expect(page.locator('.skip-link')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main#content')).toBeFocused();
});
