import { useNavigate } from 'react-router-dom'
import DeviceGrowthHeader from '../components/DeviceGrowthHeader'
import AiAnalysis from '../components/tutoring/AiAnalysis'
import ChatLearning from '../components/tutoring/ChatLearning'
import LearningReport from '../components/tutoring/LearningReport'
import LessonSelect from '../components/tutoring/LessonSelect'
import AiTaskProposal from '../components/os/AiTaskProposal'
import OsTopBar from '../components/os/OsTopBar'
import { useOS } from '../context/LearningOSContext'
import { writeHomeModeId } from '../utils/homeMode'

export default function AiLearning() {
  const navigate = useNavigate()
  const os = useOS()

  const handleBack = () => {
    if (os.aiPage === 'select') {
      writeHomeModeId('ai')
      navigate('/')
      return
    }
    if (os.aiPage === 'analyze') {
      os.setAiPage('select')
      return
    }
    if (os.aiPage === 'report') {
      os.setAiPage('select')
      return
    }
    if (os.aiPage === 'chat') {
      os.goToReport()
      return
    }
    if (os.aiPage === 'proposal') {
      os.goToReport()
    }
  }

  const showGrowth = os.aiPage === 'select'

  return (
    <div className="os-page os-page--ai">
      <OsTopBar title="AI学习" onBack={handleBack} />
      {showGrowth && <DeviceGrowthHeader variant="asset" />}

      {os.aiPage === 'select' && (
        <LessonSelect
          lessonId={os.lessonId}
          onSelect={os.selectLesson}
          onStart={os.startAnalysis}
        />
      )}

      {os.aiPage === 'analyze' && (
        <AiAnalysis lesson={os.lesson} onComplete={os.finishAnalysis} />
      )}

      {os.aiPage === 'report' && (
        <LearningReport
          lesson={os.lesson}
          onStartChat={os.startChat}
          onGeneratePlan={os.goToProposal}
        />
      )}

      {os.aiPage === 'chat' && <ChatLearning />}

      {os.aiPage === 'proposal' && (
        <AiTaskProposal
          lesson={os.lesson}
          proposal={os.proposal}
          onGenerate={os.generatePlan}
        />
      )}
    </div>
  )
}
