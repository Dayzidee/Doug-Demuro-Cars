from flask import Blueprint, jsonify

# A Blueprint for meta-information endpoints about the API itself.
bp = Blueprint('meta', __name__, url_prefix='/meta')

@bp.route('/health', methods=['GET'])
def health_check():
    """
    Provides a simple health check endpoint to confirm the API is running
    and responsive.
    """
    return jsonify({"status": "ok", "message": "API is healthy"}), 200
