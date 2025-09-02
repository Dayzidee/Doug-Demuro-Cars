-- Auction-specific tables
CREATE TABLE auctions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id uuid REFERENCES vehicles(id),
    starting_bid numeric NOT NULL,
    reserve_price numeric,
    current_bid numeric DEFAULT 0,
    bid_count integer DEFAULT 0,
    starts_at timestamptz NOT NULL,
    ends_at timestamptz NOT NULL,
    status text CHECK (status IN ('scheduled', 'live', 'ended', 'cancelled')),
    auto_extend_minutes integer DEFAULT 5,
    min_verification_tier text CHECK (min_verification_tier IN ('none', 'basic', 'premium')) DEFAULT 'basic',
    created_at timestamptz DEFAULT now()
);

CREATE TABLE bids (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    auction_id uuid REFERENCES auctions(id),
    user_id uuid REFERENCES profiles(id),
    amount numeric NOT NULL,
    is_autobid boolean DEFAULT false,
    max_autobid_amount numeric,
    bid_time timestamptz DEFAULT now(),
    ip_address inet,
    user_agent text,
    verification_tier text CHECK (verification_tier IN ('basic', 'premium')) NOT NULL
);

CREATE TABLE auction_watchers (
    user_id uuid REFERENCES profiles(id),
    auction_id uuid REFERENCES auctions(id),
    notifications_enabled boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    PRIMARY KEY (user_id, auction_id)
);
