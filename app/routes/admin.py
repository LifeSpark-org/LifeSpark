from flask import Blueprint, jsonify
from ..utils.decorators import token_required

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
