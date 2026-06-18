function PauseGlyph({ running }) {
  if (running) {
    return (
      <svg viewBox="0 0 16 16" className="pomo-timer-btn__icon" aria-hidden="true">
        <rect x="4" y="3.5" width="2.8" height="9" rx="1" fill="currentColor" />
        <rect x="9.2" y="3.5" width="2.8" height="9" rx="1" fill="currentColor" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 16 16" className="pomo-timer-btn__icon" aria-hidden="true">
      <path d="M5.5 4.2v7.6l6.2-3.8-6.2-3.8Z" fill="currentColor" />
    </svg>
  )
}

function NextGlyph() {
  return (
    <svg viewBox="0 0 16 16" className="pomo-timer-btn__icon" aria-hidden="true">
      <path d="M4.5 3.5v9l5.5-4.5-5.5-4.5Z" fill="currentColor" />
      <rect x="11.5" y="3.5" width="2" height="9" rx="0.8" fill="currentColor" />
    </svg>
  )
}

function DoneGlyph() {
  return (
    <svg viewBox="0 0 16 16" className="pomo-timer-btn__icon" aria-hidden="true">
      <path
        d="M4 8.2 L6.8 11.2 L12.5 5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** 扁平圆润触控胶囊控制栏 */
export default function PomodoroTimerControls({
  variant = 'focus',
  isRunning,
  onTogglePause,
  onSkipPhase,
  onComplete,
  skipLabel = '下一阶段',
}) {
  return (
    <div className={`pomo-timer-controls pomo-timer-controls--${variant}`}>
      <button
        type="button"
        className="pomo-timer-btn pomo-timer-btn--pause"
        aria-label={isRunning ? '暂停' : '继续'}
        onClick={onTogglePause}
      >
        <PauseGlyph running={isRunning} />
        <span>{isRunning ? '暂停' : '继续'}</span>
      </button>
      <button type="button" className="pomo-timer-btn pomo-timer-btn--next" onClick={onSkipPhase}>
        <NextGlyph />
        <span>{skipLabel}</span>
      </button>
      <button
        type="button"
        className="pomo-timer-btn pomo-timer-btn--done"
        aria-label="完成"
        onClick={onComplete}
      >
        <DoneGlyph />
        <span>完成</span>
      </button>
    </div>
  )
}
