const RADIUS = 38
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export default function ProgressRing({ progress, running = false, showDot = false }) {
  const clamped = Math.min(1, Math.max(0, progress))
  const offset = CIRCUMFERENCE * (1 - clamped)
  const angle = clamped * 2 * Math.PI - Math.PI / 2
  const dotX = 50 + RADIUS * Math.cos(angle)
  const dotY = 50 + RADIUS * Math.sin(angle)

  return (
    <svg
      className={`pomo-ring${running ? ' pomo-ring--running' : ''}`}
      viewBox="0 0 100 100"
      aria-hidden="true"
    >
      <circle className="pomo-ring__track" cx="50" cy="50" r={RADIUS} fill="none" />
      <circle
        className="pomo-ring__fill"
        cx="50"
        cy="50"
        r={RADIUS}
        fill="none"
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={offset}
      />
      {showDot && clamped > 0.02 && (
        <circle
          className={`pomo-ring__dot${running ? ' pomo-ring__dot--live' : ''}`}
          cx={dotX}
          cy={dotY}
          r="3.2"
        />
      )}
    </svg>
  )
}
