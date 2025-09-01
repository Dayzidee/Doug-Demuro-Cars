from flask import Blueprint, jsonify, request

from ..core.db import get_supabase
import uuid

from collections import Counter
from ..data import mock_vehicle_data


bp = Blueprint('vehicles', __name__, url_prefix='/api/v1/vehicles')

@bp.route('/search', methods=['GET'])
def search_vehicles():
    """
    Searches and filters vehicles and calculates facet counts for the results.
    """
    try:

        supabase = get_supabase()
        query = supabase.table('vehicles').select(
            'id, make, model, year, price_current, mileage, exterior_color, status, '
            'vehicle_media!left(url, is_primary)'
        ).eq('vehicle_media.is_primary', True)

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

            query = query.lte('price_current', args.get('price_max'))

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


        response = query.execute()
        return jsonify(response.data)

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

@bp.route('/featured', methods=['GET'])
def get_featured_vehicles():
    """
    Returns a list of featured vehicles.
    """
    try:
        supabase = get_supabase()
        query = supabase.table('vehicles').select(
            'id, make, model, year, price_current, mileage, '
            'vehicle_media!left(url, is_primary)'
        ).eq('is_featured', True).eq('vehicle_media.is_primary', True).limit(10)

        response = query.execute()
        return jsonify(response.data)
    except Exception as e:
        print(f"Error fetching featured vehicles: {e}")
        return jsonify({"message": "An error occurred fetching featured vehicles.", "error": str(e)}), 500

@bp.route('/<uuid:vehicle_id>', methods=['GET'])
def get_vehicle_details(vehicle_id):
    """
    Retrieves all details for a single vehicle, including related media,
    price history, and location information.
    """
    try:
        supabase = get_supabase()

        # The select query uses foreign key relationships to fetch related data.
        # RLS policies will ensure that only visible vehicles can be fetched.
        query = supabase.table('vehicles').select(
            '*, '
            'vehicle_media(*), '
            'price_history(*), '
            'locations(*)'
        ).eq('id', str(vehicle_id)).single()

        response = query.execute()

        if not response.data:
            return jsonify({"message": "Vehicle not found or not available"}), 404

        return jsonify(response.data)

    except Exception as e:
        print(f"Error fetching vehicle details: {e}")
        return jsonify({"message": "An error occurred fetching vehicle details.", "error": str(e)}), 500
