// Weekend Simulator Data
// Track profiles, driver profiles, event tables, and session data

export const tracks = [
  {
    id: 'bahrain',
    name: 'Bahrain International Circuit',
    shortName: 'Bahrain',
    country: 'Bahrain',
    type: 'permanent',
    laps: 57,
    lapDistance: 5.412,
    overtakingDifficulty: 35,
    crashRisk: 30,
    tyreWear: 65,
    strategyImportance: 85,
    rainChance: 5,
    trackEvolution: 70,
    drsZones: 3,
    sectors: { s1: 28.5, s2: 33.2, s3: 29.8 }
  },
  {
    id: 'jeddah',
    name: 'Jeddah Corniche Circuit',
    shortName: 'Jeddah',
    country: 'Saudi Arabia',
    type: 'street',
    laps: 50,
    lapDistance: 6.174,
    overtakingDifficulty: 50,
    crashRisk: 75,
    tyreWear: 40,
    strategyImportance: 60,
    rainChance: 5,
    trackEvolution: 55,
    drsZones: 3,
    sectors: { s1: 30.1, s2: 27.4, s3: 32.0 }
  },
  {
    id: 'miami',
    name: 'Miami International Autodrome',
    shortName: 'Miami',
    country: 'United States',
    type: 'semi-street',
    laps: 57,
    lapDistance: 5.412,
    overtakingDifficulty: 40,
    crashRisk: 45,
    tyreWear: 55,
    strategyImportance: 70,
    rainChance: 25,
    trackEvolution: 65,
    drsZones: 3,
    sectors: { s1: 29.0, s2: 31.5, s3: 30.2 }
  },
  {
    id: 'monaco',
    name: 'Circuit de Monaco',
    shortName: 'Monaco',
    country: 'Monaco',
    type: 'street',
    laps: 78,
    lapDistance: 3.337,
    overtakingDifficulty: 95,
    crashRisk: 80,
    tyreWear: 35,
    strategyImportance: 70,
    rainChance: 30,
    trackEvolution: 40,
    drsZones: 1,
    sectors: { s1: 22.5, s2: 32.8, s3: 18.4 }
  },
  {
    id: 'silverstone',
    name: 'Silverstone Circuit',
    shortName: 'Silverstone',
    country: 'United Kingdom',
    type: 'permanent',
    laps: 52,
    lapDistance: 5.891,
    overtakingDifficulty: 40,
    crashRisk: 35,
    tyreWear: 70,
    strategyImportance: 80,
    rainChance: 50,
    trackEvolution: 60,
    drsZones: 2,
    sectors: { s1: 26.8, s2: 37.2, s3: 28.5 }
  },
  {
    id: 'spa',
    name: 'Circuit de Spa-Francorchamps',
    shortName: 'Spa',
    country: 'Belgium',
    type: 'permanent',
    laps: 44,
    lapDistance: 7.004,
    overtakingDifficulty: 30,
    crashRisk: 50,
    tyreWear: 55,
    strategyImportance: 75,
    rainChance: 55,
    trackEvolution: 50,
    drsZones: 2,
    sectors: { s1: 36.2, s2: 42.8, s3: 28.3 }
  },
  {
    id: 'monza',
    name: 'Autodromo Nazionale Monza',
    shortName: 'Monza',
    country: 'Italy',
    type: 'permanent',
    laps: 53,
    lapDistance: 5.793,
    overtakingDifficulty: 25,
    crashRisk: 40,
    tyreWear: 30,
    strategyImportance: 90,
    rainChance: 20,
    trackEvolution: 45,
    drsZones: 2,
    sectors: { s1: 26.0, s2: 27.5, s3: 28.8 }
  },
  {
    id: 'suzuka',
    name: 'Suzuka International Racing Course',
    shortName: 'Suzuka',
    country: 'Japan',
    type: 'permanent',
    laps: 53,
    lapDistance: 5.807,
    overtakingDifficulty: 55,
    crashRisk: 45,
    tyreWear: 60,
    strategyImportance: 65,
    rainChance: 40,
    trackEvolution: 55,
    drsZones: 1,
    sectors: { s1: 32.5, s2: 40.8, s3: 19.2 }
  },
  {
    id: 'singapore',
    name: 'Marina Bay Street Circuit',
    shortName: 'Singapore',
    country: 'Singapore',
    type: 'street',
    laps: 62,
    lapDistance: 4.940,
    overtakingDifficulty: 70,
    crashRisk: 65,
    tyreWear: 50,
    strategyImportance: 85,
    rainChance: 35,
    trackEvolution: 60,
    drsZones: 3,
    sectors: { s1: 33.0, s2: 37.5, s3: 29.0 }
  },
  {
    id: 'interlagos',
    name: 'Autódromo José Carlos Pace',
    shortName: 'Interlagos',
    country: 'Brazil',
    type: 'permanent',
    laps: 71,
    lapDistance: 4.309,
    overtakingDifficulty: 30,
    crashRisk: 45,
    tyreWear: 60,
    strategyImportance: 80,
    rainChance: 45,
    trackEvolution: 55,
    drsZones: 2,
    sectors: { s1: 20.5, s2: 30.8, s3: 22.2 }
  }
];

export const drivers = [
  {
    code: 'VER',
    name: 'Max Verstappen',
    team: 'Red Bull Racing',
    teamColor: '#3671C6',
    pace: 95,
    qualifying: 96,
    racecraft: 97,
    tyreManagement: 92,
    wetSkill: 88,
    aggression: 85,
    consistency: 93,
    startSkill: 90
  },
  {
    code: 'NOR',
    name: 'Lando Norris',
    team: 'McLaren',
    teamColor: '#FF8000',
    pace: 91,
    qualifying: 93,
    racecraft: 88,
    tyreManagement: 86,
    wetSkill: 82,
    aggression: 72,
    consistency: 85,
    startSkill: 78
  },
  {
    code: 'HAM',
    name: 'Lewis Hamilton',
    team: 'Ferrari',
    teamColor: '#E8002D',
    pace: 90,
    qualifying: 91,
    racecraft: 96,
    tyreManagement: 95,
    wetSkill: 97,
    aggression: 70,
    consistency: 92,
    startSkill: 88
  },
  {
    code: 'LEC',
    name: 'Charles Leclerc',
    team: 'Ferrari',
    teamColor: '#E8002D',
    pace: 92,
    qualifying: 95,
    racecraft: 86,
    tyreManagement: 82,
    wetSkill: 78,
    aggression: 80,
    consistency: 80,
    startSkill: 85
  },
  {
    code: 'RUS',
    name: 'George Russell',
    team: 'Mercedes',
    teamColor: '#27F4D2',
    pace: 89,
    qualifying: 92,
    racecraft: 84,
    tyreManagement: 88,
    wetSkill: 80,
    aggression: 75,
    consistency: 87,
    startSkill: 82
  },
  {
    code: 'ALO',
    name: 'Fernando Alonso',
    team: 'Aston Martin',
    teamColor: '#229971',
    pace: 85,
    qualifying: 86,
    racecraft: 95,
    tyreManagement: 93,
    wetSkill: 91,
    aggression: 78,
    consistency: 94,
    startSkill: 92
  },
  {
    code: 'PIA',
    name: 'Oscar Piastri',
    team: 'McLaren',
    teamColor: '#FF8000',
    pace: 89,
    qualifying: 90,
    racecraft: 83,
    tyreManagement: 84,
    wetSkill: 76,
    aggression: 70,
    consistency: 82,
    startSkill: 80
  },
  {
    code: 'SAI',
    name: 'Carlos Sainz',
    team: 'Williams',
    teamColor: '#1868DB',
    pace: 87,
    qualifying: 88,
    racecraft: 89,
    tyreManagement: 90,
    wetSkill: 83,
    aggression: 68,
    consistency: 88,
    startSkill: 86
  }
];

// Random events with probabilities and effects
export const randomEvents = {
  safety_car: {
    id: 'safety_car',
    name: 'Safety Car',
    icon: '🟡',
    severity: 'high',
    description: 'Safety car deployed after an incident',
    sessions: ['race'],
    baseChance: 40,
    effects: { positionSwing: [-3, 5], paceImpact: 0, tyreImpact: -15, strategyReset: true }
  },
  vsc: {
    id: 'vsc',
    name: 'Virtual Safety Car',
    icon: '🟠',
    severity: 'medium',
    description: 'Virtual safety car for debris on track',
    sessions: ['race'],
    baseChance: 30,
    effects: { positionSwing: [-1, 3], paceImpact: 0, tyreImpact: -10, strategyReset: false }
  },
  rain: {
    id: 'rain',
    name: 'Rain',
    icon: '🌧️',
    severity: 'high',
    description: 'Unexpected rain starts falling',
    sessions: ['practice', 'qualifying', 'race'],
    baseChance: 20,
    effects: { positionSwing: [-5, 8], paceImpact: -5, tyreImpact: 0, wetMultiplier: true }
  },
  traffic: {
    id: 'traffic',
    name: 'Traffic',
    icon: '🚦',
    severity: 'low',
    description: 'Caught in traffic during flying lap',
    sessions: ['qualifying'],
    baseChance: 35,
    effects: { positionSwing: [-2, 0], paceImpact: -3, tyreImpact: 0 }
  },
  lockup: {
    id: 'lockup',
    name: 'Lock-up',
    icon: '🔒',
    severity: 'medium',
    description: 'Front lock-up into a heavy braking zone',
    sessions: ['qualifying', 'race'],
    baseChance: 25,
    effects: { positionSwing: [-2, 0], paceImpact: -2, tyreImpact: 10, flatSpot: true }
  },
  drs_train: {
    id: 'drs_train',
    name: 'DRS Train',
    icon: '🚂',
    severity: 'low',
    description: 'Stuck in a DRS train, unable to overtake',
    sessions: ['race'],
    baseChance: 30,
    effects: { positionSwing: [0, 0], paceImpact: -2, tyreImpact: 5 }
  },
  crash_ahead: {
    id: 'crash_ahead',
    name: 'Crash Ahead',
    icon: '💥',
    severity: 'high',
    description: 'A car ahead crashes out of the race',
    sessions: ['race'],
    baseChance: 20,
    effects: { positionSwing: [1, 2], paceImpact: 0, tyreImpact: 0 }
  },
  slow_pit: {
    id: 'slow_pit',
    name: 'Slow Pit Stop',
    icon: '🔧',
    severity: 'medium',
    description: 'Pit crew struggles with a wheel gun',
    sessions: ['race'],
    baseChance: 15,
    effects: { positionSwing: [-2, -1], paceImpact: 0, tyreImpact: 0 }
  },
  team_error: {
    id: 'team_error',
    name: 'Strategy Error',
    icon: '📡',
    severity: 'medium',
    description: 'Team makes a poor strategy call on the pit wall',
    sessions: ['race'],
    baseChance: 10,
    effects: { positionSwing: [-3, -1], paceImpact: -1, tyreImpact: 5 }
  }
};

// Tyre compound data
export const tyreCompounds = {
  soft: { id: 'soft', name: 'Soft', color: '#E8002D', degradation: 1.4, pace: 1.0, abbr: 'S' },
  medium: { id: 'medium', name: 'Medium', color: '#FFD700', degradation: 1.0, pace: 0.6, abbr: 'M' },
  hard: { id: 'hard', name: 'Hard', color: '#FFFFFF', degradation: 0.7, pace: 0.0, abbr: 'H' },
  inter: { id: 'inter', name: 'Intermediate', color: '#39FF14', degradation: 0.9, pace: -2.0, abbr: 'I' },
  wet: { id: 'wet', name: 'Full Wet', color: '#00CFFF', degradation: 0.6, pace: -5.0, abbr: 'W' }
};

// Session decisions
export const sessionDecisions = {
  practice: [
    { id: 'push_lap', name: 'Push Lap', icon: '🔥', description: 'Go flat out for one-lap pace', effects: { pace: 8, tyreWear: 15, confidence: 5, setup: 2, risk: 20 } },
    { id: 'long_run', name: 'Long Run', icon: '📊', description: 'Extended stint to understand tyres', effects: { pace: 3, tyreWear: -5, confidence: 8, setup: 6, risk: 5 } },
    { id: 'tyre_save', name: 'Tyre Saving', icon: '🛡️', description: 'Focus on tyre preservation techniques', effects: { pace: -2, tyreWear: -12, confidence: 4, setup: 4, risk: 2 } },
    { id: 'fuel_heavy', name: 'Fuel-Heavy Setup', icon: '⛽', description: 'Simulate heavy fuel race conditions', effects: { pace: -5, tyreWear: 5, confidence: 6, setup: 10, risk: 3 } }
  ],
  qualifying: [
    { id: 'early_banker', name: 'Early Banker Lap', icon: '🏦', description: 'Set a safe time early in the session', effects: { paceGain: 3, positionBonus: 0, risk: 5, consistency: 10 } },
    { id: 'late_push', name: 'Late Push Lap', icon: '⚡', description: 'Wait for track evolution and push late', effects: { paceGain: 8, positionBonus: 2, risk: 25, consistency: -5 } },
    { id: 'tow', name: 'Tow from Teammate', icon: '🤝', description: 'Follow your teammate for a tow on straights', effects: { paceGain: 5, positionBonus: 1, risk: 15, consistency: 3 } },
    { id: 'wet_gamble', name: 'Risk Wet Tyres', icon: '🎲', description: 'Gamble on mixed conditions', effects: { paceGain: 15, positionBonus: 5, risk: 60, consistency: -15 } }
  ],
  race: [
    { id: 'aggressive_start', name: 'Aggressive Start', icon: '🚀', description: 'Attack hard into Turn 1', effects: { positionGain: 3, tyreWear: 10, riskPenalty: 25, overtakes: 2 } },
    { id: 'conservative_start', name: 'Conservative Start', icon: '🛡️', description: 'Play it safe off the line', effects: { positionGain: -1, tyreWear: 2, riskPenalty: 5, overtakes: 0 } },
    { id: 'undercut', name: 'Undercut Strategy', icon: '⬇️', description: 'Pit early to gain track position', effects: { positionGain: 2, tyreWear: 8, riskPenalty: 10, overtakes: 1 } },
    { id: 'overcut', name: 'Overcut Strategy', icon: '⬆️', description: 'Stay out and gain through fresher tyres later', effects: { positionGain: 1, tyreWear: -5, riskPenalty: 15, overtakes: 1 } },
    { id: 'pit_early', name: 'Pit Early', icon: '🔄', description: 'Box for fresh rubber at the first opportunity', effects: { positionGain: 1, tyreWear: -15, riskPenalty: 8, overtakes: 0 } },
    { id: 'extend_stint', name: 'Extend Stint', icon: '⏳', description: 'Push the tyres to the limit before pitting', effects: { positionGain: 0, tyreWear: 15, riskPenalty: 20, overtakes: 0 } }
  ]
};

// Grid of "other" drivers for classification
export const fieldDrivers = [
  { code: 'PER', name: 'Sergio Perez', basePace: 82 },
  { code: 'STR', name: 'Lance Stroll', basePace: 72 },
  { code: 'GAS', name: 'Pierre Gasly', basePace: 78 },
  { code: 'OCO', name: 'Esteban Ocon', basePace: 76 },
  { code: 'TSU', name: 'Yuki Tsunoda', basePace: 77 },
  { code: 'MAG', name: 'Kevin Magnussen', basePace: 70 },
  { code: 'HUL', name: 'Nico Hulkenberg', basePace: 74 },
  { code: 'BOT', name: 'Valtteri Bottas', basePace: 75 },
  { code: 'ZHO', name: 'Guanyu Zhou', basePace: 68 },
  { code: 'ALB', name: 'Alexander Albon', basePace: 79 },
  { code: 'DEV', name: 'Nyck de Vries', basePace: 66 },
  { code: 'SAR', name: 'Logan Sargeant', basePace: 64 }
];

// F1 points system
export const pointsSystem = {
  1: 25, 2: 18, 3: 15, 4: 12, 5: 10,
  6: 8, 7: 6, 8: 4, 9: 2, 10: 1
};

// Practice feedback templates
export const practiceFeedback = {
  push_lap: {
    good: [
      'Strong one-lap pace. The car felt hooked up through the high-speed sections.',
      'Quick lap time set. Good confidence builder ahead of qualifying.',
      'Impressive pace recorded. The car balance is working well on low fuel.'
    ],
    bad: [
      'Push lap showed pace, but front tyre wear is concerning.',
      'Fast time set, but the rear was unstable through slow corners.',
      'One-lap pace was decent, but a lock-up into T1 cost you time.'
    ]
  },
  long_run: {
    good: [
      'Excellent long-run data collected. Tyre degradation is well understood.',
      'Strong consistency across the stint. Race pace looks competitive.',
      'Good data from the long run. The car is stable in high-speed corners.'
    ],
    bad: [
      'Long run showed high front-left tyre wear. Strategy may need adjustment.',
      'Race pace is average. The car loses grip after 10 laps on softs.',
      'Inconsistent stint — lap times varied by over 0.8s.'
    ]
  },
  tyre_save: {
    good: [
      'Tyre preservation looks manageable. Stints can be extended in the race.',
      'Smooth driving paid off — minimal graining observed.',
      'Tyre data is excellent. Medium compound looks viable for a longer first stint.'
    ],
    bad: [
      'Tyre saving mode showed limited pace. May struggle in traffic.',
      'Even with saving, the rears are overheating. Setup changes needed.',
      'Comfortable on tyres but one-lap pace might suffer in quali.'
    ]
  },
  fuel_heavy: {
    good: [
      'Heavy fuel run was productive. Car balance improves as fuel burns off.',
      'Good race simulation data. The car handles well with high fuel.',
      'Race start conditions replicated well. Confidence is high.'
    ],
    bad: [
      'Heavy fuel run showed understeer on corner entry.',
      'Car is sluggish on high fuel. First stint could be difficult.',
      'Fuel-heavy pace was below expectations. Setup tweaks required.'
    ]
  }
};

export default {
  tracks,
  drivers,
  randomEvents,
  tyreCompounds,
  sessionDecisions,
  fieldDrivers,
  pointsSystem,
  practiceFeedback
};
