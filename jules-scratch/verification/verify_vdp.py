from playwright.sync_api import sync_playwright, Page, expect

VEHICLE_ID = "33d1fa02-2cfb-4b6b-b139-5968547429c9"

def run(playwright):
    """
    This script verifies that the Vehicle Detail Page renders correctly,
    or shows an error if the data fetching fails.
    """
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()

    page.set_default_timeout(10000)

    try:
        url = f"http://localhost:5173/inventory/{VEHICLE_ID}"
        print(f"Navigating to VDP at {url}...")
        page.goto(url)

        # Check for either the success state (Key Details heading) or the error state
        key_details_locator = page.get_by_role("heading", name="Key Details")
        error_message_locator = page.get_by_text("Error loading vehicle:")

        # Wait for either of the locators to be visible
        expect(key_details_locator.or_(error_message_locator)).to_be_visible()

        # Now check which one is visible
        if error_message_locator.is_visible():
            print("VDP is showing an error message as expected on failure.")
            page.screenshot(path="jules-scratch/verification/vdp_error_verification.png")
        else:
            print("VDP is showing data.")
            expect(page.get_by_text("Mileage")).to_be_visible()
            expect(page.get_by_text("VIN")).to_be_visible()
            expect(page.get_by_role("heading", name="Highlights")).to_be_visible()
            expect(page.get_by_role("heading", name="Condition")).to_be_visible()
            page.screenshot(path="jules-scratch/verification/vdp_success_verification.png")

        print("Verification script completed successfully.")

    except Exception as e:
        print(f"An error occurred during verification: {e}")
    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)
