from supabase import create_client, Client
from flask import current_app, g

def get_supabase() -> Client:
    """
    Connects to the Supabase client for the current application context.
    If a connection is not available, it creates one.
    """
    if 'supabase' not in g:
        url = current_app.config.get("SUPABASE_URL")
        key = current_app.config.get("SUPABASE_KEY")
        if not url or not key:
            raise ValueError("Supabase URL and Key must be configured.")
        g.supabase = create_client(url, key)
    return g.supabase

def close_supabase(e=None):
    """
    Closes the Supabase connection at the end of the request.
    """
    # The supabase-py client manages its own connection pool,
    # so we just need to ensure it's removed from the app context.
    g.pop('supabase', None)

def init_app(app):
    """
    Registers database functions with the Flask app. This is called by
    the application factory.
    """
    app.teardown_appcontext(close_supabase)
