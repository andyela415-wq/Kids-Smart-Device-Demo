import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TomatoCharacter from '../pomodoro/TomatoCharacter'
import { useLearningGrowth } from '../../hooks/useLearningGrowth'
import { readFocusState } from '../../utils/deviceStatus'
import { readHomeModeIndex, writeHomeModeId } from '../../utils/homeMode'
import {
  BookIcon,
  CalendarIcon,
  TomatoIcon,
  StarIcon,
  ChevronIcon,
  MoonIcon,
} from './HomeModeIcons'

const MODES = [
  { id: 'ai', label: 'AI学习', Icon: BookIcon, path: '/ai' },
  { id: 'plan', label: '今日计划', Icon: CalendarIcon, path: '/plan' },
  { id: 'pomo', label: '番茄闹钟', Icon: TomatoIcon, path: '/pomodoro', mood: 'focus' },
]

function resolveHomeState() {
  const focus = readFocusState()
  if (focus?.running) {
    return {
      stateLabel: focus.paused ? '已暂停' : '专注中',
      mood: focus.paused ? 'pause' : 'focus',
      path: '/pomodoro',
      showTomato: true,
    }
  }
  return null
}

function HomeHero({ mode, focusState }) {
  if (focusState?.showTomato || mode.id === 'pomo') {
    return (
      <div className="home-face__hero-icon home-face__hero-icon--tomato">
        <TomatoCharacter
          size="lg"
          active
          mood={focusState?.mood || mode.mood || 'focus'}
        />
      </div>
    )
  }

  const Icon = mode.Icon
  return (
    <div className={`home-face__hero-icon home-face__hero-icon--${mode.id}`}>
      <Icon className="home-face__icon" />
    </div>
  )
}

export default function HomeFace() {
  const navigate = useNavigate()
  const { profile } = useLearningGrowth()
  const [modeIndex, setModeIndex] = useState(readHomeModeIndex)
  const [focusState, setFocusState] = useState(resolveHomeState)

  useEffect(() => {
    const tick = () => setFocusState(resolveHomeState())
    tick()
    const timer = window.setInterval(tick, 1000)
    return () => clearInterval(timer)
  }, [])

  const activeMode = MODES[modeIndex]
  const stateLabel = focusState?.stateLabel || activeMode.label
  const actionPath = focusState?.path || activeMode.path
  const launchLabel = focusState ? '继续专注' : `进入${activeMode.label}`

  const selectMode = (index) => {
    setModeIndex(index)
    writeHomeModeId(MODES[index].id)
  }

  const cycleMode = (dir) => {
    if (focusState) return
    setModeIndex((i) => {
      const next = (i + dir + MODES.length) % MODES.length
      writeHomeModeId(MODES[next].id)
      return next
    })
  }

  return (
    <main className="home-face">
      <button
        type="button"
        className="home-face__sleep"
        aria-label="熄屏"
        onClick={() => navigate('/standby')}
      >
        <MoonIcon className="home-face__sleep-icon" />
      </button>

      <button
        type="button"
        className="home-face__launch"
        aria-label={launchLabel}
        onClick={() => {
          writeHomeModeId(activeMode.id)
          navigate(actionPath)
        }}
      >
        <div className="home-face__hero">
          <div className="home-face__hero-wrap">
            <HomeHero mode={activeMode} focusState={focusState} />
          </div>
          <p className="home-face__state">{stateLabel}</p>
          <p className="home-face__stars" aria-label={`成长值 ${profile.points}`}>
            <StarIcon className="home-face__star-icon" />
            {profile.points}
          </p>
        </div>
      </button>

      {!focusState && (
        <div className="home-face__footer">
          <div className="home-face__nav" aria-label="切换功能">
            <button
              type="button"
              className="home-face__side home-face__side--L"
              aria-label="上一个"
              onClick={() => cycleMode(-1)}
            >
              <ChevronIcon direction="left" className="home-face__side-icon" />
            </button>
            <div className="home-face__modes">
              {MODES.map((mode, index) => {
                const Icon = mode.Icon
                return (
                  <button
                    key={mode.id}
                    type="button"
                    className={`home-face__mode-dot${index === modeIndex ? ' home-face__mode-dot--on' : ''}`}
                    aria-label={mode.label}
                    aria-current={index === modeIndex ? 'true' : undefined}
                    onClick={() => selectMode(index)}
                  >
                    <Icon className="home-face__icon" />
                  </button>
                )
              })}
            </div>
            <button
              type="button"
              className="home-face__side home-face__side--R"
              aria-label="下一个"
              onClick={() => cycleMode(1)}
            >
              <ChevronIcon direction="right" className="home-face__side-icon" />
            </button>
          </div>
        </div>
      )}
    </main>
  )
}
