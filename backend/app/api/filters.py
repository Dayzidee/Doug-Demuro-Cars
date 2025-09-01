from flask import Blueprint, jsonify
from ..data import mock_vehicle_data

bp = Blueprint('filters', __name__, url_prefix='/filters')

@bp.route('/options', methods=['GET'])
def get_filter_options():
    """
    Returns a list of unique values for various filter categories.
    """
    try:
        makes = sorted(list(set(v['make'] for v in mock_vehicle_data)))
        models = sorted(list(set(v['model'] for v in mock_vehicle_data)))
        body_types = sorted(list(set(v['body_type'] for v in mock_vehicle_data)))
        fuel_types = sorted(list(set(v['fuel_type'] for v in mock_vehicle_data)))

        options = {
            "makes": makes,
            "models": models,
            "bodyTypes": body_types,
            "fuelTypes": fuel_types,
        }

        return jsonify(options)

    except Exception as e:
        print(f"Error in get_filter_options: {e}")
        return jsonify({"message": "An error occurred while fetching filter options.", "error": str(e)}), 500
