export function formatTime(seconds) {
  const safe = Math.max(0, seconds)
  const m = Math.floor(safe / 60)
  const s = safe % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function minutesToSeconds(minutes) {
  return Math.max(1, minutes) * 60
}

/** 表盘倒计时 = min(每轮计时, 总共用时)，避免两者不一致 */
export function resolveRoundSeconds(intervalMinutes, durationMinutes, sessionRemainingSec) {
  const intervalSec = minutesToSeconds(intervalMinutes)
  const durationSec = minutesToSeconds(durationMinutes)
  let roundSec = Math.min(intervalSec, durationSec)
  if (sessionRemainingSec != null && sessionRemainingSec > 0) {
    roundSec = Math.min(roundSec, sessionRemainingSec)
  }
  return roundSec
}
