# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/e2e_flow.spec.js >> BachataFlow Sequencer MVP - Complete Flow
- Location: tests/e2e_flow.spec.js:3:1

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('text=Cuenta')

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - navigation [ref=e4]:
    - generic [ref=e5]:
      - generic [ref=e7] [cursor=pointer]: DANCING FLOW
      - generic [ref=e8]:
        - button "Inicio" [ref=e9]:
          - img [ref=e10]
          - generic [ref=e13]: Inicio
        - button "Nosotros" [ref=e15]:
          - img [ref=e16]
          - generic [ref=e21]: Nosotros
        - button "Entrar" [ref=e22]:
          - img [ref=e23]
          - generic [ref=e26]: Entrar
  - main [ref=e27]:
    - generic [ref=e28]:
      - generic [ref=e29]:
        - generic [ref=e32]:
          - heading "DANCING FLOW" [level=1] [ref=e33]
          - paragraph [ref=e34]: MASTERY & MENTORSHIP
          - button "Comenzar ahora" [ref=e36]
        - generic [ref=e37]:
          - generic [ref=e38]: Descubre el prestigio
          - img [ref=e39]
      - generic [ref=e42]:
        - generic [ref=e43]:
          - generic [ref=e44]: PRESTIGIO & TÉCNICA
          - heading "Conoce a tus mentores" [level=2] [ref=e45]
        - generic [ref=e46]:
          - generic [ref=e47]:
            - generic [ref=e48]:
              - img "Marco Rivera" [ref=e49]
              - generic [ref=e51]:
                - heading "Marco Rivera" [level=3] [ref=e52]
                - paragraph [ref=e53]: Director de Bachata Sensual
            - generic [ref=e54]:
              - paragraph [ref=e55]: "\"Especialista en técnica de conexión y musicalidad con más de 15 años de trayectoria en los escenarios más prestigiosos de Europa.\""
              - paragraph [ref=e56]: Finalista de varios certámenes internacionales y mentor de las nuevas generaciones de bailarines profesionales.
              - generic [ref=e57]:
                - button [ref=e58]:
                  - img [ref=e59]
                - button [ref=e62]:
                  - img [ref=e63]
          - generic [ref=e65]:
            - generic [ref=e66]:
              - img "Elena Sanchís" [ref=e67]
              - generic [ref=e69]:
                - heading "Elena Sanchís" [level=3] [ref=e70]
                - paragraph [ref=e71]: Técnica de Movimiento
            - generic [ref=e72]:
              - paragraph [ref=e73]: "\"Coreógrafa profesional, experta en expresión corporal y técnica femenina. Su visión une la danza clásica con el flujo moderno.\""
              - paragraph [ref=e74]: Directora artística con giras mundiales y especialista en perfeccionamiento técnico de alto rendimiento.
              - generic [ref=e75]:
                - button [ref=e76]:
                  - img [ref=e77]
                - button [ref=e80]:
                  - img [ref=e81]
      - generic [ref=e84]:
        - generic [ref=e85]:
          - generic [ref=e86]: 15+
          - generic [ref=e87]: Años de Excelencia
        - generic [ref=e88]:
          - generic [ref=e89]: 2k+
          - generic [ref=e90]: Alumnos Graduados
        - generic [ref=e91]:
          - generic [ref=e92]: "42"
          - generic [ref=e93]: Premios Internacionales
        - generic [ref=e94]:
          - generic [ref=e95]: "12"
          - generic [ref=e96]: Sedes Mundiales
      - generic [ref=e98]:
        - generic [ref=e99]: La voz de la maestría
        - generic [ref=e100]:
          - generic:
            - generic:
              - img
              - img
              - img
              - img
              - img
            - paragraph: "\"Nuestra metodología de mentoría redefine la evolución artística. No solo enseñamos pasos; guiamos la maestría.\""
            - paragraph: — Marco R.
          - generic [ref=e101]:
            - generic [ref=e102]:
              - img [ref=e103]
              - img [ref=e105]
              - img [ref=e107]
              - img [ref=e109]
              - img [ref=e111]
            - paragraph [ref=e113]: "\"El perfeccionamiento técnico requiere disciplina y una visión clara. Aquí lo hacemos posible.\""
            - paragraph [ref=e114]: — Elena S.
          - generic:
            - generic:
              - img
              - img
              - img
              - img
              - img
            - paragraph: "\"Dancing Flow es el epicentro de la excelencia en el baile social y profesional.\""
            - paragraph: — Andrés L.
        - generic [ref=e115]:
          - button [ref=e116]
          - button [ref=e117]
          - button [ref=e118]
      - generic [ref=e119]:
        - heading "Únete a la Élite" [level=2] [ref=e120]
        - button "Inscribirme ahora" [ref=e121]
      - generic [ref=e123]:
        - generic [ref=e124]: DANCING FLOW
        - generic [ref=e125]:
          - generic [ref=e126]: Privacidad
          - generic [ref=e127]: Soporte
          - generic [ref=e128]: Términos
        - paragraph [ref=e129]: © 2024 DANCING FLOW ACADEMY.
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
> 8  |   await page.click('text=Cuenta');
     |              ^ Error: page.click: Test timeout of 30000ms exceeded.
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
  23 |   // Verify login success by checking if "Editor" appears in Navbar
  24 |   await expect(page.locator('nav')).toContainText('Editor', { timeout: 10000 });
  25 |
  26 |   // Navigate to Editor
  27 |   await page.click('nav >> text=Editor');
  28 |
  29 |   // Verify we are in the editor grid (Current Choreo title input is there)
  30 |   // By default it might have "NUEVA COREOGRAFIA" or similar in placeholder
  31 |   await expect(page.locator('input[placeholder="Nombre de la coreo..."]')).toBeVisible();
  32 |
  33 |   // Set a title
  34 |   await page.fill('input[placeholder="Nombre de la coreo..."]', 'Coreo de Prueba');
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
  47 |   // Target the plus button in the floating toolbar, not the header one
  48 |   await page.locator('div.fixed.bottom-24 button:has(.lucide-plus)').click();
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
  77 |   await expect(page.locator('text=Lead Guidance')).toBeVisible();
  78 |   await expect(page.locator('text=Lead move')).toBeVisible();
  79 |   await expect(page.locator('text=Follower move')).toBeVisible();
  80 |
  81 |   // Stop
  82 |   await page.locator('button:has(.lucide-square)').first().click();
  83 |
  84 |   // Take a final screenshot
  85 |   await page.screenshot({ path: '/home/jules/verification/screenshots/final_flow.png' });
  86 | });
  87 |
```