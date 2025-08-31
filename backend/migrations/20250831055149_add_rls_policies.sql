-- Add the 'visible' column to the vehicles table, required for public RLS policy.
ALTER TABLE public.vehicles
ADD COLUMN visible BOOLEAN DEFAULT true;

-- 1. Enable Row Level Security on the target tables.
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;


-- 2. Create policies for the 'profiles' table.

-- Policy: Allow users to view their own profile.
CREATE POLICY "Allow_individual_read_access_on_profiles"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

-- Policy: Allow users to update their own profile.
CREATE POLICY "Allow_individual_update_access_on_profiles"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id);


-- 3. Create policies for the 'vehicles' table.

-- Policy: Allow public (unauthenticated) read access to vehicles marked as 'visible'.
CREATE POLICY "Allow_public_read_access_to_visible_vehicles"
ON public.vehicles
FOR SELECT
USING (visible = true);

-- Policy: Allow staff and admin users full access to all vehicles.
-- This checks the user's role from the 'profiles' table.
CREATE POLICY "Allow_full_access_for_staff_and_admins_on_vehicles"
ON public.vehicles
FOR ALL -- Applies to SELECT, INSERT, UPDATE, DELETE
USING (
  EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role IN ('staff', 'admin')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role IN ('staff', 'admin')
  )
);
