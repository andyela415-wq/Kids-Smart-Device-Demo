import { useEffect, useState } from 'react'
import { resolveRoundSeconds } from '../../utils/timeFormat'

const CUSTOM_ROUND_PRESETS = [5, 10, 20]
const MODES_WITHOUT_ROUND = ['study', 'read']
const MODES_WITH_DURATION_PRESETS = ['study', 'read']

function isCustomPreset(value, presets) {
  return !presets.includes(value)
}

export default function ModeSetup({ mode, modeId, config, onChange, onStart, onBack }) {
  const durationPresets = mode.durationPresets || []
  const showDurationPresets = MODES_WITH_DURATION_PRESETS.includes(modeId)
  const showRoundInterval = modeId === 'custom' || modeId === 'water'
  const roundOptional = modeId === 'custom'
  const roundEnabled = modeId === 'water' || (modeId === 'custom' && config.enableCustomRoundInterval)

  const [intervalInput, setIntervalInput] = useState(
    String(modeId === 'custom' ? config.customInterval : config.intervalMinutes),
  )
  const [durationInput, setDurationInput] = useState(String(config.durationMinutes))
  const [customRoundActive, setCustomRoundActive] = useState(
    modeId === 'custom' && isCustomPreset(config.customInterval, CUSTOM_ROUND_PRESETS),
  )
  const [customDurationActive, setCustomDurationActive] = useState(
    showDurationPresets && isCustomPreset(config.durationMinutes, durationPresets),
  )

  useEffect(() => {
    setIntervalInput(
      String(modeId === 'custom' ? config.customInterval : config.intervalMinutes),
    )
    setDurationInput(String(config.durationMinutes))
    setCustomRoundActive(
      modeId === 'custom' && isCustomPreset(config.customInterval, CUSTOM_ROUND_PRESETS),
    )
    setCustomDurationActive(
      MODES_WITH_DURATION_PRESETS.includes(modeId) &&
        isCustomPreset(config.durationMinutes, mode.durationPresets || []),
    )
  }, [modeId, mode.durationPresets, config.customInterval, config.intervalMinutes, config.durationMinutes])

  const presets = modeId === 'custom' ? CUSTOM_ROUND_PRESETS : mode.intervalPresets
  const parsedInterval = Number(intervalInput)
  const parsedDuration = Number(durationInput)
  const activeInterval =
    parsedInterval >= 1 && parsedInterval <= 120
      ? parsedInterval
      : modeId === 'custom'
        ? config.customInterval
        : config.intervalMinutes
  const activeDuration =
    parsedDuration >= 1 && parsedDuration <= 180 ? parsedDuration : config.durationMinutes

  const effectiveInterval = MODES_WITHOUT_ROUND.includes(modeId)
    ? activeDuration
    : modeId === 'custom' && !roundEnabled
      ? activeDuration
      : activeInterval

  const dialMinutes = Math.round(
    resolveRoundSeconds(effectiveInterval, activeDuration) / 60,
  )

  const selectInterval = (min) => {
    setCustomRoundActive(false)
    setIntervalInput(String(min))
    if (modeId === 'custom') {
      onChange({ customInterval: min })
    } else {
      onChange({ intervalMinutes: min })
    }
  }

  const selectCustomRound = () => {
    setCustomRoundActive(true)
    const fallback = isCustomPreset(activeInterval, CUSTOM_ROUND_PRESETS) ? activeInterval : 15
    setIntervalInput(String(fallback))
    onChange({ customInterval: fallback })
  }

  const selectDuration = (min) => {
    setCustomDurationActive(false)
    setDurationInput(String(min))
    onChange({ durationMinutes: min })
  }

  const selectCustomDuration = () => {
    setCustomDurationActive(true)
    const fallback = isCustomPreset(activeDuration, durationPresets) ? activeDuration : 90
    setDurationInput(String(fallback))
    onChange({ durationMinutes: fallback })
  }

  const handleIntervalInput = (value) => {
    setIntervalInput(value)
    const num = Number(value)
    if (num >= 1 && num <= 120) {
      if (modeId === 'custom') onChange({ customInterval: num })
      else onChange({ intervalMinutes: num })
    }
  }

  const handleDurationInput = (value) => {
    setDurationInput(value)
    const num = Number(value)
    if (num >= 1 && num <= 180) {
      onChange({ durationMinutes: num })
    }
  }

  const handleStart = () => {
    const duration = Math.min(180, Math.max(1, Number(durationInput) || activeDuration))
    let patch = { durationMinutes: duration }

    if (MODES_WITHOUT_ROUND.includes(modeId)) {
      patch.intervalMinutes = duration
    } else if (modeId === 'custom') {
      patch.enableCustomRoundInterval = roundEnabled
      if (roundEnabled) {
        const interval = Math.min(120, Math.max(1, Number(intervalInput) || activeInterval))
        patch.customInterval = interval
      } else {
        patch.customInterval = duration
      }
    } else if (modeId === 'water') {
      const interval = Math.min(120, Math.max(1, Number(intervalInput) || activeInterval))
      patch.intervalMinutes = interval
    }

    onChange(patch)
    onStart(patch)
  }

  const previewText = (() => {
    if (MODES_WITHOUT_ROUND.includes(modeId)) {
      return `共 ${activeDuration} 分钟`
    }
    if (modeId === 'custom' && !roundEnabled) {
      return `共 ${activeDuration} 分钟`
    }
    return `表盘 ${dialMinutes} 分钟 · 共 ${activeDuration} 分钟`
  })()

  return (
    <main className="pomo-setup">
      <div className="pomo-setup__header">
        <span className="pomo-setup__icon">{mode.icon}</span>
        <span className="pomo-setup__title">{mode.setupTitle}</span>
      </div>

      {modeId === 'custom' && (
        <div className="pomo-setup__field">
          <label className="pomo-setup__label" htmlFor="custom-name">
            提醒名称
          </label>
          <input
            id="custom-name"
            className="pomo-setup__input"
            value={config.customName}
            maxLength={8}
            onChange={(e) => onChange({ customName: e.target.value })}
          />
        </div>
      )}

      {showRoundInterval && (
        <>
          {roundOptional && (
            <label className="pomo-setup__toggle pomo-setup__toggle--compact">
              <input
                type="checkbox"
                checked={config.enableCustomRoundInterval}
                onChange={(e) => onChange({ enableCustomRoundInterval: e.target.checked })}
              />
              <span>分轮计时（可选）</span>
            </label>
          )}

          {roundEnabled && (
            <>
              <p className="pomo-setup__label">每轮计时（表盘倒计时）</p>
              <div className="pomo-setup__presets">
                {presets.map((min) => (
                  <button
                    key={min}
                    type="button"
                    className={`pomo-setup__chip${!customRoundActive && activeInterval === min ? ' pomo-setup__chip--on' : ''}`}
                    onClick={() => selectInterval(min)}
                  >
                    {min}分
                  </button>
                ))}
                {modeId === 'custom' && (
                  <button
                    type="button"
                    className={`pomo-setup__chip${customRoundActive ? ' pomo-setup__chip--on' : ''}`}
                    onClick={selectCustomRound}
                  >
                    自定义
                  </button>
                )}
              </div>

              {modeId === 'custom' && customRoundActive && (
                <div className="pomo-setup__field">
                  <input
                    className="pomo-setup__input pomo-setup__input--short"
                    type="number"
                    min="1"
                    max="120"
                    value={intervalInput}
                    onChange={(e) => handleIntervalInput(e.target.value)}
                    aria-label="自定义每轮计时分钟"
                  />
                  <span className="pomo-setup__unit">分钟</span>
                </div>
              )}

              {modeId === 'water' && (
                <div className="pomo-setup__field">
                  <input
                    className="pomo-setup__input pomo-setup__input--short"
                    type="number"
                    min="1"
                    max="120"
                    value={intervalInput}
                    onChange={(e) => handleIntervalInput(e.target.value)}
                    aria-label="每轮计时分钟"
                  />
                  <span className="pomo-setup__unit">分钟</span>
                </div>
              )}
            </>
          )}
        </>
      )}

      {showDurationPresets ? (
        <>
          <p className="pomo-setup__label">总共用时</p>
          <div className="pomo-setup__presets">
            {durationPresets.map((min) => (
              <button
                key={min}
                type="button"
                className={`pomo-setup__chip${!customDurationActive && activeDuration === min ? ' pomo-setup__chip--on' : ''}`}
                onClick={() => selectDuration(min)}
              >
                {min}分
              </button>
            ))}
            <button
              type="button"
              className={`pomo-setup__chip${customDurationActive ? ' pomo-setup__chip--on' : ''}`}
              onClick={selectCustomDuration}
            >
              自定义
            </button>
          </div>
          {customDurationActive && (
            <div className="pomo-setup__field">
              <input
                className="pomo-setup__input pomo-setup__input--short"
                type="number"
                min="1"
                max="180"
                value={durationInput}
                onChange={(e) => handleDurationInput(e.target.value)}
                aria-label="自定义总共用时分钟"
              />
              <span className="pomo-setup__unit">分钟</span>
            </div>
          )}
        </>
      ) : (
        <div className="pomo-setup__field">
          <label className="pomo-setup__label" htmlFor="duration">
            总共用时
          </label>
          <input
            id="duration"
            className="pomo-setup__input pomo-setup__input--short"
            type="number"
            min="1"
            max="180"
            value={durationInput}
            onChange={(e) => handleDurationInput(e.target.value)}
          />
          <span className="pomo-setup__unit">分钟</span>
        </div>
      )}

      <p className="pomo-setup__preview">{previewText}</p>

      {modeId !== 'water' && (
        <label className="pomo-setup__toggle">
          <input
            type="checkbox"
            checked={config.enableWater}
            onChange={(e) => onChange({ enableWater: e.target.checked })}
          />
          <span>同时 💧 喝水提醒</span>
          {config.enableWater && (
            <select
              className="pomo-setup__select"
              value={config.waterIntervalMinutes}
              onChange={(e) =>
                onChange({ waterIntervalMinutes: Number(e.target.value) })
              }
            >
              {[10, 15, 20, 30].map((m) => (
                <option key={m} value={m}>
                  每{m}分钟
                </option>
              ))}
            </select>
          )}
        </label>
      )}

      <div className="pomo-setup__actions">
        <button type="button" className="pomo-hw-btn pomo-hw-btn--ghost" onClick={onBack}>
          返回
        </button>
        <button type="button" className="pomo-hw-btn pomo-hw-btn--primary" onClick={handleStart}>
          开始
        </button>
      </div>
    </main>
  )
}
