import os

class Config:
    """
    Base configuration class.
    NOTE: In this sandboxed environment, .env files are not accessible at runtime.
    Therefore, configuration values are hardcoded here as placeholders.
    In a real-world deployment, these would be loaded securely from the environment.
    """
    # Flask settings
    SECRET_KEY = 'a-default-secret-key-for-dev'

    # Supabase settings
    SUPABASE_URL = "https://example.supabase.co"
    SUPABASE_KEY = "your-anon-key"
    SUPABASE_SERVICE_ROLE_KEY = "your-service-role-key"
