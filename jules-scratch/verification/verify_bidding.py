from playwright.sync_api import sync_playwright, Page, expect

VEHICLE_ID = "33d1fa02-2cfb-4b6b-b139-5968547429c9"
NEW_BID_AMOUNT = 26000

def run(playwright):
    """
    This script performs an end-to-end test of the bidding feature.
    """
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()

    page.set_default_timeout(15000)

    try:
        url = f"http://localhost:5173/inventory/{VEHICLE_ID}"
        print(f"Navigating to VDP at {url}...")
        page.goto(url)

        # Wait for the bidding section to be ready
        expect(page.get_by_role("heading", name="Bidding")).to_be_visible()

        # Get the bid history list
        bid_history_list = page.locator("ul").filter(has_text="by")

        # Place a new bid
        print(f"Placing a new bid of ${NEW_BID_AMOUNT}...")
        bid_input = page.get_by_label("Your Bid Amount")
        bid_input.fill(str(NEW_BID_AMOUNT))
        page.get_by_role("button", name="Place Bid").click()

        # Wait for the new bid to appear in the history
        print("Waiting for bid history to update...")
        new_bid_locator = bid_history_list.get_by_text(f"${NEW_BID_AMOUNT:,.0f}")
        expect(new_bid_locator).to_be_visible()

        print("New bid found in history.")

        # Verify the new bid is at the top
        first_bid_in_list = bid_history_list.locator("li").first
        expect(first_bid_in_list).to_contain_text(f"${NEW_BID_AMOUNT:,.0f}")

        print("Taking bidding screenshot...")
        page.screenshot(path="jules-scratch/verification/bidding_verification.png")

        print("Verification script completed successfully.")

    except Exception as e:
        print(f"An error occurred during verification: {e}")
    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)
