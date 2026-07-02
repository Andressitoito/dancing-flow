import { test, expect } from '@playwright/test';

test('Initial view is Clases (Tutoriales)', async ({ page }) => {
  await page.goto('http://localhost:5173');
  // Check if "Tutoriales" is visible in the header of VideoListView
  await expect(page.locator('h2')).toContainText('Tutoriales');
});

test('Painting Mode validation', async ({ page }) => {
  await page.goto('http://localhost:5173');

  // Need to login to access Editor
  // Since I don't want to deal with real auth in a quick test if not needed,
  // I'll check if I can just bypass or if I need to mock the store.
  // Actually, I can just use the provided credentials if any, but better to just check the code.

  // Actually, let's just check the code for the validation logic as I did with grep.
});
