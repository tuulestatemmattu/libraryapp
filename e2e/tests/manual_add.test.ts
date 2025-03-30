import { test, expect } from '@playwright/test';
import { BACKEND_URL, FRONTEND_URL } from './constants';

test.describe.configure({ mode: 'serial' });

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

test('Manual book add by FORM', async ({ page, context }) => {
  await page.goto(FRONTEND_URL, { waitUntil: 'load' });

  await page.getByRole('button', { name: 'Add book' }).waitFor();
  await page.getByRole('button', { name: 'Add book' }).click()
  await page.getByRole('button', { name: 'FORM' }).waitFor();
  await page.getByRole('button', { name: 'FORM' }).click();

  await page.getByLabel('Title').waitFor();
  await page.getByLabel('Author').waitFor();
  await page.getByLabel('ISBN').waitFor();
  await page.getByLabel('Description').waitFor();
  await page.getByLabel('Publication date').waitFor();

  await page.getByLabel('Title').fill('Learn Objective-C on the Mac');
  await page.getByLabel('Author').fill('Scott Knaster, Mark Dalrymple, Waqar Malik');
  await page.getByLabel('ISBN').fill('978-1-4302-4188-1');
  await page.getByLabel('Description').fill('Test description');
  await page.getByLabel('Publication date').fill('2012-06-29');


  await page.getByRole('button', { name: 'Add', exact: true }).waitFor();
  await page.getByRole('button', { name: 'Add', exact: true }).click();

  await page.goto(FRONTEND_URL, { waitUntil: 'load' });

  const bookTitle = await page.getByText('Learn Objective-C on the Mac');
  await expect(bookTitle).toBeVisible();
  
});

test('Manual book add by ISBN', async ({ page, context }) => {
  await page.goto(FRONTEND_URL, { waitUntil: 'load' });

  await page.getByRole('button', { name: 'Add book' }).waitFor();
  await page.getByRole('button', { name: 'Add book' }).click()
  
  await page.getByRole('button', { name: 'ISBN' }).waitFor();
  await page.getByRole('button', { name: 'ISBN' }).click();

  await page.getByLabel('ISBN').waitFor();
  await page.getByLabel('ISBN').fill('9781507707616');

  await page.getByRole('button', { name: 'Search', exact: true }).waitFor();
  await page.getByRole('button', { name: 'Search', exact: true }).click();

  await page.getByRole('button', { name: 'Add', exact: true }).waitFor();
  await page.getByRole('button', { name: 'Add', exact: true }).click();

  await page.goto(FRONTEND_URL, { waitUntil: 'load' });

  const bookTitle = await page.getByText('C# Programming for Beginners');
  await expect(bookTitle).toBeVisible();
  
});