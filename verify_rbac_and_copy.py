import asyncio
from playwright.async_api import async_playwright

async def verify():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context(viewport={'width': 390, 'height': 844})
        page = await context.new_page()

        try:
            # 1. Login as Master
            await page.goto('http://localhost:5173')
            await page.wait_for_timeout(3000) # Give it time to load

            # Click Cuenta
            # Use data-testid or just text if it's unique
            await page.click('text=Cuenta')

            await page.wait_for_selector('input[placeholder="Ej. Andresito"]')
            await page.fill('input[placeholder="Ej. Andresito"]', 'andresito')
            await page.fill('input[placeholder="••••••••"]', 'master123')
            await page.click('button:has-text("Entrar")')

            # Wait for login to complete
            await page.wait_for_selector('text=andresito', timeout=10000)

            # 2. Check Editor - Quick Add Difficulty
            await page.click('text=Editor')
            await page.wait_for_timeout(1000)

            # Look for ANY button with "+"
            plus_buttons = await page.query_selector_all('button')
            for btn in plus_buttons:
                text = await btn.inner_text()
                if '+' in text:
                    await btn.click()
                    break

            await page.wait_for_timeout(500)
            await page.screenshot(path='/home/jules/verification/screenshots/quick_add_difficulty.png')

            # 3. Check Steps Tab (RBAC)
            await page.click('text=Mis Pasos')
            await page.wait_for_timeout(1000)
            await page.screenshot(path='/home/jules/verification/screenshots/admin_steps_view.png')

            # 4. Check Viewer - Copy functionality
            await page.click('text=Visor')
            await page.wait_for_timeout(1000)
            # Click the first h4 (Choreo title)
            await page.click('h4')
            await page.wait_for_timeout(1000)
            await page.screenshot(path='/home/jules/verification/screenshots/viewer_copy_button.png')

            print("Verification successful!")
        except Exception as e:
            print(f"Verification failed: {e}")
            await page.screenshot(path='/home/jules/verification/screenshots/error_state.png')
            content = await page.content()
            with open("error_page.html", "w") as f:
                f.write(content)
        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(verify())
