/** 表盘下方星星 / 小花装饰，随进度逐颗亮起 */
const STAR_SLOTS = 5

export default function PomodoroTimerDecor({ progress = 0, variant = 'focus' }) {
  const litCount = Math.min(STAR_SLOTS, Math.ceil(progress * STAR_SLOTS))

  return (
    <div className={`pomo-timer-decor pomo-timer-decor--${variant}`} aria-hidden="true">
      {Array.from({ length: STAR_SLOTS }, (_, i) => {
        const lit = i < litCount
        const isFlower = i === 2
        return (
          <span
            key={i}
            className={`pomo-timer-decor__item${lit ? ' pomo-timer-decor__item--lit' : ''}`}
          >
            {isFlower ? (
              <svg viewBox="0 0 16 16" className="pomo-timer-decor__svg">
                <circle cx="8" cy="8" r="2.2" fill="currentColor" />
                <ellipse cx="8" cy="4.5" rx="2" ry="2.8" fill="currentColor" opacity="0.85" />
                <ellipse cx="11.5" cy="8" rx="2.8" ry="2" fill="currentColor" opacity="0.85" />
                <ellipse cx="8" cy="11.5" rx="2" ry="2.8" fill="currentColor" opacity="0.85" />
                <ellipse cx="4.5" cy="8" rx="2.8" ry="2" fill="currentColor" opacity="0.85" />
              </svg>
            ) : (
              <svg viewBox="0 0 16 16" className="pomo-timer-decor__svg">
                <path
                  d="M8 2.2 L9.1 6.1 L13 6.1 L9.9 8.5 L11 12.4 L8 10 L5 12.4 L6.1 8.5 L3 6.1 L6.9 6.1 Z"
                  fill="currentColor"
                />
              </svg>
            )}
          </span>
        )
      })}
    </div>
  )
}
