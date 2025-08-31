from flask import Blueprint, jsonify, g, request
from ..core.db import get_supabase
from ..core.security import auth_required

# A Blueprint for user-related endpoints, such as profile management.
bp = Blueprint('user', __name__, url_prefix='/users')


@bp.route('/profile', methods=['GET'])
@auth_required
def get_user_profile():
    """
    Fetches the profile for the currently authenticated user.
    The user object is added to the request context 'g' by the @auth_required decorator.
    """
    try:
        user_id = g.user.id
        supabase = get_supabase()

        # Fetch the profile from the 'profiles' table using the user's ID
        profile_response = supabase.table('profiles').select('*').eq('id', user_id).single().execute()

        if not profile_response.data:
            return jsonify({"message": "Profile not found for this user"}), 404

        return jsonify(profile_response.data), 200

    except Exception as e:
        return jsonify({"message": "An error occurred while retrieving the profile.", "error": str(e)}), 500


@bp.route('/profile', methods=['PATCH'])
@auth_required
def update_user_profile():
    """
    Updates the profile for the currently authenticated user.
    """
    user_id = g.user.id
    supabase = get_supabase()
    json_data = request.get_json()

    if not json_data:
        return jsonify({"message": "Invalid JSON payload"}), 400

    try:
        # Validate the incoming data using the Pydantic model
        from ..models.schemas import ProfileUpdate
        from pydantic import ValidationError

        profile_data = ProfileUpdate(**json_data)
        update_payload = profile_data.model_dump(exclude_unset=True)

        if not update_payload:
            return jsonify({"message": "No valid fields to update"}), 400

        # Perform the update operation
        # The 'returning="minimal"' is default and doesn't return the updated row.
        # We must re-fetch the data to return the updated profile.
        supabase.table('profiles').update(update_payload).eq('id', user_id).execute()

        # Fetch the updated profile to return it in the response
        updated_profile_response = supabase.table('profiles').select('*').eq('id', user_id).single().execute()

        if not updated_profile_response.data:
            # This case should be rare but is a good safeguard
            return jsonify({"message": "Profile not found after update"}), 404

        return jsonify(updated_profile_response.data), 200

    except ValidationError as e:
        return jsonify({"message": "Validation failed", "errors": e.errors()}), 422
    except Exception as e:
        return jsonify({"message": "An error occurred while updating the profile.", "error": str(e)}), 500
