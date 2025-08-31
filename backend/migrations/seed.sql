-- SEED DATA
-- This script populates the database with initial data for development and testing.

-- 1. Insert Locations
INSERT INTO public.locations (id, name, address, city, state, postal_code, country)
VALUES
('8c27320b-9d7c-4a3a-8e2d-4b5a3e1c6b2b', 'Prestige Auto Group - Downtown', '123 Main St', 'Metropolis', 'NY', '10001', 'US'),
('e5b5c7a1-5b5e-4e1e-9c1c-8b8b8b8b8b8b', 'Luxury Motors - Uptown', '456 Oak Ave', 'Metropolis', 'NY', '10021', 'US');

-- 2. Insert Profiles
-- Note: In a real application, profiles are created automatically when a new user signs up via Supabase Auth.
-- These are seeded here for testing purposes. These UUIDs should correspond to actual auth users in a test environment.
INSERT INTO public.profiles (id, email, full_name, role)
VALUES
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'customer@example.com', 'John Doe', 'customer'),
('f0e9d8c7-b6a5-4321-fedc-ba9876543210', 'staff@example.com', 'Jane Smith', 'staff'),
('12345678-1234-1234-1234-1234567890ab', 'admin@example.com', 'Admin User', 'admin');

-- 3. Insert Vehicles
-- Associate vehicles with the locations created above.
INSERT INTO public.vehicles (vin, make, model, year, price_current, mileage, body_type, fuel_type, transmission, exterior_color, location_id, description, features)
VALUES
('VIN001', 'Toyota', 'Camry', 2022, 25000.00, 15000, 'Sedan', 'Gasoline', 'Automatic', 'Blue', '8c27320b-9d7c-4a3a-8e2d-4b5a3e1c6b2b', 'A reliable and fuel-efficient sedan.', ARRAY['Bluetooth', 'Backup Camera']),
('VIN002', 'Honda', 'CR-V', 2021, 28000.00, 25000, 'SUV', 'Gasoline', 'Automatic', 'Red', '8c27320b-9d7c-4a3a-8e2d-4b5a3e1c6b2b', 'A popular and versatile SUV.', ARRAY['Apple CarPlay', 'Lane Assist']),
('VIN003', 'Ford', 'F-150', 2023, 45000.00, 5000, 'Truck', 'Gasoline', 'Automatic', 'Black', 'e5b5c7a1-5b5e-4e1e-9c1c-8b8b8b8b8b8b', 'A powerful and rugged truck for all your needs.', ARRAY['Towing Package', '4x4']),
('VIN004', 'Tesla', 'Model 3', 2023, 48000.00, 10000, 'Sedan', 'Electric', 'Automatic', 'White', 'e5b5c7a1-5b5e-4e1e-9c1c-8b8b8b8b8b8b', 'A sleek and fast electric car.', ARRAY['Autopilot', 'Premium Sound']),
('VIN005', 'BMW', 'X5', 2020, 55000.00, 35000, 'SUV', 'Hybrid', 'Automatic', 'Gray', 'e5b5c7a1-5b5e-4e1e-9c1c-8b8b8b8b8b8b', 'A luxury SUV with great performance and features.', ARRAY['Sunroof', 'Heated Seats', '360 Camera']);
