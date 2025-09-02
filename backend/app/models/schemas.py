from pydantic import BaseModel, constr, Field
from typing import Optional, Dict, Any, List
import uuid

class Vehicle(BaseModel):
    """
    Pydantic model for a single vehicle.
    """
    id: uuid.UUID
    vin: str
    make: str
    model: str
    year: int
    price_current: float = Field(..., alias='price') # Alias for frontend clarity
    mileage: int
    body_type: str
    fuel_type: str
    transmission: str
    exterior_color: str
    is_featured: bool
    # This field would be populated by a join or a separate query
    hero_image_url: Optional[str] = None

    class Config:
        from_attributes = True # Allows creating model from ORM objects
        populate_by_name = True # Allows using alias for population

class VehicleSearchResponse(BaseModel):
    """
    Pydantic model for the response of the vehicle search endpoint.
    """
    data: List[Vehicle]
    facets: Dict[str, Dict[str, int]]
    total: int

class VehicleCreate(BaseModel):
    """
    Pydantic model for creating a new vehicle listing.
    """
    vin: str
    make: str
    model: str
    year: int
    price_current: float
    mileage: int
    body_type: str
    fuel_type: str
    transmission: str
    exterior_color: str
    interior_color: Optional[str] = None
    engine: Optional[str] = None
    description: Optional[str] = None

    # New fields for "Sell Your Car"
    highlights: Optional[List[str]] = None
    known_flaws: Optional[str] = None
    service_history: Optional[Dict[str, Any]] = None
    owner_history: Optional[Dict[str, Any]] = None
    seller_notes: Optional[str] = None

    class Config:
        from_attributes = True


class Bid(BaseModel):
    """
    Pydantic model for a single bid.
    """
    id: uuid.UUID
    amount: float
    created_at: str # Using str for simplicity, can be datetime
    user_id: uuid.UUID
    # To show user's name, we'd need a join in the query
    user_full_name: Optional[str] = None

    class Config:
        from_attributes = True

class BidCreate(BaseModel):
    """
    Pydantic model for creating a new bid.
    """
    amount: float

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
