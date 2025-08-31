from flask import Flask

def create_app():
    """Create and configure an instance of the Flask application."""
    app = Flask(__name__)

    # A default secret key for development.
    # In production, this should be loaded from a config file or environment variable.
    app.config.from_mapping(
        SECRET_KEY='dev',
    )

    # Register API blueprints
    from .api import meta
    app.register_blueprint(meta.bp)

    return app
