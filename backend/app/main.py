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
    from .api import inventory as inventory_bp
    from .api import listings as listings_bp
    # from .api import bids as bids_bp
    from .api import gallery
    from .api import offers as offers_bp
    from .api.admin import offers as admin_offers_bp
    from .api import tools as tools_bp
    from .api import auctions as auctions_bp
    app.register_blueprint(meta.bp)
    app.register_blueprint(user.bp)
    app.register_blueprint(stats.bp)
    app.register_blueprint(inventory_bp.bp)
    app.register_blueprint(listings_bp.bp)
    # app.register_blueprint(bids_bp.bp)
    app.register_blueprint(gallery.bp)
    app.register_blueprint(offers_bp.bp)
    app.register_blueprint(admin_offers_bp.bp)
    app.register_blueprint(tools_bp.bp)
    app.register_blueprint(auctions_bp.bp)

    # Initialize database connection handling
    from .core import db
    db.init_app(app)

    return app
