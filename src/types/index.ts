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
