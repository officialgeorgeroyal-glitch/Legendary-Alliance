export type NewsCategory =
  | 'Club Acquisitions'
  | 'Training Facilities'
  | 'Hospitality'
  | 'Football Tech'
  | 'Alliance Updates';

export interface NewsBrief {
  id: string;
  title: string;
  category: NewsCategory;
  summary: string;
  imageUrl: string;
  publishedAt: string;
  featured?: boolean;
}

export interface KeyValueStorageAdapter {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export const NEWS_STORAGE_KEY = 'legendary_alliance_news_v1';

export const SEED_NEWS_BRIEFS: NewsBrief[] = [
  {
    id: 'NEWS-101',
    title: 'Q4 Member Vote Opens on Iberian & West African Academy Sites',
    category: 'Training Facilities',
    summary:
      'Verified members can now review architectural feasibility briefs and pitch specifications for two regional youth development hubs.',
    imageUrl: '/images/news-academy.svg',
    publishedAt: '2026-11-25',
    featured: true,
  },
  {
    id: 'NEWS-102',
    title: 'Shortlist Narrowed to Three Second-Tier Club Acquisition Targets',
    category: 'Club Acquisitions',
    summary:
      'Due diligence dossiers covering stadium lease terms, squad valuation, and broadcast revenue splits are ready for member review.',
    imageUrl: '/images/news-club.svg',
    publishedAt: '2026-11-24',
    featured: true,
  },
  {
    id: 'NEWS-103',
    title: 'Matchday Hospitality & Biometric Scouting Tech Pilot Approved',
    category: 'Hospitality',
    summary:
      'Pilot rollout combines VIP matchday lounge revenue sharing with wearable player telemetry across partner academies.',
    imageUrl: '/images/news-hospitality.svg',
    publishedAt: '2026-11-22',
    featured: false,
  },
];

export function loadNewsBriefs(storage?: KeyValueStorageAdapter): NewsBrief[] {
  if (!storage) return SEED_NEWS_BRIEFS;
  try {
    const raw = storage.getItem(NEWS_STORAGE_KEY);
    if (!raw) return SEED_NEWS_BRIEFS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : SEED_NEWS_BRIEFS;
  } catch {
    return SEED_NEWS_BRIEFS;
  }
}

export function saveNewsBriefs(briefs: NewsBrief[], storage?: KeyValueStorageAdapter): void {
  if (!storage) return;
  try {
    storage.setItem(NEWS_STORAGE_KEY, JSON.stringify(briefs));
  } catch {
    // Ignore storage quota errors
  }
}

export function resetNewsBriefs(storage?: KeyValueStorageAdapter): NewsBrief[] {
  if (storage) {
    try {
      storage.removeItem(NEWS_STORAGE_KEY);
    } catch {
      // Ignore storage removal errors
    }
  }
  return SEED_NEWS_BRIEFS;
}