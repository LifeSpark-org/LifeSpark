from flask import Blueprint, request, jsonify, session
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import jwt
import requests
from bson.objectid import ObjectId
from .. import mongo
from ..config import Config
from ..utils.decorators import token_required
from ..services.email_service import generate_verification_code, send_verification_email
from ..utils.captcha import generate_captcha

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
    
    if not all(k in data for k in ['name', 'email', 'password']):
        return jsonify({'error': 'Missing required fields'}), 400
        
    if mongo.db.users.find_one({'email': data['email']}):
        return jsonify({'error': 'Email already registered'}), 409
    
    verification_code = generate_verification_code()
    expiration_time = datetime.utcnow() + timedelta(minutes=10)
    
    temp_user = {
        'name': data['name'],
        'email': data['email'],
        'password': generate_password_hash(data['password']),
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
            'name': user['name']
        }), 200
        
    return jsonify({'error': 'Invalid email or password'}), 401

@auth_bp.route('/check-auth', methods=['GET'])
@token_required
def check_auth(current_user):
    """Check token validity and return user details"""
    return jsonify({
        'name': current_user['name'],
        'email': current_user['email']
    })