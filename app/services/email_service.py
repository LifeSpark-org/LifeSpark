from flask_mail import Message
import random
import string
from .. import mail

def generate_verification_code():
    return ''.join(random.choices(string.digits, k=6))

def send_verification_email(user_email, verification_code):
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
