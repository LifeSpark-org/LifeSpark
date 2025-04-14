from flask import Blueprint, request, jsonify, render_template, redirect, url_for, current_app
from bson.objectid import ObjectId
from datetime import datetime
import os
import uuid
from werkzeug.utils import secure_filename

from .. import mongo
from ..utils.decorators import token_required, admin_required
from ..models.project import Project

projects_bp = Blueprint('projects', __name__)

# Allowed file extensions for proof documents
ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg', 'doc', 'docx'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def save_uploaded_file(file):
    """Save an uploaded file and return its path"""
    if not file or not file.filename:
        print("No valid file received")
        return None
        
    if not allowed_file(file.filename):
        print(f"File type not allowed: {file.filename}")
        return None
        
    # Create unique filename
    filename = secure_filename(file.filename)
    unique_filename = f"{uuid.uuid4()}_{filename}"
    
    # Make sure upload directory exists
    upload_dir = os.path.join(current_app.root_path, 'static', 'uploads', 'documents')
    try:
        os.makedirs(upload_dir, exist_ok=True)
        print(f"Upload directory confirmed: {upload_dir}")
    except Exception as e:
        print(f"Error creating upload directory: {e}")
        return None
    
    # Save the file
    filepath = os.path.join(upload_dir, unique_filename)
    try:
        file.save(filepath)
        print(f"File saved successfully: {filepath}")
    except Exception as e:
        print(f"Error saving file: {e}")
        return None
    
    # Return URL path to file
    return f"/static/uploads/documents/{unique_filename}"

@projects_bp.route('/projects', methods=['GET'])
def get_projects():
    """Get all approved projects for public display"""
    projects = Project.get_approved_projects(mongo)
    return jsonify({
        'status': 'success',
        'projects': projects
    })

@projects_bp.route('/projects/<project_id>', methods=['GET'])
def get_project(project_id):
    """Get a specific project by ID"""
    project = Project.get_by_id(mongo, project_id)
    if not project:
        return jsonify({'status': 'error', 'message': 'Project not found'}), 404
        
    return jsonify({
        'status': 'success',
        'project': project
    })

@projects_bp.route('/submit-project', methods=['POST'])
@token_required
def submit_project(current_user):
    """Submit a new project for approval"""
    print("===== NEW SUBMISSION REQUEST =====")
    print(f"Content-Type: {request.content_type}")
    print(f"Method: {request.method}")
    
    # Try to get JSON data first (preferred)
    if request.is_json:
        data = request.get_json(force=True)
        print("JSON data received:", data)
    else:
        # Fallback to form data
        data = request.form.to_dict()
        print("Form data received:", data)
    
    # Empty documents list for now
    proof_documents = []
    
    # Print all received data for debugging
    print("All data:")
    print(data)
    
    # Validate required fields
    required_fields = ['title', 'description', 'region', 'goal_amount', 'contact_email']
    missing_fields = []
    
    for field in required_fields:
        value = data.get(field, None)
        print(f"Field {field}: {value}")
        if not value and value != 0:
            missing_fields.append(field)
    
    if missing_fields:
        error_msg = f'Missing required fields: {", ".join(missing_fields)}'
        print(f"Error: {error_msg}")
        return jsonify({
            'status': 'error',
            'message': error_msg
        }), 400
    
    # Process goal_amount
    try:
        goal_amount = float(data.get('goal_amount', 0))
    except (ValueError, TypeError):
        error_msg = f'Invalid goal amount: {data.get("goal_amount")}'
        print(f"Error: {error_msg}")
        return jsonify({
            'status': 'error',
            'message': error_msg
        }), 400
    
    # Create project data
    project_data = {
        'title': data.get('title', ''),
        'description': data.get('description', ''),
        'region': data.get('region', ''),
        'goal_amount': goal_amount,
        'contact_email': data.get('contact_email', ''),
        'contact_phone': data.get('contact_phone', ''),
        'organization': data.get('organization', ''),
        'proof_documents': proof_documents,
        'user_id': str(current_user['_id'])
    }
    
    # Try to create the project
    try:
        project = Project.create(mongo, project_data)
        print(f"Project created successfully with ID: {project['_id']}")
        
        return jsonify({
            'status': 'success',
            'message': 'Project submitted successfully and pending approval',
            'project_id': str(project['_id'])
        }), 201
    except Exception as e:
        error_msg = f'Error creating project: {str(e)}'
        print(f"Error: {error_msg}")
        return jsonify({
            'status': 'error',
            'message': error_msg
        }), 500
    
@projects_bp.route('/user/projects', methods=['GET'])
@token_required
def get_user_projects(current_user):
    """Get all projects submitted by the current user"""
    projects = Project.get_user_projects(mongo, str(current_user['_id']))
    return jsonify({
        'status': 'success',
        'projects': projects
    })

# Admin routes
@projects_bp.route('/admin/projects/pending', methods=['GET'])
@token_required
@admin_required
def get_pending_projects(current_user):
    """Get all pending projects for admin review"""
    print(f"Admin {current_user.get('email')} requested pending projects")
    projects = Project.get_pending_projects(mongo)
    
    # Convert ObjectId to string in each project
    for project in projects:
        project['_id'] = str(project['_id'])
        
    print(f"Returning {len(projects)} pending projects")
    return jsonify({
        'status': 'success',
        'projects': projects
    })

@projects_bp.route('/admin/projects/<project_id>', methods=['GET'])
@token_required
@admin_required
def get_admin_project(current_user, project_id):
    """Get detailed project information for admin review"""
    print(f"Admin {current_user.get('email')} requested project {project_id}")
    project = Project.get_by_id(mongo, project_id)
    
    if not project:
        return jsonify({
            'status': 'error',
            'message': 'Project not found'
        }), 404
    
    # Convert ObjectId to string
    project['_id'] = str(project['_id'])
    
    print(f"Returning project: {project['title']}")
    return jsonify({
        'status': 'success',
        'project': project
    })

@projects_bp.route('/admin/projects/approved', methods=['GET'])
@token_required
@admin_required
def get_approved_projects(current_user):
    """Get all approved projects"""
    print(f"Admin {current_user.get('email')} requested approved projects")
    projects = list(mongo.db.projects.find({'status': Project.STATUS_APPROVED}).sort('approved_at', -1))
    
    # Convert ObjectId to string in each project
    for project in projects:
        project['_id'] = str(project['_id'])
    
    print(f"Returning {len(projects)} approved projects")
    return jsonify({
        'status': 'success',
        'projects': projects
    })

@projects_bp.route('/admin/projects/rejected', methods=['GET'])
@token_required
@admin_required
def get_rejected_projects(current_user):
    """Get all rejected projects"""
    print(f"Admin {current_user.get('email')} requested rejected projects")
    projects = list(mongo.db.projects.find({'status': Project.STATUS_REJECTED}).sort('rejected_at', -1))
    
    # Convert ObjectId to string in each project
    for project in projects:
        project['_id'] = str(project['_id'])
    
    print(f"Returning {len(projects)} rejected projects")
    return jsonify({
        'status': 'success',
        'projects': projects
    })

@projects_bp.route('/admin/projects/<project_id>/approve', methods=['POST'])
@token_required
@admin_required
def approve_project(current_user, project_id):
    """Approve a pending project"""
    print(f"Admin {current_user.get('email')} is approving project {project_id}")
    data = request.get_json() or {}
    notes = data.get('notes', '')
    
    success = Project.approve_project(mongo, project_id, str(current_user['_id']), notes)
    
    if not success:
        print(f"Failed to approve project {project_id}")
        return jsonify({
            'status': 'error',
            'message': 'Failed to approve project. Project may not be pending or does not exist.'
        }), 400
    
    print(f"Project {project_id} approved successfully")
    return jsonify({
        'status': 'success',
        'message': 'Project approved successfully'
    })

@projects_bp.route('/admin/projects/<project_id>/reject', methods=['POST'])
@token_required
@admin_required
def reject_project(current_user, project_id):
    """Reject a pending project"""
    print(f"Admin {current_user.get('email')} is rejecting project {project_id}")
    data = request.get_json() or {}
    notes = data.get('notes', '')
    
    success = Project.reject_project(mongo, project_id, str(current_user['_id']), notes)
    
    if not success:
        print(f"Failed to reject project {project_id}")
        return jsonify({
            'status': 'error',
            'message': 'Failed to reject project. Project may not be pending or does not exist.'
        }), 400
    
    print(f"Project {project_id} rejected successfully")
    return jsonify({
        'status': 'success',
        'message': 'Project rejected successfully'
    })

# Add this to app/routes/projects.py

@projects_bp.route('/projects/<project_id>/update-donation', methods=['POST'])
@token_required
def update_project_donation(current_user, project_id):
    """Update a project's donation amount after a successful blockchain transaction"""
    data = request.json
    
    if not data or 'amount' not in data:
        return jsonify({
            'status': 'error',
            'message': 'Missing donation amount'
        }), 400
    
    try:
        # Get donation details
        amount = float(data.get('amount', 0))
        tx_hash = data.get('txHash', '')
        message = data.get('message', '')
        
        # Validate amount
        if amount <= 0:
            return jsonify({
                'status': 'error',
                'message': 'Invalid donation amount'
            }), 400
        
        # Update the project's current amount
        success = Project.update_donation_amount(mongo, project_id, amount)
        
        if not success:
            return jsonify({
                'status': 'error',
                'message': 'Failed to update project donation amount'
            }), 400
        
        # Record the donation in our database
        donation = {
            'project_id': project_id,
            'user_id': str(current_user['_id']),
            'amount': amount,
            'tx_hash': tx_hash,
            'message': message,
            'created_at': datetime.utcnow()
        }
        
        # Insert donation record
        mongo.db.donations.insert_one(donation)
        
        return jsonify({
            'status': 'success',
            'message': 'Project donation updated successfully'
        })
        
    except Exception as e:
        print(f"Error updating project donation: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': f'Error updating project donation: {str(e)}'
        }), 500