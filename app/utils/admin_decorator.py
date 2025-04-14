from functools import wraps
from flask import jsonify

def admin_required(f):
    @wraps(f)
    def decorated(current_user, *args, **kwargs):
        # Check if current user has admin role
        if not current_user.get('is_admin', False):
            return jsonify({'error': 'Admin privileges required'}), 403
            
        return f(current_user, *args, **kwargs)
    
    return decorated