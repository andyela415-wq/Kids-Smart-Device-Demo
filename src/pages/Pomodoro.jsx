import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { hardwareHomeActions } from '../utils/hardwareHome'
import { writeHomeModeId } from '../utils/homeMode'
import DeviceGrowthHeader from '../components/DeviceGrowthHeader'
import TopBar from '../components/TopBar'
import ModeSelect from '../components/pomodoro/ModeSelect'
import ModeSetup from '../components/pomodoro/ModeSetup'
import TimerRunning from '../components/pomodoro/TimerRunning'
import ReminderPage from '../components/pomodoro/ReminderPage'
import { useOS } from '../context/LearningOSContext'
import { useCompanionSession } from '../hooks/useCompanionSession'

export default function Pomodoro() {
  const navigate = useNavigate()
  const os = useOS()
  const session = useCompanionSession()
  const launchedRef = useRef(false)

  useEffect(() => {
    if (launchedRef.current) return
    const launch = os.consumeScheduleLaunch()
    if (launch) {
      launchedRef.current = true
      session.startFromScheduleLaunch(launch)
    }
  }, [])

  useEffect(() => {
    hardwareHomeActions.pomodoroHome = () => {
      if (session.page !== 'select') {
        session.exitToSelect()
        return true
      }
      return false
    }
    return () => {
      hardwareHomeActions.pomodoroHome = null
    }
  }, [session.page, session.exitToSelect])

  const handleBack = () => {
    if (session.page === 'select') {
      writeHomeModeId('pomo')
      navigate('/')
      return
    }
    if (session.page === 'setup') {
      session.setPage('select')
      return
    }
    if (session.page === 'running' || session.page === 'reminder') {
      session.exitToSelect()
      return
    }
  }

  return (
    <div className="pomodoro-page">
      <TopBar title="番茄闹钟" onBack={handleBack} />
      {(session.page === 'select' || session.page === 'setup') && <DeviceGrowthHeader />}

      {session.page === 'select' && <ModeSelect onSelect={session.selectMode} />}

      {session.page === 'setup' && (
        <ModeSetup
          mode={session.mode}
          modeId={session.modeId}
          config={session.config}
          onChange={session.updateConfig}
          onStart={session.startSession}
          onBack={() => session.setPage('select')}
        />
      )}

      {session.page === 'running' && (
        <TimerRunning
          mode={session.mode}
          modeId={session.modeId}
          scheduleTaskTitle={session.scheduleTaskTitle}
          scheduleTaskIcon={session.scheduleTaskIcon}
          phase={session.phase}
          isRunning={session.isRunning}
          roundRemaining={session.roundRemaining}
          roundTotal={session.roundTotal}
          roundProgress={session.roundProgress}
          waterRemaining={session.waterRemaining}
          restRemaining={session.restRemaining}
          restTotal={session.mode.restMinutes * 60 || 300}
          config={session.config}
          formatTime={session.formatTime}
          onPause={session.pauseSession}
          onResume={session.resumeSession}
        />
      )}

      {session.page === 'reminder' && (
        <ReminderPage
          message={session.reminderMessage}
          subMessage={session.reminderSub}
          restMinutes={session.mode.restMinutes}
          onContinue={session.continueRound}
          onRest={session.startRest}
        />
      )}
    </div>
  )
}
