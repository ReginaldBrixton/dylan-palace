import { expect, test, type Page } from '@playwright/test';

async function mockCatalogue(page: Page) {
  await page.route('**/rest/v1/**', async (route) => {
    const url = route.request().url();
    if (url.includes('/products')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: '11111111-1111-4111-8111-111111111111',
            name: 'Editorial Linen Shirt',
            brand: "Dylan's Palace",
            category_id: 1,
            sub_category_id: null,
            price: 180,
            description: 'A lightweight linen shirt for warm days.',
            gender: 'UNISEX',
            in_stock: true,
            stock_quantity: 8,
            is_featured: true,
            tags: ['linen'],
            colors: ['Cream'],
            created_by: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            category: { id: 1, name: 'SHIRTS', display_name: 'Shirts', slug: 'shirts' },
            sub_category: null,
            product_images: [],
            product_sizes: [{ id: 'size-1', product_id: '11111111-1111-4111-8111-111111111111', size: 'M', in_stock: true }],
            product_variants: [{ id: '22222222-2222-4222-8222-222222222222', product_id: '11111111-1111-4111-8111-111111111111', sku: 'DP-LINEN-M', size: 'M', color: 'Cream', price_override: null, stock_quantity: 8, active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }],
          },
        ]),
      });
      return;
    }
    await route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
  });
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.clear());
  await mockCatalogue(page);
});

test('landing page exposes the main campaign and shopping route', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'A quieter kind of statement.' })).toBeVisible();
  await expect(page.getByRole('button', { name: /shop the collection/i })).toBeVisible();
});

test('catalogue provides explicit search, filters and product actions', async ({ page }) => {
  await page.goto('/shirts');
  await expect(page.getByRole('heading', { name: 'Shirts' })).toBeVisible();
  await expect(page.getByPlaceholder('Search shirts')).toBeVisible();
  await expect(page.getByText('Editorial Linen Shirt')).toBeVisible();
  await expect(page.getByRole('button', { name: /save editorial linen shirt/i })).toBeVisible();
});

test('seller login requires an email and passcode', async ({ page }) => {
  await page.goto('/seller/login');
  await expect(page.getByRole('heading', { name: 'Admin sign in' })).toBeVisible();
  await expect(page.getByLabel('Admin email')).toBeVisible();
  await expect(page.getByLabel('Passcode')).toBeVisible();
});

test('checkout protects the empty-cart route', async ({ page }) => {
  await page.goto('/checkout');
  await expect(page.getByRole('heading', { name: 'Your bag is empty' })).toBeVisible();
});
