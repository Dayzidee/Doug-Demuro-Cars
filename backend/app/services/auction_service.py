from typing import List, Dict, Any
from ..core.db import get_supabase

class AuctionEngine:
    """
    Handles the business logic for the auction system.
    """

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

    def get_bid_history(self, auction_id: str) -> List[Dict[str, Any]]:
        """
        Retrieves the full bidding history for a given auction.
        """
        supabase = get_supabase()
        response = supabase.table('bids') \
            .select('*') \
            .eq('auction_id', auction_id) \
            .order('bid_time', desc=True) \
            .execute()

        return response.data
