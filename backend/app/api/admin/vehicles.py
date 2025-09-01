from flask import Blueprint, jsonify, request
from ....core.db import get_supabase
from ....core.security import admin_required
import uuid

bp = Blueprint('admin_vehicles', __name__, url_prefix='/api/v1/admin/vehicles')

@bp.route('/', methods=['POST'])
@admin_required
def create_vehicle():
    """Create a new vehicle record. Admin access required."""
    data = request.get_json()
    if not data:
        return jsonify({"message": "Invalid input: No data provided"}), 400

    required_fields = ['vin', 'make', 'model', 'year', 'price_current']
    if not all(field in data for field in required_fields):
        return jsonify({"message": f"Missing one or more required fields: {required_fields}"}), 400

    try:
        supabase = get_supabase()
        response = supabase.table('vehicles').insert(data).execute()

        if 'error' in response and response['error']:
             raise Exception(response['error']['message'])

        return jsonify(response.data[0]), 201
    except Exception as e:
        if '23505' in str(e) and 'vehicles_vin_key' in str(e):
            return jsonify({"message": f"A vehicle with VIN {data.get('vin')} already exists."}), 409
        return jsonify({"message": "Failed to create vehicle", "error": str(e)}), 500

@bp.route('/<uuid:vehicle_id>', methods=['PATCH'])
@admin_required
def update_vehicle(vehicle_id):
    """Update an existing vehicle. Admin access required."""
    data = request.get_json()
    if not data:
        return jsonify({"message": "Invalid input: No data provided"}), 400

    try:
        supabase = get_supabase()
        response = supabase.table('vehicles').update(data).eq('id', str(vehicle_id)).execute()

        if not response.data:
            return jsonify({"message": "Vehicle not found or no changes made"}), 404

        return jsonify(response.data[0])
    except Exception as e:
        return jsonify({"message": "Failed to update vehicle", "error": str(e)}), 500

@bp.route('/<uuid:vehicle_id>', methods=['DELETE'])
@admin_required
def delete_vehicle(vehicle_id):
    """Delete a vehicle. Admin access required."""
    try:
        supabase = get_supabase()
        response = supabase.table('vehicles').delete().eq('id', str(vehicle_id)).execute()

        if not response.data:
            return jsonify({"message": "Vehicle not found"}), 404

        return '', 204
    except Exception as e:
        return jsonify({"message": "Failed to delete vehicle", "error": str(e)}), 500
