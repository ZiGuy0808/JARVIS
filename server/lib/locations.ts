// MCU and real-world locations for Tony Stark
export interface Location {
  name: string;
  coordinates: { lat: number; lng: number };
  mcuSignificance?: string;
}

const LOCATIONS: Record<string, Location> = {
  'malibu': {
    name: 'Malibu, California',
    coordinates: { lat: 34.0195, lng: -118.6813 },
    mcuSignificance: 'Tony Stark\'s primary residence and workshop location'
  },
  'new york': {
    name: 'New York City',
    coordinates: { lat: 40.7128, lng: -74.0060 },
    mcuSignificance: 'Home of the Avengers Tower'
  },
  'avengers tower': {
    name: 'New York City (Avengers Tower)',
    coordinates: { lat: 40.7580, lng: -73.9855 },
    mcuSignificance: 'Tony Stark\'s Avengers Tower headquarters'
  },
  'sokovia': {
    name: 'Sokovia',
    coordinates: { lat: 43.9159, lng: 17.6791 },
    mcuSignificance: 'Site of Avengers: Age of Ultron battle'
  },
  'lagos': {
    name: 'Lagos, Nigeria',
    coordinates: { lat: 6.5244, lng: 3.3792 },
    mcuSignificance: 'Location of Captain America: Civil War opening'
  },
  'siberia': {
    name: 'Siberia, Russia',
    coordinates: { lat: 66.0, lng: 94.0 },
    mcuSignificance: 'HYDRA facility location'
  },
  'wakanda': {
    name: 'Wakanda (Fictional)',
    coordinates: { lat: -1.0, lng: 34.0 },
    mcuSignificance: 'Hidden African nation'
  },
  'space': {
    name: 'Outer Space',
    coordinates: { lat: 0, lng: 0 },
    mcuSignificance: 'Infinity War location'
  },
  'london': {
    name: 'London, England',
    coordinates: { lat: 51.5074, lng: -0.1278 },
    mcuSignificance: 'Common MCU filming location'
  },
  'tokyo': {
    name: 'Tokyo, Japan',
    coordinates: { lat: 35.6762, lng: 139.6503 },
    mcuSignificance: 'Asian operations hub'
  },
  'dubai': {
    name: 'Dubai, UAE',
    coordinates: { lat: 25.2048, lng: 55.2708 },
    mcuSignificance: 'Global tech hub'
  },
  'geneva': {
    name: 'Geneva, Switzerland',
    coordinates: { lat: 46.2044, lng: 6.1432 },
    mcuSignificance: 'United Nations headquarters'
  },
  'paris': {
    name: 'Paris, France',
    coordinates: { lat: 48.8566, lng: 2.3522 },
    mcuSignificance: 'European mission base'
  },
  'hong kong': {
    name: 'Hong Kong',
    coordinates: { lat: 22.3193, lng: 114.1694 },
    mcuSignificance: 'Eastern operations base'
  },
  'la': {
    name: 'Los Angeles, California',
    coordinates: { lat: 34.0522, lng: -118.2437 },
    mcuSignificance: 'West Coast headquarters'
  },
  'berlin': {
    name: 'Berlin, Germany',
    coordinates: { lat: 52.5200, lng: 13.4050 },
    mcuSignificance: 'European tech center'
  },
  'moscow': {
    name: 'Moscow, Russia',
    coordinates: { lat: 55.7558, lng: 37.6173 },
    mcuSignificance: 'Eastern operations zone'
  },
};

export function parseLocationRequest(message: string): Location | null {
  const lowerMessage = message.toLowerCase();
  
  // Check for "move Tony to", "go to", "head to", "travel to" patterns
  const movePatterns = [
    /(?:move tony|send tony|tell tony).{0,20}(?:to|go|head|travel|fly|move)\s+(?:to\s+)?([a-z\s]+?)(?:\.|,|$)/i,
    /(?:go|move|fly|head|travel)\s+(?:to\s+)?([a-z\s]+?)(?:\.|,|$)/i,
  ];

  for (const pattern of movePatterns) {
    const match = lowerMessage.match(pattern);
    if (match) {
      const locationName = match[1].trim().toLowerCase();
      
      // Try exact match first
      if (LOCATIONS[locationName]) {
        return LOCATIONS[locationName];
      }
      
      // Try partial match
      for (const [key, loc] of Object.entries(LOCATIONS)) {
        if (key.includes(locationName) || locationName.includes(key)) {
          return loc;
        }
      }
    }
  }
  
  return null;
}

export function getLocationByName(name: string): Location | null {
  const normalizedName = name.toLowerCase().trim();
  return LOCATIONS[normalizedName] || null;
}

export function getAllLocations(): Location[] {
  return Object.values(LOCATIONS);
}

export function parseLocationFromMessage(message: string): { location: Location; query: string } | null {
  const location = parseLocationRequest(message);
  if (location) {
    return { location, query: message };
  }
  return null;
}
