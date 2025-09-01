from flask import Blueprint, jsonify, request
from ..core.db import get_supabase
import uuid

bp = Blueprint('vehicles', __name__, url_prefix='/api/v1/vehicles')

@bp.route('/search', methods=['GET'])
def search_vehicles():
    """
    Searches and filters vehicles from the database based on query parameters.
    """
    try:
        supabase = get_supabase()
        query = supabase.table('vehicles').select(
            'id, make, model, year, price_current, mileage, exterior_color, status, '
            'vehicle_media!left(url, is_primary)'
        ).eq('vehicle_media.is_primary', True)

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
        if 'bodyType' in args:
            body_types = args.get('bodyType').split(',')
            query = query.in_('body_type', body_types)
        if 'fuelType' in args:
            fuel_types = args.get('fuelType').split(',')
            query = query.in_('fuel_type', fuel_types)

        response = query.execute()
        return jsonify(response.data)

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
