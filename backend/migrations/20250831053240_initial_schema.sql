-- Create custom ENUM types for consistent data
CREATE TYPE user_role AS ENUM ('customer', 'staff', 'manager', 'admin');
CREATE TYPE vehicle_body_type AS ENUM ('Sedan', 'SUV', 'Truck', 'Hatchback', 'Coupe', 'Convertible', 'Minivan', 'Wagon');
CREATE TYPE fuel_type AS ENUM ('Gasoline', 'Diesel', 'Electric', 'Hybrid', 'Plug-in Hybrid');
CREATE TYPE transmission_type AS ENUM ('Automatic', 'Manual', 'CVT', 'Semi-Automatic');
CREATE TYPE drivetrain_type AS ENUM ('FWD', 'RWD', 'AWD', '4WD');
CREATE TYPE vehicle_condition AS ENUM ('New', 'Used', 'Certified Pre-Owned');
CREATE TYPE vehicle_status AS ENUM ('Available', 'Sold', 'Pending', 'Reserved', 'In-maintenance');
CREATE TYPE media_type AS ENUM ('Image', 'Video', '360-View');
CREATE TYPE price_type AS ENUM ('Listed', 'Sale', 'MSRP');

-- Enable UUID generation function if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table for user profiles and authentication data
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    phone VARCHAR(20),
    role user_role DEFAULT 'customer',
    avatar_url TEXT,
    preferences JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table for dealership locations
CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    postal_code VARCHAR(20),
    country VARCHAR(50) DEFAULT 'US',
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    phone VARCHAR(20),
    whatsapp VARCHAR(20),
    hours JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Core table for vehicle inventory
CREATE TABLE vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vin VARCHAR(17) UNIQUE NOT NULL,
    stock_number VARCHAR(50) UNIQUE,
    make VARCHAR(50) NOT NULL,
    model VARCHAR(100) NOT NULL,
    trim VARCHAR(100),
    year INTEGER NOT NULL,
    body_type vehicle_body_type,
    exterior_color VARCHAR(50),
    interior_color VARCHAR(50),
    mileage INTEGER DEFAULT 0,
    fuel_type fuel_type DEFAULT 'Gasoline',
    transmission transmission_type,
    drivetrain drivetrain_type,
    engine VARCHAR(100),
    doors INTEGER,
    seats INTEGER,
    condition vehicle_condition DEFAULT 'Used',
    location_id UUID REFERENCES locations(id),
    price_current DECIMAL(10, 2) NOT NULL,
    price_original DECIMAL(10, 2),
    cost DECIMAL(10, 2),
    is_featured BOOLEAN DEFAULT false,
    is_special_offer BOOLEAN DEFAULT false,
    is_certified BOOLEAN DEFAULT false,
    status vehicle_status DEFAULT 'Available',
    description TEXT,
    features TEXT[],
    specifications JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table for vehicle photos, videos, and 360-degree views
CREATE TABLE vehicle_media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
    media_type media_type NOT NULL,
    url TEXT NOT NULL,
    thumbnail_url TEXT,
    position INTEGER DEFAULT 0,
    is_primary BOOLEAN DEFAULT false,
    alt_text VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table to track historical pricing for vehicles
CREATE TABLE price_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
    price DECIMAL(10, 2) NOT NULL,
    price_type price_type DEFAULT 'Listed',
    recorded_at TIMESTAMPTZ DEFAULT NOW(),
    recorded_by UUID REFERENCES profiles(id)
);
