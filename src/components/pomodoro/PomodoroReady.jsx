import PomodoroWorkRing from './PomodoroWorkRing'
import TomatoCharacter from './TomatoCharacter'

export default function PomodoroReady({ task, focusMinutes, onStart }) {
  return (
    <main className="pomo-work pomo-work--ready">
      <div className="pomo-work__ready-stage">
        <div className="pomo-work__ready-dial">
          <PomodoroWorkRing progress={0} variant="focus" running={false} size="lg" showDot={false} />
          <div className="pomo-work__ready-core">
            <TomatoCharacter size="md" active={false} mood="focus" />
            <p className="pomo-work__ready-duration">
              <span className="pomo-work__ready-num">{focusMinutes}</span>
              <span className="pomo-work__ready-unit">分钟</span>
            </p>
          </div>
        </div>
        <p className="pomo-work__ready-task">
          <span className="pomo-work__task-icon" aria-hidden="true">
            {task?.icon}
          </span>
          {task?.title}
        </p>
      </div>

      <button type="button" className="pomo-work__start-btn" onClick={onStart}>
        <span className="pomo-work__start-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="14" height="14">
            <circle cx="12" cy="12" r="10" fill="rgba(255,255,255,0.22)" />
            <path d="M10.5 8.2v7.6l5.8-3.8-5.8-3.8Z" fill="#fff" />
          </svg>
        </span>
        开始
      </button>
    </main>
  )
}
