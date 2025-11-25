export interface IronManSuit {
  name: string;
  markNumber: number;
  filmIntroduced: string;
  filmDebuted?: string;
  yearsActive: string[];
  color: string;
  specialization: string;
  technicalSpecs: {
    armor: string;
    power: string;
    capabilities: string[];
  };
  keyUsages: string[];
  weaknesses?: string;
  upgrades?: string;
  status: 'Active' | 'Retired' | 'Destroyed' | 'Upgraded';
  notableMoments: string[];
}

export const IRON_MAN_SUITS: IronManSuit[] = [
  {
    name: 'Mark I',
    markNumber: 1,
    filmIntroduced: 'Iron Man (2008)',
    yearsActive: ['2008'],
    color: 'Gold and Silver',
    specialization: 'Prototype - Heavy Armor',
    technicalSpecs: {
      armor: 'Iron, bronze casing',
      power: 'Arc Reactor powered (experimental)',
      capabilities: ['Heavy weaponry', 'Flight', 'Armor protection'],
    },
    keyUsages: ['Escape from Taliban cave', 'First suit ever built'],
    weaknesses: 'Slow, heavy, prone to overheating',
    status: 'Destroyed',
    notableMoments: ['Built in cave with limited resources', 'Escape and immediate crash', 'Scraped for Mark II technology'],
  },
  {
    name: 'Mark II',
    markNumber: 2,
    filmIntroduced: 'Iron Man (2008)',
    yearsActive: ['2008'],
    color: 'Silver and Red',
    specialization: 'Sleek Prototype',
    technicalSpecs: {
      armor: 'Polished aluminum alloy',
      power: 'Arc Reactor Mark II',
      capabilities: ['Enhanced flight', 'Better maneuverability', 'Improved weapons systems'],
    },
    keyUsages: ['First suit built in workshop', 'Flight testing'],
    weaknesses: 'Icing problem at high altitude',
    upgrades: 'Evolved to Mark III after altitude problem',
    status: 'Retired',
    notableMoments: ['High altitude flight test with icing malfunction', 'Scraped after Obadiah Stane incident'],
  },
  {
    name: 'Mark III',
    markNumber: 3,
    filmIntroduced: 'Iron Man (2008)',
    yearsActive: ['2008'],
    color: 'Red and Gold',
    specialization: 'Battle Ready',
    technicalSpecs: {
      armor: 'Gold-titanium alloy',
      power: 'Arc Reactor Mark III',
      capabilities: ['Advanced weaponry', 'Flight stability', 'Enhanced armor plating'],
    },
    keyUsages: ['Final battle against Iron Monger', 'Battle of Gulmira'],
    status: 'Destroyed',
    notableMoments: ['Victory against Iron Monger/Obadiah Stane', 'Final suit of first film', 'Destroyed in finale'],
  },
  {
    name: 'Mark IV',
    markNumber: 4,
    filmIntroduced: 'Iron Man 2 (2010)',
    yearsActive: ['2010'],
    color: 'Red and Gold',
    specialization: 'Sleeker Design',
    technicalSpecs: {
      armor: 'Improved gold-titanium alloy',
      power: 'Arc Reactor Mark IV',
      capabilities: ['Lightweight design', 'Enhanced speed', 'Improved repulsors'],
    },
    keyUsages: ['Stark Expo presentation', 'Fighting with War Machine'],
    status: 'Destroyed',
    notableMoments: ['Stark Expo fight sequence', 'Damaged in multiple battles'],
  },
  {
    name: 'Mark V',
    markNumber: 5,
    filmIntroduced: 'Iron Man 2 (2010)',
    yearsActive: ['2010'],
    color: 'Black and Silver',
    specialization: 'Portable Briefcase Suit',
    technicalSpecs: {
      armor: 'Compact folding design',
      power: 'Portable Arc Reactor',
      capabilities: ['Quick deployment', 'Portable storage', 'Combat capable'],
    },
    keyUsages: ['Emergency transformation', 'Battle against Vanko drones', 'Portable deployment'],
    weaknesses: 'Less stable, rapid deployment may cause instability',
    status: 'Destroyed',
    notableMoments: ['Deployed from briefcase', 'Called "The Suitcase" by Tony', 'Used in final battle sequence'],
  },
  {
    name: 'Mark VI',
    markNumber: 6,
    filmIntroduced: 'Iron Man 2 (2010)',
    yearsActive: ['2010'],
    color: 'Red and Gold',
    specialization: 'Streamlined Combat',
    technicalSpecs: {
      armor: 'Advanced gold-titanium alloy',
      power: 'Arc Reactor Mark VI',
      capabilities: ['Better aerodynamics', 'Enhanced repulsors', 'Improved targeting'],
    },
    keyUsages: ['Final suit of Iron Man 2', 'Fighting Whiplash', 'Expo battles'],
    status: 'Destroyed',
    notableMoments: ['Destroyed in Expo finale', 'First red and gold classic design'],
  },
  {
    name: 'Mark VII',
    markNumber: 7,
    filmIntroduced: 'The Avengers (2012)',
    yearsActive: ['2012'],
    color: 'Red and Gold',
    specialization: 'Battle Armor',
    technicalSpecs: {
      armor: 'Military-grade gold-titanium alloy',
      power: 'Arc Reactor Mark VII',
      capabilities: ['Heavy armor', 'Advanced weaponry', 'High durability'],
    },
    keyUsages: ['Battle of New York', 'Fighting Loki and Chitauri'],
    status: 'Destroyed',
    notableMoments: ['First Avengers battle', 'Flying nuclear missile into wormhole'],
  },
  {
    name: 'Mark VIII',
    markNumber: 8,
    filmIntroduced: 'Iron Man 3 (2013)',
    yearsActive: ['2013'],
    color: 'Red and Gold',
    specialization: 'Sleek Design',
    technicalSpecs: {
      armor: 'Advanced composite alloy',
      power: 'Arc Reactor Mark VIII',
      capabilities: ['Enhanced speed', 'Improved aesthetics', 'Better maneuverability'],
    },
    keyUsages: ['Post-Avengers suit', 'Combat against Extremis soldiers'],
    status: 'Destroyed',
    notableMoments: ['Used in Iron Man 3 opening sequences'],
  },
  {
    name: 'Mark XLI (Bones)',
    markNumber: 41,
    filmIntroduced: 'Iron Man 3 (2013)',
    yearsActive: ['2013'],
    color: 'Red and Gold skeleton design',
    specialization: 'Experimental Skeletal Frame',
    technicalSpecs: {
      armor: 'Minimal exposed design',
      power: 'Arc Reactor Mark XLI',
      capabilities: ['Lightweight', 'Enhanced mobility', 'Experimental modular design'],
    },
    keyUsages: ['Created post-New York trauma', 'Testing and development'],
    weaknesses: 'Skeletal design leaves gaps in protection',
    status: 'Destroyed',
    notableMoments: ['Built during Tony\'s obsessive phase', 'First of many suits created after Avengers'],
  },
  {
    name: 'Mark XLII',
    markNumber: 42,
    filmIntroduced: 'Iron Man 3 (2013)',
    yearsActive: ['2013'],
    color: 'Red and Gold',
    specialization: 'Modular Armor',
    technicalSpecs: {
      armor: 'Modular pieces, individually deployable',
      power: 'Arc Reactor with JARVIS control',
      capabilities: ['Modular assembly', 'Remote control capable', 'Individual piece deployment'],
    },
    keyUsages: ['Testing modularity', 'Combat against Mandarin forces', 'Final suit of Iron Man 3'],
    upgrades: 'Features remote assembly technology',
    status: 'Destroyed',
    notableMoments: ['First heavily modular suit design', 'Can be remotely piloted', 'Used in final battle'],
  },
  {
    name: 'Mark XLIII',
    markNumber: 43,
    filmIntroduced: 'Avengers: Age of Ultron (2015)',
    yearsActive: ['2015'],
    color: 'Red and Gold',
    specialization: 'Combat Ready',
    technicalSpecs: {
      armor: 'Advanced composite alloy',
      power: 'Arc Reactor Mark XLIII',
      capabilities: ['Advanced weapons systems', 'Enhanced armor', 'Combat optimized'],
    },
    keyUsages: ['Ultron battle', 'Avengers operation in Sokovia'],
    status: 'Destroyed',
    notableMoments: ['Used in Age of Ultron battle sequences'],
  },
  {
    name: 'Mark XLIV (Hulkbuster)',
    markNumber: 44,
    filmIntroduced: 'Avengers: Age of Ultron (2015)',
    yearsActive: ['2015'],
    color: 'Red, Gold, and Orange',
    specialization: 'Heavy Armor - Hulk Containment',
    technicalSpecs: {
      armor: 'Massive reinforced plating',
      power: 'Multiple Arc Reactors',
      capabilities: ['Extreme strength', 'Hulk-level combat capability', 'Self-replenishing power'],
    },
    keyUsages: ['Fighting Hulk/Bruce Banner', 'Prevent Hulk rampage'],
    status: 'Destroyed',
    notableMoments: ['Epic fight with Hulk in Johannesburg', 'Massive armor design', 'Separated pieces after battle'],
  },
  {
    name: 'Mark XLVII (Homecoming)',
    markNumber: 47,
    filmIntroduced: 'Captain America: Civil War (2016)',
    yearsActive: ['2016'],
    color: 'Red and Gold',
    specialization: 'MCU Standard',
    technicalSpecs: {
      armor: 'Advanced composite materials',
      power: 'Arc Reactor Mark XLVII',
      capabilities: ['Advanced targeting', 'Web integration', 'Holographic display'],
    },
    keyUsages: ['Civil War conflict', 'Supporting Spider-Man'],
    status: 'Destroyed',
    notableMoments: ['Used in airport battle in Civil War'],
  },
  {
    name: 'Mark L (50)',
    markNumber: 50,
    filmIntroduced: 'Avengers: Infinity War (2018)',
    yearsActive: ['2018'],
    color: 'Red and Gold',
    specialization: 'Nanotech Armor',
    technicalSpecs: {
      armor: 'Nanoparticle technology',
      power: 'Arc Reactor Mark L',
      capabilities: ['Instant reconfiguration', 'Nanite repair', 'Multipurpose weapons'],
    },
    keyUsages: ['Infinity War battle against Thanos', 'Interstellar travel'],
    upgrades: 'First nanotech suit',
    status: 'Destroyed',
    notableMoments: ['Arrived in space via ship with Doctor Strange', 'Transformed mid-battle'],
  },
  {
    name: 'Mark LXXXV (85)',
    markNumber: 85,
    filmIntroduced: 'Avengers: Endgame (2019)',
    yearsActive: ['2019'],
    color: 'Red and Gold with blue accents',
    specialization: 'Infinity Stones Integration',
    technicalSpecs: {
      armor: 'Nanotech with infinity stone containment',
      power: 'Arc Reactor with Infinity Stones',
      capabilities: ['Infinity Stone channeling', 'Reality warping', 'Universal power'],
    },
    keyUsages: ['Final battle against Thanos', 'Ultimate sacrifice'],
    upgrades: 'Integrated Infinity Stones technology',
    status: 'Destroyed',
    notableMoments: ['Final suit Tony ever wore', 'Channeled all Infinity Stones', 'I am Iron Man moment'],
  },
];

export function getSuitByMark(markNumber: number): IronManSuit | undefined {
  return IRON_MAN_SUITS.find(suit => suit.markNumber === markNumber);
}

export function getSuitByName(name: string): IronManSuit | undefined {
  const nameLower = name.toLowerCase();
  return IRON_MAN_SUITS.find(suit => suit.name.toLowerCase().includes(nameLower) || suit.specialization.toLowerCase().includes(nameLower));
}

export function searchSuits(query: string): IronManSuit[] {
  const queryLower = query.toLowerCase();
  return IRON_MAN_SUITS.filter(suit =>
    suit.name.toLowerCase().includes(queryLower) ||
    suit.filmIntroduced.toLowerCase().includes(queryLower) ||
    suit.specialization.toLowerCase().includes(queryLower) ||
    suit.keyUsages.some(usage => usage.toLowerCase().includes(queryLower)) ||
    suit.notableMoments.some(moment => moment.toLowerCase().includes(queryLower))
  );
}

export function getSuitsByFilm(filmName: string): IronManSuit[] {
  const filmLower = filmName.toLowerCase();
  return IRON_MAN_SUITS.filter(suit =>
    suit.filmIntroduced.toLowerCase().includes(filmLower) ||
    suit.yearsActive.some(year => filmLower.includes(year))
  );
}

export function getAllSuits(): IronManSuit[] {
  return IRON_MAN_SUITS;
}
