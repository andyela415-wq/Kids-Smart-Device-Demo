import { useCallback, useEffect, useRef, useState } from 'react'
import {
  clampFocusMinutes,
  getPhaseDurationMinutes,
  POMODORO_PHASE,
  POMODORO_TIMING,
  resolveUiState,
  shouldLongBreak,
} from '../config/pomodoroWork'
import { getGrowthStats } from '../utils/pomodoroStorage'
import { recordPomodoroRound } from '../utils/learningGrowth'
import { writeFocusState } from '../utils/deviceStatus'
import { speakRestStart, speakText } from '../utils/voiceReminder'
import { formatTime, minutesToSeconds } from '../utils/timeFormat'

function normalizeTask(raw) {
  if (!raw?.title) return null
  return {
    id: raw.id || `task-${Date.now()}`,
    title: raw.title,
    icon: raw.icon || '📚',
    durationMinutes: raw.durationMinutes,
  }
}

export function useCompanionSession() {
  const [page, setPage] = useState('task')
  const [phase, setPhase] = useState(POMODORO_PHASE.FOCUS)
  const [task, setTask] = useState(null)
  const [completedPomodoros, setCompletedPomodoros] = useState(0)
  const [remaining, setRemaining] = useState(0)
  const [total, setTotal] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [growth, setGrowth] = useState(getGrowthStats)
  const [focusMinutes, setFocusMinutesState] = useState(POMODORO_TIMING.FOCUS_MINUTES)

  const tickRef = useRef(null)
  const pageRef = useRef(page)
  const phaseRef = useRef(phase)
  const completedRef = useRef(completedPomodoros)
  const taskRef = useRef(task)
  const focusMinutesRef = useRef(focusMinutes)
  const transitioningRef = useRef(false)

  pageRef.current = page
  phaseRef.current = phase
  completedRef.current = completedPomodoros
  taskRef.current = task
  focusMinutesRef.current = focusMinutes

  const setFocusMinutes = useCallback((minutes) => {
    const next = clampFocusMinutes(minutes)
    setFocusMinutesState(next)
    focusMinutesRef.current = next
  }, [])

  const clearTick = useCallback(() => {
    if (tickRef.current) {
      clearInterval(tickRef.current)
      tickRef.current = null
    }
  }, [])

  const enterPhase = useCallback(
    (nextPhase) => {
      const sec = minutesToSeconds(
        getPhaseDurationMinutes(nextPhase, focusMinutesRef.current),
      )
      setPhase(nextPhase)
      setRemaining(sec)
      setTotal(sec)
      setIsRunning(true)
      setPage('session')

      if (nextPhase === POMODORO_PHASE.FOCUS) {
        speakText('开始专注，加油！')
      } else {
        speakRestStart()
      }
    },
    [],
  )

  const enterFocus = useCallback(() => enterPhase(POMODORO_PHASE.FOCUS), [enterPhase])

  const enterBreakAfterFocus = useCallback(
    (nextCompleted) => {
      const long = shouldLongBreak(nextCompleted)
      enterPhase(long ? POMODORO_PHASE.LONG_BREAK : POMODORO_PHASE.BREAK)
    },
    [enterPhase],
  )

  const finishFocusPhase = useCallback(() => {
    const nextCompleted = completedRef.current + 1
    setCompletedPomodoros(nextCompleted)
    setGrowth(recordPomodoroRound(focusMinutesRef.current))
    enterBreakAfterFocus(nextCompleted)
  }, [enterBreakAfterFocus])

  const finishBreakPhase = useCallback(() => {
    enterFocus()
  }, [enterFocus])

  const completePhase = useCallback(() => {
    if (transitioningRef.current || pageRef.current !== 'session') return
    transitioningRef.current = true
    clearTick()
    setIsRunning(false)

    if (phaseRef.current === POMODORO_PHASE.FOCUS) {
      finishFocusPhase()
    } else {
      finishBreakPhase()
    }

    window.setTimeout(() => {
      transitioningRef.current = false
    }, 300)
  }, [clearTick, finishBreakPhase, finishFocusPhase])

  const bindTask = useCallback((rawTask) => {
    const next = normalizeTask(rawTask)
    if (!next) return
    setTask(next)
    setCompletedPomodoros(0)
    setFocusMinutes(next.durationMinutes ?? POMODORO_TIMING.FOCUS_MINUTES)
    setPage('ready')
  }, [setFocusMinutes])

  const startSession = useCallback(() => {
    if (!taskRef.current) return
    setCompletedPomodoros(0)
    enterFocus()
  }, [enterFocus])

  const togglePause = useCallback(() => {
    setIsRunning((value) => !value)
  }, [])

  const skipPhase = useCallback(() => {
    completePhase()
  }, [completePhase])

  const completeSession = useCallback(() => {
    clearTick()
    setIsRunning(false)
    setPage('done')
    speakText('太棒啦，任务完成！')
  }, [clearTick])

  const startFromScheduleLaunch = useCallback(
    (launch) => {
      if (!launch) return false
      const bound = normalizeTask({
        id: launch.task?.id,
        title: launch.taskTitle || launch.task?.title,
        icon: launch.taskIcon || launch.task?.icon,
      })
      if (!bound) return false
      setTask(bound)
      setCompletedPomodoros(0)
      setFocusMinutes(launch.config?.durationMinutes ?? POMODORO_TIMING.FOCUS_MINUTES)
      setPage('ready')
      return true
    },
    [setFocusMinutes],
  )

  const exitToSelect = useCallback(() => {
    clearTick()
    setIsRunning(false)
    setTask(null)
    setCompletedPomodoros(0)
    setFocusMinutes(POMODORO_TIMING.FOCUS_MINUTES)
    setPage('task')
  }, [clearTick, setFocusMinutes])

  useEffect(() => {
    if (!isRunning || page !== 'session') {
      clearTick()
      return undefined
    }

    tickRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          completePhase()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearTick()
  }, [clearTick, completePhase, isRunning, page, phase, total])

  useEffect(() => () => clearTick(), [clearTick])

  useEffect(() => {
    if (page !== 'session') {
      writeFocusState(null)
      return
    }

    const uiState = resolveUiState(page, phase)
    writeFocusState({
      running: true,
      paused: !isRunning,
      label: task?.title || '学习任务',
      phase: uiState,
      pomodoroCount: completedPomodoros,
    })
  }, [completedPomodoros, isRunning, page, phase, task])

  const progress = total > 0 ? 1 - remaining / total : 0
  const uiState = resolveUiState(page, phase)

  return {
    page,
    phase,
    uiState,
    task,
    completedPomodoros,
    remaining,
    total,
    progress,
    isRunning,
    isPaused: !isRunning && page === 'session',
    growth,
    bindTask,
    startSession,
    togglePause,
    skipPhase,
    completeSession,
    startFromScheduleLaunch,
    exitToSelect,
    formatTime,
    focusMinutes,
    setFocusMinutes,
  }
}
