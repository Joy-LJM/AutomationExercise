import { test, expect } from "@playwright/test";

test("Login Flow", async ({ page }) => {
  await page.goto("https://automationexercise.com/");
  await page.click("text=Signup / Login");

  await page.fill('input[data-qa="login-email"]', "test@example.com");
  await page.fill('input[data-qa="login-password"]', "password123");

  await page.click('button[data-qa="login-button"]');
  await expect(page.locator("text=Logged in as")).toBeVisible();
});
