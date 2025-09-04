from typing import List, Dict, Any
from ..core.db import get_supabase

class AuctionEngine:
    """
    Handles the business logic for the real-time auction system.
    """

    def create_auction(self, auction_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Creates a new auction. Admin only.
        - Validates vehicle exists and is eligible for auction.
        - Creates a new record in the 'auctions' table.
        """
        supabase = get_supabase()
        vehicle_id = auction_data.get('vehicle_id')
        if not vehicle_id:
            raise ValueError("vehicle_id is required to create an auction.")

        # 1. Validate vehicle exists and is not already in an active auction.
        # This is a simplified check. A real implementation might check for overlapping auction times.
        vehicle_response = supabase.table('vehicles').select('id, status').eq('id', vehicle_id).single().execute()
        if not vehicle_response.data:
            raise ValueError(f"Vehicle with id {vehicle_id} not found.")

        if vehicle_response.data['status'] != 'Available':
             raise ValueError(f"Vehicle {vehicle_id} is not available for auction. Current status: {vehicle_response.data['status']}")

        # 2. Insert into 'auctions' table.
        # The data is taken from the request body, which should match the AuctionCreate schema.
        insert_response = supabase.table('auctions').insert(auction_data).execute()

        if not insert_response.data:
            raise Exception("Failed to create auction record.")

        # 3. Optionally, update the vehicle's status to 'Pending' or 'In-auction'
        supabase.table('vehicles').update({'status': 'Pending'}).eq('id', vehicle_id).execute()

        return insert_response.data[0]

    def get_live_auctions(self) -> List[Dict[str, Any]]:
        """
        Retrieves all auctions with 'live' status.
        """
        supabase = get_supabase()
        response = supabase.table('auctions') \
            .select('*') \
            .eq('status', 'live') \
            .execute()
        return response.data

    def get_auction(self, auction_id: str) -> Dict[str, Any]:
        """
        Gets details for a single auction by its ID.
        """
        supabase = get_supabase()
        response = supabase.table('auctions') \
            .select('*') \
            .eq('id', auction_id) \
            .single() \
            .execute()

        if not response.data:
            raise ValueError(f"Auction with id {auction_id} not found.")

        return response.data
