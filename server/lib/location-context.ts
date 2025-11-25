// MCU-accurate reasoning for why Tony would be at specific locations
export const LOCATION_NARRATIVES: Record<string, {
  reasons: string[];
  suits: string[];
  missionContext: string;
}> = {
  'Malibu Beach, California': {
    reasons: [
      'Home laboratory - primary base of operations',
      'Testing new suit prototypes away from Stark Tower',
      'Private relaxation time with Pepper Potts',
      'Conducting covert experiments without public attention',
      'Monitoring Avengers communications from secure facility'
    ],
    suits: ['Mark XLV', 'Mark XLVI', 'Mark XLVII'],
    missionContext: 'You\'re likely conducting private R&D or monitoring global threats from your primary workshop. This is where innovation happens, sir.'
  },
  'New York City, New York': {
    reasons: [
      'Stark Tower headquarters',
      'Responding to major threats in downtown Manhattan',
      'Attending Avengers meetings and briefings',
      'Public appearances and board meetings for Stark Industries',
      'Defending against alien or enhanced threats'
    ],
    suits: ['Mark XLVII', 'Mark L', 'Mark LXXXV'],
    missionContext: 'Given the significance of New York City as a center of both Stark Industries and Avengers operations, you\'re likely engaged in critical strategic planning or active defense.'
  },
  'Sokovia': {
    reasons: [
      'Responding to Ultron crisis',
      'Evacuating civilians from HYDRA bases',
      'Engaging in final confrontation with Ultron',
      'Collaborating with Avengers on emergency mission'
    ],
    suits: ['Mark XLIII', 'Mark XLIV (Hulkbuster)'],
    missionContext: 'The situation in Sokovia demands immediate attention. You\'re coordinating with the Avengers on one of the most critical missions to date.'
  },
  'London, England': {
    reasons: [
      'Consulting with British intelligence services',
      'Testing advanced armor systems in controlled environment',
      'Board meetings for European Stark Industries operations',
      'Attending diplomatic functions as head of Stark Industries'
    ],
    suits: ['Mark XLII', 'Mark XLVII'],
    missionContext: 'Business and strategic interests likely bring you to London. Maintaining Stark Industries\' global influence requires personal attention to European operations.'
  },
  'Siberia': {
    reasons: [
      'Tracking dangerous threats to remote locations',
      'Investigating HYDRA bunker activities',
      'Testing arctic-rated armor capabilities',
      'Engaging in covert military operations'
    ],
    suits: ['Mark XLVII', 'Mark L'],
    missionContext: 'The harsh Siberian environment suggests either critical intelligence gathering or direct engagement with significant threats. Extreme conditions demand specialized armor.'
  },
  'Wakanda': {
    reasons: [
      'Collaborating with King T\'Challa on advanced technology',
      'Attending international Avengers summit',
      'Studying vibranium applications for armor enhancement',
      'Coordinating defense against extraterrestrial threats'
    ],
    suits: ['Mark LXXXV', 'Mark LXXXVII'],
    missionContext: 'Wakanda represents the convergence of cutting-edge technology and strategic alliance. You\'re likely engaged in high-level discussions about existential threats.'
  },
  'Space': {
    reasons: [
      'Pursuing intergalactic threats to Earth',
      'Conducting deep-space reconnaissance missions',
      'Engaging extraterrestrial adversaries',
      'Testing suit performance in zero-gravity environment'
    ],
    suits: ['Mark L', 'Mark LXXXV'],
    missionContext: 'The fact that you\'re in space indicates a threat of galactic significance. Your advanced armor is operating at maximum capacity to protect humanity.'
  },
  'Vatican City': {
    reasons: [
      'Diplomatic negotiations on behalf of United Nations',
      'Attending high-level international security briefings',
      'Historical research into ancient technologies',
      'Private audience with world leaders'
    ],
    suits: ['Mark XLVII', 'Formal attire (no suit)'],
    missionContext: 'Your presence in Vatican City suggests diplomatic importance. You\'re likely representing Stark Industries in crucial international matters.'
  },
  'Tokyo, Japan': {
    reasons: [
      'Investigating advanced tech smuggling operations',
      'Attending Stark Industries Asian subsidiary meetings',
      'Collaborating with local intelligence on threats',
      'Testing armor systems against enhanced opponents'
    ],
    suits: ['Mark XLII', 'Mark XLIII'],
    missionContext: 'Tokyo\'s position as a tech hub makes it strategically important. You\'re likely balancing corporate interests with security concerns.'
  },
  'Dubai': {
    reasons: [
      'Attending luxury tech expo or gala event',
      'Conducting secret weapons testing in desert',
      'Meeting with international arms dealers or allies',
      'Enjoying downtime at luxury facilities'
    ],
    suits: ['Mark XLII', 'Mark XLVII'],
    missionContext: 'Dubai represents both opportunity and strategic positioning. Your presence suggests either high-stakes negotiation or covert operations.'
  }
};

export function getLocationNarrative(location: string): string {
  // Find matching location
  const key = Object.keys(LOCATION_NARRATIVES).find(k => 
    location.toLowerCase().includes(k.toLowerCase()) || 
    k.toLowerCase().includes(location.toLowerCase())
  );

  if (key) {
    const narrative = LOCATION_NARRATIVES[key];
    const randomReason = narrative.reasons[Math.floor(Math.random() * narrative.reasons.length)];
    return narrative.missionContext;
  }

  // Generic fallback for unknown locations
  return 'Your current mission parameters are classified, sir. I\'m monitoring your biometric status and combat readiness at all times.';
}
