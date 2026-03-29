import express from 'express';
import weekendData from '../data/weekendData.js';

const router = express.Router();

const { tracks, drivers, randomEvents, tyreCompounds, sessionDecisions, fieldDrivers, pointsSystem, practiceFeedback } = weekendData;

// GET /api/weekend/tracks
router.get('/tracks', (req, res) => {
  res.json(tracks);
});

// GET /api/weekend/drivers
router.get('/drivers', (req, res) => {
  res.json(drivers);
});

// GET /api/weekend/session
router.get('/session', (req, res) => {
  const { track, driver, stage } = req.query;

  if (!track || !driver || !stage) {
    return res.status(400).json({ error: 'Missing required parameters: track, driver, stage' });
  }

  const trackData = tracks.find(t => t.id === track);
  const driverData = drivers.find(d => d.code === driver);

  if (!trackData || !driverData) {
    return res.status(400).json({ error: 'Invalid track or driver' });
  }

  const decisions = sessionDecisions[stage] || [];

  res.json({
    track: trackData,
    driver: driverData,
    stage,
    decisions,
    objectives: getSessionObjective(stage),
    recommendations: getRecommendations(stage, trackData, driverData)
  });
});

// POST /api/weekend/simulate
router.post('/simulate', (req, res) => {
  const { track, driver, session, choice, state } = req.body;

  if (!track || !driver || !session || !choice) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  const trackData = tracks.find(t => t.id === track);
  const driverData = drivers.find(d => d.code === driver);

  if (!trackData || !driverData) {
    return res.status(400).json({ error: 'Invalid track or driver' });
  }

  let result;
  switch (session) {
    case 'practice':
      result = simulatePractice(trackData, driverData, choice, state);
      break;
    case 'qualifying':
      result = simulateQualifying(trackData, driverData, choice, state);
      break;
    case 'race':
      result = simulateRace(trackData, driverData, choice, state);
      break;
    default:
      return res.status(400).json({ error: 'Invalid session type' });
  }

  res.json(result);
});

// POST /api/weekend/reset
router.post('/reset', (req, res) => {
  res.json({
    success: true,
    state: getInitialState()
  });
});

// ─── Helper Functions ────────────────────────

function getInitialState() {
  return {
    pace: 50,
    tyreWear: 0,
    confidence: 50,
    setupRating: 40,
    gridPosition: 10,
    racePosition: 10,
    totalOvertakes: 0,
    pitStops: 0,
    events: [],
    decisions: [],
    practiceResult: null,
    qualifyingResult: null,
    raceResult: null,
    lapTimes: [],
    stints: [],
    sectorTimes: { s1: 0, s2: 0, s3: 0 }
  };
}

function getSessionObjective(stage) {
  const objectives = {
    practice: 'Find pace and manage tyre wear',
    qualifying: 'Push for grid position',
    race: 'Convert strategy into result'
  };
  return objectives[stage] || '';
}

function getRecommendations(stage, track, driver) {
  const recs = [];
  if (stage === 'practice') {
    if (track.tyreWear > 60) recs.push('High tyre wear circuit — consider a long run to understand degradation');
    if (driver.pace > 90) recs.push('Strong pace profile — a push lap could build confidence');
    if (track.type === 'street') recs.push('Street circuit — building confidence is key');
    recs.push('Use practice data to inform qualifying and race strategy');
  } else if (stage === 'qualifying') {
    if (track.overtakingDifficulty > 70) recs.push('Overtaking is hard here — qualifying position is critical');
    if (driver.qualifying > 90) recs.push('Strong qualifier — late push lap could maximize potential');
    if (track.rainChance > 40) recs.push('Rain risk is high — consider wet tyre gamble if conditions change');
    recs.push('Track evolution improves lap times as the session progresses');
  } else if (stage === 'race') {
    if (track.strategyImportance > 75) recs.push('Strategy is crucial here — timing your pit stops matters');
    if (track.overtakingDifficulty < 40) recs.push('Good overtaking opportunities — aggressive start possible');
    if (driver.tyreManagement > 90) recs.push('Excellent tyre management — extending stints is viable');
    recs.push('Monitor random events — a safety car could change everything');
  }
  return recs;
}

function rollEvent(session, track) {
  const sessionEvents = Object.values(randomEvents).filter(e => e.sessions.includes(session));
  const triggeredEvents = [];

  for (const event of sessionEvents) {
    let chance = event.baseChance;

    // Track modifiers
    if (event.id === 'rain') chance = track.rainChance;
    if (event.id === 'traffic' && track.type === 'street') chance += 20;
    if (event.id === 'crash_ahead' && track.crashRisk > 60) chance += 15;
    if (event.id === 'safety_car' && track.crashRisk > 60) chance += 10;
    if (event.id === 'drs_train' && track.overtakingDifficulty > 60) chance += 20;

    const roll = Math.random() * 100;
    if (roll < chance) {
      triggeredEvents.push(event);
    }
  }

  // Return max 2 events per session simulation
  return triggeredEvents.slice(0, 2);
}

function simulatePractice(track, driver, choice, prevState) {
  const state = { ...(prevState || getInitialState()) };
  const decision = sessionDecisions.practice.find(d => d.id === choice);
  if (!decision) return { error: 'Invalid practice choice' };

  const events = rollEvent('practice', track);
  const isRain = events.some(e => e.id === 'rain');

  // Apply decision effects
  let paceGain = decision.effects.pace * (driver.pace / 100);
  let wearChange = decision.effects.tyreWear * (track.tyreWear / 50);
  let confGain = decision.effects.confidence;
  let setupGain = decision.effects.setup;

  // Event impacts
  if (isRain) {
    paceGain *= (driver.wetSkill / 100);
    confGain -= 5;
  }

  // Random variance
  paceGain += (Math.random() - 0.5) * 4;
  confGain += (Math.random() - 0.5) * 3;

  state.pace = clamp(state.pace + paceGain, 0, 100);
  state.tyreWear = clamp(state.tyreWear + Math.max(0, wearChange), 0, 100);
  state.confidence = clamp(state.confidence + confGain, 0, 100);
  state.setupRating = clamp(state.setupRating + setupGain, 0, 100);
  state.decisions.push({ session: 'practice', choice, effects: decision.effects });

  // Generate lap times
  const baseLap = track.sectors.s1 + track.sectors.s2 + track.sectors.s3;
  const driverFactor = 1 + ((100 - driver.pace) / 200);
  const paceFactor = 1 + ((100 - state.pace) / 300);
  const lapTimes = [];
  for (let i = 0; i < 5; i++) {
    const degradation = 1 + (i * 0.003 * (track.tyreWear / 50));
    const variance = 1 + (Math.random() - 0.5) * 0.008;
    const lapTime = baseLap * driverFactor * paceFactor * degradation * variance;
    lapTimes.push(parseFloat(lapTime.toFixed(3)));
  }
  state.lapTimes = lapTimes;

  // Sector times
  state.sectorTimes = {
    s1: parseFloat((track.sectors.s1 * driverFactor * paceFactor + (Math.random() - 0.5) * 0.3).toFixed(3)),
    s2: parseFloat((track.sectors.s2 * driverFactor * paceFactor + (Math.random() - 0.5) * 0.3).toFixed(3)),
    s3: parseFloat((track.sectors.s3 * driverFactor * paceFactor + (Math.random() - 0.5) * 0.3).toFixed(3))
  };

  // Feedback
  const feedbackPool = practiceFeedback[choice] || practiceFeedback.push_lap;
  const quality = state.pace > 65 ? 'good' : 'bad';
  const feedback = feedbackPool[quality][Math.floor(Math.random() * feedbackPool[quality].length)];

  // Wear indicators per compound
  const tyreData = {
    soft: { wear: clamp(state.tyreWear * 1.4, 0, 100), stintLaps: Math.round(20 - state.tyreWear * 0.12) },
    medium: { wear: clamp(state.tyreWear * 0.8, 0, 100), stintLaps: Math.round(30 - state.tyreWear * 0.1) },
    hard: { wear: clamp(state.tyreWear * 0.5, 0, 100), stintLaps: Math.round(40 - state.tyreWear * 0.08) }
  };

  state.practiceResult = {
    pace: state.pace,
    tyreWear: state.tyreWear,
    confidence: state.confidence,
    setupRating: state.setupRating,
    lapTimes,
    sectorTimes: state.sectorTimes,
    feedback,
    tyreData,
    events: events.map(e => ({ id: e.id, name: e.name, icon: e.icon, severity: e.severity, description: e.description }))
  };

  return {
    success: true,
    sessionResult: state.practiceResult,
    updatedState: state,
    event: events.length > 0 ? events.map(e => ({ id: e.id, name: e.name, icon: e.icon, severity: e.severity, description: e.description })) : null,
    nextRecommendation: `Practice ${quality === 'good' ? 'went well' : 'needs review'}. Prepare for qualifying.`,
    progress: 'practice_complete'
  };
}

function simulateQualifying(track, driver, choice, prevState) {
  const state = { ...(prevState || getInitialState()) };
  const decision = sessionDecisions.qualifying.find(d => d.id === choice);
  if (!decision) return { error: 'Invalid qualifying choice' };

  const events = rollEvent('qualifying', track);
  const isRain = events.some(e => e.id === 'rain');
  const isTraffic = events.some(e => e.id === 'traffic');

  // Base qualifying score
  let qualiScore = (driver.qualifying * 0.5) + (state.pace * 0.3) + (state.confidence * 0.2);

  // Apply decision effects
  qualiScore += decision.effects.paceGain;
  let posBonus = decision.effects.positionBonus;
  const riskRoll = Math.random() * 100;
  const riskThreshold = decision.effects.risk;

  // Risk check
  if (riskRoll < riskThreshold) {
    qualiScore -= (riskThreshold * 0.3);
    posBonus -= 2;
  }

  // Event impacts
  if (isRain) {
    if (choice === 'wet_gamble') {
      qualiScore += 15;
      posBonus += 4;
    } else {
      qualiScore -= 8;
      posBonus -= 2;
    }
    qualiScore *= (driver.wetSkill / 100);
  }
  if (isTraffic) {
    qualiScore -= 5;
    posBonus -= 1;
  }

  // Random variance
  qualiScore += (Math.random() - 0.5) * 10;

  // Generate grid from field
  const fieldScores = fieldDrivers.map(fd => ({
    code: fd.code,
    name: fd.name,
    score: fd.basePace + (Math.random() - 0.5) * 15
  }));

  // Include selectable drivers minus user
  const otherDrivers = drivers.filter(d => d.code !== driver.code).map(d => ({
    code: d.code,
    name: d.name,
    score: (d.qualifying * 0.6 + d.pace * 0.4) + (Math.random() - 0.5) * 10
  }));

  const allDrivers = [...otherDrivers, ...fieldScores, { code: driver.code, name: driver.name, score: qualiScore }];
  allDrivers.sort((a, b) => b.score - a.score);

  const gridPosition = allDrivers.findIndex(d => d.code === driver.code) + 1;
  state.gridPosition = gridPosition;

  // Sector times for quali
  const baseLap = track.sectors.s1 + track.sectors.s2 + track.sectors.s3;
  const qualiFactor = 1 + ((100 - qualiScore) / 200);
  const s1 = parseFloat((track.sectors.s1 * qualiFactor + (Math.random() - 0.5) * 0.2).toFixed(3));
  const s2 = parseFloat((track.sectors.s2 * qualiFactor + (Math.random() - 0.5) * 0.2).toFixed(3));
  const s3 = parseFloat((track.sectors.s3 * qualiFactor + (Math.random() - 0.5) * 0.2).toFixed(3));
  const bestLap = parseFloat((s1 + s2 + s3).toFixed(3));

  // Gap to pole
  const poleScore = allDrivers[0].score;
  const poleFactor = 1 + ((100 - poleScore) / 200);
  const poleLap = parseFloat((baseLap * poleFactor).toFixed(3));
  const gapToPole = parseFloat((bestLap - poleLap).toFixed(3));

  // Top 10 grid
  const grid = allDrivers.slice(0, 20).map((d, i) => ({
    position: i + 1,
    code: d.code,
    name: d.name,
    isUser: d.code === driver.code
  }));

  state.decisions.push({ session: 'qualifying', choice, effects: decision.effects });

  state.qualifyingResult = {
    gridPosition,
    bestLap,
    sectorTimes: { s1, s2, s3 },
    gapToPole: gapToPole > 0 ? `+${gapToPole}` : gapToPole.toString(),
    grid,
    qualiScore: Math.round(qualiScore),
    choiceImpact: riskRoll < riskThreshold ? 'Strategy backfired — risk penalty applied' : 'Strategy paid off — good execution',
    events: events.map(e => ({ id: e.id, name: e.name, icon: e.icon, severity: e.severity, description: e.description }))
  };

  return {
    success: true,
    sessionResult: state.qualifyingResult,
    updatedState: state,
    event: events.length > 0 ? events.map(e => ({ id: e.id, name: e.name, icon: e.icon, severity: e.severity, description: e.description })) : null,
    nextRecommendation: `P${gridPosition} on the grid. ${gridPosition <= 5 ? 'Strong position for the race.' : 'Work to do on Sunday.'}`,
    progress: 'qualifying_complete'
  };
}

function simulateRace(track, driver, choice, prevState) {
  const state = { ...(prevState || getInitialState()) };
  const decision = sessionDecisions.race.find(d => d.id === choice);
  if (!decision) return { error: 'Invalid race choice' };

  const events = rollEvent('race', track);
  const isRain = events.some(e => e.id === 'rain');
  const isSC = events.some(e => e.id === 'safety_car');
  const isVSC = events.some(e => e.id === 'vsc');
  const isCrash = events.some(e => e.id === 'crash_ahead');
  const isSlowPit = events.some(e => e.id === 'slow_pit');
  const isDRS = events.some(e => e.id === 'drs_train');
  const isLockup = events.some(e => e.id === 'lockup');
  const isTeamError = events.some(e => e.id === 'team_error');

  let startPos = state.gridPosition || 10;
  let currentPos = startPos;
  let bestPos = startPos;
  let totalOvertakes = 0;
  let pitStops = 0;
  let totalTyreWear = state.tyreWear || 0;
  let timeLostToEvents = 0;

  // Start phase
  let posChange = decision.effects.positionGain;
  const startRoll = Math.random() * 100;
  if (startRoll < decision.effects.riskPenalty) {
    posChange = Math.min(posChange, 0);
    posChange -= Math.floor(Math.random() * 2);
  } else {
    posChange += Math.floor((driver.startSkill - 80) / 10);
  }
  currentPos = clamp(currentPos - posChange, 1, 20);
  totalOvertakes += Math.max(0, startPos - currentPos);

  // Tyre wear from choice
  totalTyreWear += decision.effects.tyreWear;

  // Event impacts
  if (isSC) {
    const scEffect = Math.random() > 0.5 ? 2 : -1;
    currentPos = clamp(currentPos - scEffect, 1, 20);
    totalTyreWear -= 15;
    timeLostToEvents += 0;
    if (scEffect > 0) totalOvertakes += scEffect;
  }
  if (isVSC) {
    const vscEffect = Math.random() > 0.6 ? 1 : 0;
    currentPos = clamp(currentPos - vscEffect, 1, 20);
    totalTyreWear -= 8;
  }
  if (isRain) {
    const wetFactor = (driver.wetSkill - 80) / 15;
    const rainEffect = Math.round(wetFactor + (Math.random() - 0.5) * 3);
    currentPos = clamp(currentPos - rainEffect, 1, 20);
    if (rainEffect > 0) totalOvertakes += rainEffect;
  }
  if (isCrash) {
    currentPos = clamp(currentPos - 1, 1, 20);
    totalOvertakes += 1;
  }
  if (isSlowPit) {
    currentPos = clamp(currentPos + 2, 1, 20);
    timeLostToEvents += 3.5;
  }
  if (isDRS) {
    timeLostToEvents += 5;
  }
  if (isLockup) {
    totalTyreWear += 10;
    timeLostToEvents += 1.2;
  }
  if (isTeamError) {
    currentPos = clamp(currentPos + 2, 1, 20);
    timeLostToEvents += 8;
  }

  // Racecraft and tyre management factors
  const racecraftFactor = (driver.racecraft - 80) / 20;
  const tyreFactor = (driver.tyreManagement - 80) / 25;

  // Mid-race progression
  const raceGain = Math.round(racecraftFactor * 2 + tyreFactor + (Math.random() - 0.5) * 2);
  currentPos = clamp(currentPos - raceGain, 1, 20);
  if (raceGain > 0) totalOvertakes += raceGain;

  // Setup bonus from practice
  if (state.setupRating > 70) {
    currentPos = clamp(currentPos - 1, 1, 20);
  }
  if (state.confidence > 70) {
    currentPos = clamp(currentPos - 1, 1, 20);
  }

  bestPos = Math.min(bestPos, currentPos);
  totalTyreWear = clamp(totalTyreWear, 0, 100);

  // Pit stops based on strategy
  if (choice === 'pit_early' || choice === 'undercut') {
    pitStops = 2;
  } else if (choice === 'extend_stint' || choice === 'overcut') {
    pitStops = 1;
  } else {
    pitStops = Math.random() > 0.4 ? 2 : 1;
  }

  // Build stints
  const stints = [];
  if (pitStops === 1) {
    stints.push({ compound: 'medium', laps: Math.round(track.laps * 0.55), wear: clamp(totalTyreWear * 0.6, 0, 100) });
    stints.push({ compound: 'hard', laps: Math.round(track.laps * 0.45), wear: clamp(totalTyreWear * 0.3, 0, 100) });
  } else {
    stints.push({ compound: 'soft', laps: Math.round(track.laps * 0.25), wear: clamp(totalTyreWear * 0.8, 0, 100) });
    stints.push({ compound: 'medium', laps: Math.round(track.laps * 0.4), wear: clamp(totalTyreWear * 0.5, 0, 100) });
    stints.push({ compound: 'hard', laps: Math.round(track.laps * 0.35), wear: clamp(totalTyreWear * 0.25, 0, 100) });
  }
  if (isRain) {
    stints.push({ compound: 'inter', laps: Math.round(track.laps * 0.15), wear: 20 });
  }

  // Final position
  const finalPos = clamp(currentPos, 1, 20);
  const points = pointsSystem[finalPos] || 0;

  // Gap to winner
  const gapToWinner = finalPos === 1 ? '—' : `+${(finalPos * 2.5 + Math.random() * 8).toFixed(1)}s`;

  // Rating
  let rating, ratingColor;
  if (finalPos <= 3) { rating = 'Excellent'; ratingColor = '#39FF14'; }
  else if (finalPos <= 6) { rating = 'Strong'; ratingColor = '#00CFFF'; }
  else if (finalPos <= 10) { rating = 'Solid'; ratingColor = '#FFD700'; }
  else if (finalPos <= 15) { rating = 'Mixed'; ratingColor = '#FF8000'; }
  else { rating = 'Poor'; ratingColor = '#E8002D'; }

  // Race timeline
  const timeline = [];
  timeline.push({ lap: 1, event: 'Race Start', detail: `${choice === 'aggressive_start' ? 'Aggressive launch' : 'Measured getaway'} — P${startPos} → P${clamp(startPos - posChange, 1, 20)}` });
  if (pitStops >= 1) timeline.push({ lap: Math.round(track.laps * 0.3), event: 'Pit Stop 1', detail: `Box, box. ${stints[1]?.compound || 'medium'} compound fitted.` });
  events.forEach(e => {
    timeline.push({ lap: Math.round(10 + Math.random() * (track.laps - 20)), event: e.name, detail: e.description });
  });
  if (pitStops >= 2) timeline.push({ lap: Math.round(track.laps * 0.6), event: 'Pit Stop 2', detail: `Second stop. ${stints[2]?.compound || 'hard'} compound fitted.` });
  timeline.push({ lap: track.laps, event: 'Chequered Flag', detail: `Finished P${finalPos}. ${points > 0 ? points + ' points scored.' : 'Outside the points.'}` });
  timeline.sort((a, b) => a.lap - b.lap);

  state.decisions.push({ session: 'race', choice, effects: decision.effects });

  // Analysis
  const bestDecision = state.decisions.reduce((best, d) => {
    const impact = Object.values(d.effects).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0);
    if (!best || impact > best.impact) return { ...d, impact };
    return best;
  }, null);

  const worstDecision = state.decisions.reduce((worst, d) => {
    const impact = Object.values(d.effects).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0);
    if (!worst || impact < worst.impact) return { ...d, impact };
    return worst;
  }, null);

  // Summary narrative
  const narratives = [];
  if (finalPos < startPos) narratives.push(`Gained ${startPos - finalPos} positions from P${startPos} — strong race execution.`);
  if (finalPos > startPos) narratives.push(`Lost ${finalPos - startPos} positions from P${startPos} — a tough afternoon.`);
  if (isSC) narratives.push('A safety car reshuffled the field and changed the complexion of the race.');
  if (isRain) narratives.push(`Rain arrived mid-race — ${driver.wetSkill > 85 ? 'your wet-weather skills shone through.' : 'conditions were tricky to manage.'}`);
  if (totalOvertakes > 3) narratives.push(`${totalOvertakes} overtakes made — an attacking drive through the field.`);
  if (totalTyreWear > 70) narratives.push('Heavy tyre degradation cost lap time in the closing stages.');
  if (points > 0 && finalPos <= 3) narratives.push('A podium finish — outstanding weekend!');
  if (narratives.length === 0) narratives.push('A solid drive with no major incidents.');

  state.raceResult = {
    startPosition: startPos,
    finalPosition: finalPos,
    bestPosition: bestPos,
    points,
    gapToWinner,
    rating,
    ratingColor,
    totalOvertakes,
    pitStops,
    tyreWear: Math.round(totalTyreWear),
    timeLostToEvents: parseFloat(timeLostToEvents.toFixed(1)),
    stints,
    timeline,
    events: events.map(e => ({ id: e.id, name: e.name, icon: e.icon, severity: e.severity, description: e.description })),
    narrative: narratives,
    analysis: {
      bestDecision: bestDecision ? `${bestDecision.session}: ${bestDecision.choice}` : 'N/A',
      worstDecision: worstDecision ? `${worstDecision.session}: ${worstDecision.choice}` : 'N/A',
      biggestSwing: isSC ? 'Safety Car' : isRain ? 'Rain' : isCrash ? 'Crash Ahead' : 'N/A',
      eventImpact: events.length > 0 ? `${events.length} event(s) affected the race` : 'Clean race — no major events'
    },
    weekendSummary: {
      practice: state.practiceResult ? `Pace: ${Math.round(state.practiceResult.pace)}% | Setup: ${Math.round(state.practiceResult.setupRating)}%` : 'N/A',
      qualifying: state.qualifyingResult ? `Grid: P${state.qualifyingResult.gridPosition} | Gap: ${state.qualifyingResult.gapToPole}` : 'N/A',
      race: `Finish: P${finalPos} | ${points} pts | ${totalOvertakes} overtakes`
    }
  };

  return {
    success: true,
    sessionResult: state.raceResult,
    updatedState: state,
    event: events.length > 0 ? events.map(e => ({ id: e.id, name: e.name, icon: e.icon, severity: e.severity, description: e.description })) : null,
    nextRecommendation: `Race complete. P${finalPos} finish.`,
    progress: 'race_complete'
  };
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export default router;
