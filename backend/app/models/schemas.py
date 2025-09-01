from pydantic import BaseModel, constr
from typing import Optional, Dict, Any

class ProfileUpdate(BaseModel):
    """
    Pydantic model for validating the payload when updating a user profile.
    All fields are optional, allowing for partial updates (PATCH).
    """
    full_name: Optional[constr(min_length=1, max_length=255)] = None
    phone: Optional[constr(max_length=20)] = None
    avatar_url: Optional[str] = None
    preferences: Optional[Dict[str, Any]] = None

    class Config:
        # Forbid any fields not defined in this model to prevent mass assignment vulnerabilities.
        extra = 'forbid'
