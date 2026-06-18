import PomodoroRefBackground from './PomodoroRefBackground'
import PomodoroTimerControls from './PomodoroTimerControls'
import PomodoroTimerDial from './PomodoroTimerDial'

/** 休息计时页 — 与专注页统一的互动表盘 */
export default function PomodoroBreakScreen({
  completedPomodoros,
  remaining,
  progress,
  isRunning,
  formatTime,
  onBack,
  onTogglePause,
  onSkipPhase,
  onComplete,
}) {
  return (
    <div className="pomo-ref pomo-ref--break">
      <PomodoroRefBackground />

      <header className="pomo-ref__break-head">
        <button type="button" className="pomo-ref__back-chip" aria-label="返回" onClick={onBack}>
          <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
            <path
              d="M14.5 6.5 9 12l5.5 5.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <span className="pomo-ref__pill pomo-ref__pill--break">休息</span>
        <span className="pomo-ref__pill pomo-ref__pill--count">🍅 {completedPomodoros}</span>
      </header>

      <main className="pomo-ref__main">
        <PomodoroTimerDial
          progress={progress}
          variant="break"
          timeLabel={formatTime(remaining)}
          isRunning={isRunning}
        />

        <PomodoroTimerControls
          variant="break"
          isRunning={isRunning}
          onTogglePause={onTogglePause}
          onSkipPhase={onSkipPhase}
          onComplete={onComplete}
          skipLabel="跳过"
        />
      </main>
    </div>
  )
}
