import { useCallback, useEffect, useRef, useState } from 'react'
import AiTeacherAvatar from './AiTeacherAvatar'
import {
  createMessage,
  INITIAL_CHAT,
  QUICK_PROMPTS,
  resolveAiResponse,
} from '../../config/tutoringChat'
import { renderHighlightedText } from '../../utils/chatTextHighlight'
import {
  cancelTutorSpeech,
  primeTutorSpeechOnGesture,
  speakTutorText,
} from '../../utils/voiceReminder'

const THINKING_MS = 1500
const TYPE_MS = 32
const VOICE_LISTEN_MS = 3000
const VOICE_SIMULATED_TEXT = '我想听听秋天的雨是怎么写的'

function QuickPrompt({ label, onClick, disabled }) {
  return (
    <button
      type="button"
      className="tutor-chat__prompt"
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  )
}

function ListenWaveform() {
  return (
    <div className="tutor-chat__listen-wave" aria-hidden="true">
      <div />
      <div />
      <div />
      <div />
      <div />
    </div>
  )
}

function ThinkingBubble() {
  return (
    <div className="tutor-chat__thinking" aria-live="polite">
      <div className="tutor-chat__avatar-col">
        <AiTeacherAvatar size="sm" active={false} />
        <span className="tutor-chat__avatar-name">小老师</span>
      </div>
      <div className="tutor-chat__thinking-bubble">
        <span className="tutor-chat__thinking-text">
          AI小老师正在思考中... 💬
          <span className="tutor-chat__thinking-cursor" aria-hidden="true">
            |
          </span>
        </span>
      </div>
    </div>
  )
}

function AiMessage({ message, typedLength, onReplay }) {
  const visibleText = message.text.slice(0, typedLength)
  const isTyping = typedLength < message.text.length

  return (
    <article className="tutor-chat__msg tutor-chat__msg--ai">
      <div className="tutor-chat__msg-row">
        <div className="tutor-chat__avatar-col">
          <AiTeacherAvatar size="sm" active={!isTyping} />
          <span className="tutor-chat__avatar-name">小老师</span>
        </div>
        <div className="tutor-chat__msg-body">
          <div className="tutor-chat__msg-bubble tutor-chat__msg-bubble--ai">
            <p className="tutor-chat__msg-text">
              {renderHighlightedText(visibleText)}
              {isTyping && (
                <span className="tutor-chat__typing-cursor" aria-hidden="true">
                  |
                </span>
              )}
            </p>
          </div>
          {!isTyping && onReplay && (
            <button
              type="button"
              className="tutor-chat__replay"
              aria-label="再听一遍"
              onClick={() => onReplay(message.text)}
            >
              🔊 再听一遍
            </button>
          )}
        </div>
      </div>
    </article>
  )
}

function ChildMessage({ message }) {
  return (
    <article className="tutor-chat__msg tutor-chat__msg--child">
      <span className="tutor-chat__msg-badge">我</span>
      <div className="tutor-chat__msg-bubble tutor-chat__msg-bubble--child">
        <p className="tutor-chat__msg-text">{message.text}</p>
      </div>
    </article>
  )
}

export default function ChatLearning() {
  const [messages, setMessages] = useState(INITIAL_CHAT)
  const [inputText, setInputText] = useState('')
  const [thinking, setThinking] = useState(false)
  const [typingId, setTypingId] = useState(null)
  const [typedLength, setTypedLength] = useState(0)
  const [listening, setListening] = useState(false)
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [isSpeaking, setIsSpeaking] = useState(false)

  const scrollRef = useRef(null)
  const thinkTimerRef = useRef(null)
  const typeTimerRef = useRef(null)
  const micTimerRef = useRef(null)
  const isAudioEnabledRef = useRef(true)

  useEffect(() => {
    isAudioEnabledRef.current = isAudioEnabled
  }, [isAudioEnabled])

  useEffect(() => {
    setIsAudioEnabled(true)
    isAudioEnabledRef.current = true
  }, [])

  const isBusy = thinking || typingId !== null || listening

  const scrollToBottom = useCallback(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, thinking, typedLength, listening, scrollToBottom])

  useEffect(() => {
    return () => {
      if (thinkTimerRef.current) clearTimeout(thinkTimerRef.current)
      if (typeTimerRef.current) clearInterval(typeTimerRef.current)
      if (micTimerRef.current) clearTimeout(micTimerRef.current)
      cancelTutorSpeech()
    }
  }, [])

  const enableAudioForNextReply = useCallback(() => {
    setIsAudioEnabled(true)
    isAudioEnabledRef.current = true
  }, [])

  const playAiSpeech = useCallback((text) => {
    if (!isAudioEnabledRef.current) return

    setIsSpeaking(true)
    speakTutorText(text, {
      onEnd: () => setIsSpeaking(false),
    })
  }, [])

  const replayAiSpeech = useCallback((text) => {
    enableAudioForNextReply()
    primeTutorSpeechOnGesture()
    playAiSpeech(text)
  }, [enableAudioForNextReply, playAiSpeech])

  const handleToggleAudio = () => {
    if (isAudioEnabled) {
      isAudioEnabledRef.current = false
      setIsAudioEnabled(false)
      setIsSpeaking(false)
      cancelTutorSpeech()
      return
    }

    enableAudioForNextReply()
  }

  const startTypewriter = useCallback(
    (message) => {
      setTypingId(message.id)
      setTypedLength(0)

      if (typeTimerRef.current) clearInterval(typeTimerRef.current)

      typeTimerRef.current = window.setInterval(() => {
        setTypedLength((prev) => {
          const next = prev + 1
          if (next >= message.text.length) {
            clearInterval(typeTimerRef.current)
            typeTimerRef.current = null
            setTypingId(null)
          }
          return Math.min(next, message.text.length)
        })
      }, TYPE_MS)
    },
    [],
  )

  const submitUserText = useCallback(
    (rawText, { bypassBusy = false } = {}) => {
      const text = rawText.trim()
      if (!text) return
      if (!bypassBusy && (thinking || typingId !== null || listening)) return

      const answer = resolveAiResponse(text)
      if (!answer) return

      enableAudioForNextReply()
      primeTutorSpeechOnGesture()
      setInputText('')
      setMessages((prev) => [...prev, createMessage('child', text)])
      setThinking(true)

      if (isAudioEnabledRef.current) {
        playAiSpeech(answer)
      }

      if (thinkTimerRef.current) clearTimeout(thinkTimerRef.current)
      thinkTimerRef.current = window.setTimeout(() => {
        const aiMessage = createMessage('ai', answer)
        setMessages((prev) => [...prev, aiMessage])
        setThinking(false)
        startTypewriter(aiMessage)
      }, THINKING_MS)
    },
    [thinking, typingId, listening, startTypewriter, enableAudioForNextReply, playAiSpeech],
  )

  const handleSend = () => submitUserText(inputText)

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSend()
    }
  }

  const handleMic = () => {
    if (thinking || typingId !== null || listening) return

    setListening(true)
    setInputText('')

    if (micTimerRef.current) clearTimeout(micTimerRef.current)
    micTimerRef.current = window.setTimeout(() => {
      setListening(false)
      setInputText(VOICE_SIMULATED_TEXT)
      submitUserText(VOICE_SIMULATED_TEXT, { bypassBusy: true })
    }, VOICE_LISTEN_MS)
  }

  const inputPlaceholder = listening ? '请说话...' : '问问 AI 小老师吧...'

  const statusText = listening
    ? '正在听你说话…'
    : thinking
      ? '想一想…'
      : typingId
        ? '正在回复…'
        : isSpeaking
          ? '正在陪你读'
          : '随时问我哦'

  return (
    <main className="tutor-chat">
      <header className="tutor-chat__teacher">
        <AiTeacherAvatar size="md" active={!isBusy} />
        <div className="tutor-chat__teacher-info">
          <div className="tutor-chat__teacher-title-row">
            <p className="tutor-chat__teacher-name">AI 小老师</p>
            <button
              type="button"
              className={`tutor-chat__audio-toggle${isAudioEnabled ? ' tutor-chat__audio-toggle--on' : ''}`}
              aria-label={isAudioEnabled ? '关闭当前语音' : '开启语音播报'}
              aria-pressed={isAudioEnabled}
              onClick={handleToggleAudio}
            >
              {isAudioEnabled ? '🔊' : '🔇'}
            </button>
          </div>
          <p className="tutor-chat__teacher-status">
            <span className="tutor-chat__status-dot" aria-hidden="true" />
            {statusText}
          </p>
        </div>
      </header>

      <div className="tutor-chat__screen">
        <div className="tutor-chat__messages chat-messages" ref={scrollRef}>
          {messages.map((message) => {
            if (message.role === 'ai') {
              const length =
                message.id === typingId ? typedLength : message.text.length
              return (
                <AiMessage
                  key={message.id}
                  message={message}
                  typedLength={length}
                  onReplay={isAudioEnabled ? replayAiSpeech : undefined}
                />
              )
            }
            return <ChildMessage key={message.id} message={message} />
          })}
          {thinking && <ThinkingBubble />}
        </div>
      </div>

      <footer className="tutor-chat__composer">
        <div className="tutor-chat__prompts-scroll" aria-label="快捷问题">
          <div className="tutor-chat__prompts-track">
            {QUICK_PROMPTS.map((item) => (
              <QuickPrompt
                key={item.id}
                label={item.label}
                disabled={isBusy}
                onClick={() => submitUserText(item.text)}
              />
            ))}
          </div>
        </div>

        {listening && (
          <div className="tutor-chat__listen-bar" aria-live="polite">
            <ListenWaveform />
            <span className="tutor-chat__listen-text">正在倾听你的声音…</span>
          </div>
        )}

        <div className="tutor-chat__input-row">
          <button
            type="button"
            className={`tutor-chat__mic-btn${listening ? ' tutor-chat__mic-btn--live' : ''}`}
            aria-label={listening ? '正在倾听' : '语音输入'}
            disabled={thinking || typingId !== null || listening}
            onClick={handleMic}
          >
            🎙️
          </button>
          <input
            type="text"
            className="tutor-chat__input"
            placeholder={inputPlaceholder}
            value={inputText}
            disabled={isBusy}
            onChange={(event) => setInputText(event.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            type="button"
            className="tutor-chat__send-btn"
            aria-label="发送"
            disabled={isBusy || !inputText.trim()}
            onClick={handleSend}
          >
            发送
          </button>
        </div>
      </footer>
    </main>
  )
}
