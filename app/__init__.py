from flask import Flask
from flask_pymongo import PyMongo
from flask_mail import Mail
from .config import Config
import os

mongo = PyMongo()
mail = Mail()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Make sure we have a secret key for sessions
    if not app.config.get('SECRET_KEY'):
        app.config['SECRET_KEY'] = os.urandom(24)
    
    # Initialize 
    mongo.init_app(app)
    mail.init_app(app)
    
    # Register blueprints
    from .routes.auth import auth_bp
    from .routes.main import main_bp
    from .routes.donations import donations_bp
    from .routes.projects import projects_bp
    from .routes.admin import admin_bp
    
    app.register_blueprint(auth_bp)
    app.register_blueprint(main_bp)
    app.register_blueprint(donations_bp)
    app.register_blueprint(projects_bp)
    app.register_blueprint(admin_bp)
    
    return app