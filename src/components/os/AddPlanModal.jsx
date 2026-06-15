import { useEffect, useState } from 'react'
import TimeRoller from './TimeRoller'

export const QUICK_PLAN_PRESETS = [
  { id: 'reading', title: '课外阅读', icon: '📚', type: 'study' },
  { id: 'sport', title: '运动打卡', icon: '🏃‍♂️', type: 'routine' },
  { id: 'homework', title: '写作业', icon: '✍️', type: 'study' },
  { id: 'sleep-prep', title: '睡觉准备', icon: '🌙', type: 'routine' },
]

export const OTHER_PLAN_PRESET = {
  id: 'other',
  title: '我的计划',
  icon: '🌟',
  type: 'routine',
}

const DEFAULT_TIME = { hour: 20, minute: 0 }

function padTime(hour, minute) {
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
}

export default function AddPlanModal({ open, onClose, onSelect }) {
  const [step, setStep] = useState('pick')
  const [pendingPreset, setPendingPreset] = useState(null)
  const [hour, setHour] = useState(DEFAULT_TIME.hour)
  const [minute, setMinute] = useState(DEFAULT_TIME.minute)

  useEffect(() => {
    if (!open) {
      setStep('pick')
      setPendingPreset(null)
      setHour(DEFAULT_TIME.hour)
      setMinute(DEFAULT_TIME.minute)
    }
  }, [open])

  if (!open) return null

  const handlePickPreset = (preset) => {
    if (preset.id === 'other') {
      setPendingPreset(OTHER_PLAN_PRESET)
      setStep('time')
      return
    }

    onSelect({
      ...preset,
      startTime: '20:00',
    })
  }

  const handleConfirmTime = () => {
    if (!pendingPreset) return
    onSelect({
      ...pendingPreset,
      startTime: padTime(hour, minute),
    })
  }

  return (
    <div className="os-add-plan" role="dialog" aria-modal="true" aria-label="添加新计划">
      <button type="button" className="os-add-plan__backdrop" aria-label="关闭" onClick={onClose} />

      {step === 'pick' ? (
        <div className="os-add-plan__panel">
          <h2 className="os-add-plan__title">添加新计划 🌟</h2>
          <div className="os-add-plan__grid os-add-plan__grid--five">
            {QUICK_PLAN_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                className="os-add-plan__card"
                onClick={() => handlePickPreset(preset)}
              >
                <span className="os-add-plan__card-icon" aria-hidden="true">
                  {preset.icon}
                </span>
                <span className="os-add-plan__card-label">{preset.title}</span>
              </button>
            ))}
            <button
              type="button"
              className="os-add-plan__card os-add-plan__card--other"
              onClick={() => handlePickPreset(OTHER_PLAN_PRESET)}
            >
              <span className="os-add-plan__card-icon" aria-hidden="true">
                🌟
              </span>
              <span className="os-add-plan__card-label">其他</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="os-add-plan__panel os-add-plan__panel--time">
          <h2 className="os-add-plan__title">设定时间 ⏰</h2>
          <p className="os-add-plan__subtitle">
            {pendingPreset?.icon} {pendingPreset?.title}
          </p>

          <div className="os-add-plan__time-row">
            <TimeRoller min={0} max={23} value={hour} onChange={setHour} label="时" />
            <span className="os-add-plan__time-colon">:</span>
            <TimeRoller min={0} max={59} value={minute} onChange={setMinute} label="分" />
          </div>

          <div className="os-add-plan__time-actions">
            <button
              type="button"
              className="os-add-plan__btn os-add-plan__btn--ghost"
              onClick={() => setStep('pick')}
            >
              返回
            </button>
            <button
              type="button"
              className="os-add-plan__btn os-add-plan__btn--primary"
              onClick={handleConfirmTime}
            >
              确定
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
