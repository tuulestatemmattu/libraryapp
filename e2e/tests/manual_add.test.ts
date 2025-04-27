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

test.afterEach({}, async () => {
  await axios.post(`${BACKEND_URL}/api/testing/resetdb`, {
    secret: CRON_SECRET,
  });
});

test("Page loads", async ({ page, context }) => {
  await page.goto(FRONTEND_URL, { waitUntil: "load" });
  await expect(page.locator("text=LibraryApp")).toBeVisible();
  await expect(page.getByText("testing")).toBeVisible();
});

test("Add book by form", async ({ page, context }) => {
  await page.goto(FRONTEND_URL, { waitUntil: "load" });

  await page.getByRole("button", { name: "Add book" }).waitFor();
  await page.getByRole("button", { name: "Add book" }).click();

  await page.getByLabel("Title").waitFor();
  await page.getByLabel("Author").waitFor();
  await page.getByLabel("ISBN").waitFor();
  await page.getByLabel("Description").waitFor();
  await page.getByLabel("Publication date").waitFor();

  await page.getByLabel("Title").fill("Testing book1");
  await page
    .getByLabel("Author")
    .fill("Test Author 1, Test Author 2, Test Author 3");
  await page.getByLabel("ISBN").fill("9780134685991");
  await page.getByLabel("Description").fill("Test description");
  await page.getByLabel("Publication date").fill("2012-06-29");

  await page.getByRole("button", { name: "Add", exact: true }).waitFor();
  await page.getByRole("button", { name: "Add", exact: true }).click();

  await page.goto(FRONTEND_URL, { waitUntil: "load" });

  const bookTitle = await page.getByText("Testing book1");
  await expect(bookTitle).toBeVisible();
});

test("Add book by isbn", async ({ page, context }) => {
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

  await expect(
    await page.getByText("C# Programming for Beginners")
  ).toBeVisible();
});

test("Add multiple books", async ({ page, context }) => {
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

  await page.getByText("+").waitFor();
  await page.getByText("+").click();

  await page.getByRole("button", { name: "Add", exact: true }).waitFor();
  await page.getByRole("button", { name: "Add", exact: true }).click();

  await page.goto(FRONTEND_URL, { waitUntil: "load" });

  await (
    await page.getByTestId("book-card-9781507707616")
  ).scrollIntoViewIfNeeded();

  await page.getByTestId("book-card-9781507707616").click();

  await expect(
    await page.getByText("Title: C# Programming for Beginners")
  ).toBeVisible();

  await expect(await page.getByText("Copies available: 2")).toBeVisible();
});
