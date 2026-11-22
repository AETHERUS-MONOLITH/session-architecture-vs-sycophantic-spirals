// C6: prefers-reduced-motion: reduce gives no smooth scroll (the source scrolls smoothly otherwise).
import { expect, test } from '@playwright/test';

for (const [motion, behavior] of [['reduce', 'auto'], ['no-preference', 'smooth']] as const) {
  test(`reducedMotion ${motion} → scrollIntoView behavior ${behavior}`, async ({ page }) => {
    await page.addInitScript(() => {
      (window as any).__scrolls = [];
      const orig = Element.prototype.scrollIntoView;
      Element.prototype.scrollIntoView = function (arg?: any) { (window as any).__scrolls.push({ id: (this as Element).id, arg }); return orig.call(this, arg); };
    });
    await page.emulateMedia({ reducedMotion: motion });
    await page.goto('grid/');
    await page.locator('#g-C2-10').click();
    const calls = await page.evaluate(() => (window as any).__scrolls);
    expect(calls).toEqual([{ id: 'runs', arg: { behavior, block: 'start' } }]);
    const transition = await page.$eval('#lanes .b.work', (e) => getComputedStyle(e).transitionDuration);
    expect(transition).toBe(motion === 'reduce' ? '0s' : '0.25s');
  });
}
