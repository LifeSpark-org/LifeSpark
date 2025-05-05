from flask import Blueprint, render_template, jsonify, request 
from .. import mongo
from ..models.project import Project
from ..services.email_service import send_contact_form_email, send_newsletter_subscription_email



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
    if request.method == 'POST':
        try:
            data = request.get_json()
            
            # בדיקת תקינות הנתונים
            if not all(key in data for key in ['name', 'email', 'message']):
                return jsonify({'success': False, 'message': 'Missing required fields'}), 400
                
            name = data.get('name')
            email = data.get('email')
            subject = data.get('subject', 'Contact Form Message')  # ברירת מחדל אם ריק
            message = data.get('message')
            
            # שליחת האימייל
            send_contact_form_email(name, email, subject, message)
            
            return jsonify({'success': True, 'message': 'Message sent successfully'}), 200
            
        except Exception as e:
            print(f"Error in contact form: {str(e)}")
            return jsonify({'success': False, 'message': 'Server error'}), 500
    
    return render_template('sections/contact.html')




@main_bp.route('/map')
def map():
    """Render the map page"""
    return render_template('sections/map.html')

@main_bp.route('/projects/approved', methods=['GET'])
def get_public_approved_projects():
    """Return approved projects for public view"""
    approved_projects = Project.get_approved_projects(mongo)

    # אם אין פרויקטים - נוסיף פרויקטים לדוגמה

    # המרת ObjectID למחרוזות
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



from datetime import datetime


@main_bp.route('/subscribe-newsletter', methods=['POST'])
def subscribe_newsletter():
    """Handle newsletter subscription"""
    try:
        data = request.get_json()
        
        # בדיקת תקינות הנתונים
        if not data or not data.get('email'):
            return jsonify({'success': False, 'message': 'Email address is required'}), 400
            
        email = data.get('email')
        
        # בדיקה פשוטה של תקינות המייל (אפשר להרחיב)
        if '@' not in email or '.' not in email:
            return jsonify({'success': False, 'message': 'Invalid email address'}), 400
        
        # אפשר להוסיף כאן קוד לשמירת המייל במסד נתונים
        # לדוגמה:
        mongo.db.newsletter_subscribers.insert_one({
           'email': email,
           'subscribed_at': datetime.utcnow()
        })
        
        # שליחת אימייל אישור
        send_newsletter_subscription_email(email)
        
        return jsonify({'success': True, 'message': 'Subscription successful!'}), 200
        
    except Exception as e:
        print(f"Error in newsletter subscription: {str(e)}")
        return jsonify({'success': False, 'message': 'Server error'}), 500