import { useEffect, useState } from 'react'

const ANALYSIS_TASKS = ['生字词', '句型结构', '语义理解']
const TASK_DELAYS = [300, 700, 1100]
const ANALYSIS_DURATION = 2000

export default function AiAnalysis({ lesson, onComplete }) {
  const [visibleTasks, setVisibleTasks] = useState(0)

  useEffect(() => {
    const taskTimers = TASK_DELAYS.map((delay, index) =>
      window.setTimeout(() => setVisibleTasks(index + 1), delay),
    )

    const completeTimer = window.setTimeout(() => {
      onComplete?.()
    }, ANALYSIS_DURATION)

    return () => {
      taskTimers.forEach(clearTimeout)
      clearTimeout(completeTimer)
    }
  }, [onComplete])

  return (
    <main className="tutor-analyze" aria-live="polite">
      <div className="tutor-analyze__reader">
        <div className="tutor-analyze__reader-head">
          <span className="tutor-analyze__reader-icon" aria-hidden="true">
            {lesson.icon}
          </span>
          <span className="tutor-analyze__reader-title">《{lesson.title}》</span>
        </div>
        <div className="tutor-analyze__text">
          {lesson.excerpt?.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
        <span className="tutor-analyze__scanline" aria-hidden="true" />
      </div>

      <div className="tutor-analyze__panel">
        <p className="tutor-analyze__heading">AI正在分析：</p>
        <ul className="tutor-analyze__tasks">
          {ANALYSIS_TASKS.map((task, index) => {
            const done = visibleTasks > index

            return (
              <li
                key={task}
                className={`tutor-analyze__task${done ? ' tutor-analyze__task--done' : ''}`}
              >
                <span className="tutor-analyze__check" aria-hidden="true">
                  {done ? '✓' : '·'}
                </span>
                <span>{task}</span>
              </li>
            )
          })}
        </ul>
      </div>
    </main>
  )
}
