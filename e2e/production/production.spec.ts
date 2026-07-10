import { expect, test, type Page, type TestInfo } from '@playwright/test';

type RuntimeAudit = {
  consoleErrors: string[];
  pageErrors: string[];
  failedRequests: string[];
  badResponses: string[];
};

function shouldTrackUrl(rawUrl: string, baseUrl: string): boolean {
  try {
    const url = new URL(rawUrl);
    const production = new URL(baseUrl);
    return (
      url.origin === production.origin ||
      url.hostname.endsWith('.supabase.co') ||
      url.hostname.includes('uploadthing')
    );
  } catch {
    return false;
  }
}

function attachRuntimeAudit(page: Page, baseUrl: string): RuntimeAudit {
  const audit: RuntimeAudit = {
    consoleErrors: [],
    pageErrors: [],
    failedRequests: [],
    badResponses: [],
  };

  page.on('console', (message) => {
    if (message.type() === 'error') {
      audit.consoleErrors.push(message.text());
    }
  });

  page.on('pageerror', (error) => {
    audit.pageErrors.push(error.message);
  });

  page.on('requestfailed', (request) => {
    const failure = request.failure()?.errorText || 'unknown network failure';
    if (failure.includes('ERR_ABORTED')) return;
    if (shouldTrackUrl(request.url(), baseUrl)) {
      audit.failedRequests.push(`${request.method()} ${request.url()} — ${failure}`);
    }
  });

  page.on('response', (response) => {
    const request = response.request();
    const trackedTypes = new Set(['document', 'script', 'stylesheet', 'xhr', 'fetch', 'image']);
    if (
      response.status() >= 400 &&
      trackedTypes.has(request.resourceType()) &&
      shouldTrackUrl(response.url(), baseUrl)
    ) {
      audit.badResponses.push(`${response.status()} ${request.method()} ${response.url()}`);
    }
  });

  return audit;
}

async function assertPageIntegrity(page: Page, audit: RuntimeAudit, testInfo: TestInfo) {
  await expect(page.locator('body')).not.toBeEmpty();
  await expect(page.locator('body')).not.toContainText(/application error|internal server error|vite error|uncaught runtime error/i);

  const overflow = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  expect(overflow.scrollWidth, 'page must not overflow horizontally').toBeLessThanOrEqual(overflow.clientWidth + 1);

  await testInfo.attach('runtime-audit', {
    body: JSON.stringify(audit, null, 2),
    contentType: 'application/json',
  });

  expect(audit.pageErrors, 'uncaught browser errors').toEqual([]);
  expect(audit.failedRequests, 'failed production network requests').toEqual([]);
  expect(audit.badResponses, 'HTTP 4xx/5xx responses from app dependencies').toEqual([]);
  expect(audit.consoleErrors, 'browser console errors').toEqual([]);
}

async function openAndAudit(page: Page, path: string, testInfo: TestInfo) {
  const baseUrl = process.env.PRODUCTION_URL!;
  const audit = attachRuntimeAudit(page, baseUrl);
  const response = await page.goto(path, { waitUntil: 'domcontentloaded' });
  expect(response?.status(), `${path} should return HTTP 200`).toBe(200);
  await page.waitForLoadState('networkidle').catch(() => undefined);
  await page.waitForTimeout(1_000);
  await assertPageIntegrity(page, audit, testInfo);
  return audit;
}

const categoryRoutes = [
  { path: '/shirts', heading: 'Shirts' },
  { path: '/trousers', heading: 'Trousers' },
  { path: '/bags', heading: 'Bags' },
  { path: '/shoes', heading: 'Shoes' },
];

test('home renders and the primary shopping action responds', async ({ page }, testInfo) => {
  const baseUrl = process.env.PRODUCTION_URL!;
  const audit = attachRuntimeAudit(page, baseUrl);
  const response = await page.goto('/', { waitUntil: 'domcontentloaded' });
  expect(response?.status()).toBe(200);
  await expect(page).toHaveTitle(/Dylan/i);
  await expect(page.getByRole('heading', { name: /a quieter kind of statement/i })).toBeVisible();
  await page.getByRole('button', { name: /shop the collection/i }).click();
  await expect(page).toHaveURL(/\/shirts(?:\?|$)/);
  await expect(page.getByRole('heading', { name: 'Shirts' })).toBeVisible();
  await page.waitForLoadState('networkidle').catch(() => undefined);
  await assertPageIntegrity(page, audit, testInfo);
});

for (const route of categoryRoutes) {
  test(`${route.heading} catalogue is healthy`, async ({ page }, testInfo) => {
    const baseUrl = process.env.PRODUCTION_URL!;
    const audit = attachRuntimeAudit(page, baseUrl);
    const response = await page.goto(route.path, { waitUntil: 'domcontentloaded' });
    expect(response?.status()).toBe(200);
    await expect(page.getByRole('heading', { name: route.heading })).toBeVisible();
    await expect(page.getByPlaceholder(new RegExp(`search ${route.heading}`, 'i'))).toBeVisible();
    await page.waitForLoadState('networkidle').catch(() => undefined);
    await assertPageIntegrity(page, audit, testInfo);
  });
}

test('responsive navigation matches the active viewport', async ({ page }, testInfo) => {
  const baseUrl = process.env.PRODUCTION_URL!;
  const audit = attachRuntimeAudit(page, baseUrl);
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  if (testInfo.project.name === 'production-mobile') {
    await page.getByRole('button', { name: 'Open navigation' }).click();
    const mobileNavigation = page.getByRole('navigation', { name: 'Mobile navigation' });
    await expect(mobileNavigation).toBeVisible();
    await expect(mobileNavigation.getByRole('link', { name: 'Shirts', exact: true })).toBeVisible();
  } else {
    await expect(page.getByRole('navigation', { name: 'Primary navigation' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Open navigation' })).toBeHidden();
  }

  await assertPageIntegrity(page, audit, testInfo);
});

test('empty checkout is protected without runtime errors', async ({ page }, testInfo) => {
  await page.addInitScript(() => localStorage.clear());
  const baseUrl = process.env.PRODUCTION_URL!;
  const audit = attachRuntimeAudit(page, baseUrl);
  const response = await page.goto('/checkout', { waitUntil: 'domcontentloaded' });
  expect(response?.status()).toBe(200);
  await expect(page.getByRole('heading', { name: 'Your bag is empty' })).toBeVisible();
  await assertPageIntegrity(page, audit, testInfo);
});

test('admin sign-in surface is accessible and non-destructive', async ({ page }, testInfo) => {
  const baseUrl = process.env.PRODUCTION_URL!;
  const audit = attachRuntimeAudit(page, baseUrl);
  const response = await page.goto('/seller/login', { waitUntil: 'domcontentloaded' });
  expect(response?.status()).toBe(200);
  await expect(page.getByRole('heading', { name: 'Admin sign in' })).toBeVisible();
  await expect(page.getByLabel('Admin email', { exact: true })).toBeVisible();
  await expect(page.getByLabel('Passcode', { exact: true })).toBeVisible();
  await assertPageIntegrity(page, audit, testInfo);
});

test('desktop captures navigation performance metrics', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'production-desktop', 'One desktop performance sample is sufficient.');
  await openAndAudit(page, '/', testInfo);
  const metrics = await page.evaluate(() => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
    const paints = performance.getEntriesByType('paint').reduce<Record<string, number>>((result, entry) => {
      result[entry.name] = entry.startTime;
      return result;
    }, {});
    return {
      responseStart: navigation?.responseStart ?? null,
      domContentLoaded: navigation?.domContentLoadedEventEnd ?? null,
      loadEventEnd: navigation?.loadEventEnd ?? null,
      transferSize: navigation?.transferSize ?? null,
      firstPaint: paints['first-paint'] ?? null,
      firstContentfulPaint: paints['first-contentful-paint'] ?? null,
    };
  });

  console.log(`PRODUCTION_NAVIGATION_METRICS ${JSON.stringify(metrics)}`);
  await testInfo.attach('navigation-performance', {
    body: JSON.stringify(metrics, null, 2),
    contentType: 'application/json',
  });
});
