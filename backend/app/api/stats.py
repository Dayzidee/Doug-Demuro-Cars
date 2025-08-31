from flask import Blueprint, jsonify

bp = Blueprint('stats', __name__, url_prefix='/stats')

@bp.route('/summary', methods=['GET'])
def get_stats_summary():
    """
    Returns a summary of key site statistics for the Trust Indicators section.
    NOTE: This endpoint currently returns hardcoded data for frontend development.
    In a real implementation, this would query an analytics database.
    """
    summary_data = {
        "carsSold": 5123,
        "averageRating": 4.9,
        "financingAvailable": "0% APR",
        "supportHours": "24/7"
    }
    return jsonify(summary_data)
