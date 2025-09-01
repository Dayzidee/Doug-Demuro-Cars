from flask import Blueprint, jsonify, request
from ....core.db import get_supabase
from ....core.security import admin_required
import uuid

bp = Blueprint('admin_offers', __name__, url_prefix='/api/v1/admin/offers')

@bp.route('/', methods=['POST'])
@admin_required
def create_offer():
    """Create a new offer. Admin, Manager, or Staff access required."""
    data = request.get_json()
    if not data:
        return jsonify({"message": "Invalid input: No data provided"}), 400

    # Basic validation
    required_fields = ['title', 'promo_type', 'start_date', 'end_date']
    if not all(field in data for field in required_fields):
        return jsonify({"message": f"Missing required fields: {required_fields}"}), 400

    try:
        supabase = get_supabase()
        response = supabase.table('offers').insert(data).execute()
        return jsonify(response.data), 201
    except Exception as e:
        return jsonify({"message": "Failed to create offer", "error": str(e)}), 500

@bp.route('/', methods=['GET'])
@admin_required
def list_all_offers():
    """List all offers, including inactive ones. Admin, Manager, or Staff access required."""
    try:
        supabase = get_supabase()
        # Admin role bypasses the public RLS policy, allowing access to all offers.
        response = supabase.table('offers').select('*').order('created_at', desc=True).execute()
        return jsonify(response.data)
    except Exception as e:
        return jsonify({"message": "Failed to retrieve offers", "error": str(e)}), 500

@bp.route('/<offer_id>', methods=['GET'])
@admin_required
def get_offer(offer_id):
    """Get a single offer by ID. Admin, Manager, or Staff access required."""
    try:
        uuid.UUID(offer_id) # Validate UUID
    except ValueError:
        return jsonify({"message": "Invalid offer ID format"}), 400

    try:
        supabase = get_supabase()
        response = supabase.table('offers').select('*').eq('id', offer_id).single().execute()
        if not response.data:
            return jsonify({"message": "Offer not found"}), 404
        return jsonify(response.data)
    except Exception as e:
        return jsonify({"message": "Failed to retrieve offer", "error": str(e)}), 500

@bp.route('/<offer_id>', methods=['PATCH'])
@admin_required
def update_offer(offer_id):
    """Update an existing offer. Admin, Manager, or Staff access required."""
    try:
        uuid.UUID(offer_id) # Validate UUID
    except ValueError:
        return jsonify({"message": "Invalid offer ID format"}), 400

    data = request.get_json()
    if not data:
        return jsonify({"message": "Invalid input: No data provided"}), 400

    try:
        supabase = get_supabase()
        response = supabase.table('offers').update(data).eq('id', offer_id).execute()
        # The new trigger will automatically update the 'updated_at' field.
        if not response.data:
            return jsonify({"message": "Offer not found or no changes made"}), 404
        return jsonify(response.data[0])
    except Exception as e:
        return jsonify({"message": "Failed to update offer", "error": str(e)}), 500

@bp.route('/<offer_id>', methods=['DELETE'])
@admin_required
def delete_offer(offer_id):
    """Delete an offer. Admin, Manager, or Staff access required."""
    try:
        uuid.UUID(offer_id) # Validate UUID
    except ValueError:
        return jsonify({"message": "Invalid offer ID format"}), 400

    try:
        supabase = get_supabase()
        response = supabase.table('offers').delete().eq('id', offer_id).execute()
        if not response.data:
            return jsonify({"message": "Offer not found"}), 404
        return '', 204
    except Exception as e:
        return jsonify({"message": "Failed to delete offer", "error": str(e)}), 500
