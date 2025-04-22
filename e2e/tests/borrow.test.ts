import { test, expect } from "@playwright/test";
import { BACKEND_URL, FRONTEND_URL, CRON_SECRET } from "./constants";
import axios from "axios";

test.describe.configure({ mode: "serial" });

test.beforeAll(async ({ request }) => {
  await request.get(BACKEND_URL + "/api/testing/resetdb");
});

test.beforeEach(async ({ page, context }) => {
  const res = await axios.post(`${BACKEND_URL}/api/testing/login`, {
    secret: CRON_SECRET,
  });

  const domain = FRONTEND_URL.replace("https://", "").replace("http://", "");

  await context.addCookies(
    (res.headers["set-cookie"] ?? []).map((cString) => {
      const [name, ...rest] = cString.split("=");
      const value = rest.join("=").split(";")[0];
      const cookie = {
        name,
        value,
        domain,
        path: "/",
      };
      return cookie;
    })
  );

  await page.goto(FRONTEND_URL, { waitUntil: "load" });

  await page.getByTestId("location-select").waitFor();
  await page.getByTestId("location-select").click();
  await page.getByTestId("location-option-testing").waitFor();
  await page.getByTestId("location-option-testing").click();
});

test("Borrow a book", async ({ page, context }) => {
  await page.getByRole("button", { name: "Add book" }).waitFor();
  await page.getByRole("button", { name: "Add book" }).click();

  await page.getByLabel("ISBN").waitFor();
  await page.getByLabel("ISBN").fill("9781507707616");

  await page.getByRole("button", { name: "Search", exact: true }).waitFor();
  await page.getByRole("button", { name: "Search", exact: true }).click();

  await expect(page.getByLabel("Title")).toHaveValue(
    "C# Programming for Beginners",
    {
      timeout: 20000,
    }
  );

  await page.getByRole("button", { name: "Add", exact: true }).waitFor();
  await page.getByRole("button", { name: "Add", exact: true }).click();

  await page.goto(FRONTEND_URL, { waitUntil: "load" });

  await (
    await page.getByTestId("book-card-9781507707616")
  ).scrollIntoViewIfNeeded();

  await page.getByTestId("book-card-9781507707616").click();

  await page.screenshot({ path: "result1.png" });

  await page.getByTestId("borrow-button").waitFor();
  await page.getByTestId("borrow-button").click();

  await page.goto(FRONTEND_URL, { waitUntil: "load" });

  await page.screenshot({ path: "result2.png" });

  await page.getByTestId("Your books").waitFor();

  await expect(
    await page.getByTestId("Your books").getByTestId("book-card-9781507707616")
  ).toBeVisible();

  await page
    .getByTestId("Your books")
    .getByTestId("book-card-9781507707616")
    .click();

  await expect(page.getByTestId("return-button")).toBeVisible();
  await expect(page.getByText("Return date: ")).toBeVisible();
});

test("Return a book", async ({ page, context }) => {
  await page
    .getByTestId("Your books")
    .getByTestId("book-card-9781507707616")
    .click();

  await page.getByTestId("return-button").waitFor();
  await page.getByTestId("return-button").click();

  await expect(
    page.getByTestId("Your books").getByTestId("book-card-9781507707616")
  ).not.toBeVisible();

  await page.getByTestId("book-card-9781507707616").waitFor();
  await page.getByTestId("book-card-9781507707616").click();
  await expect(page.getByTestId("borrow-button")).toBeVisible();
});
