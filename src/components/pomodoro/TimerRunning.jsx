import { useState } from 'react'
import GrowthStrip from '../GrowthStrip'
import ProgressRing from './ProgressRing'
import TomatoCharacter from './TomatoCharacter'
import { resolveTomatoMood } from './TomatoSvg'

function TaskBadge({ icon, title }) {
  return (
    <div className="pomo-running__badge pomo-running__badge--task">
      <span className="pomo-running__badge-icon" aria-hidden="true">
        {icon}
      </span>
      <span className="pomo-running__badge-text">{title}</span>
    </div>
  )
}

function ModeBadge({ mode, modeId }) {
  const label = modeId === 'custom' ? '自定义' : mode.label

  return (
    <div className="pomo-running__badge pomo-running__badge--mode" style={{ '--mode-color': mode.color }}>
      <span className="pomo-running__badge-icon" aria-hidden="true">
        {mode.icon}
      </span>
      <span className="pomo-running__badge-text">{label}</span>
    </div>
  )
}

function StateBadge({ isRest, isRunning }) {
  if (isRest) {
    return (
      <div className="pomo-running__badge pomo-running__badge--state pomo-running__badge--rest">
        <span className="pomo-running__badge-icon" aria-hidden="true">
          🌙
        </span>
        <span className="pomo-running__badge-text">休息</span>
      </div>
    )
  }

  if (!isRunning) {
    return (
      <div className="pomo-running__badge pomo-running__badge--state pomo-running__badge--pause">
        <span className="pomo-running__badge-icon" aria-hidden="true">
          ⏸
        </span>
        <span className="pomo-running__badge-text">暂停</span>
      </div>
    )
  }

  return (
    <div className="pomo-running__badge pomo-running__badge--state pomo-running__badge--focus">
      <span className="pomo-running__badge-icon pomo-running__badge-icon--pulse" aria-hidden="true">
        ✦
      </span>
      <span className="pomo-running__badge-text">专注</span>
    </div>
  )
}

function NextReminder({ isRest, enableWater, waterRemaining, formatTime }) {
  if (isRest) return <div className="pomo-running__next pomo-running__next--empty" aria-hidden="true" />

  if (!enableWater || waterRemaining <= 0) {
    return <div className="pomo-running__next pomo-running__next--empty" aria-hidden="true" />
  }

  return (
    <div className="pomo-running__next" aria-label={`喝水提醒 ${formatTime(waterRemaining)}`}>
      <span className="pomo-running__next-icon" aria-hidden="true">
        💧
      </span>
      <span className="pomo-running__next-time">{formatTime(waterRemaining)}</span>
    </div>
  )
}

function StarGrowth() {
  return (
    <div className="pomo-running__growth-wrap">
      <GrowthStrip compact />
    </div>
  )
}

function HardwarePauseButton({ paused, onClick }) {
  const [pressed, setPressed] = useState(false)
  const release = () => setPressed(false)

  return (
    <button
      type="button"
      className={`pomo-hw-pause pomo-hw-pause--round${pressed ? ' pomo-hw-pause--pressed' : ''}`}
      aria-label={paused ? '继续' : '暂停'}
      onMouseDown={() => setPressed(true)}
      onMouseUp={release}
      onMouseLeave={release}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={release}
      onTouchCancel={release}
      onClick={onClick}
    >
      <span className="pomo-hw-pause__bezel">
        <span className="pomo-hw-pause__icon" aria-hidden="true">
          {paused ? '▶' : '⏸'}
        </span>
      </span>
    </button>
  )
}

export default function TimerRunning({
  mode,
  modeId,
  scheduleTaskTitle,
  scheduleTaskIcon,
  phase,
  isRunning,
  roundRemaining,
  roundTotal,
  roundProgress,
  waterRemaining,
  restRemaining,
  restTotal,
  config = { enableWater: false },
  formatTime,
  onPause,
  onResume,
}) {
  const isRest = phase === 'rest'
  const displayTime = isRest ? formatTime(restRemaining) : formatTime(roundRemaining)
  const progress = isRest
    ? restTotal > 0
      ? 1 - restRemaining / restTotal
      : 0
    : roundProgress

  const mood = resolveTomatoMood({
    isRest,
    isRunning,
    roundRemaining,
    roundTotal,
    progress,
  })

  const showScheduleTask = Boolean(scheduleTaskTitle)

  return (
    <main className="pomo-running">
      <header className="pomo-running__head">
        {showScheduleTask ? (
          <TaskBadge icon={scheduleTaskIcon || mode.icon} title={scheduleTaskTitle} />
        ) : (
          <ModeBadge mode={mode} modeId={modeId} />
        )}
        <StateBadge isRest={isRest} isRunning={isRunning} />
      </header>

      <div className="pomo-running__stage">
        <div className={`pomo-running__dial${isRunning ? ' pomo-running__dial--live' : ''}`}>
          <ProgressRing progress={progress} running={isRunning} showDot />
          <div className="pomo-running__dial-core">
            <TomatoCharacter active={isRunning} size="md" mood={mood} />
            <span className="pomo-running__time">{displayTime}</span>
          </div>
        </div>
      </div>

      <footer className="pomo-running__bar">
        <NextReminder
          isRest={isRest}
          enableWater={config.enableWater}
          waterRemaining={waterRemaining}
          formatTime={formatTime}
        />
        <StarGrowth />
        <HardwarePauseButton
          paused={!isRunning}
          onClick={isRunning ? onPause : onResume}
        />
      </footer>
    </main>
  )
}
