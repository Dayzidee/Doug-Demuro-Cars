from flask import Blueprint, request, jsonify

bp = Blueprint('auctions', __name__, url_prefix='/auctions')

from ..core.security import admin_required, auth_required

@bp.route('', methods=['POST'])
@admin_required
def create_auction():
    """Endpoint to create a new auction. Admin only."""
    data = request.get_json()
    if not data:
        return jsonify({"message": "Request body is required"}), 400

    engine = AuctionEngine()
    try:
        new_auction = engine.create_auction(auction_data=data)
        return jsonify(new_auction), 201
    except ValueError as e:
        return jsonify({"message": str(e)}), 400 # e.g., vehicle not found or not available
    except Exception as e:
        return jsonify({"message": "An unexpected error occurred", "error": str(e)}), 500


from flask import g

@bp.route('/<uuid:id>/bids', methods=['POST'])
@auth_required
def place_bid(id):
    """Endpoint for a verified user to place a bid on an auction."""
    user = g.user
    data = request.get_json()
    if not data or 'amount' not in data:
        return jsonify({"message": "amount is required"}), 400

    engine = AuctionEngine()
    try:
        new_bid = engine.place_bid(
            user_id=user.id,
            auction_id=str(id),
            amount=data['amount']
        )
        return jsonify(new_bid), 201
    except ValueError as e:
        # For business logic errors (e.g., bid too low, not verified)
        return jsonify({"message": str(e)}), 400
    except Exception as e:
        return jsonify({"message": "An unexpected error occurred", "error": str(e)}), 500

from ..services.auction_service import AuctionEngine

@bp.route('/live', methods=['GET'])
def get_live_auctions():
    """Endpoint to get a list of currently live auctions."""
    engine = AuctionEngine()
    try:
        live_auctions = engine.get_live_auctions()
        return jsonify(live_auctions)
    except Exception as e:
        return jsonify({"message": "An unexpected error occurred", "error": str(e)}), 500

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
