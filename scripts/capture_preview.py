import asyncio
from pathlib import Path

URL = "https://chienchitung.github.io"
OUTPUT = Path(__file__).resolve().parent.parent / "assets" / "img" / "preview.png"

async def main():
    try:
        from playwright.async_api import async_playwright
    except ImportError:
        raise SystemExit("Playwright is not installed. Install with: pip install playwright && playwright install chromium")

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)

    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": 1440, "height": 900})
        await page.goto(URL, wait_until="networkidle")
        # Wait a bit for any animations to settle
        await page.wait_for_timeout(800)
        # Full page screenshot
        await page.screenshot(path=str(OUTPUT), full_page=True)
        await browser.close()
        print(f"Saved preview to {OUTPUT}")

if __name__ == "__main__":
    asyncio.run(main())
