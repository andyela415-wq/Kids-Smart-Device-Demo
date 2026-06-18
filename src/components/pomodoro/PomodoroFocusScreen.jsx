import PomodoroRefBackground from './PomodoroRefBackground'
import PomodoroTimerControls from './PomodoroTimerControls'
import PomodoroTimerDial from './PomodoroTimerDial'

/** 专注计时页 — 互动成长型表盘 */
export default function PomodoroFocusScreen({
  completedPomodoros,
  remaining,
  progress,
  isRunning,
  formatTime,
  onTogglePause,
  onSkipPhase,
  onComplete,
}) {
  return (
    <div className="pomo-ref pomo-ref--focus">
      <PomodoroRefBackground />

      <header className="pomo-ref__focus-head">
        <span className="pomo-ref__pill pomo-ref__pill--focus">专注</span>
        <span className="pomo-ref__pill pomo-ref__pill--count">🍅 {completedPomodoros}</span>
      </header>

      <main className="pomo-ref__main">
        <PomodoroTimerDial
          progress={progress}
          variant="focus"
          timeLabel={formatTime(remaining)}
          isRunning={isRunning}
        />

        <PomodoroTimerControls
          variant="focus"
          isRunning={isRunning}
          onTogglePause={onTogglePause}
          onSkipPhase={onSkipPhase}
          onComplete={onComplete}
          skipLabel="下一阶段"
        />
      </main>
    </div>
  )
}
