export default function PomodoroWorkRing({
  progress,
  variant = 'focus',
  running = false,
  size = 'md',
  showDot = true,
}) {
  const RADIUS = size === 'lg' ? 44 : 42
  const clamped = Math.min(1, Math.max(0, progress))
  const circumference = 2 * Math.PI * RADIUS
  const offset = circumference * (1 - clamped)
  const angle = clamped * 2 * Math.PI - Math.PI / 2
  const dotX = 50 + RADIUS * Math.cos(angle)
  const dotY = 50 + RADIUS * Math.sin(angle)

  return (
    <svg
      className={`pomo-work__ring pomo-work__ring--${variant}${running ? ' pomo-work__ring--live' : ''}${size === 'lg' ? ' pomo-work__ring--lg' : ''}`}
      viewBox="0 0 100 100"
      aria-hidden="true"
    >
      {Array.from({ length: 60 }, (_, i) => {
        const tickAngle = (i / 60) * 2 * Math.PI - Math.PI / 2
        const major = i % 5 === 0
        const inner = RADIUS - (major ? 4 : 2.5)
        const outer = RADIUS + (major ? 1.5 : 0.8)
        const x1 = 50 + inner * Math.cos(tickAngle)
        const y1 = 50 + inner * Math.sin(tickAngle)
        const x2 = 50 + outer * Math.cos(tickAngle)
        const y2 = 50 + outer * Math.sin(tickAngle)
        return (
          <line
            key={i}
            className={major ? 'pomo-work__tick pomo-work__tick--major' : 'pomo-work__tick'}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
          />
        )
      })}
      <circle className="pomo-work__track" cx="50" cy="50" r={RADIUS} fill="none" />
      <circle
        className="pomo-work__fill"
        cx="50"
        cy="50"
        r={RADIUS}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
      />
      {showDot && clamped > 0.01 && (
        <circle className="pomo-work__dot" cx={dotX} cy={dotY} r="2.6" />
      )}
    </svg>
  )
}
