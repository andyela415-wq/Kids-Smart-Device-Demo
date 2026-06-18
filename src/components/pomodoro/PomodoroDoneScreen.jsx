import { useId } from 'react'
import PomodoroConfetti from './PomodoroConfetti'
import PomodoroDoneTomatoIcon from './PomodoroDoneTomatoIcon'
import PomodoroRefBackground from './PomodoroRefBackground'

export default function PomodoroDoneScreen({ task, completedPomodoros, onHome }) {
  const titleId = useId()

  return (
    <div className="pomo-ref pomo-ref--done">
      <PomodoroRefBackground />

      <main className="pomo-ref__main pomo-ref__main--done" aria-labelledby={titleId}>
        <div className="pomo-ref__done-celebrate">
          <span className="pomo-ref__pill pomo-ref__pill--done">完成</span>
          <p className="pomo-ref__done-title" id={titleId}>
            做得好！
          </p>
          <p className="pomo-ref__done-meta">
            <span className="pomo-ref__done-meta-task">
              {task?.icon} {task?.title}
            </span>
            <span className="pomo-ref__done-meta-sep" aria-hidden="true">
              ·
            </span>
            <span className="pomo-ref__done-meta-pomo">
              完成 {completedPomodoros} 个
              <PomodoroDoneTomatoIcon />
              番茄
            </span>
          </p>
        </div>

        <button type="button" className="pomo-ref__done-home-btn" onClick={onHome}>
          返回首页
        </button>
      </main>

      <PomodoroConfetti />
    </div>
  )
}
