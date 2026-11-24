-- ==============================================================================
-- LEGENDARY ALLIANCE: CONTRIBUTIONS, REFERRALS & LOYALTY POINTS ENGINE
-- Target: Supabase PostgreSQL
-- ==============================================================================

-- 1. Create Enums
CREATE TYPE contribution_type AS ENUM (
  'ASSET_PLEDGE',
  'ANNUAL_DUES',
  'FOUNDING_SYNDICATE',
  'COMMUNITY_PATRONAGE'
);

CREATE TYPE contribution_status AS ENUM (
  'PENDING',
  'COMPLETED',
  'CANCELLED',
  'REFUNDED'
);

CREATE TYPE referral_status AS ENUM (
  'PENDING_KYC',
  'QUALIFIED',
  'REWARDED',
  'INELIGIBLE'
);

CREATE TYPE loyalty_tier AS ENUM (
  'SCOUT',                 -- 0 - 499 pts
  'VANGUARD',               -- 500 - 2,499 pts
  'CAPTAIN',                -- 2,500 - 9,999 pts
  'LEGENDARY_AMBASSADOR'    -- 10,000+ pts
);

CREATE TYPE points_event_type AS ENUM (
  'ONBOARDING_COMPLETED',
  'KYC_VERIFIED',
  'REFERRAL_QUALIFIED',
  'ASSET_PROPOSAL_SUBMITTED',
  'ASSET_PROPOSAL_APPROVED',
  'CONTRIBUTION_PLEDGED',
  'GOVERNANCE_VOTE',
  'POINTS_REDEEMED'
);

-- ==============================================================================
-- 2. Create Tables
-- ==============================================================================

-- Member Referral Codes
CREATE TABLE public.referral_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  code TEXT NOT NULL UNIQUE,
  clicks_count INTEGER NOT NULL DEFAULT 0,
  total_signups INTEGER NOT NULL DEFAULT 0,
  qualified_referrals INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

-- Member Referrals Tracking
CREATE TABLE public.member_referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  referral_code TEXT NOT NULL,
  status referral_status NOT NULL DEFAULT 'PENDING_KYC',
  reward_points INTEGER NOT NULL DEFAULT 500,
  rewarded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

-- Member Contributions & Asset Syndicate Pledges
CREATE TABLE public.member_contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  contribution_type contribution_type NOT NULL DEFAULT 'ASSET_PLEDGE',
  target_asset_name TEXT NOT NULL,
  target_asset_id TEXT,
  amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  currency TEXT NOT NULL DEFAULT 'USD',
  status contribution_status NOT NULL DEFAULT 'COMPLETED',
  payment_method TEXT NOT NULL DEFAULT 'CARD',
  transaction_reference TEXT UNIQUE NOT NULL,
  disclaimer_accepted BOOLEAN NOT NULL CHECK (disclaimer_accepted = TRUE),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

-- Loyalty Points Accounts (Materialized Current Tier & Balances)
CREATE TABLE public.loyalty_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  current_balance INTEGER NOT NULL DEFAULT 0 CHECK (current_balance >= 0),
  lifetime_points INTEGER NOT NULL DEFAULT 0 CHECK (lifetime_points >= 0),
  current_tier loyalty_tier NOT NULL DEFAULT 'SCOUT',
  tier_updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

-- Immutable Loyalty Points Transactions Ledger
CREATE TABLE public.loyalty_point_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type points_event_type NOT NULL,
  points INTEGER NOT NULL, -- Positive for earn, negative for redemption
  balance_after INTEGER NOT NULL,
  description TEXT NOT NULL,
  reference_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

-- Loyalty Rewards & Perks Catalog
CREATE TABLE public.loyalty_rewards_catalog (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  points_cost INTEGER NOT NULL CHECK (points_cost > 0),
  tier_requirement loyalty_tier NOT NULL DEFAULT 'SCOUT',
  category TEXT NOT NULL DEFAULT 'EXPERIENCE',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

-- Pre-populate Rewards Catalog
INSERT INTO public.loyalty_rewards_catalog (id, title, description, points_cost, tier_requirement, category)
VALUES
  ('asset-due-diligence-pack', 'Priority Asset Due Diligence Pack', 'Comprehensive financial & technical prospectus for upcoming European & African club acquisitions.', 500, 'SCOUT', 'INTELLIGENCE'),
  ('locker-room-session', 'Virtual Locker Room Access with Football Legends', 'Private quarterly roundtable with verified former and active African footballers.', 1500, 'VANGUARD', 'ACCESS'),
  ('annual-summit-vip', 'Pan-African Football Business Summit VIP Pass', 'VIP ticket & networking gala dinner at our annual flagship summit in Kigali or London.', 3000, 'CAPTAIN', 'EVENT'),
  ('facility-delegation', 'European Club & Academy Inspection Delegation', 'Invitation to join the Alliance Executive delegation inspecting target stadiums and training complexes.', 7500, 'LEGENDARY_AMBASSADOR', 'EXPERIENCE')
ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- 3. Row-Level Security (RLS) Policies
-- ==============================================================================

ALTER TABLE public.referral_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_point_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_rewards_catalog ENABLE ROW LEVEL SECURITY;

-- RLS: Referral Codes
CREATE POLICY "Users can view their own referral code"
  ON public.referral_codes FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Public lookup for referral code validation"
  ON public.referral_codes FOR SELECT
  USING (TRUE);

CREATE POLICY "Users can create their own referral code"
  ON public.referral_codes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their referral stats"
  ON public.referral_codes FOR UPDATE
  USING (auth.uid() = user_id OR public.is_admin());

-- RLS: Member Referrals
CREATE POLICY "Referrers and referred users can view referral records"
  ON public.member_referrals FOR SELECT
  USING (auth.uid() = referrer_id OR auth.uid() = referred_user_id OR public.is_admin());

CREATE POLICY "Users can insert referral attributions"
  ON public.member_referrals FOR INSERT
  WITH CHECK (auth.uid() = referred_user_id);

-- RLS: Member Contributions
CREATE POLICY "Users can view their own contributions"
  ON public.member_contributions FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can insert their own contributions"
  ON public.member_contributions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS: Loyalty Accounts
CREATE POLICY "Users can view their own loyalty account"
  ON public.loyalty_accounts FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "System can initialize or manage loyalty accounts"
  ON public.loyalty_accounts FOR ALL
  USING (auth.uid() = user_id OR public.is_admin());

-- RLS: Loyalty Point Transactions
CREATE POLICY "Users can view their own points transactions"
  ON public.loyalty_point_transactions FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

-- RLS: Rewards Catalog
CREATE POLICY "Everyone can view active rewards catalog"
  ON public.loyalty_rewards_catalog FOR SELECT
  USING (is_active = TRUE OR public.is_admin());

-- ==============================================================================
-- 4. Core Business Logic Procedures & Triggers
-- ==============================================================================

-- Core Function: Award or Deduct Loyalty Points with Atomic Tier Calculation
CREATE OR REPLACE FUNCTION public.award_loyalty_points(
  p_user_id UUID,
  p_event points_event_type,
  p_points INTEGER,
  p_description TEXT,
  p_reference_id TEXT DEFAULT NULL
)
RETURNS TABLE (
  new_balance INTEGER,
  lifetime_pts INTEGER,
  tier loyalty_tier
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_account RECORD;
  v_new_balance INTEGER;
  v_new_lifetime INTEGER;
  v_new_tier loyalty_tier;
BEGIN
  -- Ensure loyalty account exists
  INSERT INTO public.loyalty_accounts (user_id, current_balance, lifetime_points, current_tier)
  VALUES (p_user_id, 0, 0, 'SCOUT')
  ON CONFLICT (user_id) DO NOTHING;

  -- Lock account row for update
  SELECT * INTO v_account
  FROM public.loyalty_accounts
  WHERE user_id = p_user_id
  FOR UPDATE;

  -- Calculate new balances
  v_new_balance := v_account.current_balance + p_points;
  IF v_new_balance < 0 THEN
    RAISE EXCEPTION 'Insufficient loyalty points balance (Current: %, Required: %)', v_account.current_balance, ABS(p_points);
  END IF;

  IF p_points > 0 THEN
    v_new_lifetime := v_account.lifetime_points + p_points;
  ELSE
    v_new_lifetime := v_account.lifetime_points;
  END IF;

  -- Determine Loyalty Tier based on Lifetime Points
  IF v_new_lifetime >= 10000 THEN
    v_new_tier := 'LEGENDARY_AMBASSADOR';
  ELSIF v_new_lifetime >= 2500 THEN
    v_new_tier := 'CAPTAIN';
  ELSIF v_new_lifetime >= 500 THEN
    v_new_tier := 'VANGUARD';
  ELSE
    v_new_tier := 'SCOUT';
  END IF;

  -- Update Account
  UPDATE public.loyalty_accounts
  SET
    current_balance = v_new_balance,
    lifetime_points = v_new_lifetime,
    current_tier = v_new_tier,
    tier_updated_at = CASE WHEN current_tier IS DISTINCT FROM v_new_tier THEN TIMEZONE('utc', NOW()) ELSE tier_updated_at END,
    updated_at = TIMEZONE('utc', NOW())
  WHERE user_id = p_user_id;

  -- Insert immutable ledger transaction
  INSERT INTO public.loyalty_point_transactions (
    user_id,
    event_type,
    points,
    balance_after,
    description,
    reference_id
  )
  VALUES (
    p_user_id,
    p_event,
    p_points,
    v_new_balance,
    p_description,
    p_reference_id
  );

  RETURN QUERY
  SELECT v_new_balance, v_new_lifetime, v_new_tier;
END;
$$;

-- Trigger: When Contribution is Completed, Award 10 Points per $1 Contributed
CREATE OR REPLACE FUNCTION public.handle_contribution_points()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_points INTEGER;
BEGIN
  IF NEW.status = 'COMPLETED' AND (OLD.status IS DISTINCT FROM 'COMPLETED') THEN
    -- 10 points per 1 unit of currency (e.g. $1000 = 10,000 points)
    v_points := FLOOR(NEW.amount * 10)::INTEGER;

    PERFORM public.award_loyalty_points(
      NEW.user_id,
      'CONTRIBUTION_PLEDGED',
      v_points,
      format('Pledged %s %s to %s', NEW.currency, NEW.amount, NEW.target_asset_name),
      NEW.id::text
    );
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_contribution_completed ON public.member_contributions;
CREATE TRIGGER on_contribution_completed
  AFTER INSERT OR UPDATE OF status ON public.member_contributions
  FOR EACH ROW EXECUTE FUNCTION public.handle_contribution_points();

-- Trigger Enhancement: When KYC is Verified, Qualify Referral and Award Points
CREATE OR REPLACE FUNCTION public.handle_kyc_referral_reward()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_referral RECORD;
BEGIN
  IF NEW.status = 'VERIFIED' AND (OLD.status IS DISTINCT FROM 'VERIFIED') THEN
    -- 1. Award 250 points to verified user for completing KYC
    PERFORM public.award_loyalty_points(
      NEW.user_id,
      'KYC_VERIFIED',
      250,
      'Identity & Biometric KYC Verification Verified'
    );

    -- 2. Check if this member was referred by someone
    SELECT * INTO v_referral
    FROM public.member_referrals
    WHERE referred_user_id = NEW.user_id AND status = 'PENDING_KYC';

    IF FOUND THEN
      -- Mark referral as QUALIFIED and award 500 points to referrer
      UPDATE public.member_referrals
      SET
        status = 'QUALIFIED',
        rewarded_at = TIMEZONE('utc', NOW()),
        updated_at = TIMEZONE('utc', NOW())
      WHERE id = v_referral.id;

      -- Increment qualified count on referrer's code
      UPDATE public.referral_codes
      SET qualified_referrals = qualified_referrals + 1
      WHERE user_id = v_referral.referrer_id;

      -- Award 500 points to the referrer
      PERFORM public.award_loyalty_points(
        v_referral.referrer_id,
        'REFERRAL_QUALIFIED',
        v_referral.reward_points,
        'Successful referral verified via AI KYC',
        NEW.user_id::text
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_kyc_verified_referral ON public.kyc_submissions;
CREATE TRIGGER on_kyc_verified_referral
  AFTER UPDATE OF status ON public.kyc_submissions
  FOR EACH ROW EXECUTE FUNCTION public.handle_kyc_referral_reward();

-- Function: Redeem Reward with Points
CREATE OR REPLACE FUNCTION public.redeem_loyalty_reward(
  p_reward_id TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_reward RECORD;
  v_account RECORD;
  v_user_id UUID := auth.uid();
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required.';
  END IF;

  -- Fetch reward
  SELECT * INTO v_reward
  FROM public.loyalty_rewards_catalog
  WHERE id = p_reward_id AND is_active = TRUE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Reward not found or inactive.';
  END IF;

  -- Fetch user loyalty account
  SELECT * INTO v_account
  FROM public.loyalty_accounts
  WHERE user_id = v_user_id;

  IF v_account IS NULL OR v_account.current_balance < v_reward.points_cost THEN
    RAISE EXCEPTION 'Insufficient points balance.';
  END IF;

  -- Deduct points and record transaction
  PERFORM public.award_loyalty_points(
    v_user_id,
    'POINTS_REDEEMED',
    -v_reward.points_cost,
    format('Redeemed reward: %s', v_reward.title),
    p_reward_id
  );

  RETURN jsonb_build_object(
    'success', TRUE,
    'reward_id', v_reward.id,
    'reward_title', v_reward.title,
    'points_deducted', v_reward.points_cost
  );
END;
$$;
