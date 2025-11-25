import { TonyActivity } from '@shared/schema';

// Massive database of Tony Stark activities across the globe
const ACTIVITIES_TEMPLATES = [
  // MCU Canon Activities
  'Test-flying {suit} over {landmark}',
  'Ordering shawarma after {mission}',
  'Fine-tuning arc reactor in {lab}',
  'Racing vintage cars in {city}',
  'Attending Stark Industries board meeting in {city}',
  'Having dinner with Pepper at {restaurant}',
  'Testing new repulsor technology at {facility}',
  'Upgrading {suit} in secret bunker',
  'Eating cheeseburgers at {restaurant}',
  'Consulting with Nick Fury at {shield_location}',
  'Tinkering with nanotechnology in {lab}',
  'Meeting with War Machine for mission briefing at {military_base}',
  'Attending charity gala event in {city}',
  'Testing new flight systems over {desert}',
  'Analyzing alien tech from {battle}',
  'Having coffee and browsing tech news at {cafe}',
  'Working on artificial intelligence upgrades in {lab}',
  'Practicing hand-to-hand combat with Happy at {gym}',
  'Relaxing on yacht in {harbor}',
  'Debugging suit software issues in {lab}',
  
  // Humorous Tony Activities
  'Winning poker game against {villain}',
  'Installing Jarvis updates while {activity}',
  'Designing new armor paint job inspired by {theme}',
  'Trolling government officials in {city}',
  'Throwing lavish party at {venue}',
  'Flying impromptu air show over {landmark}',
  'Testing underwater capabilities in {ocean}',
  'Outbidding competitors at auction in {city}',
  'Making dramatic entrance at {event}',
  'Escaping paparazzi in {city}',
  'Livestreaming suit test from {location}',
  'Pranking {avenger} at {location}',
  'Shopping for {item} in {city}',
  'Getting kicked out of {venue} for being too awesome',
  'Setting fashion trends at {event}',
  'Challenging local pilots to race in {location}',
  'Installing emergency pizza oven in {suit}',
  'Teaching MIT students about {topic} in {city}',
  'Dodging calls from {person} while in {location}',
  'Building miniature arc reactors as souvenirs in {lab}',
  
  // Tech & Innovation
  'Patenting new invention at {office}',
  'Hacking into {system} from {location}',
  'Collaborating with Bruce Banner on {project}',
  'Reverse-engineering {tech} in {lab}',
  'Presenting keynote speech about {topic} in {city}',
  'Funding renewable energy project in {location}',
  'Debugging Friday AI from {location}',
  'Scanning for threats with satellite from {facility}',
  'Running diagnostics on {system}',
  'Calibrating targeting systems at {range}',
  
  // Social & Personal
  'Video calling Pepper from {location}',
  'Buying engagement gift in {city}',
  'Visiting {museum} for inspiration',
  'Attending Formula 1 race in {city}',
  'Taking helicopter tour of {location}',
  'Donating to charity in {city}',
  'Guest starring on talk show in {city}',
  'Signing autographs at {event}',
  'Test-driving exotic cars in {city}',
  'Wine tasting in {region}',
];

// Global locations with coordinates
const GLOBAL_LOCATIONS: Array<{name: string; lat: number; lng: number}> = [
  // North America
  {name: 'Malibu Beach, California', lat: 34.0259, lng: -118.7798},
  {name: 'New York City, New York', lat: 40.7128, lng: -74.0060},
  {name: 'Stark Tower, Manhattan', lat: 40.7580, lng: -73.9855},
  {name: 'Los Angeles, California', lat: 34.0522, lng: -118.2437},
  {name: 'Las Vegas, Nevada', lat: 36.1699, lng: -115.1398},
  {name: 'Miami, Florida', lat: 25.7617, lng: -80.1918},
  {name: 'Chicago, Illinois', lat: 41.8781, lng: -87.6298},
  {name: 'San Francisco, California', lat: 37.7749, lng: -122.4194},
  {name: 'Seattle, Washington', lat: 47.6062, lng: -122.3321},
  {name: 'Boston, Massachusetts', lat: 42.3601, lng: -71.0589},
  {name: 'Washington DC', lat: 38.9072, lng: -77.0369},
  {name: 'Vancouver, Canada', lat: 49.2827, lng: -123.1207},
  {name: 'Toronto, Canada', lat: 43.6532, lng: -79.3832},
  {name: 'Mexico City, Mexico', lat: 19.4326, lng: -99.1332},
  {name: 'Cancun, Mexico', lat: 21.1619, lng: -86.8515},
  
  // Europe
  {name: 'London, England', lat: 51.5074, lng: -0.1278},
  {name: 'Paris, France', lat: 48.8566, lng: 2.3522},
  {name: 'Monaco Harbor', lat: 43.7310, lng: 7.4197},
  {name: 'Rome, Italy', lat: 41.9028, lng: 12.4964},
  {name: 'Berlin, Germany', lat: 52.5200, lng: 13.4050},
  {name: 'Barcelona, Spain', lat: 41.3851, lng: 2.1734},
  {name: 'Amsterdam, Netherlands', lat: 52.3676, lng: 4.9041},
  {name: 'Vienna, Austria', lat: 48.2082, lng: 16.3738},
  {name: 'Prague, Czech Republic', lat: 50.0755, lng: 14.4378},
  {name: 'Stockholm, Sweden', lat: 59.3293, lng: 18.0686},
  {name: 'Oslo, Norway', lat: 59.9139, lng: 10.7522},
  {name: 'Copenhagen, Denmark', lat: 55.6761, lng: 12.5683},
  {name: 'Zurich, Switzerland', lat: 47.3769, lng: 8.5417},
  {name: 'Athens, Greece', lat: 37.9838, lng: 23.7275},
  {name: 'Istanbul, Turkey', lat: 41.0082, lng: 28.9784},
  
  // Asia
  {name: 'Tokyo, Japan', lat: 35.6762, lng: 139.6503},
  {name: 'Hong Kong', lat: 22.3193, lng: 114.1694},
  {name: 'Singapore', lat: 1.3521, lng: 103.8198},
  {name: 'Dubai, UAE', lat: 25.2048, lng: 55.2708},
  {name: 'Shanghai, China', lat: 31.2304, lng: 121.4737},
  {name: 'Beijing, China', lat: 39.9042, lng: 116.4074},
  {name: 'Seoul, South Korea', lat: 37.5665, lng: 126.9780},
  {name: 'Bangkok, Thailand', lat: 13.7563, lng: 100.5018},
  {name: 'Mumbai, India', lat: 19.0760, lng: 72.8777},
  {name: 'New Delhi, India', lat: 28.6139, lng: 77.2090},
  {name: 'Tel Aviv, Israel', lat: 32.0853, lng: 34.7818},
  {name: 'Taipei, Taiwan', lat: 25.0330, lng: 121.5654},
  {name: 'Kuala Lumpur, Malaysia', lat: 3.1390, lng: 101.6869},
  {name: 'Jakarta, Indonesia', lat: -6.2088, lng: 106.8456},
  {name: 'Manila, Philippines', lat: 14.5995, lng: 120.9842},
  
  // South America
  {name: 'Rio de Janeiro, Brazil', lat: -22.9068, lng: -43.1729},
  {name: 'São Paulo, Brazil', lat: -23.5505, lng: -46.6333},
  {name: 'Buenos Aires, Argentina', lat: -34.6037, lng: -58.3816},
  {name: 'Lima, Peru', lat: -12.0464, lng: -77.0428},
  {name: 'Santiago, Chile', lat: -33.4489, lng: -70.6693},
  {name: 'Bogotá, Colombia', lat: 4.7110, lng: -74.0721},
  
  // Africa
  {name: 'Cairo, Egypt', lat: 30.0444, lng: 31.2357},
  {name: 'Cape Town, South Africa', lat: -33.9249, lng: 18.4241},
  {name: 'Johannesburg, South Africa', lat: -26.2041, lng: 28.0473},
  {name: 'Marrakech, Morocco', lat: 31.6295, lng: -7.9811},
  {name: 'Nairobi, Kenya', lat: -1.2864, lng: 36.8172},
  
  // Oceania
  {name: 'Sydney, Australia', lat: -33.8688, lng: 151.2093},
  {name: 'Melbourne, Australia', lat: -37.8136, lng: 144.9631},
  {name: 'Auckland, New Zealand', lat: -36.8485, lng: 174.7633},
  
  // Special MCU Locations
  {name: 'Avengers Tower', lat: 40.7484, lng: -73.9857},
  {name: 'Stark Industries Lab, Pasadena', lat: 34.1478, lng: -118.1445},
  {name: 'Edwards Air Force Base', lat: 34.9054, lng: -117.8839},
  {name: 'Nevada Desert', lat: 36.7783, lng: -116.4170},
  {name: 'Mojave Desert', lat: 35.0212, lng: -115.4738},
  {name: 'Home Workshop, Malibu', lat: 34.0362, lng: -118.6919},
];

// Pre-generated comprehensive activity list (1200+ variations)
const COMPREHENSIVE_ACTIVITIES: Array<Omit<TonyActivity, 'coordinates'>> = [];

// Generate activity combinations
const suits = ['Mark 85', 'Mark 50', 'Mark 42', 'Mark 7', 'Mark 45', 'Hulkbuster', 'Iron Spider suit'];
const missions = ['saving Manhattan', 'defeating Hydra', 'stopping alien invasion', 'rescuing hostages'];
const labs = ['the workshop', 'secret bunker', 'Stark Tower lab', 'mobile lab'];
const restaurants = ['favorite Italian spot', 'rooftop restaurant', 'Michelin-starred venue', 'local diner'];
const facilities = ['testing facility', 'remote compound', 'underground base', 'offshore platform'];
const battles = ['Battle of New York', 'Sokovia incident', 'Lagos mission', 'airport battle'];
const avengers = ['Thor', 'Cap', 'Hulk', 'Black Widow', 'Hawkeye', 'Spider-Man'];
const projects = ['gamma radiation research', 'quantum tunneling', 'nanotech integration', 'AI development'];

// Add varied, specific activities for each major location
GLOBAL_LOCATIONS.forEach((location) => {
  const activitySet = [
    `Test-flying Mark 85 over ${location.name}`,
    `Inspecting Stark Industries facility in ${location.name}`,
    `Attending tech conference in ${location.name}`,
    `Having business lunch in ${location.name}`,
    `Shopping for vintage tech in ${location.name}`,
    `Evading paparazzi while dining in ${location.name}`,
    `Installing new security systems in ${location.name}`,
    `Meeting with local officials in ${location.name}`,
    `Scouting real estate opportunities in ${location.name}`,
    `Presenting award at ceremony in ${location.name}`,
    `Testing new armor stealth mode over ${location.name}`,
    `Debugging suit AI glitch from hotel in ${location.name}`,
    `Video call with Pepper from rooftop in ${location.name}`,
    `Researching local energy infrastructure in ${location.name}`,
    `Flying impromptu airshow demonstration over ${location.name}`,
    `Ordering room service after long flight to ${location.name}`,
    `Checking into luxury hotel in ${location.name}`,
    `Tweeting snarky comments about traffic in ${location.name}`,
  ];
  
  activitySet.forEach(activity => {
    COMPREHENSIVE_ACTIVITIES.push({ activity, location: location.name });
  });
});

// Add more unique global activities
const uniqueActivities = [
  {activity: 'Installing WiFi boosters in suit while flying', location: 'Over Pacific Ocean'},
  {activity: 'Debugging Jarvis voice commands', location: 'Quinjet cockpit'},
  {activity: 'Calculating optimal flight path to avoid turbulence', location: 'At 30,000 feet'},
  {activity: 'Designing commemorative arc reactor models', location: 'Home Workshop, Malibu'},
  {activity: 'Taste-testing new protein shake recipe', location: 'Stark Tower Kitchen'},
  {activity: 'Programming Friday to be more sarcastic', location: 'Mobile Command Center'},
  {activity: 'Updating social media with suit selfie', location: 'Flying over Grand Canyon'},
  {activity: 'Calibrating repulsor beam intensity', location: 'Target Range, Nevada'},
  {activity: 'Composing apology text to Pepper', location: 'Quinjet passenger seat'},
  {activity: 'Bidding on rare car at online auction', location: 'Private jet'},
  {activity: 'Explaining physics to Morgan via video call', location: 'Hotel penthouse'},
  {activity: 'Monitoring global news for threats', location: 'Avengers compound'},
  {activity: 'Practicing new one-liners for next mission', location: 'Bathroom mirror'},
  {activity: 'Reorganizing tool collection by color', location: 'Workshop storage room'},
  {activity: 'Teaching AI to appreciate classic rock', location: 'Home theater'},
  {activity: 'Installing espresso machine in armor', location: 'Lab workbench'},
  {activity: 'Reviewing mission footage for blooper reel', location: 'Media room'},
  {activity: 'Optimizing suit for pizza delivery speed', location: 'Flight simulation chamber'},
  {activity: 'Testing emergency ejection seat cushion comfort', location: 'Mark 85 cockpit'},
  {activity: 'Arguing with AI about music choices', location: 'Car garage'},
];

uniqueActivities.forEach(act => {
  // Find closest real location or default
  const loc = GLOBAL_LOCATIONS.find(l => l.name.includes('Malibu')) || GLOBAL_LOCATIONS[0];
  COMPREHENSIVE_ACTIVITIES.push({activity: act.activity, location: act.location});
});

// Build location coordinates map
const LOCATION_COORDS = new Map<string, { lat: number; lng: number }>();
GLOBAL_LOCATIONS.forEach(loc => {
  LOCATION_COORDS.set(loc.name, { lat: loc.lat, lng: loc.lng });
});

// Add some special floating locations
LOCATION_COORDS.set('Over Pacific Ocean', { lat: 20.5937, lng: -156.6906 });
LOCATION_COORDS.set('Quinjet cockpit', { lat: 40.7580, lng: -73.9855 });
LOCATION_COORDS.set('At 30,000 feet', { lat: 39.8283, lng: -98.5795 });
LOCATION_COORDS.set('Flying over Grand Canyon', { lat: 36.1069, lng: -112.1129 });
LOCATION_COORDS.set('Target Range, Nevada', { lat: 36.7783, lng: -116.4170 });
LOCATION_COORDS.set('Avengers compound', { lat: 41.3083, lng: -73.9248 });
LOCATION_COORDS.set('Mobile Command Center', { lat: 34.0522, lng: -118.2437 });
LOCATION_COORDS.set('Private jet', { lat: 40.6413, lng: -73.7781 });
LOCATION_COORDS.set('Hotel penthouse', { lat: 40.7589, lng: -73.9851 });

// Track used activities to ensure uniqueness
const usedIndices = new Set<number>();
let currentActivity: TonyActivity | null = null;

export function getTonyActivity(): TonyActivity {
  // Return cached activity if it exists (only changes on server restart)
  if (currentActivity) {
    return currentActivity;
  }

  // Get random unused activity
  let attempts = 0;
  let randomIndex: number;
  
  do {
    randomIndex = Math.floor(Math.random() * COMPREHENSIVE_ACTIVITIES.length);
    attempts++;
    
    // Reset if we've used most activities
    if (usedIndices.size >= COMPREHENSIVE_ACTIVITIES.length * 0.9 || attempts > 100) {
      usedIndices.clear();
    }
  } while (usedIndices.has(randomIndex) && attempts < 100);
  
  usedIndices.add(randomIndex);
  
  const randomActivity = COMPREHENSIVE_ACTIVITIES[randomIndex];
  const coordinates = LOCATION_COORDS.get(randomActivity.location) || { lat: 34.0259, lng: -118.7798 };

  currentActivity = {
    ...randomActivity,
    coordinates
  };

  return currentActivity;
}

// Export total count for debugging
export const TOTAL_ACTIVITIES = COMPREHENSIVE_ACTIVITIES.length;
