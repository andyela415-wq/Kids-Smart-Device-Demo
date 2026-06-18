import PomodoroDurationSettings from './PomodoroDurationSettings'
import PomodoroPeachOrb from './PomodoroPeachOrb'
import PomodoroRefBackground from './PomodoroRefBackground'
import PomodoroRefRing from './PomodoroRefRing'
import PomodoroTopBar from './PomodoroTopBar'

function readyRingProgress(minutes) {
  return Math.min(0.45, minutes / 90)
}

/** 参考图 1：选任务后 → 准备开始页 */
export default function PomodoroReadyScreen({
  task,
  focusMinutes,
  onStart,
  onBack,
  onFocusMinutesChange,
  settingsOpen,
  onOpenSettings,
  onCloseSettings,
}) {
  const handleBack = settingsOpen ? onCloseSettings : onBack

  return (
    <div className={`pomo-ref pomo-ref--ready${settingsOpen ? ' pomo-ref--ready-settings' : ''}`}>
      <PomodoroRefBackground />
      <PomodoroTopBar
        title="番茄闹钟"
        onBack={handleBack}
        onSettings={onOpenSettings}
        settingsActive={settingsOpen}
      />

      {settingsOpen ? (
        <main className="pomo-ref__main pomo-ref__main--settings">
          <PomodoroDurationSettings
            value={focusMinutes}
            onChange={onFocusMinutesChange}
            onDone={onCloseSettings}
          />
        </main>
      ) : (
        <main className="pomo-ref__main">
          <div className="pomo-ref__ready-top">
            <div className="pomo-ref__ready-dial">
              <PomodoroRefRing
                progress={readyRingProgress(focusMinutes)}
                variant="focus"
                showDot={false}
              />
              <PomodoroPeachOrb minutes={focusMinutes} />
            </div>

            {task && (
              <div className="pomo-ref__ready-task" aria-label="当前任务">
                <span className="pomo-ref__ready-task-icon" aria-hidden="true">
                  {task.icon}
                </span>
                <span className="pomo-ref__ready-task-name">{task.title}</span>
              </div>
            )}
          </div>

          <div className="pomo-ref__ready-bottom">
            <button type="button" className="pomo-ref__start-btn" onClick={onStart}>
              <span className="pomo-ref__start-play" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="18" height="18">
                  <circle cx="12" cy="12" r="10" fill="rgba(255,255,255,0.28)" />
                  <path d="M10.2 7.8v8.4l6.6-4.2-6.6-4.2Z" fill="#fff" />
                </svg>
              </span>
              开始
            </button>
          </div>
        </main>
      )}
    </div>
  )
}
