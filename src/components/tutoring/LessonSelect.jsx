import { useState } from 'react'
import { LESSONS } from '../../config/tutoringLessons'
import AutumnRainCover from './AutumnRainCover'

function StartButton({ label, onClick }) {
  const [pressed, setPressed] = useState(false)
  const release = () => setPressed(false)

  return (
    <button
      type="button"
      className={`tutor-hw-start${pressed ? ' tutor-hw-start--pressed' : ''}`}
      onMouseDown={() => setPressed(true)}
      onMouseUp={release}
      onMouseLeave={release}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={release}
      onTouchCancel={release}
      onClick={onClick}
    >
      <span className="tutor-hw-start__bezel">
        <span className="tutor-hw-start__label">{label}</span>
      </span>
    </button>
  )
}

function LessonCoverArt({ lessonId, className = '' }) {
  if (lessonId === 'g3-autumn-rain') {
    return <AutumnRainCover className={className} />
  }

  return null
}

export default function LessonSelect({ lessonId, onSelect, onStart }) {
  const selectedLesson = LESSONS.find((lesson) => lesson.id === lessonId) || LESSONS[0]

  return (
    <main className="tutor-select">
      <p className="tutor-select__step">选择课文 · 开启今日学习</p>

      <div className="tutor-select__list" role="listbox" aria-label="课文列表">
        {LESSONS.map((lesson) => {
          const selected = lesson.id === lessonId

          return (
            <button
              key={lesson.id}
              type="button"
              role="option"
              aria-selected={selected}
              className={`tutor-select__card${selected ? ' tutor-select__card--on' : ''}`}
              style={{ '--lesson-accent': lesson.accent }}
              onClick={() => onSelect(lesson.id)}
            >
              <span className="tutor-select__card-bezel">
                <span className="tutor-select__card-surface">
                  <span className="tutor-select__card-art">
                    <LessonCoverArt lessonId={lesson.id} className="tutor-select__cover" />
                    <span className="tutor-select__card-art-shade" aria-hidden="true" />
                  </span>
                  <span className="tutor-select__card-content">
                    <span className="tutor-select__grade">{lesson.grade}</span>
                    <span className="tutor-select__title">《{lesson.title}》</span>
                    {lesson.tagline && (
                      <span className="tutor-select__tagline">{lesson.tagline}</span>
                    )}
                    {selected && <span className="tutor-select__check">已选</span>}
                  </span>
                </span>
              </span>
            </button>
          )
        })}
      </div>

      <div className="tutor-select__footer">
        <StartButton label={selectedLesson.startLabel} onClick={onStart} />
      </div>
    </main>
  )
}
