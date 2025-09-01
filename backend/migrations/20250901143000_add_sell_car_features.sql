-- Migration to add new columns to the vehicles table for the "Sell Your Car" feature.

-- Add columns to the vehicles table to store more detailed information about each car.
-- These columns are designed to support a comprehensive car selling and bidding platform.

ALTER TABLE public.vehicles
ADD COLUMN condition_report JSONB,
ADD COLUMN highlights TEXT[],
ADD COLUMN known_flaws TEXT,
ADD COLUMN service_history JSONB,
ADD COLUMN owner_history JSONB,
ADD COLUMN seller_notes TEXT;

-- Add comments to the new columns for clarity on their purpose.
COMMENT ON COLUMN public.vehicles.condition_report IS 'A detailed report of the vehicle''s condition, stored as a JSON object. Can include ratings for different parts of the car.';
COMMENT ON COLUMN public.vehicles.highlights IS 'An array of short, descriptive selling points for the vehicle.';
COMMENT ON COLUMN public.vehicles.known_flaws IS 'A transparent disclosure of any known issues or flaws with the vehicle.';
COMMENT ON COLUMN public.vehicles.service_history IS 'A JSON array of objects, where each object represents a maintenance record with details like date, service performed, and cost.';
COMMENT ON COLUMN public.vehicles.owner_history IS 'A JSON object containing details about previous ownership and service locations.';
COMMENT ON COLUMN public.vehicles.seller_notes IS 'Personal insights and additional information provided by the seller.';
