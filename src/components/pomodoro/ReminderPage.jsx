import { useEffect, useRef } from 'react'
import { useLearningGrowth } from '../../hooks/useLearningGrowth'
import TomatoCharacter from './TomatoCharacter'

export default function ReminderPage({
  message,
  subMessage,
  restMinutes,
  onContinue,
  onRest,
  autoLoop = true,
}) {
  const handledRef = useRef(false)
  const { encourage } = useLearningGrowth()

  const handleContinue = () => {
    handledRef.current = true
    onContinue()
  }

  const handleRest = () => {
    handledRef.current = true
    onRest()
  }

  useEffect(() => {
    if (!autoLoop) return undefined

    const timer = setTimeout(() => {
      if (handledRef.current) return
      if (restMinutes > 0) onRest()
      else onContinue()
    }, 3500)

    return () => clearTimeout(timer)
  }, [autoLoop, onContinue, onRest, restMinutes])

  return (
    <main className="pomo-reminder">
      <div className="pomo-reminder__particles" aria-hidden="true">
        <span>✨</span>
        <span>⭐</span>
        <span>✨</span>
      </div>

      <TomatoCharacter active size="lg" mood="cheer" />

      <h2 className="pomo-reminder__title">🎉 太棒啦！</h2>
      <p className="pomo-reminder__main">{message}</p>
      <p className="pomo-reminder__sub">{subMessage}</p>
      <p className="pomo-reminder__growth">{encourage}</p>

      <div className="pomo-reminder__tips">
        <span>喝口水</span>
        <span>看看窗外</span>
      </div>

      <div className="pomo-reminder__actions">
        <button type="button" className="pomo-hw-btn pomo-hw-btn--primary" onClick={handleContinue}>
          继续学习
        </button>
        {restMinutes > 0 && (
          <button type="button" className="pomo-hw-btn" onClick={handleRest}>
            休息一下
          </button>
        )}
      </div>

      {autoLoop && restMinutes > 0 && (
        <p className="pomo-reminder__auto">即将自动进入休息…</p>
      )}
    </main>
  )
}
