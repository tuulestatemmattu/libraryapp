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

  page.on('console', (msg) => {
    console.log(`Console log: ${msg.text()}`);
  });
});

test('Manual book add', async ({ page, context }) => {

  await page.goto(FRONTEND_URL+'/addBook?view=form');
  //await page.goto(FRONTEND_URL);
  //await page.getByRole('button', { name: 'Add book' }).waitFor();
  //await page.getByRole('button', { name: 'Add book' }).click();

  //await page.getByRole('button', { name: 'FORM' }).waitFor();
  //await page.getByRole('button', { name: 'FORM' }).click();

  await page.getByLabel('title').waitFor();
  await page.getByLabel('Author').waitFor();
  await page.getByLabel('ISBN').waitFor();
  await page.getByLabel('description').waitFor();
  await page.getByLabel('publishYear').waitFor();

  await page.getByLabel('title').fill('Learn Objective-C on the Mac');
  await page.getByLabel('Author').fill('Scott Knaster, Mark Dalrymple, Waqar Malik');
  await page.getByLabel('ISBN').fill('9781430241881');
  await page.getByLabel('description').fill('Test description');
  await page.getByLabel('publishYear').fill('2012-06-29');

  await page.getByRole('button', { name: 'Add', exact: true }).waitFor();
  await page.getByRole('button', { name: 'Add', exact: true }).click();
  await page.screenshot({ path: 'manual_book_add.png', fullPage: true });
  //await page.goto(FRONTEND_URL);

  //await page.screenshot({ path: 'manual_book_add2.png', fullPage: true });
});