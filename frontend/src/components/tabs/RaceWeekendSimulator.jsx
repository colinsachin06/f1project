import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Line, Bar } from 'react-chartjs-2';

// ─── Constants ────────────────────────────────────

const SESSIONS = ['practice', 'qualifying', 'race', 'results'];
const SESSION_LABELS = { practice: 'PRACTICE', qualifying: 'QUALIFYING', race: 'RACE', results: 'RESULTS' };
const SESSION_ICONS = { practice: 'FP', qualifying: 'Q', race: 'R', results: '🏁' };

const COMPOUND_COLORS = {
  soft: '#E8002D',
  medium: '#FFD700',
  hard: '#FFFFFF',
  inter: '#39FF14',
  wet: '#00CFFF'
};

const SEVERITY_COLORS = {
  low: '#FFD700',
  medium: '#FF8000',
  high: '#E8002D'
};

// ─── Styles ────────────────────────────────────

const styles = {
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    background: 'linear-gradient(180deg, #0a0a0f 0%, #12121a 100%)',
  },
  header: {
    padding: '16px 24px 12px',
    borderBottom: '1px solid var(--border)',
    background: 'var(--panel)',
    flexShrink: 0,
  },
  headerTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '14px',
  },
  title: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '16px',
    fontWeight: 700,
    color: 'var(--text)',
    letterSpacing: '3px',
  },
  subtitle: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '12px',
    color: 'var(--muted)',
    letterSpacing: '1px',
    marginTop: '4px',
  },
  headerMeta: {
    display: 'flex',
    gap: '20px',
    alignItems: 'center',
  },
  metaBadge: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '9px',
    fontWeight: 600,
    letterSpacing: '1.5px',
    padding: '4px 10px',
    borderRadius: '3px',
    background: 'rgba(232,0,45,0.1)',
    border: '1px solid rgba(232,0,45,0.3)',
    color: 'var(--red)',
  },
  progressTracker: {
    display: 'flex',
    gap: '0',
    alignItems: 'center',
  },
  body: {
    flex: 1,
    display: 'flex',
    overflow: 'hidden',
  },
  leftPanel: {
    width: '320px',
    minWidth: '320px',
    borderRight: '1px solid var(--border)',
    background: 'var(--panel)',
    overflowY: 'auto',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  rightPanel: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px 24px',
  },
  panelTitle: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '9px',
    fontWeight: 700,
    letterSpacing: '2.5px',
    color: 'var(--muted)',
    textTransform: 'uppercase',
    marginBottom: '10px',
  },
  card: {
    background: 'var(--panel2)',
    border: '1px solid var(--border)',
    borderRadius: '4px',
    padding: '14px',
  },
  cardTitle: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '8px',
    fontWeight: 700,
    letterSpacing: '2px',
    color: 'var(--muted2)',
    textTransform: 'uppercase',
    marginBottom: '10px',
  },
  btn: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '9px',
    fontWeight: 700,
    letterSpacing: '2px',
    padding: '10px 16px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s',
    width: '100%',
  },
  btnPrimary: {
    background: 'var(--red)',
    color: '#fff',
  },
  btnSecondary: {
    background: 'var(--panel2)',
    border: '1px solid var(--border)',
    color: 'var(--text)',
  },
  btnGhost: {
    background: 'transparent',
    border: '1px solid var(--border)',
    color: 'var(--muted)',
  },
  select: {
    width: '100%',
    fontFamily: 'Barlow Condensed, sans-serif',
    background: 'var(--panel2)',
    border: '1px solid var(--border)',
    color: 'var(--text)',
    padding: '8px 12px',
    borderRadius: '4px',
    fontSize: '14px',
    outline: 'none',
    cursor: 'pointer',
  },
  chip: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '9px',
    fontWeight: 600,
    letterSpacing: '1.5px',
    padding: '6px 12px',
    borderRadius: '3px',
    border: '1px solid var(--border)',
    background: 'var(--panel2)',
    color: 'var(--muted)',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  chipActive: {
    background: 'rgba(232,0,45,0.15)',
    border: '1px solid var(--red)',
    color: 'var(--red)',
  },
  statRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '6px 0',
    borderBottom: '1px solid rgba(28,31,40,0.5)',
  },
  statLabel: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '13px',
    color: 'var(--muted2)',
    letterSpacing: '0.5px',
  },
  statValue: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--text)',
  },
  chartCard: {
    background: 'var(--panel)',
    border: '1px solid var(--border)',
    borderRadius: '4px',
    padding: '16px',
    marginBottom: '16px',
  },
};

// ─── Chart defaults ────────────────────────────────────

const chartDefaults = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#111318',
      titleFont: { family: 'Orbitron', size: 9 },
      bodyFont: { family: 'Barlow Condensed', size: 13 },
      borderColor: '#1C1F28',
      borderWidth: 1,
      padding: 10,
    },
  },
  scales: {
    x: {
      grid: { color: 'rgba(28,31,40,0.5)' },
      ticks: { color: '#4E5266', font: { family: 'Barlow Condensed', size: 11 } },
    },
    y: {
      grid: { color: 'rgba(28,31,40,0.5)' },
      ticks: { color: '#4E5266', font: { family: 'Orbitron', size: 9 } },
    },
  },
};

// ─── Sub-Components ────────────────────────────────────

function ProgressStep({ step, index, currentIndex, completedIndex }) {
  const isCompleted = index < completedIndex;
  const isActive = index === currentIndex;
  const isLocked = index > currentIndex;

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {index > 0 && (
        <div style={{
          width: '32px',
          height: '2px',
          background: isCompleted ? 'var(--green)' : isActive ? 'var(--red)' : 'var(--border)',
          transition: 'background 0.3s',
        }} />
      )}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '5px 10px',
        borderRadius: '3px',
        background: isActive ? 'rgba(232,0,45,0.1)' : isCompleted ? 'rgba(57,255,20,0.06)' : 'transparent',
        border: `1px solid ${isActive ? 'var(--red)' : isCompleted ? 'rgba(57,255,20,0.3)' : 'var(--border)'}`,
        transition: 'all 0.3s',
      }}>
        <span style={{
          fontFamily: 'Orbitron',
          fontSize: '8px',
          fontWeight: 700,
          color: isActive ? 'var(--red)' : isCompleted ? 'var(--green)' : 'var(--muted)',
          letterSpacing: '1.5px',
          opacity: isLocked ? 0.4 : 1,
        }}>
          {SESSION_ICONS[step]}
        </span>
        <span style={{
          fontFamily: 'Orbitron',
          fontSize: '8px',
          fontWeight: 600,
          color: isActive ? 'var(--text)' : isCompleted ? 'var(--green)' : 'var(--muted)',
          letterSpacing: '1.5px',
          opacity: isLocked ? 0.4 : 1,
        }}>
          {SESSION_LABELS[step]}
        </span>
      </div>
    </div>
  );
}

function MetricBar({ label, value, max = 100, color = 'var(--red)', suffix = '%' }) {
  return (
    <div style={{ marginBottom: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
        <span style={styles.statLabel}>{label}</span>
        <span style={{ ...styles.statValue, color, fontSize: '11px' }}>
          {Math.round(value)}{suffix}
        </span>
      </div>
      <div style={{ height: '4px', background: 'var(--border)', borderRadius: '2px', overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(value / max) * 100}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{ height: '100%', background: color, borderRadius: '2px' }}
        />
      </div>
    </div>
  );
}

function EventBadge({ event }) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '5px 10px',
        borderRadius: '3px',
        background: `${SEVERITY_COLORS[event.severity]}11`,
        border: `1px solid ${SEVERITY_COLORS[event.severity]}44`,
        marginRight: '6px',
        marginBottom: '6px',
      }}
    >
      <span style={{ fontSize: '12px' }}>{event.icon}</span>
      <span style={{
        fontFamily: 'Orbitron',
        fontSize: '8px',
        fontWeight: 600,
        color: SEVERITY_COLORS[event.severity],
        letterSpacing: '1px',
      }}>
        {event.name}
      </span>
      <span style={{
        fontFamily: 'Orbitron',
        fontSize: '7px',
        fontWeight: 600,
        padding: '1px 5px',
        borderRadius: '2px',
        background: `${SEVERITY_COLORS[event.severity]}22`,
        color: SEVERITY_COLORS[event.severity],
        letterSpacing: '1px',
      }}>
        {event.severity.toUpperCase()}
      </span>
    </motion.div>
  );
}

function DecisionCard({ decision, isSelected, onSelect }) {
  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(decision.id)}
      style={{
        ...styles.card,
        width: '100%',
        textAlign: 'left',
        cursor: 'pointer',
        border: isSelected ? '1px solid var(--red)' : '1px solid var(--border)',
        background: isSelected ? 'rgba(232,0,45,0.06)' : 'var(--panel2)',
        padding: '10px 12px',
        marginBottom: '6px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        transition: 'all 0.15s',
      }}
    >
      <span style={{ fontSize: '16px' }}>{decision.icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{
          fontFamily: 'Orbitron',
          fontSize: '9px',
          fontWeight: 700,
          color: isSelected ? 'var(--red)' : 'var(--text)',
          letterSpacing: '1.5px',
          marginBottom: '2px',
        }}>
          {decision.name}
        </div>
        <div style={{
          fontFamily: 'Barlow Condensed',
          fontSize: '12px',
          color: 'var(--muted)',
        }}>
          {decision.description}
        </div>
      </div>
      {isSelected && (
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: 'var(--red)',
          boxShadow: '0 0 8px rgba(232,0,45,0.5)',
        }} />
      )}
    </motion.button>
  );
}

function StintBlock({ stint, index }) {
  const color = COMPOUND_COLORS[stint.compound] || '#fff';
  return (
    <motion.div
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ delay: index * 0.15, duration: 0.4 }}
      style={{
        flex: stint.laps,
        height: '28px',
        background: `${color}22`,
        border: `1px solid ${color}66`,
        borderRadius: '3px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '4px',
        transformOrigin: 'left',
      }}
    >
      <span style={{
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        background: color,
        display: 'inline-block',
      }} />
      <span style={{
        fontFamily: 'Orbitron',
        fontSize: '8px',
        fontWeight: 600,
        color: color,
        letterSpacing: '1px',
      }}>
        {stint.compound.toUpperCase()} · {stint.laps}L
      </span>
    </motion.div>
  );
}

// ─── Session Views ────────────────────────────────────

function PracticeView({ result }) {
  if (!result) return <EmptyView text="Run a practice session to see results" />;

  const lapChartData = {
    labels: result.lapTimes.map((_, i) => `Lap ${i + 1}`),
    datasets: [{
      label: 'Lap Time',
      data: result.lapTimes,
      borderColor: '#E8002D',
      backgroundColor: 'rgba(232,0,45,0.1)',
      fill: true,
      tension: 0.3,
      pointBackgroundColor: '#E8002D',
      pointBorderColor: '#E8002D',
      pointRadius: 4,
      pointHoverRadius: 6,
    }],
  };

  const lapChartOptions = {
    ...chartDefaults,
    scales: {
      ...chartDefaults.scales,
      y: {
        ...chartDefaults.scales.y,
        title: { display: true, text: 'Time (s)', color: '#4E5266', font: { family: 'Barlow Condensed', size: 11 } },
      },
    },
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <div style={styles.chartCard}>
          <div style={styles.cardTitle}>LAP TIMES</div>
          <div style={{ height: '180px' }}>
            <Line data={lapChartData} options={lapChartOptions} />
          </div>
        </div>

        <div style={styles.chartCard}>
          <div style={styles.cardTitle}>SESSION METRICS</div>
          <MetricBar label="Pace" value={result.pace} color="var(--red)" />
          <MetricBar label="Confidence" value={result.confidence} color="var(--green)" />
          <MetricBar label="Setup Rating" value={result.setupRating} color="var(--cyan)" />
          <MetricBar label="Tyre Wear" value={result.tyreWear} color={result.tyreWear > 60 ? 'var(--orange)' : 'var(--yellow)'} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <div style={styles.chartCard}>
          <div style={styles.cardTitle}>TYRE COMPOUND DATA</div>
          {result.tyreData && Object.entries(result.tyreData).map(([compound, data]) => (
            <div key={compound} style={{ ...styles.statRow, alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  width: '10px', height: '10px', borderRadius: '50%',
                  background: COMPOUND_COLORS[compound],
                  display: 'inline-block',
                }} />
                <span style={{ ...styles.statLabel, textTransform: 'capitalize' }}>{compound}</span>
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <span style={{ ...styles.statValue, fontSize: '10px', color: data.wear > 50 ? 'var(--orange)' : 'var(--green)' }}>
                  {Math.round(data.wear)}% wear
                </span>
                <span style={{ ...styles.statValue, fontSize: '10px', color: 'var(--muted2)' }}>
                  ~{data.stintLaps} laps
                </span>
              </div>
            </div>
          ))}
        </div>

        <div style={styles.chartCard}>
          <div style={styles.cardTitle}>SECTOR ANALYSIS</div>
          {result.sectorTimes && ['s1', 's2', 's3'].map((s, i) => (
            <div key={s} style={styles.statRow}>
              <span style={styles.statLabel}>Sector {i + 1}</span>
              <span style={{ ...styles.statValue, color: 'var(--cyan)' }}>
                {result.sectorTimes[s]}s
              </span>
            </div>
          ))}
          <div style={{ ...styles.statRow, borderBottom: 'none', marginTop: '6px' }}>
            <span style={{ ...styles.statLabel, color: 'var(--text)' }}>Total Lap</span>
            <span style={{ ...styles.statValue, color: 'var(--red)' }}>
              {(result.sectorTimes.s1 + result.sectorTimes.s2 + result.sectorTimes.s3).toFixed(3)}s
            </span>
          </div>
        </div>
      </div>

      <div style={styles.chartCard}>
        <div style={styles.cardTitle}>SESSION FEEDBACK</div>
        <p style={{
          fontFamily: 'Barlow Condensed',
          fontSize: '15px',
          color: 'var(--text)',
          lineHeight: '1.5',
          padding: '4px 0',
        }}>
          "{result.feedback}"
        </p>
        {result.events && result.events.length > 0 && (
          <div style={{ marginTop: '10px' }}>
            {result.events.map(e => <EventBadge key={e.id} event={e} />)}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function QualifyingView({ result }) {
  if (!result) return <EmptyView text="Complete practice first, then run qualifying" />;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <div style={styles.chartCard}>
          <div style={styles.cardTitle}>QUALIFYING RESULT</div>
          <div style={{ textAlign: 'center', padding: '12px 0' }}>
            <div style={{
              fontFamily: 'Orbitron',
              fontSize: '48px',
              fontWeight: 700,
              color: result.gridPosition <= 3 ? 'var(--green)' : result.gridPosition <= 10 ? 'var(--yellow)' : 'var(--red)',
              lineHeight: 1,
            }}>
              P{result.gridPosition}
            </div>
            <div style={{
              fontFamily: 'Barlow Condensed',
              fontSize: '14px',
              color: 'var(--muted)',
              marginTop: '6px',
            }}>
              Grid Position
            </div>
          </div>
          <div style={styles.statRow}>
            <span style={styles.statLabel}>Best Lap</span>
            <span style={{ ...styles.statValue, color: 'var(--cyan)' }}>{result.bestLap}s</span>
          </div>
          <div style={styles.statRow}>
            <span style={styles.statLabel}>Gap to Pole</span>
            <span style={{ ...styles.statValue, color: result.gapToPole.startsWith('+') ? 'var(--orange)' : 'var(--green)' }}>
              {result.gapToPole}s
            </span>
          </div>
          <div style={{ ...styles.statRow, borderBottom: 'none' }}>
            <span style={styles.statLabel}>Strategy Impact</span>
            <span style={{ ...styles.statValue, fontSize: '10px', color: result.choiceImpact.includes('paid off') ? 'var(--green)' : 'var(--orange)' }}>
              {result.choiceImpact}
            </span>
          </div>
        </div>

        <div style={styles.chartCard}>
          <div style={styles.cardTitle}>SECTOR COMPARISON</div>
          {['s1', 's2', 's3'].map((s, i) => {
            const time = result.sectorTimes[s];
            return (
              <div key={s} style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{
                    fontFamily: 'Orbitron',
                    fontSize: '10px',
                    fontWeight: 700,
                    color: 'var(--muted2)',
                    letterSpacing: '1.5px',
                  }}>
                    SECTOR {i + 1}
                  </span>
                  <span style={{
                    fontFamily: 'Orbitron',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: 'var(--text)',
                  }}>
                    {time}s
                  </span>
                </div>
                <div style={{ height: '6px', background: 'var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (1 - (time - 18) / 30) * 100)}%` }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    style={{
                      height: '100%',
                      borderRadius: '3px',
                      background: i === 0 ? 'var(--red)' : i === 1 ? 'var(--cyan)' : 'var(--green)',
                    }}
                  />
                </div>
              </div>
            );
          })}
          {result.events && result.events.length > 0 && (
            <div style={{ marginTop: '10px' }}>
              {result.events.map(e => <EventBadge key={e.id} event={e} />)}
            </div>
          )}
        </div>
      </div>

      <div style={styles.chartCard}>
        <div style={styles.cardTitle}>PROVISIONAL GRID — TOP 20</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '6px' }}>
          {result.grid && result.grid.map(entry => (
            <div
              key={entry.code}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 10px',
                borderRadius: '3px',
                background: entry.isUser ? 'rgba(232,0,45,0.1)' : 'var(--panel2)',
                border: `1px solid ${entry.isUser ? 'var(--red)' : 'var(--border)'}`,
              }}
            >
              <span style={{
                fontFamily: 'Orbitron',
                fontSize: '11px',
                fontWeight: 700,
                color: entry.position <= 3 ? 'var(--green)' : 'var(--muted2)',
                width: '24px',
              }}>
                P{entry.position}
              </span>
              <span style={{
                fontFamily: 'Barlow Condensed',
                fontSize: '13px',
                color: entry.isUser ? 'var(--red)' : 'var(--text)',
                fontWeight: entry.isUser ? 600 : 400,
              }}>
                {entry.code} — {entry.name.split(' ').pop()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function RaceView({ result }) {
  if (!result) return <EmptyView text="Complete qualifying first, then simulate the race" />;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <StatCard label="START" value={`P${result.startPosition}`} color="var(--muted2)" />
        <StatCard label="BEST POSITION" value={`P${result.bestPosition}`} color="var(--cyan)" />
        <StatCard label="FINISH" value={`P${result.finalPosition}`} color={result.ratingColor} big />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <div style={styles.chartCard}>
          <div style={styles.cardTitle}>RACE STATS</div>
          <div style={styles.statRow}>
            <span style={styles.statLabel}>Points Scored</span>
            <span style={{ ...styles.statValue, color: result.points > 0 ? 'var(--green)' : 'var(--muted)' }}>
              {result.points} pts
            </span>
          </div>
          <div style={styles.statRow}>
            <span style={styles.statLabel}>Gap to Winner</span>
            <span style={{ ...styles.statValue, color: 'var(--orange)' }}>{result.gapToWinner}</span>
          </div>
          <div style={styles.statRow}>
            <span style={styles.statLabel}>Overtakes</span>
            <span style={{ ...styles.statValue, color: 'var(--cyan)' }}>{result.totalOvertakes}</span>
          </div>
          <div style={styles.statRow}>
            <span style={styles.statLabel}>Pit Stops</span>
            <span style={styles.statValue}>{result.pitStops}</span>
          </div>
          <div style={styles.statRow}>
            <span style={styles.statLabel}>Tyre Wear</span>
            <span style={{ ...styles.statValue, color: result.tyreWear > 60 ? 'var(--orange)' : 'var(--green)' }}>
              {result.tyreWear}%
            </span>
          </div>
          <div style={{ ...styles.statRow, borderBottom: 'none' }}>
            <span style={styles.statLabel}>Time Lost to Events</span>
            <span style={{ ...styles.statValue, color: 'var(--red)' }}>{result.timeLostToEvents}s</span>
          </div>
        </div>

        <div style={styles.chartCard}>
          <div style={styles.cardTitle}>TYRE STRATEGY</div>
          <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
            {result.stints && result.stints.map((stint, i) => (
              <StintBlock key={i} stint={stint} index={i} />
            ))}
          </div>
          <div style={styles.cardTitle}>RACE EVENTS</div>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {result.events && result.events.length > 0 ? (
              result.events.map(e => <EventBadge key={e.id} event={e} />)
            ) : (
              <span style={{ fontFamily: 'Barlow Condensed', fontSize: '13px', color: 'var(--muted)' }}>
                Clean race — no event incidents
              </span>
            )}
          </div>
        </div>
      </div>

      <div style={styles.chartCard}>
        <div style={styles.cardTitle}>RACE TIMELINE</div>
        <div style={{ position: 'relative', paddingLeft: '20px' }}>
          {result.timeline && result.timeline.map((entry, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              style={{
                display: 'flex',
                gap: '12px',
                marginBottom: '10px',
                position: 'relative',
              }}
            >
              <div style={{
                position: 'absolute',
                left: '-20px',
                top: '0',
                bottom: i === result.timeline.length - 1 ? '50%' : '-10px',
                width: '2px',
                background: 'var(--border)',
              }} />
              <div style={{
                position: 'absolute',
                left: '-24px',
                top: '4px',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: i === result.timeline.length - 1 ? 'var(--green)' : 'var(--red)',
                border: '2px solid var(--panel)',
                zIndex: 1,
              }} />
              <div style={{
                fontFamily: 'Orbitron',
                fontSize: '9px',
                fontWeight: 600,
                color: 'var(--muted)',
                minWidth: '44px',
                letterSpacing: '1px',
              }}>
                L{entry.lap}
              </div>
              <div>
                <div style={{
                  fontFamily: 'Orbitron',
                  fontSize: '9px',
                  fontWeight: 700,
                  color: 'var(--text)',
                  letterSpacing: '1.5px',
                  marginBottom: '2px',
                }}>
                  {entry.event}
                </div>
                <div style={{
                  fontFamily: 'Barlow Condensed',
                  fontSize: '12px',
                  color: 'var(--muted2)',
                }}>
                  {entry.detail}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function ResultsView({ state }) {
  const race = state.raceResult;
  const quali = state.qualifyingResult;
  const practice = state.practiceResult;
  if (!race) return <EmptyView text="Complete all sessions to see results" />;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      {/* Hero result card */}
      <div style={{
        ...styles.chartCard,
        textAlign: 'center',
        padding: '30px',
        border: `1px solid ${race.ratingColor}33`,
        background: `linear-gradient(180deg, ${race.ratingColor}08 0%, var(--panel) 100%)`,
        marginBottom: '16px',
      }}>
        <div style={{
          fontFamily: 'Orbitron',
          fontSize: '10px',
          fontWeight: 600,
          letterSpacing: '3px',
          color: 'var(--muted)',
          marginBottom: '8px',
        }}>
          FINAL CLASSIFICATION
        </div>
        <div style={{
          fontFamily: 'Orbitron',
          fontSize: '64px',
          fontWeight: 700,
          color: race.ratingColor,
          lineHeight: 1,
          marginBottom: '8px',
        }}>
          P{race.finalPosition}
        </div>
        <div style={{
          fontFamily: 'Orbitron',
          fontSize: '12px',
          fontWeight: 600,
          letterSpacing: '2px',
          color: race.ratingColor,
          marginBottom: '4px',
        }}>
          {race.rating.toUpperCase()} WEEKEND
        </div>
        <div style={{
          fontFamily: 'Barlow Condensed',
          fontSize: '15px',
          color: 'var(--muted2)',
        }}>
          {race.points > 0 ? `${race.points} championship points scored` : 'Outside the points'}
          {race.gapToWinner !== '—' ? ` · ${race.gapToWinner} to winner` : ' · RACE WINNER 🏆'}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <div style={styles.chartCard}>
          <div style={styles.cardTitle}>WEEKEND BREAKDOWN</div>
          <div style={styles.statRow}>
            <span style={styles.statLabel}>Practice</span>
            <span style={{ ...styles.statValue, fontSize: '10px' }}>
              {race.weekendSummary.practice}
            </span>
          </div>
          <div style={styles.statRow}>
            <span style={styles.statLabel}>Qualifying</span>
            <span style={{ ...styles.statValue, fontSize: '10px' }}>
              {race.weekendSummary.qualifying}
            </span>
          </div>
          <div style={{ ...styles.statRow, borderBottom: 'none' }}>
            <span style={styles.statLabel}>Race</span>
            <span style={{ ...styles.statValue, fontSize: '10px' }}>
              {race.weekendSummary.race}
            </span>
          </div>
        </div>

        <div style={styles.chartCard}>
          <div style={styles.cardTitle}>PERFORMANCE ANALYSIS</div>
          <div style={styles.statRow}>
            <span style={styles.statLabel}>Best Decision</span>
            <span style={{ ...styles.statValue, fontSize: '10px', color: 'var(--green)' }}>
              {race.analysis.bestDecision}
            </span>
          </div>
          <div style={styles.statRow}>
            <span style={styles.statLabel}>Worst Decision</span>
            <span style={{ ...styles.statValue, fontSize: '10px', color: 'var(--orange)' }}>
              {race.analysis.worstDecision}
            </span>
          </div>
          <div style={styles.statRow}>
            <span style={styles.statLabel}>Biggest Swing</span>
            <span style={{ ...styles.statValue, fontSize: '10px', color: 'var(--cyan)' }}>
              {race.analysis.biggestSwing}
            </span>
          </div>
          <div style={{ ...styles.statRow, borderBottom: 'none' }}>
            <span style={styles.statLabel}>Event Impact</span>
            <span style={{ ...styles.statValue, fontSize: '10px' }}>
              {race.analysis.eventImpact}
            </span>
          </div>
        </div>
      </div>

      <div style={styles.chartCard}>
        <div style={styles.cardTitle}>WEEKEND NARRATIVE</div>
        {race.narrative && race.narrative.map((line, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15 }}
            style={{
              fontFamily: 'Barlow Condensed',
              fontSize: '15px',
              color: 'var(--text)',
              lineHeight: '1.6',
              padding: '4px 0',
              borderLeft: '2px solid var(--red)',
              paddingLeft: '12px',
              marginBottom: '8px',
            }}
          >
            {line}
          </motion.p>
        ))}
      </div>
    </motion.div>
  );
}

function StatCard({ label, value, color, big }) {
  return (
    <div style={{
      ...styles.chartCard,
      textAlign: 'center',
      padding: big ? '20px' : '16px',
    }}>
      <div style={{
        fontFamily: 'Orbitron',
        fontSize: big ? '36px' : '28px',
        fontWeight: 700,
        color: color || 'var(--text)',
        lineHeight: 1,
        marginBottom: '4px',
      }}>
        {value}
      </div>
      <div style={{
        fontFamily: 'Orbitron',
        fontSize: '8px',
        fontWeight: 600,
        letterSpacing: '2px',
        color: 'var(--muted)',
      }}>
        {label}
      </div>
    </div>
  );
}

function EmptyView({ text }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '300px',
      color: 'var(--muted)',
      fontFamily: 'Barlow Condensed',
      fontSize: '15px',
      textAlign: 'center',
    }}>
      <div>
        <div style={{ fontSize: '32px', marginBottom: '12px', opacity: 0.4 }}>🏎️</div>
        {text}
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────

function RaceWeekendSimulator() {
  const [tracks, setTracks] = useState([]);
  const [driversData, setDriversData] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [currentSession, setCurrentSession] = useState('practice');
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [decisions, setDecisions] = useState([]);
  const [sessionResult, setSessionResult] = useState(null);
  const [weekendState, setWeekendState] = useState(null);
  const [simulating, setSimulating] = useState(false);
  const [activeEvents, setActiveEvents] = useState([]);
  const [completedSessions, setCompletedSessions] = useState([]);

  // Fetch tracks and drivers
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tracksRes, driversRes] = await Promise.all([
          axios.get('/api/weekend/tracks'),
          axios.get('/api/weekend/drivers'),
        ]);
        setTracks(tracksRes.data);
        setDriversData(driversRes.data);
        if (tracksRes.data.length > 0) setSelectedTrack(tracksRes.data[0]);
        if (driversRes.data.length > 0) setSelectedDriver(driversRes.data[0]);
      } catch (err) {
        console.error('Failed to fetch weekend data:', err);
      }
    };
    fetchData();
  }, []);

  const getCurrentDecisions = useCallback(() => {
    const decisionMap = {
      practice: [
        { id: 'push_lap', name: 'Push Lap', icon: '🔥', description: 'Go flat out for one-lap pace' },
        { id: 'long_run', name: 'Long Run', icon: '📊', description: 'Extended stint to understand tyres' },
        { id: 'tyre_save', name: 'Tyre Saving', icon: '🛡️', description: 'Focus on tyre preservation techniques' },
        { id: 'fuel_heavy', name: 'Fuel-Heavy Setup', icon: '⛽', description: 'Simulate heavy fuel race conditions' },
      ],
      qualifying: [
        { id: 'early_banker', name: 'Early Banker Lap', icon: '🏦', description: 'Set a safe time early in the session' },
        { id: 'late_push', name: 'Late Push Lap', icon: '⚡', description: 'Wait for track evolution and push late' },
        { id: 'tow', name: 'Tow from Teammate', icon: '🤝', description: 'Follow your teammate for a tow on straights' },
        { id: 'wet_gamble', name: 'Risk Wet Tyres', icon: '🎲', description: 'Gamble on mixed conditions' },
      ],
      race: [
        { id: 'aggressive_start', name: 'Aggressive Start', icon: '🚀', description: 'Attack hard into Turn 1' },
        { id: 'conservative_start', name: 'Conservative Start', icon: '🛡️', description: 'Play it safe off the line' },
        { id: 'undercut', name: 'Undercut Strategy', icon: '⬇️', description: 'Pit early to gain track position' },
        { id: 'overcut', name: 'Overcut Strategy', icon: '⬆️', description: 'Stay out and gain through fresher tyres later' },
        { id: 'pit_early', name: 'Pit Early', icon: '🔄', description: 'Box for fresh rubber at the first opportunity' },
        { id: 'extend_stint', name: 'Extend Stint', icon: '⏳', description: 'Push the tyres to the limit before pitting' },
      ],
    };
    return decisionMap[currentSession] || [];
  }, [currentSession]);

  const handleSimulate = async () => {
    if (!selectedTrack || !selectedDriver || !selectedChoice) return;
    setSimulating(true);
    setActiveEvents([]);

    try {
      const response = await axios.post('/api/weekend/simulate', {
        track: selectedTrack.id,
        driver: selectedDriver.code,
        session: currentSession,
        choice: selectedChoice,
        state: weekendState,
      });

      const { sessionResult: result, updatedState, event } = response.data;
      setSessionResult(result);
      setWeekendState(updatedState);

      if (event) setActiveEvents(event);
      setCompletedSessions(prev => [...prev, currentSession]);
      setDecisions(prev => [...prev, { session: currentSession, choice: selectedChoice }]);
    } catch (err) {
      console.error('Simulation failed:', err);
    } finally {
      setSimulating(false);
    }
  };

  const handleNextSession = () => {
    const idx = SESSIONS.indexOf(currentSession);
    if (idx < SESSIONS.length - 1) {
      setCurrentSession(SESSIONS[idx + 1]);
      setSelectedChoice(null);
      setActiveEvents([]);
    }
  };

  const handleReset = async () => {
    try {
      await axios.post('/api/weekend/reset');
    } catch (err) { /* ignore */ }
    setCurrentSession('practice');
    setSelectedChoice(null);
    setSessionResult(null);
    setWeekendState(null);
    setActiveEvents([]);
    setCompletedSessions([]);
    setDecisions([]);
  };

  const sessionIdx = SESSIONS.indexOf(currentSession);
  const completedIdx = completedSessions.length;
  const canSimulate = selectedTrack && selectedDriver && selectedChoice && !simulating && !completedSessions.includes(currentSession);
  const canAdvance = completedSessions.includes(currentSession) && currentSession !== 'results';

  const sessionObjectives = {
    practice: 'Find pace and manage tyre wear',
    qualifying: 'Push for grid position',
    race: 'Convert strategy into result',
    results: 'Weekend complete',
  };

  return (
    <div style={styles.container}>
      {/* ─── Header ─── */}
      <div style={styles.header}>
        <div style={styles.headerTop}>
          <div>
            <div style={styles.title}>RACE WEEKEND SIMULATOR</div>
            <div style={styles.subtitle}>Practice. Quali. Race. One weekend decides everything.</div>
          </div>
          <div style={styles.headerMeta}>
            {selectedTrack && (
              <div style={styles.metaBadge}>📍 {selectedTrack.shortName}</div>
            )}
            {selectedDriver && (
              <div style={styles.metaBadge}>🏎️ {selectedDriver.code}</div>
            )}
          </div>
        </div>
        <div style={styles.progressTracker}>
          {SESSIONS.map((step, i) => (
            <ProgressStep key={step} step={step} index={i} currentIndex={sessionIdx} completedIndex={completedIdx} />
          ))}
        </div>
      </div>

      {/* ─── Body ─── */}
      <div style={styles.body}>
        {/* ─── Left Panel ─── */}
        <div style={styles.leftPanel}>
          <div style={styles.panelTitle}>WEEKEND CONTROL</div>

          {/* Driver Selector */}
          <div style={styles.card}>
            <div style={styles.cardTitle}>DRIVER</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {driversData.map(d => (
                <button
                  key={d.code}
                  onClick={() => setSelectedDriver(d)}
                  style={{
                    ...styles.chip,
                    ...(selectedDriver?.code === d.code ? styles.chipActive : {}),
                  }}
                >
                  {d.code}
                </button>
              ))}
            </div>
          </div>

          {/* Track Selector */}
          <div style={styles.card}>
            <div style={styles.cardTitle}>CIRCUIT</div>
            <select
              style={styles.select}
              value={selectedTrack?.id || ''}
              onChange={e => setSelectedTrack(tracks.find(t => t.id === e.target.value))}
            >
              {tracks.map(t => (
                <option key={t.id} value={t.id}>{t.shortName} — {t.country}</option>
              ))}
            </select>
          </div>

          {/* Session Mode */}
          <div style={styles.card}>
            <div style={styles.cardTitle}>SESSION MODE</div>
            <div style={{
              fontFamily: 'Orbitron',
              fontSize: '14px',
              fontWeight: 700,
              color: 'var(--text)',
              letterSpacing: '2px',
              marginBottom: '4px',
            }}>
              {SESSION_LABELS[currentSession]}
            </div>
            <div style={{
              fontFamily: 'Barlow Condensed',
              fontSize: '13px',
              color: 'var(--muted)',
            }}>
              {sessionObjectives[currentSession]}
            </div>
          </div>

          {/* Decision Card */}
          {currentSession !== 'results' && (
            <div>
              <div style={styles.cardTitle}>STRATEGY DECISION</div>
              {getCurrentDecisions().map(d => (
                <DecisionCard
                  key={d.id}
                  decision={d}
                  isSelected={selectedChoice === d.id}
                  onSelect={setSelectedChoice}
                />
              ))}
            </div>
          )}

          {/* Event Panel */}
          {activeEvents.length > 0 && (
            <div style={styles.card}>
              <div style={styles.cardTitle}>ACTIVE EVENTS</div>
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {activeEvents.map(e => <EventBadge key={e.id} event={e} />)}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 'auto' }}>
            {currentSession !== 'results' && (
              <button
                onClick={handleSimulate}
                disabled={!canSimulate}
                style={{
                  ...styles.btn,
                  ...styles.btnPrimary,
                  opacity: canSimulate ? 1 : 0.4,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {simulating ? (
                  <span style={{ animation: 'pulse 1s infinite' }}>SIMULATING...</span>
                ) : completedSessions.includes(currentSession) ? (
                  'SESSION COMPLETE ✓'
                ) : (
                  'SIMULATE SESSION'
                )}
              </button>
            )}

            {canAdvance && (
              <motion.button
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={handleNextSession}
                style={{ ...styles.btn, ...styles.btnSecondary }}
              >
                NEXT SESSION →
              </motion.button>
            )}

            <button
              onClick={handleReset}
              style={{ ...styles.btn, ...styles.btnGhost }}
            >
              RESET WEEKEND
            </button>
          </div>
        </div>

        {/* ─── Right Panel ─── */}
        <div style={styles.rightPanel}>
          <AnimatePresence mode="wait">
            {currentSession === 'practice' && (
              <PracticeView key="practice" result={weekendState?.practiceResult} />
            )}
            {currentSession === 'qualifying' && (
              <QualifyingView key="qualifying" result={weekendState?.qualifyingResult} />
            )}
            {currentSession === 'race' && (
              <RaceView key="race" result={weekendState?.raceResult} />
            )}
            {currentSession === 'results' && (
              <ResultsView key="results" state={weekendState || {}} />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default RaceWeekendSimulator;
