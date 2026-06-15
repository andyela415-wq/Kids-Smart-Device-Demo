import { getTodayDayIndex } from './learningPlanStorage'
import { getWeekDayTasks } from './weeklyPlan'
import { findUpcomingStandbyReminder } from './scheduleAlarm'
import { formatTime as formatDuration } from './timeFormat'

const FOCUS_STATE_KEY = 'device_focus_state'

export function readFocusState() {
  try {
    return JSON.parse(sessionStorage.getItem(FOCUS_STATE_KEY) || 'null')
  } catch {
    return null
  }
}

export function writeFocusState(state) {
  if (state) {
    sessionStorage.setItem(FOCUS_STATE_KEY, JSON.stringify(state))
  } else {
    sessionStorage.removeItem(FOCUS_STATE_KEY)
  }
}

export function getDeviceStatus(now = new Date()) {
  const focus = readFocusState()

  if (focus?.running) {
    if (focus.enableWater && focus.waterRemaining > 0) {
      return {
        upcomingReminder: {
          icon: '💧',
          text: formatDuration(focus.waterRemaining),
        },
      }
    }

    return {
      upcomingReminder: {
        icon: '🍅',
        text: focus.paused ? '已暂停' : '专注中',
      },
    }
  }

  const tasks = getWeekDayTasks(getTodayDayIndex())

  return {
    upcomingReminder: findUpcomingStandbyReminder(tasks, now),
  }
}
