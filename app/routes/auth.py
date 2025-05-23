from flask import Blueprint, request, jsonify, session
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import jwt
from .. import mongo
from ..config import Config
from ..utils.decorators import token_required
from ..services.email_service import generate_verification_code, send_verification_email, send_reset_password_email
from ..utils.captcha import generate_captcha
import random
import string

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/generate-captcha', methods=['GET'])
def get_captcha():
    """Generate a new CAPTCHA and store the solution in session."""
    captcha = generate_captcha()
    session['captcha_text'] = captcha['text']
    
    return jsonify({
        'image': captcha['image']
    })

def verify_captcha(captcha_input):
    """Verify the captcha input against the stored solution."""
    if not captcha_input:
        return False
        
    correct_text = session.get('captcha_text')
    
    if not correct_text:
        return False
    
    # Case insensitive check
    return captcha_input.upper() == correct_text.upper()

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Validate CAPTCHA
    captcha_input = data.get('captcha')
    if not verify_captcha(captcha_input):
        return jsonify({'error': 'CAPTCHA verification failed'}), 400
    
    # Reset session captcha after verification
    session.pop('captcha_text', None)
    
    if not all(k in data for k in ['name', 'email', 'password', 'user_type']):
        return jsonify({'error': 'Missing required fields'}), 400
        
    if mongo.db.users.find_one({'email': data['email']}):
        return jsonify({'error': 'Email already registered'}), 409
    
    # Validate user_type
    if data['user_type'] not in ['donor', 'requester']:
        return jsonify({'error': 'Invalid user type'}), 400
    
    verification_code = generate_verification_code()
    expiration_time = datetime.utcnow() + timedelta(minutes=10)
    
    temp_user = {
        'name': data['name'],
        'email': data['email'],
        'password': generate_password_hash(data['password']),
        'user_type': data['user_type'],  # זהו השדה החדש
        'verification_code': verification_code,
        'code_expiration': expiration_time,
        'created_at': datetime.utcnow()
    }
    
    try:
        mongo.db.pending_users.insert_one(temp_user)
        send_verification_email(data['email'], verification_code)
        
        return jsonify({
            'message': 'Verification code sent to your email'
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/verify-code', methods=['POST'])
def verify_code():
    data = request.get_json()
    email = data.get('email')
    code = data.get('code')
    
    if not email or not code:
        return jsonify({'error': 'Missing email or verification code'}), 400
    
    pending_user = mongo.db.pending_users.find_one({
        'email': email,
        'verification_code': code,
        'code_expiration': {'$gt': datetime.utcnow()}
    })
    
    if not pending_user:
        return jsonify({'error': 'Invalid or expired verification code'}), 400
    
    try:
        user_data = {
            'name': pending_user['name'],
            'email': pending_user['email'],
            'password': pending_user['password'],
            'user_type': pending_user['user_type'],  # העברת סוג המשתמש
            'email_verified': True,
            'created_at': pending_user['created_at']
        }
        
        mongo.db.users.insert_one(user_data)
        mongo.db.pending_users.delete_one({'_id': pending_user['_id']})
        
        return jsonify({'message': 'Registration successful!'}), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    # Validate CAPTCHA
    captcha_input = data.get('captcha')
    if not verify_captcha(captcha_input):
        return jsonify({'error': 'CAPTCHA verification failed'}), 400
    
    # Reset session captcha after verification
    session.pop('captcha_text', None)
    
    if not all(k in data for k in ['email', 'password']):
        return jsonify({'error': 'Missing email or password'}), 400
        
    user = mongo.db.users.find_one({'email': data['email']})
    
    if user and check_password_hash(user['password'], data['password']):
        if not user.get('email_verified'):
            return jsonify({'error': 'Please verify your email first'}), 401
            
        token = jwt.encode(
            {
                'user_id': str(user['_id']),
                'exp': datetime.utcnow() + timedelta(days=1)
            },
            Config.SECRET_KEY,
            algorithm='HS256'
        )
        
        return jsonify({
            'message': 'Login successful!',
            'token': token,
            'name': user['name'],
            'user_type': user.get('user_type', 'donor')  # הוספת סוג המשתמש לתשובה
        }), 200
    else:
        return jsonify({'error': 'Invalid email or password'}), 401

@auth_bp.route('/check-auth', methods=['GET'])
@token_required
def check_auth(current_user):
    """Check token validity and return user details"""
    return jsonify({
        'name': current_user['name'],
        'email': current_user['email'],
        'user_type': current_user.get('user_type', 'donor')  # הוספת סוג המשתמש לתשובה
    })

# פונקציונליות איפוס סיסמה
def generate_reset_code():
    """Generate a 6-digit reset code"""
    return ''.join(random.choices(string.digits, k=6))

@auth_bp.route('/reset-password-request', methods=['POST'])
def reset_password_request():
    """Handle request for password reset"""
    data = request.get_json()
    
    email = data.get('email')
    if not email:
        return jsonify({'error': 'Email is required'}), 400
        
    # Check if user exists
    user = mongo.db.users.find_one({'email': email})
    if not user:
        # For security reasons, don't reveal if email exists or not
        # Instead, return success message anyway
        return jsonify({'message': 'If this email is registered, a reset code has been sent.'}), 200
    
    # Generate reset code and set expiration
    reset_code = generate_reset_code()
    expiration_time = datetime.utcnow() + timedelta(minutes=10)
    
    # Update or create a reset record
    mongo.db.password_resets.update_one(
        {'email': email},
        {
            '$set': {
                'email': email,
                'reset_code': reset_code,
                'expiration': expiration_time,
                'created_at': datetime.utcnow()
            }
        },
        upsert=True
    )
    
    # Send reset code email
    try:
        send_reset_password_email(email, reset_code)
        return jsonify({'message': 'Reset code sent to your email'}), 200
    except Exception as e:
        return jsonify({'error': f'Error sending email: {str(e)}'}), 500

@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    """Update password with reset code"""
    data = request.get_json()
    
    email = data.get('email')
    reset_code = data.get('reset_code')
    new_password = data.get('new_password')
    
    if not all([email, reset_code, new_password]):
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Get reset record
    reset_record = mongo.db.password_resets.find_one({
        'email': email,
        'reset_code': reset_code,
        'expiration': {'$gt': datetime.utcnow()}
    })
    
    if not reset_record:
        return jsonify({'error': 'Invalid or expired reset code'}), 400
    
    # Get user
    user = mongo.db.users.find_one({'email': email})
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    # Update password
    try:
        # Hash the new password
        hashed_password = generate_password_hash(new_password)
        
        # Update user password
        mongo.db.users.update_one(
            {'email': email},
            {'$set': {'password': hashed_password}}
        )
        
        # Remove reset record
        mongo.db.password_resets.delete_one({'_id': reset_record['_id']})
        
        return jsonify({'message': 'Password updated successfully'}), 200
    except Exception as e:
        return jsonify({'error': f'Error updating password: {str(e)}'}), 500