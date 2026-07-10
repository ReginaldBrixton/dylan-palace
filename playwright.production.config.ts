import { defineConfig } from '@playwright/test';

const productionUrl = process.env.PRODUCTION_URL;

if (!productionUrl) {
  throw new Error('PRODUCTION_URL is required for production browser tests.');
}

export default defineConfig({
  testDir: './e2e/production',
  timeout: 45_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: [
    ['line'],
    ['json', { outputFile: 'production-artifacts/playwright-results.json' }],
  ],
  outputDir: 'production-artifacts/playwright-output',
  use: {
    baseURL: productionUrl,
    browserName: 'chromium',
    actionTimeout: 12_000,
    navigationTimeout: 30_000,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    ignoreHTTPSErrors: false,
  },
  projects: [
    {
      name: 'production-mobile',
      use: {
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
      },
    },
    {
      name: 'production-desktop',
      use: {
        viewport: { width: 1440, height: 1000 },
      },
    },
  ],
});
