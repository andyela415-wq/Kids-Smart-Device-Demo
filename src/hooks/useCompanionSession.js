import { useCallback, useEffect, useRef, useState } from 'react'
import { getMode } from '../config/pomodoroModes'
import { getGrowthStats } from '../utils/pomodoroStorage'
import { recordPomodoroRound } from '../utils/learningGrowth'
import { writeFocusState } from '../utils/deviceStatus'
import { speakModeVoice, speakNextRound, speakRestStart, speakText } from '../utils/voiceReminder'
import { formatTime, minutesToSeconds, resolveRoundSeconds } from '../utils/timeFormat'

export function useCompanionSession() {
  const [page, setPage] = useState('select')
  const [modeId, setModeId] = useState('study')
  const [config, setConfig] = useState({
    intervalMinutes: 25,
    durationMinutes: 60,
    customName: '写作业',
    customInterval: 20,
    enableCustomRoundInterval: false,
    enableWater: true,
    waterIntervalMinutes: 15,
  })
  const [isRunning, setIsRunning] = useState(false)
  const [sessionRemaining, setSessionRemaining] = useState(0)
  const [roundRemaining, setRoundRemaining] = useState(0)
  const [roundTotal, setRoundTotal] = useState(0)
  const [waterRemaining, setWaterRemaining] = useState(0)
  const [phase, setPhase] = useState('round')
  const [restRemaining, setRestRemaining] = useState(0)
  const [growth, setGrowth] = useState(getGrowthStats)
  const [reminderMessage, setReminderMessage] = useState('')
  const [reminderSub, setReminderSub] = useState('')
  const [scheduleTaskTitle, setScheduleTaskTitle] = useState(null)
  const [scheduleTaskIcon, setScheduleTaskIcon] = useState(null)

  const tickRef = useRef(null)
  const completingRef = useRef(false)
  const configRef = useRef(config)

  configRef.current = config

  const mode = getMode(modeId)

  const getIntervalMinutes = useCallback(() => {
    if (modeId === 'custom') {
      return config.enableCustomRoundInterval
        ? config.customInterval
        : config.durationMinutes
    }
    if (modeId === 'study' || modeId === 'read') {
      return config.durationMinutes
    }
    return config.intervalMinutes
  }, [
    config.customInterval,
    config.durationMinutes,
    config.enableCustomRoundInterval,
    config.intervalMinutes,
    modeId,
  ])

  const resolveIntervalMinutes = useCallback(
    (cfg) => {
      if (modeId === 'custom') {
        return cfg.enableCustomRoundInterval ? cfg.customInterval : cfg.durationMinutes
      }
      if (modeId === 'study' || modeId === 'read') {
        return cfg.durationMinutes
      }
      return cfg.intervalMinutes
    },
    [modeId],
  )

  const clearTick = useCallback(() => {
    if (tickRef.current) {
      clearInterval(tickRef.current)
      tickRef.current = null
    }
  }, [])

  const buildReminderCopy = useCallback(() => {
    const mins = getIntervalMinutes()
    if (modeId === 'custom') {
      return {
        main: `你已经${config.customName}${mins}分钟啦`,
        sub: '休息一下：喝口水 · 看看窗外',
      }
    }
    if (modeId === 'water') {
      return {
        main: '喝水时间到啦',
        sub: '喝口水，补充能量吧',
      }
    }
    if (modeId === 'read') {
      return {
        main: '阅读时间结束啦',
        sub: '你今天又读完了一段内容',
      }
    }
    return {
      main: `你已经学习${mins}分钟啦`,
      sub: '休息一下：喝口水 · 看看窗外',
    }
  }, [config.customName, getIntervalMinutes, modeId])

  const selectMode = (id) => {
    const m = getMode(id)
    setModeId(id)
    setConfig((prev) => ({
      ...prev,
      intervalMinutes: m.defaultInterval,
      durationMinutes: m.defaultDuration,
      customInterval: m.defaultInterval,
      enableCustomRoundInterval: id === 'custom' ? false : prev.enableCustomRoundInterval,
      enableWater: id === 'water' ? false : prev.enableWater,
    }))
    setPage('setup')
  }

  const updateConfig = (patch) => {
    setConfig((prev) => {
      const next = { ...prev, ...patch }

      if (patch.durationMinutes != null) {
        const interval =
          modeId === 'custom' ? next.customInterval : next.intervalMinutes
        if (patch.durationMinutes < interval) {
          if (modeId === 'custom') next.customInterval = patch.durationMinutes
          else next.intervalMinutes = patch.durationMinutes
        }
      }

      if (patch.intervalMinutes != null && modeId !== 'custom') {
        if (patch.intervalMinutes > next.durationMinutes) {
          next.durationMinutes = patch.intervalMinutes
        }
      }

      if (patch.customInterval != null && modeId === 'custom') {
        if (patch.customInterval > next.durationMinutes) {
          next.durationMinutes = patch.customInterval
        }
      }

      return next
    })
  }

  const startSession = (overrides = {}) => {
    completingRef.current = false
    const cfg = { ...configRef.current, ...overrides }
    setConfig(cfg)

    const intervalMin = resolveIntervalMinutes(cfg)
    const sessionSec = minutesToSeconds(cfg.durationMinutes)
    const roundSec = resolveRoundSeconds(intervalMin, cfg.durationMinutes, sessionSec)

    setSessionRemaining(sessionSec)
    setRoundRemaining(roundSec)
    setRoundTotal(roundSec)
    setWaterRemaining(
      cfg.enableWater ? minutesToSeconds(cfg.waterIntervalMinutes) : 0,
    )
    setPhase('round')
    setIsRunning(true)
    setPage('running')
    speakText('开始啦，加油哦。')
  }

  const startFromScheduleLaunch = useCallback((launch) => {
    if (!launch) return false

    completingRef.current = false
    const nextModeId = launch.modeId || 'study'
    const cfg = { ...configRef.current, ...launch.config }

    setModeId(nextModeId)
    setConfig(cfg)
    configRef.current = cfg
    setScheduleTaskTitle(launch.taskTitle || launch.task?.title || null)
    setScheduleTaskIcon(launch.taskIcon || launch.task?.icon || null)

    const intervalMin =
      nextModeId === 'custom'
        ? cfg.enableCustomRoundInterval
          ? cfg.customInterval
          : cfg.durationMinutes
        : nextModeId === 'study' || nextModeId === 'read'
          ? cfg.durationMinutes
          : cfg.intervalMinutes

    const sessionSec = minutesToSeconds(cfg.durationMinutes)
    const roundSec = resolveRoundSeconds(intervalMin, cfg.durationMinutes, sessionSec)

    setSessionRemaining(sessionSec)
    setRoundRemaining(roundSec)
    setRoundTotal(roundSec)
    setWaterRemaining(cfg.enableWater ? minutesToSeconds(cfg.waterIntervalMinutes) : 0)
    setPhase('round')
    setIsRunning(true)
    setPage('running')
    speakText('开始啦，加油哦。')
    return true
  }, [])

  const pauseSession = () => {
    clearTick()
    setIsRunning(false)
  }

  const exitToSelect = useCallback(() => {
    completingRef.current = false
    clearTick()
    setIsRunning(false)
    setScheduleTaskTitle(null)
    setScheduleTaskIcon(null)
    setPage('select')
  }, [clearTick])

  const resumeSession = () => {
    setIsRunning(true)
  }

  const triggerRoundComplete = useCallback(() => {
    if (completingRef.current) return
    completingRef.current = true
    clearTick()
    setIsRunning(false)

    const stats = recordPomodoroRound(getIntervalMinutes())
    setGrowth(stats)
    speakModeVoice(mode, 'complete', getIntervalMinutes())

    const copy = buildReminderCopy()
    setReminderMessage(copy.main)
    setReminderSub(copy.sub)
    setPage('reminder')
  }, [buildReminderCopy, clearTick, getIntervalMinutes, mode])

  const continueRound = useCallback(() => {
    completingRef.current = false
    const cfg = configRef.current
    const sessionSec = minutesToSeconds(cfg.durationMinutes)
    const intervalMin = resolveIntervalMinutes(cfg)
    const sessionLeft = sessionRemaining <= 0 ? sessionSec : sessionRemaining
    const roundSec = resolveRoundSeconds(intervalMin, cfg.durationMinutes, sessionLeft)

    setSessionRemaining(sessionLeft)
    setRoundRemaining(roundSec)
    setRoundTotal(roundSec)
    setPhase('round')
    setIsRunning(true)
    setPage('running')
    speakNextRound()
  }, [modeId, resolveIntervalMinutes, sessionRemaining])

  const startRest = useCallback(() => {
    completingRef.current = false
    const restSec = minutesToSeconds(mode.restMinutes || 5)
    if (restSec <= 0) {
      continueRound()
      return
    }
    setRestRemaining(restSec)
    setPhase('rest')
    setIsRunning(true)
    setPage('running')
    speakRestStart()
  }, [continueRound, mode.restMinutes])

  useEffect(() => {
    if (!isRunning || page !== 'running') {
      clearTick()
      return undefined
    }

    tickRef.current = setInterval(() => {
      if (phase === 'rest') {
        setRestRemaining((prev) => {
          if (prev <= 1) {
            continueRound()
            return 0
          }
          return prev - 1
        })
        return
      }

      // 仅由轮次倒计时触发提醒，总时长归零不再重复触发
      setSessionRemaining((session) => {
        if (session <= 0) return 0
        return session - 1
      })

      setRoundRemaining((round) => {
        if (round <= 1) {
          triggerRoundComplete()
          return 0
        }
        return round - 1
      })

      if (config.enableWater) {
        setWaterRemaining((water) => {
          if (water <= 1) {
            speakText('小朋友，该喝口水啦。')
            return minutesToSeconds(config.waterIntervalMinutes)
          }
          return water - 1
        })
      }
    }, 1000)

    return () => clearTick()
  }, [
    isRunning,
    page,
    phase,
    config.enableWater,
    config.waterIntervalMinutes,
    clearTick,
    continueRound,
    triggerRoundComplete,
  ])

  useEffect(() => () => clearTick(), [clearTick])

  useEffect(() => {
    if (page !== 'running') {
      writeFocusState(null)
      return
    }

    writeFocusState({
      running: true,
      paused: !isRunning,
      label:
        scheduleTaskTitle ||
        (modeId === 'custom' ? config.customName : mode.label),
      enableWater: config.enableWater,
      waterRemaining,
      phase,
    })
  }, [
    page,
    isRunning,
    waterRemaining,
    config.enableWater,
    config.customName,
    scheduleTaskTitle,
    modeId,
    mode.label,
    phase,
  ])

  const roundProgress = roundTotal > 0 ? 1 - roundRemaining / roundTotal : 0
  const taskName = modeId === 'custom' ? config.customName : mode.taskLabel

  return {
    page,
    setPage,
    mode,
    modeId,
    config,
    isRunning,
    phase,
    sessionRemaining,
    roundRemaining,
    roundTotal,
    waterRemaining,
    restRemaining,
    roundProgress,
    growth,
    reminderMessage,
    reminderSub,
    taskName,
    scheduleTaskTitle,
    scheduleTaskIcon,
    selectMode,
    updateConfig,
    startSession,
    startFromScheduleLaunch,
    pauseSession,
    exitToSelect,
    resumeSession,
    continueRound,
    startRest,
    formatTime,
    getIntervalMinutes,
  }
}
