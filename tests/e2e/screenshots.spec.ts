// GATE1_PLAN section 7 E: screenshots for the PR (run with SCREENSHOTS=1).
import { test } from '@playwright/test';
import path from 'node:path';

const OUT = process.env.SCREENSHOT_DIR ?? 'evidence/gate2/screenshots';
test.skip(!process.env.SCREENSHOTS, 'set SCREENSHOTS=1');

const shots: { name: string; route: string; click?: string; dark?: boolean; full?: boolean; element?: string }[] = [
  { name: '01-full-top', route: 'full/' },
  { name: '02-core-cell-C2-10-selected', route: 'grid/', click: 'g-C2-10', full: true },
  { name: '03-extension-cell-C3-5-selected', route: 'grid/', click: 'g-C3-5', full: true },
  { name: '04-long-timeline-C1R-2', route: 'grid/', click: 'g-C1R-2', element: '#runs' },
  { name: '05-stopping-rule', route: 'stopping-rule/', full: true },
  { name: '06-costs', route: 'costs/', full: true },
  { name: '07-grid-dark', route: 'grid/', dark: true, full: true },
  { name: '08-decisions-dark', route: 'decisions/', dark: true, full: true },
  { name: '09-changelog-versions', route: 'changelog/', full: true },
  { name: '10-overview', route: '', full: true },
];
for (const s of shots) {
  test(s.name, async ({ page }, testInfo) => {
    await page.emulateMedia({ colorScheme: s.dark ? 'dark' : 'light', reducedMotion: 'reduce' });
    await page.goto(s.route);
    await page.evaluate(() => document.fonts.ready);
    if (s.click) { await page.locator('#' + s.click).click(); await page.waitForTimeout(150); }
    const file = path.join(OUT, testInfo.project.name, `${s.name}.png`);
    if (s.element) await page.locator(s.element).screenshot({ path: file });
    else await page.screenshot({ path: file, fullPage: !!s.full });
  });
}
