import { useState } from 'react'
import { LESSONS } from '../../config/tutoringLessons'

const LESSON_COVER_BY_ID = {
  'g3-autumn-rain': "url('/lessons/autumn-rain-cover.svg')",
}

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

export default function LessonSelect({ lessonId, onSelect, onStart }) {
  const selectedLesson = LESSONS.find((lesson) => lesson.id === lessonId) || LESSONS[0]

  return (
    <main className="tutor-select">
      <p className="tutor-select__step">选择课文 · 开启今日学习</p>

      <div className="tutor-select__list" role="listbox" aria-label="课文列表">
        {LESSONS.map((lesson) => {
          const selected = lesson.id === lessonId
          const coverImage = LESSON_COVER_BY_ID[lesson.id]

          return (
            <button
              key={lesson.id}
              type="button"
              role="option"
              aria-selected={selected}
              aria-label={`选择《${lesson.title}》`}
              className={`lesson-card tutor-select__card${selected ? ' lesson-card--on' : ''}${coverImage ? ' lesson-card--illustrated' : ''}`}
              style={coverImage ? { '--lesson-cover': coverImage } : undefined}
              onClick={() => onSelect(lesson.id)}
            >
              <span className="lesson-card__text">
                <span className="lesson-card__grade">{lesson.grade}</span>
                <span className="lesson-card__title">《{lesson.title}》</span>
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
