import { useState } from 'react'
import AiTeacherAvatar from './AiTeacherAvatar'
import { speakTutorText } from '../../utils/voiceReminder'

function WordTag({ word, tone, onSpeak, speakText }) {
  return (
    <button
      type="button"
      className={`tutor-report__word-tag tutor-report__word-tag--${tone}`}
      aria-label={`听一听：${word}`}
      onClick={() => onSpeak(speakText || word)}
    >
      <span className="tutor-report__word-tag-text">{word}</span>
      <span className="tutor-report__word-tag-speaker" aria-hidden="true">
        🔊
      </span>
    </button>
  )
}

function PatternCard({ pattern, onSpeak }) {
  const [open, setOpen] = useState(false)

  const handleToggle = () => {
    setOpen((value) => !value)
    onSpeak(pattern.speak)
  }

  return (
    <div className={`tutor-report__pattern${open ? ' tutor-report__pattern--open' : ''}`}>
      <button
        type="button"
        className={`tutor-report__pattern-head tutor-report__pattern-head--${pattern.tone}`}
        aria-expanded={open}
        onClick={handleToggle}
      >
        <span>{pattern.title}</span>
        <span className="tutor-report__pattern-speaker" aria-hidden="true">
          🔊
        </span>
      </button>
      {open && (
        <ul className="tutor-report__pattern-examples">
          {pattern.examples.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

function ChatStartButton({ onClick }) {
  const [pressed, setPressed] = useState(false)
  const release = () => setPressed(false)

  return (
    <button
      type="button"
      className={`tutor-hw-start tutor-hw-start--report-primary${pressed ? ' tutor-hw-start--pressed' : ''}`}
      onMouseDown={() => setPressed(true)}
      onMouseUp={release}
      onMouseLeave={release}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={release}
      onTouchCancel={release}
      onClick={onClick}
    >
      <span className="tutor-hw-start__bezel">
        <span className="tutor-hw-start__label tutor-hw-start__label--with-icon">
          <AiTeacherAvatar size="xs" active />
          <span>找 AI 小老师聊聊</span>
        </span>
      </span>
    </button>
  )
}

function PlanStartButton({ onClick }) {
  const [pressed, setPressed] = useState(false)
  const release = () => setPressed(false)

  return (
    <button
      type="button"
      className={`tutor-hw-start tutor-hw-start--report-secondary${pressed ? ' tutor-hw-start--pressed' : ''}`}
      onMouseDown={() => setPressed(true)}
      onMouseUp={release}
      onMouseLeave={release}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={release}
      onTouchCancel={release}
      onClick={onClick}
    >
      <span className="tutor-hw-start__bezel">
        <span className="tutor-hw-start__label">生成计划</span>
      </span>
    </button>
  )
}

export default function LearningReport({ lesson, onStartChat, onGeneratePlan, onBack }) {
  const { report } = lesson
  const [quizPick, setQuizPick] = useState(null)
  const [quizFeedback, setQuizFeedback] = useState('')

  const speakLine = (text) => {
    speakTutorText(text)
  }

  const handleQuizPick = (option) => {
    setQuizPick(option.id)
    setQuizFeedback(option.correct ? report.quiz.correctFeedback : report.quiz.wrongFeedback)
    speakTutorText(option.correct ? '答对啦，真棒！' : '没关系，再读读课文试试～')
  }

  const goldenLine = `${report.goldenSentence.text}${report.goldenSentence.emoji || ''}`

  return (
    <main className="tutor-report">
      <header className="tutor-report__head">
        {onBack ? (
          <button type="button" className="tutor-report__back" aria-label="返回" onClick={onBack}>
            ‹
          </button>
        ) : (
          <span className="tutor-report__head-spacer" aria-hidden="true" />
        )}
        <p className="tutor-report__step">今日收获 ✨</p>
        <span className="tutor-report__head-spacer" aria-hidden="true" />
      </header>

      <div className="tutor-report__scroll">
        <p className="tutor-report__subtitle summary-text">{report.tip}</p>

        <section className="tutor-report__block">
          <h2 className="tutor-report__label">重点词语 · 加深理解</h2>
          {report.vocabularyGroups.map((group) => (
            <div key={group.title} className="tutor-report__vocab-group">
              <p className="tutor-report__group-label">{group.title}</p>
              <div className="tutor-report__word-tags">
                {group.items.map((item) => (
                  <WordTag
                    key={item.word}
                    word={item.word}
                    tone={item.tone}
                    speakText={item.speak}
                    onSpeak={speakLine}
                  />
                ))}
              </div>
            </div>
          ))}
        </section>

        <section className="tutor-report__block">
          <h2 className="tutor-report__label">发现了这些写法</h2>
          <div className="tutor-report__patterns">
            {report.patternCategories.map((pattern) => (
              <PatternCard key={pattern.id} pattern={pattern} onSpeak={speakLine} />
            ))}
          </div>
        </section>

        <section className="tutor-report__block tutor-report__block--golden">
          <h2 className="tutor-report__label">金句小达人</h2>
          <div className="tutor-report__golden">
            <p className="tutor-report__golden-text">
              {report.goldenSentence.text}
              {report.goldenSentence.emoji}
            </p>
            <button
              type="button"
              className="tutor-report__mic"
              aria-label="读一读金句"
              onClick={() => speakLine(goldenLine)}
            >
              <span className="tutor-report__mic-icon" aria-hidden="true">
                🎙️
              </span>
              <span className="tutor-report__mic-label">读一读</span>
            </button>
          </div>
        </section>

        <section className="tutor-report__block tutor-report__block--quiz">
          <h2 className="tutor-report__label">随堂小挑战 🏆</h2>
          <p className="tutor-report__quiz-q">{report.quiz.question}</p>
          <div className="tutor-report__quiz-options">
            {report.quiz.options.map((option) => {
              const picked = quizPick === option.id
              let stateClass = ''
              if (quizPick !== null && picked) {
                stateClass = option.correct
                  ? ' tutor-report__quiz-opt--correct'
                  : ' tutor-report__quiz-opt--wrong'
              }

              return (
                <button
                  key={option.id}
                  type="button"
                  className={`tutor-report__quiz-opt${stateClass}`}
                  disabled={quizPick !== null && !picked}
                  onClick={() => handleQuizPick(option)}
                >
                  <span className="tutor-report__quiz-opt-label">
                    {option.label} {option.emoji}
                  </span>
                </button>
              )
            })}
          </div>
          {quizFeedback && <p className="tutor-report__quiz-feedback">{quizFeedback}</p>}
        </section>

        <div className="tutor-report__footer bottom-actions">
          <ChatStartButton onClick={onStartChat} />
          {onGeneratePlan && <PlanStartButton onClick={onGeneratePlan} />}
        </div>
      </div>
    </main>
  )
}
