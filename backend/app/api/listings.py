from flask import Blueprint, jsonify, request
from pydantic import ValidationError
from ..core.db import get_supabase
from ..models.schemas import VehicleCreate, Vehicle

bp = Blueprint('listings', __name__, url_prefix='/api/v1/cars')

@bp.route('/sell', methods=['POST'])
def create_listing():
    """
    Creates a new vehicle listing from the provided data.
    """
    try:
        # Get the JSON data from the request
        json_data = request.get_json()
        if not json_data:
            return jsonify({"message": "Invalid JSON payload"}), 400

        # Validate the incoming data with the Pydantic model
        try:
            listing_data = VehicleCreate.model_validate(json_data)
        except ValidationError as e:
            return jsonify({"message": "Validation error", "errors": e.errors()}), 422

        # Get the Supabase client
        supabase = get_supabase()

        # Prepare the data for insertion into the database
        # The Pydantic model's `model_dump` method is perfect for this
        db_data = listing_data.model_dump()

        # Here you might want to add logic to associate the listing with the
        # authenticated user. For now, we'll just insert the vehicle data.
        # For example: db_data['seller_id'] = g.user['id']

        # Insert the new vehicle listing into the 'vehicles' table
        response = supabase.table('vehicles').insert(db_data).execute()

        # The actual data is in the 'data' attribute of the response object
        created_vehicle_data = response.data[0]

        # Validate the created vehicle data with the Vehicle model
        validated_vehicle = Vehicle.model_validate(created_vehicle_data)

        return jsonify(validated_vehicle.model_dump(by_alias=True)), 201

    except Exception as e:
        print(f"Error creating listing: {e}")
        return jsonify({"message": "An error occurred while creating the listing.", "error": str(e)}), 500
