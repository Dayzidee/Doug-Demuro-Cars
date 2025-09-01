from flask import Flask

def create_app():
    """Create and configure an instance of the Flask application."""
    app = Flask(__name__)

    # Load configuration from the config object
    from .core.config import Config
    app.config.from_object(Config)

    # Register API blueprints
    from .api import meta
    from .api import user
    from .api import stats
    from .api import vehicles
    from .api import filters
    app.register_blueprint(meta.bp)
    app.register_blueprint(user.bp)
    app.register_blueprint(stats.bp)
    app.register_blueprint(vehicles.bp)
    app.register_blueprint(filters.bp)

    # Initialize database connection handling
    from .core import db
    db.init_app(app)

    return app
