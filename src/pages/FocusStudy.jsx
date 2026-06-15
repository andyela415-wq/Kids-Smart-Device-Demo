import { useNavigate } from 'react-router-dom'
import FocusExecution from '../components/os/FocusExecution'
import OsTopBar from '../components/os/OsTopBar'
import { useOS } from '../context/LearningOSContext'

export default function FocusStudy() {
  const navigate = useNavigate()
  const os = useOS()

  const handleBack = () => {
    os.exitFocus()
    navigate('/')
  }

  return (
    <div className="os-page os-page--focus">
      <OsTopBar title="番茄闹钟" onBack={handleBack} />

      <FocusExecution
        task={os.currentTask}
        isRunning={os.isRunning}
        remaining={os.remaining}
        progress={os.progress}
        waterRemaining={os.waterRemaining}
        formatClock={os.formatClock}
        onPause={os.pauseFocus}
        onResume={os.resumeFocus}
      />
    </div>
  )
}
