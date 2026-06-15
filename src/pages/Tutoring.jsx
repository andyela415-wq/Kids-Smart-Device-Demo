import { useNavigate } from 'react-router-dom'
import DeviceGrowthHeader from '../components/DeviceGrowthHeader'
import TopBar from '../components/TopBar'
import LessonSelect from '../components/tutoring/LessonSelect'
import AiAnalysis from '../components/tutoring/AiAnalysis'
import LearningReport from '../components/tutoring/LearningReport'
import ChatLearning from '../components/tutoring/ChatLearning'
import { useTutoringSession } from '../hooks/useTutoringSession'

export default function Tutoring() {
  const navigate = useNavigate()
  const session = useTutoringSession()

  const handleBack = () => {
    if (session.page === 'select') {
      navigate('/')
      return
    }
    if (session.page === 'chat') {
      session.goToReport()
      return
    }
    session.exitToSelect()
  }

  return (
    <div className="tutoring-page">
      <TopBar title="AI课文辅导" onBack={handleBack} />
      {(session.page === 'select' || session.page === 'report') && <DeviceGrowthHeader />}

      {session.page === 'select' && (
        <LessonSelect
          lessonId={session.lessonId}
          onSelect={session.selectLesson}
          onStart={session.startTutoring}
        />
      )}

      {session.page === 'analyzing' && (
        <AiAnalysis lesson={session.lesson} onComplete={session.finishAnalysis} />
      )}

      {session.page === 'report' && (
        <LearningReport lesson={session.lesson} onStartChat={session.startChat} />
      )}

      {session.page === 'chat' && <ChatLearning />}
    </div>
  )
}
