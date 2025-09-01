import os
from dotenv import load_dotenv
from supabase import create_client, Client

def main():
    """
    Connects to Supabase and prints the ID of the first vehicle.
    """
    load_dotenv(dotenv_path='db.env')
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_KEY")

    if not url or not key:
        print("Error: SUPABASE_URL and SUPABASE_KEY must be set in db.env")
        return

    try:
        supabase: Client = create_client(url, key)
        response = supabase.table('vehicles').select('id').limit(1).execute()

        if response.data:
            vehicle_id = response.data[0]['id']
            print(f"VEHICLE_ID:{vehicle_id}")
        else:
            print("No vehicles found in the database.")

    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    main()
