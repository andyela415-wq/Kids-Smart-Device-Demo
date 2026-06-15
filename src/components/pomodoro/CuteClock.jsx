export default function CuteClock({ running, secondsLeft, totalSeconds }) {
  const elapsed = totalSeconds - secondsLeft
  const secondAngle = running ? (elapsed % 60) * 6 : 0
  const minuteAngle = running ? ((elapsed / 60) % 60) * 6 : 0

  return (
    <div className={`pomo-clock${running ? ' pomo-clock--tick' : ''}`} aria-hidden="true">
      <div className="pomo-clock__face">
        <span
          className="pomo-clock__hand pomo-clock__hand--minute"
          style={{ transform: `rotate(${minuteAngle}deg)` }}
        />
        <span
          className="pomo-clock__hand pomo-clock__hand--second"
          style={{ transform: `rotate(${secondAngle}deg)` }}
        />
        <span className="pomo-clock__center" />
      </div>
      <div
        className="pomo-clock__orbit"
        style={{ transform: `rotate(${secondAngle}deg)` }}
      >
        <span className="pomo-clock__dot" />
      </div>
    </div>
  )
}
