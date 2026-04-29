# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/e2e_flow.spec.js >> BachataFlow Sequencer MVP - Complete Flow
- Location: tests/e2e_flow.spec.js:3:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Lead move')
Expected: visible
Timeout: 15000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 15000ms
  - waiting for getByText('Lead move')

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - main [ref=e4]:
    - generic [ref=e6]:
      - generic [ref=e7]:
        - button [ref=e8]:
          - img [ref=e9]
        - generic [ref=e11]:
          - heading "COREO DE PRUEBA" [level=2] [ref=e12]
          - paragraph [ref=e13]: "AUTOR: testuser_1777381755"
        - generic [ref=e14]:
          - button [ref=e15]:
            - img [ref=e16]
          - button [ref=e18]:
            - img [ref=e19]
      - generic [ref=e22]:
        - generic [ref=e23]:
          - generic [ref=e24]: "1"
          - generic [ref=e25]: Giro Simple
        - generic [ref=e27]: "5"
        - generic [ref=e29]: "6"
        - generic [ref=e31]: "7"
        - generic [ref=e33]: "8"
        - generic [ref=e35]: "1"
        - generic [ref=e37]: "2"
        - generic [ref=e39]: "3"
        - generic [ref=e41]: "4"
        - generic [ref=e43]: "5"
        - generic [ref=e45]: "6"
        - generic [ref=e47]: "7"
        - generic [ref=e49]: "8"
      - generic [ref=e52]: Doble toque en un tiempo para empezar desde ahí.
      - generic [ref=e54]:
        - generic [ref=e55]:
          - button [ref=e56]:
            - img [ref=e57]
          - button [ref=e60]
        - generic [ref=e62]:
          - generic [ref=e63]: "BPM: 120"
          - slider [ref=e64] [cursor=pointer]: "120"
        - button "CUADRÍCULA" [ref=e65]
  - navigation [ref=e66]:
    - button "Visor" [ref=e67]:
      - img [ref=e68]
      - generic [ref=e71]: Visor
    - button "Clases" [ref=e72]:
      - img [ref=e73]
      - generic [ref=e76]: Clases
    - button "Creador" [ref=e77]:
      - img [ref=e78]
      - generic [ref=e83]: Creador
    - button "Pasos" [ref=e84]:
      - img [ref=e85]
      - generic [ref=e88]: Pasos
    - button "Cuenta" [ref=e89]:
      - img [ref=e90]
      - generic [ref=e93]: Cuenta
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  |
  3  | test('BachataFlow Sequencer MVP - Complete Flow', async ({ page }) => {
  4  |   // Go to the app
  5  |   await page.goto('http://localhost:5173');
  6  |
  7  |   // Navigate to Account (Cuenta) to Login
  8  |   await page.click('text=Cuenta');
  9  |
  10 |   // Register a new user to ensure we have valid credentials
  11 |   await page.click('text=¿No tienes cuenta? Regístrate');
  12 |   await page.fill('input[placeholder="Ej. Juan"]', 'Test');
  13 |   await page.fill('input[placeholder="Ej. Perez"]', 'User');
  14 |   await page.fill('input[placeholder="Ej. Andresito"]', 'testuser' + Date.now());
  15 |   await page.fill('input[placeholder="••••••••"]', 'password123');
  16 |   await page.fill('input[placeholder="Token de acceso"]', 'bachata2026');
  17 |   await page.click('button:has-text("Registrarme")');
  18 |
  19 |   // After registration, it should log in automatically.
  20 |   // Wait for the SweetAlert and close it
  21 |   await page.locator('.swal2-confirm').click();
  22 |
  23 |   // Verify login success by checking if "Creador" appears in Navbar
  24 |   await expect(page.locator('nav')).toContainText('Creador', { timeout: 10000 });
  25 |
  26 |   // Navigate to Creador
  27 |   await page.click('nav >> text=Creador');
  28 |
  29 |   // Verify we are in the editor grid (Current Choreo title input is there)
  30 |   // By default it might have "NUEVA COREOGRAFIA" or similar in placeholder
  31 |   await expect(page.locator('input[placeholder="Mi Bachata Flow..."]')).toBeVisible();
  32 |
  33 |   // Set a title
  34 |   await page.fill('input[placeholder="Mi Bachata Flow..."]', 'Coreo de Prueba');
  35 |
  36 |   // Test Painting Mode: Select 4T
  37 |   await page.getByRole('button', { name: '4T' }).click();
  38 |
  39 |   // Click on the first slot (Slot 1)
  40 |   // The slots are divs with s+1 text
  41 |   await page.getByText('1', { exact: true }).first().click();
  42 |
  43 |   // Verify a block was added. It should have text "PASO" (renders as PASO due to CSS uppercase)
  44 |   await expect(page.getByText('PASO', { exact: false }).first()).toBeVisible();
  45 |
  46 |   // Exit painting mode to allow editing
  47 |   // The plus icon was replaced by ChevronRight in v2 of EditorView
  48 |   await page.locator('div.fixed.bottom-24 button:has(.lucide-chevron-right)').click();
  49 |
  50 |   // Edit the block
  51 |   await page.getByText('PASO', { exact: false }).first().click();
  52 |   await page.fill('input[placeholder="Ej: Básico con giro"]', 'Paso de Prueba');
  53 |   await page.fill('textarea[placeholder="Guía para él..."]', 'Lead move');
  54 |   await page.fill('textarea[placeholder="Guía para ella..."]', 'Follower move');
  55 |   await page.click('button:has-text("Guardar Bloque")');
  56 |
  57 |   // Verify name updated in grid
  58 |   await expect(page.locator('text=Paso de Prueba')).toBeVisible();
  59 |
  60 |   // Save Choreo
  61 |   await page.locator('button:has(.lucide-save)').click();
  62 |
  63 |   // Navigate to Viewer
  64 |   await page.click('text=Visor');
  65 |
  66 |   // Verify the new choreo is in the list
  67 |   await expect(page.getByRole('heading', { name: 'Coreo de Prueba', exact: false }).first()).toBeVisible();
  68 |
  69 |   // Open it
  70 |   await page.getByRole('heading', { name: 'Coreo de Prueba', exact: false }).first().click();
  71 |
  72 |   // Play
  73 |   await page.locator('button:has(.lucide-play)').first().click();
  74 |
  75 |   // Verify Technical Guidance appears during playback
  76 |   // Since we are at slot 1, it should show immediately
  77 |   await expect(page.getByText('Líder')).toBeVisible({ timeout: 10000 });
  78 |   // Using more flexible locator for the instructions text and accounting for quotes
  79 |   // Double tap the slot first to ensure it's active
  80 |   await page.getByText('1', { exact: true }).first().click({ clickCount: 2 });
> 81 |   await expect(page.getByText('Lead move', { exact: false })).toBeVisible({ timeout: 15000 });
     |                                                               ^ Error: expect(locator).toBeVisible() failed
  82 |   await expect(page.getByText('Follower move', { exact: false })).toBeVisible({ timeout: 15000 });
  83 |
  84 |   // Stop
  85 |   await page.locator('button:has(.lucide-square)').first().click();
  86 |
  87 |   // Take a final screenshot
  88 |   await page.screenshot({ path: '/home/jules/verification/screenshots/final_flow.png' });
  89 | });
  90 |
```