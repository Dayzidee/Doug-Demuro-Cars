from playwright.sync_api import sync_playwright, Page, expect

def run(playwright):
    """
    This script verifies the UI changes for the "Sell Your Car" feature.
    """
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()

    try:
        # 1. Verify Homepage UI
        print("Navigating to homepage...")
        page.goto("http://localhost:5173/")

        # Wait for the page to load and check for the new elements with specific locators
        print("Verifying homepage elements...")
        # Check for the nav link
        expect(page.get_by_role("navigation").get_by_role("link", name="Sell Your Car")).to_be_visible()
        # Check for the hero section link
        expect(page.get_by_role("main").get_by_role("link", name="Sell Your Car")).to_be_visible()
        # Check for the value proposition section heading
        expect(page.get_by_role("heading", name="Sell Your Car, The Smarter Way")).to_be_visible()

        print("Taking homepage screenshot...")
        page.screenshot(path="jules-scratch/verification/homepage_verification.png")

        # 2. Verify /sell Page
        print("Navigating to /sell page...")
        # We can click the nav link to navigate
        page.get_by_role("navigation").get_by_role("link", name="Sell Your Car").click()

        # Wait for the page to load and check for the form
        print("Verifying /sell page elements...")
        expect(page.get_by_role("heading", name="Sell Your Car With Us")).to_be_visible()
        expect(page.get_by_label("VIN")).to_be_visible()

        print("Taking /sell page screenshot...")
        page.screenshot(path="jules-scratch/verification/sell_page_verification.png")

        print("Verification script completed successfully.")

    except Exception as e:
        print(f"An error occurred during verification: {e}")
    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)
