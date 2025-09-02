from flask import Blueprint, jsonify
from ...core.security import admin_required
from ...services.verification_service import VerificationEngine

bp = Blueprint('admin_verification', __name__, url_prefix='/admin/verification')

@bp.route('/pending', methods=['GET'])
@admin_required
def get_pending_applications():
    """Endpoint for admins to get a list of pending verification applications."""
    engine = VerificationEngine()
    try:
        pending_apps = engine.get_pending_applications()
        return jsonify(pending_apps)
    except Exception as e:
        return jsonify({"message": "An unexpected error occurred", "error": str(e)}), 500

from flask import g, request

@bp.route('/<uuid:id>/review', methods=['POST'])
@admin_required
def review_application(id):
    """Endpoint for admins to review a verification application."""
    admin_user = g.user
    checklist_data = request.get_json()
    if not checklist_data:
        return jsonify({"message": "Checklist data is required"}), 400

    engine = VerificationEngine()
    try:
        checklist_record = engine.admin_review_application(
            admin_id=admin_user.id,
            app_id=str(id),
            checklist_data=checklist_data
        )
        return jsonify(checklist_record), 200
    except ValueError as e:
        return jsonify({"message": str(e)}), 404 # e.g., application not found
    except Exception as e:
        return jsonify({"message": "An unexpected error occurred", "error": str(e)}), 500

@bp.route('/<uuid:id>/approve', methods=['POST'])
@admin_required
def approve_application(id):
    """Endpoint for admins to approve a verification application."""
    engine = VerificationEngine()
    try:
        updated_app = engine.approve_application(app_id=str(id))
        return jsonify(updated_app)
    except ValueError as e:
        return jsonify({"message": str(e)}), 400 # e.g., checklist not found
    except Exception as e:
        return jsonify({"message": "An unexpected error occurred", "error": str(e)}), 500

@bp.route('/<uuid:id>/reject', methods=['POST'])
@admin_required
def reject_application(id):
    """Endpoint for admins to reject a verification application."""
    data = request.get_json()
    if not data or 'rejection_reason' not in data:
        return jsonify({"message": "rejection_reason is required"}), 400

    engine = VerificationEngine()
    try:
        updated_app = engine.reject_application(app_id=str(id), reason=data['rejection_reason'])
        return jsonify(updated_app)
    except Exception as e:
        return jsonify({"message": "An unexpected error occurred", "error": str(e)}), 500

@bp.route('/appeals', methods=['GET'])
def get_pending_appeals():
    """Endpoint for admins to get a list of pending appeals."""
    # TODO: Implement admin-level logic
    return jsonify({"message": "Get pending appeals endpoint"})

@bp.route('/appeals/<uuid:id>/resolve', methods=['POST'])
def resolve_appeal(id):
    """Endpoint for admins to resolve an appeal."""
    # TODO: Implement admin-level logic
    return jsonify({"message": f"Resolve appeal {id} endpoint"})
