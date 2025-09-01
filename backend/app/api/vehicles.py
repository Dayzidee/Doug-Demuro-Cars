from flask import Blueprint, jsonify, request
from collections import Counter
from ..data import mock_vehicle_data

bp = Blueprint('vehicles', __name__, url_prefix='/vehicles')

@bp.route('/search', methods=['GET'])
def search_vehicles():
    """
    Searches and filters vehicles and calculates facet counts for the results.
    """
    try:
        # In a real app, this would be a database query. Here we simulate it.
        # query = supabase.table('vehicles').select('*')

        args = request.args
        filtered_vehicles = mock_vehicle_data

        # Filter logic
        if 'make' in args:
            filtered_vehicles = [v for v in filtered_vehicles if v['make'] == args.get('make')]
        if 'year_min' in args:
            filtered_vehicles = [v for v in filtered_vehicles if v['year'] >= args.get('year_min', type=int)]
        if 'price_max' in args:
            filtered_vehicles = [v for v in filtered_vehicles if v['price_current'] <= args.get('price_max', type=int)]
        if 'bodyType' in args:
            body_types = args.get('bodyType').split(',')
            filtered_vehicles = [v for v in filtered_vehicles if v['body_type'] in body_types]
        if 'fuelType' in args:
            fuel_types = args.get('fuelType').split(',')
            filtered_vehicles = [v for v in filtered_vehicles if v['fuel_type'] in fuel_types]

        # Facet calculation on the already filtered data
        make_counts = Counter(v['make'] for v in filtered_vehicles)
        bodyType_counts = Counter(v['body_type'] for v in filtered_vehicles)
        fuelType_counts = Counter(v['fuel_type'] for v in filtered_vehicles)

        response_data = {
            "data": filtered_vehicles,
            "facets": {
                "make": dict(make_counts),
                "bodyType": dict(bodyType_counts),
                "fuelType": dict(fuelType_counts),
            }
        }

        return jsonify(response_data)

    except Exception as e:
        print(f"Error in vehicle search: {e}")
        return jsonify({"message": "An error occurred during vehicle search.", "error": str(e)}), 500
