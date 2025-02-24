import { test, expect } from '@playwright/test';
import { BACKEND_URL, FRONTEND_URL } from './constants';

test.beforeAll(async ({ request }) => {
  await request.get(BACKEND_URL + '/api/testing/resetdb');
});

test.beforeEach(async ({ page, context }) => {
  await page.goto(BACKEND_URL + '/api/testing/login');
  const cookies = await context.cookies(BACKEND_URL);
  await context.addCookies(
    cookies.map((cookie) => {
      return { ...cookie, domain: 'frontend-e2e' }
    })
  );
});

test('Manual add', async ({ page, context }) => {
  await page.goto(FRONTEND_URL);
  await expect(page).toHaveTitle('Library App');
  //await page.getByLabel('Add book').click();

  //await page.getByLabel('title').fill('Test book');
  //await page.getByLabel('Author').fill('Test author');
  //await page.getByLabel('ISBN').fill('978-1-4028-9462-6');
  //await page.getByLabel('Description').fill('Test description');
  //await page.getByLabel('publishYear').fill('2021');
  //await page.getByRole('button', { name: 'Add', exact: true }).click();

  //await page.waitForSelector('text=Book added successfully');
});