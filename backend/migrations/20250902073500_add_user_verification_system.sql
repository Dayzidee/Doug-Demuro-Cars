-- Enhanced user profiles with verification tiers
ALTER TABLE profiles
    ADD COLUMN verification_status text CHECK (verification_status IN ('unverified', 'pending', 'basic_verified', 'premium_verified', 'suspended', 'deactivated')) DEFAULT 'unverified',
    ADD COLUMN verification_tier text CHECK (verification_tier IN ('none', 'basic', 'premium')) DEFAULT 'none',
    ADD COLUMN suspension_reason text,
    ADD COLUMN suspension_ends_at timestamptz,
    ADD COLUMN deactivated_at timestamptz,
    ADD COLUMN deactivated_reason text,
    ADD COLUMN can_access_dashboard boolean DEFAULT true,
    ADD COLUMN last_policy_violation_at timestamptz;

-- Verification applications and document management
CREATE TABLE verification_applications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES profiles(id),
    application_type text CHECK (application_type IN ('basic', 'premium')) NOT NULL,
    status text CHECK (status IN ('draft', 'submitted', 'under_review', 'approved', 'rejected', 'appealing')) DEFAULT 'draft',
    submitted_at timestamptz,
    reviewed_at timestamptz,
    reviewed_by uuid REFERENCES profiles(id),
    rejection_reason text,
    admin_notes text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Document storage for verification
CREATE TABLE verification_documents (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id uuid REFERENCES verification_applications(id),
    document_type text CHECK (document_type IN ('government_id', 'proof_of_income', 'bank_statement', 'insurance_proof', 'business_license', 'other')) NOT NULL,
    file_path text NOT NULL,
    file_name text NOT NULL,
    file_size bigint,
    mime_type text,
    uploaded_at timestamptz DEFAULT now(),
    verified_by_admin boolean DEFAULT false,
    admin_notes text
);

-- Admin verification checklist
CREATE TABLE verification_checklist (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id uuid REFERENCES verification_applications(id),
    admin_id uuid REFERENCES profiles(id),
    identity_verified boolean DEFAULT false,
    income_verified boolean DEFAULT false,
    address_verified boolean DEFAULT false,
    banking_verified boolean DEFAULT false,
    background_check_passed boolean DEFAULT false,
    additional_checks jsonb,
    completed_at timestamptz,
    notes text
);

-- Appeals process
CREATE TABLE verification_appeals (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id uuid REFERENCES verification_applications(id),
    user_id uuid REFERENCES profiles(id),
    appeal_reason text NOT NULL,
    additional_documents jsonb,
    status text CHECK (status IN ('submitted', 'under_review', 'approved', 'rejected')) DEFAULT 'submitted',
    reviewed_by uuid REFERENCES profiles(id),
    reviewed_at timestamptz,
    admin_response text,
    created_at timestamptz DEFAULT now()
);
