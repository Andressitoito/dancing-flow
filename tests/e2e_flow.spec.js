import { test, expect } from '@playwright/test';

test('BachataFlow Sequencer MVP - Complete Flow', async ({ page }) => {
  // Go to the app
  await page.goto('http://localhost:5173');

  // Navigate to Account (Cuenta) to Login
  await page.click('text=Cuenta');

  // Register a new user to ensure we have valid credentials
  await page.click('text=¿No tienes cuenta? Regístrate');
  await page.fill('input[placeholder="Ej. Juan"]', 'Test');
  await page.fill('input[placeholder="Ej. Perez"]', 'User');
  await page.fill('input[placeholder="Ej. Andresito"]', 'testuser' + Date.now());
  await page.fill('input[placeholder="••••••••"]', 'password123');
  await page.fill('input[placeholder="Token de acceso"]', 'bachata2026');
  await page.click('button:has-text("Registrarme")');

  // After registration, it should log in automatically.
  // Wait for the SweetAlert and close it
  await page.locator('.swal2-confirm').click();

  // Verify login success by checking if "Creador" appears in Navbar
  await expect(page.locator('nav')).toContainText('Creador', { timeout: 10000 });

  // Navigate to Creador
  await page.click('nav >> text=Creador');

  // Verify we are in the editor grid (Current Choreo title input is there)
  // By default it might have "NUEVA COREOGRAFIA" or similar in placeholder
  await expect(page.locator('input[placeholder="Mi Bachata Flow..."]')).toBeVisible();

  // Set a title
  await page.fill('input[placeholder="Mi Bachata Flow..."]', 'Coreo de Prueba');

  // Test Painting Mode: Select 4T
  await page.getByRole('button', { name: '4T' }).click();

  // Click on the first slot (Slot 1)
  // The slots are divs with s+1 text
  await page.getByText('1', { exact: true }).first().click();

  // Verify a block was added. It should have text "PASO" (renders as PASO due to CSS uppercase)
  await expect(page.getByText('PASO', { exact: false }).first()).toBeVisible();

  // Exit painting mode to allow editing
  // The plus icon was replaced by ChevronRight in v2 of EditorView
  await page.locator('div.fixed.bottom-24 button:has(.lucide-chevron-right)').click();

  // Edit the block
  await page.getByText('PASO', { exact: false }).first().click();
  await page.fill('input[placeholder="Ej: Básico con giro"]', 'Paso de Prueba');
  await page.fill('textarea[placeholder="Guía para él..."]', 'Lead move');
  await page.fill('textarea[placeholder="Guía para ella..."]', 'Follower move');
  await page.click('button:has-text("Guardar Bloque")');

  // Verify name updated in grid
  await expect(page.locator('text=Paso de Prueba')).toBeVisible();

  // Save Choreo
  await page.locator('button:has(.lucide-save)').click();

  // Navigate to Viewer
  await page.click('text=Visor');

  // Verify the new choreo is in the list
  await expect(page.getByRole('heading', { name: 'Coreo de Prueba', exact: false }).first()).toBeVisible();

  // Open it
  await page.getByRole('heading', { name: 'Coreo de Prueba', exact: false }).first().click();

  // Play
  await page.locator('button:has(.lucide-play)').first().click();

  // Verify Technical Guidance appears during playback
  // Since we are at slot 1, it should show immediately
  await expect(page.getByText('Líder')).toBeVisible({ timeout: 10000 });
  // Using more flexible locator for the instructions text and accounting for quotes
  // Double tap the slot first to ensure it's active
  await page.getByText('1', { exact: true }).first().click({ clickCount: 2 });
  await expect(page.getByText('Lead move', { exact: false })).toBeVisible({ timeout: 15000 });
  await expect(page.getByText('Follower move', { exact: false })).toBeVisible({ timeout: 15000 });

  // Stop
  await page.locator('button:has(.lucide-square)').first().click();

  // Take a final screenshot
  await page.screenshot({ path: '/home/jules/verification/screenshots/final_flow.png' });
});
