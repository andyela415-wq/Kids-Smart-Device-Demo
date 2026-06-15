import { useState } from 'react'

export default function AiTaskProposal({ lesson, proposal, onGenerate }) {
  const [pressed, setPressed] = useState(false)
  const release = () => setPressed(false)

  if (!proposal) return null

  return (
    <main className="os-proposal">
      <p className="os-proposal__step">AI 学习任务</p>

      <div className="os-proposal__card">
        <div className="os-proposal__head">
          <span className="os-proposal__icon" aria-hidden="true">
            {lesson.icon}
          </span>
          <span className="os-proposal__title">《{lesson.title}》</span>
        </div>

        <ul className="os-proposal__checks">
          {proposal.checks.map((item) => (
            <li key={item}>
              <span className="os-proposal__check" aria-hidden="true">
                ✓
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="os-proposal__suggest">
        <p className="os-proposal__label">📌 学习建议</p>
        <div className="os-proposal__tags">
          <span className="os-proposal__tag">{proposal.content}</span>
          <span className="os-proposal__tag">{proposal.durationMinutes} 分钟</span>
          {proposal.needReview && <span className="os-proposal__tag">需复习</span>}
          {proposal.enableWater && <span className="os-proposal__tag">💧 喝水</span>}
        </div>
      </div>

      <button
        type="button"
        className={`os-proposal__btn${pressed ? ' os-proposal__btn--pressed' : ''}`}
        onMouseDown={() => setPressed(true)}
        onMouseUp={release}
        onMouseLeave={release}
        onTouchStart={() => setPressed(true)}
        onTouchEnd={release}
        onTouchCancel={release}
        onClick={onGenerate}
      >
        <span className="os-proposal__btn-bezel">生成学习计划</span>
      </button>
    </main>
  )
}
