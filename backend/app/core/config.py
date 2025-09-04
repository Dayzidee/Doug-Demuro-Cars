import os
from dotenv import load_dotenv
from pathlib import Path

# The base directory is the 'backend' folder.
# __file__ is .../backend/app/core/config.py
# .parent is .../backend/app/core
# .parent.parent is .../backend/app
# .parent.parent.parent is .../backend
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# Path to the db.env file
dotenv_path = BASE_DIR / 'db.env'

# Load the environment variables from the specified .env file
load_dotenv(dotenv_path=dotenv_path)

class Config:
    """
    Configuration class that loads values from the specified .env file.
    """
    # Flask settings
    SECRET_KEY = os.getenv('SECRET_KEY', 'a-default-secret-key-for-dev')

    # Supabase settings, loaded from db.env
    SUPABASE_URL = os.getenv("SUPABASE_URL")
    SUPABASE_KEY = os.getenv("SUPABASE_KEY") # This is the anon key
    SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
