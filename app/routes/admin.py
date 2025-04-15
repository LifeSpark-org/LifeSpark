from flask import Blueprint, request, jsonify
from bson.objectid import ObjectId

from .. import mongo
from ..utils.decorators import token_required, admin_required
from ..models.project import Project

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/admin/check', methods=['GET'])
@token_required
def check_admin(current_user):
    """Check if the current user has admin privileges"""
    print(f"Admin check request for user: {current_user.get('email')}")
    print(f"User data: {current_user}")
    is_admin = current_user.get('is_admin', False)
    print(f"Is admin: {is_admin}")
    
    return jsonify({
        'is_admin': is_admin
    })

# Removed duplicate routes that are already in projects.py
# No need for these routes in admin.py since they are defined in projects.py:
# - /admin/projects/<project_id>
# - /admin/projects/pending
# - /admin/projects/approved
# - /admin/projects/rejected

# If needed, can add admin-specific routes here that don't overlap with projects.py