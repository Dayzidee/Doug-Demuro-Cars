-- Migration to create the 'bids' table for the bidding system.

CREATE TABLE public.bids (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT positive_bid_amount CHECK (amount > 0)
);

COMMENT ON TABLE public.bids IS 'Stores all bids made on vehicles.';
COMMENT ON COLUMN public.bids.vehicle_id IS 'The vehicle that was bid on.';
COMMENT ON COLUMN public.bids.user_id IS 'The user who placed the bid.';
COMMENT ON COLUMN public.bids.amount IS 'The amount of the bid.';
COMMENT ON COLUMN public.bids.created_at IS 'The timestamp when the bid was placed.';
