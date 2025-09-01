from flask import Blueprint, jsonify, request
from ....core.db import get_supabase
from ....core.security import admin_required
import uuid

bp = Blueprint('admin_media', __name__, url_prefix='/api/v1/admin')

BUCKET_NAME = 'vehicle-media'

@bp.route('/media/signed-upload-url', methods=['POST'])
@admin_required
def create_signed_upload_url():
    """
    Creates a signed URL for a client-side file upload to Supabase Storage.
    """
    data = request.get_json()
    if not data or 'file_name' not in data:
        return jsonify({"message": "file_name is required"}), 400

    file_name = data['file_name']
    file_path = f"public/{uuid.uuid4()}-{file_name}"

    try:
        supabase = get_supabase()
        res = supabase.storage.from_(BUCKET_NAME).create_signed_upload_url(file_path)
        return jsonify(res)
    except Exception as e:
        return jsonify({"message": "Failed to create signed upload URL", "error": str(e)}), 500

@bp.route('/vehicles/<uuid:vehicle_id>/media', methods=['POST'])
@admin_required
def add_vehicle_media_record(vehicle_id):
    """
    Creates a new vehicle_media record in the database after a file upload.
    """
    data = request.get_json()
    if not data or 'url' not in data or 'media_type' not in data:
        return jsonify({"message": "url and media_type are required"}), 400

    try:
        supabase = get_supabase()

        media_data = {
            "vehicle_id": str(vehicle_id),
            "url": data["url"],
            "media_type": data["media_type"],
            "alt_text": data.get("alt_text"),
            "position": data.get("position", 0),
            "is_primary": data.get("is_primary", False)
        }

        response = supabase.table('vehicle_media').insert(media_data).execute()

        if 'error' in response and response['error']:
            raise Exception(response['error']['message'])

        return jsonify(response.data[0]), 201
    except Exception as e:
        return jsonify({"message": "Failed to create vehicle media record", "error": str(e)}), 500
