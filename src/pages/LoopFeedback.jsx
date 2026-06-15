import { useNavigate } from 'react-router-dom'
import AiEncourageBar from '../components/AiEncourageBar'
import GrowthStrip from '../components/GrowthStrip'
import OsTopBar from '../components/os/OsTopBar'
import { useOS } from '../context/LearningOSContext'

export default function LoopFeedback() {
  const navigate = useNavigate()
  const os = useOS()

  return (
    <div className="os-page os-page--feedback">
      <OsTopBar title="学习反馈" onBack={() => navigate('/')} />

      <main className="os-feedback">
        <p className="os-feedback__emoji" aria-hidden="true">
          🎉
        </p>
        <p className="os-feedback__title">闭环完成！</p>
        <p className="os-feedback__msg">{os.feedback?.message || '学习反馈已同步到 AI 系统'}</p>

        <GrowthStrip />

        <div className="os-feedback__loop" aria-hidden="true">
          <span>AI</span>
          <span>→</span>
          <span>计划</span>
          <span>→</span>
          <span>专注</span>
          <span>→</span>
          <span>反馈</span>
        </div>

        <AiEncourageBar compact />

        <div className="os-feedback__actions">
          <button type="button" className="os-feedback__btn" onClick={() => navigate('/')}>
            返回首页
          </button>
          <button
            type="button"
            className="os-feedback__btn os-feedback__btn--primary"
            onClick={() => {
              os.resetAiFlow()
              navigate('/ai')
            }}
          >
            继续 AI 学习
          </button>
        </div>
      </main>
    </div>
  )
}
