import { getTodayDayIndex } from './learningPlanStorage'
import { getWeekDayTasks } from './weeklyPlan'
import { findUpcomingStandbyReminder } from './scheduleAlarm'

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
    const phaseLabel =
      focus.phase === 'break' ? '休息中' : focus.paused ? '已暂停' : '专注中'

    return {
      upcomingReminder: {
        icon: focus.phase === 'break' ? '🌿' : '🍅',
        text: phaseLabel,
      },
    }
  }

  const tasks = getWeekDayTasks(getTodayDayIndex())

  return {
    upcomingReminder: findUpcomingStandbyReminder(tasks, now),
  }
}
