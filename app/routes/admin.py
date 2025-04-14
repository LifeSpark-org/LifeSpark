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

@admin_bp.route('/admin/projects/<project_id>', methods=['GET'])
@token_required
@admin_required
def get_project(current_user, project_id):
    """Get detailed project information for admin review"""
    project = Project.get_by_id(mongo, project_id)
    
    if not project:
        return jsonify({
            'status': 'error',
            'message': 'Project not found'
        }), 404
    
    return jsonify({
        'status': 'success',
        'project': project
    })

@admin_bp.route('/admin/projects/pending', methods=['GET'])
@token_required
@admin_required
def get_pending_projects(current_user):
    """Get all pending projects for admin review"""
    projects = Project.get_pending_projects(mongo)
    
    return jsonify({
        'status': 'success',
        'projects': projects
    })

@admin_bp.route('/admin/projects/approved', methods=['GET'])
@token_required
@admin_required
def get_approved_projects(current_user):
    """Get all approved projects"""
    projects = mongo.db.projects.find({'status': Project.STATUS_APPROVED}).sort('approved_at', -1)
    
    return jsonify({
        'status': 'success',
        'projects': list(projects)
    })

@admin_bp.route('/admin/projects/rejected', methods=['GET'])
@token_required
@admin_required
def get_rejected_projects(current_user):
    """Get all rejected projects"""
    projects = mongo.db.projects.find({'status': Project.STATUS_REJECTED}).sort('rejected_at', -1)
    
    return jsonify({
        'status': 'success',
        'projects': list(projects)
    })