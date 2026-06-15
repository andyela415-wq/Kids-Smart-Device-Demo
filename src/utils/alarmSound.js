let alarmTimer = null
let audioCtx = null

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  }
  return audioCtx
}

function playBeep() {
  try {
    const ctx = getAudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.value = 880
    osc.type = 'sine'
    gain.gain.setValueAtTime(0.0001, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.36)
  } catch {
    /* ignore audio errors in demo */
  }
}

export function startAlarmSound(onSpeak) {
  stopAlarmSound()
  onSpeak?.()
  playBeep()
  alarmTimer = window.setInterval(() => {
    onSpeak?.()
    playBeep()
  }, 4000)
}

export function stopAlarmSound() {
  if (alarmTimer) {
    clearInterval(alarmTimer)
    alarmTimer = null
  }
}

export function resumeAudioContext() {
  try {
    const ctx = getAudioContext()
    if (ctx.state === 'suspended') ctx.resume()
  } catch {
    /* ignore */
  }
}
