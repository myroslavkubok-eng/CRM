export interface District {
  id: string;
  name: string;
  emoji: string;
}

export interface City {
  id: string;
  name: string;
  country: string;
  emoji: string;
  districts: District[];
}

export const CITIES: City[] = [
  {
    id: 'dubai',
    name: 'Dubai',
    country: 'UAE',
    emoji: '🇦🇪',
    districts: [
      { id: 'downtown', name: 'Downtown Dubai', emoji: '🏙️' },
      { id: 'marina', name: 'Dubai Marina', emoji: '⚓' },
      { id: 'jbr', name: 'JBR', emoji: '🏖️' },
      { id: 'deira', name: 'Deira', emoji: '🕌' },
      { id: 'jumeirah', name: 'Jumeirah', emoji: '🏝️' },
      { id: 'business-bay', name: 'Business Bay', emoji: '🏢' },
      { id: 'silicon-oasis', name: 'Silicon Oasis', emoji: '💻' },
      { id: 'al-barsha', name: 'Al Barsha', emoji: '🌆' },
    ],
  },
  {
    id: 'new-york',
    name: 'New York',
    country: 'USA',
    emoji: '🇺🇸',
    districts: [
      { id: 'manhattan', name: 'Manhattan', emoji: '🗽' },
      { id: 'brooklyn', name: 'Brooklyn', emoji: '🌉' },
      { id: 'queens', name: 'Queens', emoji: '🏘️' },
      { id: 'bronx', name: 'Bronx', emoji: '🏢' },
      { id: 'staten-island', name: 'Staten Island', emoji: '🏝️' },
      { id: 'downtown', name: 'Downtown', emoji: '🏙️' },
      { id: 'midtown', name: 'Midtown', emoji: '🌆' },
    ],
  },
  {
    id: 'london',
    name: 'London',
    country: 'UK',
    emoji: '🇬🇧',
    districts: [
      { id: 'westminster', name: 'Westminster', emoji: '🏛️' },
      { id: 'camden', name: 'Camden', emoji: '🎸' },
      { id: 'kensington', name: 'Kensington', emoji: '👑' },
      { id: 'shoreditch', name: 'Shoreditch', emoji: '🎨' },
      { id: 'canary-wharf', name: 'Canary Wharf', emoji: '🏢' },
      { id: 'soho', name: 'Soho', emoji: '🎭' },
    ],
  },
  {
    id: 'paris',
    name: 'Paris',
    country: 'France',
    emoji: '🇫🇷',
    districts: [
      { id: 'champs-elysees', name: 'Champs-Élysées', emoji: '🗼' },
      { id: 'marais', name: 'Le Marais', emoji: '🎨' },
      { id: 'montmartre', name: 'Montmartre', emoji: '🎭' },
      { id: 'latin-quarter', name: 'Latin Quarter', emoji: '📚' },
      { id: 'saint-germain', name: 'Saint-Germain', emoji: '☕' },
      { id: 'louvre', name: 'Louvre', emoji: '🖼️' },
    ],
  },
  {
    id: 'moscow',
    name: 'Moscow',
    country: 'Russia',
    emoji: '🇷🇺',
    districts: [
      { id: 'center', name: 'Центр', emoji: '🏛️' },
      { id: 'arbat', name: 'Арбат', emoji: '🎭' },
      { id: 'tverskaya', name: 'Тверская', emoji: '🏙️' },
      { id: 'khamovniki', name: 'Хамовники', emoji: '🌳' },
      { id: 'zamoskvorechye', name: 'Замоскворечье', emoji: '🏰' },
      { id: 'tagansky', name: 'Таганский', emoji: '🏢' },
    ],
  },
  {
    id: 'istanbul',
    name: 'Istanbul',
    country: 'Turkey',
    emoji: '🇹🇷',
    districts: [
      { id: 'taksim', name: 'Taksim', emoji: '🏙️' },
      { id: 'sultanahmet', name: 'Sultanahmet', emoji: '🕌' },
      { id: 'besiktas', name: 'Beşiktaş', emoji: '⚓' },
      { id: 'kadikoy', name: 'Kadıköy', emoji: '🌉' },
      { id: 'sisli', name: 'Şişli', emoji: '🏢' },
      { id: 'bebek', name: 'Bebek', emoji: '🏖️' },
    ],
  },
  {
    id: 'tokyo',
    name: 'Tokyo',
    country: 'Japan',
    emoji: '🇯🇵',
    districts: [
      { id: 'shibuya', name: 'Shibuya', emoji: '🌆' },
      { id: 'shinjuku', name: 'Shinjuku', emoji: '🏙️' },
      { id: 'ginza', name: 'Ginza', emoji: '💎' },
      { id: 'roppongi', name: 'Roppongi', emoji: '🌃' },
      { id: 'harajuku', name: 'Harajuku', emoji: '🎨' },
      { id: 'akihabara', name: 'Akihabara', emoji: '🎮' },
    ],
  },
];

// Helper function to get city by ID
export function getCityById(cityId: string): City | undefined {
  return CITIES.find(city => city.id === cityId);
}

// Helper function to get all district names for a city
export function getDistrictNames(cityId: string): string[] {
  const city = getCityById(cityId);
  return city ? city.districts.map(d => d.name) : [];
}

// Helper function to detect city from user's location
export function detectCityFromLocation(location?: string): City {
  if (!location) return CITIES[0]; // Default to Dubai
  
  const lowerLocation = location.toLowerCase();
  
  // Check if location matches any city name
  for (const city of CITIES) {
    if (lowerLocation.includes(city.name.toLowerCase()) || 
        lowerLocation.includes(city.id)) {
      return city;
    }
  }
  
  // Check if location matches any district
  for (const city of CITIES) {
    for (const district of city.districts) {
      if (lowerLocation.includes(district.name.toLowerCase()) || 
          lowerLocation.includes(district.id)) {
        return city;
      }
    }
  }
  
  return CITIES[0]; // Default to Dubai
}
