import { useOS } from '../../context/LearningOSContext'
import ScheduleAlarmScreen from './ScheduleAlarmScreen'

export default function ScheduleAlarmOverlay() {
  const os = useOS()

  if (!os.alarmRinging || !os.alarmTask) return null

  return (
    <ScheduleAlarmScreen
      task={os.alarmTask}
      onReady={os.confirmAlarmReady}
      onSnooze={os.snoozeAlarm}
    />
  )
}
