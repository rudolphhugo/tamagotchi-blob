import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'tamagotchi-pet-stats'
const STAT_DECAY_INTERVAL = 5000 // 5 seconds for demo (would be 1 hour in prod)

const DEFAULT_STATS = {
  vibe: 80,
  fuel: 80,
  battery: 100,
  isSleeping: false,
  lastUpdate: Date.now(),
  level: 1,
  highStatsStartTime: null,
}

function loadStats() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      // Calculate stat decay based on time passed
      const now = Date.now()
      const hoursPassed = (now - parsed.lastUpdate) / (1000 * 60 * 60)
      
      return {
        ...parsed,
        vibe: Math.max(0, parsed.vibe - (hoursPassed * 5)),
        fuel: Math.max(0, parsed.fuel - (hoursPassed * 8)),
        battery: parsed.isSleeping 
          ? Math.min(100, parsed.battery + (hoursPassed * 10))
          : Math.max(0, parsed.battery - (hoursPassed * 3)),
        lastUpdate: now,
      }
    }
  } catch (e) {
    console.error('Failed to load pet stats:', e)
  }
  return DEFAULT_STATS
}

function saveStats(stats) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      ...stats,
      lastUpdate: Date.now(),
    }))
  } catch (e) {
    console.error('Failed to save pet stats:', e)
  }
}

export function usePetStats() {
  const [stats, setStats] = useState(loadStats)

  // Save to localStorage whenever stats change
  useEffect(() => {
    saveStats(stats)
  }, [stats])

  // Check for level up (all stats > 80 for demo purposes)
  useEffect(() => {
    const allHigh = stats.vibe >= 80 && stats.fuel >= 80 && stats.battery >= 80

    if (allHigh && !stats.highStatsStartTime) {
      setStats(s => ({ ...s, highStatsStartTime: Date.now() }))
    } else if (!allHigh && stats.highStatsStartTime) {
      setStats(s => ({ ...s, highStatsStartTime: null }))
    }

    // Level up after 30 seconds of high stats (demo) - would be 24h in prod
    if (stats.highStatsStartTime) {
      const timeHigh = Date.now() - stats.highStatsStartTime
      if (timeHigh >= 30000 && stats.level < 3) {
        setStats(s => ({ 
          ...s, 
          level: s.level + 1, 
          highStatsStartTime: null 
        }))
      }
    }
  }, [stats.vibe, stats.fuel, stats.battery, stats.highStatsStartTime, stats.level])

  const decayStats = useCallback(() => {
    setStats(s => {
      if (s.isSleeping) {
        return {
          ...s,
          battery: Math.min(100, s.battery + 2),
        }
      }
      return {
        ...s,
        vibe: Math.max(0, s.vibe - 1),
        fuel: Math.max(0, s.fuel - 1.5),
        battery: Math.max(0, s.battery - 0.5),
      }
    })
  }, [])

  const feed = useCallback(() => {
    setStats(s => ({
      ...s,
      fuel: Math.min(100, s.fuel + 20),
    }))
    return '+20 Fuel!'
  }, [])

  const pet = useCallback(() => {
    setStats(s => ({
      ...s,
      vibe: Math.min(100, s.vibe + 15),
    }))
    return '+15 Vibe!'
  }, [])

  const toggleSleep = useCallback(() => {
    setStats(s => ({
      ...s,
      isSleeping: !s.isSleeping,
    }))
  }, [])

  const isFainted = stats.vibe <= 0 || stats.fuel <= 0 || stats.battery <= 0

  return {
    stats,
    decayStats,
    feed,
    pet,
    toggleSleep,
    isFainted,
  }
}
