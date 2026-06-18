import { getTodayMinutes } from './learningGrowth'
import { getTodayRounds } from './pomodoroStorage'

export function getFocusEncouragement(focusPomodoroCount, focusMinutes) {
  if (focusPomodoroCount >= 3 || focusMinutes >= 45) {
    return { cheer: '你今天很棒 👍', hint: '专注力提升中' }
  }
  if (focusPomodoroCount >= 1 || focusMinutes > 0) {
    return { cheer: '继续保持 👍', hint: '专注力提升中' }
  }
  return { cheer: '准备好出发啦', hint: '完成第一个番茄就很棒' }
}

/** 今日专注总结 — 跨天后自动为 0（按本地日期键读取） */
export function getDailyFocusSummary() {
  const focusPomodoroCount = getTodayRounds()
  const focusMinutes = getTodayMinutes()
  const { cheer, hint } = getFocusEncouragement(focusPomodoroCount, focusMinutes)

  return {
    focusPomodoroCount,
    focusMinutes,
    cheer,
    hint,
  }
}
