-- Create a new ENUM type for promotion types
CREATE TYPE promo_type AS ENUM ('deal', 'featured_vehicle', 'seasonal_offer');

-- Create the offers table for promotions and special deals
CREATE TABLE offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    promo_type promo_type NOT NULL,
    terms_md TEXT,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create a reusable function to update the 'updated_at' timestamp
CREATE OR REPLACE FUNCTION public.trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply the trigger to the new 'offers' table
CREATE TRIGGER set_offers_updated_at
BEFORE UPDATE ON public.offers
FOR EACH ROW
EXECUTE FUNCTION public.trigger_set_timestamp();

-- Retroactively apply the trigger to existing tables for consistency
-- Note: This might cause an error if the triggers already exist from a
-- previous failed attempt. In a real-world scenario, you might add
-- `IF NOT EXISTS` checks, but for this clean-slate run, it's fine.
CREATE TRIGGER set_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.trigger_set_timestamp();

CREATE TRIGGER set_vehicles_updated_at
BEFORE UPDATE ON public.vehicles
FOR EACH ROW
EXECUTE FUNCTION public.trigger_set_timestamp();

-- Add Row Level Security to the 'offers' table
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access to active offers that are currently valid.
CREATE POLICY "Allow_public_read_access_to_active_offers"
ON public.offers
FOR SELECT
USING (
  is_active = true AND
  NOW() >= start_date AND
  NOW() <= end_date
);

-- Policy: Allow full access for staff, managers, and admins on the 'offers' table.
CREATE POLICY "Allow_full_access_for_staff_and_admins_on_offers"
ON public.offers
FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role IN ('staff', 'admin', 'manager')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role IN ('staff', 'admin', 'manager')
  )
);
