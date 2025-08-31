from flask import Blueprint, jsonify, request
from ..core.db import get_supabase

bp = Blueprint('vehicles', __name__, url_prefix='/vehicles')

@bp.route('/search', methods=['GET'])
def search_vehicles():
    """
    Searches and filters vehicles from the database based on query parameters.
    """
    try:
        supabase = get_supabase()
        query = supabase.table('vehicles').select('*')

        # Dynamically build the query based on request arguments
        if 'make' in request.args:
            query = query.eq('make', request.args.get('make'))
        if 'model' in request.args:
            query = query.eq('model', request.args.get('model'))
        if 'year_min' in request.args:
            query = query.gte('year', request.args.get('year_min'))
        if 'year_max' in request.args:
            query = query.lte('year', request.args.get('year_max'))
        if 'price_min' in request.args:
            query = query.gte('price_current', request.args.get('price_min'))
        if 'price_max' in request.args:
            query = query.lte('price_current', request.args.get('price_max'))

        # Execute the query
        response = query.execute()

        # The public RLS policy on 'vehicles' ensures only 'visible' rows are returned.
        return jsonify(response.data)

    except Exception as e:
        # Log the error in a real application
        print(f"Error in vehicle search: {e}")
        return jsonify({"message": "An error occurred during vehicle search.", "error": str(e)}), 500
