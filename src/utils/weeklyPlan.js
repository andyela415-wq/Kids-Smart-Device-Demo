import { WEEK_LABELS } from '../config/learningTasks'
import { getPlanForDay, loadAllPlans, savePlanForDay } from './learningPlanStorage'
import { resolvePlanForDay } from './schedulePlan'

/** 7 天计划容器：0=周一 … 6=周日 */
export function createEmptyWeeklyPlan() {
  return {
    0: [],
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
  }
}

export function loadWeeklyPlan() {
  const stored = loadAllPlans()
  const weekly = createEmptyWeeklyPlan()

  for (let day = 0; day <= 6; day += 1) {
    weekly[day] = stored[String(day)] ? [...stored[String(day)]] : []
  }

  return weekly
}

/** 读取某日计划（含默认种子与睡觉任务） */
export function getWeekDayTasks(dayIndex) {
  return resolvePlanForDay(dayIndex)
}

/** 写入某日计划并同步 WeeklyPlan */
export function setWeekDayTasks(dayIndex, tasks) {
  savePlanForDay(dayIndex, tasks)
  return tasks
}

export function buildDayHint(dayIndex, tasks, todayIndex) {
  const pendingCount = tasks.filter((task) => task.status !== 'done').length
  const count = pendingCount || tasks.length

  if (count === 0) {
    return '这一天还没有安排，点右下角 + 添加计划吧～'
  }

  const tomorrow = (todayIndex + 1) % 7
  if (dayIndex === tomorrow) {
    return `明天会有 ${count} 个精彩计划，加油！`
  }

  return `周${WEEK_LABELS[dayIndex]}会有 ${count} 个精彩计划，加油！`
}

export function isSelectedDayToday(selectedDay, todayIndex) {
  return selectedDay === todayIndex
}

export { getPlanForDay }
