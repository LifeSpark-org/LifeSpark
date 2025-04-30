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



def send_donation_confirmation_email(donor_email, project_title, amount, tx_hash):
    """Send email confirming a successful donation"""
    msg = Message(
        'Thank you for your donation on lifeSpark',
        recipients=[donor_email]
    )
    msg.body = f'''Thank you for your donation to {project_title}!
    
Amount: {amount} ETH
Transaction Hash: {tx_hash}

Your generosity helps support communities in need through the lifeSpark platform.
'''
    mail.send(msg)

def send_donation_notification_email(project_email, project_title, amount, tx_hash):
    """Notify project owner about a received donation"""
    msg = Message(
        'Your project received a donation on lifeSpark',
        recipients=[project_email]
    )
    msg.body = f'''Good news! Your project "{project_title}" has received a donation!
    
Amount: {amount} ETH
Transaction Hash: {tx_hash}

This donation will help support your project's goals.
'''
    mail.send(msg)



def send_project_submission_email(user_email, project_title):
    """Send email confirming project submission and awaiting approval"""
    msg = Message(
        'Your lifeSpark Project Submission',
        recipients=[user_email]
    )
    msg.body = f'''Thank you for submitting your project "{project_title}" to lifeSpark!

Your project has been received and is now awaiting review by our admin team. We typically review projects within 2-3 business days.

You will receive another email when your project has been reviewed.

If you have any questions, please contact our support team.
'''
    mail.send(msg)

def send_project_approved_email(user_email, project_title):
    """Send email notifying that project has been approved"""
    msg = Message(
        'Your lifeSpark Project Has Been Approved!',
        recipients=[user_email]
    )
    msg.body = f'''Great news! Your project "{project_title}" has been approved by our team and is now live on the lifeSpark platform.

Donors can now see your project and make donations directly to your cause.

You can log in to your account to check on your project's status and funding progress.

Thank you for being part of the lifeSpark community!
'''
    mail.send(msg)