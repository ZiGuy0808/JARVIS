import type { TonyActivity } from '@shared/schema';

export interface StarkScan {
  timestamp: number;
  suit: string;
  outfit: string;
  heartRate: number;
  mood: string;
  bodyTemperature: number;
  energyLevel: number;
  armorIntegrity: number;
  location: string;
  activity: string;
  coordinates: { lat: number; lng: number };
  vitals: {
    adrenaline: number;
    cortisol: number;
    oxygenation: number;
  };
  systems: {
    neural: number;
    circulatory: number;
    respiratory: number;
    muscular: number;
  };
}

const SUITS = [
  'Mark I - Iron Monger',
  'Mark II - Advanced',
  'Mark III - Battle Ready',
  'Mark IV - Sleeker Design',
  'Mark V - Suitcase Model',
  'Mark VI - Streamlined',
  'Mark VII - Battle Armor',
  'Mark VIII - Sleek Red/Gold',
  'Mark IX - Racing Version',
  'Mark X - Lighter Frame',
  'Mark XI - Heavy Duty',
  'Mark XII - Experimental',
  'Mark XIII - Reconnaissance',
  'Mark XIV - Bleeding Edge',
  'Mark XV - Sneaky Operations',
  'Mark XVI - Satellite Control',
  'Mark XVII - Deep Sea Version',
  'Mark XVIII - Arctic Deployment',
  'Mark XIX - Enhanced Speed',
  'Mark XX - Heavy Weapons',
  'Mark XLI - Bones',
  'Mark XLII - Modular',
  'Mark XLIII - Combat Ready',
  'Mark XLIV - Hulkbuster',
  'Mark XLVII - Homecoming',
  'Mark XLVIII - Space Mission',
  'Mark LXXX - Endgame',
  'Mark LXXXV - Final',
];

const OUTFITS = [
  'Casual suit and tie',
  'Tuxedo with sunglasses',
  'Designer jeans and t-shirt',
  'Black tactical gear',
  'Lab coat over casual wear',
  'Business casual with Stark Industries logo',
  'Vintage leather jacket',
  'Pajamas and slippers',
  'Running gear and sneakers',
  'Formal evening wear',
  'Hooded sweatshirt and jeans',
  'Workshop overalls',
  'Mediterranean linen shirt',
  'Designer athletic wear',
  'Stark Industries prototype suit',
];

const MOODS = [
  { name: 'Focused', emoji: '🎯' },
  { name: 'Confident', emoji: '💪' },
  { name: 'Analytical', emoji: '🧠' },
  { name: 'Excited', emoji: '⚡' },
  { name: 'Alert', emoji: '👁️' },
  { name: 'Determined', emoji: '🔥' },
  { name: 'Relaxed', emoji: '😎' },
  { name: 'Calculating', emoji: '📊' },
  { name: 'Aggressive', emoji: '⚔️' },
  { name: 'Cautious', emoji: '🛡️' },
  { name: 'Amused', emoji: '😏' },
  { name: 'Strategic', emoji: '♟️' },
  { name: 'Charged', emoji: '🔋' },
  { name: 'Vigilant', emoji: '🚨' },
  { name: 'Inspired', emoji: '✨' },
];

const ACTIVITIES_MOODS = {
  'Test-flying': { mood: 'Excited', heartRate: [120, 140] },
  'Ordering shawarma': { mood: 'Relaxed', heartRate: [60, 75] },
  'Fine-tuning arc reactor': { mood: 'Focused', heartRate: [70, 85] },
  'Racing': { mood: 'Excited', heartRate: [130, 150] },
  'Board meeting': { mood: 'Confident', heartRate: [75, 90] },
  'Dinner': { mood: 'Relaxed', heartRate: [65, 80] },
  'Testing': { mood: 'Analytical', heartRate: [90, 110] },
  'Upgrading': { mood: 'Focused', heartRate: [80, 95] },
  'Tinkering': { mood: 'Concentrated', heartRate: [75, 90] },
  'Mission': { mood: 'Alert', heartRate: [110, 135] },
  'Combat': { mood: 'Aggressive', heartRate: [140, 160] },
  'Consultation': { mood: 'Strategic', heartRate: [85, 100] },
  'Relaxing': { mood: 'Relaxed', heartRate: [60, 75] },
  'Shopping': { mood: 'Amused', heartRate: [70, 85] },
  'Meeting': { mood: 'Confident', heartRate: [80, 95] },
};

function getActivityMoodContext(activity: string): { mood: string; heartRateRange: [number, number] } {
  for (const [key, value] of Object.entries(ACTIVITIES_MOODS)) {
    if (activity.toLowerCase().includes(key.toLowerCase())) {
      const [minHR, maxHR] = value.heartRate as [number, number];
      return { mood: value.mood, heartRateRange: [minHR, maxHR] };
    }
  }
  return { mood: 'Observant', heartRateRange: [75, 95] };
}

export function generateStarkScan(tonyActivity: TonyActivity): StarkScan {
  const now = Date.now();
  const seed = now + Math.random(); // Ensure uniqueness
  
  // Get activity-based mood
  const { mood: activityMood, heartRateRange } = getActivityMoodContext(tonyActivity.activity);
  
  // Generate heart rate based on activity
  const baseHeartRate = Math.floor(Math.random() * (heartRateRange[1] - heartRateRange[0]) + heartRateRange[0]);
  const heartRate = baseHeartRate + Math.floor(Math.random() * 20 - 10); // ±10 variation
  
  // Select outfit based on activity
  let outfit = OUTFITS[Math.floor(seed * OUTFITS.length) % OUTFITS.length];
  if (tonyActivity.activity.toLowerCase().includes('test') || 
      tonyActivity.activity.toLowerCase().includes('mission') ||
      tonyActivity.activity.toLowerCase().includes('combat')) {
    outfit = 'Black tactical gear';
  } else if (tonyActivity.activity.toLowerCase().includes('board') || 
             tonyActivity.activity.toLowerCase().includes('gala')) {
    outfit = 'Formal evening wear';
  } else if (tonyActivity.activity.toLowerCase().includes('lab') || 
             tonyActivity.activity.toLowerCase().includes('tinkering')) {
    outfit = 'Workshop overalls';
  }
  
  // Select suit
  const suit = SUITS[Math.floor(seed * SUITS.length) % SUITS.length];
  
  // Generate physiological data based on heart rate
  const energyLevel = Math.max(20, 100 - Math.abs(heartRate - 90) / 1.5);
  const bodyTemperature = 36.5 + (heartRate - 70) / 20; // Rises with activity
  
  // Mood variation
  const moodsList = MOODS.map(m => m.name);
  let selectedMood = activityMood;
  if (Math.random() > 0.7) {
    selectedMood = moodsList[Math.floor(seed * moodsList.length) % moodsList.length];
  }
  
  // Vitals based on heart rate and mood
  const isIntense = heartRate > 110;
  const vitals = {
    adrenaline: isIntense ? Math.min(100, 40 + (heartRate - 70) * 1.2) : Math.max(20, 50 - (100 - heartRate) * 0.5),
    cortisol: isIntense ? Math.min(95, 30 + (heartRate - 70)) : Math.max(15, 40 - (100 - heartRate) * 0.3),
    oxygenation: Math.max(85, Math.min(100, 92 + (100 - heartRate) / 10)),
  };
  
  // System integrity
  const systems = {
    neural: Math.max(70, 95 - Math.random() * 20),
    circulatory: Math.max(75, 98 - Math.abs(heartRate - 85) / 10),
    respiratory: 95 - vitals.adrenaline / 5,
    muscular: 90 - (vitals.cortisol / 2),
  };
  
  // Armor integrity varies with activity type
  let armorIntegrity = 98;
  if (tonyActivity.activity.toLowerCase().includes('combat') ||
      tonyActivity.activity.toLowerCase().includes('mission') ||
      tonyActivity.activity.toLowerCase().includes('battle')) {
    armorIntegrity = Math.max(45, 95 - Math.random() * 50);
  } else if (tonyActivity.activity.toLowerCase().includes('test')) {
    armorIntegrity = Math.max(80, 95 - Math.random() * 15);
  }
  
  return {
    timestamp: now,
    suit,
    outfit,
    heartRate: Math.round(heartRate),
    mood: selectedMood,
    bodyTemperature: Math.round(bodyTemperature * 10) / 10,
    energyLevel: Math.round(energyLevel),
    armorIntegrity: Math.round(armorIntegrity),
    location: tonyActivity.location,
    activity: tonyActivity.activity,
    coordinates: tonyActivity.coordinates,
    vitals: {
      adrenaline: Math.round(vitals.adrenaline),
      cortisol: Math.round(vitals.cortisol),
      oxygenation: Math.round(vitals.oxygenation),
    },
    systems: {
      neural: Math.round(systems.neural),
      circulatory: Math.round(systems.circulatory),
      respiratory: Math.round(systems.respiratory),
      muscular: Math.round(systems.muscular),
    },
  };
}
