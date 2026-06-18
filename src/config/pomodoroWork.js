/** 经典番茄工作法时长（分钟） */
export const POMODORO_TIMING = {
  FOCUS_MINUTES: 25,
  BREAK_MINUTES: 5,
  LONG_BREAK_MINUTES: 15,
  CYCLES_BEFORE_LONG: 4,
}

/** 准备页可设置的专注时长选项 */
export const FOCUS_DURATION_OPTIONS = [15, 20, 25, 30, 35, 45]

export function clampFocusMinutes(minutes) {
  const n = Number(minutes)
  if (!Number.isFinite(n)) return POMODORO_TIMING.FOCUS_MINUTES
  if (FOCUS_DURATION_OPTIONS.includes(n)) return n
  return FOCUS_DURATION_OPTIONS.reduce((best, opt) =>
    Math.abs(opt - n) < Math.abs(best - n) ? opt : best,
  )
}

export const POMODORO_PHASE = {
  FOCUS: 'focus',
  BREAK: 'break',
  LONG_BREAK: 'longBreak',
}

/** 番茄任务选择页 · 全科预设卡片 */
export const POMODORO_TASK_PRESETS = [
  { id: 'preset-chinese', title: '语文', icon: '📖' },
  { id: 'preset-words', title: '背单词', icon: '📝' },
  { id: 'preset-reading', title: '读课文', icon: '📚' },
  { id: 'preset-writing', title: '写作练习', icon: '✍️' },
  { id: 'preset-math', title: '数学思维', icon: '🔢' },
  { id: 'preset-listening', title: '英语听力', icon: '🎧' },
]

export function getPhaseDurationMinutes(phase, focusMinutes = POMODORO_TIMING.FOCUS_MINUTES) {
  switch (phase) {
    case POMODORO_PHASE.FOCUS:
      return clampFocusMinutes(focusMinutes)
    case POMODORO_PHASE.LONG_BREAK:
      return POMODORO_TIMING.LONG_BREAK_MINUTES
    case POMODORO_PHASE.BREAK:
    default:
      return POMODORO_TIMING.BREAK_MINUTES
  }
}

export function resolveUiState(page, phase) {
  if (page === 'done') return 'done'
  if (phase === POMODORO_PHASE.FOCUS) return 'focus'
  return 'break'
}

export function shouldLongBreak(completedPomodoros) {
  return (
    completedPomodoros > 0 &&
    completedPomodoros % POMODORO_TIMING.CYCLES_BEFORE_LONG === 0
  )
}
