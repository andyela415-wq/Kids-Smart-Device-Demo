import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { buildAiProposal, buildPlanFromProposal } from '../config/learningTasks'
import { getLesson, LESSONS } from '../config/tutoringLessons'
import { recordTutoringStudy } from '../utils/learningGrowth'
import { resumeAudioContext, startAlarmSound, stopAlarmSound } from '../utils/alarmSound'
import {
  getPlanForDay,
  getTodayDayIndex,
  savePlanForDay,
} from '../utils/learningPlanStorage'
import {
  buildAlarmSpeech,
  clearSnooze,
  findDueAlarmTask,
  findHighlightTaskIndex,
  markAlarmFired,
  mapTaskToPomodoroLaunch,
  setSnooze,
} from '../utils/scheduleAlarm'
import {
  ensureSleepInTasks,
  resolvePlanForDay,
  sortPlanTasks,
} from '../utils/schedulePlan'
import { getWeekDayTasks, setWeekDayTasks } from '../utils/weeklyPlan'
import { speakText } from '../utils/voiceReminder'

export function useLearningOS() {
  const navigate = useNavigate()
  const launchRef = useRef(null)
  const alarmMatchRef = useRef(null)

  const [aiPage, setAiPage] = useState('select')
  const [lessonId, setLessonId] = useState(LESSONS[0]?.id ?? '')
  const [proposal, setProposal] = useState(null)

  const [planDay, setPlanDay] = useState(getTodayDayIndex())
  const [planTasks, setPlanTasks] = useState(() => resolvePlanForDay(getTodayDayIndex()))
  const [feedback, setFeedback] = useState(null)

  const [alarmRinging, setAlarmRinging] = useState(false)
  const [alarmTask, setAlarmTask] = useState(null)
  const [highlightIndex, setHighlightIndex] = useState(-1)

  const lesson = getLesson(lessonId)

  const refreshPlan = useCallback((dayIndex = planDay) => {
    const tasks = getWeekDayTasks(dayIndex)
    setPlanDay(dayIndex)
    setPlanTasks(tasks)
    if (dayIndex === getTodayDayIndex()) {
      setHighlightIndex(findHighlightTaskIndex(tasks))
    } else {
      setHighlightIndex(-1)
    }
    return tasks
  }, [planDay])

  const ringAlarm = useCallback((match) => {
    if (alarmMatchRef.current === match.task.id) return
    alarmMatchRef.current = match.task.id
    setAlarmTask(match.task)
    setAlarmRinging(true)
    resumeAudioContext()
    startAlarmSound(() => speakText(buildAlarmSpeech(match.task)))
  }, [])

  const dismissAlarm = useCallback(() => {
    stopAlarmSound()
    setAlarmRinging(false)
    setAlarmTask(null)
    alarmMatchRef.current = null
  }, [])

  useEffect(() => {
    if (planDay !== getTodayDayIndex()) return undefined

    const tick = () => {
      const tasks = getPlanForDay(getTodayDayIndex())
      setHighlightIndex(findHighlightTaskIndex(tasks))

      if (alarmRinging) return

      const match = findDueAlarmTask(tasks)
      if (match) ringAlarm(match)
    }

    tick()
    const timer = window.setInterval(tick, 1000)
    return () => clearInterval(timer)
  }, [alarmRinging, planDay, ringAlarm])

  useEffect(() => () => stopAlarmSound(), [])

  const confirmAlarmReady = useCallback(() => {
    if (!alarmTask) return

    if (alarmTask.source !== 'demo') {
      const today = getTodayDayIndex()
      const tasks = getPlanForDay(today)
      const index = tasks.findIndex((t) => t.id === alarmTask.id)
      if (index < 0) return

      const updated = tasks.map((t, i) => ({
        ...t,
        status: i === index ? 'active' : t.status,
      }))
      savePlanForDay(today, updated)
      setPlanTasks(updated)
      setHighlightIndex(index)

      markAlarmFired(alarmTask.id)
      clearSnooze(alarmTask.id)

      launchRef.current = {
        task: alarmTask,
        index,
        ...mapTaskToPomodoroLaunch(alarmTask),
      }
    } else {
      launchRef.current = {
        task: alarmTask,
        index: -1,
        ...mapTaskToPomodoroLaunch(alarmTask),
      }
    }

    dismissAlarm()
    navigate('/pomodoro')
  }, [alarmTask, dismissAlarm, navigate])

  const snoozeAlarm = useCallback(() => {
    if (!alarmTask) return
    setSnooze(alarmTask.id, 5)
    dismissAlarm()
  }, [alarmTask, dismissAlarm])

  const consumeScheduleLaunch = useCallback(() => {
    const launch = launchRef.current
    launchRef.current = null
    return launch
  }, [])

  const previewAlarm = useCallback(
    (task) => {
      if (task.source === 'demo') {
        ringAlarm({ task, index: -1 })
        return
      }
      if (planDay !== getTodayDayIndex() || task.status === 'done') return
      ringAlarm({ task, index: planTasks.findIndex((t) => t.id === task.id) })
    },
    [planDay, planTasks, ringAlarm],
  )

  const selectLesson = useCallback((id) => {
    setLessonId(id)
  }, [])

  const startAnalysis = useCallback(() => {
    if (!lessonId) return
    setAiPage('analyze')
  }, [lessonId])

  const finishAnalysis = useCallback(() => {
    recordTutoringStudy(8)
    setProposal(buildAiProposal(getLesson(lessonId)))
    setAiPage('report')
  }, [lessonId])

  const startChat = useCallback(() => {
    setAiPage('chat')
  }, [])

  const goToReport = useCallback(() => {
    setAiPage('report')
  }, [])

  const goToProposal = useCallback(() => {
    if (!proposal) {
      setProposal(buildAiProposal(getLesson(lessonId)))
    }
    setAiPage('proposal')
  }, [lessonId, proposal])

  const generatePlan = useCallback(() => {
    if (!proposal) return
    const aiTasks = buildPlanFromProposal(proposal)
    const today = getTodayDayIndex()
    const existing = resolvePlanForDay(today).filter((t) => t.source !== 'ai')
    const merged = ensureSleepInTasks(
      [...existing, ...aiTasks].sort((a, b) => a.startTime.localeCompare(b.startTime)),
      today,
    )
    savePlanForDay(today, merged)
    setPlanDay(today)
    setPlanTasks(merged)
    setHighlightIndex(findHighlightTaskIndex(merged))
    setAiPage('select')
    navigate('/plan')
  }, [navigate, proposal])

  const switchPlanDay = useCallback(
    (dayIndex) => {
      refreshPlan(dayIndex)
    },
    [refreshPlan],
  )

  const addPlanTask = useCallback(
    (preset) => {
      const tasks = [...getPlanForDay(planDay)]
      const newTask = {
        id: `custom-${Date.now()}`,
        startTime: preset.startTime || '20:00',
        icon: preset.icon,
        title: preset.title,
        durationMinutes: 20,
        type: preset.type || 'study',
        enableWater: preset.type === 'study' || preset.type === 'review',
        status: 'pending',
        source: 'custom',
      }
      const merged = ensureSleepInTasks(sortPlanTasks([...tasks, newTask]), planDay)
      setWeekDayTasks(planDay, merged)
      setPlanTasks(merged)
      if (planDay === getTodayDayIndex()) {
        setHighlightIndex(findHighlightTaskIndex(merged))
      }
    },
    [planDay],
  )

  const togglePlanTaskDone = useCallback(
    (taskId) => {
      const tasks = getPlanForDay(planDay)
      const updated = tasks.map((task) =>
        task.id === taskId && task.status === 'pending'
          ? { ...task, status: 'done' }
          : task,
      )
      setWeekDayTasks(planDay, updated)
      setPlanTasks(updated)
      if (planDay === getTodayDayIndex()) {
        setHighlightIndex(findHighlightTaskIndex(updated))
      }
    },
    [planDay],
  )

  const startPomodoroFromPlan = useCallback(() => {
    const today = getTodayDayIndex()
    const tasks = refreshPlan(today)
    const index = findHighlightTaskIndex(tasks)
    const task = index >= 0 ? tasks[index] : null
    if (task && task.status === 'pending') {
      previewAlarm(task)
      return
    }
    navigate('/pomodoro')
  }, [navigate, previewAlarm, refreshPlan])

  const resetAiFlow = useCallback(() => {
    setAiPage('select')
    setProposal(null)
  }, [])

  return {
    aiPage,
    setAiPage,
    lesson,
    lessonId,
    proposal,
    selectLesson,
    startAnalysis,
    finishAnalysis,
    startChat,
    goToReport,
    goToProposal,
    generatePlan,
    resetAiFlow,
    planDay,
    planTasks,
    switchPlanDay,
    addPlanTask,
    togglePlanTaskDone,
    startPomodoroFromPlan,
    refreshPlan,
    feedback,
    setFeedback,
    alarmRinging,
    alarmTask,
    highlightIndex,
    confirmAlarmReady,
    snoozeAlarm,
    consumeScheduleLaunch,
    previewAlarm,
  }
}
