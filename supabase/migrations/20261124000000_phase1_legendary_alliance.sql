-- ==============================================================================
-- LEGENDARY ALLIANCE: PHASE 1 DATABASE MIGRATION & RLS POLICIES
-- Target: Supabase PostgreSQL
-- ==============================================================================

-- 1. Create Enums
CREATE TYPE member_role AS ENUM (
  'CURRENT_FOOTBALLER',
  'FORMER_FOOTBALLER',
  'ENTHUSIAST'
);

CREATE TYPE account_tier AS ENUM (
  'MEMBER',
  'LEGEND_ELITE',
  'ADMIN'
);

CREATE TYPE kyc_status AS ENUM (
  'PENDING',
  'VERIFIED',
  'REJECTED'
);

CREATE TYPE footballer_eligibility_status AS ENUM (
  'PENDING_KYC',
  'ELIGIBLE',
  'UNDER_ADMIN_REVIEW',
  'APPROVED',
  'REJECTED'
);

-- ==============================================================================
-- 2. Create Tables
-- ==============================================================================

-- Profiles Table (Linked 1:1 with Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  phone_number TEXT,
  role member_role NOT NULL DEFAULT 'ENTHUSIAST',
  country_of_residence TEXT NOT NULL DEFAULT '',
  african_heritage_country TEXT NOT NULL DEFAULT '',
  favorite_football_clubs TEXT[] NOT NULL DEFAULT '{}',
  african_national_team TEXT,
  current_club TEXT,
  former_clubs TEXT,
  transfermarkt_url TEXT,
  account_tier account_tier NOT NULL DEFAULT 'MEMBER',
  onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

-- Mandatory Legal Clickwrap Terms Acceptance
CREATE TABLE public.terms_acceptances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  terms_version TEXT NOT NULL DEFAULT 'v1.0-promotional-club',
  club_nature_acknowledged BOOLEAN NOT NULL CHECK (club_nature_acknowledged = TRUE),
  non_investment_acknowledged BOOLEAN NOT NULL CHECK (non_investment_acknowledged = TRUE),
  proposal_framework_acknowledged BOOLEAN NOT NULL CHECK (proposal_framework_acknowledged = TRUE),
  ip_address TEXT,
  user_agent TEXT,
  accepted_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
  CONSTRAINT unique_user_terms_version UNIQUE(user_id, terms_version)
);

-- KYC Submissions (Stores AI KYC evaluation records and storage paths)
CREATE TABLE public.kyc_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL,
  document_country TEXT NOT NULL,
  front_storage_path TEXT NOT NULL,
  back_storage_path TEXT,
  selfie_storage_path TEXT NOT NULL,
  liveness_score NUMERIC(5, 2),
  face_match_score NUMERIC(5, 2),
  status kyc_status NOT NULL DEFAULT 'PENDING',
  rejection_reason TEXT,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

-- Footballer Fast-Track Verifications (Hybrid Legend/Elite Approval Queue)
CREATE TABLE public.footballer_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  eligibility_status footballer_eligibility_status NOT NULL DEFAULT 'PENDING_KYC',
  reviewed_by UUID REFERENCES auth.users(id),
  admin_notes TEXT,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

-- Member Badges Table
CREATE TABLE public.member_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_type TEXT NOT NULL,
  title TEXT NOT NULL,
  awarded_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
  CONSTRAINT unique_user_badge UNIQUE (user_id, badge_type)
);

-- ==============================================================================
-- 3. Row-Level Security (RLS) Policies
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.terms_acceptances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kyc_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.footballer_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_badges ENABLE ROW LEVEL SECURITY;

-- Helper Function to check if calling user is Admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND account_tier = 'ADMIN'
  );
$$;

-- RLS: Profiles
CREATE POLICY "Users can view their own profile or public directory"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR onboarding_completed = TRUE);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile fields"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    -- Regular users cannot self-escalate account_tier or admin status
    AND (account_tier = (SELECT account_tier FROM public.profiles WHERE id = auth.uid()) OR public.is_admin())
  );

-- RLS: Terms Acceptances (Immutable ledger)
CREATE POLICY "Users can insert terms acceptance for themselves"
  ON public.terms_acceptances FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own terms acceptance"
  ON public.terms_acceptances FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

-- RLS: KYC Submissions
CREATE POLICY "Users can view their own KYC submissions"
  ON public.kyc_submissions FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can insert their own KYC submission"
  ON public.kyc_submissions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Only admins or service role can update KYC submissions"
  ON public.kyc_submissions FOR UPDATE
  USING (public.is_admin());

-- RLS: Footballer Verifications
CREATE POLICY "Users can view their own footballer verification status"
  ON public.footballer_verifications FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Admins can view and update footballer verifications"
  ON public.footballer_verifications FOR ALL
  USING (public.is_admin());

-- RLS: Member Badges
CREATE POLICY "Everyone can view awarded member badges"
  ON public.member_badges FOR SELECT
  USING (TRUE);

CREATE POLICY "Only admins or system triggers can award badges"
  ON public.member_badges FOR INSERT
  WITH CHECK (public.is_admin());

-- ==============================================================================
-- 4. Triggers & Business Logic Functions
-- ==============================================================================

-- Automatically create profile record when auth.users is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger: When KYC changes to VERIFIED, execute Hybrid Footballer / Enthusiast Rule
CREATE OR REPLACE FUNCTION public.handle_kyc_verification()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_role member_role;
BEGIN
  IF NEW.status = 'VERIFIED' AND (OLD.status IS DISTINCT FROM 'VERIFIED') THEN
    -- Fetch the user's role from profiles
    SELECT role INTO v_role FROM public.profiles WHERE id = NEW.user_id;

    IF v_role IN ('CURRENT_FOOTBALLER', 'FORMER_FOOTBALLER') THEN
      -- Automatically set to ELIGIBLE for Admin Fast-Track approval
      INSERT INTO public.footballer_verifications (user_id, eligibility_status)
      VALUES (NEW.user_id, 'ELIGIBLE')
      ON CONFLICT (user_id)
      DO UPDATE SET
        eligibility_status = 'ELIGIBLE',
        updated_at = TIMEZONE('utc', NOW());
    ELSE
      -- Award Verified Member badge to Enthusiasts
      INSERT INTO public.member_badges (user_id, badge_type, title)
      VALUES (NEW.user_id, 'VERIFIED_MEMBER', 'Verified Member')
      ON CONFLICT (user_id, badge_type) DO NOTHING;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_kyc_status_updated ON public.kyc_submissions;
CREATE TRIGGER on_kyc_status_updated
  AFTER UPDATE OF status ON public.kyc_submissions
  FOR EACH ROW EXECUTE FUNCTION public.handle_kyc_verification();

-- Admin Fast-Track Approval Procedure for Legend / Elite
CREATE OR REPLACE FUNCTION public.approve_footballer_legend(
  target_user_id UUID,
  notes_input TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Verify caller is Admin
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Unauthorized: Only platform administrators can approve Legend/Elite status.';
  END IF;

  -- 1. Update verification record
  UPDATE public.footballer_verifications
  SET
    eligibility_status = 'APPROVED',
    reviewed_by = auth.uid(),
    admin_notes = notes_input,
    reviewed_at = TIMEZONE('utc', NOW()),
    updated_at = TIMEZONE('utc', NOW())
  WHERE user_id = target_user_id;

  -- 2. Upgrade account tier to LEGEND_ELITE
  UPDATE public.profiles
  SET
    account_tier = 'LEGEND_ELITE',
    updated_at = TIMEZONE('utc', NOW())
  WHERE id = target_user_id;

  -- 3. Award Legend / Elite Badge
  INSERT INTO public.member_badges (user_id, badge_type, title)
  VALUES (target_user_id, 'LEGEND_ELITE', 'Legend / Elite')
  ON CONFLICT (user_id, badge_type) DO NOTHING;
END;
$$;

-- ==============================================================================
-- 5. Supabase Storage: Private KYC Bucket & Policies
-- ==============================================================================

-- Insert private bucket if not exists
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'kyc-documents',
  'kyc-documents',
  FALSE,
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
)
ON CONFLICT (id) DO UPDATE SET
  public = FALSE,
  file_size_limit = 10485760;

-- Storage Policy: Users can upload only to their own folder: private/{user_id}/...
CREATE POLICY "Users can upload their own KYC files"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'kyc-documents'
    AND (storage.foldername(name))[1] = 'private'
    AND (storage.foldername(name))[2] = auth.uid()::text
  );

-- Storage Policy: Users can view their own KYC files, Admins can view all
CREATE POLICY "Users and Admins can view KYC files"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'kyc-documents'
    AND (
      (storage.foldername(name))[2] = auth.uid()::text
      OR public.is_admin()
    )
  );
