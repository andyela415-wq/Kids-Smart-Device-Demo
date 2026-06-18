export default function PomodoroRefRing({
  progress = 0,
  variant = 'focus',
  showDot = true,
  className = '',
}) {
  const RADIUS = 44
  const clamped = Math.min(1, Math.max(0, progress))
  const circumference = 2 * Math.PI * RADIUS
  const offset = circumference * (1 - clamped)
  const angle = clamped * 2 * Math.PI - Math.PI / 2
  const dotX = 50 + RADIUS * Math.cos(angle)
  const dotY = 50 + RADIUS * Math.sin(angle)

  return (
    <svg
      className={`pomo-ref__ring pomo-ref__ring--${variant} ${className}`.trim()}
      viewBox="0 0 100 100"
      aria-hidden="true"
    >
      <circle className="pomo-ref__ring-track" cx="50" cy="50" r={RADIUS} fill="none" />
      {clamped > 0.001 && (
        <>
          <circle
            className="pomo-ref__ring-arc"
            cx="50"
            cy="50"
            r={RADIUS}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
          {showDot && clamped > 0.015 && clamped < 0.985 && (
            <circle className="pomo-ref__ring-dot" cx={dotX} cy={dotY} r="3" />
          )}
        </>
      )}
    </svg>
  )
}
