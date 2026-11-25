export type ChatChannelId = 'general' | 'club-scouting' | 'hospitality-tech';

export interface ChatMessage {
  id: string;
  channel: ChatChannelId;
  senderName: string;
  senderRole: string;
  text: string;
  sentAt: string;
}

export interface LiveConferenceRoom {
  id: string;
  title: string;
  hostName: string;
  topic: string;
  scheduledTime: string;
  status: 'Live Now' | 'Upcoming';
  attendeesCount: number;
  joined?: boolean;
}

export interface BusinessNewsletter {
  id: string;
  issueNumber: string;
  title: string;
  quarter: string;
  summary: string;
  keyTakeaways: string[];
  publishedAt: string;
}

export interface CommunityStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export const CHAT_STORAGE_KEY = 'legendary_alliance_chat_v1';
export const CONFERENCES_STORAGE_KEY = 'legendary_alliance_conferences_v1';
export const NEWSLETTER_SUBS_STORAGE_KEY = 'legendary_alliance_newsletter_subs_v1';

export const SEED_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'MSG-301',
    channel: 'general',
    senderName: 'George Royal',
    senderRole: 'Founder · Lisbon',
    text: 'Welcome to the Alliance general lounge! Share feedback on the Q4 club acquisition and academy proposals.',
    sentAt: '17:15',
  },
  {
    id: 'MSG-302',
    channel: 'general',
    senderName: 'Mariam Diallo',
    senderRole: 'Hospitality Lead',
    text: 'The Lisbon & Porto matchday hospitality term sheets are uploaded and ready for member review.',
    sentAt: '17:28',
  },
  {
    id: 'MSG-303',
    channel: 'club-scouting',
    senderName: 'Kofi Mensah',
    senderRole: 'West Africa Scouting',
    text: 'Accra U19 showcase roster confirmed—14 midfielders and wingers tagged for optical telemetry trials.',
    sentAt: '16:40',
  },
  {
    id: 'MSG-304',
    channel: 'hospitality-tech',
    senderName: 'David Okafor',
    senderRole: 'Sports Tech Advisor',
    text: 'Biometric wearable API latency benchmarked under 180ms during live pitch testing.',
    sentAt: '15:55',
  },
];

export const SEED_CONFERENCES: LiveConferenceRoom[] = [
  {
    id: 'CONF-01',
    title: 'Q4 Iberian Club Acquisition Due Diligence Briefing',
    hostName: 'George Royal',
    topic: 'SPV Equity & Stadium Concession Review',
    scheduledTime: 'Live Now · Room A',
    status: 'Live Now',
    attendeesCount: 38,
    joined: false,
  },
  {
    id: 'CONF-02',
    title: 'West African Youth Academy Architecture & Turf Roundtable',
    hostName: 'Kofi Mensah',
    topic: 'Accra Hub Construction Timeline',
    scheduledTime: 'Tomorrow · 19:00 WET',
    status: 'Upcoming',
    attendeesCount: 24,
    joined: false,
  },
  {
    id: 'CONF-03',
    title: 'Matchday VIP Hospitality & Telemetry Revenue Workshop',
    hostName: 'Mariam Diallo',
    topic: 'Member Ticket & Sponsor Yield',
    scheduledTime: 'Friday · 18:30 WET',
    status: 'Upcoming',
    attendeesCount: 19,
    joined: false,
  },
];

export const BUSINESS_NEWSLETTERS: BusinessNewsletter[] = [
  {
    id: 'NWSL-12',
    issueNumber: 'Issue #12',
    title: 'Multi-Club Ownership Valuations & Matchday Hospitality Yields',
    quarter: 'Q4 2026',
    summary:
      'Executive breakdown of second-tier European club acquisition multiples, academy transfer solidarity clauses, and VIP lounge margins.',
    keyTakeaways: [
      'Targeted SPV equity entry between EUR 1.5M and EUR 2.2M with stadium hospitality control.',
      'Youth academy solidarity fees projected to offset 35% of annual operating overhead by Year 3.',
    ],
    publishedAt: '2026-11-24',
  },
  {
    id: 'NWSL-11',
    issueNumber: 'Issue #11',
    title: 'Sports Telemetry & Biometric Scouting Economics for Emerging Academies',
    quarter: 'Q4 2026',
    summary:
      'How automated optical match tracking increases player transfer visibility across European scouting networks.',
    keyTakeaways: [
      'Verified match video + GPS workload metrics raise scout conversion by 2.4x.',
      'Shared licensing across all Legendary Alliance partner facilities.',
    ],
    publishedAt: '2026-11-10',
  },
];

export function loadChatMessages(storage?: CommunityStorage): ChatMessage[] {
  if (!storage) return SEED_CHAT_MESSAGES;
  try {
    const raw = storage.getItem(CHAT_STORAGE_KEY);
    if (!raw) return SEED_CHAT_MESSAGES;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : SEED_CHAT_MESSAGES;
  } catch {
    return SEED_CHAT_MESSAGES;
  }
}

export function saveChatMessages(messages: ChatMessage[], storage?: CommunityStorage): void {
  if (!storage) return;
  try {
    storage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
  } catch {
    // Ignore storage quota errors
  }
}

export function loadConferences(storage?: CommunityStorage): LiveConferenceRoom[] {
  if (!storage) return SEED_CONFERENCES;
  try {
    const raw = storage.getItem(CONFERENCES_STORAGE_KEY);
    if (!raw) return SEED_CONFERENCES;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : SEED_CONFERENCES;
  } catch {
    return SEED_CONFERENCES;
  }
}

export function saveConferences(rooms: LiveConferenceRoom[], storage?: CommunityStorage): void {
  if (!storage) return;
  try {
    storage.setItem(CONFERENCES_STORAGE_KEY, JSON.stringify(rooms));
  } catch {
    // Ignore storage quota errors
  }
}

export function resetCommunityHub(storage?: CommunityStorage): {
  messages: ChatMessage[];
  rooms: LiveConferenceRoom[];
} {
  if (storage) {
    try {
      storage.removeItem(CHAT_STORAGE_KEY);
      storage.removeItem(CONFERENCES_STORAGE_KEY);
      storage.removeItem(NEWSLETTER_SUBS_STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }
  }
  return { messages: SEED_CHAT_MESSAGES, rooms: SEED_CONFERENCES };
}