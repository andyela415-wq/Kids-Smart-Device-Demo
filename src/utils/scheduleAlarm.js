import { parseTimeToMinutes } from './schedulePlan'

const FIRED_KEY = 'schedule_alarm_fired'
const SNOOZE_KEY = 'schedule_alarm_snooze'

const WEEKDAY_LABELS = ['一', '二', '三', '四', '五', '六', '日']

export function formatScheduleDate(date = new Date()) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const weekday = WEEKDAY_LABELS[date.getDay() === 0 ? 6 : date.getDay() - 1]
  return `${y}/${m}/${d} 星期${weekday}`
}

export function formatClockTime(date = new Date()) {
  const h = String(date.getHours()).padStart(2, '0')
  const m = String(date.getMinutes()).padStart(2, '0')
  return `${h}:${m}`
}

export function formatStandbyDate(date = new Date()) {
  const y = date.getFullYear()
  const m = date.getMonth() + 1
  const d = date.getDate()
  const weekday = WEEKDAY_LABELS[date.getDay() === 0 ? 6 : date.getDay() - 1]
  return `${y}年${m}月${d}日 周${weekday}`
}

function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

function loadFiredMap() {
  return JSON.parse(localStorage.getItem(FIRED_KEY) || '{}')
}

function saveFiredMap(map) {
  localStorage.setItem(FIRED_KEY, JSON.stringify(map))
}

export function markAlarmFired(taskId) {
  const map = loadFiredMap()
  map[`${todayKey()}:${taskId}`] = true
  saveFiredMap(map)
}

export function wasAlarmFired(taskId) {
  const map = loadFiredMap()
  return Boolean(map[`${todayKey()}:${taskId}`])
}

function loadSnoozeMap() {
  return JSON.parse(localStorage.getItem(SNOOZE_KEY) || '{}')
}

function saveSnoozeMap(map) {
  localStorage.setItem(SNOOZE_KEY, JSON.stringify(map))
}

export function setSnooze(taskId, minutes = 5) {
  const map = loadSnoozeMap()
  map[taskId] = Date.now() + minutes * 60 * 1000
  saveSnoozeMap(map)
}

export function clearSnooze(taskId) {
  const map = loadSnoozeMap()
  delete map[taskId]
  saveSnoozeMap(map)
}

function getSnoozeUntil(taskId) {
  return loadSnoozeMap()[taskId] || 0
}

export function findHighlightTaskIndex(tasks, now = new Date()) {
  if (!tasks.length) return -1

  const activeIndex = tasks.findIndex((t) => t.status === 'active')
  if (activeIndex >= 0) return activeIndex

  const nowMin = now.getHours() * 60 + now.getMinutes()
  let overdueIndex = -1
  let overdueMin = -1
  let upcomingIndex = -1
  let upcomingMin = Infinity

  tasks.forEach((task, index) => {
    if (task.status !== 'pending') return
    const taskMin = parseTimeToMinutes(task.startTime)
    if (taskMin <= nowMin && taskMin >= overdueMin) {
      overdueMin = taskMin
      overdueIndex = index
    } else if (taskMin > nowMin && taskMin < upcomingMin) {
      upcomingMin = taskMin
      upcomingIndex = index
    }
  })

  if (overdueIndex >= 0) return overdueIndex
  if (upcomingIndex >= 0) return upcomingIndex
  return tasks.findIndex((t) => t.status === 'pending')
}

const UPCOMING_SOON_MINUTES = 60

/** 熄屏页：始终展示最近的待办；60 分钟内用「即将{事项}」 */
export function findUpcomingStandbyReminder(tasks, now = new Date()) {
  if (!tasks.length) return null

  const nowMin = now.getHours() * 60 + now.getMinutes()
  const pending = tasks
    .filter((task) => task.status === 'pending')
    .sort((a, b) => parseTimeToMinutes(a.startTime) - parseTimeToMinutes(b.startTime))

  if (!pending.length) return null

  const futureTasks = pending.filter((task) => parseTimeToMinutes(task.startTime) > nowMin)
  const nextTask = futureTasks[0] || pending[pending.length - 1]

  const minutesUntil = parseTimeToMinutes(nextTask.startTime) - nowMin
  const icon = nextTask.icon || '⏰'

  if (minutesUntil > 0 && minutesUntil <= UPCOMING_SOON_MINUTES) {
    return {
      icon,
      text: `即将${nextTask.title}`,
    }
  }

  if (minutesUntil > UPCOMING_SOON_MINUTES) {
    return {
      icon,
      text: `${nextTask.startTime} ${nextTask.title}`,
    }
  }

  return {
    icon,
    text: `即将${nextTask.title}`,
  }
}

export function findDueAlarmTask(tasks, now = new Date()) {
  if (!tasks.length) return null

  const nowMin = now.getHours() * 60 + now.getMinutes()
  const nowKey = formatClockTime(now)

  for (let index = 0; index < tasks.length; index += 1) {
    const task = tasks[index]
    if (task.status !== 'pending') continue
    if (wasAlarmFired(task.id)) continue

    const snoozeUntil = getSnoozeUntil(task.id)
    if (snoozeUntil && Date.now() < snoozeUntil) continue

    const taskMin = parseTimeToMinutes(task.startTime)
    const exactMatch = task.startTime === nowKey
    const snoozeDue = snoozeUntil && Date.now() >= snoozeUntil && nowMin >= taskMin

    if (exactMatch || snoozeDue) {
      return { task, index }
    }
  }

  return null
}

export function buildAlarmSpeech(task) {
  if (task.source === 'demo') {
    return `${task.title}，准备好了吗？`
  }
  return `${task.title}时间到啦，准备好了吗？`
}

export const DEMO_ALARM_TASK = {
  id: 'demo-alarm-trigger',
  startTime: '点击',
  icon: '🔔',
  title: '演示闹钟',
  durationMinutes: 10,
  type: 'study',
  enableWater: true,
  status: 'pending',
  source: 'demo',
}

export function mapTaskToPomodoroLaunch(task) {
  const duration = task.durationMinutes || 20
  const enableWater = Boolean(task.enableWater)
  const type = task.type || 'study'

  if (type === 'study') {
    return {
      modeId: 'study',
      config: {
        intervalMinutes: duration,
        durationMinutes: duration,
        enableWater,
        waterIntervalMinutes: 15,
      },
      taskTitle: task.title,
      taskIcon: task.icon,
    }
  }

  if (type === 'review') {
    return {
      modeId: 'read',
      config: {
        intervalMinutes: duration,
        durationMinutes: duration,
        enableWater,
        waterIntervalMinutes: 15,
      },
      taskTitle: task.title,
      taskIcon: task.icon,
    }
  }

  return {
    modeId: 'custom',
    config: {
      customName: task.title,
      durationMinutes: duration,
      customInterval: duration,
      enableCustomRoundInterval: false,
      enableWater,
      waterIntervalMinutes: 15,
    },
    taskTitle: task.title,
    taskIcon: task.icon,
  }
}
