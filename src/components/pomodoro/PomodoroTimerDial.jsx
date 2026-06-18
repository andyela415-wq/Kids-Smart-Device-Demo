import PomodoroBuddyIcon from './PomodoroBuddyIcon'
import PomodoroRefRing from './PomodoroRefRing'
import PomodoroTimerDecor from './PomodoroTimerDecor'

/** 互动成长型表盘 — 小助手 + 圆环进度 + 倒计时 + 装饰 */
export default function PomodoroTimerDial({
  progress = 0,
  variant = 'focus',
  timeLabel,
  isRunning = true,
}) {
  return (
    <div className={`pomo-timer-dial pomo-timer-dial--${variant}`}>
      <div className="pomo-timer-dial__upper">
        <PomodoroBuddyIcon active={isRunning} variant={variant} />
        <div className="pomo-timer-dial__stage">
          <PomodoroRefRing progress={progress} variant={variant} showDot />
          <div className="pomo-timer-dial__core">
            <span className="pomo-timer-dial__time" aria-live="polite">
              {timeLabel}
            </span>
          </div>
        </div>
      </div>
      <PomodoroTimerDecor progress={progress} variant={variant} />
    </div>
  )
}
