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

    def place_bid(self, user_id: str, auction_id: str, amount: float) -> Dict[str, Any]:
        """
        Places a bid on an auction for a verified user.
        """
        supabase = get_supabase()

        # TODO: This entire method should be executed within a database transaction
        # to prevent race conditions. This can be achieved by moving the logic
        # into a PostgreSQL function and calling it via RPC.

        # 1. Get current auction state and user verification tier
        auction = self.get_auction(auction_id)

        user_profile = supabase.table('profiles').select('verification_tier').eq('id', user_id).single().execute().data
        if not user_profile:
            raise ValueError("User profile not found.")

        # 2. Perform validations
        if auction.get('status') != 'live':
            raise ValueError("Bids can only be placed on live auctions.")

        if amount <= auction.get('current_bid', 0):
            raise ValueError(f"Bid amount must be greater than the current bid of {auction.get('current_bid', 0)}.")

        tier_map = {'none': 0, 'basic': 1, 'premium': 2}
        user_tier_level = tier_map.get(user_profile.get('verification_tier'), 0)
        min_tier_level = tier_map.get(auction.get('min_verification_tier'), 1)

        if user_tier_level < min_tier_level:
            raise ValueError(f"User verification tier does not meet the minimum requirement for this auction.")

        # 3. Insert the new bid
        bid_data = {
            "auction_id": auction_id,
            "user_id": user_id,
            "amount": amount,
            "verification_tier": user_profile.get('verification_tier')
        }
        insert_response = supabase.table('bids').insert(bid_data).execute()
        if not insert_response.data:
            raise Exception("Failed to place bid.")

        new_bid = insert_response.data[0]

        # 4. Update the auction's current bid and bid count
        supabase.table('auctions') \
            .update({
                'current_bid': amount,
                'bid_count': auction.get('bid_count', 0) + 1
            }) \
            .eq('id', auction_id) \
            .execute()

        # TODO: 5. Emit a 'bid_placed' event to a Supabase Realtime channel.

        return new_bid
