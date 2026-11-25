export type AssetCategory =
  | 'Football Club'
  | 'Training Facility'
  | 'Hospitality Venue'
  | 'Football Technology';

export type ProposalStatus = 'Active Vote' | 'Due Diligence' | 'Approved';

export type VoteChoice = 'for' | 'against';

export interface AssetProposal {
  id: string;
  title: string;
  category: AssetCategory;
  location: string;
  targetBudgetEur: number;
  summary: string;
  proposedBy: string;
  status: ProposalStatus;
  votesFor: number;
  votesAgainst: number;
  userVote?: VoteChoice | null;
  createdAt: string;
  imageUrl: string;
}

export interface KeyValueStorageAdapter {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export const PROPOSALS_STORAGE_KEY = 'legendary_alliance_proposals_v1';

export const CATEGORY_IMAGE_MAP: Record<AssetCategory, string> = {
  'Football Club': '/images/news-club.svg',
  'Training Facility': '/images/news-academy.svg',
  'Hospitality Venue': '/images/news-hospitality.svg',
  'Football Technology': '/images/alliance-hero.svg',
};

export const SEED_PROPOSALS: AssetProposal[] = [
  {
    id: 'PROP-201',
    title: 'Majority Stake in Portuguese Liga 3 Community Club',
    category: 'Football Club',
    location: 'Lisbon District, Portugal',
    targetBudgetEur: 1850000,
    summary:
      'Acquire a 65% controlling equity stake via regulated SPV, retaining existing academy pathways and matchday stadium concession rights.',
    proposedBy: 'George Royal',
    status: 'Active Vote',
    votesFor: 142,
    votesAgainst: 19,
    userVote: null,
    createdAt: '2026-11-24',
    imageUrl: '/images/news-club.svg',
  },
  {
    id: 'PROP-202',
    title: 'West African High-Performance Youth & Scouting Complex',
    category: 'Training Facility',
    location: 'Accra, Ghana',
    targetBudgetEur: 920000,
    summary:
      'Develop two FIFA-standard artificial turf pitches, sports science lab, and residential dormitories for U17-U21 talent.',
    proposedBy: 'Kofi Mensah',
    status: 'Active Vote',
    votesFor: 118,
    votesAgainst: 12,
    userVote: null,
    createdAt: '2026-11-23',
    imageUrl: '/images/news-academy.svg',
  },
  {
    id: 'PROP-203',
    title: 'Matchday VIP Hospitality & Fan Experience Lounge Network',
    category: 'Hospitality Venue',
    location: 'Porto & Lisbon, Portugal',
    targetBudgetEur: 480000,
    summary:
      'Build revenue-sharing matchday hospitality suites with member ticket allocations and corporate sponsorship packages.',
    proposedBy: 'Mariam Diallo',
    status: 'Due Diligence',
    votesFor: 94,
    votesAgainst: 21,
    userVote: null,
    createdAt: '2026-11-21',
    imageUrl: '/images/news-hospitality.svg',
  },
  {
    id: 'PROP-204',
    title: 'AI Optical Match Tracking & Biometric Telemetry Platform',
    category: 'Football Technology',
    location: 'Remote / European Partner Clubs',
    targetBudgetEur: 310000,
    summary:
      'Deploy automated multi-camera tactical analytics and injury-prevention telemetry across all Alliance partner clubs.',
    proposedBy: 'David Okafor',
    status: 'Approved',
    votesFor: 176,
    votesAgainst: 8,
    userVote: 'for',
    createdAt: '2026-11-18',
    imageUrl: '/images/alliance-hero.svg',
  },
];

export function calculateApprovalPercentage(votesFor: number, votesAgainst: number): number {
  const total = votesFor + votesAgainst;
  if (total <= 0) return 0;
  return Math.round((votesFor / total) * 100);
}

export function applyMemberVote(
  proposals: AssetProposal[],
  proposalId: string,
  choice: VoteChoice
): AssetProposal[] {
  return proposals.map((item) => {
    if (item.id !== proposalId) return item;

    let votesFor = item.votesFor;
    let votesAgainst = item.votesAgainst;

    // Undo previous vote if switching or toggling off
    if (item.userVote === 'for') votesFor = Math.max(0, votesFor - 1);
    if (item.userVote === 'against') votesAgainst = Math.max(0, votesAgainst - 1);

    if (item.userVote === choice) {
      return { ...item, votesFor, votesAgainst, userVote: null };
    }

    if (choice === 'for') votesFor += 1;
    if (choice === 'against') votesAgainst += 1;

    return { ...item, votesFor, votesAgainst, userVote: choice };
  });
}

export function loadProposals(storage?: KeyValueStorageAdapter): AssetProposal[] {
  if (!storage) return SEED_PROPOSALS;
  try {
    const raw = storage.getItem(PROPOSALS_STORAGE_KEY);
    if (!raw) return SEED_PROPOSALS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : SEED_PROPOSALS;
  } catch {
    return SEED_PROPOSALS;
  }
}

export function saveProposals(proposals: AssetProposal[], storage?: KeyValueStorageAdapter): void {
  if (!storage) return;
  try {
    storage.setItem(PROPOSALS_STORAGE_KEY, JSON.stringify(proposals));
  } catch {
    // Ignore storage quota errors
  }
}

export function resetProposals(storage?: KeyValueStorageAdapter): AssetProposal[] {
  if (storage) {
    try {
      storage.removeItem(PROPOSALS_STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }
  }
  return SEED_PROPOSALS;
}