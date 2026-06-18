import { useEffect, useRef, useState } from 'react'
import { getDailyFocusSummary } from '../../utils/dailyFocusSummary'
import { getGrowthEventName } from '../../utils/learningGrowth'
import { getLocalDateKey } from '../../utils/localDate'

/** 今日专注总结 — 只读鼓励型展示，不可点击 */
export default function PomodoroDailyFocusSummary({ variant = 'pomo' }) {
  const [summary, setSummary] = useState(getDailyFocusSummary)
  const dateKeyRef = useRef(getLocalDateKey())

  useEffect(() => {
    const refresh = () => setSummary(getDailyFocusSummary())

    window.addEventListener(getGrowthEventName(), refresh)

    const midnightCheck = window.setInterval(() => {
      const today = getLocalDateKey()
      if (today !== dateKeyRef.current) {
        dateKeyRef.current = today
        refresh()
      }
    }, 30000)

    refresh()

    return () => {
      window.removeEventListener(getGrowthEventName(), refresh)
      clearInterval(midnightCheck)
    }
  }, [])

  if (variant === 'home') {
    return (
      <section
        className="home-face__card"
        aria-label={`今日专注总结：${summary.cheer}，完成 ${summary.focusPomodoroCount} 个番茄，累计 ${summary.focusMinutes} 分钟`}
      >
        <p className="home-face__card-row">
          <span className="home-face__card-text">{summary.cheer}</span>
          <span className="home-face__card-text home-face__card-text--stat">
            🍅 {summary.focusPomodoroCount}
          </span>
          <span className="home-face__card-text home-face__card-text--stat">
            ⏱ {summary.focusMinutes} 分钟
          </span>
        </p>
      </section>
    )
  }

  const rootClass = 'pomo-ref__daily'

  return (
    <section className={rootClass} aria-label="今日专注总结">
      <p className={`${rootClass}-cheer`}>{summary.cheer}</p>
      <p className={`${rootClass}-hint`}>{summary.hint}</p>
      <p
        className={`${rootClass}-data`}
        aria-label={`今日完成 ${summary.focusPomodoroCount} 个番茄，累计专注 ${summary.focusMinutes} 分钟`}
      >
        <span className={`${rootClass}-stat`}>🍅 {summary.focusPomodoroCount}</span>
        <span className={`${rootClass}-stat`}>⏱ {summary.focusMinutes} 分钟</span>
      </p>
    </section>
  )
}
