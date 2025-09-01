from functools import wraps
from flask import request, g, jsonify
from supabase import Client
from ..core.db import get_supabase

def auth_required(f):
    """
    A decorator to protect endpoints, requiring a valid Supabase JWT.
    It extracts the user from the token and attaches it to the request context 'g'.
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({"message": "Authorization header is missing"}), 401

        parts = auth_header.split()
        if parts[0].lower() != 'bearer' or len(parts) != 2:
            return jsonify({"message": "Invalid Authorization header format. Expected 'Bearer <token>'"}), 401

        jwt_token = parts[1]

        try:
            # Use the Supabase client to validate the token and get the user
            supabase: Client = get_supabase()
            user_response = supabase.auth.get_user(jwt_token)
            user = user_response.user

            if not user:
                return jsonify({"message": "Invalid or expired token"}), 401

            # Store the user object in the request context (g) for use in the route
            g.user = user

        except Exception as e:
            # This will catch gotrue.errors.AuthApiError for bad tokens
            return jsonify({"message": "Token validation failed", "error": str(e)}), 401

        return f(*args, **kwargs)
    return decorated_function


def admin_required(f):
    """
    A decorator that builds on @auth_required to ensure the user has an admin,
    manager, or staff role. It fetches the user's profile to check their role.
    """
    @wraps(f)
    @auth_required  # First, ensure the user is authenticated
    def decorated_function(*args, **kwargs):
        # g.user is available from the @auth_required decorator
        user = g.user

        try:
            supabase = get_supabase()
            # Fetch the user's profile from the 'profiles' table to get the role.
            profile_response = supabase.table('profiles').select('role').eq('id', user.id).single().execute()

            if not profile_response.data:
                 return jsonify({"message": "User profile not found, cannot verify role"}), 404

            profile = profile_response.data
            # Check if the user's role is sufficient
            if profile.get('role') not in ['admin', 'manager', 'staff']:
                return jsonify({"message": "Administrator or staff access required"}), 403

            # Optionally, store the profile in g as well
            g.profile = profile

        except Exception as e:
            return jsonify({"message": "Role verification failed", "error": str(e)}), 500

        return f(*args, **kwargs)
    return decorated_function
