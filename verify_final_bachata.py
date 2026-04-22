import asyncio
from playwright.async_api import async_playwright
import os

async def run_verification():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        # Mobile-first viewport
        context = await browser.new_context(viewport={'width': 390, 'height': 844})
        page = await context.new_page()

        # 1. Start at Account page
        print("Opening Account page...")
        await page.goto("http://localhost:5173/")

        # Click "Cuenta" in Navbar
        await page.click("button:has-text('Cuenta')")

        # 2. Login
        print("Logging in...")
        # Search for input with placeholder containing Andresito
        await page.wait_for_selector("input[placeholder*='Andresito']", timeout=10000)
        await page.fill("input[placeholder*='Andresito']", "andresito")
        await page.fill("input[placeholder*='••••••••']", "master123")
        await page.click("button:has-text('Entrar')")

        # Wait for login to complete (should show username or logout button)
        await page.wait_for_selector("button:has-text('Cerrar Sesión')", timeout=10000)
        await page.screenshot(path="/home/jules/verification/screenshots/final_logged_in.png")

        # 3. Check Sequencer (Editor)
        print("Checking Editor...")
        await page.click("button:has-text('Editor')")
        # In EditorView, we have an input with placeholder "Mi Coreo..."
        await page.wait_for_selector("input[placeholder*='Mi Coreo...']", timeout=10000)
        # Check if the sequencer grid is visible (grid-cols-8)
        await page.wait_for_selector(".grid-cols-8", timeout=10000)
        await page.screenshot(path="/home/jules/verification/screenshots/final_editor_view.png")

        # 4. Check Mis Pasos (Curatorship)
        print("Checking Mis Pasos...")
        await page.click("button:has-text('Mis Pasos')")
        # MyStepsView has h2 "Mis Pasos" and p "GESTIÓN DE BIBLIOTECA GLOBAL"
        await page.wait_for_selector("text=GESTIÓN DE BIBLIOTECA GLOBAL", timeout=10000)
        await page.screenshot(path="/home/jules/verification/screenshots/final_curatorship_view.png")

        # 5. Check Palette Switching
        print("Checking Palettes...")
        await page.click("button:has-text('Cuenta')")
        # Click Latina palette
        await page.click("button:has-text('Latina')")
        await page.wait_for_timeout(1000)
        await page.screenshot(path="/home/jules/verification/screenshots/final_palette_latina.png")

        await page.click("button:has-text('Tropical')")
        await page.wait_for_timeout(1000)
        await page.screenshot(path="/home/jules/verification/screenshots/final_palette_tropical.png")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(run_verification())
