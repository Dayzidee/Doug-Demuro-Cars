from flask import Blueprint, jsonify
from ..services.auction_service import AuctionEngine

bp = Blueprint('auctions', __name__, url_prefix='/auctions')

@bp.route('/<uuid:id>', methods=['GET'])
def get_auction(id):
    """Endpoint to get details for a specific auction."""
    engine = AuctionEngine()
    try:
        auction = engine.get_auction(auction_id=str(id))
        return jsonify(auction)
    except ValueError as e:
        return jsonify({"message": str(e)}), 404
    except Exception as e:
        return jsonify({"message": "An unexpected error occurred", "error": str(e)}), 500

@bp.route('/<uuid:id>/bid-history', methods=['GET'])
def get_bid_history(id):
    """Endpoint to get the bid history for a specific auction."""
    engine = AuctionEngine()
    try:
        history = engine.get_bid_history(auction_id=str(id))
        return jsonify(history)
    except Exception as e:
        return jsonify({"message": "An unexpected error occurred", "error": str(e)}), 500
