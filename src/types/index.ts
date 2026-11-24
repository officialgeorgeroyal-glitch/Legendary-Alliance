export type MemberRole = 'CURRENT_FOOTBALLER' | 'FORMER_FOOTBALLER' | 'ENTHUSIAST';

export type AccountTier = 'MEMBER' | 'LEGEND_ELITE' | 'ADMIN';

export type KYCStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

export type FootballerEligibilityStatus =
  | 'PENDING_KYC'
  | 'ELIGIBLE'
  | 'UNDER_ADMIN_REVIEW'
  | 'APPROVED'
  | 'REJECTED';

export interface UserProfile {
  id: string;
  full_name: string;
  phone_number?: string;
  role: MemberRole;
  country_of_residence: string;
  african_heritage_country: string;
  favorite_football_clubs: string[];
  african_national_team?: string;
  current_club?: string;
  former_clubs?: string;
  transfermarkt_url?: string;
  account_tier: AccountTier;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface TermsAcceptance {
  id: string;
  user_id: string;
  terms_version: string;
  club_nature_acknowledged: boolean;
  non_investment_acknowledged: boolean;
  proposal_framework_acknowledged: boolean;
  ip_address?: string;
  user_agent?: string;
  accepted_at: string;
}

export interface KYCSubmission {
  id: string;
  user_id: string;
  document_type: string;
  document_country: string;
  front_storage_path: string;
  back_storage_path?: string;
  selfie_storage_path: string;
  liveness_score?: number;
  face_match_score?: number;
  status: KYCStatus;
  rejection_reason?: string;
  verified_at?: string;
  created_at: string;
  updated_at: string;
}

export interface FootballerVerification {
  id: string;
  user_id: string;
  eligibility_status: FootballerEligibilityStatus;
  reviewed_by?: string;
  admin_notes?: string;
  reviewed_at?: string;
  created_at: string;
  updated_at: string;
  profile?: UserProfile;
}

export interface MemberBadge {
  id: string;
  user_id: string;
  badge_type: 'LEGEND_ELITE' | 'VERIFIED_MEMBER' | 'FOUNDING_MEMBER';
  title: string;
  awarded_at: string;
}

// ==============================================================================
// CONTRIBUTIONS, REFERRALS & LOYALTY TYPES
// ==============================================================================

export type ContributionType =
  | 'ASSET_PLEDGE'
  | 'ANNUAL_DUES'
  | 'FOUNDING_SYNDICATE'
  | 'COMMUNITY_PATRONAGE';

export type ContributionStatus = 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED';

export interface MemberContribution {
  id: string;
  user_id: string;
  contribution_type: ContributionType;
  target_asset_name: string;
  target_asset_id?: string;
  amount: number;
  currency: string;
  status: ContributionStatus;
  payment_method: string;
  transaction_reference: string;
  disclaimer_accepted: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
  user_profile?: Pick<UserProfile, 'full_name' | 'account_tier' | 'role'>;
}

export type ReferralStatus = 'PENDING_KYC' | 'QUALIFIED' | 'REWARDED' | 'INELIGIBLE';

export interface ReferralCode {
  id: string;
  user_id: string;
  code: string;
  clicks_count: number;
  total_signups: number;
  qualified_referrals: number;
  created_at: string;
  updated_at: string;
}

export interface MemberReferral {
  id: string;
  referrer_id: string;
  referred_user_id: string;
  referral_code: string;
  status: ReferralStatus;
  reward_points: number;
  rewarded_at?: string;
  created_at: string;
  updated_at: string;
  referred_profile?: Pick<UserProfile, 'full_name' | 'african_heritage_country' | 'role' | 'account_tier'>;
}

export type LoyaltyTier = 'SCOUT' | 'VANGUARD' | 'CAPTAIN' | 'LEGENDARY_AMBASSADOR';

export type PointsEventType =
  | 'ONBOARDING_COMPLETED'
  | 'KYC_VERIFIED'
  | 'REFERRAL_QUALIFIED'
  | 'ASSET_PROPOSAL_SUBMITTED'
  | 'ASSET_PROPOSAL_APPROVED'
  | 'CONTRIBUTION_PLEDGED'
  | 'GOVERNANCE_VOTE'
  | 'POINTS_REDEEMED';

export interface LoyaltyAccount {
  id: string;
  user_id: string;
  current_balance: number;
  lifetime_points: number;
  current_tier: LoyaltyTier;
  tier_updated_at: string;
  created_at: string;
  updated_at: string;
}

export interface LoyaltyPointTransaction {
  id: string;
  user_id: string;
  event_type: PointsEventType;
  points: number;
  balance_after: number;
  description: string;
  reference_id?: string;
  created_at: string;
}

export interface LoyaltyReward {
  id: string;
  title: string;
  description: string;
  points_cost: number;
  tier_requirement: LoyaltyTier;
  category: 'INTELLIGENCE' | 'ACCESS' | 'EVENT' | 'EXPERIENCE';
  is_active: boolean;
  created_at: string;
}

export interface ContributionSummary {
  totalPledgedUSD: number;
  contributionsCount: number;
  topAssetCategories: {
    category: string;
    amountUSD: number;
    percentage: number;
  }[];
}
