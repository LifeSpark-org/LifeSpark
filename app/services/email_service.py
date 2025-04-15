from flask_mail import Message
import random
import string
from .. import mail

def generate_verification_code():
    """Generate a 6-digit verification code for account registration"""
    return ''.join(random.choices(string.digits, k=6))

def send_verification_email(user_email, verification_code):
    """Send email with verification code for account registration"""
    msg = Message(
        'Verify your lifeSpark account',
        recipients=[user_email]
    )
    msg.body = f'''Thank you for registering with lifeSpark!
Your verification code is: {verification_code}

This code will expire in 10 minutes.

If you did not register for lifeSpark, please ignore this email.
'''
    mail.send(msg)

def send_reset_password_email(user_email, reset_code):
    """Send email with reset code for password recovery"""
    msg = Message(
        'lifeSpark Password Reset',
        recipients=[user_email]
    )
    msg.body = f'''You requested to reset your lifeSpark password.
Your password reset code is: {reset_code}

This code will expire in 10 minutes.

If you did not request a password reset, please ignore this email and ensure your account is secure.
'''
    mail.send(msg)