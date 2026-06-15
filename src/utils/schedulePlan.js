import { getTodayDayIndex, savePlanForDay, getPlanForDay } from './learningPlanStorage'

const DEFAULT_SEED_KEY = 'learning_plan_seeded'

export const SLEEP_TASK_TEMPLATE = {
  startTime: '21:30',
  icon: '🌙',
  title: '睡觉',
  durationMinutes: 30,
  type: 'routine',
}

export function createSleepTask(dayIndex) {
  return {
    ...SLEEP_TASK_TEMPLATE,
    id: `default-${dayIndex}-sleep`,
    enableWater: false,
    status: 'pending',
    source: 'default',
  }
}

export function sortPlanTasks(tasks) {
  return [...tasks].sort((a, b) => a.startTime.localeCompare(b.startTime))
}

export function ensureSleepInTasks(tasks, dayIndex) {
  if (!tasks.length) return getDefaultPlanForDay(dayIndex)

  const hasSleep = tasks.some(
    (task) => task.title === '睡觉' && task.startTime === '21:30',
  )
  if (hasSleep) return sortPlanTasks(tasks)

  return sortPlanTasks([...tasks, createSleepTask(dayIndex)])
}

/** 读取某日计划，保证含 21:30 睡觉并写回 localStorage */
export function resolvePlanForDay(dayIndex) {
  const stored = getPlanForDay(dayIndex)
  const resolved = ensureSleepInTasks(stored, dayIndex)

  const storedKey = stored.map((task) => task.id).join(',')
  const resolvedKey = resolved.map((task) => task.id).join(',')
  if (storedKey !== resolvedKey) {
    savePlanForDay(dayIndex, resolved)
  }

  return resolved
}

export function syncAllPlans() {
  for (let day = 0; day <= 6; day += 1) {
    resolvePlanForDay(day)
  }
}

export function parseTimeToMinutes(time) {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

export function getDefaultPlanForDay(dayIndex) {
  const weekdayPlans = [
    [
      { startTime: '07:00', icon: '🌅', title: '起床', durationMinutes: 10, type: 'routine' },
      { startTime: '07:20', icon: '📖', title: '语文朗读', durationMinutes: 20, type: 'study' },
      { startTime: '08:00', icon: '🔢', title: '数学练习', durationMinutes: 25, type: 'study' },
      { startTime: '18:00', icon: '🔤', title: '英语单词', durationMinutes: 15, type: 'study' },
    ],
    [
      { startTime: '07:10', icon: '🌅', title: '起床', durationMinutes: 10, type: 'routine' },
      { startTime: '16:00', icon: '📖', title: '课外阅读', durationMinutes: 20, type: 'study' },
    ],
    [
      { startTime: '07:00', icon: '🌅', title: '起床', durationMinutes: 10, type: 'routine' },
      { startTime: '17:30', icon: '📚', title: '词语复习', durationMinutes: 15, type: 'review' },
    ],
    [
      { startTime: '07:00', icon: '🌅', title: '起床', durationMinutes: 10, type: 'routine' },
      { startTime: '09:00', icon: '📖', title: '语文', durationMinutes: 20, type: 'study' },
    ],
    [
      { startTime: '07:00', icon: '🌅', title: '起床', durationMinutes: 10, type: 'routine' },
      { startTime: '08:00', icon: '🔢', title: '数学', durationMinutes: 20, type: 'study' },
    ],
    [
      { startTime: '08:30', icon: '🍅', title: '周末专注', durationMinutes: 25, type: 'study' },
    ],
    [
      { startTime: '09:00', icon: '📖', title: '自由阅读', durationMinutes: 30, type: 'study' },
    ],
  ]

  const template = weekdayPlans[dayIndex] || weekdayPlans[0]

  return [
    ...template.map((item, i) => ({
      ...item,
      id: `default-${dayIndex}-${i}`,
      enableWater: item.type === 'study' || item.type === 'review',
      status: 'pending',
      source: 'default',
    })),
    createSleepTask(dayIndex),
  ]
}

export function findTaskToExecute(tasks) {
  if (!tasks.length) return null

  const activeIndex = tasks.findIndex((t) => t.status === 'active')
  if (activeIndex >= 0) return { task: tasks[activeIndex], index: activeIndex }

  const now = new Date()
  const nowMin = now.getHours() * 60 + now.getMinutes()

  let bestIndex = -1
  let bestMin = -1

  tasks.forEach((task, index) => {
    if (task.status !== 'pending') return
    const taskMin = parseTimeToMinutes(task.startTime)
    if (taskMin <= nowMin && taskMin >= bestMin) {
      bestMin = taskMin
      bestIndex = index
    }
  })

  if (bestIndex >= 0) return { task: tasks[bestIndex], index: bestIndex }

  const nextIndex = tasks.findIndex((t) => t.status === 'pending')
  if (nextIndex >= 0) return { task: tasks[nextIndex], index: nextIndex }

  return null
}

export function seedDefaultPlansIfEmpty() {
  const today = getTodayDayIndex()

  if (!getPlanForDay(today).length) {
    savePlanForDay(today, getDefaultPlanForDay(today))
  }

  if (localStorage.getItem(DEFAULT_SEED_KEY)) return

  for (let day = 0; day <= 6; day += 1) {
    if (!getPlanForDay(day).length) {
      savePlanForDay(day, getDefaultPlanForDay(day))
    }
  }

  localStorage.setItem(DEFAULT_SEED_KEY, '1')
}

export { getTodayDayIndex, savePlanForDay }
