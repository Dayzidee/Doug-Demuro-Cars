from playwright.sync_api import sync_playwright, Page, expect
import json

def run(playwright):
    """
    This script performs an end-to-end test of the "Sell Your Car" form submission.
    """
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()

    # Increase the timeout for this long-running test
    page.set_default_timeout(10000)

    try:
        print("Navigating to /sell page...")
        page.goto("http://localhost:5173/sell")

        # --- Step 1: Basic Information ---
        print("Filling out Step 1...")
        page.get_by_label("VIN").fill("VIN_TEST_12345678") # 17 characters
        page.get_by_label("Make").fill("Test Make")
        page.get_by_label("Model").fill("Test Model")
        page.get_by_label("Year").fill("2022")
        page.get_by_label("Mileage").fill("15000")
        page.get_by_label("Asking Price").fill("25000")
        page.get_by_role("button", name="Next Step").click()

        # --- Step 2: Detailed Specifications ---
        print("Filling out Step 2...")
        page.get_by_label("Body Type").select_option("SUV")
        page.get_by_label("Fuel Type").select_option("Gasoline")
        page.get_by_label("Transmission").select_option("Automatic")
        page.get_by_label("Exterior Color").fill("Test Blue")
        page.get_by_label("Interior Color").fill("Test Black")
        page.get_by_label("Engine").fill("2.0L Turbo")
        page.get_by_role("button", name="Next Step").click()

        # --- Step 3: Condition & History ---
        print("Filling out Step 3...")
        page.get_by_role("button", name="+ Add Highlight").click()
        page.wait_for_timeout(500) # Wait for the new field to appear
        page.locator('input[name="highlights.0.value"]').fill("One Owner")

        page.get_by_role("button", name="+ Add Highlight").click()
        page.wait_for_timeout(500) # Wait for the new field to appear
        page.locator('input[name="highlights.1.value"]').fill("Low Mileage")

        page.get_by_label("Known Flaws").fill("Minor scratch on rear bumper.")
        page.get_by_label("Seller Notes").fill("Well-maintained, records available.")

        # Provide valid JSON for the history fields
        service_history_json = json.dumps([{ "date": "2023-05-10", "service": "Oil Change" }])
        owner_history_json = json.dumps({ "previous_owners": 2, "last_owner_duration_years": 3 })
        page.get_by_label("Service History").fill(service_history_json)
        page.get_by_label("Owner History").fill(owner_history_json)

        page.get_by_role("button", name="Next Step").click()

        # --- Step 4: Review & Submit ---
        print("Reviewing Step 4...")
        expect(page.get_by_role("heading", name="Review Your Listing")).to_be_visible()
        expect(page.get_by_text("VIN_TEST_12345678")).to_be_visible()
        expect(page.get_by_text("Test Make")).to_be_visible()
        expect(page.get_by_text("One Owner")).to_be_visible()

        print("Taking review page screenshot...")
        page.screenshot(path="jules-scratch/verification/review_page_verification.png")

        # --- Submission ---
        print("Submitting the form...")

        # Listen for the alert dialog
        page.on("dialog", lambda dialog: dialog.accept())

        page.get_by_role("button", name="Submit Listing").click()

        # The alert is handled by the listener.
        print("Form submission initiated.")

        # Give a moment for the async operations to complete
        page.wait_for_timeout(2000)

        print("Verification script completed successfully.")

    except Exception as e:
        print(f"An error occurred during verification: {e}")
    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)
