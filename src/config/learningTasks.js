import { getTodayDayIndex } from '../utils/learningPlanStorage'

export const WEEK_LABELS = ['一', '二', '三', '四', '五', '六', '日']

export const TASK_STATE_LABELS = {
  study: '学习中',
  review: '练习中',
  rest: '休息中',
}

function padTime(h, m) {
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

function addMinutesToTime(hours, minutes, add) {
  const total = hours * 60 + minutes + add
  return padTime(Math.floor(total / 60) % 24, total % 60)
}

export function buildAiProposal(lesson) {
  return {
    lessonId: lesson.id,
    lessonTitle: lesson.title,
    content: '生字词 · 句型结构 · 语义理解',
    durationMinutes: 20,
    needReview: true,
    enableWater: true,
    checks: ['生字词', '句型结构', '语义理解'],
  }
}

export function buildPlanFromProposal(proposal) {
  const now = new Date()
  let h = now.getHours()
  let m = Math.ceil(now.getMinutes() / 5) * 5
  if (m >= 60) {
    h += 1
    m = 0
  }

  const start = padTime(h, m)
  const tasks = [
    {
      id: `task-${Date.now()}-1`,
      startTime: start,
      type: 'study',
      icon: '📖',
      title: '语文朗读',
      durationMinutes: proposal.durationMinutes,
      enableWater: proposal.enableWater,
      status: 'pending',
      source: 'ai',
    },
    {
      id: `task-${Date.now()}-2`,
      startTime: addMinutesToTime(h, m, proposal.durationMinutes),
      type: 'rest',
      icon: '⏸',
      title: '休息',
      durationMinutes: 5,
      enableWater: false,
      status: 'pending',
      source: 'ai',
    },
  ]

  if (proposal.needReview) {
    tasks.push({
      id: `task-${Date.now()}-3`,
      startTime: addMinutesToTime(h, m, proposal.durationMinutes + 5),
      type: 'review',
      icon: '📚',
      title: '词语复习',
      durationMinutes: 10,
      enableWater: false,
      status: 'pending',
      source: 'ai',
    })
  }

  return tasks
}

export function getDemoPlanForDay(dayIndex) {
  if (dayIndex === getTodayDayIndex()) return null

  const samples = [
    [{ startTime: '16:00', icon: '📖', title: '阅读', durationMinutes: 15, type: 'study' }],
    [{ startTime: '17:30', icon: '📚', title: '复习', durationMinutes: 10, type: 'review' }],
    [],
    [{ startTime: '09:00', icon: '📖', title: '语文', durationMinutes: 20, type: 'study' }],
    [],
    [{ startTime: '10:00', icon: '🍅', title: '专注', durationMinutes: 25, type: 'study' }],
    [],
  ]

  return (samples[dayIndex] || []).map((item, i) => ({
    ...item,
    id: `demo-${dayIndex}-${i}`,
    enableWater: false,
    status: 'pending',
    source: 'manual',
  }))
}
