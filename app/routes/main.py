from flask import Blueprint, render_template, jsonify
from .. import mongo
from ..models.project import Project


main_bp = Blueprint('main', __name__)

@main_bp.route('/')
def home():
    """Render the home page"""
    return render_template('index.html')

@main_bp.route('/about')
def about():
    """Render the about page"""
    return render_template('sections/about.html')

@main_bp.route('/contact', methods=['GET', 'POST'])
def contact():
    """Handle contact form"""
    return render_template('sections/contact.html')

@main_bp.route('/map')
def map():
    """Render the map page"""
    return render_template('sections/map.html')

@main_bp.route('/projects/approved', methods=['GET'])
def get_public_approved_projects():
    """Return approved projects for public view"""
    approved_projects = Project.get_approved_projects(mongo)

    for project in approved_projects:
        project['_id'] = str(project['_id'])

    return jsonify({
        'status': 'success',
        'projects': approved_projects
    })


@main_bp.errorhandler(404)
def page_not_found(e):
    """Handle 404 errors"""
    return jsonify({"error": "Page not found"}), 404

@main_bp.errorhandler(500)
def internal_server_error(e):
    """Handle 500 errors"""
    return jsonify({"error": "Internal server error"}), 500