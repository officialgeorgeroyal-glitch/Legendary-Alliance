export interface ClubOption {
  id: string;
  name: string;
  country: string;
  league: string;
}

export const POPULAR_AFRICAN_CLUBS: ClubOption[] = [
  { id: 'al-ahly', name: 'Al Ahly SC', country: 'Egypt', league: 'Egyptian Premier League' },
  { id: 'zamalek', name: 'Zamalek SC', country: 'Egypt', league: 'Egyptian Premier League' },
  { id: 'raja-casablanca', name: 'Raja Club Athletic', country: 'Morocco', league: 'Botola Pro' },
  { id: 'wydad-ac', name: 'Wydad Athletic Club', country: 'Morocco', league: 'Botola Pro' },
  { id: 'mamelodi-sundowns', name: 'Mamelodi Sundowns', country: 'South Africa', league: 'PSL' },
  { id: 'orlando-pirates', name: 'Orlando Pirates', country: 'South Africa', league: 'PSL' },
  { id: 'kaizer-chiefs', name: 'Kaizer Chiefs', country: 'South Africa', league: 'PSL' },
  { id: 'tp-mazembe', name: 'TP Mazembe', country: 'DR Congo', league: 'Linafoot' },
  { id: 'esperance-tunis', name: 'Espérance Sportive de Tunis', country: 'Tunisia', league: 'CLP-1' },
  { id: 'enyimba', name: 'Enyimba International FC', country: 'Nigeria', league: 'NPFL' },
  { id: 'rivers-united', name: 'Rivers United FC', country: 'Nigeria', league: 'NPFL' },
  { id: 'hearts-of-oak', name: 'Accra Hearts of Oak', country: 'Ghana', league: 'GPL' },
  { id: 'asante-kotoko', name: 'Asante Kotoko SC', country: 'Ghana', league: 'GPL' },
  { id: 'asec-mimosas', name: 'ASEC Mimosas', country: "Côte d'Ivoire", league: 'Ligue 1' },
  { id: 'cotonsport', name: 'Coton Sport FC', country: 'Cameroon', league: 'Elite One' },
  { id: 'simba-sc', name: 'Simba SC', country: 'Tanzania', league: 'Ligi Kuu Bara' },
  { id: 'young-africans', name: 'Young Africans SC (Yanga)', country: 'Tanzania', league: 'Ligi Kuu Bara' },
  { id: 'gor-mahia', name: 'Gor Mahia FC', country: 'Kenya', league: 'FKF Premier League' },
];

export const POPULAR_GLOBAL_CLUBS: ClubOption[] = [
  { id: 'real-madrid', name: 'Real Madrid CF', country: 'Spain', league: 'La Liga' },
  { id: 'barcelona', name: 'FC Barcelona', country: 'Spain', league: 'La Liga' },
  { id: 'arsenal', name: 'Arsenal FC', country: 'England', league: 'Premier League' },
  { id: 'chelsea', name: 'Chelsea FC', country: 'England', league: 'Premier League' },
  { id: 'man-city', name: 'Manchester City FC', country: 'England', league: 'Premier League' },
  { id: 'man-utd', name: 'Manchester United FC', country: 'England', league: 'Premier League' },
  { id: 'liverpool', name: 'Liverpool FC', country: 'England', league: 'Premier League' },
  { id: 'psg', name: 'Paris Saint-Germain', country: 'France', league: 'Ligue 1' },
  { id: 'marseille', name: 'Olympique de Marseille', country: 'France', league: 'Ligue 1' },
  { id: 'bayern', name: 'FC Bayern Munich', country: 'Germany', league: 'Bundesliga' },
  { id: 'bvb', name: 'Borussia Dortmund', country: 'Germany', league: 'Bundesliga' },
  { id: 'ac-milan', name: 'AC Milan', country: 'Italy', league: 'Serie A' },
  { id: 'inter-milan', name: 'Inter Milan', country: 'Italy', league: 'Serie A' },
  { id: 'juventus', name: 'Juventus FC', country: 'Italy', league: 'Serie A' },
  { id: 'al-nassr', name: 'Al-Nassr FC', country: 'Saudi Arabia', league: 'Saudi Pro League' },
  { id: 'al-hilal', name: 'Al-Hilal SFC', country: 'Saudi Arabia', league: 'Saudi Pro League' },
  { id: 'inter-miami', name: 'Inter Miami CF', country: 'USA', league: 'MLS' },
];

export const AFRICAN_NATIONAL_TEAMS = [
  { name: 'Nigeria', nickname: 'Super Eagles' },
  { name: 'Senegal', nickname: 'Lions of Teranga' },
  { name: 'Ghana', nickname: 'Black Stars' },
  { name: 'Morocco', nickname: 'Atlas Lions' },
  { name: 'Ivory Coast', nickname: 'The Elephants' },
  { name: 'Cameroon', nickname: 'Indomitable Lions' },
  { name: 'Egypt', nickname: 'The Pharaohs' },
  { name: 'Algeria', nickname: 'Desert Foxes' },
  { name: 'South Africa', nickname: 'Bafana Bafana' },
  { name: 'Tunisia', nickname: 'Eagles of Carthage' },
  { name: 'Mali', nickname: 'The Eagles' },
  { name: 'DR Congo', nickname: 'The Leopards' },
  { name: 'Burkina Faso', nickname: 'The Stallions' },
  { name: 'Guinea', nickname: 'Syli National' },
  { name: 'Zambia', nickname: 'Chipolopolo' },
  { name: 'Angola', nickname: 'Palancas Negras' },
  { name: 'Cape Verde', nickname: 'Blue Sharks' },
  { name: 'Kenya', nickname: 'Harambee Stars' },
  { name: 'Uganda', nickname: 'The Cranes' },
];
