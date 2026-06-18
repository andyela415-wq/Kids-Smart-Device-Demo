import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PomodoroBreakScreen from '../components/pomodoro/PomodoroBreakScreen'
import PomodoroDoneScreen from '../components/pomodoro/PomodoroDoneScreen'
import PomodoroFocusScreen from '../components/pomodoro/PomodoroFocusScreen'
import PomodoroReadyScreen from '../components/pomodoro/PomodoroReadyScreen'
import PomodoroTaskPick from '../components/pomodoro/PomodoroTaskPick'
import { useOS } from '../context/LearningOSContext'
import { useCompanionSession } from '../hooks/useCompanionSession'
import { hardwareHomeActions } from '../utils/hardwareHome'
import { getTodayDayIndex } from '../utils/learningPlanStorage'
import { writeHomeModeId } from '../utils/homeMode'
import {
  clearPomodoroReturnTo,
  getPomodoroReturnTo,
  setPomodoroReturnTo,
} from '../utils/pomodoroReturn'
import { resolveUiState } from '../config/pomodoroWork'

export default function Pomodoro() {
  const navigate = useNavigate()
  const os = useOS()
  const session = useCompanionSession()
  const launchedRef = useRef(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [returnTo, setReturnTo] = useState(() => getPomodoroReturnTo())

  useEffect(() => {
    os.refreshPlan(getTodayDayIndex())
  }, [])

  useEffect(() => {
    if (launchedRef.current) return
    const launch = os.consumeScheduleLaunch()
    if (launch) {
      launchedRef.current = true
      if (launch.returnTo) {
        setReturnTo(launch.returnTo)
        setPomodoroReturnTo(launch.returnTo)
      }
      session.startFromScheduleLaunch(launch)
    }
  }, [])

  useEffect(() => {
    if (session.page !== 'ready') {
      setSettingsOpen(false)
    }
  }, [session.page])

  const exitPomodoro = useCallback(
    (resetSession = true) => {
      if (resetSession) {
        session.exitToSelect()
      }

      const destination = returnTo || getPomodoroReturnTo()
      clearPomodoroReturnTo()
      setReturnTo(null)

      if (destination) {
        writeHomeModeId('plan')
        navigate(destination)
        return
      }

      writeHomeModeId('pomo')
      navigate('/')
    },
    [navigate, returnTo, session.exitToSelect],
  )

  useEffect(() => {
    hardwareHomeActions.pomodoroHome = () => {
      if (session.page === 'ready') {
        session.exitToSelect()
        return true
      }

      if (session.page !== 'task') {
        exitPomodoro(true)
        return true
      }

      if (returnTo || getPomodoroReturnTo()) {
        exitPomodoro(true)
        return true
      }

      return false
    }
    return () => {
      hardwareHomeActions.pomodoroHome = null
    }
  }, [exitPomodoro, returnTo, session.exitToSelect, session.page])

  const handleBackFromReady = () => {
    session.exitToSelect()
  }

  const handleBackFromBreak = () => {
    exitPomodoro(true)
  }

  if (session.page === 'task') {
    return (
      <div className="pomodoro-page pomodoro-page--work">
        <PomodoroTaskPick
          planTasks={os.planTasks}
          onSelect={session.bindTask}
          onBack={() => exitPomodoro(true)}
        />
      </div>
    )
  }

  if (session.page === 'ready' && session.task) {
    return (
      <div className="pomodoro-page pomodoro-page--work">
        <PomodoroReadyScreen
          task={session.task}
          focusMinutes={session.focusMinutes}
          onStart={session.startSession}
          onBack={handleBackFromReady}
          onFocusMinutesChange={session.setFocusMinutes}
          settingsOpen={settingsOpen}
          onOpenSettings={() => setSettingsOpen((open) => !open)}
          onCloseSettings={() => setSettingsOpen(false)}
        />
      </div>
    )
  }

  if (session.page === 'session' && session.task) {
    const uiState = resolveUiState(session.page, session.phase)
    const shared = {
      completedPomodoros: session.completedPomodoros,
      remaining: session.remaining,
      progress: session.progress,
      isRunning: session.isRunning,
      formatTime: session.formatTime,
      onTogglePause: session.togglePause,
      onSkipPhase: session.skipPhase,
      onComplete: session.completeSession,
    }

    return (
      <div className="pomodoro-page pomodoro-page--work">
        {uiState === 'break' ? (
          <PomodoroBreakScreen {...shared} onBack={handleBackFromBreak} />
        ) : (
          <PomodoroFocusScreen {...shared} />
        )}
      </div>
    )
  }

  if (session.page === 'done') {
    return (
      <div className="pomodoro-page pomodoro-page--work">
        <PomodoroDoneScreen
          task={session.task}
          completedPomodoros={session.completedPomodoros}
          onHome={() => exitPomodoro(true)}
        />
      </div>
    )
  }

  return null
}
