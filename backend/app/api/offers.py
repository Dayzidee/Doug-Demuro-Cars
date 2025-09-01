from flask import Blueprint, jsonify
from ..core.db import get_supabase

bp = Blueprint('offers', __name__, url_prefix='/api/v1/offers')

@bp.route('/', methods=['GET'])
def list_active_offers():
    """
    Lists all active and valid offers.
    The RLS policy on the 'offers' table automatically filters for offers
    that are currently active and within their valid date range.
    """
    try:
        supabase = get_supabase()
        # RLS is applied automatically by Supabase based on the user's JWT or anon key.
        query = supabase.table('offers').select('*').order('end_date', desc=False)
        response = query.execute()
        return jsonify(response.data)
    except Exception as e:
        print(f"Error listing active offers: {e}")
        return jsonify({"message": "An error occurred while fetching offers.", "error": str(e)}), 500
