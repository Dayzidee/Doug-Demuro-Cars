from flask import Blueprint, jsonify, request
from ..core.db import get_supabase
from ..models.schemas import Vehicle, VehicleSearchResponse
from collections import Counter
from typing import List

# Create a blueprint for inventory-related endpoints
bp = Blueprint('inventory', __name__, url_prefix='/api/v1/inventory')

@bp.route('/featured', methods=['GET'])
def get_featured_vehicles():
    """
    Retrieves a list of vehicles marked as featured.
    """
    try:
        supabase = get_supabase()
        # Query the 'vehicles' table for records where 'is_featured' is true
        response = supabase.table('vehicles').select('*').eq('is_featured', True).limit(5).execute()

        # The actual data is in the 'data' attribute of the response object
        featured_vehicles_data = response.data

        # Validate the data with the Pydantic model
        validated_vehicles: List[Vehicle] = [Vehicle.model_validate(v) for v in featured_vehicles_data]

        # Convert the Pydantic models back to dictionaries for the JSON response
        return jsonify([v.model_dump(by_alias=True) for v in validated_vehicles])

    except Exception as e:
        print(f"Error fetching featured vehicles: {e}")
        return jsonify({"message": "An error occurred while fetching featured vehicles.", "error": str(e)}), 500

@bp.route('/search', methods=['GET'])
def search_vehicles():
    """
    Searches and filters vehicles from the database and calculates facet counts.
    """
    try:
        supabase = get_supabase()
        args = request.args

        # Start with a base query
        query = supabase.table('vehicles').select('*', count='exact')

        # Apply filters from query parameters
        if 'make' in args:
            query = query.eq('make', args.get('make'))
        if 'year_min' in args:
            query = query.gte('year', args.get('year_min', type=int))
        if 'price_max' in args:
            query = query.lte('price_current', args.get('price_max', type=int))
        if 'bodyType' in args:
            body_types = args.get('bodyType').split(',')
            query = query.in_('body_type', body_types)
        if 'fuelType' in args:
            fuel_types = args.get('fuelType').split(',')
            query = query.in_('fuel_type', fuel_types)

        # Execute the query to get filtered vehicles
        response = query.execute()

        filtered_vehicles_data = response.data
        total_count = response.count

        # Validate the data with the Pydantic model
        validated_vehicles: List[Vehicle] = [Vehicle.model_validate(v) for v in filtered_vehicles_data]

        # In a real-world scenario, you might run a separate, broader query for facets
        # for a better user experience (showing all possible filters).
        # For this implementation, we'll calculate facets from the filtered results.
        make_counts = Counter(v.make for v in validated_vehicles)
        bodyType_counts = Counter(v.body_type for v in validated_vehicles)
        fuelType_counts = Counter(v.fuel_type for v in validated_vehicles)

        # Create the response object using the Pydantic model
        search_response = VehicleSearchResponse(
            data=validated_vehicles,
            facets={
                "make": dict(make_counts),
                "bodyType": dict(bodyType_counts),
                "fuelType": dict(fuelType_counts),
            },
            total=total_count
        )

        # Return the response, converting the Pydantic model to a JSON-serializable dict
        return jsonify(search_response.model_dump(by_alias=True))

    except Exception as e:
        print(f"Error in vehicle search: {e}")
        return jsonify({"message": "An error occurred during vehicle search.", "error": str(e)}), 500
