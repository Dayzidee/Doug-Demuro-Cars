from flask import Blueprint, request, jsonify, g
from ..core.security import auth_required
from ..services.verification_service import VerificationEngine

bp = Blueprint('verification', __name__, url_prefix='/verification')

@bp.route('/applications', methods=['POST'])
@auth_required
def submit_application():
    """Endpoint to submit a new verification application."""
    user = g.user
    data = request.get_json()
    if not data or 'application_type' not in data:
        return jsonify({"message": "application_type is required"}), 400

    application_type = data['application_type']
    if application_type not in ['basic', 'premium']:
        return jsonify({"message": "Invalid application_type"}), 400

    engine = VerificationEngine()
    try:
        new_application = engine.submit_application(user.id, application_type)
        return jsonify(new_application), 201
    except ValueError as e:
        return jsonify({"message": str(e)}), 409 # Conflict
    except Exception as e:
        return jsonify({"message": "An unexpected error occurred", "error": str(e)}), 500

@bp.route('/applications/<uuid:id>', methods=['GET'])
@auth_required
def get_application_status(id):
    """Endpoint to get the status of a verification application."""
    user = g.user
    engine = VerificationEngine()
    try:
        application = engine.get_application(user_id=user.id, application_id=str(id))
        return jsonify(application)
    except ValueError as e:
        return jsonify({"message": str(e)}), 404
    except Exception as e:
        return jsonify({"message": "An unexpected error occurred", "error": str(e)}), 500

@bp.route('/documents/<uuid:app_id>', methods=['POST'])
@auth_required
def upload_document(app_id):
    """Endpoint to upload a document for a verification application."""
    user = g.user

    if 'file' not in request.files:
        return jsonify({"message": "No file part in the request"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"message": "No selected file"}), 400

    document_type = request.form.get('document_type')
    if not document_type:
        return jsonify({"message": "document_type is required"}), 400

    if file:
        engine = VerificationEngine()
        try:
            file_body = file.read()
            new_document = engine.upload_document(
                user_id=user.id,
                app_id=str(app_id),
                file_name=file.filename,
                file_body=file_body,
                document_type=document_type,
                mime_type=file.mimetype
            )
            return jsonify(new_document), 201
        except ValueError as e:
            return jsonify({"message": str(e)}), 404 # e.g., application not found
        except Exception as e:
            return jsonify({"message": "An unexpected error occurred", "error": str(e)}), 500

    return jsonify({"message": "File upload failed"}), 400

@bp.route('/appeals/<uuid:app_id>', methods=['POST'])
@auth_required
def submit_appeal(app_id):
    """Endpoint to submit an appeal for a rejected application."""
    user = g.user
    data = request.get_json()
    if not data or 'appeal_reason' not in data:
        return jsonify({"message": "appeal_reason is required"}), 400

    engine = VerificationEngine()
    try:
        new_appeal = engine.submit_appeal(
            user_id=user.id,
            app_id=str(app_id),
            appeal_reason=data['appeal_reason']
        )
        return jsonify(new_appeal), 201
    except ValueError as e:
        # For business logic errors like "not rejected" or "not found"
        return jsonify({"message": str(e)}), 400
    except Exception as e:
        return jsonify({"message": "An unexpected error occurred", "error": str(e)}), 500
