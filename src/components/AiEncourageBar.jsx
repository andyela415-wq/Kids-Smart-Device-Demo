import { useLearningGrowth } from '../hooks/useLearningGrowth'
import AiTeacherAvatar from './tutoring/AiTeacherAvatar'

export default function AiEncourageBar({ compact = false }) {
  const { encourage } = useLearningGrowth()

  return (
    <div className={`ai-encourage${compact ? ' ai-encourage--compact' : ''}`}>
      <div className="ai-encourage__avatar" aria-hidden="true">
        {compact ? (
          <span className="ai-encourage__emoji">🤖</span>
        ) : (
          <AiTeacherAvatar active />
        )}
      </div>
      <p className="ai-encourage__text">{encourage}</p>
    </div>
  )
}
