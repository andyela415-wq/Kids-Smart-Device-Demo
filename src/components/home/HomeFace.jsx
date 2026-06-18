import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PomodoroDailyFocusSummary from '../pomodoro/PomodoroDailyFocusSummary'
import TomatoCharacter from '../pomodoro/TomatoCharacter'
import { useLearningGrowth } from '../../hooks/useLearningGrowth'
import { readFocusState } from '../../utils/deviceStatus'
import { readHomeModeIndex, writeHomeModeId } from '../../utils/homeMode'
import { clearPomodoroReturnTo } from '../../utils/pomodoroReturn'
import {
  BookIcon,
  CalendarIcon,
  TomatoIcon,
  StarIcon,
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
    const phaseLabel =
      focus.phase === 'break' ? '休息中' : focus.paused ? '已暂停' : '专注中'

    return {
      stateLabel: phaseLabel,
      mood: focus.phase === 'break' ? 'rest' : focus.paused ? 'pause' : 'focus',
      path: '/pomodoro',
      showTomato: true,
    }
  }
  return null
}

function HomeHero({ mode, focusState }) {
  if (focusState?.showTomato || mode.id === 'pomo') {
    return (
      <div className="home-face__hero-badge home-face__hero-badge--tomato">
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
    <div className={`home-face__hero-badge home-face__hero-badge--${mode.id}`}>
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

  const showDailySummary = activeMode.id === 'pomo' || Boolean(focusState?.showTomato)
  const showTabBar = !focusState

  return (
    <div className={`home-screen${showDailySummary ? ' home-screen--pomo' : ''}`}>
      <header className="home-face__topbar">
        <span className="home-face__topbar-spacer" aria-hidden="true" />
        <button
          type="button"
          className="home-face__sleep"
          aria-label="熄屏"
          onClick={() => navigate('/standby')}
        >
          <MoonIcon className="home-face__sleep-icon" />
        </button>
      </header>

      <div className="home-screen__main">
        <button
          type="button"
          className="home-face__launch"
          aria-label={launchLabel}
          onClick={() => {
            writeHomeModeId(activeMode.id)
            if (actionPath === '/pomodoro') {
              clearPomodoroReturnTo()
            }
            navigate(actionPath)
          }}
        >
          <div className="home-face__hero">
            <HomeHero mode={activeMode} focusState={focusState} />
            <p className="home-face__state">{stateLabel}</p>
            <p className="home-face__stars" aria-label={`成长值 ${profile.points}`}>
              <StarIcon className="home-face__star-icon" />
              {profile.points}
            </p>
          </div>
        </button>

        {showDailySummary && <PomodoroDailyFocusSummary variant="home" />}
      </div>

      {showTabBar && (
        <nav className="tab-bar" aria-label="切换功能">
          {MODES.map((mode, index) => {
            const Icon = mode.Icon
            const isActive = index === modeIndex
            return (
              <button
                key={mode.id}
                type="button"
                className={`tab-item${isActive ? ' active' : ''}`}
                aria-label={mode.label}
                aria-current={isActive ? 'true' : undefined}
                onClick={() => selectMode(index)}
              >
                <Icon className="tab-item__icon" aria-hidden="true" />
              </button>
            )
          })}
        </nav>
      )}
    </div>
  )
}
