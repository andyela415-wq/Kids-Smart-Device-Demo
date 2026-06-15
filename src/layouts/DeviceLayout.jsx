import { Outlet } from 'react-router-dom'
import ScheduleAlarmOverlay from '../components/os/ScheduleAlarmOverlay'
import { LearningOSProvider } from '../context/LearningOSContext'
import { useHardwareHomeBridge } from '../hooks/useHardwareHomeBridge'

function DeviceLayoutInner() {
  useHardwareHomeBridge()

  return (
    <div className="screen-content">
      <Outlet />
      <ScheduleAlarmOverlay />
    </div>
  )
}

export default function DeviceLayout() {
  return (
    <LearningOSProvider>
      <DeviceLayoutInner />
    </LearningOSProvider>
  )
}
