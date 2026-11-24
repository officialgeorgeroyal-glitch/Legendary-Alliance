export interface CountryOption {
  code: string;
  name: string;
  region: 'North Africa' | 'West Africa' | 'East Africa' | 'Central Africa' | 'Southern Africa' | 'Diaspora';
}

export const AFRICAN_COUNTRIES: CountryOption[] = [
  // West Africa
  { code: 'NG', name: 'Nigeria', region: 'West Africa' },
  { code: 'GH', name: 'Ghana', region: 'West Africa' },
  { code: 'SN', name: 'Senegal', region: 'West Africa' },
  { code: 'CI', name: "Côte d'Ivoire", region: 'West Africa' },
  { code: 'CM', name: 'Cameroon', region: 'West Africa' },
  { code: 'ML', name: 'Mali', region: 'West Africa' },
  { code: 'GN', name: 'Guinea', region: 'West Africa' },
  { code: 'BF', name: 'Burkina Faso', region: 'West Africa' },
  { code: 'SL', name: 'Sierra Leone', region: 'West Africa' },
  { code: 'LR', name: 'Liberia', region: 'West Africa' },
  { code: 'TG', name: 'Togo', region: 'West Africa' },
  { code: 'BJ', name: 'Benin', region: 'West Africa' },
  { code: 'GM', name: 'Gambia', region: 'West Africa' },
  { code: 'CV', name: 'Cape Verde', region: 'West Africa' },
  { code: 'GW', name: 'Guinea-Bissau', region: 'West Africa' },
  { code: 'NE', name: 'Niger', region: 'West Africa' },

  // North Africa
  { code: 'MA', name: 'Morocco', region: 'North Africa' },
  { code: 'EG', name: 'Egypt', region: 'North Africa' },
  { code: 'DZ', name: 'Algeria', region: 'North Africa' },
  { code: 'TN', name: 'Tunisia', region: 'North Africa' },
  { code: 'LY', name: 'Libya', region: 'North Africa' },
  { code: 'SD', name: 'Sudan', region: 'North Africa' },
  { code: 'MR', name: 'Mauritania', region: 'North Africa' },

  // East Africa
  { code: 'KE', name: 'Kenya', region: 'East Africa' },
  { code: 'ET', name: 'Ethiopia', region: 'East Africa' },
  { code: 'TZ', name: 'Tanzania', region: 'East Africa' },
  { code: 'UG', name: 'Uganda', region: 'East Africa' },
  { code: 'RW', name: 'Rwanda', region: 'East Africa' },
  { code: 'BI', name: 'Burundi', region: 'East Africa' },
  { code: 'SO', name: 'Somalia', region: 'East Africa' },
  { code: 'ER', name: 'Eritrea', region: 'East Africa' },
  { code: 'DJ', name: 'Djibouti', region: 'East Africa' },
  { code: 'SS', name: 'South Sudan', region: 'East Africa' },

  // Central Africa
  { code: 'CD', name: 'DR Congo', region: 'Central Africa' },
  { code: 'CG', name: 'Republic of the Congo', region: 'Central Africa' },
  { code: 'GA', name: 'Gabon', region: 'Central Africa' },
  { code: 'GQ', name: 'Equatorial Guinea', region: 'Central Africa' },
  { code: 'CF', name: 'Central African Republic', region: 'Central Africa' },
  { code: 'TD', name: 'Chad', region: 'Central Africa' },
  { code: 'ST', name: 'São Tomé and Príncipe', region: 'Central Africa' },

  // Southern Africa
  { code: 'ZA', name: 'South Africa', region: 'Southern Africa' },
  { code: 'ZW', name: 'Zimbabwe', region: 'Southern Africa' },
  { code: 'ZM', name: 'Zambia', region: 'Southern Africa' },
  { code: 'MZ', name: 'Mozambique', region: 'Southern Africa' },
  { code: 'AO', name: 'Angola', region: 'Southern Africa' },
  { code: 'NA', name: 'Namibia', region: 'Southern Africa' },
  { code: 'BW', name: 'Botswana', region: 'Southern Africa' },
  { code: 'MW', name: 'Malawi', region: 'Southern Africa' },
  { code: 'MU', name: 'Mauritius', region: 'Southern Africa' },
  { code: 'MG', name: 'Madagascar', region: 'Southern Africa' },

  // Global African Diaspora
  { code: 'JM', name: 'Jamaica (Afro-Caribbean)', region: 'Diaspora' },
  { code: 'TT', name: 'Trinidad and Tobago (Afro-Caribbean)', region: 'Diaspora' },
  { code: 'HT', name: 'Haiti (Afro-Caribbean)', region: 'Diaspora' },
  { code: 'BR-AF', name: 'Afro-Brazilian Heritage', region: 'Diaspora' },
  { code: 'US-AF', name: 'African-American Heritage', region: 'Diaspora' },
  { code: 'UK-AF', name: 'Black British / Afro-European Heritage', region: 'Diaspora' },
  { code: 'FR-AF', name: 'Afro-French Heritage', region: 'Diaspora' },
  { code: 'CA-AF', name: 'Afro-Canadian Heritage', region: 'Diaspora' },
];

export const RESIDENCE_COUNTRIES = [
  { code: 'GB', name: 'United Kingdom' },
  { code: 'US', name: 'United States' },
  { code: 'FR', name: 'France' },
  { code: 'DE', name: 'Germany' },
  { code: 'ES', name: 'Spain' },
  { code: 'IT', name: 'Italy' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'BE', name: 'Belgium' },
  { code: 'CA', name: 'Canada' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'QA', name: 'Qatar' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'GH', name: 'Ghana' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'KE', name: 'Kenya' },
  { code: 'SN', name: 'Senegal' },
  { code: 'CI', name: "Côte d'Ivoire" },
  { code: 'MA', name: 'Morocco' },
  { code: 'EG', name: 'Egypt' },
  { code: 'RW', name: 'Rwanda' },
  { code: 'TR', name: 'Turkey' },
  { code: 'PT', name: 'Portugal' },
  { code: 'CH', name: 'Switzerland' },
];
