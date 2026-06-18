import { getLocalDateKey, getYesterdayLocalDateKey } from './localDate'

const STARS_KEY = 'pomodoro_stars'
const STATS_KEY = 'pomodoro_daily_stats'
const STREAK_KEY = 'pomodoro_streak'
const LAST_DAY_KEY = 'pomodoro_last_day'

function todayKey() {
  return getLocalDateKey()
}

function yesterdayKey() {
  return getYesterdayLocalDateKey()
}

export function getStars() {
  return Number(localStorage.getItem(STARS_KEY) || 0)
}

export function addStar(amount = 1) {
  const next = getStars() + amount
  localStorage.setItem(STARS_KEY, String(next))
  return next
}

export function getTodayRounds() {
  const stats = JSON.parse(localStorage.getItem(STATS_KEY) || '{}')
  return stats[todayKey()] || 0
}

export function getStreakDays() {
  return Number(localStorage.getItem(STREAK_KEY) || 0)
}

export function recordRoundComplete() {
  const today = todayKey()
  const stats = JSON.parse(localStorage.getItem(STATS_KEY) || '{}')
  stats[today] = (stats[today] || 0) + 1
  localStorage.setItem(STATS_KEY, JSON.stringify(stats))

  const lastDay = localStorage.getItem(LAST_DAY_KEY)
  let streak = getStreakDays()

  if (lastDay === today) {
    // same day, keep streak
  } else if (lastDay === yesterdayKey()) {
    streak += 1
  } else {
    streak = 1
  }

  localStorage.setItem(STREAK_KEY, String(streak))
  localStorage.setItem(LAST_DAY_KEY, today)

  return {
    todayRounds: stats[today],
    streak,
    stars: addStar(1),
  }
}

export function getGrowthStats() {
  return {
    stars: getStars(),
    todayRounds: getTodayRounds(),
    streak: getStreakDays(),
  }
}
