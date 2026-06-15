import { useState } from 'react'
import { TASK_STATE_LABELS } from '../../config/learningTasks'

function PauseButton({ paused, onClick }) {
  const [pressed, setPressed] = useState(false)
  const release = () => setPressed(false)

  return (
    <button
      type="button"
      className={`os-focus__pause${pressed ? ' os-focus__pause--pressed' : ''}`}
      aria-label={paused ? '继续' : '暂停'}
      onMouseDown={() => setPressed(true)}
      onMouseUp={release}
      onMouseLeave={release}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={release}
      onTouchCancel={release}
      onClick={onClick}
    >
      <span className="os-focus__pause-bezel">{paused ? '▶' : '⏸'}</span>
    </button>
  )
}

export default function FocusExecution({
  task,
  isRunning,
  remaining,
  progress,
  waterRemaining,
  formatClock,
  onPause,
  onResume,
}) {
  if (!task) {
    return (
      <main className="os-focus os-focus--empty">
        <p className="os-focus__empty-icon" aria-hidden="true">
          📅
        </p>
        <p className="os-focus__empty-text">暂无学习任务</p>
        <p className="os-focus__empty-hint">从 AI 学习生成计划</p>
      </main>
    )
  }

  const isRest = task.type === 'rest'
  const stateLabel = !isRunning ? '暂停' : TASK_STATE_LABELS[task.type] || '学习中'

  return (
    <main className="os-focus">
      <header className="os-focus__head">
        <span className="os-focus__state">
          <span className="os-focus__state-dot" aria-hidden="true" />
          {stateLabel}
        </span>
        {!isRest && task.enableWater && waterRemaining > 0 && (
          <span className="os-focus__water">
            <span aria-hidden="true">💧</span>
            {formatClock(waterRemaining)}
          </span>
        )}
      </header>

      <div className="os-focus__stage">
        <div className={`os-focus__dial${isRunning ? ' os-focus__dial--live' : ''}`}>
          <svg className="os-focus__ring" viewBox="0 0 100 100" aria-hidden="true">
            <circle className="os-focus__ring-track" cx="50" cy="50" r="38" fill="none" />
            <circle
              className="os-focus__ring-fill"
              cx="50"
              cy="50"
              r="38"
              fill="none"
              strokeDasharray={238.76}
              strokeDashoffset={238.76 * (1 - progress)}
            />
          </svg>
          <div className="os-focus__core">
            <span className="os-focus__tomato" aria-hidden="true">
              🍅
            </span>
            <span className="os-focus__time">{formatClock(remaining)}</span>
          </div>
        </div>
      </div>

      <footer className="os-focus__foot">
        <span className="os-focus__stars" aria-hidden="true">
          ★★★☆☆
        </span>
        <PauseButton paused={!isRunning} onClick={isRunning ? onPause : onResume} />
      </footer>
    </main>
  )
}
