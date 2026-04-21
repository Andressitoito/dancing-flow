const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
  });
  const page = await context.newPage();

  // Go to app
  await page.goto('http://localhost:3000');

  // Login
  await page.fill('input[type="text"]', 'master');
  await page.fill('input[type="password"]', 'master123');
  await page.click('button:has-text("Entrar")');

  // Go to Account and select Latina
  await page.click('a:has-text("Cuenta")');
  await page.waitForTimeout(500);
  await page.click('button:has-text("Latina")');

  // Go to Editor
  await page.click('a:has-text("Editor")');
  await page.waitForTimeout(500);

  // Take screenshot
  await page.screenshot({ path: 'verification/screenshots/editor_latina.png' });

  // Go to Visor
  await page.click('a:has-text("Visor")');
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'verification/screenshots/visor_latina.png' });

  await browser.close();
})();
