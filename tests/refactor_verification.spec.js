import { test, expect } from '@playwright/test';

test('Dancing Flow Refactor - Visibility & Navigation Check', async ({ page }) => {
  // Go to the app
  await page.goto('http://localhost:5173');

  // Verify Landing Page content
  await expect(page.locator('h1')).toContainText('DANCING FLOW');
  await expect(page.locator('text=Conoce a tus mentores')).toBeVisible();

  // Navigate to About Us
  await page.click('nav >> text=Nosotros');
  await expect(page.locator('h1')).toContainText('QUIENES SOMOS');

  // Navigate to Login
  await page.click('nav >> text=Entrar');
  await expect(page.locator('h2')).toContainText('DANCING FLOW');
  await expect(page.locator('text=Portal de Acceso')).toBeVisible();

  // Try to login with incorrect credentials
  await page.fill('input[placeholder="Identificación"]', 'wronguser');
  await page.fill('input[placeholder="Seguridad"]', 'wrongpass');
  await page.click('button:has-text("ENTRAR AL TEMPLO")');

  // Check for error modal
  await expect(page.locator('.swal2-popup')).toBeVisible();
  await expect(page.locator('.swal2-title')).toContainText('Error de Acceso');
  await page.click('.swal2-confirm');

  // Check Register form
  await page.click('text=Regístrate aquí');
  await expect(page.locator('button:has-text("UNIRSE AHORA")')).toBeVisible();
  await expect(page.locator('text=Nivel Inicial')).toBeVisible();
  await expect(page.locator('text=Token de Acceso')).toBeVisible();

  await page.screenshot({ path: 'verification_refactor.png' });
});
