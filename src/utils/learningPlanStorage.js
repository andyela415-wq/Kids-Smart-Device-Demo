const PLAN_KEY = 'learning_os_plans'

export function getTodayDayIndex() {
  const day = new Date().getDay()
  return day === 0 ? 6 : day - 1
}

export function loadAllPlans() {
  return JSON.parse(localStorage.getItem(PLAN_KEY) || '{}')
}

export function getPlanForDay(dayIndex) {
  const plans = loadAllPlans()
  return plans[String(dayIndex)] || []
}

export function savePlanForDay(dayIndex, tasks) {
  const plans = loadAllPlans()
  plans[String(dayIndex)] = tasks
  localStorage.setItem(PLAN_KEY, JSON.stringify(plans))
  return tasks
}

export function updateTaskStatus(dayIndex, taskId, status) {
  const tasks = getPlanForDay(dayIndex).map((task) =>
    task.id === taskId ? { ...task, status } : task,
  )
  savePlanForDay(dayIndex, tasks)
  return tasks
}

export function clearActiveStatuses(dayIndex) {
  const tasks = getPlanForDay(dayIndex).map((task) => ({
    ...task,
    status: task.status === 'active' ? 'pending' : task.status,
  }))
  savePlanForDay(dayIndex, tasks)
  return tasks
}

export function updatePlanTask(dayIndex, taskId, patch) {
  const tasks = getPlanForDay(dayIndex).map((task) =>
    task.id === taskId ? { ...task, ...patch } : task,
  )
  savePlanForDay(dayIndex, tasks)
  return tasks
}

export function removePlanTask(dayIndex, taskId) {
  const tasks = getPlanForDay(dayIndex).filter((task) => task.id !== taskId)
  savePlanForDay(dayIndex, tasks)
  return tasks
}
