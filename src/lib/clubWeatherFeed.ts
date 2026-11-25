export interface ClubFollowItem {
  id: string;
  name: string;
  type: 'Club' | 'National Team';
  leagueOrConfederation: string;
  city: string;
  country: string;
  followed: boolean;
}

export interface TeamNewsItem {
  id: string;
  teamId: string;
  teamName: string;
  headline: string;
  tag: 'Transfer & Scouting' | 'Matchday' | 'Academy' | 'Governance';
  publishedAt: string;
  summary: string;
}

export interface CityWeatherSnapshot {
  city: string;
  country: string;
  tempCelsius: number;
  condition: string;
  humidityPercent: number;
  windKmh: number;
  pitchStatus: 'Optimal Pitch Conditions' | 'Light Drizzle / Fast Turf' | 'Warm Evening Match';
}

export interface ClubWeatherStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export const FOLLOWED_TEAMS_STORAGE_KEY = 'legendary_alliance_followed_teams_v1';

export const SEED_TEAMS: ClubFollowItem[] = [
  {
    id: 'TEAM-SLB',
    name: 'SL Benfica',
    type: 'Club',
    leagueOrConfederation: 'Primeira Liga',
    city: 'Lisbon',
    country: 'Portugal',
    followed: true,
  },
  {
    id: 'TEAM-SCP',
    name: 'Sporting CP',
    type: 'Club',
    leagueOrConfederation: 'Primeira Liga',
    city: 'Lisbon',
    country: 'Portugal',
    followed: true,
  },
  {
    id: 'TEAM-POR',
    name: 'Portugal National Team',
    type: 'National Team',
    leagueOrConfederation: 'UEFA',
    city: 'Lisbon',
    country: 'Portugal',
    followed: true,
  },
  {
    id: 'TEAM-NGA',
    name: 'Nigeria Super Eagles',
    type: 'National Team',
    leagueOrConfederation: 'CAF',
    city: 'Lagos',
    country: 'Nigeria',
    followed: true,
  },
  {
    id: 'TEAM-GHA',
    name: 'Ghana Black Stars',
    type: 'National Team',
    leagueOrConfederation: 'CAF',
    city: 'Accra',
    country: 'Ghana',
    followed: false,
  },
  {
    id: 'TEAM-FCP',
    name: 'FC Porto',
    type: 'Club',
    leagueOrConfederation: 'Primeira Liga',
    city: 'Porto',
    country: 'Portugal',
    followed: false,
  },
];

export const SEED_TEAM_NEWS: TeamNewsItem[] = [
  {
    id: 'TNEWS-01',
    teamId: 'TEAM-SLB',
    teamName: 'SL Benfica',
    headline: 'Seixal Youth Academy Hosts European Scouting & Analytics Showcase',
    tag: 'Academy',
    publishedAt: '2026-11-25',
    summary:
      'U19 technical staff demonstrated optical player-tracking benchmarks ahead of winter squad registration.',
  },
  {
    id: 'TNEWS-02',
    teamId: 'TEAM-POR',
    teamName: 'Portugal National Team',
    headline: 'Lisbon Training Camp Schedule & International Friendly Window Confirmed',
    tag: 'Matchday',
    publishedAt: '2026-11-25',
    summary:
      'National selectors finalized fitness and recovery protocols at Cidade do Futebol for upcoming fixtures.',
  },
  {
    id: 'TNEWS-03',
    teamId: 'TEAM-NGA',
    teamName: 'Nigeria Super Eagles',
    headline: 'West African Talent Pathway & Diaspora Scouting Initiative Expanded',
    tag: 'Transfer & Scouting',
    publishedAt: '2026-11-24',
    summary:
      'Regional scouts highlighted top U20 midfielders graduating from domestic academies into European leagues.',
  },
  {
    id: 'TNEWS-04',
    teamId: 'TEAM-SCP',
    teamName: 'Sporting CP',
    headline: 'Alvalade Matchday Hospitality & Digital Ticketing Upgrade Rolled Out',
    tag: 'Governance',
    publishedAt: '2026-11-23',
    summary:
      'Enhanced supporter engagement zones and matchday analytics displays introduced for season ticket holders.',
  },
];

export const CITY_WEATHER_CATALOG: CityWeatherSnapshot[] = [
  {
    city: 'Lisbon',
    country: 'Portugal',
    tempCelsius: 16,
    condition: 'Partly Cloudy · Atlantic Breeze',
    humidityPercent: 68,
    windKmh: 18,
    pitchStatus: 'Optimal Pitch Conditions',
  },
  {
    city: 'Porto',
    country: 'Portugal',
    tempCelsius: 14,
    condition: 'Light Coastal Mist',
    humidityPercent: 79,
    windKmh: 21,
    pitchStatus: 'Light Drizzle / Fast Turf',
  },
  {
    city: 'Lagos',
    country: 'Nigeria',
    tempCelsius: 29,
    condition: 'Clear Coastal Evening',
    humidityPercent: 74,
    windKmh: 14,
    pitchStatus: 'Warm Evening Match',
  },
  {
    city: 'Accra',
    country: 'Ghana',
    tempCelsius: 28,
    condition: 'Warm & Breezy',
    humidityPercent: 72,
    windKmh: 16,
    pitchStatus: 'Warm Evening Match',
  },
];

export function toggleTeamFollow(teams: ClubFollowItem[], teamId: string): ClubFollowItem[] {
  return teams.map((team) =>
    team.id === teamId ? { ...team, followed: !team.followed } : team
  );
}

export function loadFollowedTeams(storage?: ClubWeatherStorage): ClubFollowItem[] {
  if (!storage) return SEED_TEAMS;
  try {
    const raw = storage.getItem(FOLLOWED_TEAMS_STORAGE_KEY);
    if (!raw) return SEED_TEAMS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : SEED_TEAMS;
  } catch {
    return SEED_TEAMS;
  }
}

export function saveFollowedTeams(teams: ClubFollowItem[], storage?: ClubWeatherStorage): void {
  if (!storage) return;
  try {
    storage.setItem(FOLLOWED_TEAMS_STORAGE_KEY, JSON.stringify(teams));
  } catch {
    // Ignore storage quota errors
  }
}

export function resetFollowedTeams(storage?: ClubWeatherStorage): ClubFollowItem[] {
  if (storage) {
    try {
      storage.removeItem(FOLLOWED_TEAMS_STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }
  }
  return SEED_TEAMS;
}