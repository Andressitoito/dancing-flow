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

  // Login as Andresito (Master)
  // The label is "Usuario" and placeholder "Ej. Andresito"
  await page.fill('input[placeholder="Ej. Andresito"]', 'andresito');
  await page.fill('input[placeholder="••••••••"]', 'master123');
  await page.click('button:has-text("Entrar")');

  // Wait for login to complete (Navbar should appear)
  await page.waitForSelector('nav');

  // Go to Account (Tab name is "Cuenta")
  await page.click('button:has-text("Cuenta")');
  await page.waitForTimeout(1000);

  // Select Latina Palette
  await page.click('button:has-text("Latina")');
  await page.waitForTimeout(1000);

  // Go to Editor
  await page.click('button:has-text("Editor")');
  await page.waitForSelector('input[placeholder="Nombre del paso"]');

  // Take screenshot
  await page.screenshot({ path: 'verification/screenshots/editor_latina.png' });

  // Go to Visor
  await page.click('button:has-text("Visor")');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'verification/screenshots/visor_latina.png' });

  // Go to Mis Pasos (Curatorship)
  await page.click('button:has-text("Mis Pasos")');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'verification/screenshots/curatorship_latina.png' });

  await browser.close();
})();
