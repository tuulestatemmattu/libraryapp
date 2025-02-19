import { test, expect } from '@playwright/test';
import { BACKEND_URL, FRONTEND_URL } from './constants';
test('front page has correct title', async ({ page }) => {
  await page.goto(FRONTEND_URL);
  await expect(page).toHaveTitle('Library App');
});
test('backend ping returns pong', async ({ page }) => {
  await page.goto(BACKEND_URL + '/api/ping');
  const text = await page.innerText('body');
  expect(text).toBe('pong');
});