import { defineConfig, devices } from '@playwright/test';

// Base path under test: the project path used on GitHub Pages (override with SITE_BASE).
const BASE = (process.env.SITE_BASE ?? '/session-architecture-vs-sycophantic-spirals/').replace(/\/?$/, '/');
const PORT = Number(process.env.PREVIEW_PORT ?? 4321);
// Local runs can point at a preinstalled Chromium (PW_CHROMIUM_PATH); CI uses Playwright's own browsers.
const chromiumPath = process.env.PW_CHROMIUM_PATH;
const browsers = (process.env.E2E_BROWSERS ?? 'chromium,webkit').split(',');
const desktop = { viewport: { width: 1440, height: 900 } };
const mobile = { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 };
const projects = [];
if (browsers.includes('chromium')) {
  const launchOptions = chromiumPath ? { executablePath: chromiumPath } : {};
  projects.push({ name: 'chromium-desktop', use: { ...devices['Desktop Chrome'], ...desktop, launchOptions } });
  projects.push({ name: 'chromium-mobile', use: { ...devices['Desktop Chrome'], ...mobile, launchOptions } });
}
if (browsers.includes('webkit')) {
  projects.push({ name: 'webkit-desktop', use: { ...devices['Desktop Safari'], ...desktop } });
  projects.push({ name: 'webkit-mobile', use: { ...devices['iPhone 13'], ...mobile } });
}

export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 60_000,
  fullyParallel: true,
  workers: process.env.CI ? 2 : 4,
  reporter: [['list'], ['json', { outputFile: process.env.E2E_JSON ?? 'test-results/e2e.json' }]],
  use: { baseURL: process.env.E2E_EXTERNAL_URL ?? `http://127.0.0.1:${PORT}${BASE}`, trace: 'retain-on-failure' },
  webServer: process.env.E2E_EXTERNAL_URL ? undefined : {
    command: `npx astro preview --host 127.0.0.1 --port ${PORT} --ignore-lock`,
    url: `http://127.0.0.1:${PORT}${BASE}`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
  projects,
});
