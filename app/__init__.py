from flask import Flask
from flask_pymongo import PyMongo
from flask_mail import Mail
from .config import Config

mongo = PyMongo()
mail = Mail()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Initialize 
    mongo.init_app(app)
    mail.init_app(app)
    
    # Register blueprints
    from .routes.auth import auth_bp
    from .routes.main import main_bp
    from .routes.donations import donations_bp
    
    app.register_blueprint(auth_bp)
    app.register_blueprint(main_bp)
    app.register_blueprint(donations_bp)
    
    return app