import { POMODORO_PHASE } from '../../config/pomodoroWork'
import PomodoroWorkRing from './PomodoroWorkRing'

const STATE_LABEL = {
  focus: '专注',
  break: '休息',
  done: '完成',
}

function PauseIcon({ dark = false }) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <rect x="6" y="5" width="4" height="14" rx="1.2" fill={dark ? '#0f2918' : '#fff'} />
      <rect x="14" y="5" width="4" height="14" rx="1.2" fill={dark ? '#0f2918' : '#fff'} />
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path d="M9 7.5v9l7.5-4.5L9 7.5Z" fill="#fff" />
    </svg>
  )
}

export default function PomodoroSession({
  uiState,
  phase,
  task,
  completedPomodoros,
  remaining,
  progress,
  isRunning,
  formatTime,
  onTogglePause,
  onSkipPhase,
  onComplete,
}) {
  const variant = uiState === 'focus' ? 'focus' : 'break'
  const pauseDark = variant === 'break'

  return (
    <main className={`pomo-work pomo-work--session pomo-work--${variant}`}>
      <div className="pomo-work__session-head">
        <span className="pomo-work__state-pill">{STATE_LABEL[uiState]}</span>
        <span className="pomo-work__count-pill">番茄 {completedPomodoros}</span>
      </div>

      <p className="pomo-work__task-line">
        <span className="pomo-work__task-icon" aria-hidden="true">
          {task?.icon}
        </span>
        {task?.title}
      </p>

      <div className="pomo-work__timer-stage">
        <div className="pomo-work__glass-dial">
          <PomodoroWorkRing progress={progress} variant={variant} running={isRunning} size="lg" />
          <div className="pomo-work__timer-core">
            <span className="pomo-work__timer" aria-live="polite">
              {formatTime(remaining)}
            </span>
            {phase === POMODORO_PHASE.LONG_BREAK && (
              <span className="pomo-work__timer-sub">长休息</span>
            )}
          </div>
        </div>
      </div>

      <div className="pomo-work__controls">
        <button
          type="button"
          className={`pomo-work__ctrl pomo-work__ctrl--primary pomo-work__ctrl--${variant}`}
          aria-label={isRunning ? '暂停' : '继续'}
          onClick={onTogglePause}
        >
          {isRunning ? <PauseIcon dark={pauseDark} /> : <PlayIcon />}
        </button>

        <button type="button" className="pomo-work__ctrl pomo-work__ctrl--next" onClick={onSkipPhase}>
          进入下一阶段 &gt;
        </button>

        <button
          type="button"
          className="pomo-work__ctrl pomo-work__ctrl--done"
          aria-label="完成"
          onClick={onComplete}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <path
              d="M7 12.5 10.2 15.7 17 8.8"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </main>
  )
}
