const PREFERRED_VOICE_PATTERNS = [
  /yaoyao|瑶瑶/i,
  /xiaoxiao|晓晓/i,
  /xiaoyi|晓伊/i,
  /meijia|美嘉/i,
  /huihui|慧慧/i,
  /lili|丽丽/i,
  /yushu|语舒|Yu-shu/i,
  /sin-?ji|欣洁/i,
  /yun.*(female|女)/i,
  /female.*zh/i,
  /zh.*female/i,
]

/** AI 小老师：优先温柔亲切女声，避开 Siri / Ting-Ting 等偏机械音色 */
const TUTOR_PREFERRED_VOICE_PATTERNS = [
  /xiaoxiao|晓晓|xiaoxiao.*neural/i,
  /xiaoyi|晓伊|xiaoyi.*neural/i,
  /xiaomeng|晓梦|xiaomeng.*neural/i,
  /xiaorui|晓睿|xiaorui.*neural/i,
  /yaoyao|瑶瑶/i,
  /meijia|美嘉/i,
  /huihui|慧慧/i,
  /yushu|语舒/i,
  /lili|丽丽/i,
  /yun.*(female|女)/i,
  /zh-cn.*female/i,
  /neural.*zh-cn/i,
]

const TUTOR_AVOID_VOICE_PATTERNS = [
  /siri/i,
  /compact/i,
  /enhanced.*male/i,
  /daniel|alex|david|tom|fred|junior|grandpa|grandma|albert|bruce|gordon|karen(?!.*zh)/i,
  /li-?mu|李牧/i,
  /sin-?ji|粤语|cantonese|hong.?kong|\bhk\b/i,
  /google.*english|en-us|en-gb/i,
]

const AVOID_VOICE_PATTERNS = [
  /siri/i,
  /compact/i,
  /enhanced.*male/i,
  /male/i,
  /daniel|alex|david|tom|fred|junior|grandpa|grandma|albert|bruce|gordon|karen(?!.*zh)/i,
]

let preferredVoice = null
let tutorPreferredVoice = null
let tutorSpeakSession = 0

function voiceLabel(voice) {
  return `${voice.name} ${voice.voiceURI}`.toLowerCase()
}

function scoreVoice(voice) {
  const lang = (voice.lang || '').toLowerCase()
  if (!lang.startsWith('zh')) return -1

  const label = voiceLabel(voice)
  if (AVOID_VOICE_PATTERNS.some((pattern) => pattern.test(label))) return -1

  let score = 10
  PREFERRED_VOICE_PATTERNS.forEach((pattern, index) => {
    if (pattern.test(label)) score += 120 - index * 8
  })

  if (voice.localService) score += 6
  if (lang === 'zh-cn') score += 4
  if (/premium|neural|natural/.test(label)) score += 8

  return score
}

function scoreTutorVoice(voice) {
  const lang = (voice.lang || '').toLowerCase()
  if (!lang.startsWith('zh')) return -1

  const label = voiceLabel(voice)
  if (TUTOR_AVOID_VOICE_PATTERNS.some((pattern) => pattern.test(label))) return -1

  let score = 12

  TUTOR_PREFERRED_VOICE_PATTERNS.forEach((pattern, index) => {
    if (pattern.test(label)) score += 140 - index * 6
  })

  if (/neural|natural|online|premium/.test(label)) score += 18
  if (voice.localService) score += 4
  if (lang === 'zh-cn') score += 8
  if (/female|女/.test(label)) score += 10

  return score
}

function pickChildFriendlyVoice(voices) {
  const ranked = voices
    .map((voice) => ({ voice, score: scoreVoice(voice) }))
    .filter((item) => item.score >= 0)
    .sort((a, b) => b.score - a.score)

  return ranked[0]?.voice ?? null
}

function pickTutorVoice(voices) {
  const ranked = voices
    .map((voice) => ({ voice, score: scoreTutorVoice(voice) }))
    .filter((item) => item.score >= 0)
    .sort((a, b) => b.score - a.score)

  if (ranked[0]?.voice) return ranked[0].voice

  const softRanked = voices
    .map((voice) => {
      const lang = (voice.lang || '').toLowerCase()
      if (!lang.startsWith('zh')) return { voice, score: -1 }

      const label = voiceLabel(voice)
      if (/siri|compact|male|男/i.test(label)) return { voice, score: -1 }

      let score = 6
      if (/meijia|yaoyao|huihui|xiaoxiao|xiaoyi|ting-?ting|婷婷|female|女|neural|natural/.test(label)) {
        score += 24
      }
      return { voice, score }
    })
    .filter((item) => item.score >= 0)
    .sort((a, b) => b.score - a.score)

  return softRanked[0]?.voice ?? voices.find((voice) => voice.lang?.toLowerCase().startsWith('zh')) ?? null
}

function refreshPreferredVoice() {
  if (!('speechSynthesis' in window)) return null
  const voices = window.speechSynthesis.getVoices()
  preferredVoice = pickChildFriendlyVoice(voices)
  tutorPreferredVoice = pickTutorVoice(voices)
  return preferredVoice
}

export function initVoiceReminder() {
  if (!('speechSynthesis' in window)) return () => {}

  refreshPreferredVoice()

  const handleVoicesChanged = () => {
    refreshPreferredVoice()
  }

  window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged)

  return () => {
    window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged)
  }
}

function applyChildFriendlyVoice(utterance) {
  utterance.lang = preferredVoice?.lang || 'zh-CN'
  utterance.rate = 0.82
  utterance.pitch = 1.12
  utterance.volume = 0.92

  if (preferredVoice) {
    utterance.voice = preferredVoice
  }
}

function applyTutorVoice(utterance) {
  refreshPreferredVoice()
  utterance.lang = tutorPreferredVoice?.lang || 'zh-CN'
  utterance.rate = 0.76
  utterance.pitch = 1.05
  utterance.volume = 1

  if (tutorPreferredVoice) {
    utterance.voice = tutorPreferredVoice
  }
}

export function speakText(text) {
  if (!('speechSynthesis' in window) || !text) return

  if (!preferredVoice) refreshPreferredVoice()

  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  applyChildFriendlyVoice(utterance)
  window.speechSynthesis.speak(utterance)
}

export function cancelTutorSpeech() {
  tutorSpeakSession += 1
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel()
  }
}

/** 在用户点击时同步调用，预热语音引擎 */
export function primeTutorSpeechOnGesture() {
  if (!('speechSynthesis' in window)) return

  refreshPreferredVoice()

  if (window.speechSynthesis.paused) {
    window.speechSynthesis.resume()
  }
}

function normalizeTutorSpeechText(text) {
  return text
    .replace(/\n/g, '，')
    .replace(/[「」]/g, '')
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '')
    .trim()
}

/** AI 学习专用：温柔亲切女声，语速略慢 */
export function speakTutorText(text, { onEnd } = {}) {
  if (!('speechSynthesis' in window) || !text) return

  const spoken = normalizeTutorSpeechText(text)
  if (!spoken) {
    onEnd?.()
    return
  }

  const session = ++tutorSpeakSession

  const runSpeak = (retry = 0) => {
    if (session !== tutorSpeakSession) return

    refreshPreferredVoice()
    const voices = window.speechSynthesis.getVoices()
    if (!voices.length && retry < 8) {
      window.setTimeout(() => runSpeak(retry + 1), 60)
      return
    }

    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume()
    }

    const utterance = new SpeechSynthesisUtterance(spoken)
    applyTutorVoice(utterance)
    utterance.onend = () => {
      if (session === tutorSpeakSession) onEnd?.()
    }
    utterance.onerror = () => {
      if (session === tutorSpeakSession) onEnd?.()
    }
    window.speechSynthesis.speak(utterance)
  }

  const wasBusy = window.speechSynthesis.speaking || window.speechSynthesis.pending
  window.speechSynthesis.cancel()

  if (wasBusy) {
    window.setTimeout(() => runSpeak(), 50)
  } else {
    runSpeak()
  }
}

export function speakModeVoice(mode, type = 'reminder', intervalMinutes = 25) {
  let text = type === 'complete' ? mode.voiceComplete : mode.voiceReminder

  if (mode.id === 'study') {
    text =
      type === 'complete'
        ? '你真棒，完成一轮学习啦，休息一下吧。'
        : `你已经学习${intervalMinutes}分钟啦，休息一下吧。`
  }

  speakText(text)
}

export function speakRestStart() {
  speakText('休息五分钟，慢慢放松一下。')
}

export function speakNextRound() {
  speakText('开始下一轮，继续加油哦。')
}

export function getActiveVoiceName() {
  return preferredVoice?.name ?? null
}

export function getTutorVoiceName() {
  return tutorPreferredVoice?.name ?? null
}
