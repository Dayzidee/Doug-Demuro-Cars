from flask import Blueprint, jsonify, request
from ..core.db import get_supabase

bp = Blueprint('gallery', __name__, url_prefix='/api/v1/gallery')

@bp.route('/preview', methods=['GET'])
def get_gallery_preview():
    """
    Returns a curated list of images for the homepage gallery preview.
    This implementation returns the 12 most recent primary images.
    """
    try:
        supabase = get_supabase()
        # RLS on the 'vehicles' table ensures that media from non-visible vehicles is not returned.
        query = supabase.table('vehicle_media').select('*, vehicles(visible)').eq('vehicles.visible', True).eq('is_primary', True).order('created_at', desc=True).limit(12)
        response = query.execute()
        return jsonify(response.data)
    except Exception as e:
        return jsonify({"message": "An error occurred fetching gallery preview.", "error": str(e)}), 500

@bp.route('/search', methods=['GET'])
def search_gallery():
    """
    Searches and filters all images in the gallery.
    Joins with the vehicles table to allow filtering on vehicle attributes.
    """
    try:
        supabase = get_supabase()
        query = supabase.table('vehicle_media').select('*, vehicles!inner(*)')
        args = request.args

        query = query.eq('vehicles.visible', True)

        limit = int(args.get('limit', 30))
        offset = int(args.get('offset', 0))
        query = query.limit(limit).offset(offset)

        if 'make' in args:
            query = query.eq('vehicles.make', args.get('make'))
        if 'model' in args:
            query = query.eq('vehicles.model', args.get('model'))
        if 'year' in args:
            query = query.eq('vehicles.year', args.get('year'))
        if 'body_type' in args:
            query = query.in_('vehicles.body_type', args.get('body_type').split(','))
        if 'q' in args:
            search_term = args.get('q')
            query = query.or_(f"alt_text.ilike.%{search_term}%,vehicles.make.ilike.%{search_term}%,vehicles.model.ilike.%{search_term}%")

        sort_by = args.get('sort_by', 'created_at_desc')
        if sort_by == 'created_at_desc':
            query = query.order('created_at', desc=True)
        elif sort_by == 'created_at_asc':
            query = query.order('created_at', desc=False)
        elif sort_by == 'year_desc':
            query = query.order('year', referenced_table='vehicles', desc=True)
        elif sort_by == 'year_asc':
            query = query.order('year', referenced_table='vehicles', desc=False)

        response = query.execute()
        return jsonify(response.data)

    except Exception as e:
        return jsonify({"message": "An error occurred during gallery search.", "error": str(e)}), 500
