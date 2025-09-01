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
        args = request.args
        if 'make' in args:
            query = query.eq('make', args.get('make'))
        if 'model' in args:
            query = query.eq('model', args.get('model'))
        if 'year_min' in args:
            query = query.gte('year', args.get('year_min'))
        if 'year_max' in args:
            query = query.lte('year', args.get('year_max'))
        if 'price_min' in args:
            query = query.gte('price_current', args.get('price_min'))
        if 'price_max' in args:
            query = query.lte('price_current', args.get('price_max'))

        # Handle potential multi-select filters (passed as comma-separated strings)
        if 'bodyType' in args:
            body_types = args.get('bodyType').split(',')
            query = query.in_('body_type', body_types)
        if 'fuelType' in args:
            fuel_types = args.get('fuelType').split(',')
            query = query.in_('fuel_type', fuel_types)

        # Execute the query
        response = query.execute()

        # The public RLS policy on 'vehicles' ensures only 'visible' rows are returned.
        return jsonify(response.data)

    except Exception as e:
        # Log the error in a real application
        print(f"Error in vehicle search: {e}")
        return jsonify({"message": "An error occurred during vehicle search.", "error": str(e)}), 500
