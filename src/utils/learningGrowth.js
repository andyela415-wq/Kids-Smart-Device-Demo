import {
  addStar,
  getStars,
  getStreakDays,
  getTodayRounds,
  recordRoundComplete,
} from './pomodoroStorage'
import { getLocalDateKey } from './localDate'

const POINTS_KEY = 'learning_points'
const MINUTES_KEY = 'learning_daily_minutes'
const DEMO_SEED_KEY = 'learning_demo_seeded'
const GROWTH_EVENT = 'learning-growth-update'

function todayKey() {
  return getLocalDateKey()
}

export function notifyGrowthUpdate() {
  window.dispatchEvent(new Event(GROWTH_EVENT))
}

export function getGrowthEventName() {
  return GROWTH_EVENT
}

export function getPoints() {
  return Number(localStorage.getItem(POINTS_KEY) || 0)
}

export function addPoints(amount) {
  const next = getPoints() + amount
  localStorage.setItem(POINTS_KEY, String(next))
  return next
}

export function getTodayMinutes() {
  const stats = JSON.parse(localStorage.getItem(MINUTES_KEY) || '{}')
  return stats[todayKey()] || 0
}

export function addTodayMinutes(minutes) {
  const today = todayKey()
  const stats = JSON.parse(localStorage.getItem(MINUTES_KEY) || '{}')
  stats[today] = (stats[today] || 0) + Math.max(0, minutes)
  localStorage.setItem(MINUTES_KEY, JSON.stringify(stats))
  return stats[today]
}

export function getGrowthProfile() {
  return {
    points: getPoints(),
    todayMinutes: getTodayMinutes(),
    streakDays: getStreakDays(),
    stars: getStars(),
    todayRounds: getTodayRounds(),
  }
}

export function getAiEncouragement(profile = getGrowthProfile()) {
  const { todayMinutes, streakDays, points, todayRounds } = profile

  if (streakDays >= 7) {
    return `连续学习${streakDays}天啦！小智为你骄傲～`
  }
  if (todayMinutes >= 15) {
    return `今天已经学习${todayMinutes}分钟，继续保持！`
  }
  if (todayRounds >= 2) {
    return `今天完成${todayRounds}轮专注，你真棒！`
  }
  if (points >= 50) {
    return `学习积分${points}分，离下一枚勋章更近啦～`
  }
  if (todayMinutes > 0) {
    return `今天已经学习${todayMinutes}分钟，加油哦～`
  }
  return '小智陪你一起学，开始今天的第一课吧～'
}

export function recordPomodoroRound(intervalMinutes) {
  const stats = recordRoundComplete()
  addTodayMinutes(intervalMinutes)
  addPoints(10)
  notifyGrowthUpdate()
  return { ...getGrowthProfile(), ...stats }
}

export function recordTutoringStudy(minutes = 8) {
  addTodayMinutes(minutes)
  addPoints(15)
  notifyGrowthUpdate()
  return getGrowthProfile()
}

export function seedDemoGrowthIfEmpty() {
  if (localStorage.getItem(DEMO_SEED_KEY)) return

  const today = todayKey()
  localStorage.setItem(MINUTES_KEY, JSON.stringify({ [today]: 15 }))
  localStorage.setItem(POINTS_KEY, '86')
  localStorage.setItem('pomodoro_stars', '5')
  localStorage.setItem('pomodoro_streak', '7')
  localStorage.setItem('pomodoro_last_day', today)
  localStorage.setItem(
    'pomodoro_daily_stats',
    JSON.stringify({ [today]: 2 }),
  )
  localStorage.setItem(DEMO_SEED_KEY, '1')
  notifyGrowthUpdate()
}
