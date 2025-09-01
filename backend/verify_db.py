import os
from dotenv import load_dotenv
from supabase import create_client, Client

def main():
    """
    Connects to Supabase and verifies if the vehicles table is seeded.
    """
    # Load environment variables from .env file
    load_dotenv(dotenv_path='db.env')

    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_KEY")

    if not url or not key:
        print("Error: SUPABASE_URL and SUPABASE_KEY must be set in db.env")
        return

    print(f"Connecting to Supabase at {url}...")

    try:
        supabase: Client = create_client(url, key)
        print("Successfully created Supabase client.")

        # Verify connection and query data
        response = supabase.table('vehicles').select('*', count='exact').limit(5).execute()

        print("API Response received.")

        # The data is in the 'data' attribute of the response object
        data = response.data
        count = response.count

        print(f"Found {count} vehicles in the database.")

        if count > 0:
            print("Database is seeded! Here are the first 5 vehicles:")
            for vehicle in data:
                print(f"- {vehicle.get('year')} {vehicle.get('make')} {vehicle.get('model')} (VIN: {vehicle.get('vin')})")
            print("\nDatabase verification successful.")
        else:
            print("Database is not seeded. The 'vehicles' table is empty.")

    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    main()
